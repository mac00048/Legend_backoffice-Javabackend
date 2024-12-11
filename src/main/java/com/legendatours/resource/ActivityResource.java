package com.legendatours.resource;

import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.time.OffsetDateTime;
import java.util.Collections;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import javax.annotation.security.PermitAll;
import javax.imageio.ImageIO;
import javax.servlet.http.HttpSession;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.DefaultValue;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import org.jdbi.v3.core.Jdbi;

import com.codahale.metrics.annotation.Timed;
import com.legendatours.beans.Activity;
import com.legendatours.beans.Document;
import com.legendatours.beans.File;
import com.legendatours.beans.Image;
import com.legendatours.beans.User;
import com.legendatours.dao.ActivityDao;
import com.legendatours.dao.FileDao;
import com.legendatours.dao.UserDao;

import io.dropwizard.jersey.sessions.Session;

@Timed
@PermitAll
@Path("/activity")
public class ActivityResource {
    private final Jdbi jdbi;

    public ActivityResource(final Jdbi jdbi) {
        this.jdbi = jdbi;
    }

    @GET
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response get(@PathParam("id") final UUID id) {
        final Activity activity = jdbi.onDemand(ActivityDao.class).get(id);

        if (activity == null) {
            return Response.status(Status.NOT_FOUND).build();
        }

        return Response.ok(wrapMeta(activity)).build();
    }

    @GET
    @Path("/")
    @Produces(MediaType.APPLICATION_JSON)
    public Response list(
            @QueryParam("q") @DefaultValue("") final String query,
            @QueryParam("orderBy") @DefaultValue("title") final String orderBy,
            @QueryParam("order") @DefaultValue("ASC") final String order) {
        final List<Activity> activities = jdbi.onDemand(ActivityDao.class).list(query, orderBy, order);
        return Response.ok(wrapMeta(activities)).build();
    }

    @POST
    @Path("/")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response create(final Activity activity, @Session HttpSession session) {
        final Activity wrappedActivity = wrapCreate(wrapImages(wrapDocuments(activity)), session);
        jdbi.onDemand(ActivityDao.class).insert(wrappedActivity);
        return get(wrappedActivity.getId());
    }

    @PUT
    @Path("/{id}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response update(@PathParam("id") final UUID id, final Activity activity, @Session HttpSession session) {
        final Activity oldActivity = jdbi.onDemand(ActivityDao.class).get(id);

        if (oldActivity == null) {
            return Response.status(Status.NOT_FOUND).build();
        }

        final Activity wrappedActivity = wrapUpdate(oldActivity, wrapImages(wrapDocuments(activity)), session);
        jdbi.onDemand(ActivityDao.class).update(wrappedActivity);

        return get(id);
    }

    @DELETE
    @Path("/{id}")
    public Response delete(@PathParam("id") final UUID id, @Session HttpSession session) {
        final Activity activity = jdbi.onDemand(ActivityDao.class).get(id);

        if (activity == null) {
            return Response.status(Status.NOT_FOUND).build();
        }

        final Activity wrappedActivity = wrapDeleted(activity, session);
        jdbi.onDemand(ActivityDao.class).delete(wrappedActivity);

        return Response.noContent().build();
    }

    //
    // Helpers
    //

    private Activity wrapDocuments(final Activity activity) {
        final List<Document> documents = activity.getDocuments() != null
                ? activity.getDocuments().stream()
                        .map(doc -> {
                            if (doc.getFileId() == null) {
                                // Log and skip documents with null fileId
                                System.err.println("Document has null fileId and will be skipped.");
                                return null;
                            }
    
                            final File file = jdbi.onDemand(FileDao.class).get(doc.getFileId());
    
                            if (file == null) {
                                // Log and skip the document if the file is not found in the database
                                System.err.println("File not found for fileId: " + doc.getFileId());
                                return null;
                            }
    
                            String type = file.getName().contains(".")
                                    ? file.getName().substring(file.getName().lastIndexOf('.') + 1)
                                    : "";
    
                            // Ensure content is not null to calculate size
                            long size = (file.getContent() != null) ? file.getContent().length : 0L;
    
                            return new Document(
                                    file.getId(),   // UUID fileId
                                    file.getName(), // String title
                                    type,           // String type (e.g., pdf, doc)
                                    size            // Long size (fallback to 0 if content is null)
                            );
                        })
                        .filter(java.util.Objects::nonNull) // Remove null entries
                        .collect(Collectors.toList())
                : Collections.emptyList(); // Fallback to an empty list if documents is null
    
        return new Activity(
                activity.getId(),
                activity.getTitle(),
                activity.getSubtitle(),
                activity.getDescription(),
                activity.getImages(),
                documents, // Use the updated list of Document objects
                activity.getCreatedAt(),
                activity.getCreatedBy(),
                activity.getUpdatedAt(),
                activity.getUpdatedBy(),
                activity.getDeletedAt(),
                activity.getDeletedBy());
    }
       
    private Activity wrapCreate(final Activity activity, final HttpSession session) {
        final UUID id = UUID.randomUUID();
        final OffsetDateTime createdAt = OffsetDateTime.now();
        final UUID createdBy = (UUID) session.getAttribute("user");

        return new Activity(
                id,
                activity.getTitle(),
                activity.getSubtitle(),
                activity.getDescription(),
                activity.getImages(),
                activity.getDocuments(),
                createdAt,
                createdBy);
    }

    private Activity wrapUpdate(final Activity oldActivity, final Activity update, final HttpSession session) {
        final OffsetDateTime updatedAt = OffsetDateTime.now();
        final UUID updatedBy = (UUID) session.getAttribute("user");
    
        // Merge images
        final List<Image> images = update.getImages() != null && !update.getImages().isEmpty()
                ? update.getImages()
                : oldActivity.getImages();
    
        // Merge documents
        final List<Document> documents = update.getDocuments() != null && !update.getDocuments().isEmpty()
                ? update.getDocuments()
                : oldActivity.getDocuments();
    
        // Create a new Activity instance with merged data
        return new Activity(
                oldActivity.getId(),
                update.getTitle() != null ? update.getTitle() : oldActivity.getTitle(),
                update.getSubtitle() != null ? update.getSubtitle() : oldActivity.getSubtitle(),
                update.getDescription() != null ? update.getDescription() : oldActivity.getDescription(),
                images,
                documents,
                oldActivity.getCreatedAt(),
                oldActivity.getCreatedBy(),
                updatedAt,
                updatedBy
        );
    }
    

    private Activity wrapDeleted(final Activity activity, final HttpSession session) {
        final OffsetDateTime deletedAt = OffsetDateTime.now();
        final UUID deletedBy = (UUID) session.getAttribute("user");

        return new Activity(
                activity.getId(),
                activity.getTitle(),
                activity.getSubtitle(),
                activity.getDescription(),
                activity.getImages(),
                activity.getDocuments(), // Include documents in delete
                activity.getCreatedAt(),
                activity.getCreatedBy(),
                activity.getUpdatedAt(),
                activity.getUpdatedBy(),
                deletedAt,
                deletedBy);
    }

    private Activity wrapImages(final Activity activity) {

        final List<Image> images = activity.getImages() != null
                ? activity.getImages().stream()
                        .map(image -> {
                            int width, height;
                            String type;

                            final File file = jdbi.onDemand(FileDao.class).get(image.getFileId());

                            try {
                                final BufferedImage img = ImageIO.read(new ByteArrayInputStream(file.getContent()));
                                width = img.getWidth();
                                height = img.getHeight();
                            } catch (final IOException e) {
                                width = height = 0;
                            }

                            type = file.getName().contains(".")
                                    ? file.getName().substring(file.getName().lastIndexOf('.'))
                                    : "";

                            return new Image(
                                    image.getFileId(),
                                    image.getTitle(),
                                    width,
                                    height,
                                    type);
                        })
                        .collect(Collectors.toList())
                : Collections.emptyList();

        return new Activity(
                activity.getId(),
                activity.getTitle(),
                activity.getSubtitle(),
                activity.getDescription(),
                images,
                activity.getDocuments(),
                activity.getCreatedAt(),
                activity.getCreatedBy(),
                activity.getUpdatedAt(),
                activity.getUpdatedBy(),
                activity.getDeletedAt(),
                activity.getDeletedBy());
    }

    private List<Activity> wrapMeta(final List<Activity> activities) {
        return activities.stream()
                .map(this::wrapMeta)
                .collect(Collectors.toList());
    }

    private Activity wrapMeta(final Activity activity) {
        if (activity.getCreatedBy() != null) {
            final User user = jdbi.onDemand(UserDao.class).get(activity.getCreatedBy());
            activity.getMeta().put("createdByName", user.getName());
        }

        if (activity.getUpdatedBy() != null) {
            final User user = jdbi.onDemand(UserDao.class).get(activity.getUpdatedBy());
            activity.getMeta().put("updatedByName", user.getName());
        }

        if (activity.getDeletedBy() != null) {
            final User user = jdbi.onDemand(UserDao.class).get(activity.getDeletedBy());
            activity.getMeta().put("deletedByName", user.getName());
        }

        return activity;
    }
}

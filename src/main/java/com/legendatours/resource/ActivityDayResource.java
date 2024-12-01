package com.legendatours.resource;

import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.UUID;
import java.util.stream.Collectors;

import javax.annotation.security.PermitAll;
import javax.imageio.ImageIO;
import javax.servlet.http.HttpSession;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.PUT;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import org.jdbi.v3.core.Jdbi;

import com.codahale.metrics.annotation.Timed;
import com.legendatours.beans.ActivityDay;
import com.legendatours.beans.Coordinate;
import com.legendatours.beans.File;
import com.legendatours.beans.Image;
import com.legendatours.beans.Marker;
import com.legendatours.beans.MarkerType;
import com.legendatours.beans.Track;
import com.legendatours.dao.ActivityDayDao;
import com.legendatours.dao.FileDao;

import io.dropwizard.jersey.sessions.Session;
import io.jenetics.jpx.GPX;

@Timed
@PermitAll
@Path("/activity/{activityId}/day")
public class ActivityDayResource {
    private final Jdbi jdbi;

    public ActivityDayResource(final Jdbi jdbi) {
        this.jdbi = jdbi;
    }

    @GET
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response get(@PathParam("id") final UUID id) {
        final ActivityDay activityDay = jdbi.onDemand(ActivityDayDao.class).get(id);

        if (activityDay == null) {
            return Response.status(Status.NOT_FOUND).build();
        }

        return Response.ok(activityDay).build();
    }

    @GET
    @Path("/")
    @Produces(MediaType.APPLICATION_JSON)
    public Response getByActivity(@PathParam("activityId") final UUID activityId) {
        return Response.ok(jdbi.onDemand(ActivityDayDao.class).getByActivity(activityId)).build();
    }

    @POST
    @Path("/")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response create(@PathParam("activityId") final UUID activityId, final ActivityDay activityDay, @Session HttpSession session) {
        final ActivityDay wrappedActivityDay = wrapCreate(setTrackPoints(wrapImages(activityDay), true), session);
        jdbi.onDemand(ActivityDayDao.class).insert(wrappedActivityDay);
        return get(wrappedActivityDay.getId());
    }

    @PUT
    @Path("/{id}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response update(@PathParam("id") final UUID id, final ActivityDay activityDay, @Session HttpSession session) {
        final ActivityDay oldActivityDay = jdbi.onDemand(ActivityDayDao.class).get(id);

        if (oldActivityDay == null) {
            return Response.status(Status.NOT_FOUND).build();
        }

        final boolean createMarkers =
            (oldActivityDay.getTrack() == null && activityDay.getTrack() != null) || // first time
            (oldActivityDay.getTrack() != null && activityDay.getTrack() != null && !Objects.deepEquals(oldActivityDay.getTrack().getFiles(), activityDay.getTrack().getFiles())); // on update

        final ActivityDay wrappedActivityDay = wrapUpdate(oldActivityDay, setTrackPoints(wrapImages(activityDay), createMarkers), session);
        jdbi.onDemand(ActivityDayDao.class).update(wrappedActivityDay);

        return get(id);
    }

    @DELETE
    @Path("/{id}")
    public Response delete(@PathParam("id") final UUID id, @Session HttpSession session) {
        final ActivityDay activityDay = jdbi.onDemand(ActivityDayDao.class).get(id);

        if (activityDay == null) {
            return Response.status(Status.NOT_FOUND).build();
        }

        final ActivityDay wrappedActivityDay = wrapDeleted(activityDay, session);
        jdbi.onDemand(ActivityDayDao.class).delete(wrappedActivityDay);

        return Response.noContent().build();
    }

    //
    // Helpers
    //

    private ActivityDay wrapCreate(final ActivityDay activityDay, final HttpSession session) {
        final UUID id = UUID.randomUUID();
        final OffsetDateTime createdAt = OffsetDateTime.now();
        final UUID createdBy = (UUID) session.getAttribute("user");

        return new ActivityDay(
            id,
            activityDay.getActivityId(),
            activityDay.getTitle(),
            activityDay.getDescription(),
            activityDay.getImages(),
            activityDay.getTrack(),
            activityDay.getMarkers(),
            activityDay.getDirections(),
            createdAt,
            createdBy);
    }

    private ActivityDay wrapUpdate(final ActivityDay activityDay, final ActivityDay update, final HttpSession session) {
        final OffsetDateTime updatedAt = OffsetDateTime.now();
        final UUID updatedBy = (UUID) session.getAttribute("user");

        return new ActivityDay(
            activityDay.getId(),
            activityDay.getActivityId(),
            update.getTitle(),
            update.getDescription(),
            update.getImages(),
            update.getTrack(),
            update.getMarkers(),
            update.getDirections(),
            activityDay.getCreatedAt(),
            activityDay.getCreatedBy(),
            updatedAt,
            updatedBy);
    }

    private ActivityDay wrapDeleted(final ActivityDay activityDay, final HttpSession session) {
        final OffsetDateTime deletedAt = OffsetDateTime.now();
        final UUID deletedBy = (UUID) session.getAttribute("user");

        return new ActivityDay(
            activityDay.getId(),
            activityDay.getActivityId(),
            activityDay.getTitle(),
            activityDay.getDescription(),
            activityDay.getImages(),
            activityDay.getTrack(),
            activityDay.getMarkers(),
            activityDay.getDirections(),
            activityDay.getCreatedAt(),
            activityDay.getCreatedBy(),
            activityDay.getUpdatedAt(),
            activityDay.getUpdatedBy(),
            deletedAt,
            deletedBy);
    }

    private ActivityDay setTrackPoints(final ActivityDay activityDay, final boolean createMarkers) {
        if (activityDay.getTrack() == null || activityDay.getTrack().getFiles() == null || activityDay.getTrack().getFiles().isEmpty()) {
            return activityDay;
        }

        final List<List<Coordinate>> routes = new ArrayList<>();

        for (UUID fileId : activityDay.getTrack().getFiles()) {
            final File file = jdbi.onDemand(FileDao.class).get(fileId);

            try {
                final GPX gpx = GPX.read(new ByteArrayInputStream(file.getContent()));

                gpx.tracks().forEach((track) -> {
                    final List<Coordinate> points = new ArrayList<>();

                    track.segments().forEach((segment) -> {
                        segment.points().forEach((point) -> {
                            points.add(new Coordinate(
                                point.getLatitude().toDegrees(),
                                point.getLongitude().toDegrees(),
                                point.getElevation().isPresent() ? point.getElevation().get().doubleValue() : null));
                        });
                    });

                    routes.add(points);
                });
            } catch (IOException e) {
                // TODO Auto-generated catch block
                // e.printStackTrace();
            }
        }

        final List<Marker> markers = new ArrayList<>();;

        // preserve existing markers
        if (activityDay.getMarkers() != null) {
            markers.addAll(activityDay.getMarkers());
        }

        // add default markers
        if (createMarkers) {
            for (final List<Coordinate> path : routes) {
                if (path.isEmpty()) {
                    continue;
                }

                final Coordinate origin = path.get(0);
                markers.add(new Marker(MarkerType.ORIGIN, "Origin", origin.getLatitude(), origin.getLongitude(), origin.getElevation()));
    
                final Coordinate destination = path.get(path.size() - 1);
                markers.add(new Marker(MarkerType.DESTINATION, "Destination", destination.getLatitude(), destination.getLongitude(), destination.getElevation()));
            }
        }

        return new ActivityDay(
            activityDay.getId(),
            activityDay.getActivityId(),
            activityDay.getTitle(),
            activityDay.getDescription(),
            activityDay.getImages(),
            new Track(activityDay.getTrack().getFiles(), routes, routes.stream().flatMap(List::stream).collect(Collectors.toList())),
            markers,
            activityDay.getDirections(),
            activityDay.getCreatedAt(),
            activityDay.getCreatedBy(),
            activityDay.getUpdatedAt(),
            activityDay.getUpdatedBy(),
            activityDay.getDeletedAt(),
            activityDay.getDeletedBy());
    }

    private ActivityDay wrapImages(final ActivityDay activityDay) {

        final List<Image> images = activityDay.getImages().stream()
            .map((image) -> {
                int width, height;
                String type;

                final File file = jdbi.onDemand(FileDao.class).get(image.getFileId());

                try {
                    final BufferedImage img = ImageIO.read(new ByteArrayInputStream(file.getContent()));
                    width = img.getWidth();
                    height = img.getHeight();
                } catch (final IOException e) {
                    // TODO handle this
                    // e.printStackTrace();
                    width = height = 0;
                }

                if (file.getName().contains(".")) {
                    type = file.getName().substring(file.getName().lastIndexOf('.'));
                } else {
                    type = "";
                }

                return new Image(
                    image.getFileId(),
                    image.getTitle(),
                    width,
                    height,
                    type);
            })
            .collect(Collectors.toList());


        return new ActivityDay(
            activityDay.getId(),
            activityDay.getActivityId(),
            activityDay.getTitle(),
            activityDay.getDescription(),
            images,
            activityDay.getTrack(),
            activityDay.getMarkers(),
            activityDay.getDirections(),
            activityDay.getCreatedAt(),
            activityDay.getCreatedBy(),
            activityDay.getUpdatedAt(),
            activityDay.getUpdatedBy(),
            activityDay.getDeletedAt(),
            activityDay.getDeletedBy());
    }
}

package com.legendatours.resource;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.time.OffsetDateTime;
import java.util.UUID;

import javax.annotation.security.PermitAll;
import javax.imageio.ImageIO;
import javax.servlet.http.HttpSession;
import javax.ws.rs.Consumes;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;
import java.awt.AlphaComposite;
import java.awt.Graphics2D;
import java.awt.RenderingHints;
import java.awt.image.BufferedImage;

import com.codahale.metrics.annotation.Timed;
import com.legendatours.beans.File;
import com.legendatours.dao.FileDao;

import org.apache.commons.io.IOUtils;
import org.glassfish.jersey.media.multipart.ContentDisposition;
import org.glassfish.jersey.media.multipart.FormDataBodyPart;
import org.glassfish.jersey.media.multipart.FormDataParam;
import org.jdbi.v3.core.Jdbi;

import io.dropwizard.jersey.sessions.Session;

@Timed
@PermitAll
@Path("/file")
public class FileResource {
    private final Jdbi jdbi;

    public FileResource(final Jdbi jdbi) {
        this.jdbi = jdbi;
    }

    @GET
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response get(@PathParam("id") final UUID id) {
        final File file = jdbi.onDemand(FileDao.class).get(id);

        if (file == null) {
            return Response.status(Status.NOT_FOUND).build();
        }

        return Response.ok(file).build();
    }

    @GET
    @Path("/{id}/download")
    @Produces(MediaType.APPLICATION_OCTET_STREAM)
    public Response download(@PathParam("id") final UUID id) {
        final File file = jdbi.onDemand(FileDao.class).get(id);

        if (file == null) {
            return Response.status(Status.NOT_FOUND).build();
        }

        return Response
            .ok(file.getContent())
            .type(file.getType())
            .header("Content-Disposition", "attachment; filename=\"" + file.getName() + "\"")
            .build();
    }


    @GET
    @Path("/{id}/thumbnail/{size}")
    @Produces(MediaType.APPLICATION_OCTET_STREAM)
    public Response thumbnail(@PathParam("id") final UUID id, @PathParam("size") final Integer size) {
        final File file = jdbi.onDemand(FileDao.class).get(id);

        if (file == null) {
            return Response.status(Status.NOT_FOUND).build();
        }

        // only images may be resized
        if (file.getType().startsWith("image")) {
            try {
                final BufferedImage image = ImageIO.read(new ByteArrayInputStream(file.getContent()));
                final int width = image.getWidth() * size / image.getHeight();
                final int height = size;

                final BufferedImage thumbnail = new BufferedImage(width, height, image.getType());

                final Graphics2D graphics = thumbnail.createGraphics();
                graphics.drawImage(image, 0, 0, width, height, null);
                graphics.dispose();
                graphics.setComposite(AlphaComposite.Src);
                graphics.setRenderingHint(RenderingHints.KEY_INTERPOLATION, RenderingHints.VALUE_INTERPOLATION_BILINEAR);
                graphics.setRenderingHint(RenderingHints.KEY_RENDERING, RenderingHints.VALUE_RENDER_QUALITY);
                graphics.setRenderingHint(RenderingHints.KEY_ANTIALIASING, RenderingHints.VALUE_ANTIALIAS_ON);

                return Response
                    .ok(thumbnail)
                    .type(file.getType())
                    // .header("Content-Disposition", "attachment; filename=\"" + file.getName() + "\"")
                    .build();
            } catch (final IOException e) {
                // TODO handle this
                e.printStackTrace();
                return Response.status(Status.INTERNAL_SERVER_ERROR).build();
            }
        }

        return Response.status(Status.INTERNAL_SERVER_ERROR).build();
    }

    @POST
    @Path("/")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
    public Response create(@FormDataParam("file") FormDataBodyPart data, @Session HttpSession session) {
        final InputStream stream = data.getEntityAs(InputStream.class);
        final ContentDisposition content = data.getContentDisposition();
        final MediaType media = data.getMediaType();
        final byte[] bytes;

        try {
            bytes = IOUtils.toByteArray(stream);
        } catch (IOException e) {
            e.printStackTrace();
            return Response.status(Status.NOT_FOUND).build();
        }

        final File file = new File(null, content.getFileName(), media.toString(), (long) bytes.length, bytes, null, null);

        final File wrappedFile = wrapCreate(file, session);
        jdbi.onDemand(FileDao.class).insert(wrappedFile);    

        return get(wrappedFile.getId());
    }

    private File wrapCreate(final File file, final HttpSession session) {
        final UUID id = UUID.randomUUID();
        final OffsetDateTime createdAt = OffsetDateTime.now();
        final UUID createdBy = (UUID) session.getAttribute("user");
        
        return new File(
                id,
                file.getName(),
                file.getType(),
                file.getSize(),
                file.getContent(),
                createdAt,
                createdBy);
    }
}

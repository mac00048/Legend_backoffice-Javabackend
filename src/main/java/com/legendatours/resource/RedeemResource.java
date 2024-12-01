package com.legendatours.resource;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

import javax.servlet.http.HttpSession;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import org.jdbi.v3.core.Jdbi;

import com.codahale.metrics.annotation.Timed;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.legendatours.beans.Activity;
import com.legendatours.beans.ActivityDay;
import com.legendatours.beans.File;
import com.legendatours.beans.Image;
import com.legendatours.beans.Redeem;
import com.legendatours.beans.Voucher;
import com.legendatours.dao.ActivityDao;
import com.legendatours.dao.ActivityDayDao;
import com.legendatours.dao.FileDao;
import com.legendatours.dao.VoucherDao;

import io.dropwizard.jackson.Jackson;
import io.dropwizard.jersey.sessions.Session;

@Timed
@Path("/redeem")
public class RedeemResource {
    private final Jdbi jdbi;

    public RedeemResource(final Jdbi jdbi) {
        this.jdbi = jdbi;
    }

    /**
     * @param code
     * @param session
     * @return
     */
    @GET
    @Path("/{code}")
    @Produces(MediaType.APPLICATION_OCTET_STREAM)
    public Response redeem(@PathParam("code") final String code, @Session HttpSession session) {
        final Voucher voucher = jdbi.onDemand(VoucherDao.class).get(code);

        if (voucher == null) {
            return Response.status(Status.NOT_FOUND).build();
        }

        // voucher already used
        if (voucher.getRedeemDate() != null) {
            return Response.status(Status.NOT_FOUND).build();
        }

        int dayCount = jdbi.onDemand(ActivityDayDao.class).countByActivity(voucher.getActivityId());

        // all vouchers are valid for at least one day
        if (dayCount <= 0) {
            dayCount = 1;
        }

        final LocalDateTime expirationDate = voucher.getStartDate().atStartOfDay().plusDays(dayCount).minusSeconds(1);

        // if voucher already expired
        if (LocalDateTime.now().isAfter(expirationDate)) {
            return Response.status(Status.NOT_FOUND).build();
        }

        final Voucher wrappedVoucher = wrapRedeem(voucher, session);
        jdbi.onDemand(VoucherDao.class).update(wrappedVoucher);

        try {
            final byte[] zip = generateZip(voucher.getActivityId(), voucher.getStartDate(), expirationDate);

            return Response
                .ok(zip)
                .type("application/zip")
                .header("Content-Length", zip.length)
                .build();
        } catch (final IOException ex) {
            return Response.status(Status.NOT_FOUND).build();
        }
    }

    //
    // Helpers
    //

    private Voucher wrapRedeem(final Voucher voucher, final HttpSession session) {
        final OffsetDateTime redeemedAt = OffsetDateTime.now();
        
        return new Voucher(
            voucher.getId(),
            voucher.getActivityId(),
            voucher.getStartDate(),
            voucher.getClientName(),
            voucher.getClientPhone(),
            voucher.getClientEmail(),
            voucher.getVoucher(),
            redeemedAt,
            voucher.getCreatedAt(),
            voucher.getCreatedBy(),
            voucher.getUpdatedAt(),
            voucher.getUpdatedBy());
    }

    private byte[] generateZip(final UUID activityId, final LocalDate startDate, LocalDateTime expirationDate) throws IOException {
        final ByteArrayOutputStream baos = new ByteArrayOutputStream();
        final ObjectMapper mapper = Jackson.newObjectMapper();

        final Activity activity = jdbi.onDemand(ActivityDao.class).get(activityId);
        final List<ActivityDay> days = jdbi.onDemand(ActivityDayDao.class).getByActivity(activityId);
        
        final Redeem redeem = new Redeem(activity, days, startDate, expirationDate);

        try (final ZipOutputStream zos = new ZipOutputStream(baos)) {
            // add index json
            final ZipEntry index = new ZipEntry("index.json"); 
            zos.putNextEntry(index);
            zos.write(mapper.writeValueAsBytes(redeem));
            zos.closeEntry();

            // create image directory
            final ZipEntry imagesDirectory = new ZipEntry("images/"); 
            zos.putNextEntry(imagesDirectory);
            zos.closeEntry();

            for (final Image image : activity.getImages()) {
                writeImage(image, zos);
            }

            for (final ActivityDay activityDay : days) {
                for (final Image image : activityDay.getImages()) {
                    writeImage(image, zos);
                }
            }
        }

        return baos.toByteArray();
    }

    private void writeImage(final Image image, final ZipOutputStream zos) throws IOException {
        final File file = jdbi.onDemand(FileDao.class).get(image.getFileId());

        if (file == null) {
            return;
        }

        // create image
        final ZipEntry entry = new ZipEntry("images/" + file.getId() + (image.getType() != null ? image.getType() : ""));
        zos.putNextEntry(entry);
        zos.write(file.getContent());
        zos.closeEntry();
    }
}

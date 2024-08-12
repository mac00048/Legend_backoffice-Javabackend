package com.legendatours.resource;

import java.time.OffsetDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import javax.annotation.security.PermitAll;
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

import com.codahale.metrics.annotation.Timed;
import com.legendatours.beans.Activity;
import com.legendatours.beans.User;
import com.legendatours.beans.Voucher;
import com.legendatours.dao.ActivityDao;
import com.legendatours.dao.ActivityDayDao;
import com.legendatours.dao.UserDao;
import com.legendatours.dao.VoucherDao;

import org.jdbi.v3.core.Jdbi;
import org.passay.CharacterRule;
import org.passay.EnglishCharacterData;
import org.passay.PasswordGenerator;

import io.dropwizard.jersey.sessions.Session;

@Timed
@PermitAll
@Path("/voucher")
public class VoucherResource {
    private final Jdbi jdbi;

    public VoucherResource(final Jdbi jdbi) {
        this.jdbi = jdbi;
    }

    @GET
    @Path("/{id}")
    @Produces(MediaType.APPLICATION_JSON)
    public Response get(@PathParam("id") final UUID id) {
        final Voucher voucher = jdbi.onDemand(VoucherDao.class).get(id);

        if (voucher == null) {
            return Response.status(Status.NOT_FOUND).build();
        }

        return Response.ok(wrapMeta(voucher)).build();
    }

    @GET
    @Path("/")
    @Produces(MediaType.APPLICATION_JSON)
    public Response list(
        @QueryParam("q")       @DefaultValue("")            final String query,
        @QueryParam("orderBy") @DefaultValue("client_name") final String orderBy,
        @QueryParam("order")   @DefaultValue("ASC")         final String order) {
    
        final List<Voucher> vouchers = jdbi.onDemand(VoucherDao.class).list(query, orderBy, order);
        return Response.ok(wrapMeta(vouchers)).build();
    }

    @POST
    @Path("/")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response create(final Voucher voucher, @Session HttpSession session) {
        final Voucher wrappedVoucher = wrapCreate(voucher, session);
        jdbi.onDemand(VoucherDao.class).insert(wrappedVoucher);
        return get(wrappedVoucher.getId());
    }

    @PUT
    @Path("/{id}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response update(@PathParam("id") final UUID id, final Voucher voucher, @Session HttpSession session) {
        final Voucher oldVoucher = jdbi.onDemand(VoucherDao.class).get(id);

        if (oldVoucher == null) {
            return Response.status(Status.NOT_FOUND).build();
        }

        final Voucher wrappedVoucher = wrapUpdate(oldVoucher, voucher, session);
        jdbi.onDemand(VoucherDao.class).update(wrappedVoucher);

        return get(id);
    }

    @DELETE
    @Path("/{id}")
    public Response delete(@PathParam("id") final UUID id, @Session HttpSession session) {
        final Voucher voucher = jdbi.onDemand(VoucherDao.class).get(id);

        if (voucher == null) {
            return Response.status(Status.NOT_FOUND).build();
        }

        final Voucher wrappedVoucher = wrapDeleted(voucher, session);
        jdbi.onDemand(VoucherDao.class).delete(wrappedVoucher);

        return Response.noContent().build();
    }

    @DELETE
    @Path("/{id}/reset")
    public Response reset(@PathParam("id") final UUID id, @Session HttpSession session) {
        final Voucher voucher = jdbi.onDemand(VoucherDao.class).get(id);

        if (voucher == null) {
            return Response.status(Status.NOT_FOUND).build();
        }

        final Voucher wrappedVoucher = wrapReset(voucher, session);
        jdbi.onDemand(VoucherDao.class).update(wrappedVoucher);

        return Response.noContent().build();
    }

    @DELETE
    @Path("/{id}/unredeem")
    public Response unredeem(@PathParam("id") final UUID id, @Session HttpSession session) {
        final Voucher voucher = jdbi.onDemand(VoucherDao.class).get(id);

        if (voucher == null) {
            return Response.status(Status.NOT_FOUND).build();
        }

        final Voucher wrappedVoucher = wrapUnredeem(voucher, session);
        jdbi.onDemand(VoucherDao.class).update(wrappedVoucher);

        return Response.noContent().build();
    }



    //
    // Helpers
    //

    private Voucher wrapCreate(final Voucher voucher, final HttpSession session) {
        final UUID id = UUID.randomUUID();
        final String code = generateVoucher();
        final OffsetDateTime createdAt = OffsetDateTime.now();
        final UUID createdBy = (UUID) session.getAttribute("user");
        
        return new Voucher(
                id,
                voucher.getActivityId(),
                voucher.getStartDate(),
                voucher.getClientName(),
                voucher.getClientPhone(),
                voucher.getClientEmail(),
                code,
                null,
                createdAt,
                createdBy);
    }

    private Voucher wrapUpdate(final Voucher voucher, final Voucher update, final HttpSession session) {
        final OffsetDateTime updatedAt = OffsetDateTime.now();
        final UUID updatedBy = (UUID) session.getAttribute("user");
        
        return new Voucher(
            voucher.getId(),
            update.getActivityId(),
            update.getStartDate(),
            update.getClientName(),
            update.getClientPhone(),
            update.getClientEmail(),
            voucher.getVoucher(),
            voucher.getRedeemDate(),
            voucher.getCreatedAt(),
            voucher.getCreatedBy(),
            updatedAt,
            updatedBy);
    }

    private Voucher wrapDeleted(final Voucher voucher, final HttpSession session) {
        final OffsetDateTime deletedAt = OffsetDateTime.now();
        final UUID deletedBy = (UUID) session.getAttribute("user");
        
        return new Voucher(
            voucher.getId(),
            voucher.getActivityId(),
            voucher.getStartDate(),
            voucher.getClientName(),
            voucher.getClientPhone(),
            voucher.getClientEmail(),
            voucher.getVoucher(),
            voucher.getRedeemDate(),
            voucher.getCreatedAt(),
            voucher.getCreatedBy(),
            voucher.getUpdatedAt(),
            voucher.getUpdatedBy(),
            deletedAt,
            deletedBy);
    }

    private Voucher wrapReset(final Voucher voucher, final HttpSession session) {
        final String code = generateVoucher();
        final OffsetDateTime updatedAt = OffsetDateTime.now();
        final UUID updatedBy = (UUID) session.getAttribute("user");
        
        return new Voucher(
            voucher.getId(),
            voucher.getActivityId(),
            voucher.getStartDate(),
            voucher.getClientName(),
            voucher.getClientPhone(),
            voucher.getClientEmail(),
            code,
            null,
            voucher.getCreatedAt(),
            voucher.getCreatedBy(),
            updatedAt,
            updatedBy);
    }

    private Voucher wrapUnredeem(final Voucher voucher, final HttpSession session) {
        final OffsetDateTime updatedAt = OffsetDateTime.now();
        final UUID updatedBy = (UUID) session.getAttribute("user");
        
        return new Voucher(
            voucher.getId(),
            voucher.getActivityId(),
            voucher.getStartDate(),
            voucher.getClientName(),
            voucher.getClientPhone(),
            voucher.getClientEmail(),
            voucher.getVoucher(),
            null,
            voucher.getCreatedAt(),
            voucher.getCreatedBy(),
            updatedAt,
            updatedBy);
    }

    private String generateVoucher() {
        final List<CharacterRule> rules = Arrays.asList(
            new CharacterRule(EnglishCharacterData.UpperCase, 1),
            new CharacterRule(EnglishCharacterData.LowerCase, 1),
            new CharacterRule(EnglishCharacterData.Digit, 1));

        final PasswordGenerator generator = new PasswordGenerator();
        
        return generator.generatePassword(8, rules);
    }

    private List<Voucher> wrapMeta(final List<Voucher> vouchers) {
        return vouchers.stream()
            .map(this::wrapMeta)
            .collect(Collectors.toList());
    }

    private Voucher wrapMeta(final Voucher voucher) {
        if (voucher.getCreatedBy() != null) {
            final User user = jdbi.onDemand(UserDao.class).get(voucher.getCreatedBy());
            voucher.getMeta().put("createdByName", user.getName());
        }

        if (voucher.getUpdatedBy() != null) {
            final User user = jdbi.onDemand(UserDao.class).get(voucher.getUpdatedBy());
            voucher.getMeta().put("updatedByName", user.getName());
        }

        if (voucher.getDeletedBy() != null) {
            final User user = jdbi.onDemand(UserDao.class).get(voucher.getDeletedBy());
            voucher.getMeta().put("deletedByName", user.getName());
        }

        if (voucher.getActivityId() != null) {
            final Activity activity = jdbi.onDemand(ActivityDao.class).get(voucher.getActivityId());

            if (activity != null) {
                voucher.getMeta().put("activityTitle", activity.getTitle());
            }

            int dayCount = jdbi.onDemand(ActivityDayDao.class).countByActivity(voucher.getActivityId());

            // all vouchers are valid for at least one day
            if (dayCount <= 0) {
                dayCount = 1;
            }

            voucher.getMeta().put("expirationDate", voucher.getStartDate().atStartOfDay().plusDays(dayCount).minusSeconds(1).toString());
        }

        return voucher;
    }
}

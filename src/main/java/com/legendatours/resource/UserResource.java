package com.legendatours.resource;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import javax.ws.rs.Consumes;
import javax.ws.rs.DefaultValue;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import org.jdbi.v3.core.Jdbi;

import com.legendatours.beans.User;
import com.legendatours.dao.UserDao;

// @Timed
// @PermitAll
@Path("/user")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class UserResource {

    private final Jdbi jdbi;

    public UserResource(final Jdbi jdbi) {
        this.jdbi = jdbi;
    }

    @GET
    @Path("/{id}")
    public Response get(@PathParam("id") final UUID id) {
        final User user = jdbi.onDemand(UserDao.class).get(id);

        if (user == null) {
            return Response.status(Status.NOT_FOUND).build();
        }

        return Response.ok(wrapMeta(user)).build();
    }

    @GET
    @Path("/")
    @Produces(MediaType.APPLICATION_JSON)
    public Response list(
            @QueryParam("q")       @DefaultValue("")      final String query,
            @QueryParam("orderBy") @DefaultValue("name") final String orderBy,
            @QueryParam("order")   @DefaultValue("ASC")   final String order) {
        final List<User> users = jdbi.onDemand(UserDao.class).list(query, orderBy, order);
        return Response.ok(wrapMeta(users)).build();
    }

    // @POST
    // public Response create(final User user, @Session HttpSession session) {
    //     final User wrappedUser = wrapCreate(user, session);
    //     jdbi.onDemand(UserDao.class).insert(wrappedUser);
    //     return get(wrappedUser.getId());
    // }

    // @PUT
    // @Path("/{id}")
    // public Response update(@PathParam("id") final UUID id, final User user, @Session HttpSession session) {
    //     final User oldUser = jdbi.onDemand(UserDao.class).get(id);

    //     if (oldUser == null) {
    //         return Response.status(Status.NOT_FOUND).build();
    //     }

    //     final User wrappedUser = wrapUpdate(oldUser, user, session);
    //     jdbi.onDemand(UserDao.class).update(wrappedUser);

    //     return get(id);
    // }

    // @DELETE
    // @Path("/{id}")
    // public Response delete(@PathParam("id") final UUID id, @Session HttpSession session) {
    //     final User user = jdbi.onDemand(UserDao.class).get(id);

    //     if (user == null) {
    //         return Response.status(Status.NOT_FOUND).build();
    //     }

    //     final User wrappedUser = wrapDeleted(user, session);
    //     jdbi.onDemand(UserDao.class).delete(wrappedUser);

    //     return Response.noContent().build();
    // }

    //
    // Helpers
    //

    // private User wrapCreate(final User user, final HttpSession session) {
    //     final UUID id = UUID.randomUUID();

    //     return new User(
    //             id,
    //             user.getName(),
    //             user.getEmail(),
    //             user.getPhone(),
    //             user.getPassword(),
    //             user.getRole());
    // }

    // private User wrapUpdate(final User oldUser, final User update, final HttpSession session) {

    //     return new User(
    //             oldUser.getId(),
    //             update.getName(),
    //             update.getEmail(),
    //             update.getPhone(),
    //             update.getPassword(),
    //             update.getRole());
    // }

    // private User wrapDeleted(final User user, final HttpSession session) {

    //     return new User(
    //             user.getId(),
    //             user.getName(),
    //             user.getEmail(),
    //             user.getPhone(),
    //             user.getPassword(),
    //             user.getRole());
    // }

    private List<User> wrapMeta(final List<User> users) {
        return users.stream()
            .map(this::wrapMeta)
            .collect(Collectors.toList());
    }

    private User wrapMeta(final User user) {
        // Example: Add metadata if needed
        // user.getMeta().put("extraField", "value");
        return user;
    }

}

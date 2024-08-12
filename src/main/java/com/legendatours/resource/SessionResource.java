package com.legendatours.resource;

import java.util.UUID;

import javax.servlet.http.HttpSession;
import javax.ws.rs.Consumes;
import javax.ws.rs.DELETE;
import javax.ws.rs.GET;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.Response.Status;

import com.codahale.metrics.annotation.Timed;
import com.legendatours.beans.Login;
import com.legendatours.beans.User;
import com.legendatours.dao.UserDao;

import org.jdbi.v3.core.Jdbi;
import org.mindrot.jbcrypt.BCrypt;

import io.dropwizard.jersey.sessions.Session;

@Timed
@Path("/session")
public class SessionResource {
    private final Jdbi jdbi;

    public SessionResource(final Jdbi jdbi) {
        this.jdbi = jdbi;
    }

    @GET
    @Produces(MediaType.APPLICATION_JSON)
    public Response get(@Session HttpSession session) {
        final UUID userId = (UUID) session.getAttribute("user");

        if (userId == null) {
            return Response.status(Status.UNAUTHORIZED).build();
        }

        final User user = jdbi.onDemand(UserDao.class).get(userId);

        if (user == null) {
            session.invalidate();
            return Response.status(Status.UNAUTHORIZED).build();
        }

        return Response.ok(user).build();
    }

    @POST
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response login(final Login login, @Session HttpSession session) {
        final User user = jdbi.onDemand(UserDao.class).getByEmail(login.getEmail());
        
        // username not found
        if (user == null) {
            return Response.status(Status.UNAUTHORIZED).build();
        }

        // passwords do not match
        if (!BCrypt.checkpw(login.getPassword(), user.getPassword())) {
            return Response.status(Status.UNAUTHORIZED).build();
        }

        session.setAttribute("user", user.getId());

        return Response.ok(user).build();
    }

    @DELETE
    public void logout(@Session HttpSession session) {
        session.invalidate();
    }
}

package com.legendatours.resource;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

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
import org.mindrot.jbcrypt.BCrypt;

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

    @POST
    @Path("/")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response add(final User user) {
        if (user.getName() == null || user.getEmail() == null || user.getPassword() == null) {
            return Response.status(Response.Status.BAD_REQUEST)
                    .entity("Name, email, and password are required fields.")
                    .build();
        }
    
        try {
            // Wrap the user object and hash the password
            final User wrappedUser = wrapCreate(user);
    
            // Insert the wrapped user into the database
            jdbi.onDemand(UserDao.class).insert(wrappedUser);
    
            // Return the created user
            return Response.status(Response.Status.CREATED)
                    .entity(wrappedUser)
                    .build();
        } catch (Exception e) {
            e.printStackTrace();
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("An error occurred while adding the user.")
                    .build();
        }
    }

    @PUT
    @Path("/{id}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response update(@PathParam("id") final UUID id, final User user) {
        System.out.println("PUT request received for user: " + id);
    
        // Fetch the existing user
        User existingUser = jdbi.onDemand(UserDao.class).get(id);
    
        if (existingUser == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
    
        // Determine the password to save (hash new password if provided)
        String passwordToSave = (user.getPassword() != null && !user.getPassword().isEmpty())
                ? BCrypt.hashpw(user.getPassword(), BCrypt.gensalt()) // Hash the new password
                : existingUser.getPassword(); // Retain existing hashed password
    
        // Create the updated User object
        User updatedUser = new User(
                id,
                user.getName() != null ? user.getName() : existingUser.getName(),
                user.getEmail() != null ? user.getEmail() : existingUser.getEmail(),
                user.getPhone() != null ? user.getPhone() : existingUser.getPhone(),
                passwordToSave,
                user.getRole() != null ? user.getRole() : existingUser.getRole()
        );
    
        // Update the user in the database
        jdbi.onDemand(UserDao.class).update(updatedUser);
    
        // Return the updated user
        return Response.ok(updatedUser).build();
    }
    
  
    @DELETE
    @Path("/{id}")
    @Consumes(MediaType.APPLICATION_JSON)
    @Produces(MediaType.APPLICATION_JSON)
    public Response remove(@PathParam("id") final UUID id) {
        // Fetch the user from the database
        final User user = jdbi.onDemand(UserDao.class).get(id);
    
        if (user == null) {
            // Return 404 if the user is not found
            return Response.status(Response.Status.NOT_FOUND)
                    .entity("User not found")
                    .build();
        }
    
        try {
            // Perform the deletion (soft delete or hard delete)
            jdbi.onDemand(UserDao.class).delete(id);
    
            // Return a success response
            return Response.noContent().build();
        } catch (Exception e) {
            // Log the exception and return a 500 status
            e.printStackTrace();
            return Response.status(Response.Status.INTERNAL_SERVER_ERROR)
                    .entity("An error occurred while deleting the user.")
                    .build();
        }
    }
    
    // Remove the unnecessary `wrapDeleted` method
    

    //
    // Helpers
    //

private User wrapCreate(final User user) {
    final UUID id = UUID.randomUUID();

    // Hash the password
    String hashedPassword = BCrypt.hashpw(user.getPassword(), BCrypt.gensalt());

    return new User(
            id,
            user.getName(),
            user.getEmail(),
            user.getPhone(),
            hashedPassword, // Store the hashed password
            user.getRole() != null ? user.getRole() : "User" // Default role if not provided
    );
}

    private User wrapUpdate(final User oldUser, final User update) {

        return new User(
                oldUser.getId(),
                update.getName(),
                update.getEmail(),
                update.getPhone(),
                update.getPassword(),
                update.getRole());
    }

    // private User wrapDeleted(final User user) {

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

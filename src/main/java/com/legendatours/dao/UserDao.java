package com.legendatours.dao;

import java.util.List;
import java.util.UUID;

import org.jdbi.v3.sqlobject.config.RegisterFieldMapper;
import org.jdbi.v3.sqlobject.customizer.Bind;
import org.jdbi.v3.sqlobject.customizer.BindBean;
import org.jdbi.v3.sqlobject.customizer.Define;
import org.jdbi.v3.sqlobject.statement.SqlQuery;
import org.jdbi.v3.sqlobject.statement.SqlUpdate;

import com.legendatours.beans.User;

public interface UserDao {

    @SqlQuery(
        "SELECT * FROM \"user\" " +
        "WHERE (name ILIKE '%' || :query || '%' OR " +
        "       email ILIKE '%' || :query || '%' OR " +
        "       phone ILIKE '%' || :query || '%') " +
        "ORDER BY <orderBy> <order>"
    )
    @RegisterFieldMapper(User.class)
    List<User> list(@Bind("query") String query, @Define("orderBy") String orderBy, @Define("order") String order);

    @SqlQuery("SELECT id, name, email, phone, password, role FROM \"user\" WHERE id = :id LIMIT 1")
    @RegisterFieldMapper(User.class)
    User get(@Bind("id") UUID id);

    @SqlQuery("SELECT id, name, email, phone, password, role FROM \"user\" WHERE name = :name LIMIT 1")
    @RegisterFieldMapper(User.class)
    User getName(@Bind("name") String name);

    @SqlQuery("SELECT id, name, email, phone, password, role FROM \"user\" WHERE email = :email LIMIT 1")
    @RegisterFieldMapper(User.class)
    User getByEmail(@Bind("email") String email);

    @SqlUpdate("INSERT INTO \"user\" (id, name, email, phone, password, role) " +
               "VALUES (:id, :name, :email, :phone, :password, :role)")
    void insert(@BindBean User user);

    @SqlUpdate("UPDATE \"user\" " +
               "SET name = :name, email = :email, phone = :phone, password = :password, role = :role " +
               "WHERE id = :id")
    void update(@BindBean User user);

    @SqlUpdate("DELETE FROM \"user\" WHERE id = :id")
    void delete(@Bind("id") UUID id);

}

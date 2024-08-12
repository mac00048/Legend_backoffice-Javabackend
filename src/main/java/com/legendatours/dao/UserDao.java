package com.legendatours.dao;

import java.util.UUID;

import com.legendatours.beans.User;

import org.jdbi.v3.sqlobject.config.RegisterFieldMapper;
import org.jdbi.v3.sqlobject.customizer.Bind;
import org.jdbi.v3.sqlobject.statement.SqlQuery;

public interface UserDao {

    @SqlQuery("SELECT * FROM \"user\" WHERE \"id\"=:id LIMIT 1")
    @RegisterFieldMapper(User.class)
    User get(@Bind("id") UUID id);

    @SqlQuery("SELECT * FROM \"user\" WHERE \"email\"=:email LIMIT 1")
    @RegisterFieldMapper(User.class)
    User getByEmail(@Bind("email") String email);
}

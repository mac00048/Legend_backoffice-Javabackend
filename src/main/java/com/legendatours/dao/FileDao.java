package com.legendatours.dao;

import java.util.UUID;

import com.legendatours.beans.File;

import org.jdbi.v3.sqlobject.config.RegisterFieldMapper;
import org.jdbi.v3.sqlobject.customizer.Bind;
import org.jdbi.v3.sqlobject.customizer.BindBean;
import org.jdbi.v3.sqlobject.statement.SqlQuery;
import org.jdbi.v3.sqlobject.statement.SqlUpdate;

public interface FileDao {

    @SqlQuery("SELECT * FROM file WHERE id=:id LIMIT 1")
    @RegisterFieldMapper(File.class)
    File get(@Bind("id") UUID id);

    @SqlUpdate("INSERT INTO file (id, name, type, size, content, created_at, created_by) values (:id, :name, :type, :size, :content, :createdAt, :createdBy)")
    void insert(@BindBean File file);
}

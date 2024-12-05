package com.legendatours.dao;

import java.util.List;
import java.util.UUID;

import org.jdbi.v3.sqlobject.config.RegisterFieldMapper;
import org.jdbi.v3.sqlobject.customizer.Bind;
import org.jdbi.v3.sqlobject.customizer.BindBean;
import org.jdbi.v3.sqlobject.customizer.Define;
import org.jdbi.v3.sqlobject.statement.SqlQuery;
import org.jdbi.v3.sqlobject.statement.SqlUpdate;

import com.legendatours.beans.Activity;

public interface ActivityDao {

    @SqlQuery("SELECT * FROM activity WHERE id=:id AND deleted_at IS NULL LIMIT 1")
    @RegisterFieldMapper(Activity.class)
    Activity get(@Bind("id") UUID id);

    @SqlQuery(
        "SELECT * " +
        "FROM activity " +
        "WHERE deleted_at IS NULL " +
        "AND (title ILIKE '%' || :query || '%' OR " +
        "     subtitle ILIKE '%' || :query || '%' OR " +
        "     description ILIKE '%' || :query || '%') " +
        "ORDER BY <orderBy> <order>")
    @RegisterFieldMapper(Activity.class)
    List<Activity> list(@Bind("query") String query, @Define("orderBy") String orderBy, @Define("order") String order);

    @SqlUpdate("INSERT INTO activity (id, title, subtitle, description, images, documents, created_at, created_by) values (:id, :title, :subtitle, :description, :images::json, :documents::json, :createdAt, :createdBy)")
    void insert(@BindBean Activity activity);

    @SqlUpdate("UPDATE activity SET title=:title, subtitle=:subtitle, description=:description, images=:images::json, documents=:documents::json, updated_at=:updatedAt, updated_by=:updatedBy WHERE id=:id AND deleted_at IS NULL ")
    void update(@BindBean Activity activity);
    
    @SqlUpdate("UPDATE activity SET deleted_at=:deletedAt, deleted_by=:deletedBy WHERE id=:id AND deleted_at IS NULL ")
    void delete(@BindBean Activity activity);
}

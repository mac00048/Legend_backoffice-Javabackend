package com.legendatours.dao;

import java.util.List;
import java.util.UUID;

import org.jdbi.v3.sqlobject.config.RegisterFieldMapper;
import org.jdbi.v3.sqlobject.customizer.Bind;
import org.jdbi.v3.sqlobject.customizer.BindBean;
import org.jdbi.v3.sqlobject.statement.SqlQuery;
import org.jdbi.v3.sqlobject.statement.SqlUpdate;

import com.legendatours.beans.ActivityDay;

public interface ActivityDayDao {

    @SqlQuery("SELECT * FROM activity_day WHERE id=:id AND deleted_at IS NULL LIMIT 1")
    @RegisterFieldMapper(ActivityDay.class)
    ActivityDay get(@Bind("id") UUID id);

    @SqlQuery("SELECT * FROM activity_day WHERE activity_id=:activityId AND deleted_at IS NULL ORDER BY created_at ASC")
    @RegisterFieldMapper(ActivityDay.class)
    List<ActivityDay> getByActivity(@Bind("activityId") UUID activityId);    

    @SqlQuery("SELECT COUNT(*) FROM activity_day WHERE activity_id=:activityId AND deleted_at IS NULL")
    int countByActivity(@Bind("activityId") UUID activityId);

    @SqlUpdate("INSERT INTO activity_day (id, activity_id, title, description, images, track, markers, directions, created_at, created_by) values (:id, :activityId, :title, :description, :images::json, :track::json, :markers::json, :directions, :createdAt, :createdBy)")
    void insert(@BindBean ActivityDay activityDay);

    @SqlUpdate("UPDATE activity_day SET title=:title, description=:description, images=:images::json, track=:track::json, markers=:markers::json, directions=:directions, updated_at=:updatedAt, updated_by=:updatedBy WHERE id=:id AND deleted_at IS NULL ")
    void update(@BindBean ActivityDay activityDay);
    
    @SqlUpdate("UPDATE activity_day SET deleted_at=:deletedAt, deleted_by=:deletedBy WHERE id=:id AND deleted_at IS NULL ")
    void delete(@BindBean ActivityDay activityDay);
}

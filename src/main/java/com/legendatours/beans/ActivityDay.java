package com.legendatours.beans;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

import org.jdbi.v3.json.Json;

public class ActivityDay extends AbstractBean {
    private final UUID id;
    private final UUID activityId;
    private final String title;
    private final String description;
    @Json
    private final List<Image> images;
    @Json
    private final Track track;
    @Json
    private final List<Marker> markers;
    private final String directions;

    public ActivityDay() {
        this(null, null, null, null, null, null, null, null, null, null, null, null, null, null);
    }

    public ActivityDay(UUID id, UUID activityId, String title, String description, List<Image> images, Track track, List<Marker> markers, String directions,
            OffsetDateTime createdAt, UUID createdBy) {
        this(id, activityId, title, description, images, track, markers, directions, createdAt, createdBy, null, null, null, null);
    }
    
    public ActivityDay(UUID id, UUID activityId, String title, String description, List<Image> images, Track track, List<Marker> markers, String directions,
            OffsetDateTime createdAt, UUID createdBy, OffsetDateTime updatedAt, UUID updatedBy) {
        this(id, activityId, title, description, images, track, markers, directions, createdAt, createdBy, updatedAt, updatedBy, null, null);
    }

    public ActivityDay(UUID id, UUID activityId, String title, String description, List<Image> images, Track track, List<Marker> markers, String directions,
            OffsetDateTime createdAt, UUID createdBy, OffsetDateTime updatedAt, UUID updatedBy, OffsetDateTime deletedAt, UUID deletedBy) {
        super(createdAt, createdBy, updatedAt, updatedBy, deletedAt, deletedBy);
        this.id = id;
        this.activityId = activityId;
        this.title = title;
        this.description = description;
        this.images = images;
        this.track = track;
        this.markers = markers;
        this.directions = directions;
    }

    public UUID getId() {
        return id;
    }

    public UUID getActivityId() {
        return activityId;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    @Json
    public List<Image> getImages() {
        return images;
    }

    @Json
    public Track getTrack() {
        return track;
    }

    @Json
    public List<Marker> getMarkers() {
        return markers;
    }

    public String getDirections() {
        return directions;
    }
}

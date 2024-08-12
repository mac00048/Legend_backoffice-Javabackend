package com.legendatours.beans;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

import org.jdbi.v3.json.Json;

public class Activity extends AbstractBean {
    private final UUID id;
    private final String title;
    private final String subtitle;
    private final String description;
    @Json
    private List<Image> images;

    public Activity() {
        this(null, null, null, null, null, null, null, null, null, null, null);
    }

    public Activity(UUID id, String title, String subtitle, String description, List<Image> images,
            OffsetDateTime createdAt, UUID createdBy) {
        this(id, title, subtitle, description, images, createdAt, createdBy, null, null, null, null);
    }

    public Activity(UUID id, String title, String subtitle, String description, List<Image> images,
            OffsetDateTime createdAt, UUID createdBy, OffsetDateTime updatedAt, UUID updatedBy) {
        this(id, title, subtitle, description, images, createdAt, createdBy, updatedAt, updatedBy, null, null);
    }

    public Activity(UUID id, String title, String subtitle, String description, List<Image> images,
            OffsetDateTime createdAt, UUID createdBy, OffsetDateTime updatedAt, UUID updatedBy, OffsetDateTime deletedAt, UUID deletedBy) {
        super(createdAt, createdBy, updatedAt, updatedBy, deletedAt, deletedBy);
        this.id = id;
        this.title = title;
        this.subtitle = subtitle;
        this.description = description;
        this.images = images;
    }

    public UUID getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getSubtitle() {
        return subtitle;
    }

    public String getDescription() {
        return description;
    }

    @Json
    public List<Image> getImages() {
        return images;
    }
}

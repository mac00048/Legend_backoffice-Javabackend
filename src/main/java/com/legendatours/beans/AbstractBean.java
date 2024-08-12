package com.legendatours.beans;

import java.time.OffsetDateTime;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonFormat;

public abstract class AbstractBean extends AbstractCreateBean {
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    private final OffsetDateTime updatedAt;
    private final UUID updatedBy;
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    private final OffsetDateTime deletedAt;
    private final UUID deletedBy;

    public AbstractBean(OffsetDateTime createdAt, UUID createdBy, OffsetDateTime updatedAt, UUID updatedBy) {
        this(createdAt, createdBy, updatedAt, updatedBy, null, null);
    }

    public AbstractBean(OffsetDateTime createdAt, UUID createdBy, OffsetDateTime updatedAt, UUID updatedBy, OffsetDateTime deletedAt, UUID deletedBy) {
        super(createdAt, createdBy);
        this.updatedAt = updatedAt;
        this.updatedBy = updatedBy;
        this.deletedAt = deletedAt;
        this.deletedBy = deletedBy;
    }

    public OffsetDateTime getUpdatedAt() {
        return updatedAt;
    }

    public UUID getUpdatedBy() {
        return updatedBy;
    }

    public OffsetDateTime getDeletedAt() {
        return deletedAt;
    }

    public UUID getDeletedBy() {
        return deletedBy;
    }
}

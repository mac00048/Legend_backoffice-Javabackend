package com.legendatours.beans;

import java.time.OffsetDateTime;
import java.util.UUID;

import com.fasterxml.jackson.annotation.JsonFormat;

public abstract class AbstractCreateBean extends AbstractMetaBean {
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    private final OffsetDateTime createdAt;
    private final UUID createdBy;

    public AbstractCreateBean() {
        this(null, null, null);
    }

    public AbstractCreateBean(OffsetDateTime createdAt, UUID createdBy) {
        this(createdAt, createdBy, null);
    }

    public AbstractCreateBean(OffsetDateTime createdAt, UUID createdBy, String createdByName) {
        super();
        this.createdAt = createdAt;
        this.createdBy = createdBy;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }

    public UUID getCreatedBy() {
        return createdBy;
    }
}

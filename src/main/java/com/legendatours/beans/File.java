package com.legendatours.beans;

import java.time.OffsetDateTime;
import java.util.UUID;

public class File extends AbstractCreateBean {
    private final UUID id;
    private final String name;
    private final String type;
    private final Long size;
    private final byte[] content;

    public File() {
        this(null, null, null, null, null, null, null);
    }
    
    public File(UUID id, String name, String type, Long size, byte[] content, OffsetDateTime createdAt, UUID createdBy) {
        super(createdAt, createdBy);
        this.id = id;
        this.name = name;
        this.type = type;
        this.size = size;
        this.content = content;
    }

    public UUID getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getType() {
        return type;
    }

    public Long getSize() {
        return size;
    }

    public byte[] getContent() {
        return content;
    }
}

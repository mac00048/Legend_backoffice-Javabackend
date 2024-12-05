package com.legendatours.beans;

import java.util.UUID;

public class Document {
    private final UUID fileId;
    private final String title;
    private final String type;
    private final Long size; // Size of the document in bytes

    public Document() {
        this(null, null, null, null);
    }

    public Document(UUID fileId, String title, String type, Long size) {
        this.fileId = fileId;
        this.title = title;
        this.type = type;
        this.size = size;
    }

    public UUID getFileId() {
        return fileId;
    }

    public String getTitle() {
        return title;
    }

    public String getType() {
        return type;
    }

    public Long getSize() {
        return size;
    }
}

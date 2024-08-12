package com.legendatours.beans;

import java.util.UUID;

public class Image {
    private final UUID fileId;
    private final String title;
    private final Integer width;
    private final Integer height;
    private final String type;

    public Image() {
        this(null, null, null, null, null);
    }

    public Image(UUID fileId, String title, Integer width, Integer height, String type) {
        this.fileId = fileId;
        this.title = title;
        this.width = width;
        this.height = height;
        this.type = type;
    }

    public UUID getFileId() {
        return fileId;
    }

    public String getTitle() {
        return title;
    }

    public Integer getHeight() {
        return height;
    }
    
    public Integer getWidth() {
        return width;
    }

    public String getType() {
        return type;
    }
}

package com.legendatours.beans;

public class Marker extends Coordinate {
    private final MarkerType type;
    private final String description;

    public Marker() {
        this(null, null, null, null, null);
    }

    public Marker(final MarkerType type, final String description, final Double latitude, final Double longitude, final Double elevation) {
        super(latitude, longitude, elevation);
        this.type = type;
        this.description = description;
    }

    public MarkerType getType() {
        return type;
    }

    public String getDescription() {
        return description;
    }
}

package com.legendatours.beans;

public class Coordinate {
    private final Double latitude;
    private final Double longitude;
    private final Double elevation;

    public Coordinate() {
        this(null, null, null);
    }

    public Coordinate(final Double latitude, final Double longitude, final Double elevation) {
        this.latitude = latitude;
        this.longitude = longitude;
        this.elevation = elevation;
    }

    public Double getLatitude() {
        return latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public Double getElevation() {
        return elevation;
    }
}

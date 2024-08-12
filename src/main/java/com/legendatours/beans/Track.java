package com.legendatours.beans;

import java.util.List;
import java.util.UUID;

public class Track {
    private final List<UUID> files;
    private final List<List<Coordinate>> routes;

    @Deprecated
    private final List<Coordinate> points;

    public Track() {
        this(null, null, null);
    }

    public Track(List<UUID> files, List<List<Coordinate>> routes, List<Coordinate> points) {
        this.files = files;
        this.routes = routes;
        this.points = points;
    }

    public List<UUID> getFiles() {
        return files;
    }

    public List<List<Coordinate>> getRoutes() {
        return routes;
    }

    @Deprecated
    public List<Coordinate> getPoints() {
        return points;
    }
}

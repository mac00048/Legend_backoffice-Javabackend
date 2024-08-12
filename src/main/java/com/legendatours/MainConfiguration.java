package com.legendatours;

import io.dropwizard.Configuration;
import io.dropwizard.db.DataSourceFactory;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;

public class MainConfiguration extends Configuration {
    @Valid
    @NotNull
    private final DataSourceFactory database;

    public MainConfiguration() {
        this(null);
    }

    public MainConfiguration(final DataSourceFactory database) {
        this.database = database;
    }

    public DataSourceFactory getDatabase() {
        return database;
    }
}

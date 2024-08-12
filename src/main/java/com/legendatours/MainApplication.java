package com.legendatours;

import java.util.EnumSet;

import javax.servlet.DispatcherType;

import com.legendatours.filter.AuthenticationFilter;
import com.legendatours.filter.SpaFilter;
import com.legendatours.resource.ActivityDayResource;
import com.legendatours.resource.ActivityResource;
import com.legendatours.resource.FileResource;
import com.legendatours.resource.RedeemResource;
import com.legendatours.resource.SessionResource;
import com.legendatours.resource.VoucherResource;

import org.eclipse.jetty.server.session.SessionHandler;
import org.glassfish.jersey.server.filter.RolesAllowedDynamicFeature;
import org.jdbi.v3.core.Jdbi;
import org.jdbi.v3.jackson2.Jackson2Plugin;
import org.jdbi.v3.sqlobject.SqlObjectPlugin;

import io.dropwizard.Application;
import io.dropwizard.assets.AssetsBundle;
import io.dropwizard.auth.AuthDynamicFeature;
import io.dropwizard.forms.MultiPartBundle;
import io.dropwizard.jdbi3.JdbiFactory;
import io.dropwizard.setup.Bootstrap;
import io.dropwizard.setup.Environment;

public class MainApplication extends Application<MainConfiguration> {

    public static void main(final String[] args) throws Exception {
        new MainApplication().run(args);
    }

    @Override
    public String getName() {
        return "backoffice.legendatours.com";
    }

    @Override
    public void initialize(final Bootstrap<MainConfiguration> bootstrap) {
        bootstrap.addBundle(new AssetsBundle("/assets/", "/", "index.html"));
        bootstrap.addBundle(new MultiPartBundle());
    }

    @Override
    public void run(final MainConfiguration configuration, final Environment environment) {
        final JdbiFactory factory = new JdbiFactory();
        final Jdbi jdbi = factory.build(environment, configuration.getDatabase(), "postgresql");
        jdbi.installPlugin(new SqlObjectPlugin());
        jdbi.installPlugin(new Jackson2Plugin());

        // SPA request filter
        environment.servlets().addFilter("spa-filter", new SpaFilter()).addMappingForUrlPatterns(EnumSet.allOf(DispatcherType.class), true, "/*");

        // HTTP Session
        environment.servlets().setSessionHandler(new SessionHandler());

        // authentication filter
        environment.jersey().register(new AuthDynamicFeature(AuthenticationFilter.class));
        environment.jersey().register(RolesAllowedDynamicFeature.class);

        // API
        environment.jersey().register(new SessionResource(jdbi));
        environment.jersey().register(new ActivityResource(jdbi));
        environment.jersey().register(new ActivityDayResource(jdbi));
        environment.jersey().register(new FileResource(jdbi));
        environment.jersey().register(new VoucherResource(jdbi));
        environment.jersey().register(new RedeemResource(jdbi));
        environment.jersey().setUrlPattern("/api/*");
    }
}

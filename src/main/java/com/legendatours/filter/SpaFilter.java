package com.legendatours.filter;

import java.io.IOException;
import java.util.concurrent.atomic.AtomicBoolean;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpServletResponseWrapper;

public class SpaFilter implements Filter {

    @Override
    public void init(final FilterConfig filterConfig) throws ServletException {
        // empty
    }

    @Override
    public void doFilter(final ServletRequest request, final ServletResponse response, final FilterChain chain) throws IOException, ServletException {
        final AtomicBoolean notFound = new AtomicBoolean(false);

        chain.doFilter(request, new HttpServletResponseWrapper((HttpServletResponse) response) {
            @Override
            public void sendError(int statusCode) throws IOException {
                if (statusCode != 404) {
                    super.sendError(statusCode);
                } else {
                    notFound.set(true);
                }
            }

            @Override
            public void sendError(int statusCode, String msg) throws IOException {
                if (statusCode != 404) {
                    super.sendError(statusCode, msg);
                } else { 
                    notFound.set(true);
                }
            }

            @Override
            public void setStatus(int statusCode) {
                if (statusCode != 404) {
                    super.setStatus(statusCode);
                } else  {
                    notFound.set(true);
                }
            }
        });

        if (notFound.get()) {
            request.getServletContext().getRequestDispatcher("/").forward(request, response);
        }
    }

    @Override
    public void destroy() {
        // empty
    }
}

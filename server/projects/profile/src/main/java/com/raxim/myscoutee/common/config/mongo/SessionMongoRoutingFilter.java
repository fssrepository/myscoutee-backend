package com.raxim.myscoutee.common.config.mongo;

import java.io.IOException;

import org.springframework.web.filter.OncePerRequestFilter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class SessionMongoRoutingFilter extends OncePerRequestFilter {
    public static final String SESSION_KIND_HEADER = "X-App-Session-Kind";
    private static final String DEMO_USERS_ROUTE = "/auth/demo-users";

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {
        MongoSessionModeContext.set(resolveMode(request));
        try {
            filterChain.doFilter(request, response);
        } finally {
            MongoSessionModeContext.clear();
        }
    }

    private MongoSessionMode resolveMode(HttpServletRequest request) {
        String requestUri = request == null ? null : request.getRequestURI();
        if (requestUri != null && requestUri.endsWith(DEMO_USERS_ROUTE)) {
            return MongoSessionMode.DEMO;
        }
        String sessionKind = request == null ? null : request.getHeader(SESSION_KIND_HEADER);
        return MongoSessionMode.fromRequestValue(sessionKind);
    }
}

package com.raxim.myscoutee.microservices.transport.events;

import java.io.IOException;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.core.annotation.Order;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

/** Explicit import in the events owner only; no broad component scan. */
@Configuration(proxyBeanMethods = false)
@Import(EventMediaVisibilityEndpoint.class)
public class EventMediaVisibilityServerConfiguration {
    @Bean @Order(60)
    SecurityFilterChain eventsMediaReadAccess(HttpSecurity http,
            @Value("${myscoutee.remote.events-media.read-token}") String token) throws Exception {
        var filter = new com.raxim.myscoutee.microservices.transport.common.InternalReadCredentialFilter(token, "events:media:read");
        return http.securityMatcher(EventMediaVisibilityProtocol.PATH, EventMediaVisibilityProtocol.MEMBERSHIP_PATH)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .csrf(AbstractHttpConfigurer::disable)
                .requestCache(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(rules -> rules
                        .requestMatchers(org.springframework.http.HttpMethod.POST, EventMediaVisibilityProtocol.PATH)
                        .hasAuthority("events:media:read")
                        .requestMatchers(org.springframework.http.HttpMethod.GET, EventMediaVisibilityProtocol.MEMBERSHIP_PATH)
                        .hasAuthority("events:media:read").anyRequest().denyAll())
                .addFilterBefore(filter, UsernamePasswordAuthenticationFilter.class)
                .exceptionHandling(errors -> errors.accessDeniedHandler((request, response, error) ->
                        fail(response, 403, "FORBIDDEN")))
                .build();
    }

    static void fail(HttpServletResponse response, int status, String code) throws IOException {
        response.setStatus(status);
        response.setContentType("application/json");
        response.setHeader("Cache-Control", "no-store");
        response.getWriter().write("{\"code\":\"" + code + "\"}");
    }

}

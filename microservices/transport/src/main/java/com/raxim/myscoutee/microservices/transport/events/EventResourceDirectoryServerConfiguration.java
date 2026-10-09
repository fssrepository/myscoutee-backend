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
@Import(EventResourceDirectoryEndpoint.class)
public class EventResourceDirectoryServerConfiguration {
    @Bean @Order(117)
    SecurityFilterChain eventResourceDirectoryReadAccess(HttpSecurity http,
            @Value("${myscoutee.remote.event-resource-directory.read-token}") String token) throws Exception {
        var filter = new com.raxim.myscoutee.microservices.transport.common.InternalReadCredentialFilter(token, "events:event-resource-directory:read");
        return http.securityMatcher(EventResourceDirectoryProtocol.paths())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .csrf(AbstractHttpConfigurer::disable)
                .requestCache(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(rules -> rules
                        .requestMatchers(org.springframework.http.HttpMethod.POST, EventResourceDirectoryProtocol.paths())
                        .hasAuthority("events:event-resource-directory:read").anyRequest().denyAll())
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

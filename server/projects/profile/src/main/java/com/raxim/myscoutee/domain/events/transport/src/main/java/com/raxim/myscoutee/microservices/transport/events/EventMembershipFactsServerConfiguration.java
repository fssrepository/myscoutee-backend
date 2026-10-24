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
import org.springframework.security.web.csrf.CsrfFilter;

/** Explicit import in the events owner only; no broad component scan. */
@Configuration(proxyBeanMethods = false)
@Import(EventMembershipFactsEndpoint.class)
public class EventMembershipFactsServerConfiguration {
    // Reviewed service-only CSRF exemption; see ../myscoutee-sonarqube/REVIEWED_FINDINGS.md.
    @SuppressWarnings("java:S4502")
    @Bean @Order(20)
    SecurityFilterChain eventmembershipfactsReadAccess(HttpSecurity http,
            @Value("${myscoutee.remote.event-membership-facts.read-token}") String token) throws Exception {
        var filter = new com.raxim.myscoutee.microservices.transport.common.InternalReadCredentialFilter(token, "events:membership-facts:read");
        return http.securityMatcher("/_internal/v1/events/membership-facts")
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .csrf(csrf -> csrf.ignoringRequestMatchers(
                        com.raxim.myscoutee.microservices.transport.common.InternalReadCredentialFilter::verifiedServiceRequest))
                .requestCache(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(rules -> rules
                        .requestMatchers(org.springframework.http.HttpMethod.GET, EventMembershipFactsProtocol.PATH)
                        .hasAuthority("events:membership-facts:read").anyRequest().denyAll())
                .addFilterBefore(filter, CsrfFilter.class)
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

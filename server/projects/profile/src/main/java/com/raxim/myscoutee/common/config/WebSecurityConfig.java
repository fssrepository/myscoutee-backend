package com.raxim.myscoutee.common.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.data.repository.query.SecurityEvaluationContextExtension;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;
import org.springframework.security.web.header.writers.ReferrerPolicyHeaderWriter;

import com.raxim.myscoutee.common.config.bootstrap.OperatorBootstrapAuthenticationFilter;
import com.raxim.myscoutee.common.config.bootstrap.OperatorBootstrapAuthenticationService;
import com.raxim.myscoutee.common.config.bootstrap.OperatorBootstrapRequestSupport;
import com.raxim.myscoutee.common.config.firebase.FirebaseAuthenticationProvider;
import com.raxim.myscoutee.common.config.firebase.FirebaseFilter;
import com.raxim.myscoutee.common.config.mongo.DemoSessionRequestSupport;
import com.raxim.myscoutee.common.config.mongo.SessionMongoRoutingFilter;
import com.raxim.myscoutee.common.config.firebase.FirebaseService;
import com.raxim.myscoutee.common.config.firebase.FirebaseTokenVerifier;
import com.raxim.myscoutee.common.config.properties.ConfigProperties;
import com.raxim.myscoutee.profile.service.UserLoginSessionService;
import com.raxim.myscoutee.profile.service.media.MediaSessionAccessService;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class WebSecurityConfig {

    private final FirebaseService firebaseService;
    private final FirebaseAuthenticationProvider firebaseProvider;
    private final FirebaseTokenVerifier firebaseTokenVerifier;
    private final OperatorBootstrapAuthenticationService
            operatorBootstrapAuthenticationService;
    private final ConfigProperties configProperties;
    private final UserLoginSessionService userLoginSessionService;
    private final MediaSessionAccessService mediaSessionAccess;

    public WebSecurityConfig(FirebaseService firebaseService,
            FirebaseAuthenticationProvider firebaseProvider,
            FirebaseTokenVerifier firebaseTokenVerifier,
            OperatorBootstrapAuthenticationService
                    operatorBootstrapAuthenticationService,
            ConfigProperties configProperties,
            UserLoginSessionService userLoginSessionService,
            MediaSessionAccessService mediaSessionAccess) {
        this.firebaseService = firebaseService;
        this.firebaseProvider = firebaseProvider;
        this.firebaseTokenVerifier = firebaseTokenVerifier;
        this.operatorBootstrapAuthenticationService =
                operatorBootstrapAuthenticationService;
        this.configProperties = configProperties;
        this.userLoginSessionService = userLoginSessionService;
        this.mediaSessionAccess = mediaSessionAccess;
    }

    @Autowired
    protected void registerProvider(AuthenticationManagerBuilder auth) {
        auth.authenticationProvider(firebaseProvider);
    }

    @Bean
    SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.addFilterBefore(sessionMongoRoutingFilter(), BasicAuthenticationFilter.class)
                .addFilterAfter(
                        operatorBootstrapAuthenticationFilter(),
                        SessionMongoRoutingFilter.class)
                .addFilterAfter(
                        tokenAuthorizationFilter(),
                        OperatorBootstrapAuthenticationFilter.class)
                .authorizeHttpRequests(authorizeRequests -> {
                    authorizeRequests.requestMatchers("/shutdown").denyAll();
                    authorizeRequests.requestMatchers("/media/private", "/api/media/private").hasAuthority("MEDIA");
                    authorizeRequests.requestMatchers("/metrics").hasAuthority("A");
                    authorizeRequests.requestMatchers("/operator/**", "/api/operator/**").hasAuthority("O");
                    authorizeRequests.requestMatchers(
                            "/health",
                            "/error",
                            "/auth/eligibility",
                            "/auth/demo-users",
                            "/api/auth/demo-users",
                            OperatorBootstrapRequestSupport.LOGIN_PATH,
                            OperatorBootstrapRequestSupport.API_LOGIN_PATH,
                            "/auth/facebook/data-deletion",
                            "/auth/facebook/data-deletion/status",
                            "/i18n/bundle",
                            "/api/i18n/bundle",
                            "/deployment/configuration",
                            "/api/deployment/configuration",
                            "/deployment/configuration/firebase-config",
                            "/api/deployment/configuration/firebase-config",
                            "/payment/webhooks/stripe",
                            "/api/payment/webhooks/stripe",
                            "/payment/webhooks/barion",
                            "/api/payment/webhooks/barion",
                            "/payment-methods/registrations/callback",
                            "/api/payment-methods/registrations/callback",
                            "/landing/**",
                            "/help/active",
                            "/privacy/active",
                            "/terms/active",
                            "/explanation/active",
                            "/css/**",
                            "/js/**",
                            "/img/**",
                            "/lib/**",
                            "/favicon.ico",
                            "/user/profile/images/**",
                            "/games/*/*/images/**",
                            "/media/public",
                            "/media/public/**",
                            "/user/cars/*/images/**",
                            "/user/groups/images/**",
                            "/history/events/*/members/*/images/**")
                            .permitAll();
                    if (configProperties.isMemberFallbackEnabled()
                            && !operatorBootstrapAuthenticationService
                                    .isConfigured()) {
                        authorizeRequests.anyRequest().permitAll();
                    } else if (configProperties.isChatOnlyMode()) {
                        authorizeRequests.requestMatchers("/activities/chats/**").authenticated()
                                .anyRequest().denyAll();
                    } else {
                        authorizeRequests.requestMatchers(DemoSessionRequestSupport::isAllowedDemoSessionRequest).permitAll();
                        authorizeRequests.requestMatchers("/admin/**", "/api/admin/**").hasAuthority("A")
                                .anyRequest().authenticated();
                    }
                })
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .headers(headers -> headers
                        .frameOptions(frameOptions -> frameOptions.deny())
                        .referrerPolicy(referrerPolicy -> referrerPolicy
                                .policy(ReferrerPolicyHeaderWriter.ReferrerPolicy.STRICT_ORIGIN_WHEN_CROSS_ORIGIN))
                        .permissionsPolicyHeader(permissionsPolicy -> permissionsPolicy
                                .policy("geolocation=(), microphone=(), camera=()")))
                .httpBasic(httpBasic -> httpBasic.disable())
                .csrf(csrf -> csrf.disable());
        return http.build();
    }

    private FirebaseFilter tokenAuthorizationFilter() {
        return new FirebaseFilter(
                firebaseService,
                configProperties,
                firebaseTokenVerifier,
                userLoginSessionService,
                mediaSessionAccess);
    }

    private OperatorBootstrapAuthenticationFilter
            operatorBootstrapAuthenticationFilter() {
        return new OperatorBootstrapAuthenticationFilter(
                operatorBootstrapAuthenticationService,
                configProperties);
    }

    private SessionMongoRoutingFilter sessionMongoRoutingFilter() {
        return new SessionMongoRoutingFilter(configProperties);
    }

    @Bean
    SecurityEvaluationContextExtension securityEvaluationContextExtension() {
        return new SecurityEvaluationContextExtension();
    }
}

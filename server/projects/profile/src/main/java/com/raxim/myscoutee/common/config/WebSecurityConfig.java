package com.raxim.myscoutee.common.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.data.repository.query.SecurityEvaluationContextExtension;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;

import com.raxim.myscoutee.common.config.firebase.FirebaseAuthenticationProvider;
import com.raxim.myscoutee.common.config.firebase.FirebaseFilter;
import com.raxim.myscoutee.common.config.firebase.FirebaseService;
import com.raxim.myscoutee.common.config.properties.ConfigProperties;

@Configuration
@EnableWebSecurity
public class WebSecurityConfig {

    private final FirebaseService firebaseService;
    private final FirebaseAuthenticationProvider firebaseProvider;
    private final ConfigProperties configProperties;

    public WebSecurityConfig(FirebaseService firebaseService,
            FirebaseAuthenticationProvider firebaseProvider,
            ConfigProperties configProperties) {
        this.firebaseService = firebaseService;
        this.firebaseProvider = firebaseProvider;
        this.configProperties = configProperties;
    }

    @Autowired
    protected void registerProvider(AuthenticationManagerBuilder auth) {
        auth.authenticationProvider(firebaseProvider);
    }

    @Bean
    SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.addFilterBefore(tokenAuthorizationFilter(), BasicAuthenticationFilter.class)
                .authorizeHttpRequests(authorizeRequests -> {
                    authorizeRequests.requestMatchers(
                            "/health",
                            "/metrics",
                            "/shutdown",
                            "/error",
                            "/auth/eligibility",
                            "/css/**",
                            "/js/**",
                            "/img/**",
                            "/lib/**",
                            "/favicon.ico",
                            "/user/profile/images/**",
                            "/games/*/*/images/**",
                            "/media/public/**",
                            "/user/cars/*/images/**",
                            "/user/groups/images/**",
                            "/history/events/*/members/*/images/**")
                            .permitAll();
                    if (!configProperties.isFirebaseEnabled()) {
                        authorizeRequests.anyRequest().permitAll();
                    } else if (configProperties.isChatOnlyMode()) {
                        authorizeRequests.requestMatchers("/activities/chats/**").authenticated()
                                .anyRequest().denyAll();
                    } else {
                        authorizeRequests.anyRequest().authenticated();
                    }
                })
                .httpBasic(httpBasic -> httpBasic.disable())
                .csrf(csrf -> csrf.disable());
        return http.build();
    }

    private FirebaseFilter tokenAuthorizationFilter() {
        return new FirebaseFilter(firebaseService, configProperties);
    }

    @Bean
    SecurityEvaluationContextExtension securityEvaluationContextExtension() {
        return new SecurityEvaluationContextExtension();
    }
}

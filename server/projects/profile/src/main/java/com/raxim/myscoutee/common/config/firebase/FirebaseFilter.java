package com.raxim.myscoutee.common.config.firebase;

import java.io.IOException;
import java.util.Objects;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.filter.OncePerRequestFilter;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseToken;
import com.raxim.myscoutee.common.config.firebase.dto.FirebaseCredential;
import com.raxim.myscoutee.common.config.firebase.exception.FirebaseTokenInvalidException;
import com.raxim.myscoutee.common.config.properties.ConfigProperties;
import com.raxim.myscoutee.common.config.properties.MqttProperties;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class FirebaseFilter extends OncePerRequestFilter {
    private static final String AUTH_FIREBASE = "X-Authorization-Firebase";
    private static final String AUTH_USER = "X-Authorization-User";
    private static final String AUTH_LINK = "X-Authorization-Link";

    private final FirebaseService firebaseService;
    private final MqttProperties mqttProperties;
    private final ConfigProperties configProperties;

    public FirebaseFilter(FirebaseService firebaseService, MqttProperties mqttProperties, ConfigProperties configProperties) {
        this.firebaseService = firebaseService;
        this.mqttProperties = mqttProperties;
        this.configProperties = configProperties;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {
        if (!configProperties.isFirebaseEnabled()) {
            authenticateWithoutFirebase(request);
            filterChain.doFilter(request, response);
            return;
        }

        String xAuth = request.getHeader(AUTH_FIREBASE);
        if (xAuth == null || xAuth.isBlank()) {

            if (request.getRequestURI().startsWith("/mqtt")
                    && request.getRemoteAddr().equals(mqttProperties.getServerIp())) {

                xAuth = request.getHeader(AUTH_USER);
                if (xAuth != null && !xAuth.isBlank()) {
                    UserDetails userDetails = firebaseService.loadUserById(xAuth);
                    setAuthentication(userDetails, null);
                }
            }
            filterChain.doFilter(request, response);
        } else {
            try {
                FirebaseCredential credential = parseToken(xAuth);
                String xLink = request.getHeader(AUTH_LINK);

                UserDetails userDetails = firebaseService.loadUserByUsername(credential.getEmail(), xLink, request.getRequestURI());
                setAuthentication(userDetails, credential);

                filterChain.doFilter(request, response);
            } catch (FirebaseTokenInvalidException e) {
                throw new SecurityException(e);
            }
        }
    }

    public FirebaseCredential parseToken(String firebaseToken) {
        Objects.requireNonNull(firebaseToken, "FirebaseToken must not be null or blank");
        try {
            FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(firebaseToken);
            return new FirebaseCredential(decodedToken);
        } catch (Exception e) {
            throw new FirebaseTokenInvalidException(e.getMessage());
        }
    }

    private void authenticateWithoutFirebase(HttpServletRequest request) {
        if (request.getRequestURI().startsWith("/mqtt")
                && request.getRemoteAddr().equals(mqttProperties.getServerIp())) {
            String profileId = request.getHeader(AUTH_USER);
            if (profileId != null && !profileId.isBlank()) {
                UserDetails userDetails = firebaseService.loadUserById(profileId);
                setAuthentication(userDetails, null);
                return;
            }
        }

        String devUser = configProperties.getDevUser();
        if (devUser == null || devUser.isBlank()) {
            return;
        }

        UserDetails userDetails = firebaseService.loadUserByUsername(
                devUser,
                request.getHeader(AUTH_LINK),
                request.getRequestURI());
        setAuthentication(userDetails, null);
    }

    private void setAuthentication(UserDetails userDetails, Object credentials) {
        if (userDetails == null) {
            return;
        }
        Authentication auth = new FirebaseAuthenticationToken(userDetails, credentials,
                userDetails.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(auth);
    }
}

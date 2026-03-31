package com.raxim.myscoutee.common.config.firebase;

import java.io.IOException;
import java.util.Objects;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseToken;
import com.raxim.myscoutee.common.config.firebase.dto.FirebaseCredential;
import com.raxim.myscoutee.common.config.firebase.exception.FirebaseTokenInvalidException;
import com.raxim.myscoutee.common.config.properties.ConfigProperties;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class FirebaseFilter extends OncePerRequestFilter {
    private static final String AUTH_FIREBASE = "X-Authorization-Firebase";
    private static final String AUTH_LINK = "X-Authorization-Link";
    private static final String AUTHORIZATION = "Authorization";

    private final FirebaseService firebaseService;
    private final ConfigProperties configProperties;

    public FirebaseFilter(FirebaseService firebaseService, ConfigProperties configProperties) {
        this.firebaseService = firebaseService;
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

        String firebaseToken = extractFirebaseToken(request);
        if (firebaseToken == null || firebaseToken.isBlank()) {
            filterChain.doFilter(request, response);
            return;
        }

        try {
            FirebaseCredential credential = parseToken(firebaseToken);
            String xLink = request.getHeader(AUTH_LINK);

            UserDetails userDetails = firebaseService.loadUserByUsername(credential.getEmail(), xLink, request.getRequestURI());
            setAuthentication(userDetails, credential);

            filterChain.doFilter(request, response);
        } catch (FirebaseTokenInvalidException e) {
            throw new SecurityException(e);
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
        String requestedUserId = normalizeRequestUserId(request);
        UserDetails userDetails;
        if (StringUtils.hasText(requestedUserId)) {
            userDetails = firebaseService.loadUserById(requestedUserId);
        } else {
            String devUser = configProperties.getDevUser();
            if (devUser == null || devUser.isBlank()) {
                return;
            }
            userDetails = firebaseService.loadUserByUsername(
                    devUser,
                    request.getHeader(AUTH_LINK),
                    request.getRequestURI());
        }
        setAuthentication(userDetails, null);
    }

    private String normalizeRequestUserId(HttpServletRequest request) {
        String requestedUserId = request.getParameter("userId");
        if (requestedUserId == null) {
            return null;
        }
        String normalizedUserId = requestedUserId.trim();
        return normalizedUserId.isEmpty() ? null : normalizedUserId;
    }

    private String extractFirebaseToken(HttpServletRequest request) {
        String token = request.getHeader(AUTH_FIREBASE);
        if (token != null && !token.isBlank()) {
            return token;
        }
        String authorization = request.getHeader(AUTHORIZATION);
        if (authorization != null && authorization.startsWith("Bearer ")) {
            return authorization.substring("Bearer ".length()).trim();
        }
        String queryToken = request.getParameter("token");
        if (queryToken != null && !queryToken.isBlank()) {
            return queryToken.trim();
        }
        return null;
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

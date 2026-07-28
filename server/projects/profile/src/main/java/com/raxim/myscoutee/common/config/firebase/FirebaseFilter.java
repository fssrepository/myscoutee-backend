package com.raxim.myscoutee.common.config.firebase;

import java.io.IOException;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import com.raxim.myscoutee.common.config.firebase.dto.FirebaseCredential;
import com.raxim.myscoutee.common.config.firebase.exception.FirebaseTokenInvalidException;
import com.raxim.myscoutee.common.config.mongo.DemoSessionRequestSupport;
import com.raxim.myscoutee.common.config.properties.ConfigProperties;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class FirebaseFilter extends OncePerRequestFilter {
    private static final String AUTH_FIREBASE = "X-Authorization-Firebase";
    private static final String AUTH_LINK = "X-Authorization-Link";
    private static final String AUTHORIZATION = "Authorization";
    private static final String DEMO_USER_ID = "X-Demo-User-Id";

    private final FirebaseService firebaseService;
    private final ConfigProperties configProperties;
    private final FirebaseTokenVerifier firebaseTokenVerifier;

    public FirebaseFilter(
            FirebaseService firebaseService,
            ConfigProperties configProperties,
            FirebaseTokenVerifier firebaseTokenVerifier) {
        this.firebaseService = firebaseService;
        this.configProperties = configProperties;
        this.firebaseTokenVerifier = firebaseTokenVerifier;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {
        if (DemoSessionRequestSupport.isOperatorRequest(request)
                && (DemoSessionRequestSupport.isDemoSessionRequest(request)
                        || !configProperties.isFirebaseEnabled())) {
            authenticateDemoOperator(request);
            filterChain.doFilter(request, response);
            return;
        }

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

            UserDetails userDetails = firebaseService.loadUserByCredential(credential, xLink, request.getRequestURI());
            setAuthentication(userDetails, credential);

            filterChain.doFilter(request, response);
        } catch (FirebaseTokenInvalidException e) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid Firebase token.");
        }
    }

    public FirebaseCredential parseToken(String firebaseToken) {
        return firebaseTokenVerifier.verify(firebaseToken);
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

    private void authenticateDemoOperator(HttpServletRequest request) {
        String requestedUserId = request == null ? null : request.getHeader(DEMO_USER_ID);
        if (!StringUtils.hasText(requestedUserId)) {
            return;
        }
        UserDetails userDetails = firebaseService.loadDemoOperatorById(requestedUserId.trim());
        if (userDetails == null
                || userDetails.getAuthorities().stream()
                        .noneMatch(authority -> "O".equals(authority.getAuthority()))) {
            return;
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
            return isWebSocketTokenRequest(request) ? queryToken.trim() : null;
        }
        return null;
    }

    private boolean isWebSocketTokenRequest(HttpServletRequest request) {
        String requestUri = request == null ? "" : request.getRequestURI();
        return requestUri.endsWith("/activities/chats/ws")
                || requestUri.endsWith("/admin/notifications/ws");
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

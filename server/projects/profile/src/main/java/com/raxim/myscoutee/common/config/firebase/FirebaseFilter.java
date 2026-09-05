package com.raxim.myscoutee.common.config.firebase;

import java.io.IOException;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import com.raxim.myscoutee.common.config.bootstrap.OperatorBootstrapRequestSupport;
import com.raxim.myscoutee.common.config.firebase.dto.FirebaseCredential;
import com.raxim.myscoutee.common.config.firebase.dto.FirebasePrincipal;
import com.raxim.myscoutee.common.config.firebase.exception.FirebaseTokenInvalidException;
import com.raxim.myscoutee.common.config.mongo.DemoSessionRequestSupport;
import com.raxim.myscoutee.common.config.properties.ConfigProperties;
import com.raxim.myscoutee.profile.service.UserLoginSessionService;

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
    private final UserLoginSessionService userLoginSessionService;

    public FirebaseFilter(
            FirebaseService firebaseService,
            ConfigProperties configProperties,
            FirebaseTokenVerifier firebaseTokenVerifier,
            UserLoginSessionService userLoginSessionService) {
        this.firebaseService = firebaseService;
        this.configProperties = configProperties;
        this.firebaseTokenVerifier = firebaseTokenVerifier;
        this.userLoginSessionService = userLoginSessionService;
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {
        // A fresh local-operator login must not be rejected because the browser
        // still carries an expired Firebase credential from an earlier session.
        if (OperatorBootstrapRequestSupport.isLoginRequest(request)) {
            filterChain.doFilter(request, response);
            return;
        }
        // These endpoints are the public entry bootstrap itself. Ignore any
        // stale browser credentials here so an expired app session cannot
        // turn an otherwise reachable server into the offline landing state.
        if (isPublicEntryBootstrapRequest(request)) {
            filterChain.doFilter(request, response);
            return;
        }
        Authentication existing =
                SecurityContextHolder.getContext().getAuthentication();
        if (existing != null && existing.isAuthenticated()) {
            continueIfSessionActive(request, response, filterChain);
            return;
        }
        if (DemoSessionRequestSupport.isOperatorRequest(request)
                && (DemoSessionRequestSupport.isDemoSessionRequest(request)
                        || !configProperties.isFirebaseEnabled())) {
            authenticateDemoOperator(request);
            continueIfSessionActive(request, response, filterChain);
            return;
        }

        if (!configProperties.isFirebaseEnabled()) {
            authenticateWithoutFirebase(request);
            continueIfSessionActive(request, response, filterChain);
            return;
        }

        String firebaseToken = extractFirebaseToken(request);
        if (firebaseToken == null || firebaseToken.isBlank()) {
            continueIfSessionActive(request, response, filterChain);
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
            String memberUser = configProperties.getMemberUser();
            if (memberUser == null || memberUser.isBlank()) {
                return;
            }
            userDetails = firebaseService.loadUserByUsername(
                    memberUser,
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
        if (!StringUtils.hasText(requestedUserId)
                && DemoSessionRequestSupport.isDemoSessionRequest(request)) {
            requestedUserId = request.getHeader(DEMO_USER_ID);
        }
        if (!StringUtils.hasText(requestedUserId)) {
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

    private boolean isPublicEntryBootstrapRequest(HttpServletRequest request) {
        String requestUri = request == null ? "" : request.getRequestURI();
        return requestUri.equals("/deployment/configuration")
                || requestUri.equals("/api/deployment/configuration")
                || requestUri.equals("/deployment/configuration/firebase-config")
                || requestUri.equals("/api/deployment/configuration/firebase-config")
                || requestUri.equals("/i18n/bundle")
                || requestUri.equals("/api/i18n/bundle")
                || requestUri.equals("/auth/eligibility")
                || requestUri.equals("/api/auth/eligibility")
                || requestUri.equals("/auth/demo-users")
                || requestUri.equals("/api/auth/demo-users")
                || requestUri.equals("/landing")
                || requestUri.equals("/api/landing")
                || requestUri.startsWith("/landing/")
                || requestUri.startsWith("/api/landing/");
    }

    private void continueIfSessionActive(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws IOException, ServletException {
        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null
                || !authentication.isAuthenticated()
                || !(authentication.getPrincipal() instanceof FirebasePrincipal)
                || isSessionLoginRequest(request)
                || userLoginSessionService == null
                || !userLoginSessionService.isCurrentUserEnrolled()) {
            filterChain.doFilter(request, response);
            return;
        }
        String sessionId = request.getHeader(UserLoginSessionService.SESSION_ID_HEADER);
        if (!StringUtils.hasText(sessionId) && isWebSocketTokenRequest(request)) {
            sessionId = request.getParameter("sessionId");
        }
        if (userLoginSessionService.isCurrentSessionActive(sessionId)) {
            filterChain.doFilter(request, response);
            return;
        }
        response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "App session is not active.");
    }

    private boolean isSessionLoginRequest(HttpServletRequest request) {
        String requestUri = request == null ? "" : request.getRequestURI();
        return requestUri.endsWith("/auth/session/login");
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

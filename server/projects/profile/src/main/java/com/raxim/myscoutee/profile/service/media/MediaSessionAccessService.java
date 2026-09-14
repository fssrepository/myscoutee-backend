package com.raxim.myscoutee.profile.service.media;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.util.Base64;
import java.util.HexFormat;
import java.util.List;

import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Service;

import com.raxim.myscoutee.common.config.firebase.dto.FirebaseCredential;
import com.raxim.myscoutee.common.config.firebase.dto.FirebasePrincipal;
import com.raxim.myscoutee.profile.data.document.UserSessionState;
import com.raxim.myscoutee.profile.service.UserLoginSessionService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/** Media-only credential: issued after Firebase authentication, revoked with its app session. */
@Service
public class MediaSessionAccessService {
    private static final String COOKIE = "myscoutee_media_session";
    private static final SecureRandom RANDOM = new SecureRandom();
    private final MongoTemplate mongo;

    public MediaSessionAccessService(MongoTemplate mongo) {
        this.mongo = mongo;
    }

    public static boolean isPrivateRead(HttpServletRequest request) {
        String path = request.getRequestURI();
        return "/media/private".equals(path) || "/api/media/private".equals(path);
    }

    public Authentication authenticate(HttpServletRequest request) {
        String value = cookie(request);
        int separator = value.indexOf('.');
        if (separator < 1 || value.length() > 512 || !value.substring(separator + 1).matches("[0-9a-f]{64}")) return null;
        String userId;
        try {
            userId = new String(Base64.getUrlDecoder().decode(value.substring(0, separator)), StandardCharsets.UTF_8);
        } catch (IllegalArgumentException invalid) {
            return null;
        }
        // The primary-key lookup stays bounded by the user's two active sessions.
        boolean active = mongo.exists(Query.query(Criteria.where("_id").is(userId)
                .and("activeSessions").elemMatch(Criteria.where("mediaTokenHash").is(hash(value)))), UserSessionState.class);
        return active ? UsernamePasswordAuthenticationToken.authenticated(userId, null,
                List.of(new SimpleGrantedAuthority("MEDIA"))) : null;
    }

    public void issueForProfileRead(HttpServletRequest request, HttpServletResponse response, Authentication authentication) {
        if (!"GET".equals(request.getMethod()) || !request.getRequestURI().endsWith("/auth/me")
                || authentication == null || !authentication.isAuthenticated()
                || !(authentication.getCredentials() instanceof FirebaseCredential)
                || !(authentication.getPrincipal() instanceof FirebasePrincipal principal)) return;
        String sessionId = request.getHeader(UserLoginSessionService.SESSION_ID_HEADER);
        if (sessionId == null || sessionId.isBlank()) return;
        Query session = Query.query(Criteria.where("_id").is(principal.getUserId())
                .and("activeSessions.sessionId").is(sessionId));
        session.fields().include("activeSessions");
        UserSessionState state = mongo.findOne(session, UserSessionState.class);
        if (state == null) return;
        var active = state.getActiveSessions().stream().filter(s -> sessionId.equals(s.getSessionId())).findFirst().orElse(null);
        if (active == null) return;
        String existing = cookie(request);
        if (!existing.isEmpty() && hash(existing).equals(active.getMediaTokenHash())) return;
        byte[] bytes = new byte[32];
        RANDOM.nextBytes(bytes);
        String value = Base64.getUrlEncoder().withoutPadding().encodeToString(principal.getUserId().getBytes(StandardCharsets.UTF_8))
                + "." + HexFormat.of().formatHex(bytes);
        if (mongo.updateFirst(session, new Update().set("activeSessions.$.mediaTokenHash", hash(value)), UserSessionState.class)
                .getMatchedCount() != 1) return;
        response.addHeader(HttpHeaders.SET_COOKIE, ResponseCookie.from(COOKIE, value)
                .httpOnly(true).secure(request.isSecure()).sameSite("Strict").path("/").build().toString());
    }

    private static String cookie(HttpServletRequest request) {
        if (request.getCookies() != null) for (var cookie : request.getCookies()) {
            if (COOKIE.equals(cookie.getName())) return cookie.getValue();
        }
        return "";
    }

    private static String hash(String value) {
        try {
            return HexFormat.of().formatHex(MessageDigest.getInstance("SHA-256").digest(value.getBytes(StandardCharsets.UTF_8)));
        } catch (java.security.NoSuchAlgorithmException impossible) {
            throw new IllegalStateException(impossible);
        }
    }
}

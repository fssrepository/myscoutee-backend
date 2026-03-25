package com.raxim.myscoutee.common.config.firebase;

import java.nio.charset.StandardCharsets;
import java.util.UUID;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import com.raxim.myscoutee.common.config.firebase.dto.FirebasePrincipal;
import com.raxim.myscoutee.common.config.properties.ConfigProperties;

@Service
public class FirebaseService {
    private final ConfigProperties config;

    public FirebaseService(ConfigProperties config) {
        this.config = config;
    }

    public UserDetails loadUserById(String profileId) {
        String normalizedProfileId = normalizeId(profileId);
        return new FirebasePrincipal(normalizedProfileId, config.getDevUser(), resolveRole(config.getDevUser()));
    }

    public UserDetails loadUserByUsername(String username, String xLink, String currentPage) {
        String normalizedEmail = normalizeEmail(username);
        return new FirebasePrincipal(stableUserId(normalizedEmail), normalizedEmail, resolveRole(normalizedEmail));
    }

    private String normalizeId(String profileId) {
        if (profileId == null || profileId.isBlank()) {
            return stableUserId(config.getDevUser());
        }
        return profileId.trim();
    }

    private String normalizeEmail(String username) {
        if (username == null || username.isBlank()) {
            if (config.getDevUser() != null && !config.getDevUser().isBlank()) {
                return config.getDevUser().trim();
            }
            return "dev@myscoutee.local";
        }
        return username.trim();
    }

    private String stableUserId(String email) {
        return UUID.nameUUIDFromBytes(normalizeEmail(email).getBytes(StandardCharsets.UTF_8)).toString();
    }

    private String resolveRole(String email) {
        if (config.getAdminUser() != null && config.getAdminUser().trim().equalsIgnoreCase(normalizeEmail(email))) {
            return "A";
        }
        return "U";
    }
}

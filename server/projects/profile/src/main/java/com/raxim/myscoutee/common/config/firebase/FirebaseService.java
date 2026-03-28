package com.raxim.myscoutee.common.config.firebase;

import java.nio.charset.StandardCharsets;
import java.util.UUID;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.raxim.myscoutee.common.config.firebase.dto.FirebasePrincipal;
import com.raxim.myscoutee.common.config.properties.ConfigProperties;
import com.raxim.myscoutee.profile.data.document.Users;
import com.raxim.myscoutee.profile.repository.UsersRepository;

@Service
public class FirebaseService {
    private final ConfigProperties config;
    private final UsersRepository usersRepository;

    public FirebaseService(ConfigProperties config, UsersRepository usersRepository) {
        this.config = config;
        this.usersRepository = usersRepository;
    }

    public UserDetails loadUserById(String profileId) {
        Users user = findUser(profileId);
        String normalizedProfileId = user != null ? normalizeId(user.getId()) : normalizeId(profileId);
        String email = normalizeEmail(config.getDevUser());
        return new FirebasePrincipal(normalizedProfileId, email, resolveRole(email), user);
    }

    public UserDetails loadUserByUsername(String username, String xLink, String currentPage) {
        String normalizedEmail = normalizeEmail(username);
        Users user = findUser(username);
        String resolvedUserId = user != null ? normalizeId(user.getId()) : stableUserId(normalizedEmail);
        return new FirebasePrincipal(resolvedUserId, normalizedEmail, resolveRole(normalizedEmail), user);
    }

    private Users findUser(String userId) {
        String normalizedUserId = normalizeId(userId);
        if (!StringUtils.hasText(normalizedUserId)) {
            return null;
        }
        return usersRepository.findById(normalizedUserId).orElse(null);
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

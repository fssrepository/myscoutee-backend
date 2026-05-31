package com.raxim.myscoutee.common.config.firebase;

import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Locale;
import java.util.UUID;

import org.bson.types.ObjectId;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.raxim.myscoutee.common.config.firebase.dto.FirebaseCredential;
import com.raxim.myscoutee.common.config.firebase.dto.FirebasePrincipal;
import com.raxim.myscoutee.common.config.properties.ConfigProperties;
import com.raxim.myscoutee.profile.data.document.Users;
import com.raxim.myscoutee.profile.repository.UsersRepository;
import com.raxim.myscoutee.profile.service.AppSettingsService;

@Service
public class FirebaseService {
    private final ConfigProperties config;
    private final UsersRepository usersRepository;
    private final AppSettingsService appSettingsService;
    private static final String PROFILE_STATUS_ONBOARDING = "onboarding";

    public FirebaseService(
            ConfigProperties config,
            UsersRepository usersRepository,
            AppSettingsService appSettingsService) {
        this.config = config;
        this.usersRepository = usersRepository;
        this.appSettingsService = appSettingsService;
    }

    public UserDetails loadUserById(String profileId) {
        Users user = findUser(profileId);
        String normalizedProfileId = user != null ? normalizeId(user.getId()) : normalizeId(profileId);
        String email = normalizeEmail(config.getDevUser());
        return new FirebasePrincipal(normalizedProfileId, email, resolveRole(email), user);
    }

    public UserDetails loadUserByUsername(String username, String xLink, String currentPage) {
        String normalizedEmail = normalizeEmail(username);
        Users user = findUserByEmail(normalizedEmail);
        if (user == null) {
            user = findUser(username);
        }
        String resolvedUserId = user != null ? normalizeId(user.getId()) : stableUserId(normalizedEmail);
        return new FirebasePrincipal(resolvedUserId, normalizedEmail, resolveRole(normalizedEmail), user);
    }

    public UserDetails loadUserByCredential(FirebaseCredential credential, String xLink, String currentPage) {
        String normalizedEmail = normalizeCredentialEmail(credential);
        Users user = findUserByEmail(normalizedEmail);
        if (user == null) {
            user = findUserByProvider(credential);
        }
        if (user == null) {
            user = findUser(stableUserId(normalizedEmail));
        }
        String role = resolveRole(normalizedEmail);
        if (user == null && "U".equals(role)) {
            user = createOnboardingUser(normalizedEmail, credential);
        } else if (user != null) {
            user = syncFirebaseIdentity(user, credential);
        }
        String resolvedUserId = user != null ? normalizeId(user.getId()) : stableUserId(normalizedEmail);
        return new FirebasePrincipal(resolvedUserId, normalizedEmail, role, user);
    }

    private Users findUser(String userId) {
        String normalizedUserId = normalizeId(userId);
        if (!StringUtils.hasText(normalizedUserId)) {
            return null;
        }
        java.util.Optional<Users> userById = usersRepository.findByUserId(normalizedUserId);
        Users user = userById == null ? null : userById.orElse(null);
        if (user != null) {
            return user;
        }
        return usersRepository.findById(normalizedUserId).orElse(null);
    }

    private Users findUserByEmail(String email) {
        String normalizedEmail = normalizeEmail(email);
        if (!StringUtils.hasText(normalizedEmail)) {
            return null;
        }
        java.util.Optional<Users> userByEmail = usersRepository.findFirstByEmail(normalizedEmail);
        return userByEmail == null ? null : userByEmail.orElse(null);
    }

    private Users findUserByProvider(FirebaseCredential credential) {
        String facebookId = normalizeProviderId(credential == null ? null : credential.getFacebookId());
        if (StringUtils.hasText(facebookId)) {
            java.util.Optional<Users> userByFacebookId = usersRepository.findFirstByFacebookId(facebookId);
            Users user = userByFacebookId == null ? null : userByFacebookId.orElse(null);
            if (user != null) {
                return user;
            }
        }
        String googleId = normalizeProviderId(credential == null ? null : credential.getGoogleId());
        if (StringUtils.hasText(googleId)) {
            java.util.Optional<Users> userByGoogleId = usersRepository.findFirstByGoogleId(googleId);
            Users user = userByGoogleId == null ? null : userByGoogleId.orElse(null);
            if (user != null) {
                return user;
            }
        }
        String firebaseUid = normalizeProviderId(credential == null ? null : credential.getUid());
        if (StringUtils.hasText(firebaseUid)) {
            java.util.Optional<Users> userByFirebaseUid = usersRepository.findFirstByFirebaseUid(firebaseUid);
            return userByFirebaseUid == null ? null : userByFirebaseUid.orElse(null);
        }
        return null;
    }

    private Users createOnboardingUser(String email, FirebaseCredential credential) {
        String normalizedEmail = normalizeEmail(email);
        String userId = stableUserId(normalizedEmail);
        Users existing = findUser(userId);
        if (existing != null) {
            return existing;
        }

        String displayName = credential == null ? null : credential.getName();
        String nowIso = Instant.now().toString();
        Users user = new Users();
        user.setMongoId(new ObjectId().toHexString());
        user.setSyncKey(UUID.randomUUID().toString());
        user.setUserId(userId);
        user.setEmail(normalizedEmail);
        applyFirebaseIdentity(user, credential);
        user.setName(resolveDisplayName(displayName));
        user.setInitials(resolveInitials(StringUtils.hasText(displayName) ? displayName : normalizedEmail));
        user.setGender("");
        user.setStatus("A");
        user.setProfileStatus(PROFILE_STATUS_ONBOARDING);
        user.setCompletion(0);
        user.setProfileFormVersion(0);
        user.setDeletedAtIso(nowIso);
        user.setActivities(new Users.UserActivitiesRecord(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0));
        return usersRepository.save(user);
    }

    private Users syncFirebaseIdentity(Users user, FirebaseCredential credential) {
        if (user == null || credential == null) {
            return user;
        }
        String beforeFirebaseUid = normalizeProviderId(user.getFirebaseUid());
        String beforeGoogleId = normalizeProviderId(user.getGoogleId());
        String beforeFacebookId = normalizeProviderId(user.getFacebookId());
        applyFirebaseIdentity(user, credential);
        boolean changed = !beforeFirebaseUid.equals(normalizeProviderId(user.getFirebaseUid()))
                || !beforeGoogleId.equals(normalizeProviderId(user.getGoogleId()))
                || !beforeFacebookId.equals(normalizeProviderId(user.getFacebookId()));
        return changed ? usersRepository.save(user) : user;
    }

    private void applyFirebaseIdentity(Users user, FirebaseCredential credential) {
        if (user == null || credential == null) {
            return;
        }
        assignIfPresent(user::setFirebaseUid, credential.getUid());
        assignIfPresent(user::setGoogleId, credential.getGoogleId());
        assignIfPresent(user::setFacebookId, credential.getFacebookId());
    }

    private void assignIfPresent(java.util.function.Consumer<String> setter, String value) {
        String normalizedValue = normalizeProviderId(value);
        if (StringUtils.hasText(normalizedValue)) {
            setter.accept(normalizedValue);
        }
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
        return username.trim().toLowerCase(Locale.ROOT);
    }

    private String normalizeProviderId(String value) {
        return value == null ? "" : value.trim();
    }

    private String normalizeCredentialEmail(FirebaseCredential credential) {
        String email = credential == null ? null : credential.getEmail();
        if (StringUtils.hasText(email)) {
            return email.trim().toLowerCase(Locale.ROOT);
        }
        String uid = credential == null ? null : credential.getUid();
        if (StringUtils.hasText(uid)) {
            return uid.trim().toLowerCase(Locale.ROOT) + "@firebase.local";
        }
        return UUID.randomUUID().toString() + "@firebase.local";
    }

    private String resolveDisplayName(String value) {
        return value == null ? "" : value.trim();
    }

    private String resolveInitials(String value) {
        String normalizedValue = value == null ? "" : value.trim();
        if (!StringUtils.hasText(normalizedValue)) {
            return "U";
        }
        String emailLocalPart = normalizedValue.contains("@")
                ? normalizedValue.substring(0, normalizedValue.indexOf('@'))
                : normalizedValue;
        String[] words = emailLocalPart
                .replaceAll("[^A-Za-z0-9]+", " ")
                .trim()
                .split("\\s+");
        if (words.length == 0 || !StringUtils.hasText(words[0])) {
            return "U";
        }
        if (words.length == 1) {
            return words[0].substring(0, Math.min(2, words[0].length())).toUpperCase();
        }
        return (words[0].substring(0, 1) + words[1].substring(0, 1)).toUpperCase();
    }

    private String stableUserId(String email) {
        return UUID.nameUUIDFromBytes(normalizeEmail(email).getBytes(StandardCharsets.UTF_8)).toString();
    }

    private String resolveRole(String email) {
        if (appSettingsService.isAdminEmail(normalizeEmail(email))) {
            return "A";
        }
        return "U";
    }
}

package com.raxim.myscoutee.domain.administration.service;

import com.raxim.myscoutee.domain.platform.api.AdministratorSettings;

import java.util.Collection;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.raxim.myscoutee.common.config.mongo.MongoSessionMode;
import com.raxim.myscoutee.common.config.mongo.MongoSessionModeContext;
import com.raxim.myscoutee.domain.accounts.api.WorkspaceProfile;
import com.raxim.myscoutee.domain.accounts.api.ProfileDirectory;

@Service
public class AdminAudienceService implements com.raxim.myscoutee.domain.administration.api.AdminAudience {
    private static final List<String> DEMO_ADMIN_USER_IDS = List.of("admin-demo-ava", "admin-demo-noel");
    private static final List<String> SUPPRESSED_PROFILE_STATUSES = List.of("blocked", "deleted", "inactive");

    private final ProfileDirectory usersRepository;
    private final AdministratorSettings appSettingsService;

    public AdminAudienceService(ProfileDirectory usersRepository, AdministratorSettings appSettingsService) {
        this.usersRepository = usersRepository;
        this.appSettingsService = appSettingsService;
    }

    public List<String> adminNotificationRecipientUserIds(String actorUserId) {
        LinkedHashSet<String> recipients = new LinkedHashSet<>();
        if (MongoSessionModeContext.currentMode() == MongoSessionMode.DEMO) {
            recipients.addAll(DEMO_ADMIN_USER_IDS);
            addIfText(recipients, actorUserId);
            return List.copyOf(recipients);
        }

        List<String> configuredAdmins = compact(appSettingsService.adminEmails());
        Map<String, WorkspaceProfile> usersById = usersById(configuredAdmins);
        Map<String, WorkspaceProfile> usersByEmail = usersByEmail(configuredAdmins);
        for (String configuredAdmin : configuredAdmins) {
            WorkspaceProfile user = usersById.get(configuredAdmin);
            if (user == null) {
                user = usersByEmail.get(configuredAdmin.toLowerCase(Locale.ROOT));
            }
            if (user == null) {
                addIfText(recipients, configuredAdmin);
            } else if (isActive(user)) {
                addIfText(recipients, user.getUserId());
            }
        }

        addActorFallback(recipients, actorUserId);
        return List.copyOf(recipients);
    }

    private void addActorFallback(LinkedHashSet<String> recipients, String actorUserId) {
        String normalizedActor = safeText(actorUserId);
        if (!StringUtils.hasText(normalizedActor) || recipients.contains(normalizedActor)) {
            return;
        }
        WorkspaceProfile user = usersRepository.findByUserId(normalizedActor).orElse(null);
        if (user == null || isActive(user)) {
            recipients.add(normalizedActor);
        }
    }

    private Map<String, WorkspaceProfile> usersById(Collection<String> userIds) {
        LinkedHashMap<String, WorkspaceProfile> result = new LinkedHashMap<>();
        if (userIds == null || userIds.isEmpty()) {
            return result;
        }
        for (WorkspaceProfile user : usersRepository.findByUserIdIn(userIds)) {
            String userId = safeText(user == null ? null : user.getUserId());
            if (StringUtils.hasText(userId)) {
                result.putIfAbsent(userId, user);
            }
        }
        return result;
    }

    private Map<String, WorkspaceProfile> usersByEmail(Collection<String> emails) {
        LinkedHashMap<String, WorkspaceProfile> result = new LinkedHashMap<>();
        if (emails == null || emails.isEmpty()) {
            return result;
        }
        for (WorkspaceProfile user : usersRepository.findByEmailIn(emails)) {
            String email = safeText(user == null ? null : user.getEmail()).toLowerCase(Locale.ROOT);
            if (StringUtils.hasText(email)) {
                result.putIfAbsent(email, user);
            }
        }
        return result;
    }

    private boolean isActive(WorkspaceProfile user) {
        String profileStatus = safeText(user == null ? null : user.getProfileStatus()).toLowerCase(Locale.ROOT);
        return !SUPPRESSED_PROFILE_STATUSES.contains(profileStatus);
    }

    private List<String> compact(Collection<String> values) {
        if (values == null || values.isEmpty()) {
            return List.of();
        }
        return values.stream()
                .map(this::safeText)
                .filter(StringUtils::hasText)
                .distinct()
                .toList();
    }

    private void addIfText(LinkedHashSet<String> recipients, String value) {
        String normalized = safeText(value);
        if (StringUtils.hasText(normalized)) {
            recipients.add(normalized);
        }
    }

    private String safeText(String value) {
        return value == null ? "" : value.trim();
    }
}

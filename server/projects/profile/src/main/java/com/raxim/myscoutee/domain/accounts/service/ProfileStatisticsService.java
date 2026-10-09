package com.raxim.myscoutee.domain.accounts.service;
import java.util.*;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import com.raxim.myscoutee.domain.accounts.api.ProfileStatistics;
import com.raxim.myscoutee.domain.accounts.document.Users;
import com.raxim.myscoutee.domain.accounts.repository.UsersRepository;
@Service
public class ProfileStatisticsService implements ProfileStatistics {
    private static final Set<String> ACTIVE_PROFILE_STATUSES = Set.of("public", "friends only", "host only");
    private final UsersRepository usersRepository;
    public ProfileStatisticsService(UsersRepository usersRepository) { this.usersRepository = usersRepository; }
    @Override public Counts counts(String statsKey) {
        Map<String, Long> statusCounts = new LinkedHashMap<>();
        Map<String, Long> visibilityCounts = new LinkedHashMap<>();
        Map<String, String> activeProfileUsers = new LinkedHashMap<>();
        Map<String, Long> activeGenders = new LinkedHashMap<>();
        for (Users user : usersRepository.findAll()) {
            if (user == null || isAdminSeedUser(user) || !Objects.equals(user.getWorkspaceGroupId(),
                    "global".equals(statsKey) ? null : statsKey)) {
                continue;
            }
            String profileStatus = normalizeProfileStatus(user);
            if (!StringUtils.hasText(profileStatus)) {
                continue;
            }
            increment(statusCounts, profileStatus, 1L);
            if (ACTIVE_PROFILE_STATUSES.contains(profileStatus)) {
                increment(visibilityCounts, profileStatus, 1L);
                if (!Set.of("admin", "operator").contains(safeText(user.getHostTier()).toLowerCase(Locale.ROOT))) {
                    String gender = safeText(user.getGender()).toLowerCase(Locale.ROOT);
                    increment(activeGenders, switch (gender) {
                        case "woman", "female" -> "female"; case "man", "male" -> "male"; default -> "other";
                    }, 1L);
                }
                String userId = firstNonBlank(user.getUserId(), user.getId());
                if (StringUtils.hasText(userId)) {
                    activeProfileUsers.put(userId, profileStatus);
                }
            }
        }
        return new Counts(statusCounts, visibilityCounts, activeProfileUsers, activeGenders);
    }
    private boolean isAdminSeedUser(Users user) {
        String id = firstNonBlank(user.getId(), user.getUserId());
        return safeText(id).startsWith("admin-demo-");
    }
    private String normalizeProfileStatus(Users user) {
        String profileStatus = safeText(user == null ? null : user.getProfileStatus()).toLowerCase(Locale.ROOT);
        if (StringUtils.hasText(profileStatus)) {
            return profileStatus;
        }
        String status = safeText(user == null ? null : user.getStatus()).toUpperCase(Locale.ROOT);
        return switch (status) {
            case "D" -> "deleted";
            case "B" -> "blocked";
            case "I" -> "inactive";
            case "F" -> "friends only";
            case "H" -> "host only";
            case "A" -> "public";
            default -> "public";
        };
    }
    private String safeText(String value) {
        return value == null ? "" : value.trim();
    }
    private String firstNonBlank(String value, String fallback) {
        String normalized = safeText(value);
        return StringUtils.hasText(normalized) ? normalized : fallback;
    }
    private void increment(Map<String, Long> values, String key, long amount) {
        if (!StringUtils.hasText(key)) {
            return;
        }
        values.put(key, values.getOrDefault(key, 0L) + Math.max(1L, amount));
    }
}

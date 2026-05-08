package com.raxim.myscoutee.profile.service;

import java.text.Normalizer;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;

import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.raxim.myscoutee.profile.data.document.ActivityEvent;
import com.raxim.myscoutee.profile.data.document.AffinityConfig;
import com.raxim.myscoutee.profile.data.document.UserExperienceProfile;
import com.raxim.myscoutee.profile.data.document.Users;
import com.raxim.myscoutee.profile.data.dto.auth.AuthDtos.ProfileDetailGroupDto;
import com.raxim.myscoutee.profile.data.dto.auth.AuthDtos.ProfileDetailRowDto;
import com.raxim.myscoutee.profile.data.dto.auth.AuthDtos.UserDto;
import com.raxim.myscoutee.profile.data.dto.auth.AuthDtos.UserImpressionsDto;
import com.raxim.myscoutee.profile.data.dto.auth.AuthDtos.UserImpressionsSectionDto;
import com.raxim.myscoutee.profile.data.dto.auth.AuthDtos.UserPersonalityTraitDto;
import com.raxim.myscoutee.profile.repository.AffinityConfigsRepository;
import com.raxim.myscoutee.profile.repository.UserExperienceProfilesRepository;

@Service
public class AbsoluteAffinityService {
    private static final int TOKEN_HASH_MOD = 997;

    private final AffinityConfigsRepository affinityConfigsRepository;
    private final UserExperienceProfilesRepository userExperienceProfilesRepository;

    public AbsoluteAffinityService(
            AffinityConfigsRepository affinityConfigsRepository,
            UserExperienceProfilesRepository userExperienceProfilesRepository) {
        this.affinityConfigsRepository = affinityConfigsRepository;
        this.userExperienceProfilesRepository = userExperienceProfilesRepository;
    }

    public double resolveUserAffinity(UserDto user) {
        return resolveUserAffinity(user, activeConfig(), loadExperienceProfile(user == null ? null : user.id()));
    }

    private double resolveUserAffinity(
            UserDto user,
            AffinityConfig config,
            UserExperienceProfile experienceProfile) {
        if (user == null) {
            return 0d;
        }
        AffinityConfig.AbsoluteUserAffinityMultipliers multipliers = config.getAbsolute().getUser();
        LinkedHashSet<String> profileTokens = new LinkedHashSet<>();
        LinkedHashSet<String> profileDetailTokens = new LinkedHashSet<>();
        LinkedHashSet<String> experienceTokens = new LinkedHashSet<>();
        LinkedHashSet<String> impressionTokens = new LinkedHashSet<>();
        addUserTokens(profileTokens,
                user.id(),
                user.city(),
                user.physique(),
                user.languages(),
                user.horoscope(),
                user.gender(),
                user.hostTier(),
                user.traitLabel(),
                user.headline(),
                user.about());
        addProfileDetailTokens(profileDetailTokens, user.profileDetails());
        addExperienceTokens(experienceTokens, experienceProfile);
        addImpressionTokens(impressionTokens, user.impressions());

        double score = tokenScore(profileTokens) * multiplier(multipliers.getProfileTokens(), 97d)
                + tokenScore(profileDetailTokens) * multiplier(multipliers.getProfileDetailTokens(), 97d)
                + tokenScore(experienceTokens) * multiplier(multipliers.getExperienceTokens(), 97d)
                + tokenScore(impressionTokens) * multiplier(multipliers.getImpressionTokens(), 97d)
                + Math.max(18, normalizeCount(user.age(), 30)) * multiplier(multipliers.getAge(), 17d)
                + parseHeightCm(user.height(), 170) * multiplier(multipliers.getHeight(), 11d)
                + Math.max(0, normalizeCount(user.completion(), 0)) * multiplier(multipliers.getCompletion(), 13d)
                + impressionScore(user.impressions(), multipliers);
        return Math.max(0d, score);
    }

    public double resolveUserAffinity(Users user) {
        return resolveUserAffinity(user, activeConfig(), loadExperienceProfile(user == null ? null : user.getId()));
    }

    private double resolveUserAffinity(
            Users user,
            AffinityConfig config,
            UserExperienceProfile experienceProfile) {
        if (user == null) {
            return 0d;
        }
        AffinityConfig.AbsoluteUserAffinityMultipliers multipliers = config.getAbsolute().getUser();
        LinkedHashSet<String> profileTokens = new LinkedHashSet<>();
        LinkedHashSet<String> profileDetailTokens = new LinkedHashSet<>();
        LinkedHashSet<String> experienceTokens = new LinkedHashSet<>();
        LinkedHashSet<String> impressionTokens = new LinkedHashSet<>();
        addUserTokens(profileTokens,
                user.getId(),
                user.getCity(),
                user.getPhysique(),
                user.getLanguages(),
                user.getHoroscope(),
                user.getGender(),
                user.getHostTier(),
                user.getTraitLabel(),
                user.getHeadline(),
                user.getAbout());
        addStoredProfileDetailTokens(profileDetailTokens, user.getProfileDetails());
        addExperienceTokens(experienceTokens, experienceProfile);
        addStoredImpressionTokens(impressionTokens, user.getImpressions());

        double score = tokenScore(profileTokens) * multiplier(multipliers.getProfileTokens(), 97d)
                + tokenScore(profileDetailTokens) * multiplier(multipliers.getProfileDetailTokens(), 97d)
                + tokenScore(experienceTokens) * multiplier(multipliers.getExperienceTokens(), 97d)
                + tokenScore(impressionTokens) * multiplier(multipliers.getImpressionTokens(), 97d)
                + Math.max(18, normalizeCount(user.getAge(), 30)) * multiplier(multipliers.getAge(), 17d)
                + parseHeightCm(user.getHeight(), 170) * multiplier(multipliers.getHeight(), 11d)
                + Math.max(0, normalizeCount(user.getCompletion(), 0)) * multiplier(multipliers.getCompletion(), 13d)
                + storedImpressionScore(user.getImpressions(), multipliers);
        return Math.max(0d, score);
    }

    public double resolveEventAffinity(ActivityEvent event, Collection<Users> participants) {
        if (event == null) {
            return 0d;
        }
        AffinityConfig config = activeConfig();
        AffinityConfig.AbsoluteEventAffinityMultipliers multipliers = config.getAbsolute().getEvent();
        Map<String, UserExperienceProfile> experiencesByUserId = loadExperienceProfiles(participantUserIds(participants));
        LinkedHashSet<String> tokens = new LinkedHashSet<>();
        addToken(tokens, "event:title", event.getTitle());
        addToken(tokens, "event:subtitle", event.getSubtitle());
        addTokens(tokens, "event:topic", event.getTopics());
        addToken(tokens, "event:visibility", event.getVisibility());
        addToken(tokens, "event:blind-mode", event.getBlindMode());
        addToken(tokens, "event:location", event.getLocation());
        addToken(tokens, "event:frequency", event.getFrequency());
        addToken(tokens, "event:creator-city", event.getCreatorCity());
        addToken(tokens, "event:creator-gender", event.getCreatorGender());
        if (event.getSubEvents() != null) {
            event.getSubEvents().stream()
                    .filter(Objects::nonNull)
                    .forEach(subEvent -> {
                        addToken(tokens, "event:sub:name", subEvent.name());
                        addToken(tokens, "event:sub:location", subEvent.location());
                        if (subEvent.groups() != null) {
                            subEvent.groups().stream()
                                    .filter(Objects::nonNull)
                                    .forEach(group -> addToken(tokens, "event:sub:group", group.name()));
                        }
                    });
        }

        List<Double> participantAffinities = (participants == null ? List.<Users>of() : participants).stream()
                .filter(Objects::nonNull)
                .map(participant -> resolveUserAffinity(
                        participant,
                        config,
                        experiencesByUserId.get(normalizeKey(participant.getId()))))
                .filter(value -> value != null && Double.isFinite(value) && value > 0d)
                .toList();
        double averageParticipantAffinity = participantAffinities.isEmpty()
                ? 0d
                : participantAffinities.stream().mapToDouble(Double::doubleValue).average().orElse(0d);

        double score = tokenScore(tokens) * multiplier(multipliers.getContentTokens(), 89d)
                + averageParticipantAffinity * multiplier(multipliers.getParticipantAffinity(), 1d)
                + Math.round(clamp(safeDouble(event.getRating()), 0d, 10d) * 100d) * multiplier(multipliers.getRating(), 29d)
                + Math.max(0, normalizeCount(event.getAcceptedMembers(), 0)) * multiplier(multipliers.getAcceptedMembers(), 19d)
                + Math.max(0, normalizeCount(event.getPendingMembers(), 0)) * multiplier(multipliers.getPendingMembers(), 11d)
                + Math.max(0, normalizeCount(event.getCapacityTotal(), 0)) * multiplier(multipliers.getCapacityTotal(), 7d);
        return Math.max(0d, score);
    }

    private void addUserTokens(
            LinkedHashSet<String> tokens,
            String userId,
            String city,
            String physique,
            Collection<String> languages,
            String horoscope,
            String gender,
            String hostTier,
            String traitLabel,
            String headline,
            String about) {
        addToken(tokens, "user:city", city);
        addToken(tokens, "user:physique", physique);
        addTokens(tokens, "user:language", languages);
        addToken(tokens, "user:horoscope", horoscope);
        addToken(tokens, "user:gender", gender);
        addToken(tokens, "user:host-tier", hostTier);
        addToken(tokens, "user:trait", traitLabel);
        addTextTokens(tokens, "user:headline", headline);
        addTextTokens(tokens, "user:about", about);
        addTieBreakerToken(tokens, userId);
    }

    private void addProfileDetailTokens(LinkedHashSet<String> tokens, Collection<ProfileDetailGroupDto> groups) {
        if (groups == null) {
            return;
        }
        for (ProfileDetailGroupDto group : groups) {
            if (group == null) {
                continue;
            }
            for (ProfileDetailRowDto row : group.rows() == null ? List.<ProfileDetailRowDto>of() : group.rows()) {
                if (row == null) {
                    continue;
                }
                String labelKey = safeText(row.labelKey());
                if (!StringUtils.hasText(labelKey)) {
                    continue;
                }
                addToken(tokens, labelKey, row.value());
                addTokens(tokens, labelKey + ":option", row.options());
            }
        }
    }

    private void addStoredProfileDetailTokens(LinkedHashSet<String> tokens, Collection<Users.ProfileDetailGroupRecord> groups) {
        if (groups == null) {
            return;
        }
        for (Users.ProfileDetailGroupRecord group : groups) {
            if (group == null) {
                continue;
            }
            for (Users.ProfileDetailRowRecord row : group.rows() == null ? List.<Users.ProfileDetailRowRecord>of() : group.rows()) {
                if (row == null) {
                    continue;
                }
                String labelKey = safeText(row.labelKey());
                if (!StringUtils.hasText(labelKey)) {
                    continue;
                }
                addToken(tokens, labelKey, row.value());
                addTokens(tokens, labelKey + ":option", row.options());
            }
        }
    }

    private void addExperienceTokens(LinkedHashSet<String> tokens, UserExperienceProfile profile) {
        if (profile == null || profile.getEntries() == null) {
            return;
        }
        for (UserExperienceProfile.ExperienceItemRecord entry : profile.getEntries()) {
            if (entry == null) {
                continue;
            }
            String type = normalizeKey(entry.getType());
            if ("workspace".equals(type)) {
                addToken(tokens, "profile.experience.workplace", entry.getOrg());
                addToken(tokens, "profile.experience.profession", entry.getTitle());
            } else if ("school".equals(type)) {
                addToken(tokens, "profile.experience.school", entry.getOrg());
                addToken(tokens, "profile.experience.education", entry.getTitle());
            } else {
                addToken(tokens, "profile.experience." + type, entry.getOrg());
                addToken(tokens, "profile.experience." + type + ".title", entry.getTitle());
            }
            addToken(tokens, "profile.experience.city", entry.getCity());
            addTextTokens(tokens, "profile.experience.description", entry.getDescription());
        }
    }

    private void addImpressionTokens(LinkedHashSet<String> tokens, UserImpressionsDto impressions) {
        if (impressions == null) {
            return;
        }
        addImpressionSectionTokens(tokens, "host", impressions.host());
        addImpressionSectionTokens(tokens, "member", impressions.member());
    }

    private void addStoredImpressionTokens(LinkedHashSet<String> tokens, Users.UserImpressionsRecord impressions) {
        if (impressions == null) {
            return;
        }
        addStoredImpressionSectionTokens(tokens, "host", impressions.host());
        addStoredImpressionSectionTokens(tokens, "member", impressions.member());
    }

    private void addImpressionSectionTokens(LinkedHashSet<String> tokens, String role, UserImpressionsSectionDto section) {
        if (section == null) {
            return;
        }
        addTokens(tokens, "impression:" + role + ":vibe", section.vibeBadges());
        addTokens(tokens, "impression:" + role + ":personality", section.personalityBadges());
        addTokens(tokens, "impression:" + role + ":category", section.categoryBadges());
        for (UserPersonalityTraitDto trait : section.personalityTraits() == null ? List.<UserPersonalityTraitDto>of() : section.personalityTraits()) {
            if (trait == null) {
                continue;
            }
            addToken(tokens, "impression:" + role + ":trait", StringUtils.hasText(safeText(trait.id())) ? trait.id() : trait.label());
        }
    }

    private void addStoredImpressionSectionTokens(LinkedHashSet<String> tokens, String role, Users.UserImpressionsSectionRecord section) {
        if (section == null) {
            return;
        }
        addTokens(tokens, "impression:" + role + ":vibe", section.vibeBadges());
        addTokens(tokens, "impression:" + role + ":personality", section.personalityBadges());
        addTokens(tokens, "impression:" + role + ":category", section.categoryBadges());
        for (Users.UserPersonalityTraitRecord trait : section.personalityTraits() == null ? List.<Users.UserPersonalityTraitRecord>of() : section.personalityTraits()) {
            if (trait == null) {
                continue;
            }
            addToken(tokens, "impression:" + role + ":trait", StringUtils.hasText(safeText(trait.id())) ? trait.id() : trait.label());
        }
    }

    private double impressionScore(
            UserImpressionsDto impressions,
            AffinityConfig.AbsoluteUserAffinityMultipliers multipliers) {
        if (impressions == null) {
            return 0d;
        }
        return impressionSectionScore(impressions.host(), multipliers) + impressionSectionScore(impressions.member(), multipliers);
    }

    private double storedImpressionScore(
            Users.UserImpressionsRecord impressions,
            AffinityConfig.AbsoluteUserAffinityMultipliers multipliers) {
        if (impressions == null) {
            return 0d;
        }
        return storedImpressionSectionScore(impressions.host(), multipliers) + storedImpressionSectionScore(impressions.member(), multipliers);
    }

    private double impressionSectionScore(
            UserImpressionsSectionDto section,
            AffinityConfig.AbsoluteUserAffinityMultipliers multipliers) {
        if (section == null) {
            return 0d;
        }
        double score = Math.round(clamp(safeDouble(section.averageRating()), 0d, 10d) * 100d)
                * multiplier(multipliers.getImpressionAverageRating(), 29d)
                + Math.max(0, normalizeCount(section.peopleMet(), 0))
                * multiplier(multipliers.getImpressionPeopleMet(), 43d)
                + Math.max(0, normalizeCount(section.totalEvents(), 0))
                * multiplier(multipliers.getImpressionTotalEvents(), 37d)
                + Math.max(0, normalizeCount(section.repeatCount(), 0))
                * multiplier(multipliers.getImpressionRepeatCount(), 53d)
                - Math.max(0, normalizeCount(section.noShowCount(), 0))
                * multiplier(multipliers.getImpressionNoShowPenalty(), 71d);
        for (UserPersonalityTraitDto trait : section.personalityTraits() == null ? List.<UserPersonalityTraitDto>of() : section.personalityTraits()) {
            if (trait != null) {
                score += Math.max(0, normalizeCount(trait.percent(), 0))
                        * multiplier(multipliers.getImpressionTraitPercent(), 7d)
                        + Math.max(0, normalizeCount(trait.evidenceCount(), 0))
                        * multiplier(multipliers.getImpressionTraitEvidenceCount(), 23d);
            }
        }
        return score;
    }

    private double storedImpressionSectionScore(
            Users.UserImpressionsSectionRecord section,
            AffinityConfig.AbsoluteUserAffinityMultipliers multipliers) {
        if (section == null) {
            return 0d;
        }
        double score = Math.round(clamp(safeDouble(section.averageRating()), 0d, 10d) * 100d)
                * multiplier(multipliers.getImpressionAverageRating(), 29d)
                + Math.max(0, normalizeCount(section.peopleMet(), 0))
                * multiplier(multipliers.getImpressionPeopleMet(), 43d)
                + Math.max(0, normalizeCount(section.totalEvents(), 0))
                * multiplier(multipliers.getImpressionTotalEvents(), 37d)
                + Math.max(0, normalizeCount(section.repeatCount(), 0))
                * multiplier(multipliers.getImpressionRepeatCount(), 53d)
                - Math.max(0, normalizeCount(section.noShowCount(), 0))
                * multiplier(multipliers.getImpressionNoShowPenalty(), 71d);
        for (Users.UserPersonalityTraitRecord trait : section.personalityTraits() == null ? List.<Users.UserPersonalityTraitRecord>of() : section.personalityTraits()) {
            if (trait != null) {
                score += Math.max(0, normalizeCount(trait.percent(), 0))
                        * multiplier(multipliers.getImpressionTraitPercent(), 7d)
                        + Math.max(0, normalizeCount(trait.evidenceCount(), 0))
                        * multiplier(multipliers.getImpressionTraitEvidenceCount(), 23d);
            }
        }
        return score;
    }

    private long tokenScore(Collection<String> tokens) {
        return tokens == null ? 0L : tokens.stream()
                .mapToLong(token -> (hashText(token) % TOKEN_HASH_MOD) + 1L)
                .sum();
    }

    private void addTieBreakerToken(LinkedHashSet<String> tokens, String userId) {
        String normalized = normalizeToken(userId);
        if (StringUtils.hasText(normalized)) {
            tokens.add("user:id-bucket:" + (hashText(normalized) % 37));
        }
    }

    private void addTokens(LinkedHashSet<String> tokens, String key, Collection<String> values) {
        if (values == null) {
            return;
        }
        for (String value : values) {
            addToken(tokens, key, value);
        }
    }

    private void addToken(LinkedHashSet<String> tokens, String key, String value) {
        String normalized = normalizeToken(value);
        if (StringUtils.hasText(normalized)) {
            tokens.add(safeText(key) + ":" + normalized);
        }
    }

    private void addTextTokens(LinkedHashSet<String> tokens, String key, String value) {
        String normalized = normalizeToken(value);
        if (!StringUtils.hasText(normalized)) {
            return;
        }
        String[] parts = normalized.split("\\s+");
        for (String part : parts) {
            if (part.length() >= 3) {
                addToken(tokens, key, part);
            }
        }
    }

    private String normalizeToken(String value) {
        String normalized = safeText(value).replaceFirst("^#+\\s*", "");
        if (!StringUtils.hasText(normalized)) {
            return "";
        }
        return Normalizer.normalize(normalized.toLowerCase(), Normalizer.Form.NFD)
                .replaceAll("\\p{M}+", "")
                .trim();
    }

    private String safeText(String value) {
        return value == null ? "" : value.trim();
    }

    private String normalizeKey(String value) {
        return safeText(value).toLowerCase();
    }

    private int normalizeCount(Number value, int fallback) {
        if (value == null || !Double.isFinite(value.doubleValue())) {
            return fallback;
        }
        return Math.max(0, (int) Math.floor(value.doubleValue()));
    }

    private int parseHeightCm(String value, int fallback) {
        String digits = safeText(value).replaceAll("[^0-9]", "");
        if (!StringUtils.hasText(digits)) {
            return fallback;
        }
        try {
            return Math.max(40, Math.min(250, Integer.parseInt(digits)));
        } catch (NumberFormatException ignored) {
            return fallback;
        }
    }

    private double safeDouble(Number value) {
        return value == null || !Double.isFinite(value.doubleValue()) ? 0d : value.doubleValue();
    }

    private double clamp(double value, double min, double max) {
        return Math.max(min, Math.min(max, value));
    }

    private AffinityConfig activeConfig() {
        if (affinityConfigsRepository == null) {
            return AffinityConfig.defaults();
        }
        Optional<AffinityConfig> config = affinityConfigsRepository.findFirstByActiveTrueOrderByVersionDesc();
        return config == null ? AffinityConfig.defaults() : config.orElseGet(AffinityConfig::defaults);
    }

    private double multiplier(AffinityConfig.MultiplierRule rule, double fallback) {
        Double multiplier = rule == null ? null : rule.getMultiplier();
        return multiplier != null && Double.isFinite(multiplier) ? Math.max(0d, multiplier) : fallback;
    }

    private UserExperienceProfile loadExperienceProfile(String userId) {
        String normalizedUserId = normalizeKey(userId);
        if (userExperienceProfilesRepository == null || !StringUtils.hasText(normalizedUserId)) {
            return null;
        }
        Optional<UserExperienceProfile> profile = userExperienceProfilesRepository.findByUserId(normalizedUserId);
        return profile == null ? null : profile.orElse(null);
    }

    private Map<String, UserExperienceProfile> loadExperienceProfiles(Set<String> userIds) {
        if (userExperienceProfilesRepository == null || userIds == null || userIds.isEmpty()) {
            return Map.of();
        }
        Map<String, UserExperienceProfile> profilesByUserId = new HashMap<>();
        for (UserExperienceProfile profile : userExperienceProfilesRepository.findByUserIdIn(new ArrayList<>(userIds))) {
            String userId = normalizeKey(profile == null ? null : profile.getUserId());
            if (StringUtils.hasText(userId)) {
                profilesByUserId.put(userId, profile);
            }
        }
        return profilesByUserId;
    }

    private Set<String> participantUserIds(Collection<Users> participants) {
        if (participants == null || participants.isEmpty()) {
            return Set.of();
        }
        LinkedHashSet<String> userIds = new LinkedHashSet<>();
        for (Users participant : participants) {
            String userId = normalizeKey(participant == null ? null : participant.getId());
            if (StringUtils.hasText(userId)) {
                userIds.add(userId);
            }
        }
        return userIds;
    }

    private int hashText(String value) {
        int hash = 0;
        String normalized = safeText(value);
        for (int index = 0; index < normalized.length(); index += 1) {
            hash = (hash * 31 + normalized.charAt(index)) % 104729;
        }
        return Math.abs(hash);
    }
}

package com.raxim.myscoutee.domain.email.service;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;

import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.raxim.myscoutee.domain.email.document.EmailCampaignRule;
import com.raxim.myscoutee.domain.accounts.api.EmailProfile;

@Service
public class PromotionalEmailRuleEvaluator {
    public boolean qualifies(EmailProfile user, EmailCampaignRule rule) {
        if (user == null || rule == null || !isActiveProfile(user)) {
            return false;
        }
        if (Boolean.TRUE.equals(rule.getRequirePublicProfile()) && !"public".equalsIgnoreCase(resolveProfileStatus(user))) {
            return false;
        }
        if (Boolean.TRUE.equals(rule.getRequireMissingRegisteredDevice()) && hasRegisteredDevice(user)) {
            return false;
        }
        if (!matchesCountry(user, rule)) {
            return false;
        }
        if (!matchesInactivity(user, rule)) {
            return false;
        }
        EmailProfile.ActivityCounts activities = user.getActivities();
        int completion = normalizeCount(user.getCompletion());
        int eventCount = activities == null ? 0 : normalizeCount(activities.events());
        int hostingCount = activities == null ? 0 : normalizeCount(activities.hosting());
        return matchesRange(completion, rule.getMinProfileCompletion(), rule.getMaxProfileCompletion())
                && matchesRange(eventCount, rule.getMinEventCount(), rule.getMaxEventCount())
                && matchesRange(hostingCount, rule.getMinHostingCount(), rule.getMaxHostingCount());
    }

    public Map<String, String> buildTemplateVariables(EmailProfile user, EmailCampaignRule rule, String baseUrl) {
        Map<String, String> variables = new LinkedHashMap<>();
        String firstName = resolveFirstName(user == null ? null : user.getName());
        String fullName = safeText(user == null ? null : user.getName());
        String email = safeText(user == null ? null : user.getEmail());
        String city = safeText(user == null ? null : user.getCity());
        String countryCode = resolveCountryCode(user);
        String countryName = resolveCountryName(countryCode);
        String completion = String.valueOf(normalizeCount(user == null ? null : user.getCompletion()));
        String ctaUrl = buildCtaUrl(baseUrl, rule);
        String ruleKey = safeText(rule == null ? null : rule.getRuleKey());
        putVariable(variables, "firstName", firstName);
        putVariable(variables, "fullName", fullName);
        putVariable(variables, "city", StringUtils.hasText(city) ? city : "your area");
        putVariable(variables, "countryCode", countryCode);
        putVariable(variables, "countryName", countryName);
        putVariable(variables, "completion", completion);
        putVariable(variables, "ctaUrl", ctaUrl);
        putVariable(variables, "ctaLabel", "Open");
        putVariable(variables, "ruleKey", ruleKey);
        putVariable(variables, "user_id", safeText(user == null ? null : user.getId()));
        putVariable(variables, "user_name", fullName);
        putVariable(variables, "user_first_name", firstName);
        putVariable(variables, "user_email", email);
        putVariable(variables, "user_city", StringUtils.hasText(city) ? city : "your area");
        putVariable(variables, "user_country_code", countryCode);
        putVariable(variables, "user_country_name", countryName);
        putVariable(variables, "completion_percent", completion);
        putVariable(variables, "profile_completion", completion);
        putVariable(variables, "cta_url", ctaUrl);
        putVariable(variables, "cta_label", "Open");
        putVariable(variables, "campaign_rule_key", ruleKey);
        if (rule != null && rule.getTemplateVariables() != null) {
            for (Map.Entry<String, String> entry : rule.getTemplateVariables().entrySet()) {
                putVariable(variables, entry.getKey(), entry.getValue());
            }
        }
        return variables;
    }

    boolean isActiveProfile(EmailProfile user) {
        String profileStatus = resolveProfileStatus(user);
        return !"deleted".equals(profileStatus) && !"inactive".equals(profileStatus);
    }

    boolean hasRegisteredDevice(EmailProfile user) {
        return (user == null ? List.<EmailProfile.Device>of() : user.getDevices()).stream()
                .filter(device -> device != null)
                .filter(device -> !Boolean.FALSE.equals(device.getNotificationsEnabled()))
                .anyMatch(EmailProfile.Device::hasPushToken);
    }

    private boolean matchesInactivity(EmailProfile user, EmailCampaignRule rule) {
        Integer minInactiveDays = rule == null ? null : rule.getMinInactiveDays();
        Integer maxInactiveDays = rule == null ? null : rule.getMaxInactiveDays();
        if (minInactiveDays == null && maxInactiveDays == null) {
            return true;
        }
        Instant lastSeenAt = lastSeenAt(user);
        if (lastSeenAt == null) {
            return maxInactiveDays == null;
        }
        long inactiveDays = Math.max(0L, (Instant.now().toEpochMilli() - lastSeenAt.toEpochMilli()) / 86_400_000L);
        if (minInactiveDays != null && inactiveDays < Math.max(0, minInactiveDays.intValue())) {
            return false;
        }
        return maxInactiveDays == null || inactiveDays <= Math.max(0, maxInactiveDays.intValue());
    }

    private Instant lastSeenAt(EmailProfile user) {
        Instant latest = null;
        for (EmailProfile.Device device : user == null ? List.<EmailProfile.Device>of() : user.getDevices()) {
            Instant candidate = firstInstant(device == null ? null : device.getLastSeenAtIso(),
                    device == null ? null : device.getLastRegisteredAtIso());
            if (candidate != null && (latest == null || candidate.isAfter(latest))) {
                latest = candidate;
            }
        }
        return latest;
    }

    private Instant firstInstant(String first, String second) {
        Instant parsedFirst = parseInstant(first);
        return parsedFirst == null ? parseInstant(second) : parsedFirst;
    }

    private Instant parseInstant(String value) {
        String normalized = safeText(value);
        if (!StringUtils.hasText(normalized)) {
            return null;
        }
        try {
            return Instant.parse(normalized);
        } catch (Exception exception) {
            return null;
        }
    }

    private boolean matchesCountry(EmailProfile user, EmailCampaignRule rule) {
        Set<String> targetCountryCodes = new LinkedHashSet<>();
        for (String countryCode : rule == null ? List.<String>of() : rule.getCountryCodes()) {
            String normalized = normalizeCountryCode(countryCode);
            if (StringUtils.hasText(normalized)) {
                targetCountryCodes.add(normalized);
            }
        }
        if (targetCountryCodes.isEmpty()) {
            return true;
        }
        String userCountryCode = resolveCountryCode(user);
        return StringUtils.hasText(userCountryCode) && targetCountryCodes.contains(userCountryCode);
    }

    private String buildCtaUrl(String baseUrl, EmailCampaignRule rule) {
        String normalizedBaseUrl = safeText(baseUrl);
        if (!StringUtils.hasText(normalizedBaseUrl)) {
            normalizedBaseUrl = "http://localhost:4200";
        }
        String ctaPath = rule == null ? "" : safeText(rule.getCtaPath());
        String rawUrl = ctaPath.startsWith("http://") || ctaPath.startsWith("https://")
                ? ctaPath
                : normalizedBaseUrl.replaceAll("/+$", "") + (ctaPath.startsWith("/") ? ctaPath : "/" + firstNonBlank(ctaPath, "game"));
        String separator = rawUrl.contains("?") ? "&" : "?";
        return rawUrl + separator + "utm_source=email&utm_medium=promotional&utm_campaign=" + safeText(rule == null ? null : rule.getRuleKey());
    }

    private String resolveFirstName(String fullName) {
        String normalized = safeText(fullName);
        if (!StringUtils.hasText(normalized)) {
            return "there";
        }
        int separator = normalized.indexOf(' ');
        return separator > 0 ? normalized.substring(0, separator) : normalized;
    }

    private String resolveProfileStatus(EmailProfile user) {
        if (user == null) {
            return "inactive";
        }
        String status = safeText(user.getStatus()).toUpperCase(Locale.ROOT);
        if ("D".equals(status) || "deleted".equalsIgnoreCase(safeText(user.getProfileStatus()))) {
            return "deleted";
        }
        if ("I".equals(status) || "inactive".equalsIgnoreCase(safeText(user.getProfileStatus()))) {
            return "inactive";
        }
        String normalizedProfileStatus = safeText(user.getProfileStatus()).toLowerCase(Locale.ROOT);
        return StringUtils.hasText(normalizedProfileStatus) ? normalizedProfileStatus : "public";
    }

    private String resolveCountryCode(EmailProfile user) {
        String partitionKey = safeText(user == null ? null : user.getPartitionKey());
        if (partitionKey.startsWith("country:")) {
            return normalizeCountryCode(partitionKey.substring("country:".length()));
        }
        return "";
    }

    private String resolveCountryName(String countryCode) {
        String normalizedCountryCode = normalizeCountryCode(countryCode);
        if (!StringUtils.hasText(normalizedCountryCode)) {
            return "your country";
        }
        String countryName = new Locale.Builder()
                .setRegion(normalizedCountryCode)
                .build()
                .getDisplayCountry(Locale.ENGLISH);
        return StringUtils.hasText(countryName) ? countryName : normalizedCountryCode;
    }

    private String normalizeCountryCode(String value) {
        String normalized = safeText(value).toUpperCase(Locale.ROOT);
        return normalized.isEmpty() ? "" : normalized;
    }

    private boolean matchesRange(int value, Integer minimum, Integer maximum) {
        if (minimum != null && value < minimum.intValue()) {
            return false;
        }
        if (maximum != null && value > maximum.intValue()) {
            return false;
        }
        return true;
    }

    private int normalizeCount(Integer value) {
        return value == null ? 0 : Math.max(0, value.intValue());
    }

    private void putVariable(Map<String, String> variables, String key, String value) {
        String normalizedKey = normalizeTemplateVariableKey(key);
        if (!StringUtils.hasText(normalizedKey)) {
            return;
        }
        variables.put(normalizedKey, safeText(value));
    }

    private String normalizeTemplateVariableKey(String value) {
        String normalized = safeText(value);
        if (normalized.startsWith("@")) {
            normalized = normalized.substring(1);
        }
        if (normalized.startsWith("{{") && normalized.endsWith("}}") && normalized.length() > 4) {
            normalized = normalized.substring(2, normalized.length() - 2).trim();
        }
        return normalized;
    }

    private String firstNonBlank(String first, String second) {
        return StringUtils.hasText(safeText(first)) ? safeText(first) : safeText(second);
    }

    private String safeText(String value) {
        return value == null ? "" : value.trim();
    }
}

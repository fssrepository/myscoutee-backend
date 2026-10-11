package com.raxim.myscoutee.domain.integrations.service;

import java.time.*;
import java.util.*;
import org.springframework.stereotype.Service;
import com.raxim.myscoutee.domain.integrations.repository.AdminClientRepository;
import com.fasterxml.jackson.annotation.JsonInclude;

@Service
public class AdminClientService {
    public record Statistics(boolean ready, String generatedAtIso, long activeProfiles, Map<String, Long> genders,
            long registrations7Days, long registrations30Days) {}
    public record Attention(long unreadMessages, String unreadVersion,
            @JsonInclude(JsonInclude.Include.NON_NULL) Long unresolvedReports,
            @JsonInclude(JsonInclude.Include.NON_NULL) Long unresolvedFeedback,
            @JsonInclude(JsonInclude.Include.NON_NULL) Long supportCases, long failedJobs) {}
    public record Overview(Statistics statistics, Attention attention) {}
    private final AdminClientAccessService access;
    private final AdminClientRepository repository;
    private final Optional<AdminModerationAttention> moderation;
    public AdminClientService(AdminClientAccessService access, AdminClientRepository repository,
            Optional<AdminModerationAttention> moderation) {
        this.access = access; this.repository = repository; this.moderation = moderation;
    }
    public Overview overview(String owner) {
        var user = access.requireAdmin(owner);
        var stats = repository.stats();
        Map<String, Long> genders = stats == null || stats.activeProfileGenders() == null ? Map.of() : stats.activeProfileGenders();
        var activity = user.getActivities(); var chat = activity == null ? null : activity.chat();
        var daily = stats == null ? null : stats.dailyActivity();
        var today = LocalDate.now(ZoneOffset.UTC);
        var moderationCounts = moderation.map(ownerFeature -> ownerFeature.counts(chat)).orElse(null);
        return new Overview(new Statistics(stats != null && stats.activeProfileGenders() != null,
                stats == null ? null : stats.generatedAtIso(), genders.values().stream().mapToLong(Long::longValue).sum(), genders,
                registrations(daily, today, 7), registrations(daily, today, 30)),
                new Attention(chat == null ? 0 : count(chat.all()), repository.unreadVersion(owner),
                        moderationCounts == null ? null : moderationCounts.unresolvedReports(),
                        moderationCounts == null ? null : moderationCounts.unresolvedFeedback(),
                        moderationCounts == null ? null : moderationCounts.supportCases(),
                        activity == null ? 0 : count(activity.adminJobs())));
    }
    static long registrations(Map<String, Map<String, Long>> daily, LocalDate today, int days) {
        if (daily == null) return 0;
        long sum = 0;
        for (int offset = 0; offset < days; offset++) sum += daily.getOrDefault(today.minusDays(offset).toString(), Map.of()).getOrDefault("registrations", 0L);
        return sum;
    }
    private static long count(Integer value) { return value == null ? 0 : Math.max(0, value); }
}

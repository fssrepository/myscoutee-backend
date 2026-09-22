package com.raxim.myscoutee.profile.service;

import java.time.*;
import java.util.*;
import org.springframework.stereotype.Service;
import com.raxim.myscoutee.profile.repository.AdminClientRepository;

@Service
public class AdminClientService {
    public record Statistics(boolean ready, String generatedAtIso, long activeProfiles, Map<String, Long> genders,
            long registrations7Days, long registrations30Days) {}
    public record Attention(long unreadMessages, String unreadVersion, long unresolvedReports, long unresolvedFeedback,
            long supportCases, long failedJobs) {}
    public record Overview(Statistics statistics, Attention attention) {}
    private final AdminClientAccessService access;
    private final AdminClientRepository repository;
    public AdminClientService(AdminClientAccessService access, AdminClientRepository repository) { this.access = access; this.repository = repository; }
    public Overview overview(String owner) {
        var user = access.requireAdmin(owner);
        var stats = repository.stats();
        Map<String, Long> genders = stats == null || stats.getActiveProfileGenders() == null ? Map.of() : stats.getActiveProfileGenders();
        var activity = user.getActivities(); var chat = activity == null ? null : activity.chat();
        var support = chat == null ? null : chat.supportCases();
        var daily = stats == null ? null : stats.getDailyActivity();
        var today = LocalDate.now(ZoneOffset.UTC);
        return new Overview(new Statistics(stats != null && stats.getActiveProfileGenders() != null,
                stats == null ? null : stats.getGeneratedAtIso(), genders.values().stream().mapToLong(Long::longValue).sum(), genders,
                registrations(daily, today, 7), registrations(daily, today, 30)),
                new Attention(chat == null ? 0 : count(chat.all()), repository.unreadVersion(owner),
                        repository.unresolvedReports(), repository.unresolvedFeedback(), support == null ? 0 : count(support.pending()) + count(support.warned()) + count(support.picked()),
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

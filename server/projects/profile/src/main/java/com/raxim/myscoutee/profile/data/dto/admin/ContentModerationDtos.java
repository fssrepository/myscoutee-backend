package com.raxim.myscoutee.profile.data.dto.admin;

import java.util.List;
import java.util.Map;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

public final class ContentModerationDtos {
    private ContentModerationDtos() {}
    public static final List<String> CATEGORIES = List.of("asset", "event", "feed");
    public static final List<String> STATUSES = List.of("under-review", "accepted", "rejected", "blocked");
    public record Settings(boolean autoApprove, int delayMinutes, List<String> categories) {
        public static Settings defaults() { return new Settings(true, 0, CATEGORIES); }
    }
    @Document("contentModerationItems")
    public record Item(@Id String id, String category, String sourceId, String ownerUserId, String title,
            String imageUrl, String submittedAtIso, String status, long version, String commandId,
            String reviewedBy, String reviewedAtIso) {}
    public record Mutation(String commandId, Item item, String adminName, String adminInitials, String message) {}
    @Document("contentModerationState")
    public record State(@Id String id, long revision, Settings settings,
            Map<String, Map<String, Long>> counts, List<Mutation> pending) {}
    public record Snapshot(long revision, Settings settings, Map<String, Map<String, Long>> counts, long pendingCount) {}
    public record Page(List<Item> items, long total, String nextCursor, Snapshot snapshot) {}
    public record DecisionResult(Snapshot snapshot, Item item) {}
    public record Decision(String adminUserId, String commandId, long expectedVersion, String status, String message) {}
    public record SaveSettings(String adminUserId, long expectedRevision, Settings settings) {}
}

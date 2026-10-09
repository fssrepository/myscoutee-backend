package com.raxim.myscoutee.microservices.transport.accounts;

import java.util.List;
import com.raxim.myscoutee.domain.accounts.api.AccountAffinityProjections.RatingProjection;

public final class AccountAffinityProjectionsProtocol {
    public static final String ROOT = "/_internal/v1/accounts/affinity-projections";
    public static final String UPDATE = ROOT + "/affinity", JOB = ROOT + "/job-profiles", CANDIDATE = ROOT + "/public-candidate",
            STALE = ROOT + "/stale-ratings", BACKFILL = ROOT + "/backfill-ratings", REFRESH = ROOT + "/refresh-rating", TOUCH = ROOT + "/touch-rating";
    public static final int MAX_REQUEST_BYTES = 2 * 1024 * 1024, MAX_RESPONSE_BYTES = 16 * 1024 * 1024;
    private AccountAffinityProjectionsProtocol() {}
    public static String[] paths() { return new String[] {UPDATE, JOB, CANDIDATE, STALE, BACKFILL, REFRESH, TOUCH}; }
    public record AffinityCommand(String userId, Double affinity) {}
    public record JobQuery(Boolean active, String groupId) {}
    public record UserQuery(String userId) {}
    public record EmptyQuery() {}
    public record BackfillCommand(List<RatingProjection> projections, String changedAt) {}
    public record RefreshCommand(RatingProjection projection, String changedAt) {}
    public record TouchCommand(String userId, Long activityMs) {}
    public record Decision(Boolean value) {}
    public record Receipt(Boolean completed) {}
    public record Error(String code) {}
    private static boolean id(String value) { return value == null || value.length() <= 512; }
    private static boolean ids(List<String> values) { return values == null || values.size() <= 4096 && values.stream().allMatch(AccountAffinityProjectionsProtocol::id); }
    private static boolean projection(RatingProjection value) {
        return value != null && id(value.userId()) && ids(value.ratedUserIds()) && ids(value.ratedPairKeys());
    }
    public static boolean valid(AffinityCommand value) { return value != null && id(value.userId()) && value.affinity() != null && Double.isFinite(value.affinity()); }
    public static boolean valid(JobQuery value) { return value != null && value.active() != null && id(value.groupId()) && (value.active() || value.groupId() == null); }
    public static boolean valid(UserQuery value) { return value != null && id(value.userId()); }
    public static boolean valid(EmptyQuery value) { return value != null; }
    public static boolean valid(BackfillCommand value) { return value != null && value.projections() != null && value.projections().size() <= 512 && id(value.changedAt()) && value.projections().stream().allMatch(AccountAffinityProjectionsProtocol::projection); }
    public static boolean valid(RefreshCommand value) { return value != null && projection(value.projection()) && id(value.changedAt()); }
    public static boolean valid(TouchCommand value) { return value != null && id(value.userId()) && value.activityMs() != null; }
}

package com.raxim.myscoutee.microservices.transport.accounts;

import java.net.URI;
import java.time.Duration;
import java.util.List;
import com.raxim.myscoutee.domain.accounts.api.AccountAffinityProjections;
import com.raxim.myscoutee.domain.accounts.dto.ScoringProfileDto;
import com.raxim.myscoutee.domain.platform.api.JobGroupContext;
import com.raxim.myscoutee.microservices.transport.common.RemoteReadTransport;
import io.micrometer.core.instrument.MeterRegistry;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

public final class RemoteAccountAffinityProjections extends RemoteReadTransport implements AccountAffinityProjections {
    private final ObjectMapper mapper;
    public RemoteAccountAffinityProjections(URI origin, String token, boolean allowHttp, Duration connectTimeout,
            Duration requestTimeout, ObjectMapper mapper, MeterRegistry metrics) {
        super(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics); this.mapper = mapper;
    }
    @Override public boolean updateAffinity(String userId, double affinity) {
        var query = new AccountAffinityProjectionsProtocol.AffinityCommand(userId, affinity);
        return decision(AccountAffinityProjectionsProtocol.UPDATE, body(query, AccountAffinityProjectionsProtocol.valid(query)));
    }
    @Override public List<ScoringProfileDto> profilesForCurrentJob() {
        var query = new AccountAffinityProjectionsProtocol.JobQuery(JobGroupContext.isActive(), JobGroupContext.groupId());
        return exchange(AccountAffinityProjectionsProtocol.JOB, body(query, AccountAffinityProjectionsProtocol.valid(query)),
                new TypeReference<List<ScoringProfileDto>>() {}, "account-affinity-projections.job-profiles",
                AccountAffinityProjectionsProtocol.MAX_RESPONSE_BYTES, values -> true);
    }
    @Override public boolean publicRandomRoomCandidate(String userId) {
        var query = new AccountAffinityProjectionsProtocol.UserQuery(userId);
        return decision(AccountAffinityProjectionsProtocol.CANDIDATE, body(query, AccountAffinityProjectionsProtocol.valid(query)));
    }
    @Override public List<String> staleRatingProfileIds() {
        return exchange(AccountAffinityProjectionsProtocol.STALE, body(new AccountAffinityProjectionsProtocol.EmptyQuery(), true),
                new TypeReference<List<String>>() {}, "account-affinity-projections.stale",
                AccountAffinityProjectionsProtocol.MAX_RESPONSE_BYTES, values -> values.stream().allMatch(value -> value != null && !value.isBlank()));
    }
    @Override public void backfillRatings(List<RatingProjection> projections, String changedAt) {
        if (projections == null) throw new IllegalArgumentException("Rating projections required");
        // Validate and bound every payload before performing the first write.
        for (int start = 0; start < projections.size(); start += 512) {
            var query = new AccountAffinityProjectionsProtocol.BackfillCommand(projections.subList(start, Math.min(start + 512, projections.size())), changedAt);
            body(query, AccountAffinityProjectionsProtocol.valid(query));
        }
        for (int start = 0; start < projections.size(); start += 512) {
            var query = new AccountAffinityProjectionsProtocol.BackfillCommand(projections.subList(start, Math.min(start + 512, projections.size())), changedAt);
            command(AccountAffinityProjectionsProtocol.BACKFILL, body(query, true));
        }
    }
    @Override public void refreshRating(RatingProjection projection, String changedAt) {
        var query = new AccountAffinityProjectionsProtocol.RefreshCommand(projection, changedAt);
        command(AccountAffinityProjectionsProtocol.REFRESH, body(query, AccountAffinityProjectionsProtocol.valid(query)));
    }
    @Override public void touchRatingActivity(String userId, long activityMs) {
        var query = new AccountAffinityProjectionsProtocol.TouchCommand(userId, activityMs);
        command(AccountAffinityProjectionsProtocol.TOUCH, body(query, AccountAffinityProjectionsProtocol.valid(query)));
    }
    private boolean decision(String path, byte[] bytes) {
        return exchange(path, bytes, new TypeReference<AccountAffinityProjectionsProtocol.Decision>() {},
                "account-affinity-projections." + path.substring(path.lastIndexOf('/') + 1), 16384, value -> value.value() != null).value();
    }
    private void command(String path, byte[] bytes) {
        exchange(path, bytes, new TypeReference<AccountAffinityProjectionsProtocol.Receipt>() {},
                "account-affinity-projections." + path.substring(path.lastIndexOf('/') + 1), 16384, value -> Boolean.TRUE.equals(value.completed()));
    }
    private byte[] body(Object query, boolean valid) {
        if (!valid) throw new IllegalArgumentException("Invalid account affinity projection input");
        byte[] bytes = mapper.writeValueAsBytes(query);
        if (bytes.length > AccountAffinityProjectionsProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("Request exceeds limit");
        return bytes;
    }
}

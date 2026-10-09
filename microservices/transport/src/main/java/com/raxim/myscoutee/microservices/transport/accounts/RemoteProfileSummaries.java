package com.raxim.myscoutee.microservices.transport.accounts;

import java.net.URI;
import java.time.Duration;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import com.raxim.myscoutee.domain.accounts.api.ProfileSummaries;
import com.raxim.myscoutee.domain.accounts.dto.ProfileSummaryDto;
import com.raxim.myscoutee.microservices.transport.common.RemoteReadTransport;
import io.micrometer.core.instrument.MeterRegistry;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

public final class RemoteProfileSummaries extends RemoteReadTransport implements ProfileSummaries {
    private final ObjectMapper mapper;
    public RemoteProfileSummaries(URI origin, String token, boolean allowHttp, Duration connectTimeout,
            Duration requestTimeout, ObjectMapper mapper, MeterRegistry metrics) {
        super(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics); this.mapper = mapper;
    }
    @Override public List<ProfileSummaryDto> findByProfileStatus(String status) {
        var query = new ProfileSummariesProtocol.StatusQuery(status);
        return exchange(ProfileSummariesProtocol.STATUS, body(query, ProfileSummariesProtocol.valid(query)),
                new TypeReference<List<ProfileSummaryDto>>() {}, "profile-summaries.status",
                ProfileSummariesProtocol.MAX_RESPONSE_BYTES,
                values -> values.stream().allMatch(value -> value != null && java.util.Objects.equals(status, value.profileStatus())));
    }
    @Override public Optional<ProfileSummaryDto> findByUserId(String userId) {
        var query = new ProfileSummariesProtocol.SingleQuery(userId);
        var result = exchange(ProfileSummariesProtocol.SINGLE, body(query, ProfileSummariesProtocol.valid(query)),
                new TypeReference<ProfileSummariesProtocol.SingleResult>() {}, "profile-summaries.single",
                ProfileSummariesProtocol.MAX_RESPONSE_BYTES,
                value -> Boolean.TRUE.equals(value.resolved()) && (value.value() == null || java.util.Objects.equals(userId, value.value().userId())));
        return Optional.ofNullable(result.value());
    }
    @Override public List<ProfileSummaryDto> findByUserIdIn(Collection<String> ids) {
        var query = new ProfileSummariesProtocol.BatchQuery(ids);
        return exchange(ProfileSummariesProtocol.BATCH, body(query, ProfileSummariesProtocol.valid(query)),
                new TypeReference<List<ProfileSummaryDto>>() {}, "profile-summaries.batch",
                ProfileSummariesProtocol.MAX_RESPONSE_BYTES,
                values -> values.stream().allMatch(value -> value == null || ids.contains(value.userId())));
    }
    @Override public List<ProfileSummaryDto> findByWorkspaceGroupIdAndAccountUserIdIn(String groupId, Collection<String> accounts) {
        var query = new ProfileSummariesProtocol.WorkspaceQuery(groupId, accounts);
        return exchange(ProfileSummariesProtocol.WORKSPACE, body(query, ProfileSummariesProtocol.valid(query)),
                new TypeReference<List<ProfileSummaryDto>>() {}, "profile-summaries.workspace",
                ProfileSummariesProtocol.MAX_RESPONSE_BYTES,
                values -> values.stream().allMatch(value -> value == null || (java.util.Objects.equals(groupId, value.workspaceGroupId()) && accounts.contains(value.accountUserId()))));
    }
    @Override public List<ProfileSummaryDto> findByWorkspaceGroupId(String groupId) {
        var query = new ProfileSummariesProtocol.WorkspaceAllQuery(groupId);
        return exchange(ProfileSummariesProtocol.WORKSPACE_ALL, body(query, ProfileSummariesProtocol.valid(query)),
                new TypeReference<List<ProfileSummaryDto>>() {}, "profile-summaries.workspace-all",
                ProfileSummariesProtocol.MAX_RESPONSE_BYTES,
                values -> values.stream().allMatch(value -> value != null && java.util.Objects.equals(groupId, value.workspaceGroupId())));
    }
    @Override public long countByUserIdIn(Collection<String> ids) {
        var query = new ProfileSummariesProtocol.BatchQuery(ids);
        return exchange(ProfileSummariesProtocol.COUNT, body(query, ProfileSummariesProtocol.valid(query)),
                new TypeReference<Long>() {}, "profile-summaries.count", 16384, value -> value >= 0);
    }
    @Override public List<ProfileSummaryDto> pageByUserIdIn(Collection<String> ids, int offset, int limit) {
        var query = new ProfileSummariesProtocol.PageQuery(ids, offset, limit);
        return exchange(ProfileSummariesProtocol.PAGE, body(query, ProfileSummariesProtocol.valid(query)),
                new TypeReference<List<ProfileSummaryDto>>() {}, "profile-summaries.page", ProfileSummariesProtocol.MAX_RESPONSE_BYTES,
                values -> values.size() <= limit && values.stream().allMatch(value -> value == null || ids.contains(value.userId())));
    }
    @Override public Set<String> savedContactIds(String userId) {
        var query = new ProfileSummariesProtocol.SingleQuery(userId);
        return exchange(ProfileSummariesProtocol.CONTACTS, body(query, ProfileSummariesProtocol.valid(query)),
                new TypeReference<Set<String>>() {}, "profile-summaries.saved-contacts", ProfileSummariesProtocol.MAX_RESPONSE_BYTES,
                values -> values.stream().allMatch(java.util.Objects::nonNull));
    }
    @Override public com.raxim.myscoutee.domain.accounts.dto.PaymentMemberSummariesDto paymentMemberSummaries(
            String workspace, String actor, int page, int size) {
        var query = new ProfileSummariesProtocol.PaymentMembersQuery(workspace, actor, page, size);
        return exchange(ProfileSummariesProtocol.PAYMENT_MEMBERS, body(query, ProfileSummariesProtocol.valid(query)),
                new TypeReference<com.raxim.myscoutee.domain.accounts.dto.PaymentMemberSummariesDto>() {},
                "profile-summaries.payment-members", ProfileSummariesProtocol.MAX_RESPONSE_BYTES,
                value -> value.total() >= 0 && value.items() != null && value.items().size() <= size
                        && value.items().stream().allMatch(item -> item != null && !java.util.Objects.equals(actor, item.userId())
                                && java.util.Objects.equals(workspace, item.workspaceGroupId())));
    }
    private byte[] body(Object query, boolean valid) {
        if (!valid) throw new IllegalArgumentException("Invalid profile-summary query");
        byte[] result = mapper.writeValueAsBytes(query);
        if (result.length > ProfileSummariesProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("Request exceeds limit");
        return result;
    }
}

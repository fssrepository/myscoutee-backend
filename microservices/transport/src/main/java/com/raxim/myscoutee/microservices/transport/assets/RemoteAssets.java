package com.raxim.myscoutee.microservices.transport.assets;

import com.raxim.myscoutee.domain.assets.api.Assets;
import java.net.URI;
import java.time.Duration;
import com.raxim.myscoutee.microservices.transport.common.RemoteReadTransport;
import io.micrometer.core.instrument.MeterRegistry;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

/** Bounded scoped call to the existing owner; no automatic retries. */
public final class RemoteAssets extends RemoteReadTransport implements Assets {
    private final ObjectMapper mapper;
    private final com.raxim.myscoutee.microservices.transport.security.ActorDelegation.Signer signer;
    public RemoteAssets(URI origin, String token, boolean allowHttp, Duration connectTimeout,
            Duration requestTimeout, ObjectMapper mapper, MeterRegistry metrics, com.raxim.myscoutee.microservices.transport.security.ActorDelegation.Signer signer) {
        super(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics); this.mapper = mapper; this.signer = signer;
    }
    @Override public boolean canManageScopedAssetMembers(String assetId, String eventId, String subEventId, String userId) {
        var command = new AssetsProtocol.Query(AssetsProtocol.Scope.current(), userId, assetId, eventId, subEventId, null, null);
        if (!AssetsProtocol.valid(command)) throw new IllegalArgumentException("Invalid assets request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > AssetsProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("assets request exceeds byte limit");
        var result = ownerExchange(AssetsProtocol.MANAGE, bytes, new TypeReference<AssetsProtocol.Decision>() {},
                "assets.manage", AssetsProtocol.MAX_RESPONSE_BYTES, v -> v.value()!=null);
        return result.value();
    }
    @Override public java.util.Optional<com.raxim.myscoutee.domain.assets.dto.AssetOwnershipDto> findAssetByAssetId(String assetId) {
        var command = new AssetsProtocol.Query(AssetsProtocol.Scope.current(), null, assetId, null, null, null, null);
        if (!AssetsProtocol.valid(command)) throw new IllegalArgumentException("Invalid assets request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > AssetsProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("assets request exceeds byte limit");
        var result = ownerExchange(AssetsProtocol.FIND, bytes, new TypeReference<AssetsProtocol.Result>() {},
                "assets.find", AssetsProtocol.MAX_RESPONSE_BYTES, v -> Boolean.TRUE.equals(v.resolved()));
        return java.util.Optional.ofNullable(result.value());
    }
    @Override public java.util.Optional<com.raxim.myscoutee.domain.assets.dto.AssetOwnershipDto> findAssetByAssetIdWithScopedRequests(String assetId, String eventId, String subEventId, String requestStatus, String assetRequestId) {
        var command = new AssetsProtocol.Query(AssetsProtocol.Scope.current(), null, assetId, eventId, subEventId, requestStatus, assetRequestId);
        if (!AssetsProtocol.valid(command)) throw new IllegalArgumentException("Invalid assets request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > AssetsProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("assets request exceeds byte limit");
        var result = ownerExchange(AssetsProtocol.SCOPED, bytes, new TypeReference<AssetsProtocol.Result>() {},
                "assets.scoped", AssetsProtocol.MAX_RESPONSE_BYTES, v -> Boolean.TRUE.equals(v.resolved()));
        return java.util.Optional.ofNullable(result.value());
    }
    @Override public com.raxim.myscoutee.domain.assets.dto.AssetsDtos.AssetDetailDto queryAssetDetail(String userId, String assetId, String eventId, String subEventId) {
        var command = new AssetsProtocol.Query(AssetsProtocol.Scope.current(), userId, assetId, eventId, subEventId, null, null);
        if (!AssetsProtocol.valid(command)) throw new IllegalArgumentException("Invalid assets request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > AssetsProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("assets request exceeds byte limit");
        var result = ownerExchange(AssetsProtocol.DETAIL, bytes, new TypeReference<AssetsProtocol.Detail>() {},
                "assets.detail", AssetsProtocol.MAX_RESPONSE_BYTES, v -> Boolean.TRUE.equals(v.resolved()));
        return result.value();
    }
    @Override public java.util.Map<String, com.raxim.myscoutee.domain.assets.dto.AssetsDtos.AssetDetailDto> queryAssignableAssetDetails(String userId, String eventId, String subEventId, java.util.Collection<String> assetIds) {
        var command = new AssetsProtocol.Batch(AssetsProtocol.Scope.current(), userId, eventId, subEventId, assetIds);
        if (!AssetsProtocol.valid(command)) throw new IllegalArgumentException("Invalid assets request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > AssetsProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("assets request exceeds byte limit");
        var result = ownerExchange(AssetsProtocol.ASSIGNABLE, bytes, new TypeReference<java.util.Map<String, com.raxim.myscoutee.domain.assets.dto.AssetsDtos.AssetDetailDto>>() {},
                "assets.assignable", AssetsProtocol.MAX_RESPONSE_BYTES, v -> assetIds.containsAll(v.keySet()));
        return result;
    }
    @Override public java.util.Map<String, com.raxim.myscoutee.domain.assets.dto.AssetsDtos.AssetDetailDto> queryReferencedAssetDetails(String viewerUserId, java.util.Collection<String> assetIds) {
        var command = new AssetsProtocol.Batch(AssetsProtocol.Scope.current(), viewerUserId, null, null, assetIds);
        if (!AssetsProtocol.valid(command)) throw new IllegalArgumentException("Invalid assets request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > AssetsProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("assets request exceeds byte limit");
        var result = ownerExchange(AssetsProtocol.REFERENCED, bytes, new TypeReference<java.util.Map<String, com.raxim.myscoutee.domain.assets.dto.AssetsDtos.AssetDetailDto>>() {},
                "assets.referenced", AssetsProtocol.MAX_RESPONSE_BYTES, v -> assetIds.containsAll(v.keySet()));
        return result;
    }
    @Override public com.raxim.myscoutee.domain.assets.dto.AssetsDtos.AssetExplorePageDto queryVisibleAssetsPage(String userId, String type, String category, String startAtIso, String endAtIso, Integer page, Integer pageSize, String cursor, String order) {
        var command = new AssetsProtocol.Page(AssetsProtocol.Scope.current(), userId, type, category, startAtIso, endAtIso, page, pageSize, cursor, order);
        if (!AssetsProtocol.valid(command)) throw new IllegalArgumentException("Invalid assets request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > AssetsProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("assets request exceeds byte limit");
        var result = ownerExchange(AssetsProtocol.PAGE, bytes, new TypeReference<com.raxim.myscoutee.domain.assets.dto.AssetsDtos.AssetExplorePageDto>() {},
                "assets.page", AssetsProtocol.MAX_RESPONSE_BYTES, v -> true);
        return result;
    }
    @Override public void statusDeleteAssignmentScopeRequests(String assetOwnerUserId, java.util.Collection<String> assetIds, String ownerId, String authorizationEventId, String subEventId, String actorUserId, String deletedAtIso) {
        var command = new AssetsProtocol.DeleteScope(AssetsProtocol.Scope.current(), assetOwnerUserId, assetIds, ownerId, authorizationEventId, subEventId, actorUserId, deletedAtIso);
        if (!AssetsProtocol.valid(command)) throw new IllegalArgumentException("Invalid assets request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > AssetsProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("assets request exceeds byte limit");
        var result = ownerExchange(AssetsProtocol.DELETE_SCOPE, bytes, new TypeReference<AssetsProtocol.Receipt>() {},
                "assets.delete_scope", AssetsProtocol.MAX_RESPONSE_BYTES, v -> Boolean.TRUE.equals(v.completed()));
    }
    @Override public java.util.Set<String> statusDeleteEventAssignmentRequestsForUsers(java.util.Collection<String> assetIds, java.util.Collection<String> userIds, String eventId, String actorUserId, String deletedAtIso) {
        var command = new AssetsProtocol.DeleteUsers(AssetsProtocol.Scope.current(), assetIds, userIds, eventId, actorUserId, deletedAtIso);
        if (!AssetsProtocol.valid(command)) throw new IllegalArgumentException("Invalid assets request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > AssetsProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("assets request exceeds byte limit");
        var result = ownerExchange(AssetsProtocol.DELETE_USERS, bytes, new TypeReference<java.util.Set<String>>() {},
                "assets.delete_users", AssetsProtocol.MAX_RESPONSE_BYTES, v -> assetIds.containsAll(v));
        return result;
    }
    @Override public void syncRequestsFromMembers(String assetId, java.util.List<? extends com.raxim.myscoutee.domain.events.api.MemberDirectory.Member> members) {
        var command = new AssetsProtocol.Members(AssetsProtocol.Scope.current(), assetId, members == null ? null : members.stream().map(v -> v == null ? null : com.raxim.myscoutee.domain.events.dto.MemberDirectoryEntryDto.from(v)).toList());
        if (!AssetsProtocol.valid(command)) throw new IllegalArgumentException("Invalid assets request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > AssetsProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("assets request exceeds byte limit");
        var result = ownerExchange(AssetsProtocol.MEMBERS, bytes, new TypeReference<AssetsProtocol.Receipt>() {},
                "assets.members", AssetsProtocol.MAX_RESPONSE_BYTES, v -> Boolean.TRUE.equals(v.completed()));
    }
    @Override public String syncScopedRequestsFromMemberEntries(String assetId, String eventId, String subEventId, java.util.List<com.raxim.myscoutee.common.dto.SharedDtos.ActivityMemberEntryDto> members, String actorUserId) {
        var command = new AssetsProtocol.Entries(AssetsProtocol.Scope.current(), assetId, eventId, subEventId, members, actorUserId);
        if (!AssetsProtocol.valid(command)) throw new IllegalArgumentException("Invalid assets request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > AssetsProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("assets request exceeds byte limit");
        var result = ownerExchange(AssetsProtocol.ENTRIES, bytes, new TypeReference<AssetsProtocol.Status>() {},
                "assets.entries", AssetsProtocol.MAX_RESPONSE_BYTES, v -> Boolean.TRUE.equals(v.resolved()));
        return result.value();
    }
    @Override public com.raxim.myscoutee.domain.assets.dto.AssetsDtos.AssetDto upsert(com.raxim.myscoutee.domain.assets.dto.AssetsDtos.AssetUpsertRequestDto request) {
        var command = new AssetsProtocol.Save(AssetsProtocol.Scope.current(), request);
        if (!AssetsProtocol.valid(command)) throw new IllegalArgumentException("Invalid assets request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > AssetsProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("assets request exceeds byte limit");
        var result = ownerExchange(AssetsProtocol.UPSERT, bytes, new TypeReference<AssetsProtocol.Saved>() {},
                "assets.upsert", AssetsProtocol.MAX_RESPONSE_BYTES, v -> Boolean.TRUE.equals(v.resolved()));
        return result.value();
    }
    private <T> T ownerExchange(String path, byte[] bytes, TypeReference<T> type, String operation, int limit,
            java.util.function.Predicate<T> valid) {
        try {
            if (AssetsProtocol.delegated(path)) return exchangeAuthorized(path, bytes, type, operation, limit, valid,
                    java.util.Map.of(com.raxim.myscoutee.microservices.transport.security.ActorDelegation.HEADER,
                            signer.issueForCurrent(AssetsProtocol.AUDIENCE, "POST", path, bytes)));
            return exchange(path, bytes, type, operation, limit, valid);
        }
        catch (RemoteReadException failure) {
            if (failure.status() >= 400 && failure.status() < 500 && "OWNER_REJECTED".equals(failure.remoteCode()))
                throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatusCode.valueOf(failure.status()));
            throw failure;
        }
    }

    @Override public java.util.Optional<com.raxim.myscoutee.domain.assets.dto.AssetOwnershipDto> findAssetByAssetIdWithScopedRequests(String assetId, String eventId, String subEventId, String status) {
        return findAssetByAssetIdWithScopedRequests(assetId,eventId,subEventId,status,null);
    }
    @Override public com.raxim.myscoutee.domain.assets.dto.AssetsDtos.AssetDetailDto queryAssetDetail(String userId, String assetId) {
        return queryAssetDetail(userId,assetId,null,null);
    }
}

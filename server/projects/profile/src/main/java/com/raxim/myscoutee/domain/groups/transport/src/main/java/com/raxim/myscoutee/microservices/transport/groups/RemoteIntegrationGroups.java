package com.raxim.myscoutee.microservices.transport.groups;

import com.raxim.myscoutee.microservices.transport.common.ProtocolFields;
import com.raxim.myscoutee.domain.groups.api.IntegrationGroups;
import java.net.URI;
import java.time.Duration;
import com.raxim.myscoutee.microservices.transport.common.RemoteReadTransport;
import io.micrometer.core.instrument.MeterRegistry;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

/** Bounded scoped call to the existing owner; no automatic retries. */
public final class RemoteIntegrationGroups extends RemoteReadTransport implements IntegrationGroups {
    private final ObjectMapper mapper;
    private final com.raxim.myscoutee.microservices.transport.security.ActorDelegation.Signer signer;
    public RemoteIntegrationGroups(URI origin, String token, boolean allowHttp, Duration connectTimeout,
            Duration requestTimeout, ObjectMapper mapper, MeterRegistry metrics, com.raxim.myscoutee.microservices.transport.security.ActorDelegation.Signer signer) {
        super(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics); this.mapper = mapper; this.signer = signer;
    }
    @Override public com.raxim.myscoutee.domain.accounts.dto.DiscoveryProfileDto actor(String requestedId) {
        var command = new IntegrationGroupsProtocol.Actor1(ProtocolFields.JobScope.current(), requestedId);
        if (!IntegrationGroupsProtocol.valid(command)) throw new IllegalArgumentException("Invalid integration-groups request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > IntegrationGroupsProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("integration-groups request exceeds byte limit");
        var result = ownerExchange(IntegrationGroupsProtocol.ACTOR_1, bytes, new TypeReference<IntegrationGroupsProtocol.Actor1Result>() {},
                "integration-groups.actor_1", IntegrationGroupsProtocol.MAX_RESPONSE_BYTES, v -> Boolean.TRUE.equals(v.resolved()));
        return result.value();
    }
    @Override public com.raxim.myscoutee.domain.groups.dto.CommunityGroupDtos.Group detail(com.raxim.myscoutee.domain.accounts.api.DiscoveryProfile actor, String id) {
        var command = new IntegrationGroupsProtocol.Detail1(ProtocolFields.JobScope.current(), actor == null ? null : actor.getUserId(), id);
        if (!IntegrationGroupsProtocol.valid(command)) throw new IllegalArgumentException("Invalid integration-groups request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > IntegrationGroupsProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("integration-groups request exceeds byte limit");
        var result = ownerExchange(IntegrationGroupsProtocol.DETAIL_1, bytes, new TypeReference<IntegrationGroupsProtocol.Detail1Result>() {},
                "integration-groups.detail_1", IntegrationGroupsProtocol.MAX_RESPONSE_BYTES, v -> Boolean.TRUE.equals(v.resolved()));
        return result.value();
    }
    @Override public com.raxim.myscoutee.domain.groups.dto.CommunityGroupDtos.Page page(com.raxim.myscoutee.domain.accounts.api.DiscoveryProfile actor, String bucket, String category, int pageSize, String cursor) {
        var command = new IntegrationGroupsProtocol.Page1(ProtocolFields.JobScope.current(), actor == null ? null : actor.getUserId(), bucket, category, pageSize, cursor);
        if (!IntegrationGroupsProtocol.valid(command)) throw new IllegalArgumentException("Invalid integration-groups request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > IntegrationGroupsProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("integration-groups request exceeds byte limit");
        var result = ownerExchange(IntegrationGroupsProtocol.PAGE_1, bytes, new TypeReference<IntegrationGroupsProtocol.Page1Result>() {},
                "integration-groups.page_1", IntegrationGroupsProtocol.MAX_RESPONSE_BYTES, v -> Boolean.TRUE.equals(v.resolved()));
        return result.value();
    }
    @Override public com.raxim.myscoutee.domain.groups.dto.CommunityGroupDtos.Page page(com.raxim.myscoutee.domain.accounts.api.DiscoveryProfile actor, String bucket, String category, int pageSize, String cursor, String sort) {
        var command = new IntegrationGroupsProtocol.Page2(ProtocolFields.JobScope.current(), actor == null ? null : actor.getUserId(), bucket, category, pageSize, cursor, sort);
        if (!IntegrationGroupsProtocol.valid(command)) throw new IllegalArgumentException("Invalid integration-groups request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > IntegrationGroupsProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("integration-groups request exceeds byte limit");
        var result = ownerExchange(IntegrationGroupsProtocol.PAGE_2, bytes, new TypeReference<IntegrationGroupsProtocol.Page2Result>() {},
                "integration-groups.page_2", IntegrationGroupsProtocol.MAX_RESPONSE_BYTES, v -> Boolean.TRUE.equals(v.resolved()));
        return result.value();
    }
    @Override public void joinWorkspaceBase(com.raxim.myscoutee.domain.accounts.api.DiscoveryProfile actor, String groupId) {
        var command = new IntegrationGroupsProtocol.JoinWorkspaceBase1(ProtocolFields.JobScope.current(), actor == null ? null : actor.getUserId(), groupId);
        if (!IntegrationGroupsProtocol.valid(command)) throw new IllegalArgumentException("Invalid integration-groups request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > IntegrationGroupsProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("integration-groups request exceeds byte limit");
        var result = ownerExchange(IntegrationGroupsProtocol.JOINWORKSPACEBASE_1, bytes, new TypeReference<ProtocolFields.Receipt>() {},
                "integration-groups.joinworkspacebase_1", IntegrationGroupsProtocol.MAX_RESPONSE_BYTES, v -> Boolean.TRUE.equals(v.completed()));
    }
    @Override public void claimIntegrationInvite(com.raxim.myscoutee.domain.integrations.api.ParticipantInvitation invite, String actorUserId) {
        var command = new IntegrationGroupsProtocol.ClaimIntegrationInvite1(ProtocolFields.JobScope.current(), com.raxim.myscoutee.domain.integrations.dto.ParticipantInvitationDto.from(invite), actorUserId);
        if (!IntegrationGroupsProtocol.valid(command)) throw new IllegalArgumentException("Invalid integration-groups request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > IntegrationGroupsProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("integration-groups request exceeds byte limit");
        var result = ownerExchange(IntegrationGroupsProtocol.CLAIMINTEGRATIONINVITE_1, bytes, new TypeReference<ProtocolFields.Receipt>() {},
                "integration-groups.claimintegrationinvite_1", IntegrationGroupsProtocol.MAX_RESPONSE_BYTES, v -> Boolean.TRUE.equals(v.completed()));
    }
    @Override public com.raxim.myscoutee.domain.accounts.dto.DiscoveryProfileDto claimEventInvite(String groupId, String inviterProfileId, String accountId) {
        var command = new IntegrationGroupsProtocol.ClaimEventInvite1(ProtocolFields.JobScope.current(), groupId, inviterProfileId, accountId);
        if (!IntegrationGroupsProtocol.valid(command)) throw new IllegalArgumentException("Invalid integration-groups request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > IntegrationGroupsProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("integration-groups request exceeds byte limit");
        var result = ownerExchange(IntegrationGroupsProtocol.CLAIMEVENTINVITE_1, bytes, new TypeReference<IntegrationGroupsProtocol.ClaimEventInvite1Result>() {},
                "integration-groups.claimeventinvite_1", IntegrationGroupsProtocol.MAX_RESPONSE_BYTES, v -> Boolean.TRUE.equals(v.resolved()));
        return result.value();
    }
    @Override public java.util.List<com.raxim.myscoutee.domain.groups.dto.GroupDirectoryEntryDto> administeredGroups(com.raxim.myscoutee.domain.accounts.api.DiscoveryProfile actor) {
        var command = new IntegrationGroupsProtocol.AdministeredGroups1(ProtocolFields.JobScope.current(), actor == null ? null : actor.getUserId());
        if (!IntegrationGroupsProtocol.valid(command)) throw new IllegalArgumentException("Invalid integration-groups request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > IntegrationGroupsProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("integration-groups request exceeds byte limit");
        var result = ownerExchange(IntegrationGroupsProtocol.ADMINISTEREDGROUPS_1, bytes, new TypeReference<java.util.List<com.raxim.myscoutee.domain.groups.dto.GroupDirectoryEntryDto>>() {},
                "integration-groups.administeredgroups_1", IntegrationGroupsProtocol.MAX_RESPONSE_BYTES, v -> true);
        return result;
    }
    @Override public void requireAdmin(com.raxim.myscoutee.domain.accounts.api.DiscoveryProfile actor, String id) {
        var command = new IntegrationGroupsProtocol.RequireAdmin1(ProtocolFields.JobScope.current(), actor == null ? null : actor.getUserId(), id);
        if (!IntegrationGroupsProtocol.valid(command)) throw new IllegalArgumentException("Invalid integration-groups request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > IntegrationGroupsProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("integration-groups request exceeds byte limit");
        var result = ownerExchange(IntegrationGroupsProtocol.REQUIREADMIN_1, bytes, new TypeReference<ProtocolFields.Receipt>() {},
                "integration-groups.requireadmin_1", IntegrationGroupsProtocol.MAX_RESPONSE_BYTES, v -> Boolean.TRUE.equals(v.completed()));
    }
    private <T> T ownerExchange(String path, byte[] bytes, TypeReference<T> type, String operation, int limit,
            java.util.function.Predicate<T> valid) {
        try {
            if (IntegrationGroupsProtocol.delegated(path)) return exchangeAuthorized(path, bytes, type, operation, limit, valid,
                    java.util.Map.of(com.raxim.myscoutee.microservices.transport.security.ActorDelegation.HEADER,
                            signer.issueForCurrent(IntegrationGroupsProtocol.AUDIENCE, "POST", path, bytes)));
            return exchange(path, bytes, type, operation, limit, valid);
        }
        catch (RemoteReadException failure) {
            if (failure.status() >= 400 && failure.status() < 500 && "OWNER_REJECTED".equals(failure.remoteCode()))
                throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatusCode.valueOf(failure.status()));
            throw failure;
        }
    }

}

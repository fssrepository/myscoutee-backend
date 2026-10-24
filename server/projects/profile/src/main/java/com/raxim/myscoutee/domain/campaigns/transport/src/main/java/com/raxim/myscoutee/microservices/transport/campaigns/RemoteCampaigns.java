package com.raxim.myscoutee.microservices.transport.campaigns;

import com.raxim.myscoutee.microservices.transport.common.ProtocolFields;
import com.raxim.myscoutee.domain.campaigns.api.Campaigns;
import java.net.URI;
import java.time.Duration;
import com.raxim.myscoutee.microservices.transport.common.RemoteReadTransport;
import io.micrometer.core.instrument.MeterRegistry;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

/** Bounded scoped call to the existing owner; no automatic retries. */
public final class RemoteCampaigns extends RemoteReadTransport implements Campaigns {
    private final ObjectMapper mapper;
    private final com.raxim.myscoutee.microservices.transport.security.ActorDelegation.Signer signer;
    public RemoteCampaigns(URI origin, String token, boolean allowHttp, Duration connectTimeout,
            Duration requestTimeout, ObjectMapper mapper, MeterRegistry metrics, com.raxim.myscoutee.microservices.transport.security.ActorDelegation.Signer signer) {
        super(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics); this.mapper = mapper; this.signer = signer;
    }
    @Override public com.raxim.myscoutee.domain.accounts.dto.DiscoveryProfileDto actor(String requestedId) {
        var command = new CampaignsProtocol.Actor1(ProtocolFields.JobScope.current(), requestedId);
        if (!CampaignsProtocol.valid(command)) throw new IllegalArgumentException("Invalid campaigns request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > CampaignsProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("campaigns request exceeds byte limit");
        var result = ownerExchange(CampaignsProtocol.ACTOR_1, bytes, new TypeReference<CampaignsProtocol.Actor1Result>() {},
                "campaigns.actor_1", CampaignsProtocol.MAX_RESPONSE_BYTES, v -> Boolean.TRUE.equals(v.resolved()));
        return result.value();
    }
    @Override public com.raxim.myscoutee.domain.campaigns.dto.CampaignSummaryDto visible(com.raxim.myscoutee.domain.accounts.api.DiscoveryProfile actor, String id) {
        var command = new CampaignsProtocol.Visible1(ProtocolFields.JobScope.current(), actor == null ? null : actor.getUserId(), id);
        if (!CampaignsProtocol.valid(command)) throw new IllegalArgumentException("Invalid campaigns request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > CampaignsProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("campaigns request exceeds byte limit");
        var result = ownerExchange(CampaignsProtocol.VISIBLE_1, bytes, new TypeReference<CampaignsProtocol.Visible1Result>() {},
                "campaigns.visible_1", CampaignsProtocol.MAX_RESPONSE_BYTES, v -> Boolean.TRUE.equals(v.resolved()));
        return result.value();
    }
    @Override public com.raxim.myscoutee.domain.campaigns.dto.CampaignDtos.Item detail(com.raxim.myscoutee.domain.accounts.api.DiscoveryProfile actor, String id) {
        var command = new CampaignsProtocol.Detail1(ProtocolFields.JobScope.current(), actor == null ? null : actor.getUserId(), id);
        if (!CampaignsProtocol.valid(command)) throw new IllegalArgumentException("Invalid campaigns request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > CampaignsProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("campaigns request exceeds byte limit");
        var result = ownerExchange(CampaignsProtocol.DETAIL_1, bytes, new TypeReference<CampaignsProtocol.Detail1Result>() {},
                "campaigns.detail_1", CampaignsProtocol.MAX_RESPONSE_BYTES, v -> Boolean.TRUE.equals(v.resolved()));
        return result.value();
    }
    @Override public com.raxim.myscoutee.domain.campaigns.dto.CampaignDtos.HistoryPage history(com.raxim.myscoutee.domain.accounts.api.DiscoveryProfile actor, String targetUserId, int pageSize, String cursor) {
        var command = new CampaignsProtocol.History1(ProtocolFields.JobScope.current(), actor == null ? null : actor.getUserId(), targetUserId, pageSize, cursor);
        if (!CampaignsProtocol.valid(command)) throw new IllegalArgumentException("Invalid campaigns request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > CampaignsProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("campaigns request exceeds byte limit");
        var result = ownerExchange(CampaignsProtocol.HISTORY_1, bytes, new TypeReference<CampaignsProtocol.History1Result>() {},
                "campaigns.history_1", CampaignsProtocol.MAX_RESPONSE_BYTES, v -> Boolean.TRUE.equals(v.resolved()));
        return result.value();
    }
    @Override public com.raxim.myscoutee.domain.campaigns.dto.CampaignDtos.Page page(com.raxim.myscoutee.domain.accounts.api.DiscoveryProfile actor, String scope, String status, String search, String kind, String category, String sort, int pageSize, String cursor) {
        var command = new CampaignsProtocol.Page1(ProtocolFields.JobScope.current(), actor == null ? null : actor.getUserId(), scope, status, search, kind, category, sort, pageSize, cursor);
        if (!CampaignsProtocol.valid(command)) throw new IllegalArgumentException("Invalid campaigns request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > CampaignsProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("campaigns request exceeds byte limit");
        var result = ownerExchange(CampaignsProtocol.PAGE_1, bytes, new TypeReference<CampaignsProtocol.Page1Result>() {},
                "campaigns.page_1", CampaignsProtocol.MAX_RESPONSE_BYTES, v -> Boolean.TRUE.equals(v.resolved()));
        return result.value();
    }
    @Override public com.raxim.myscoutee.domain.campaigns.dto.CampaignDtos.Item save(com.raxim.myscoutee.domain.accounts.api.DiscoveryProfile actor, com.raxim.myscoutee.domain.campaigns.dto.CampaignDtos.Save request) {
        var command = new CampaignsProtocol.Save1(ProtocolFields.JobScope.current(), actor == null ? null : actor.getUserId(), request);
        if (!CampaignsProtocol.valid(command)) throw new IllegalArgumentException("Invalid campaigns request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > CampaignsProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("campaigns request exceeds byte limit");
        var result = ownerExchange(CampaignsProtocol.SAVE_1, bytes, new TypeReference<CampaignsProtocol.Save1Result>() {},
                "campaigns.save_1", CampaignsProtocol.MAX_RESPONSE_BYTES, v -> Boolean.TRUE.equals(v.resolved()));
        return result.value();
    }
    @Override public com.raxim.myscoutee.domain.campaigns.dto.CampaignDtos.Item createImported(com.raxim.myscoutee.domain.accounts.api.DiscoveryProfile actor, com.raxim.myscoutee.domain.campaigns.dto.CampaignDtos.Save request, String allocatedId) {
        var command = new CampaignsProtocol.CreateImported1(ProtocolFields.JobScope.current(), actor == null ? null : actor.getUserId(), request, allocatedId);
        if (!CampaignsProtocol.valid(command)) throw new IllegalArgumentException("Invalid campaigns request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > CampaignsProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("campaigns request exceeds byte limit");
        var result = ownerExchange(CampaignsProtocol.CREATEIMPORTED_1, bytes, new TypeReference<CampaignsProtocol.CreateImported1Result>() {},
                "campaigns.createimported_1", CampaignsProtocol.MAX_RESPONSE_BYTES, v -> Boolean.TRUE.equals(v.resolved()));
        return result.value();
    }
    @Override public com.raxim.myscoutee.domain.campaigns.dto.CampaignDtos.Item action(com.raxim.myscoutee.domain.accounts.api.DiscoveryProfile actor, String id, com.raxim.myscoutee.domain.campaigns.dto.CampaignDtos.Command request) {
        var command = new CampaignsProtocol.Action1(ProtocolFields.JobScope.current(), actor == null ? null : actor.getUserId(), id, request);
        if (!CampaignsProtocol.valid(command)) throw new IllegalArgumentException("Invalid campaigns request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > CampaignsProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("campaigns request exceeds byte limit");
        var result = ownerExchange(CampaignsProtocol.ACTION_1, bytes, new TypeReference<CampaignsProtocol.Action1Result>() {},
                "campaigns.action_1", CampaignsProtocol.MAX_RESPONSE_BYTES, v -> Boolean.TRUE.equals(v.resolved()));
        return result.value();
    }
    private <T> T ownerExchange(String path, byte[] bytes, TypeReference<T> type, String operation, int limit,
            java.util.function.Predicate<T> valid) {
        try {
            if (CampaignsProtocol.delegated(path)) return exchangeAuthorized(path, bytes, type, operation, limit, valid,
                    java.util.Map.of(com.raxim.myscoutee.microservices.transport.security.ActorDelegation.HEADER,
                            signer.issueForCurrent(CampaignsProtocol.AUDIENCE, "POST", path, bytes)));
            return exchange(path, bytes, type, operation, limit, valid);
        }
        catch (RemoteReadException failure) {
            if (failure.status() >= 400 && failure.status() < 500 && "OWNER_REJECTED".equals(failure.remoteCode()))
                throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatusCode.valueOf(failure.status()));
            throw failure;
        }
    }

}

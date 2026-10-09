package com.raxim.myscoutee.microservices.transport.chat;

import com.raxim.myscoutee.domain.chat.api.CampaignConversations;
import java.net.URI;
import java.time.Duration;
import com.raxim.myscoutee.microservices.transport.common.RemoteReadTransport;
import io.micrometer.core.instrument.MeterRegistry;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

/** Bounded scoped call to the existing owner; no automatic retries. */
public final class RemoteCampaignConversations extends RemoteReadTransport implements CampaignConversations {
    private final ObjectMapper mapper;
    public RemoteCampaignConversations(URI origin, String token, boolean allowHttp, Duration connectTimeout,
            Duration requestTimeout, ObjectMapper mapper, MeterRegistry metrics) {
        super(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics); this.mapper = mapper;
    }
    @Override public java.util.List<com.raxim.myscoutee.domain.chat.api.CampaignConversations.Interaction> interactions(String actorId, String targetId) {
        var command = new CampaignConversationsProtocol.Query(CampaignConversationsProtocol.Scope.current(), actorId, targetId);
        if (!CampaignConversationsProtocol.valid(command)) throw new IllegalArgumentException("Invalid campaign-conversations request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > CampaignConversationsProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("campaign-conversations request exceeds byte limit");
        var result = ownerExchange(CampaignConversationsProtocol.INTERACTIONS, bytes, new TypeReference<java.util.List<com.raxim.myscoutee.domain.chat.api.CampaignConversations.Interaction>>() {},
                "campaign-conversations.interactions", CampaignConversationsProtocol.MAX_RESPONSE_BYTES, v -> true);
        return result;
    }
    private <T> T ownerExchange(String path, byte[] bytes, TypeReference<T> type, String operation, int limit,
            java.util.function.Predicate<T> valid) {
        try { return exchange(path, bytes, type, operation, limit, valid); }
        catch (RemoteReadException failure) {
            if (failure.status() >= 400 && failure.status() < 500 && "OWNER_REJECTED".equals(failure.remoteCode()))
                throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatusCode.valueOf(failure.status()));
            throw failure;
        }
    }

}

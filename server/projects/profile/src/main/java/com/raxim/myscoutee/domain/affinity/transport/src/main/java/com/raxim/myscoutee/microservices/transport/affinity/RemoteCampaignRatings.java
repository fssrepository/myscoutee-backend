package com.raxim.myscoutee.microservices.transport.affinity;

import com.raxim.myscoutee.domain.affinity.api.CampaignRatings;
import java.net.URI;
import java.time.Duration;
import com.raxim.myscoutee.microservices.transport.common.RemoteReadTransport;
import io.micrometer.core.instrument.MeterRegistry;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

/** Bounded scoped call to the existing owner; no automatic retries. */
public final class RemoteCampaignRatings extends RemoteReadTransport implements CampaignRatings {
    private final ObjectMapper mapper;
    public RemoteCampaignRatings(URI origin, String token, boolean allowHttp, Duration connectTimeout,
            Duration requestTimeout, ObjectMapper mapper, MeterRegistry metrics) {
        super(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics); this.mapper = mapper;
    }
    @Override public java.util.List<com.raxim.myscoutee.domain.affinity.api.CampaignRatings.Evidence> relevant(String viewer, String campaignId) {
        var command = new CampaignRatingsProtocol.Query(CampaignRatingsProtocol.Scope.current(), viewer, campaignId);
        if (!CampaignRatingsProtocol.valid(command)) throw new IllegalArgumentException("Invalid campaign-ratings request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > CampaignRatingsProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("campaign-ratings request exceeds byte limit");
        var result = ownerExchange(CampaignRatingsProtocol.RELEVANT, bytes, new TypeReference<java.util.List<com.raxim.myscoutee.domain.affinity.api.CampaignRatings.Evidence>>() {},
                "campaign-ratings.relevant", CampaignRatingsProtocol.MAX_RESPONSE_BYTES, v -> true);
        return result;
    }
    @Override public java.util.List<com.raxim.myscoutee.domain.affinity.api.CampaignRatings.Evidence> pair(String viewer, String target) {
        var command = new CampaignRatingsProtocol.Query(CampaignRatingsProtocol.Scope.current(), viewer, target);
        if (!CampaignRatingsProtocol.valid(command)) throw new IllegalArgumentException("Invalid campaign-ratings request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > CampaignRatingsProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("campaign-ratings request exceeds byte limit");
        var result = ownerExchange(CampaignRatingsProtocol.PAIR, bytes, new TypeReference<java.util.List<com.raxim.myscoutee.domain.affinity.api.CampaignRatings.Evidence>>() {},
                "campaign-ratings.pair", CampaignRatingsProtocol.MAX_RESPONSE_BYTES, v -> true);
        return result;
    }
    @Override public java.util.List<com.raxim.myscoutee.domain.affinity.api.CampaignRatings.Evidence> byViewer(String viewer) {
        var command = new CampaignRatingsProtocol.Query(CampaignRatingsProtocol.Scope.current(), viewer, null);
        if (!CampaignRatingsProtocol.valid(command)) throw new IllegalArgumentException("Invalid campaign-ratings request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > CampaignRatingsProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("campaign-ratings request exceeds byte limit");
        var result = ownerExchange(CampaignRatingsProtocol.VIEWER, bytes, new TypeReference<java.util.List<com.raxim.myscoutee.domain.affinity.api.CampaignRatings.Evidence>>() {},
                "campaign-ratings.viewer", CampaignRatingsProtocol.MAX_RESPONSE_BYTES, v -> true);
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

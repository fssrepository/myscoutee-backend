package com.raxim.myscoutee.microservices.transport.campaigns;

import java.net.URI;
import java.time.Duration;
import java.util.*;
import com.raxim.myscoutee.domain.campaigns.api.CampaignCatalog;
import com.raxim.myscoutee.domain.campaigns.dto.CampaignSummaryDto;
import com.raxim.myscoutee.microservices.transport.common.RemoteReadTransport;
import io.micrometer.core.instrument.MeterRegistry;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

public final class RemoteCampaignCatalog extends RemoteReadTransport implements CampaignCatalog {
    private final ObjectMapper mapper;
    public RemoteCampaignCatalog(URI origin, String token, boolean allowHttp, Duration connectTimeout,
            Duration requestTimeout, ObjectMapper mapper, MeterRegistry metrics) {
        super(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics); this.mapper = mapper;
    }
    @Override public CampaignSummaryDto find(String id) {
        var query = new CampaignCatalogProtocol.SingleQuery(id);
        return exchange(CampaignCatalogProtocol.SINGLE, body(query, CampaignCatalogProtocol.valid(query)),
                new TypeReference<CampaignCatalogProtocol.SingleResult>() {}, "campaigns.single", CampaignCatalogProtocol.MAX_RESPONSE_BYTES,
                result -> Boolean.TRUE.equals(result.resolved()) && (result.value() == null || Objects.equals(id, result.value().id()))).value();
    }
    @Override public Map<String, CampaignSummaryDto> findByIds(Collection<String> ids) {
        var query = new CampaignCatalogProtocol.BatchQuery(ids);
        return exchange(CampaignCatalogProtocol.BATCH, body(query, CampaignCatalogProtocol.valid(query)),
                new TypeReference<Map<String, CampaignSummaryDto>>() {}, "campaigns.batch", CampaignCatalogProtocol.MAX_RESPONSE_BYTES,
                values -> values.entrySet().stream().allMatch(entry -> ids.contains(entry.getKey()) && entry.getValue() != null && entry.getKey().equals(entry.getValue().id())));
    }
    @Override public boolean ownedExists(String ownerUserId, String id) {
        var query = new CampaignCatalogProtocol.OwnedQuery(ownerUserId, id);
        return exchange(CampaignCatalogProtocol.OWNED, body(query, CampaignCatalogProtocol.valid(query)),
                new TypeReference<CampaignCatalogProtocol.Decision>() {}, "campaigns.owned", 16384, result -> result.value() != null).value();
    }
    private byte[] body(Object query, boolean valid) {
        if (!valid) throw new IllegalArgumentException("Invalid campaign query");
        byte[] bytes = mapper.writeValueAsBytes(query);
        if (bytes.length > CampaignCatalogProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("Campaign query exceeds byte limit");
        return bytes;
    }
}

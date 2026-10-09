package com.raxim.myscoutee.microservices.transport.campaigns;

import java.net.URI;
import java.time.Duration;
import java.util.List;
import com.raxim.myscoutee.domain.campaigns.api.CampaignMediaVisibility;
import com.raxim.myscoutee.domain.campaigns.dto.CampaignMediaVisibilityDto;
import com.raxim.myscoutee.microservices.transport.common.MediaReferenceQueries;
import com.raxim.myscoutee.microservices.transport.common.RemoteReadTransport;
import io.micrometer.core.instrument.MeterRegistry;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

public final class RemoteCampaignMediaVisibility extends RemoteReadTransport implements CampaignMediaVisibility {
    private final ObjectMapper mapper;
    public RemoteCampaignMediaVisibility(URI origin, String token, boolean allowHttp, Duration connectTimeout,
            Duration requestTimeout, ObjectMapper mapper, MeterRegistry metrics) {
        super(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics);
        this.mapper = mapper;
    }
    @Override public CampaignMediaVisibilityDto mediaReference(List<String> urls) {
        byte[] body = MediaReferenceQueries.encode(urls, mapper);
        try {
            return exchange(CampaignMediaVisibilityProtocol.PATH, body, new TypeReference<CampaignMediaVisibilityDto>() {},
                    "campaigns.media-visibility", CampaignMediaVisibilityProtocol.MAX_RESPONSE_BYTES, value -> true);
        } catch (RemoteReadException failure) {
            if (failure.status() == 404 && "NOT_FOUND".equals(failure.remoteCode())) return null;
            throw failure;
        }
    }
}

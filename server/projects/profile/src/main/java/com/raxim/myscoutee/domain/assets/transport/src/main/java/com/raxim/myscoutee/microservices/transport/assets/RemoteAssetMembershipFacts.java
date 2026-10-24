package com.raxim.myscoutee.microservices.transport.assets;

import java.net.URI;
import java.time.Duration;
import java.util.List;
import java.util.Optional;
import com.raxim.myscoutee.domain.assets.api.AssetMembershipFacts;
import com.raxim.myscoutee.domain.assets.dto.AssetMembershipFactsDto;
import com.raxim.myscoutee.microservices.transport.common.RemoteReadTransport;
import io.micrometer.core.instrument.MeterRegistry;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

public final class RemoteAssetMembershipFacts extends RemoteReadTransport implements AssetMembershipFacts {
    public RemoteAssetMembershipFacts(URI origin, String token, boolean allowHttp, Duration connectTimeout,
            Duration requestTimeout, ObjectMapper mapper, MeterRegistry metrics) {
        super(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics);
    }
    @Override public Optional<AssetMembershipFactsDto> findByAssetId(String id) {
        try {
            return Optional.of(exchange(queryPath(AssetMembershipFactsProtocol.PATH, "id", id), new TypeReference<AssetMembershipFactsDto>() {}, "asset-membership-facts", AssetMembershipFactsProtocol.MAX_RESPONSE_BYTES, value -> true));
        } catch (RemoteReadException failure) {
            if (failure.status() == 404 && "NOT_FOUND".equals(failure.remoteCode())) return Optional.empty();
            throw failure;
        }
    }
}

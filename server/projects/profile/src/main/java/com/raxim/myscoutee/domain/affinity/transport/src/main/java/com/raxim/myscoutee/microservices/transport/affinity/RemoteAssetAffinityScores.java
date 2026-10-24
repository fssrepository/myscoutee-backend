package com.raxim.myscoutee.microservices.transport.affinity;

import java.net.URI;
import java.time.Duration;
import com.raxim.myscoutee.domain.affinity.api.AssetAffinityScores;
import com.raxim.myscoutee.domain.assets.api.AssetScoringFacts;
import com.raxim.myscoutee.domain.assets.dto.AssetScoringFactsDto;
import com.raxim.myscoutee.domain.accounts.api.AssetAffinityProfile;
import com.raxim.myscoutee.domain.accounts.dto.AssetAffinityProfileDto;
import com.raxim.myscoutee.microservices.transport.common.RemoteReadTransport;
import io.micrometer.core.instrument.MeterRegistry;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

public final class RemoteAssetAffinityScores extends RemoteReadTransport implements AssetAffinityScores {
    private final ObjectMapper mapper;
    public RemoteAssetAffinityScores(URI origin, String token, boolean allowHttp, Duration connectTimeout,
            Duration requestTimeout, ObjectMapper mapper, MeterRegistry metrics) {
        super(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics); this.mapper = mapper;
    }
    @Override public double resolveAssetAffinity(AssetScoringFacts asset, AssetAffinityProfile owner) {
        return score(AssetAffinityScoresProtocol.AFFINITY, "asset-scores.affinity", asset, owner);
    }
    @Override public double resolveAssetBoost(AssetScoringFacts asset, AssetAffinityProfile owner) {
        return score(AssetAffinityScoresProtocol.BOOST, "asset-scores.boost", asset, owner);
    }
    private double score(String path, String operation, AssetScoringFacts asset, AssetAffinityProfile owner) {
        byte[] bytes = mapper.writeValueAsBytes(new AssetAffinityScoresProtocol.Query(AssetScoringFactsDto.from(asset), AssetAffinityProfileDto.from(owner)));
        if (bytes.length > AssetAffinityScoresProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("Asset scoring input exceeds limit");
        return exchange(path, bytes, new TypeReference<AssetAffinityScoresProtocol.Result>() {}, operation,
                16384, result -> result.value() != null && Double.isFinite(result.value())).value();
    }
}

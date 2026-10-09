package com.raxim.myscoutee.microservices.transport.affinity;

import com.raxim.myscoutee.domain.assets.dto.AssetScoringFactsDto;
import com.raxim.myscoutee.domain.accounts.dto.AssetAffinityProfileDto;

public final class AssetAffinityScoresProtocol {
    public static final String AFFINITY = "/_internal/v1/affinity/asset-scores/affinity";
    public static final String BOOST = "/_internal/v1/affinity/asset-scores/boost";
    public static final int MAX_REQUEST_BYTES = 2 * 1024 * 1024;
    private AssetAffinityScoresProtocol() {}
    public static String[] paths() { return new String[]{AFFINITY, BOOST}; }
    public record Query(AssetScoringFactsDto asset, AssetAffinityProfileDto owner) {}
    public record Result(Double value) {}
    public record Error(String code) {}
}

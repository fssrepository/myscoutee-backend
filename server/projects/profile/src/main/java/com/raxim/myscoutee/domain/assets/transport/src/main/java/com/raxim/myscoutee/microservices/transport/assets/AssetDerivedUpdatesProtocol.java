package com.raxim.myscoutee.microservices.transport.assets;

import com.raxim.myscoutee.domain.assets.dto.AssetVersionDto;

public final class AssetDerivedUpdatesProtocol {
    public static final String AFFINITY = "/_internal/v1/assets/projections/affinity";
    public static final String STATUS = "/_internal/v1/assets/projections/status";
    public static final int MAX_REQUEST_BYTES = 16384, MAX_RESPONSE_BYTES = 16384;
    private AssetDerivedUpdatesProtocol() {}
    public static String[] paths() { return new String[]{AFFINITY, STATUS}; }
    public record AffinityCommand(AssetVersionDto version, Double affinity, Double boost) {}
    public record StatusCommand(AssetVersionDto version, String status, String previousStatus) {}
    public record Result(Boolean matched) {}
    public record Error(String code) {}
    private static boolean text(String value) { return value == null || value.length() <= 512; }
    private static boolean version(AssetVersionDto value) { return value == null || text(value.id()) && text(value.updatedDate()); }
    public static boolean valid(AffinityCommand value) {
        return value != null && version(value.version()) && value.affinity() != null && value.boost() != null
                && Double.isFinite(value.affinity()) && Double.isFinite(value.boost());
    }
    public static boolean valid(StatusCommand value) {
        return value != null && version(value.version()) && text(value.status()) && text(value.previousStatus());
    }
}

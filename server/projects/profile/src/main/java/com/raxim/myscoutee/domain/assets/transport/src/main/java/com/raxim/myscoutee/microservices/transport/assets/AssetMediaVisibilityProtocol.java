package com.raxim.myscoutee.microservices.transport.assets;

public final class AssetMediaVisibilityProtocol {
    public static final String PATH = "/_internal/v1/assets/media-visibility";
    public static final int MAX_RESPONSE_BYTES = 4096;
    private AssetMediaVisibilityProtocol() {}
    public record Error(String code) {}
}

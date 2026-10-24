package com.raxim.myscoutee.microservices.transport.assets;

public final class AssetJobScopesProtocol {
    public static final String PATH = "/_internal/v1/assets/job-scope";
    public static final int MAX_RESPONSE_BYTES = 8192;
    private AssetJobScopesProtocol() {}
    public record Error(String code) {}
    public static String[] paths() { return new String[]{PATH}; }
}

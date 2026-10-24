package com.raxim.myscoutee.microservices.transport.assets;

public final class AssetMembershipFactsProtocol {
    public static final String PATH = "/_internal/v1/assets/membership-facts";
    public static final int MAX_RESPONSE_BYTES = 2 * 1024 * 1024;
    private AssetMembershipFactsProtocol() {}
    public record Error(String code) {}
}

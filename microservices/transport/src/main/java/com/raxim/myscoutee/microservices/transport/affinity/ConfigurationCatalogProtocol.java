package com.raxim.myscoutee.microservices.transport.affinity;

public final class ConfigurationCatalogProtocol {
    public static final String ACTIVE = "/_internal/v1/affinity/configuration/active";
    public static final String FIND = "/_internal/v1/affinity/configuration/entry";
    public static final int MAX_RESPONSE_BYTES = 16384;
    private ConfigurationCatalogProtocol() {}
    public record Error(String code) {}
    public static String[] paths() { return new String[]{ACTIVE, FIND}; }
}

package com.raxim.myscoutee.microservices.transport.groups;

public final class GroupMediaVisibilityProtocol {
    public static final String PATH = "/_internal/v1/groups/media-visibility";
    public static final int MAX_RESPONSE_BYTES = 4096;
    private GroupMediaVisibilityProtocol() {}
    public record Error(String code) {}
}

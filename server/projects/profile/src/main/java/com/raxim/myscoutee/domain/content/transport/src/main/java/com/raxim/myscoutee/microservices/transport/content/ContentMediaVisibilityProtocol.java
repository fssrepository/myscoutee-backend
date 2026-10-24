package com.raxim.myscoutee.microservices.transport.content;

public final class ContentMediaVisibilityProtocol {
    public static final String PATH = "/_internal/v1/content/media-visibility";
    public static final int MAX_RESPONSE_BYTES = 4096;
    private ContentMediaVisibilityProtocol() {}
    public record Error(String code) {}
}

package com.raxim.myscoutee.microservices.transport.community;

public final class CommunityMediaVisibilityProtocol {
    public static final String ANNOUNCEMENT_PATH = "/_internal/v1/community/media/announcement";
    public static final String OFFERING_PATH = "/_internal/v1/community/media/offering";
    public static final int MAX_QUERY_BYTES = com.raxim.myscoutee.microservices.transport.common.MediaReferenceQueries.MAX_QUERY_BYTES;
    public static final String DOCUMENTS_PATH = "/_internal/v1/community/media/documents";
    public static final int MAX_DOCUMENT_RESPONSE_BYTES = 1024 * 1024;
    public static final int MAX_RESPONSE_BYTES = 4096;
    private CommunityMediaVisibilityProtocol() {}
    public record Error(String code) {}
}

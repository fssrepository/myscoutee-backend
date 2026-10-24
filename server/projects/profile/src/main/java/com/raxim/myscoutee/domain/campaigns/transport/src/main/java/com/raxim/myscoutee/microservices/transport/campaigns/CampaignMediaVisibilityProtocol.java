package com.raxim.myscoutee.microservices.transport.campaigns;

public final class CampaignMediaVisibilityProtocol {
    public static final String PATH = "/_internal/v1/campaigns/media-visibility";
    public static final String DOCUMENTS_PATH = "/_internal/v1/campaigns/media-visibility/documents";
    public static final int MAX_DOCUMENT_RESPONSE_BYTES = 1024 * 1024;
    public static final int MAX_RESPONSE_BYTES = 4096;
    private CampaignMediaVisibilityProtocol() {}
    public record Error(String code) {}
}

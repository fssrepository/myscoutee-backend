package com.raxim.myscoutee.microservices.transport.campaigns;

public final class CampaignMediaVisibilityProtocol {
    public static final String PATH = "/_internal/v1/campaigns/media-visibility";
    public static final int MAX_RESPONSE_BYTES = 4096;
    private CampaignMediaVisibilityProtocol() {}
    public record Error(String code) {}
}

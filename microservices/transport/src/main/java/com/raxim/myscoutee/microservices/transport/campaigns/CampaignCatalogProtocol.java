package com.raxim.myscoutee.microservices.transport.campaigns;

import java.util.Collection;
import com.raxim.myscoutee.domain.campaigns.dto.CampaignSummaryDto;

public final class CampaignCatalogProtocol {
    public static final String SINGLE = "/_internal/v1/campaigns/catalog/single", BATCH = "/_internal/v1/campaigns/catalog/batch", OWNED = "/_internal/v1/campaigns/catalog/owned";
    public static final int MAX_REQUEST_BYTES = 2 * 1024 * 1024, MAX_RESPONSE_BYTES = 8 * 1024 * 1024;
    private CampaignCatalogProtocol() {}
    public static String[] paths() { return new String[]{SINGLE, BATCH, OWNED}; }
    public record SingleQuery(String id) {}
    public record BatchQuery(Collection<String> ids) {}
    public record OwnedQuery(String ownerUserId, String id) {}
    public record SingleResult(Boolean resolved, CampaignSummaryDto value) {}
    public record Decision(Boolean value) {}
    public record Error(String code) {}
    private static boolean id(String value) { return value == null || value.length() <= 512; }
    public static boolean valid(SingleQuery q) { return q != null && id(q.id()); }
    public static boolean valid(BatchQuery q) { return q != null && q.ids() != null && q.ids().size() <= 4096 && q.ids().stream().allMatch(CampaignCatalogProtocol::id); }
    public static boolean valid(OwnedQuery q) { return q != null && id(q.ownerUserId()) && id(q.id()); }
}

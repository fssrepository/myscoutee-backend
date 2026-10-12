package com.raxim.myscoutee.microservices.transport.campaigns;

import java.util.Collection;
import com.raxim.myscoutee.domain.campaigns.dto.CampaignSummaryDto;
import com.raxim.myscoutee.domain.campaigns.dto.CampaignOrganizerContactDto;

public final class CampaignCatalogProtocol {
    public static final String SINGLE = "/_internal/v1/campaigns/catalog/single", BATCH = "/_internal/v1/campaigns/catalog/batch", OWNED = "/_internal/v1/campaigns/catalog/owned";
    public static final String ORGANIZER_CONTACT = "/_internal/v1/campaigns/catalog/organizer-contact";
    public static final int MAX_REQUEST_BYTES = 2 * 1024 * 1024, MAX_RESPONSE_BYTES = 8 * 1024 * 1024;
    private CampaignCatalogProtocol() {}
    public static String[] paths() { return new String[]{SINGLE, BATCH, OWNED, ORGANIZER_CONTACT}; }
    public record SingleQuery(String id) {}
    public record BatchQuery(Collection<String> ids) {}
    public record OwnedQuery(String ownerUserId, String id) {}
    public record OrganizerContactQuery(String id, String viewerId, String workspaceGroupId) {}
    public record OrganizerContactResult(Boolean resolved, CampaignOrganizerContactDto value) {}
    public record SingleResult(Boolean resolved, CampaignSummaryDto value) {}
    public record Decision(Boolean value) {}
    public record Error(String code) {}
    private static boolean id(String value) { return value == null || value.length() <= 512; }
    public static boolean valid(SingleQuery q) { return q != null && id(q.id()); }
    public static boolean valid(BatchQuery q) { return q != null && q.ids() != null && q.ids().size() <= 4096 && q.ids().stream().allMatch(CampaignCatalogProtocol::id); }
    public static boolean valid(OrganizerContactQuery q) { return q != null && id(q.id()) && q.viewerId() != null && !q.viewerId().isBlank() && id(q.viewerId()) && id(q.workspaceGroupId()); }
    public static boolean valid(OwnedQuery q) { return q != null && id(q.ownerUserId()) && id(q.id()); }
}

package com.raxim.myscoutee.microservices.transport.campaigns;

import com.raxim.myscoutee.domain.campaigns.api.Campaigns;

public final class CampaignsProtocol {
    public static final String ACTOR_1 = "/_internal/v1/campaigns/campaigns/actor_1";
    public static final String VISIBLE_1 = "/_internal/v1/campaigns/campaigns/visible_1";
    public static final String DETAIL_1 = "/_internal/v1/campaigns/campaigns/detail_1";
    public static final String HISTORY_1 = "/_internal/v1/campaigns/campaigns/history_1";
    public static final String PAGE_1 = "/_internal/v1/campaigns/campaigns/page_1";
    public static final String SAVE_1 = "/_internal/v1/campaigns/campaigns/save_1";
    public static final String CREATEIMPORTED_1 = "/_internal/v1/campaigns/campaigns/createimported_1";
    public static final String ACTION_1 = "/_internal/v1/campaigns/campaigns/action_1";
    public static final int MAX_REQUEST_BYTES = 2 * 1024 * 1024, MAX_RESPONSE_BYTES = 8 * 1024 * 1024;
    public static final String AUDIENCE = "campaigns:campaigns";
    public static boolean delegated(String path) { return java.util.Set.of(ACTOR_1, VISIBLE_1, DETAIL_1, HISTORY_1, PAGE_1, SAVE_1, CREATEIMPORTED_1, ACTION_1).contains(path); }
    private CampaignsProtocol() {}
    public static String[] paths() { return new String[]{ACTOR_1, VISIBLE_1, DETAIL_1, HISTORY_1, PAGE_1, SAVE_1, CREATEIMPORTED_1, ACTION_1}; }
    public record Error(String code) {}
    public record Scope(Boolean active, String groupId) {
        public static Scope current() { return new Scope(com.raxim.myscoutee.domain.platform.api.JobGroupContext.isActive(), com.raxim.myscoutee.domain.platform.api.JobGroupContext.groupId()); }
    }
    private static boolean text(String value, int limit) { return value == null || value.length() <= limit; }
    private static boolean scope(Scope value) { return value != null && value.active() != null && text(value.groupId(), 512) && (value.active() || value.groupId() == null); }
    private static boolean ids(java.util.Collection<String> values) { return values != null && values.size() <= 4096 && values.stream().allMatch(value -> text(value, 512)); }
    public record Receipt(Boolean completed) {}
    public record Actor1(Scope scope, String requestedId) {}
    public static boolean valid(Actor1 q) { return q!=null && scope(q.scope()) && text(q.requestedId(),8192); }
    public record Actor1Result(Boolean resolved, com.raxim.myscoutee.domain.accounts.dto.DiscoveryProfileDto value) {}
    public record Visible1(Scope scope, String actorId, String id) {}
    public static boolean valid(Visible1 q) { return q!=null && scope(q.scope()) && text(q.actorId(),8192) && text(q.id(),8192); }
    public record Visible1Result(Boolean resolved, com.raxim.myscoutee.domain.campaigns.dto.CampaignSummaryDto value) {}
    public record Detail1(Scope scope, String actorId, String id) {}
    public static boolean valid(Detail1 q) { return q!=null && scope(q.scope()) && text(q.actorId(),8192) && text(q.id(),8192); }
    public record Detail1Result(Boolean resolved, com.raxim.myscoutee.domain.campaigns.dto.CampaignDtos.Item value) {}
    public record History1(Scope scope, String actorId, String targetUserId, @com.fasterxml.jackson.annotation.JsonProperty(required = true) @com.fasterxml.jackson.annotation.JsonSetter(nulls = com.fasterxml.jackson.annotation.Nulls.FAIL) int pageSize, String cursor) {}
    public static boolean valid(History1 q) { return q!=null && scope(q.scope()) && text(q.actorId(),8192) && text(q.targetUserId(),8192) && text(q.cursor(),8192); }
    public record History1Result(Boolean resolved, com.raxim.myscoutee.domain.campaigns.dto.CampaignDtos.HistoryPage value) {}
    public record Page1(Scope scope, String actorId, String requestedScope, String status, String search, String kind, String category, String sort, @com.fasterxml.jackson.annotation.JsonProperty(required = true) @com.fasterxml.jackson.annotation.JsonSetter(nulls = com.fasterxml.jackson.annotation.Nulls.FAIL) int pageSize, String cursor) {}
    public static boolean valid(Page1 q) { return q!=null && scope(q.scope()) && text(q.actorId(),8192) && text(q.requestedScope(),8192) && text(q.status(),8192) && text(q.search(),8192) && text(q.kind(),8192) && text(q.category(),8192) && text(q.sort(),8192) && text(q.cursor(),8192); }
    public record Page1Result(Boolean resolved, com.raxim.myscoutee.domain.campaigns.dto.CampaignDtos.Page value) {}
    public record Save1(Scope scope, String actorId, com.raxim.myscoutee.domain.campaigns.dto.CampaignDtos.Save request) {}
    public static boolean valid(Save1 q) { return q!=null && scope(q.scope()) && text(q.actorId(),8192); }
    public record Save1Result(Boolean resolved, com.raxim.myscoutee.domain.campaigns.dto.CampaignDtos.Item value) {}
    public record CreateImported1(Scope scope, String actorId, com.raxim.myscoutee.domain.campaigns.dto.CampaignDtos.Save request, String allocatedId) {}
    public static boolean valid(CreateImported1 q) { return q!=null && scope(q.scope()) && text(q.actorId(),8192) && text(q.allocatedId(),8192); }
    public record CreateImported1Result(Boolean resolved, com.raxim.myscoutee.domain.campaigns.dto.CampaignDtos.Item value) {}
    public record Action1(Scope scope, String actorId, String id, com.raxim.myscoutee.domain.campaigns.dto.CampaignDtos.Command request) {}
    public static boolean valid(Action1 q) { return q!=null && scope(q.scope()) && text(q.actorId(),8192) && text(q.id(),8192); }
    public record Action1Result(Boolean resolved, com.raxim.myscoutee.domain.campaigns.dto.CampaignDtos.Item value) {}
}

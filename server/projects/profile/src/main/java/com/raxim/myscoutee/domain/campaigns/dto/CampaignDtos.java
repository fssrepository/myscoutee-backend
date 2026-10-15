package com.raxim.myscoutee.domain.campaigns.dto;

import java.util.List;
import com.raxim.myscoutee.domain.media.dto.DocumentAttachment;

public final class CampaignDtos {
    private CampaignDtos() {}
    public record Item(String id, String workspaceGroupId, String ownerUserId, String ownerName,
            String ownerAvatarUrl, String ownerCity, Double distanceKm, String title, String description,
            String kind, String category, List<String> imageUrls, List<DocumentAttachment> attachments, String status, String createdAtIso, String updatedAtIso, Long version, double viewerRating, com.raxim.myscoutee.domain.affinity.api.CampaignRatings.RatingSnapshot viewerRatingSnapshot, java.util.Map<String, Integer> ownCounters) {
        public Item(String id, String workspaceGroupId, String ownerUserId, String ownerName,
            String ownerAvatarUrl, String ownerCity, Double distanceKm, String title, String description,
            String kind, String category, List<String> imageUrls, List<DocumentAttachment> attachments, String status, String createdAtIso, String updatedAtIso, Long version, double viewerRating, com.raxim.myscoutee.domain.affinity.api.CampaignRatings.RatingSnapshot viewerRatingSnapshot) { this(id, workspaceGroupId, ownerUserId, ownerName, ownerAvatarUrl, ownerCity, distanceKm, title, description, kind, category, imageUrls, attachments, status, createdAtIso, updatedAtIso, version, viewerRating, viewerRatingSnapshot, null); }
        public Item withOwnCounters(java.util.Map<String, Integer> counters) {
            return new Item(id, workspaceGroupId, ownerUserId, ownerName, ownerAvatarUrl, ownerCity, distanceKm, title, description, kind, category, imageUrls, attachments, status, createdAtIso, updatedAtIso, version, viewerRating, viewerRatingSnapshot, counters);
        }
    }
    public record Save(String userId, String id, String title, String description, String kind, String category,
            List<String> imageUrls, List<DocumentAttachment> attachments, Long version) {}
    public record Command(String userId, String action, Long version) {}
    public record Page(List<Item> items, long total, String nextCursor) {}
    public record HistoryItem(Item campaign, String lastInteractionAtIso) {}
    public record HistoryPage(List<HistoryItem> items, long total, String nextCursor) {}
}

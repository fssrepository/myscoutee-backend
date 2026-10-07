package com.raxim.myscoutee.domain.affinity.api;

import java.util.List;
import java.util.Map;

public interface CampaignRatings {
    List<Evidence> relevant(String viewerId, String campaignId);
    List<Evidence> pair(String actorId, String targetId);
    List<Evidence> byViewer(String viewerId);
    record Evidence(String mode, String ownerUserId, String campaignId, Double scoreGiven,
            String createdDate, String updatedDate, Map<String, RatingSnapshot> ratingSnapshots) {}
    record RatingSnapshot(Integer version, String profileType, Map<String, Double> criteria, Double average) {}
}

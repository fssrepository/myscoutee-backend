package com.raxim.myscoutee.domain.affinity.api;
public interface RatingDirectory {
    java.util.List<? extends RatingView> findRelevantByUserIds(java.util.List<String> ids);
    java.util.List<? extends RatingView> findAll();
    java.util.List<? extends RatingView> findHomeGameExclusionProjections(String id);
    boolean hasPositiveCampaignRating(String campaignId, String viewerId, String organizerId);
}

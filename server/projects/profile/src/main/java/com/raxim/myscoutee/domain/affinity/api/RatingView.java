package com.raxim.myscoutee.domain.affinity.api;
public interface RatingView {
    String getCampaignId();
    String getId();
    String getSyncKey();
    String getMode();
    String getCreatedDate();
    String getCreatedUser();
    String getUpdatedDate();
    String getUpdatedUser();
    String getOwnerUserId();
    String getRelatedUserId();
    String getSecondaryRelatedUserId();
    Double getScoreGiven();
    Double getScoreReceived();
    Double getAffinityScore();
    Double getEvidenceConfidence();
    Boolean getMutuallyRated();
    String getSocialContext();
    String getBridgeUserId();
    Integer getBridgeCount();
    Boolean getMet();
    String getMetEventId();
    String getEventName();
    Integer getDistanceMetersExact();
}

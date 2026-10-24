package com.raxim.myscoutee.domain.affinity.api;
public interface RatingView extends com.raxim.myscoutee.common.dto.AuditFields, com.raxim.myscoutee.common.dto.EntityIdentity {
    String getCampaignId();

    
    String getMode();

    

    
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

package com.raxim.myscoutee.domain.affinity.dto;

import com.raxim.myscoutee.domain.affinity.api.RatingView;

/** Exact directory view; supplemental rating snapshots remain owner-local. */
public record RatingDirectoryEntryDto(
        String campaignId,
        String id,
        String syncKey,
        String mode,
        String createdDate,
        String createdUser,
        String updatedDate,
        String updatedUser,
        String ownerUserId,
        String relatedUserId,
        String secondaryRelatedUserId,
        Double scoreGiven,
        Double scoreReceived,
        Double affinityScore,
        Double evidenceConfidence,
        Boolean mutuallyRated,
        String socialContext,
        String bridgeUserId,
        Integer bridgeCount,
        Boolean met,
        String metEventId,
        String eventName,
        Integer distanceMetersExact) implements RatingView, com.raxim.myscoutee.common.dto.AuditFields.RecordFields, com.raxim.myscoutee.common.dto.EntityIdentity.RecordFields {
    public static RatingDirectoryEntryDto from(RatingView rating) {
        return new RatingDirectoryEntryDto(rating.getCampaignId(), rating.getId(), rating.getSyncKey(), rating.getMode(), rating.getCreatedDate(), rating.getCreatedUser(), rating.getUpdatedDate(), rating.getUpdatedUser(), rating.getOwnerUserId(), rating.getRelatedUserId(), rating.getSecondaryRelatedUserId(), rating.getScoreGiven(), rating.getScoreReceived(), rating.getAffinityScore(), rating.getEvidenceConfidence(), rating.getMutuallyRated(), rating.getSocialContext(), rating.getBridgeUserId(), rating.getBridgeCount(), rating.getMet(), rating.getMetEventId(), rating.getEventName(), rating.getDistanceMetersExact());
    }
    @Override public String getCampaignId() { return campaignId; }
    @Override public String getMode() { return mode; }
    @Override public String getOwnerUserId() { return ownerUserId; }
    @Override public String getRelatedUserId() { return relatedUserId; }
    @Override public String getSecondaryRelatedUserId() { return secondaryRelatedUserId; }
    @Override public Double getScoreGiven() { return scoreGiven; }
    @Override public Double getScoreReceived() { return scoreReceived; }
    @Override public Double getAffinityScore() { return affinityScore; }
    @Override public Double getEvidenceConfidence() { return evidenceConfidence; }
    @Override public Boolean getMutuallyRated() { return mutuallyRated; }
    @Override public String getSocialContext() { return socialContext; }
    @Override public String getBridgeUserId() { return bridgeUserId; }
    @Override public Integer getBridgeCount() { return bridgeCount; }
    @Override public Boolean getMet() { return met; }
    @Override public String getMetEventId() { return metEventId; }
    @Override public String getEventName() { return eventName; }
    @Override public Integer getDistanceMetersExact() { return distanceMetersExact; }
}

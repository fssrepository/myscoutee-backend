package com.raxim.myscoutee.domain.events.dto;

import java.util.List;
import com.raxim.myscoutee.common.dto.SharedDtos.*;
import com.raxim.myscoutee.domain.events.api.EventOwnership;

/** Stored event read facts; mutations carry EventVersionDto and explicit changed fields. */
public record EventOwnershipDto(
        List<String> acceptedMemberUserIds,
        List<String> invitedMemberUserIds,
        List<String> pendingRequestMemberUserIds,
        String statusBeforeSuppression,
        Boolean ticketing,
        String avatar,
        Boolean isTrashed,
        Boolean isExpired,
        MingleConfigurationDto mingleConfiguration,
        String organizerUserId,
        PricingConfigDto pricing,
        Boolean paymentDeadlineEnabled,
        Integer paymentDeadlineHours,
        String cancelledAtIso,
        String parentEventId,
        Boolean generated,
        String eventType,
        String slotTemplateId,
        List<EventSlotOccurrenceDto> upcomingSlots,
        List<EventSlotTemplateDto> slotTemplates,
        List<SubEventDefinitionDto> subEventDefinitions,
        Boolean isAdmin,
        String creatorName,
        String creatorInitials,
        Double distanceKm,
        String endAtIso,
        String timeframe,
        String imageUrl,
        String sourceLink,
        Boolean published,
        String campaignId,
        String id,
        String syncKey,
        String sourceId,
        String ownerUserId,
        String title,
        String subtitle,
        String creatorGender,
        String creatorCity,
        String visibility,
        String blindMode,
        String startAtIso,
        String location,
        LocationCoordinatesDto locationCoordinates,
        Integer capacityTotal,
        String frequency,
        List<PolicyItemDto> policies,
        Integer acceptedMembers,
        Integer pendingMembers,
        List<String> topics,
        List<SubEventItemDto> subEvents,
        String mode,
        Double rating,
        Double boost,
        Double affinity,
        String createdDate,
        String createdUser,
        String updatedUser,
        String status,
        String creatorUserId,
        String workspaceGroupId,
        String updatedDate,
        List<String> admins, List<String> pendingMemberUserIds) implements EventOwnership.Event, com.raxim.myscoutee.common.dto.EntityIdentity.RecordFields {
    public EventOwnershipDto {
        if (pendingMemberUserIds != null) pendingMemberUserIds = java.util.Collections.unmodifiableList(new java.util.ArrayList<>(pendingMemberUserIds));
        if (acceptedMemberUserIds != null) acceptedMemberUserIds = java.util.Collections.unmodifiableList(new java.util.ArrayList<>(acceptedMemberUserIds));
        if (invitedMemberUserIds != null) invitedMemberUserIds = java.util.Collections.unmodifiableList(new java.util.ArrayList<>(invitedMemberUserIds));
        if (pendingRequestMemberUserIds != null) pendingRequestMemberUserIds = java.util.Collections.unmodifiableList(new java.util.ArrayList<>(pendingRequestMemberUserIds));
        if (upcomingSlots != null) upcomingSlots = java.util.Collections.unmodifiableList(new java.util.ArrayList<>(upcomingSlots));
        if (slotTemplates != null) slotTemplates = java.util.Collections.unmodifiableList(new java.util.ArrayList<>(slotTemplates));
        if (subEventDefinitions != null) subEventDefinitions = java.util.Collections.unmodifiableList(new java.util.ArrayList<>(subEventDefinitions));
        if (policies != null) policies = java.util.Collections.unmodifiableList(new java.util.ArrayList<>(policies));
        if (topics != null) topics = java.util.Collections.unmodifiableList(new java.util.ArrayList<>(topics));
        if (subEvents != null) subEvents = java.util.Collections.unmodifiableList(new java.util.ArrayList<>(subEvents));
        if (admins != null) admins = java.util.Collections.unmodifiableList(new java.util.ArrayList<>(admins));
    }
    public static EventOwnershipDto from(EventOwnership.Event value) {
        if (value == null) return null;
        return new EventOwnershipDto(
                value.getAcceptedMemberUserIds(),
                value.getInvitedMemberUserIds(),
                value.getPendingRequestMemberUserIds(),
                value.getStatusBeforeSuppression(),
                value.getTicketing(),
                value.getAvatar(),
                value.getIsTrashed(),
                value.getIsExpired(),
                value.getMingleConfiguration(),
                value.getOrganizerUserId(),
                value.getPricing(),
                value.getPaymentDeadlineEnabled(),
                value.getPaymentDeadlineHours(),
                value.getCancelledAtIso(),
                value.getParentEventId(),
                value.getGenerated(),
                value.getEventType(),
                value.getSlotTemplateId(),
                value.getUpcomingSlots(),
                value.getSlotTemplates(),
                value.getSubEventDefinitions(),
                value.getIsAdmin(),
                value.getCreatorName(),
                value.getCreatorInitials(),
                value.getDistanceKm(),
                value.getEndAtIso(),
                value.getTimeframe(),
                value.getImageUrl(),
                value.getSourceLink(),
                value.getPublished(),
                value.getCampaignId(),
                value.getId(),
                value.getSyncKey(),
                value.getSourceId(),
                value.getOwnerUserId(),
                value.getTitle(),
                value.getSubtitle(),
                value.getCreatorGender(),
                value.getCreatorCity(),
                value.getVisibility(),
                value.getBlindMode(),
                value.getStartAtIso(),
                value.getLocation(),
                value.getLocationCoordinates(),
                value.getCapacityTotal(),
                value.getFrequency(),
                value.getPolicies(),
                value.getAcceptedMembers(),
                value.getPendingMembers(),
                value.getTopics(),
                value.getSubEvents() == null ? null : value.getSubEvents().stream().map(item -> item == null ? null : item.presentation()).toList(),
                value.getMode(),
                value.getRating(),
                value.getBoost(),
                value.getAffinity(),
                value.getCreatedDate(),
                value.getCreatedUser(),
                value.getUpdatedUser(),
                value.getStatus(),
                value.getCreatorUserId(),
                value.getWorkspaceGroupId(),
                value.getUpdatedDate(),
                value.getAdmins(), value.getPendingMemberUserIds());
    }
    @Override public List<String> getAcceptedMemberUserIds() { return acceptedMemberUserIds; }
    @Override public List<String> getInvitedMemberUserIds() { return invitedMemberUserIds; }
    @Override public List<String> getPendingRequestMemberUserIds() { return pendingRequestMemberUserIds; }
    @Override public String getStatusBeforeSuppression() { return statusBeforeSuppression; }
    @Override public Boolean getTicketing() { return ticketing; }
    @Override public String getAvatar() { return avatar; }
    @Override public Boolean getIsTrashed() { return isTrashed; }
    @Override public Boolean getIsExpired() { return isExpired; }
    @Override public MingleConfigurationDto getMingleConfiguration() { return mingleConfiguration; }
    @Override public String getOrganizerUserId() { return organizerUserId; }
    @Override public PricingConfigDto getPricing() { return pricing; }
    @Override public Boolean getPaymentDeadlineEnabled() { return paymentDeadlineEnabled; }
    @Override public Integer getPaymentDeadlineHours() { return paymentDeadlineHours; }
    @Override public String getCancelledAtIso() { return cancelledAtIso; }
    @Override public String getParentEventId() { return parentEventId; }
    @Override public Boolean getGenerated() { return generated; }
    @Override public String getEventType() { return eventType; }
    @Override public String getSlotTemplateId() { return slotTemplateId; }
    @Override public List<EventSlotOccurrenceDto> getUpcomingSlots() { return upcomingSlots; }
    @Override public List<EventSlotTemplateDto> getSlotTemplates() { return slotTemplates; }
    @Override public List<SubEventDefinitionDto> getSubEventDefinitions() { return subEventDefinitions; }
    @Override public Boolean getIsAdmin() { return isAdmin; }
    @Override public String getCreatorName() { return creatorName; }
    @Override public String getCreatorInitials() { return creatorInitials; }
    @Override public Double getDistanceKm() { return distanceKm; }
    @Override public String getEndAtIso() { return endAtIso; }
    @Override public String getTimeframe() { return timeframe; }
    @Override public String getImageUrl() { return imageUrl; }
    @Override public String getSourceLink() { return sourceLink; }
    @Override public Boolean getPublished() { return published; }
    @Override public String getCampaignId() { return campaignId; }
    @Override public String getId() { return id; }
    @Override public String getSourceId() { return sourceId; }
    @Override public String getOwnerUserId() { return ownerUserId; }
    @Override public String getTitle() { return title; }
    @Override public String getSubtitle() { return subtitle; }
    @Override public String getCreatorGender() { return creatorGender; }
    @Override public String getCreatorCity() { return creatorCity; }
    @Override public String getVisibility() { return visibility; }
    @Override public String getBlindMode() { return blindMode; }
    @Override public String getStartAtIso() { return startAtIso; }
    @Override public String getLocation() { return location; }
    @Override public LocationCoordinatesDto getLocationCoordinates() { return locationCoordinates; }
    @Override public Integer getCapacityTotal() { return capacityTotal; }
    @Override public String getFrequency() { return frequency; }
    @Override public List<PolicyItemDto> getPolicies() { return policies; }
    @Override public Integer getAcceptedMembers() { return acceptedMembers; }
    @Override public Integer getPendingMembers() { return pendingMembers; }
    @Override public List<String> getTopics() { return topics; }
    @Override public List<SubEventItemDto> getSubEvents() { return subEvents; }
    @Override public String getMode() { return mode; }
    @Override public Double getRating() { return rating; }
    @Override public Double getBoost() { return boost; }
    @Override public Double getAffinity() { return affinity; }
    @Override public String getCreatedDate() { return createdDate; }
    @Override public String getCreatedUser() { return createdUser; }
    @Override public String getUpdatedUser() { return updatedUser; }
    @Override public String getStatus() { return status; }
    @Override public String getCreatorUserId() { return creatorUserId; }
    @Override public String getWorkspaceGroupId() { return workspaceGroupId; }
    @Override public String getUpdatedDate() { return updatedDate; }
    @Override public List<String> getAdmins() { return admins; }
    @Override public List<String> getPendingMemberUserIds() { return pendingMemberUserIds; }
}

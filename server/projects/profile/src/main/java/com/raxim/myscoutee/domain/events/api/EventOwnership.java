package com.raxim.myscoutee.domain.events.api;

import java.util.List;
import com.raxim.myscoutee.common.dto.SharedDtos.*;

public interface EventOwnership {
    java.util.Optional<? extends Event> findById(String id);
    boolean updateAffinity(Event value, double affinity, double boost);
    java.util.List<? extends Event> findBySourceIdIn(java.util.Collection<String> ids);
    java.util.List<? extends Event> findByCreatorUserId(String id);
    java.util.List<? extends Event> findAll();
    List<? extends Event> findBySourceId(String sourceId);
    interface Event {
        Boolean getIsAdmin(); String getCreatorName(); String getCreatorInitials(); Double getDistanceKm(); String getEndAtIso();
        String getTimeframe(); String getImageUrl(); String getSourceLink(); Boolean getPublished();
        String getCampaignId();
        String getId();
        String getSyncKey();
        String getSourceId();
        String getOwnerUserId();
        String getTitle();
        String getSubtitle();
        String getCreatorGender();
        String getCreatorCity();
        String getVisibility();
        String getBlindMode();
        String getStartAtIso();
        String getLocation();
        LocationCoordinatesDto getLocationCoordinates();
        Integer getCapacityTotal();
        String getFrequency();
        List<PolicyItemDto> getPolicies();
        Integer getAcceptedMembers();
        Integer getPendingMembers();
        List<String> getTopics();
        List<? extends SubEvent> getSubEvents();
        String getMode();
        Double getRating();
        Double getBoost();
        Double getAffinity();
        String getCreatedDate();
        String getCreatedUser();
        String getUpdatedUser();
        String getStatus(); String getCreatorUserId(); String getWorkspaceGroupId(); String getUpdatedDate(); List<String> getAdmins();
    }
    interface SubEvent extends EventSchedule.Stage { String location(); String endAt(); }
    Event findByIdOrSourceId(String id);
}

package com.raxim.myscoutee.domain.events.api;

import java.util.List;
import com.raxim.myscoutee.common.dto.SharedDtos.*;

public interface EventOwnership {
    java.util.Optional<? extends Event> findByOwnerUserIdAndSourceId(String owner, String source);
    boolean ownedExists(String owner, String source);
    List<? extends Event> findStoredFamilyBySourceId(String source);

    java.util.Optional<? extends Event> findById(String id);
    boolean updateAffinity(Event value, double affinity, double boost);
    java.util.List<? extends Event> findBySourceIdIn(java.util.Collection<String> ids);
    java.util.List<? extends Event> findByCreatorUserId(String id);
    java.util.List<? extends Event> findAll();
    List<? extends Event> findBySourceId(String sourceId);
    interface Event {
        List<String> getAcceptedMemberUserIds(); List<String> getInvitedMemberUserIds(); List<String> getPendingRequestMemberUserIds(); String getStatusBeforeSuppression(); Boolean getTicketing();
    public static final String STATUS_ACTIVE = "A";
    public static final String STATUS_DRAFT = "DR";
    public static final String STATUS_TRASHED = "T";
    public static final String STATUS_UNDER_REVIEW = "UR";
    public static final String STATUS_BLOCKED = "B";
    public static final String STATUS_DELETED = "D";
    public static final String STATUS_INACTIVE = "I";

        String getAvatar();
        Boolean getIsTrashed(); Boolean getIsExpired();
        com.raxim.myscoutee.common.dto.SharedDtos.MingleConfigurationDto getMingleConfiguration();

        String getOrganizerUserId();
        com.raxim.myscoutee.common.dto.SharedDtos.PricingConfigDto getPricing();
        Boolean getPaymentDeadlineEnabled(); Integer getPaymentDeadlineHours(); String getCancelledAtIso();
        String getParentEventId(); Boolean getGenerated(); String getEventType(); String getSlotTemplateId();
        java.util.List<com.raxim.myscoutee.common.dto.SharedDtos.EventSlotOccurrenceDto> getUpcomingSlots();
        java.util.List<com.raxim.myscoutee.common.dto.SharedDtos.EventSlotTemplateDto> getSlotTemplates();
        java.util.List<com.raxim.myscoutee.common.dto.SharedDtos.SubEventDefinitionDto> getSubEventDefinitions();
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
    interface SubEvent extends EventSchedule.Stage { com.raxim.myscoutee.common.dto.SharedDtos.PricingConfigDto pricing(); String location(); String endAt(); List<com.raxim.myscoutee.common.dto.SharedDtos.SubEventGroupItemDto> groups(); }
    Event findByIdOrSourceId(String id);
    List<? extends Event> chatNavigationEvents(java.util.Collection<String> eventIds);
    com.raxim.myscoutee.common.dto.SharedDtos.SubEventItemDto presentSubEvent(SubEvent value);
    List<? extends Event> findDirectOwnerEvents(String userId);
    List<? extends Event> findAdminVisibleEvents(String userId);
    List<? extends Event> findAcceptedMembershipEvents(String userId);
    List<? extends Event> findActiveInvitationEvents(String userId);
    List<? extends Event> findPendingRequestEvents(String userId);
    List<? extends Event> findByOwnerUserId(String userId);
    List<? extends Event> findByAdminsContaining(String userId);
    List<? extends Event> findHomeGameMemberProjections();
    List<? extends Event> activeOriginalEventsByCreators(java.util.Collection<String> creators);
    List<? extends Event> storedEventsBySources(java.util.Collection<String> sources);
    boolean updateStatusIfSnapshotCurrent(Event event, String nextStatus, String previousStatus);
    record JobScope(String workspaceGroupId, String ownerUserId, String creatorUserId) {}
    JobScope findJobScope(String sourceId);
}

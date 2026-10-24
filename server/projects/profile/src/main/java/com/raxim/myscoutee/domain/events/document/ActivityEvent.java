package com.raxim.myscoutee.domain.events.document;
import java.util.Map;
import com.raxim.myscoutee.domain.media.dto.MediaDtos.ImageDetailsDto;
import static com.raxim.myscoutee.domain.media.dto.MediaDtos.normalizeImageDetails;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.geo.GeoJsonPoint;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.index.GeoSpatialIndexType;
import org.springframework.data.mongodb.core.index.GeoSpatialIndexed;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import com.raxim.myscoutee.common.dto.SharedDtos.EventSlotTemplateDto;
import com.raxim.myscoutee.common.dto.SharedDtos.EventSlotOccurrenceDto;
import com.raxim.myscoutee.common.dto.SharedDtos.LocationCoordinatesDto;
import com.raxim.myscoutee.common.dto.SharedDtos.MingleConfigurationDto;
import com.raxim.myscoutee.common.dto.SharedDtos.PolicyItemDto;
import com.raxim.myscoutee.common.dto.SharedDtos.PricingConfigDto;
import com.raxim.myscoutee.common.dto.SharedDtos.SubEventDefinitionDto;
import com.raxim.myscoutee.common.dto.SharedDtos.TournamentCurrentStageDto;
import com.raxim.myscoutee.domain.events.document.SubEventItem;

@Document(collection = "events")
@CompoundIndexes({
        @CompoundIndex(name = "event_owner_start_source", def = "{'ownerUserId': 1, 'startAtIso': 1, 'sourceId': 1}"),
        @CompoundIndex(name = "event_owner_source", def = "{'ownerUserId': 1, 'sourceId': 1}"),
        @CompoundIndex(name = "event_source_lookup", def = "{'sourceId': 1}"),
        @CompoundIndex(name = "event_source_start_lookup", def = "{'sourceId': 1, 'startAtIso': 1}"),
        @CompoundIndex(name = "event_creator_start", def = "{'creatorUserId': 1, 'startAtIso': 1}"),
        @CompoundIndex(name = "event_admins_lookup", def = "{'admins': 1, 'startAtIso': 1}"),
        @CompoundIndex(name = "event_admins_source", def = "{'admins': 1, 'sourceId': 1}"),
        @CompoundIndex(name = "event_accepted_member_start", def = "{'acceptedMemberUserIds': 1, 'status': 1, 'startAtIso': 1, 'sourceId': 1}"),
        @CompoundIndex(name = "event_invited_member_start", def = "{'invitedMemberUserIds': 1, 'status': 1, 'startAtIso': 1, 'sourceId': 1}"),
        @CompoundIndex(name = "event_pending_request_member_start", def = "{'pendingRequestMemberUserIds': 1, 'status': 1, 'startAtIso': 1, 'sourceId': 1}"),
        @CompoundIndex(name = "event_auto_inviter_start", def = "{'autoInviter': 1, 'startAtIso': 1}"),
        @CompoundIndex(name = "event_explore_visibility", def = "{'status': 1, 'creatorUserId': 1, 'visibility': 1}"),
        @CompoundIndex(name = "event_explore_candidates_status", def = "{'status': 1, 'generated': 1, 'creatorUserId': 1, 'sourceId': 1}"),
        @CompoundIndex(name = "event_explore_feed_status", def = "{'status': 1, 'generated': 1, 'startAtIso': 1, 'sourceId': 1}"),
        @CompoundIndex(name = "event_expired_end", def = "{'expired': 1, 'endAtIso': 1, 'sourceId': 1}"),
        @CompoundIndex(name = "event_expired_start", def = "{'expired': 1, 'startAtIso': 1, 'sourceId': 1}"),
        @CompoundIndex(name = "event_friendships_due", def = "{'friendshipsProjected': 1, 'endAtIso': 1, 'sourceId': 1}"),
        @CompoundIndex(name = "feedback_counter_due", def = "{'feedbackCountersProjected': 1, 'endAtIso': 1, 'sourceId': 1}"),
        @CompoundIndex(name = "event_qmau_host_window", def = "{'status': 1, 'generated': 1, 'createdDate': 1, 'creatorUserId': 1}")
})
public class ActivityEvent implements com.raxim.myscoutee.domain.events.api.EventOwnership.Event, com.raxim.myscoutee.domain.events.api.EventSchedule {
    @org.springframework.data.annotation.Version private Long version;
    private java.util.List<com.raxim.myscoutee.domain.events.dto.EventLifecycleWorkDto> lifecycleWork = new java.util.ArrayList<>();
    public Long getVersion() { return version; }
    public void setVersion(Long value) { version = value; }
    public java.util.List<com.raxim.myscoutee.domain.events.dto.EventLifecycleWorkDto> getLifecycleWork() { return lifecycleWork == null ? java.util.List.of() : lifecycleWork; }
    public void setLifecycleWork(java.util.List<com.raxim.myscoutee.domain.events.dto.EventLifecycleWorkDto> value) { lifecycleWork = new java.util.ArrayList<>(value); }

    @lombok.Getter @lombok.Setter
    private String campaignId;
    @org.springframework.data.mongodb.core.index.Indexed
    @lombok.Getter @lombok.Setter
    private String workspaceGroupId;

    @Id
    @lombok.Getter @lombok.Setter
    private String id;
    @Indexed(name = "event_sync_key", unique = true, sparse = true)
    @lombok.Getter @lombok.Setter
    private String syncKey;
    @lombok.Getter @lombok.Setter
    private String sourceId;
    @lombok.Getter @lombok.Setter
    private String ownerUserId;
    private String status;
    @lombok.Getter @lombok.Setter
    private String moderationStatus;
    @lombok.Getter @lombok.Setter
    private String moderationPreviousStatus;
    @lombok.Getter @lombok.Setter
    private Long moderationVersion;
    // Cancellation retains the event definition; only Delete changes its lifecycle to Trash.
    @lombok.Getter @lombok.Setter
    private String cancelledAtIso;
    @lombok.Getter @lombok.Setter
    private String cancellationSessionMode;
    @lombok.Getter @lombok.Setter
    private String cancelledByUserId;
    @Indexed(name = "event_cancellation_complete")
    @lombok.Getter @lombok.Setter
    private Boolean cancellationRefundsComplete;
    @Indexed(name = "event_paid_terms_pending")
    @lombok.Getter @lombok.Setter
    private Boolean paidTermsRefundsPending;
    @lombok.Getter @lombok.Setter
    private String paidTermsChangedBy;
    @lombok.Getter @lombok.Setter
    private String paidTermsChangedAtIso;
    @lombok.Getter @lombok.Setter
    private String paidTermsRefundsProjectedAtIso;
    @lombok.Getter @lombok.Setter
    private List<String> refundEligibleUserIds = new ArrayList<>();
    @lombok.Getter
    private String statusBeforeSuppression;
    @lombok.Getter
    private List<String> admins = new ArrayList<>();
    @lombok.Getter @lombok.Setter
    private String avatar;
    @lombok.Getter @lombok.Setter
    private String title;
    @lombok.Getter @lombok.Setter
    private String subtitle;
    @lombok.Getter @lombok.Setter
    private String timeframe;
    @lombok.Setter
    private String inviter;
    @lombok.Setter
    private Integer unread;
    @lombok.Setter
    private Integer activity;
    @Field("expired")
    private Boolean expired;
    @lombok.Getter @lombok.Setter
    private Boolean feedbackCountersProjected;
    @lombok.Getter @lombok.Setter
    private Boolean friendshipsProjected;
    @lombok.Getter @lombok.Setter
    private Boolean feedbackOwnEventCountersProjected;
    @lombok.Getter
    private List<String> feedbackOwnEventCounterUserIds = new ArrayList<>();
    @lombok.Getter @lombok.Setter
    private String trashedAtIso;
    @lombok.Getter @lombok.Setter
    private String creatorUserId;
    @lombok.Getter @lombok.Setter
    private String creatorName;
    @lombok.Getter @lombok.Setter
    private String creatorInitials;
    @lombok.Getter @lombok.Setter
    private String creatorGender;
    @lombok.Getter @lombok.Setter
    private String creatorCity;
    @lombok.Getter @lombok.Setter
    private String organizerUserId;
    @lombok.Getter @lombok.Setter
    private String visibility;
    @lombok.Getter @lombok.Setter
    private String blindMode;
    @lombok.Getter @lombok.Setter
    private String startAtIso;
    @lombok.Getter @lombok.Setter
    private String endAtIso;
    @lombok.Getter @lombok.Setter
    private Double distanceKm;
    @lombok.Getter @lombok.Setter
    private Map<String, ImageDetailsDto> imageDetails;
    @lombok.Getter @lombok.Setter
    private String imageUrl;
    @lombok.Getter @lombok.Setter
    private List<String> imageUrls;
    @lombok.Getter @lombok.Setter
    private String sourceLink;
    @lombok.Getter @lombok.Setter
    private String location;
    @lombok.Getter @lombok.Setter
    private LocationCoordinatesDto locationCoordinates;
    @GeoSpatialIndexed(type = GeoSpatialIndexType.GEO_2DSPHERE)
    @lombok.Getter @lombok.Setter
    private GeoJsonPoint locationGeo;
    @lombok.Getter @lombok.Setter
    private Integer capacityMin;
    @lombok.Getter @lombok.Setter
    private Integer capacityMax;
    @lombok.Getter @lombok.Setter
    private Integer capacityTotal;
    @lombok.Getter @lombok.Setter
    private Boolean full;
    @lombok.Getter @lombok.Setter
    private Boolean autoInviter;
    @lombok.Getter @lombok.Setter
    private String frequency;
    @lombok.Getter @lombok.Setter
    private Boolean ticketing;
    @lombok.Getter @lombok.Setter
    private Boolean approvalRequired;
    @lombok.Getter @lombok.Setter
    private Integer paymentDeadlineHours;
    @lombok.Getter @lombok.Setter
    private Boolean paymentDeadlineEnabled;
    @lombok.Getter @lombok.Setter
    private PricingConfigDto pricing;
    @lombok.Getter @lombok.Setter
    private Boolean policiesEnabled;
    @lombok.Getter
    private List<PolicyItemDto> policies = new ArrayList<>();
    @lombok.Getter @lombok.Setter
    private Boolean slotsEnabled;
    @lombok.Getter
    private List<EventSlotTemplateDto> slotTemplates = new ArrayList<>();
    @lombok.Getter @lombok.Setter
    private String parentEventId;
    @lombok.Getter @lombok.Setter
    private String parentSubEventId;
    @lombok.Getter @lombok.Setter
    private String groupId;
    @lombok.Getter @lombok.Setter
    private String slotTemplateId;
    @lombok.Getter @lombok.Setter
    private Boolean generated;
    @lombok.Getter @lombok.Setter
    private String eventType;
    @lombok.Getter
    private List<EventSlotOccurrenceDto> upcomingSlots = new ArrayList<>();
    @lombok.Getter @lombok.Setter
    private Integer acceptedMembers;
    @lombok.Getter @lombok.Setter
    private Integer pendingMembers;
    @lombok.Getter
    private List<String> acceptedMemberUserIds = new ArrayList<>();
    @lombok.Getter
    private List<String> pendingMemberUserIds = new ArrayList<>();
    @lombok.Getter
    private List<String> invitedMemberUserIds = new ArrayList<>();
    @lombok.Getter
    private List<String> pendingRequestMemberUserIds = new ArrayList<>();
    @lombok.Getter @lombok.Setter
    private List<String> topics = new ArrayList<>();
    @lombok.Getter @lombok.Setter
    private Boolean subEventsEnabled = true;
    @lombok.Getter
    private List<SubEventDefinitionDto> subEventDefinitions = new ArrayList<>();
    @lombok.Getter @lombok.Setter
    private List<SubEventItem> subEvents = new ArrayList<>();
    @lombok.Getter @lombok.Setter
    private TournamentCurrentStageDto currentStage;
    private String mode = "Casual";
    @lombok.Getter @lombok.Setter
    private MingleConfigurationDto mingleConfiguration;
    @lombok.Getter @lombok.Setter
    private Double rating;
    @lombok.Getter @lombok.Setter
    private Double boost;
    @lombok.Getter @lombok.Setter
    private Double affinity;
    @lombok.Getter @lombok.Setter
    private String createdDate;
    @lombok.Getter @lombok.Setter
    private String createdUser;
    @lombok.Getter @lombok.Setter
    private String membershipCounterWork;
    private java.util.List<String> membershipCounterUsers = java.util.List.of();
    public java.util.List<String> getMembershipCounterUsers() { return membershipCounterUsers == null ? java.util.List.of() : membershipCounterUsers; }
    public void setMembershipCounterUsers(java.util.List<String> value) { membershipCounterUsers = value == null ? java.util.List.of() : java.util.List.copyOf(value); }
    @lombok.Getter @lombok.Setter
    private String updatedDate;
    @lombok.Getter @lombok.Setter
    private String updatedUser;

    public String getStatus() {
        if (hasText(status)) {
            return normalizeStatusValue(status);
        }
        return deriveStatusFromLegacy();
    }
    public void setStatus(String status) { this.status = normalizeStatusValue(status); }
    public void setStatusBeforeSuppression(String statusBeforeSuppression) {
        this.statusBeforeSuppression = hasText(statusBeforeSuppression) ? normalizeStatusValue(statusBeforeSuppression) : null;
    }
    public void setAdmins(List<String> admins) { this.admins = normalizeAdminIds(admins); }
    public String getInviter() {
        if (inviter != null && !inviter.isBlank()) {
            return inviter;
        }
        return null;
    }
    public Integer getUnread() { return unread == null ? 0 : unread; }
    public Integer getActivity() { return activity == null ? 0 : activity; }
    public Boolean getIsAdmin() {
        if (hasText(ownerUserId) && admins != null && admins.contains(ownerUserId)) {
            return true;
        }
        return hasText(ownerUserId) && ownerUserId.equals(creatorUserId);
    }
    public Boolean getIsTrashed() {
        return STATUS_TRASHED.equals(getStatus());
    }
    public Boolean getPublished() {
        return STATUS_ACTIVE.equals(getStatus());
    }
    public boolean hasStoredStatus(String expectedStatus) {
        return expectedStatus != null && expectedStatus.equals(status);
    }
    public Boolean getIsExpired() { return expired; }
    public void setIsExpired(Boolean expired) { this.expired = expired; }
    public void setFeedbackOwnEventCounterUserIds(List<String> feedbackOwnEventCounterUserIds) {
        this.feedbackOwnEventCounterUserIds = feedbackOwnEventCounterUserIds == null
                ? new ArrayList<>()
                : new ArrayList<>(feedbackOwnEventCounterUserIds);
    }

    public void setPolicies(List<PolicyItemDto> policies) {
        this.policies = policies == null ? new ArrayList<>() : new ArrayList<>(policies);
    }
    public void setSlotTemplates(List<EventSlotTemplateDto> slotTemplates) {
        this.slotTemplates = slotTemplates == null ? new ArrayList<>() : new ArrayList<>(slotTemplates);
    }
    public void setUpcomingSlots(List<EventSlotOccurrenceDto> upcomingSlots) {
        this.upcomingSlots = upcomingSlots == null ? new ArrayList<>() : new ArrayList<>(upcomingSlots);
    }
    public void setAcceptedMemberUserIds(List<String> acceptedMemberUserIds) {
        this.acceptedMemberUserIds = acceptedMemberUserIds == null ? new ArrayList<>() : new ArrayList<>(acceptedMemberUserIds);
    }
    public void setPendingMemberUserIds(List<String> pendingMemberUserIds) {
        this.pendingMemberUserIds = pendingMemberUserIds == null ? new ArrayList<>() : new ArrayList<>(pendingMemberUserIds);
    }
    public void setInvitedMemberUserIds(List<String> invitedMemberUserIds) {
        this.invitedMemberUserIds = invitedMemberUserIds == null ? new ArrayList<>() : new ArrayList<>(invitedMemberUserIds);
    }
    public void setPendingRequestMemberUserIds(List<String> pendingRequestMemberUserIds) {
        this.pendingRequestMemberUserIds = pendingRequestMemberUserIds == null ? new ArrayList<>() : new ArrayList<>(pendingRequestMemberUserIds);
    }
    public void setSubEventDefinitions(List<SubEventDefinitionDto> subEventDefinitions) {
        this.subEventDefinitions = subEventDefinitions == null ? new ArrayList<>() : new ArrayList<>(subEventDefinitions);
    }
    public String getMode() { return normalizeMode(mode); }
    public void setMode(String mode) { this.mode = normalizeMode(mode); }

    public void normalizeLifecycleState() {
        status = getStatus();
    }

    public void refreshTournamentCurrentStage() {
        currentStage = tournamentCurrentStage(subEvents);
    }

    public static TournamentCurrentStageDto tournamentCurrentStage(List<SubEventItem> items) {
        List<SubEventItem> stages = (items == null ? List.<SubEventItem>of() : items).stream()
                .filter(ActivityEvent::isTournamentStage)
                .toList();
        if (stages.isEmpty()) {
            return null;
        }
        int currentIndex = 0;
        while (currentIndex + 1 < stages.size()
                && "F".equals(normalizeTournamentStageStatus(stages.get(currentIndex).stageStatus()))) {
            currentIndex += 1;
        }
        SubEventItem stage = stages.get(currentIndex);
        return new TournamentCurrentStageDto(
                normalizeText(stage.id()),
                normalizeText(stage.name()),
                currentIndex + 1,
                stages.size(),
                normalizeTournamentStageStatus(stage.stageStatus()));
    }

    private String deriveStatusFromLegacy() {
        return STATUS_ACTIVE;
    }

    private static String normalizeStatusValue(String value) {
        String normalized = value == null ? "" : value.trim();
        return switch (normalized) {
            case STATUS_ACTIVE, STATUS_DRAFT, STATUS_TRASHED, STATUS_UNDER_REVIEW,
                    STATUS_BLOCKED, STATUS_DELETED, STATUS_INACTIVE -> normalized;
            default -> STATUS_ACTIVE;
        };
    }

    private static boolean hasText(String value) {
        return value != null && !value.isBlank();
    }

    private static String normalizeMode(String value) {
        if (hasText(value) && "Tournament".equalsIgnoreCase(value.trim())) {
            return "Tournament";
        }
        return hasText(value) && "Mingle".equalsIgnoreCase(value.trim()) ? "Mingle" : "Casual";
    }

    private static boolean isTournamentStage(SubEventItem stage) {
        if (stage == null || Boolean.TRUE.equals(stage.optional())) {
            return false;
        }
        int groupMin = Math.max(0, stage.tournamentGroupCapacityMin() == null ? 0 : stage.tournamentGroupCapacityMin());
        int groupMax = Math.max(0, stage.tournamentGroupCapacityMax() == null ? 0 : stage.tournamentGroupCapacityMax());
        String leaderboardType = normalizeText(stage.tournamentLeaderboardType());
        return groupMin > 0 || groupMax > 0
                || "Score".equalsIgnoreCase(leaderboardType)
                || "Fifa".equalsIgnoreCase(leaderboardType);
    }

    private static String normalizeTournamentStageStatus(String value) {
        String normalized = normalizeText(value).toUpperCase();
        return switch (normalized) {
            case "RS", "SR", "F", "S", "E" -> normalized;
            default -> "A";
        };
    }

    private static String normalizeText(String value) {
        return value == null ? "" : value.trim();
    }

    private List<String> normalizeAdminIds(List<String> values) {
        ArrayList<String> normalized = new ArrayList<>();
        for (String value : values == null ? List.<String>of() : values) {
            addAdminId(normalized, value);
        }
        return normalized;
    }

    private static void addAdminId(List<String> values, String value) {
        if (!hasText(value)) {
            return;
        }
        String normalized = value.trim();
        if (!values.contains(normalized)) {
            values.add(normalized);
        }
    }
}

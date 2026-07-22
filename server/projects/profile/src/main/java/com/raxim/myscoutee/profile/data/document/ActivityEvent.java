package com.raxim.myscoutee.profile.data.document;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.mongodb.core.geo.GeoJsonPoint;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.index.GeoSpatialIndexType;
import org.springframework.data.mongodb.core.index.GeoSpatialIndexed;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.EventSlotTemplateDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.EventSlotOccurrenceDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.LocationCoordinatesDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.PolicyItemDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.PricingConfigDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.SubEventDefinitionDto;
import com.raxim.myscoutee.profile.data.document.SubEventItem;

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
        @CompoundIndex(name = "event_expired_start", def = "{'expired': 1, 'startAtIso': 1, 'sourceId': 1}")
})
public class ActivityEvent {
    public static final String STATUS_ACTIVE = "A";
    public static final String STATUS_DRAFT = "DR";
    public static final String STATUS_TRASHED = "T";
    public static final String STATUS_UNDER_REVIEW = "UR";
    public static final String STATUS_BLOCKED = "B";
    public static final String STATUS_DELETED = "D";
    public static final String STATUS_INACTIVE = "I";

    @Id
    private String id;
    @Indexed(name = "event_sync_key", unique = true, sparse = true)
    private String syncKey;
    private String sourceId;
    private String ownerUserId;
    private String status;
    private String statusBeforeSuppression;
    private List<String> admins = new ArrayList<>();
    private String avatar;
    private String title;
    private String subtitle;
    private String timeframe;
    private String inviter;
    private Integer unread;
    private Integer activity;
    @Field("expired")
    private Boolean expired;
    private String trashedAtIso;
    private String creatorUserId;
    private String creatorName;
    private String creatorInitials;
    private String creatorGender;
    private String creatorCity;
    private String visibility;
    private String blindMode;
    private String startAtIso;
    private String endAtIso;
    private Double distanceKm;
    private String imageUrl;
    private String sourceLink;
    private String location;
    private LocationCoordinatesDto locationCoordinates;
    @GeoSpatialIndexed(type = GeoSpatialIndexType.GEO_2DSPHERE)
    private GeoJsonPoint locationGeo;
    private Integer capacityMin;
    private Integer capacityMax;
    private Integer capacityTotal;
    private Boolean full;
    private Boolean autoInviter;
    private String frequency;
    private Boolean ticketing;
    private Boolean approvalRequired;
    private PricingConfigDto pricing;
    private Boolean policiesEnabled;
    private List<PolicyItemDto> policies = new ArrayList<>();
    private Boolean slotsEnabled;
    private List<EventSlotTemplateDto> slotTemplates = new ArrayList<>();
    @Transient
    private String parentEventId;
    @Transient
    private String slotTemplateId;
    @Transient
    private Boolean generated;
    private String eventType;
    @Transient
    private List<EventSlotOccurrenceDto> upcomingSlots = new ArrayList<>();
    private Integer acceptedMembers;
    private Integer pendingMembers;
    private List<String> acceptedMemberUserIds = new ArrayList<>();
    private List<String> pendingMemberUserIds = new ArrayList<>();
    private List<String> invitedMemberUserIds = new ArrayList<>();
    private List<String> pendingRequestMemberUserIds = new ArrayList<>();
    private List<String> topics = new ArrayList<>();
    private Boolean subEventsEnabled = true;
    private List<SubEventDefinitionDto> subEventDefinitions = new ArrayList<>();
    private List<SubEventItem> subEvents = new ArrayList<>();
    private String mode = "Casual";
    private Double rating;
    private Double boost;
    private Double affinity;
    private String createdDate;
    private String createdUser;
    private String updatedDate;
    private String updatedUser;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getSyncKey() { return syncKey; }
    public void setSyncKey(String syncKey) { this.syncKey = syncKey; }
    public String getSourceId() { return sourceId; }
    public void setSourceId(String sourceId) { this.sourceId = sourceId; }
    public String getOwnerUserId() { return ownerUserId; }
    public void setOwnerUserId(String ownerUserId) { this.ownerUserId = ownerUserId; }
    public String getStatus() {
        if (hasText(status)) {
            return normalizeStatusValue(status);
        }
        return deriveStatusFromLegacy();
    }
    public void setStatus(String status) { this.status = normalizeStatusValue(status); }
    public String getStatusBeforeSuppression() { return statusBeforeSuppression; }
    public void setStatusBeforeSuppression(String statusBeforeSuppression) {
        this.statusBeforeSuppression = hasText(statusBeforeSuppression) ? normalizeStatusValue(statusBeforeSuppression) : null;
    }
    public List<String> getAdmins() { return admins; }
    public void setAdmins(List<String> admins) { this.admins = normalizeAdminIds(admins); }
    public String getAvatar() { return avatar; }
    public void setAvatar(String avatar) { this.avatar = avatar; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getSubtitle() { return subtitle; }
    public void setSubtitle(String subtitle) { this.subtitle = subtitle; }
    public String getTimeframe() { return timeframe; }
    public void setTimeframe(String timeframe) { this.timeframe = timeframe; }
    public String getInviter() {
        if (inviter != null && !inviter.isBlank()) {
            return inviter;
        }
        return null;
    }
    public void setInviter(String inviter) { this.inviter = inviter; }
    public Integer getUnread() { return unread == null ? 0 : unread; }
    public void setUnread(Integer unread) { this.unread = unread; }
    public Integer getActivity() { return activity == null ? 0 : activity; }
    public void setActivity(Integer activity) { this.activity = activity; }
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
    public Boolean getIsExpired() { return expired; }
    public void setIsExpired(Boolean expired) { this.expired = expired; }
    public String getTrashedAtIso() { return trashedAtIso; }
    public void setTrashedAtIso(String trashedAtIso) { this.trashedAtIso = trashedAtIso; }
    public String getCreatorUserId() { return creatorUserId; }
    public void setCreatorUserId(String creatorUserId) { this.creatorUserId = creatorUserId; }
    public String getCreatorName() { return creatorName; }
    public void setCreatorName(String creatorName) { this.creatorName = creatorName; }
    public String getCreatorInitials() { return creatorInitials; }
    public void setCreatorInitials(String creatorInitials) { this.creatorInitials = creatorInitials; }
    public String getCreatorGender() { return creatorGender; }
    public void setCreatorGender(String creatorGender) { this.creatorGender = creatorGender; }
    public String getCreatorCity() { return creatorCity; }
    public void setCreatorCity(String creatorCity) { this.creatorCity = creatorCity; }
    public String getVisibility() { return visibility; }
    public void setVisibility(String visibility) { this.visibility = visibility; }
    public String getBlindMode() { return blindMode; }
    public void setBlindMode(String blindMode) { this.blindMode = blindMode; }
    public String getStartAtIso() { return startAtIso; }
    public void setStartAtIso(String startAtIso) { this.startAtIso = startAtIso; }
    public String getEndAtIso() { return endAtIso; }
    public void setEndAtIso(String endAtIso) { this.endAtIso = endAtIso; }
    public Double getDistanceKm() { return distanceKm; }
    public void setDistanceKm(Double distanceKm) { this.distanceKm = distanceKm; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public String getSourceLink() { return sourceLink; }
    public void setSourceLink(String sourceLink) { this.sourceLink = sourceLink; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public LocationCoordinatesDto getLocationCoordinates() { return locationCoordinates; }
    public void setLocationCoordinates(LocationCoordinatesDto locationCoordinates) { this.locationCoordinates = locationCoordinates; }
    public GeoJsonPoint getLocationGeo() { return locationGeo; }
    public void setLocationGeo(GeoJsonPoint locationGeo) { this.locationGeo = locationGeo; }
    public Integer getCapacityMin() { return capacityMin; }
    public void setCapacityMin(Integer capacityMin) { this.capacityMin = capacityMin; }
    public Integer getCapacityMax() { return capacityMax; }
    public void setCapacityMax(Integer capacityMax) { this.capacityMax = capacityMax; }
    public Integer getCapacityTotal() { return capacityTotal; }
    public void setCapacityTotal(Integer capacityTotal) { this.capacityTotal = capacityTotal; }
    public Boolean getFull() { return full; }
    public void setFull(Boolean full) { this.full = full; }
    public Boolean getAutoInviter() { return autoInviter; }
    public void setAutoInviter(Boolean autoInviter) { this.autoInviter = autoInviter; }
    public String getFrequency() { return frequency; }
    public void setFrequency(String frequency) { this.frequency = frequency; }
    public Boolean getTicketing() { return ticketing; }
    public void setTicketing(Boolean ticketing) { this.ticketing = ticketing; }
    public Boolean getApprovalRequired() { return approvalRequired; }
    public void setApprovalRequired(Boolean approvalRequired) { this.approvalRequired = approvalRequired; }
    public PricingConfigDto getPricing() { return pricing; }
    public void setPricing(PricingConfigDto pricing) { this.pricing = pricing; }
    public Boolean getPoliciesEnabled() { return policiesEnabled; }
    public void setPoliciesEnabled(Boolean policiesEnabled) { this.policiesEnabled = policiesEnabled; }
    public List<PolicyItemDto> getPolicies() { return policies; }
    public void setPolicies(List<PolicyItemDto> policies) {
        this.policies = policies == null ? new ArrayList<>() : new ArrayList<>(policies);
    }
    public Boolean getSlotsEnabled() { return slotsEnabled; }
    public void setSlotsEnabled(Boolean slotsEnabled) { this.slotsEnabled = slotsEnabled; }
    public List<EventSlotTemplateDto> getSlotTemplates() { return slotTemplates; }
    public void setSlotTemplates(List<EventSlotTemplateDto> slotTemplates) {
        this.slotTemplates = slotTemplates == null ? new ArrayList<>() : new ArrayList<>(slotTemplates);
    }
    public String getParentEventId() { return parentEventId; }
    public void setParentEventId(String parentEventId) { this.parentEventId = parentEventId; }
    public String getSlotTemplateId() { return slotTemplateId; }
    public void setSlotTemplateId(String slotTemplateId) { this.slotTemplateId = slotTemplateId; }
    public Boolean getGenerated() { return generated; }
    public void setGenerated(Boolean generated) { this.generated = generated; }
    public String getEventType() { return eventType; }
    public void setEventType(String eventType) { this.eventType = eventType; }
    public List<EventSlotOccurrenceDto> getUpcomingSlots() { return upcomingSlots; }
    public void setUpcomingSlots(List<EventSlotOccurrenceDto> upcomingSlots) {
        this.upcomingSlots = upcomingSlots == null ? new ArrayList<>() : new ArrayList<>(upcomingSlots);
    }
    public Integer getAcceptedMembers() { return acceptedMembers; }
    public void setAcceptedMembers(Integer acceptedMembers) { this.acceptedMembers = acceptedMembers; }
    public Integer getPendingMembers() { return pendingMembers; }
    public void setPendingMembers(Integer pendingMembers) { this.pendingMembers = pendingMembers; }
    public List<String> getAcceptedMemberUserIds() { return acceptedMemberUserIds; }
    public void setAcceptedMemberUserIds(List<String> acceptedMemberUserIds) {
        this.acceptedMemberUserIds = acceptedMemberUserIds == null ? new ArrayList<>() : new ArrayList<>(acceptedMemberUserIds);
    }
    public List<String> getPendingMemberUserIds() { return pendingMemberUserIds; }
    public void setPendingMemberUserIds(List<String> pendingMemberUserIds) {
        this.pendingMemberUserIds = pendingMemberUserIds == null ? new ArrayList<>() : new ArrayList<>(pendingMemberUserIds);
    }
    public List<String> getInvitedMemberUserIds() { return invitedMemberUserIds; }
    public void setInvitedMemberUserIds(List<String> invitedMemberUserIds) {
        this.invitedMemberUserIds = invitedMemberUserIds == null ? new ArrayList<>() : new ArrayList<>(invitedMemberUserIds);
    }
    public List<String> getPendingRequestMemberUserIds() { return pendingRequestMemberUserIds; }
    public void setPendingRequestMemberUserIds(List<String> pendingRequestMemberUserIds) {
        this.pendingRequestMemberUserIds = pendingRequestMemberUserIds == null ? new ArrayList<>() : new ArrayList<>(pendingRequestMemberUserIds);
    }
    public List<String> getTopics() { return topics; }
    public void setTopics(List<String> topics) { this.topics = topics; }
    public Boolean getSubEventsEnabled() { return subEventsEnabled; }
    public void setSubEventsEnabled(Boolean subEventsEnabled) { this.subEventsEnabled = subEventsEnabled; }
    public List<SubEventDefinitionDto> getSubEventDefinitions() { return subEventDefinitions; }
    public void setSubEventDefinitions(List<SubEventDefinitionDto> subEventDefinitions) {
        this.subEventDefinitions = subEventDefinitions == null ? new ArrayList<>() : new ArrayList<>(subEventDefinitions);
    }
    public List<SubEventItem> getSubEvents() { return subEvents; }
    public void setSubEvents(List<SubEventItem> subEvents) { this.subEvents = subEvents; }
    public String getMode() { return normalizeMode(mode); }
    public void setMode(String mode) { this.mode = normalizeMode(mode); }
    public Double getRating() { return rating; }
    public void setRating(Double rating) { this.rating = rating; }
    public Double getBoost() { return boost; }
    public void setBoost(Double boost) { this.boost = boost; }
    public Double getAffinity() { return affinity; }
    public void setAffinity(Double affinity) { this.affinity = affinity; }
    public String getCreatedDate() { return createdDate; }
    public void setCreatedDate(String createdDate) { this.createdDate = createdDate; }
    public String getCreatedUser() { return createdUser; }
    public void setCreatedUser(String createdUser) { this.createdUser = createdUser; }
    public String getUpdatedDate() { return updatedDate; }
    public void setUpdatedDate(String updatedDate) { this.updatedDate = updatedDate; }
    public String getUpdatedUser() { return updatedUser; }
    public void setUpdatedUser(String updatedUser) { this.updatedUser = updatedUser; }

    public void normalizeLifecycleState() {
        status = getStatus();
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
        return hasText(value) && "Tournament".equalsIgnoreCase(value.trim()) ? "Tournament" : "Casual";
    }

    private List<String> normalizeAdminIds(List<String> values) {
        ArrayList<String> normalized = new ArrayList<>();
        addAdminId(normalized, ownerUserId);
        addAdminId(normalized, creatorUserId);
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

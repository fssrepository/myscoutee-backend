package com.raxim.myscoutee.profile.data.document;

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

import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.EventSlotTemplateDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.LocationCoordinatesDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.PricingConfigDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.SubEventFormItemDto;

@Document(collection = "events")
@CompoundIndexes({
        @CompoundIndex(name = "event_owner_type_source", def = "{'ownerUserId': 1, 'type': 1, 'sourceId': 1}", unique = true),
        @CompoundIndex(name = "event_owner_type", def = "{'ownerUserId': 1, 'type': 1, 'startAtIso': 1}"),
        @CompoundIndex(name = "event_owner_source", def = "{'ownerUserId': 1, 'sourceId': 1}"),
        @CompoundIndex(name = "event_source_lookup", def = "{'sourceId': 1, 'type': 1}"),
        @CompoundIndex(name = "event_explore_visibility", def = "{'status': 1, 'creatorUserId': 1, 'visibility': 1}")
})
public class ActivityEvent {
    private static final String TYPE_EVENTS = "events";
    private static final String TYPE_HOSTING = "hosting";
    private static final String TYPE_INVITATIONS = "invitations";
    private static final String STATUS_ACTIVE = "active";
    private static final String STATUS_HOSTING = "hosting";
    private static final String STATUS_INVITATION = "invitation";
    private static final String STATUS_DRAFT = "draft";
    private static final String STATUS_TRASHED = "trashed";

    @Id
    private String id;
    @Indexed(name = "event_sync_key", unique = true, sparse = true)
    private String syncKey;
    private String sourceId;
    private String ownerUserId;
    private String type;
    private String status;
    private List<String> admins = new ArrayList<>();
    private String avatar;
    private String title;
    private String subtitle;
    private String timeframe;
    private String inviter;
    private Integer unread;
    private Integer activity;
    private Boolean isAdmin;
    private Boolean isInvitation;
    private Boolean isHosting;
    private Boolean isTrashed;
    private Boolean published;
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
    private Boolean autoInviter;
    private String frequency;
    private Boolean ticketing;
    private PricingConfigDto pricing;
    private Boolean slotsEnabled;
    private List<EventSlotTemplateDto> slotTemplates = new ArrayList<>();
    private String parentEventId;
    private String slotTemplateId;
    private Boolean generated;
    private String eventType;
    private Integer acceptedMembers;
    private Integer pendingMembers;
    private List<String> topics = new ArrayList<>();
    private List<SubEventFormItemDto> subEvents = new ArrayList<>();
    private String subEventsDisplayMode;
    private Double rating;
    private Double relevance;
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
    public String getType() {
        if (hasText(type)) {
            return type;
        }
        return deriveTypeFromStatus(getStatus());
    }
    public void setType(String type) { this.type = type; }
    public String getStatus() {
        if (hasText(status)) {
            return normalizeStatusValue(status);
        }
        return deriveStatusFromLegacy();
    }
    public void setStatus(String status) { this.status = normalizeStatusValue(status); }
    public List<String> getAdmins() { return admins; }
    public void setAdmins(List<String> admins) { this.admins = admins == null ? new ArrayList<>() : new ArrayList<>(admins); }
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
        return Boolean.TRUE.equals(getIsInvitation()) ? creatorName : null;
    }
    public void setInviter(String inviter) { this.inviter = inviter; }
    public Integer getUnread() { return unread == null ? 0 : unread; }
    public void setUnread(Integer unread) { this.unread = unread; }
    public Integer getActivity() { return activity == null ? 0 : activity; }
    public void setActivity(Integer activity) { this.activity = activity; }
    public Boolean getIsAdmin() {
        if (isAdmin != null) {
            return isAdmin;
        }
        if (hasText(ownerUserId) && admins != null && admins.contains(ownerUserId)) {
            return true;
        }
        return hasText(ownerUserId) && ownerUserId.equals(creatorUserId);
    }
    public void setIsAdmin(Boolean admin) { isAdmin = admin; }
    public Boolean getIsInvitation() {
        if (isInvitation != null) {
            return isInvitation;
        }
        return STATUS_INVITATION.equals(getStatus()) || TYPE_INVITATIONS.equals(type);
    }
    public void setIsInvitation(Boolean invitation) { isInvitation = invitation; }
    public Boolean getIsHosting() {
        if (isHosting != null) {
            return isHosting;
        }
        return TYPE_HOSTING.equals(type) || STATUS_HOSTING.equals(getStatus());
    }
    public void setIsHosting(Boolean hosting) { isHosting = hosting; }
    public Boolean getIsTrashed() {
        if (isTrashed != null) {
            return isTrashed;
        }
        return STATUS_TRASHED.equals(getStatus()) || (trashedAtIso != null && !trashedAtIso.isBlank());
    }
    public void setIsTrashed(Boolean trashed) { isTrashed = trashed; }
    public Boolean getPublished() {
        if (published != null) {
            return published;
        }
        return !STATUS_DRAFT.equals(getStatus());
    }
    public void setPublished(Boolean published) { this.published = published; }
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
    public Boolean getAutoInviter() { return autoInviter; }
    public void setAutoInviter(Boolean autoInviter) { this.autoInviter = autoInviter; }
    public String getFrequency() { return frequency; }
    public void setFrequency(String frequency) { this.frequency = frequency; }
    public Boolean getTicketing() { return ticketing; }
    public void setTicketing(Boolean ticketing) { this.ticketing = ticketing; }
    public PricingConfigDto getPricing() { return pricing; }
    public void setPricing(PricingConfigDto pricing) { this.pricing = pricing; }
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
    public Integer getAcceptedMembers() { return acceptedMembers; }
    public void setAcceptedMembers(Integer acceptedMembers) { this.acceptedMembers = acceptedMembers; }
    public Integer getPendingMembers() { return pendingMembers; }
    public void setPendingMembers(Integer pendingMembers) { this.pendingMembers = pendingMembers; }
    public List<String> getTopics() { return topics; }
    public void setTopics(List<String> topics) { this.topics = topics; }
    public List<SubEventFormItemDto> getSubEvents() { return subEvents; }
    public void setSubEvents(List<SubEventFormItemDto> subEvents) { this.subEvents = subEvents; }
    public String getSubEventsDisplayMode() { return subEventsDisplayMode; }
    public void setSubEventsDisplayMode(String subEventsDisplayMode) { this.subEventsDisplayMode = subEventsDisplayMode; }
    public Double getRating() { return rating; }
    public void setRating(Double rating) { this.rating = rating; }
    public Double getRelevance() { return relevance; }
    public void setRelevance(Double relevance) { this.relevance = relevance; }
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
        isAdmin = null;
        isInvitation = null;
        isHosting = null;
        isTrashed = null;
        published = null;
    }

    private String deriveStatusFromLegacy() {
        if (Boolean.TRUE.equals(isTrashed) || hasText(trashedAtIso)) {
            return STATUS_TRASHED;
        }
        if (Boolean.TRUE.equals(isInvitation) || TYPE_INVITATIONS.equals(type)) {
            return STATUS_INVITATION;
        }
        if (Boolean.FALSE.equals(published)) {
            return STATUS_DRAFT;
        }
        if (Boolean.TRUE.equals(isHosting) || TYPE_HOSTING.equals(type)) {
            return STATUS_HOSTING;
        }
        return STATUS_ACTIVE;
    }

    private static String deriveTypeFromStatus(String status) {
        return switch (normalizeStatusValue(status)) {
            case STATUS_INVITATION -> TYPE_INVITATIONS;
            case STATUS_HOSTING -> TYPE_HOSTING;
            default -> TYPE_EVENTS;
        };
    }

    private static String normalizeStatusValue(String value) {
        String normalized = value == null ? "" : value.trim();
        return switch (normalized) {
            case STATUS_ACTIVE, STATUS_HOSTING, STATUS_INVITATION, STATUS_DRAFT, STATUS_TRASHED -> normalized;
            default -> STATUS_ACTIVE;
        };
    }

    private static boolean hasText(String value) {
        return value != null && !value.isBlank();
    }
}

package com.raxim.myscoutee.profile.data.document.mongo;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import com.raxim.myscoutee.profile.dto.shared.SharedDtos.LocationCoordinatesDto;
import com.raxim.myscoutee.profile.dto.shared.SharedDtos.SubEventFormItemDto;

@Document(collection = "events")
@CompoundIndexes({
        @CompoundIndex(name = "event_owner_type_source", def = "{'ownerUserId': 1, 'type': 1, 'sourceId': 1}", unique = true),
        @CompoundIndex(name = "event_owner_type", def = "{'ownerUserId': 1, 'type': 1, 'startAtIso': 1}"),
        @CompoundIndex(name = "event_source_lookup", def = "{'sourceId': 1, 'type': 1}"),
        @CompoundIndex(name = "event_explore_visibility", def = "{'published': 1, 'isTrashed': 1, 'isInvitation': 1, 'creatorUserId': 1, 'visibility': 1}")
})
public class ActivityEvent {
    @Id
    private String id;
    @Indexed(name = "event_sync_key", unique = true, sparse = true)
    private String syncKey;
    private String sourceId;
    private String ownerUserId;
    private String type;
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
    private Integer capacityMin;
    private Integer capacityMax;
    private Integer capacityTotal;
    private Boolean autoInviter;
    private String frequency;
    private Boolean ticketing;
    private Integer acceptedMembers;
    private Integer pendingMembers;
    private List<String> acceptedMemberUserIds = new ArrayList<>();
    private List<String> pendingMemberUserIds = new ArrayList<>();
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
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getAvatar() { return avatar; }
    public void setAvatar(String avatar) { this.avatar = avatar; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getSubtitle() { return subtitle; }
    public void setSubtitle(String subtitle) { this.subtitle = subtitle; }
    public String getTimeframe() { return timeframe; }
    public void setTimeframe(String timeframe) { this.timeframe = timeframe; }
    public String getInviter() { return inviter; }
    public void setInviter(String inviter) { this.inviter = inviter; }
    public Integer getUnread() { return unread; }
    public void setUnread(Integer unread) { this.unread = unread; }
    public Integer getActivity() { return activity; }
    public void setActivity(Integer activity) { this.activity = activity; }
    public Boolean getIsAdmin() { return isAdmin; }
    public void setIsAdmin(Boolean admin) { isAdmin = admin; }
    public Boolean getIsInvitation() { return isInvitation; }
    public void setIsInvitation(Boolean invitation) { isInvitation = invitation; }
    public Boolean getIsHosting() { return isHosting; }
    public void setIsHosting(Boolean hosting) { isHosting = hosting; }
    public Boolean getIsTrashed() { return isTrashed; }
    public void setIsTrashed(Boolean trashed) { isTrashed = trashed; }
    public Boolean getPublished() { return published; }
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
    public Integer getAcceptedMembers() { return acceptedMembers; }
    public void setAcceptedMembers(Integer acceptedMembers) { this.acceptedMembers = acceptedMembers; }
    public Integer getPendingMembers() { return pendingMembers; }
    public void setPendingMembers(Integer pendingMembers) { this.pendingMembers = pendingMembers; }
    public List<String> getAcceptedMemberUserIds() { return acceptedMemberUserIds; }
    public void setAcceptedMemberUserIds(List<String> acceptedMemberUserIds) { this.acceptedMemberUserIds = acceptedMemberUserIds; }
    public List<String> getPendingMemberUserIds() { return pendingMemberUserIds; }
    public void setPendingMemberUserIds(List<String> pendingMemberUserIds) { this.pendingMemberUserIds = pendingMemberUserIds; }
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
}

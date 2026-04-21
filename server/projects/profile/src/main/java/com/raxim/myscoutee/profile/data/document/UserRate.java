package com.raxim.myscoutee.profile.data.document;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "userRates")
@CompoundIndexes({
        @CompoundIndex(name = "user_rate_owner_mode_updated", def = "{'source': 1, 'ownerUserId': 1, 'mode': 1, 'updatedDate': -1}"),
        @CompoundIndex(name = "user_rate_primary_lookup", def = "{'source': 1, 'relatedUserId': 1, 'updatedDate': -1}"),
        @CompoundIndex(name = "user_rate_secondary_lookup", def = "{'source': 1, 'secondaryRelatedUserId': 1, 'updatedDate': -1}", sparse = true),
        @CompoundIndex(name = "user_rate_owner_primary_mode", def = "{'source': 1, 'ownerUserId': 1, 'relatedUserId': 1, 'secondaryRelatedUserId': 1, 'mode': 1}")
})
public class UserRate {
    @Id
    private String id;
    @Indexed(name = "user_rate_sync_key", unique = true, sparse = true)
    private String syncKey;
    private String fromUserId;
    private String toUserId;
    private Integer rate;
    private String mode;
    private String source;
    private String createdDate;
    private String createdUser;
    private String updatedDate;
    private String updatedUser;
    private String ownerUserId;
    private String relatedUserId;
    private String secondaryRelatedUserId;
    private Integer scoreGiven;
    private Integer scoreReceived;
    private Double affinityScore;
    private Boolean met;
    private String eventName;
    private LocationSnapshot ownerLocation;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getSyncKey() { return syncKey; }
    public void setSyncKey(String syncKey) { this.syncKey = syncKey; }
    public String getFromUserId() { return fromUserId; }
    public void setFromUserId(String fromUserId) { this.fromUserId = fromUserId; }
    public String getToUserId() { return toUserId; }
    public void setToUserId(String toUserId) { this.toUserId = toUserId; }
    public Integer getRate() { return rate; }
    public void setRate(Integer rate) { this.rate = rate; }
    public String getMode() { return mode; }
    public void setMode(String mode) { this.mode = mode; }
    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }
    public String getCreatedDate() { return createdDate; }
    public void setCreatedDate(String createdDate) { this.createdDate = createdDate; }
    public String getCreatedUser() { return createdUser; }
    public void setCreatedUser(String createdUser) { this.createdUser = createdUser; }
    public String getUpdatedDate() { return updatedDate; }
    public void setUpdatedDate(String updatedDate) { this.updatedDate = updatedDate; }
    public String getUpdatedUser() { return updatedUser; }
    public void setUpdatedUser(String updatedUser) { this.updatedUser = updatedUser; }
    public String getOwnerUserId() { return ownerUserId; }
    public void setOwnerUserId(String ownerUserId) { this.ownerUserId = ownerUserId; }
    public String getRelatedUserId() { return relatedUserId; }
    public void setRelatedUserId(String relatedUserId) { this.relatedUserId = relatedUserId; }
    public String getSecondaryRelatedUserId() { return secondaryRelatedUserId; }
    public void setSecondaryRelatedUserId(String secondaryRelatedUserId) { this.secondaryRelatedUserId = secondaryRelatedUserId; }
    public Integer getScoreGiven() { return scoreGiven; }
    public void setScoreGiven(Integer scoreGiven) { this.scoreGiven = scoreGiven; }
    public Integer getScoreReceived() { return scoreReceived; }
    public void setScoreReceived(Integer scoreReceived) { this.scoreReceived = scoreReceived; }
    public Double getAffinityScore() { return affinityScore; }
    public void setAffinityScore(Double affinityScore) { this.affinityScore = affinityScore; }
    public Boolean getMet() { return met; }
    public void setMet(Boolean met) { this.met = met; }
    public String getEventName() { return eventName; }
    public void setEventName(String eventName) { this.eventName = eventName; }
    public LocationSnapshot getOwnerLocation() { return ownerLocation; }
    public void setOwnerLocation(LocationSnapshot ownerLocation) { this.ownerLocation = ownerLocation; }

    public record LocationSnapshot(
            Double latitude,
            Double longitude) {
    }
}

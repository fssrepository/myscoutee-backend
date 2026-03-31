package com.raxim.myscoutee.profile.data.document;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "eventLeaderboardEntries")
@CompoundIndexes({
        @CompoundIndex(name = "event_leaderboard_group_lookup", def = "{'eventId': 1, 'subEventId': 1, 'groupId': 1, 'entryType': 1, 'createdAtIso': -1}"),
        @CompoundIndex(name = "event_leaderboard_pair_lookup", def = "{'eventId': 1, 'subEventId': 1, 'groupId': 1, 'entryType': 1, 'pairKey': 1}")
})
public class EventLeaderboardEntry {
    @Id
    private String id;

    @Indexed(name = "event_leaderboard_sync_key", unique = true, sparse = true)
    private String syncKey;

    private String eventId;
    private String subEventId;
    private String groupId;
    private String entryType;
    private String memberId;
    private Integer scoreValue;
    private String homeMemberId;
    private String awayMemberId;
    private Integer homeScore;
    private Integer awayScore;
    private String pairKey;
    private String note;
    private String createdAtIso;
    private String createdUser;
    private String updatedDate;
    private String updatedUser;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getSyncKey() { return syncKey; }
    public void setSyncKey(String syncKey) { this.syncKey = syncKey; }
    public String getEventId() { return eventId; }
    public void setEventId(String eventId) { this.eventId = eventId; }
    public String getSubEventId() { return subEventId; }
    public void setSubEventId(String subEventId) { this.subEventId = subEventId; }
    public String getGroupId() { return groupId; }
    public void setGroupId(String groupId) { this.groupId = groupId; }
    public String getEntryType() { return entryType; }
    public void setEntryType(String entryType) { this.entryType = entryType; }
    public String getMemberId() { return memberId; }
    public void setMemberId(String memberId) { this.memberId = memberId; }
    public Integer getScoreValue() { return scoreValue; }
    public void setScoreValue(Integer scoreValue) { this.scoreValue = scoreValue; }
    public String getHomeMemberId() { return homeMemberId; }
    public void setHomeMemberId(String homeMemberId) { this.homeMemberId = homeMemberId; }
    public String getAwayMemberId() { return awayMemberId; }
    public void setAwayMemberId(String awayMemberId) { this.awayMemberId = awayMemberId; }
    public Integer getHomeScore() { return homeScore; }
    public void setHomeScore(Integer homeScore) { this.homeScore = homeScore; }
    public Integer getAwayScore() { return awayScore; }
    public void setAwayScore(Integer awayScore) { this.awayScore = awayScore; }
    public String getPairKey() { return pairKey; }
    public void setPairKey(String pairKey) { this.pairKey = pairKey; }
    public String getNote() { return note; }
    public void setNote(String note) { this.note = note; }
    public String getCreatedAtIso() { return createdAtIso; }
    public void setCreatedAtIso(String createdAtIso) { this.createdAtIso = createdAtIso; }
    public String getCreatedUser() { return createdUser; }
    public void setCreatedUser(String createdUser) { this.createdUser = createdUser; }
    public String getUpdatedDate() { return updatedDate; }
    public void setUpdatedDate(String updatedDate) { this.updatedDate = updatedDate; }
    public String getUpdatedUser() { return updatedUser; }
    public void setUpdatedUser(String updatedUser) { this.updatedUser = updatedUser; }
}

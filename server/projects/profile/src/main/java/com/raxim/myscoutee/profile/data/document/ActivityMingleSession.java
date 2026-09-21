package com.raxim.myscoutee.profile.data.document;

import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Version;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "activityMingleSessions")
@CompoundIndexes({
        @CompoundIndex(name = "mingle_session_status_due", def = "{'status': 1, 'phaseEndsAtIso': 1}")
})
public class ActivityMingleSession {
    @Id
    private String id;
    @Indexed(name = "mingle_session_event", unique = true)
    private String eventId;
    private String status;
    private Integer currentRoundNumber;
    private String phaseStartedAtIso;
    private String phaseEndsAtIso;
    private String pausedFromStatus;
    private Long pausedRemainingSeconds;
    private Integer revision;
    private String createdAtIso;
    private String createdByUserId;
    private String updatedAtIso;
    private String updatedByUserId;
    @Version
    private Long documentVersion;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getEventId() { return eventId; }
    public void setEventId(String eventId) { this.eventId = eventId; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public Integer getCurrentRoundNumber() { return currentRoundNumber; }
    public void setCurrentRoundNumber(Integer currentRoundNumber) { this.currentRoundNumber = currentRoundNumber; }
    public String getPhaseStartedAtIso() { return phaseStartedAtIso; }
    public void setPhaseStartedAtIso(String phaseStartedAtIso) { this.phaseStartedAtIso = phaseStartedAtIso; }
    public String getPhaseEndsAtIso() { return phaseEndsAtIso; }
    public void setPhaseEndsAtIso(String phaseEndsAtIso) { this.phaseEndsAtIso = phaseEndsAtIso; }
    public String getPausedFromStatus() { return pausedFromStatus; }
    public void setPausedFromStatus(String pausedFromStatus) { this.pausedFromStatus = pausedFromStatus; }
    public Long getPausedRemainingSeconds() { return pausedRemainingSeconds; }
    public void setPausedRemainingSeconds(Long pausedRemainingSeconds) { this.pausedRemainingSeconds = pausedRemainingSeconds; }
    public Integer getRevision() { return revision; }
    public void setRevision(Integer revision) { this.revision = revision; }
    public String getCreatedAtIso() { return createdAtIso; }
    public void setCreatedAtIso(String createdAtIso) { this.createdAtIso = createdAtIso; }
    public String getCreatedByUserId() { return createdByUserId; }
    public void setCreatedByUserId(String createdByUserId) { this.createdByUserId = createdByUserId; }
    public String getUpdatedAtIso() { return updatedAtIso; }
    public void setUpdatedAtIso(String updatedAtIso) { this.updatedAtIso = updatedAtIso; }
    public String getUpdatedByUserId() { return updatedByUserId; }
    public void setUpdatedByUserId(String updatedByUserId) { this.updatedByUserId = updatedByUserId; }
    public Long getDocumentVersion() { return documentVersion; }
    public void setDocumentVersion(Long documentVersion) { this.documentVersion = documentVersion; }
}

package com.raxim.myscoutee.profile.data.document;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "activityMingleRounds")
@CompoundIndexes({
        @CompoundIndex(name = "mingle_round_meetings_due", def = "{'status': 1, 'meetingsProjected': 1, 'completedAtIso': 1}"),
        @CompoundIndex(name = "mingle_round_event_number", def = "{'eventId': 1, 'roundNumber': 1}", unique = true),
        @CompoundIndex(name = "mingle_round_event_status", def = "{'eventId': 1, 'status': 1}")
})
public class ActivityMingleRound {
    @Id
    private String id;
    private String eventId;
    private Integer roundNumber;
    private String status;
    private Boolean meetingsProjected;
    private List<TableAssignment> tables = new ArrayList<>();
    private String assignmentCreatedAtIso;
    private String startedAtIso;
    private String completedAtIso;
    private String createdByUserId;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getEventId() { return eventId; }
    public void setEventId(String eventId) { this.eventId = eventId; }
    public Integer getRoundNumber() { return roundNumber; }
    public void setRoundNumber(Integer roundNumber) { this.roundNumber = roundNumber; }
    public Boolean getMeetingsProjected() { return meetingsProjected; }
    public void setMeetingsProjected(Boolean value) { meetingsProjected = value; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public List<TableAssignment> getTables() { return tables; }
    public void setTables(List<TableAssignment> tables) {
        this.tables = tables == null ? new ArrayList<>() : new ArrayList<>(tables);
    }
    public String getAssignmentCreatedAtIso() { return assignmentCreatedAtIso; }
    public void setAssignmentCreatedAtIso(String assignmentCreatedAtIso) { this.assignmentCreatedAtIso = assignmentCreatedAtIso; }
    public String getStartedAtIso() { return startedAtIso; }
    public void setStartedAtIso(String startedAtIso) { this.startedAtIso = startedAtIso; }
    public String getCompletedAtIso() { return completedAtIso; }
    public void setCompletedAtIso(String completedAtIso) { this.completedAtIso = completedAtIso; }
    public String getCreatedByUserId() { return createdByUserId; }
    public void setCreatedByUserId(String createdByUserId) { this.createdByUserId = createdByUserId; }

    public record TableAssignment(Integer tableNumber, List<String> memberUserIds) {
        public TableAssignment {
            memberUserIds = memberUserIds == null ? List.of() : List.copyOf(memberUserIds);
        }
    }
}

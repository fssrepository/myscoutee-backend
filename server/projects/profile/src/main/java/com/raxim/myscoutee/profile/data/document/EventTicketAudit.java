package com.raxim.myscoutee.profile.data.document;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "eventTicketAudit")
@CompoundIndexes({
        @CompoundIndex(name = "event_ticket_audit_ticket_created", def = "{'ticketId': 1, 'createdDate': -1}"),
        @CompoundIndex(name = "event_ticket_audit_holder_created", def = "{'holderUserId': 1, 'createdDate': -1}"),
        @CompoundIndex(name = "event_ticket_audit_actor_created", def = "{'actorUserId': 1, 'createdDate': -1}")
})
public class EventTicketAudit {
    @Id
    private String id;
    private String action;
    private String result;
    private String ticketId;
    private String eventId;
    private String holderUserId;
    private String actorUserId;
    private String attemptedAtIso;
    private String originalUsedAtIso;
    private String originalUsedByUserId;
    private String createdDate;

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }
    public String getResult() { return result; }
    public void setResult(String result) { this.result = result; }
    public String getTicketId() { return ticketId; }
    public void setTicketId(String ticketId) { this.ticketId = ticketId; }
    public String getEventId() { return eventId; }
    public void setEventId(String eventId) { this.eventId = eventId; }
    public String getHolderUserId() { return holderUserId; }
    public void setHolderUserId(String holderUserId) { this.holderUserId = holderUserId; }
    public String getActorUserId() { return actorUserId; }
    public void setActorUserId(String actorUserId) { this.actorUserId = actorUserId; }
    public String getAttemptedAtIso() { return attemptedAtIso; }
    public void setAttemptedAtIso(String attemptedAtIso) { this.attemptedAtIso = attemptedAtIso; }
    public String getOriginalUsedAtIso() { return originalUsedAtIso; }
    public void setOriginalUsedAtIso(String originalUsedAtIso) { this.originalUsedAtIso = originalUsedAtIso; }
    public String getOriginalUsedByUserId() { return originalUsedByUserId; }
    public void setOriginalUsedByUserId(String originalUsedByUserId) { this.originalUsedByUserId = originalUsedByUserId; }
    public String getCreatedDate() { return createdDate; }
    public void setCreatedDate(String createdDate) { this.createdDate = createdDate; }
}

package com.raxim.myscoutee.domain.events.document;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "eventTickets")
@CompoundIndexes({
        @CompoundIndex(
                name = "event_ticket_event_used",
                def = "{'eventId': 1, 'usedAtIso': 1}")
})
public class EventTicket implements com.raxim.myscoutee.domain.events.api.ParticipationTickets.Ticket {
    public static final String STATUS_ACTIVE = "A";
    public static final String STATUS_DELETED = "D";

    @Id
    private String id;

    @Indexed(name = "event_ticket_code", unique = true)
    private String code;

    private String eventId;
    private String holderUserId;
    private String status;
    private String issuedAtIso;
    private String usedAtIso;
    private String usedByUserId;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getEventId() {
        return eventId;
    }

    public void setEventId(String eventId) {
        this.eventId = eventId;
    }

    public String getHolderUserId() {
        return holderUserId;
    }

    public void setHolderUserId(String holderUserId) {
        this.holderUserId = holderUserId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getIssuedAtIso() {
        return issuedAtIso;
    }

    public void setIssuedAtIso(String issuedAtIso) {
        this.issuedAtIso = issuedAtIso;
    }

    public String getUsedAtIso() {
        return usedAtIso;
    }

    public void setUsedAtIso(String usedAtIso) {
        this.usedAtIso = usedAtIso;
    }

    public String getUsedByUserId() {
        return usedByUserId;
    }

    public void setUsedByUserId(String usedByUserId) {
        this.usedByUserId = usedByUserId;
    }
}

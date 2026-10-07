package com.raxim.myscoutee.domain.events.api;
import java.util.*;
import java.time.Instant;
public interface ParticipationTickets {
    List<? extends Snapshot> queryTicketSnapshotRecordsForUser(String id);
    List<? extends Snapshot> queryTicketSnapshotRecordsForUsers(Collection<String> ids);
    CheckIn checkIn(String code, String scannerUserId, Instant now);
    interface Snapshot { EventOwnership.Event event(); Ticket credential(); }
    interface CheckIn { boolean valid(); String reason(); Ticket ticket(); EventOwnership.Event event(); }
    interface Ticket {
        String getId(); String getCode(); String getEventId(); String getHolderUserId();
        String getStatus(); String getIssuedAtIso(); String getUsedAtIso(); String getUsedByUserId();
    }
    List<? extends EventOwnership.Event> queryTicketRecordsForUser(String userId);
}

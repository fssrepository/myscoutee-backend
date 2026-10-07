package com.raxim.myscoutee.domain.events.api;
import java.util.*;
public interface MingleEncounters {
 Optional<? extends Session> findSession(String eventId);
 List<? extends Round> completedRounds(Collection<String> eventIds);
 boolean isCompleted(String eventId);
 List<? extends Session> pendingPublication();
 void acknowledgePublication(Session session);
 interface Session { String getId(); String getEventId(); String getStatus(); Integer getRevision(); }
 interface Round { List<? extends Table> getTables(); }
 interface Table { List<String> memberUserIds(); }
}

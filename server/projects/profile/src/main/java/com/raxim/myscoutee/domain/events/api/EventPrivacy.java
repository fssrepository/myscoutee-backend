package com.raxim.myscoutee.domain.events.api;
import java.util.*;
public interface EventPrivacy {
    List<? extends EventOwnership.Event> findOwnedEventsForPurge(String userId);
    void purgeOwnedEvents(List<? extends EventOwnership.Event> events, Collection<String> sources);
    void purgeActivityMemberships(String userId);
    void purgeManagedEventAdminReferences(String userId);
    void purgeActivityResources(String userId, Collection<String> eventIds, Collection<String> assetIds);
    void anonymizeTicketAudit(String userId);
    void purgeFeedback(String userId);
    void purgeLeaderboard(String userId);
    void anonymizeSchedulerMarkers(String userId);
    void purgeAssetMemberships(Collection<String> ids);
}

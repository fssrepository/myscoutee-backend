package com.raxim.myscoutee.domain.events.api;
import java.util.*;
import com.raxim.myscoutee.domain.events.dto.EventPurgeTargetDto;
public interface EventPrivacy {
    List<EventPurgeTargetDto> findOwnedEventsForPurge(String userId);
    void purgeOwnedEvents(Collection<String> documentIds, Collection<String> sources);
    void purgeActivityMemberships(String userId);
    void purgeManagedEventAdminReferences(String userId);
    void purgeActivityResources(String userId, Collection<String> eventIds, Collection<String> assetIds);
    void anonymizeTicketAudit(String userId);
    void purgeFeedback(String userId);
    void purgeLeaderboard(String userId);
    void anonymizeSchedulerMarkers(String userId);
    void purgeAssetMemberships(Collection<String> ids);
}

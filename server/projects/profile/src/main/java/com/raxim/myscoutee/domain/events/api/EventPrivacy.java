package com.raxim.myscoutee.domain.events.api;

import com.raxim.myscoutee.domain.accounts.api.AccountPurgeActions;
import java.util.Map;
import java.util.function.Consumer;

import java.util.*;
import com.raxim.myscoutee.domain.events.dto.EventPurgeTargetDto;
public interface EventPrivacy extends AccountPurgeActions {
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

    @Override
    default Map<Action, Consumer<Context>> accountPurgeActions() {
        return Map.ofEntries(
                Map.entry(Action.ACTIVITY_MEMBERSHIPS, context -> purgeActivityMemberships(context.userId())),
                Map.entry(Action.MANAGED_EVENT_ADMINS, context -> purgeManagedEventAdminReferences(context.userId())),
                Map.entry(Action.TICKET_AUDIT, context -> anonymizeTicketAudit(context.userId())),
                Map.entry(Action.EVENT_FEEDBACK, context -> purgeFeedback(context.userId())),
                Map.entry(Action.LEADERBOARD, context -> purgeLeaderboard(context.userId())),
                Map.entry(Action.SCHEDULER_MARKERS, context -> anonymizeSchedulerMarkers(context.userId())),
                Map.entry(Action.OWNED_EVENTS, context -> {
                    var owned = findOwnedEventsForPurge(context.userId());
                    context.rememberOwnedEventIds(owned.stream()
                            .filter(java.util.Objects::nonNull).map(EventPurgeTargetDto::sourceId).toList());
                    purgeOwnedEvents(owned.stream().map(EventPurgeTargetDto::id).toList(), context.ownedEventIds());
                }),
                Map.entry(Action.ASSET_MEMBERSHIPS, context -> purgeAssetMemberships(context.ownedAssetIds())),
                Map.entry(Action.ACTIVITY_RESOURCES, context -> purgeActivityResources(
                        context.userId(), context.ownedEventIds(), context.ownedAssetIds())));
    }
}

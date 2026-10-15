package com.raxim.myscoutee.domain.accounts.api;

import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.function.Consumer;

/**
 * Cleanup contributed by an installed product domain. Native owners and their
 * typed HTTP clients expose the same actions; callbacks themselves never cross HTTP.
 * Accounts retains ordering, durable progress, leases and retries.
 */
public interface AccountPurgeActions {
    Map<Action, Consumer<Context>> accountPurgeActions();

    enum Action {
        OWNED_EVENTS, DISCOVER_OWNED_ASSETS, OWNED_ASSET_MEDIA, ASSET_MEMBERSHIPS,
        OWNED_ASSET_RECORDS, ACTIVITY_MEMBERSHIPS, MANAGED_EVENT_ADMINS,
        ASSET_REQUESTS, ACTIVITY_RESOURCES, IDEA_POSTS, RATINGS, EDGES,
        CONTENT_FEEDBACK, CONTENT_REPORTS, CONTENT_FEED_VIEWS, PAYER_RECORDS,
        TICKET_AUDIT, CONTENT_SHARE_TOKENS, FEEDBACK, AFFINITY_TASKS,
        LEADERBOARD, SCHEDULER_MARKERS, AFFINITY_AUTHORS
    }

    interface Context {
        String userId();
        List<String> ownedEventIds();
        List<String> ownedAssetIds();
        List<String> discoveredAssetIds();

        /** Persist merged IDs before invoking a destructive owner operation. */
        void rememberOwnedEventIds(Collection<String> ids);
        void rememberOwnedAssetIds(Collection<String> ids);
    }
}

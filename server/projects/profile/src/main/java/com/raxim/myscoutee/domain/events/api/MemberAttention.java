package com.raxim.myscoutee.domain.events.api;

import java.util.Map;

import com.raxim.myscoutee.domain.notifications.api.NotificationUnreadObserver;

public interface MemberAttention extends NotificationUnreadObserver {
    void incrementCommunityUpdates(String communityId, String userId, int delta);

    /** The same predicate for the native owner and its existing HTTP client. */
    @Override
    default void onUnreadChange(String sourceType, String sourceId, String recipientUserId,
            Map<String, String> payload, int delta) {
        if (!"community".equals(sourceType)
                || !"members".equals(payload.get("communityAttention"))) return;
        incrementCommunityUpdates(sourceId, recipientUserId, delta);
    }
}

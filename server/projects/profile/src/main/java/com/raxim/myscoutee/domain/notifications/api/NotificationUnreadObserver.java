package com.raxim.myscoutee.domain.notifications.api;

import java.util.Map;

/** Synchronous owner updates after a notification insert or first successful read. */
public interface NotificationUnreadObserver {
    void onUnreadChange(String sourceType, String sourceId, String recipientUserId,
            Map<String, String> payload, int delta);
}

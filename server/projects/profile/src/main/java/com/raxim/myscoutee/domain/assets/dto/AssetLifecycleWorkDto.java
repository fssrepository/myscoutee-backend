package com.raxim.myscoutee.domain.assets.dto;

import java.util.List;
import com.raxim.myscoutee.domain.notifications.api.NotificationDelivery.NotificationIntent;

/** Immutable effects captured with one asset lifecycle transition. */
public record AssetLifecycleWorkDto(@org.springframework.data.mongodb.core.mapping.Field("id") String id,
        long revision, String actor, boolean available, String reason,
        NotificationIntent notification, List<String> counterUsers) {}

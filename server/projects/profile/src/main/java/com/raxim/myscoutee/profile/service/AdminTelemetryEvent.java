package com.raxim.myscoutee.profile.service;

import java.util.Map;

public record AdminTelemetryEvent(
        String eventKey,
        String domain,
        String entityId,
        String actorUserId,
        Long amount,
        String occurredAtIso,
        Map<String, String> tags) {
}

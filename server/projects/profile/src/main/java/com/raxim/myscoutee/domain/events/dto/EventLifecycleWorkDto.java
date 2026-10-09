package com.raxim.myscoutee.domain.events.dto;

import java.util.List;

/** The lifecycle occurrence, audience and attachment revision captured at acceptance. */
public record EventLifecycleWorkDto(@org.springframework.data.mongodb.core.mapping.Field("id") String id,
        long revision, String actor, boolean available, String attachmentReason,
        String notificationReason, String title, List<String> audience) {}

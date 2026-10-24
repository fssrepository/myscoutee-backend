package com.raxim.myscoutee.microservices.transport.community;

import com.raxim.myscoutee.microservices.transport.common.ProtocolFields;
import com.raxim.myscoutee.microservices.transport.common.ProtocolFields.JobScope;
import static com.raxim.myscoutee.microservices.transport.common.ProtocolFields.text;
import static com.raxim.myscoutee.microservices.transport.common.ProtocolFields.ids;

import com.raxim.myscoutee.domain.community.api.ScheduledCases;

public final class ScheduledCasesProtocol {
    public static final String ACTOR_1 = "/_internal/v1/community/scheduled-cases/actor_1";
    public static final String PAGE_1 = "/_internal/v1/community/scheduled-cases/page_1";
    public static final String SAVE_1 = "/_internal/v1/community/scheduled-cases/save_1";
    public static final String ACTION_1 = "/_internal/v1/community/scheduled-cases/action_1";
    public static final int MAX_REQUEST_BYTES = 2 * 1024 * 1024, MAX_RESPONSE_BYTES = 8 * 1024 * 1024;
    public static final String AUDIENCE = "community:scheduled-cases";
    public static boolean delegated(String path) { return java.util.Set.of(ACTOR_1, PAGE_1, SAVE_1, ACTION_1).contains(path); }
    private ScheduledCasesProtocol() {}
    public static String[] paths() { return new String[]{ACTOR_1, PAGE_1, SAVE_1, ACTION_1}; }
    private static boolean scope(JobScope value) { return ProtocolFields.boundedJobScope(value); }
    public record Actor1(JobScope scope, String id) {}
    public static boolean valid(Actor1 q) { return q!=null && scope(q.scope()) && text(q.id(),8192); }
    public record Actor1Result(Boolean resolved, String value) {}
    public record Page1(JobScope scope, String actor, @com.fasterxml.jackson.annotation.JsonProperty(required = true) @com.fasterxml.jackson.annotation.JsonSetter(nulls = com.fasterxml.jackson.annotation.Nulls.FAIL) int size, String cursor, String status) {}
    public static boolean valid(Page1 q) { return q!=null && scope(q.scope()) && text(q.actor(),8192) && text(q.cursor(),8192) && text(q.status(),8192); }
    public record Page1Result(Boolean resolved, com.raxim.myscoutee.domain.community.dto.CommunityCaseDtos.Page<com.raxim.myscoutee.domain.community.dto.CommunityCaseDtos.TaskItem> value) {}
    public record Save1(JobScope scope, String actor, com.raxim.myscoutee.domain.community.dto.CommunityCaseDtos.SaveTask r) {}
    public static boolean valid(Save1 q) { return q!=null && scope(q.scope()) && text(q.actor(),8192); }
    public record Save1Result(Boolean resolved, com.raxim.myscoutee.domain.community.dto.CommunityCaseDtos.TaskItem value) {}
    public record Action1(JobScope scope, String actor, String id, com.raxim.myscoutee.domain.community.dto.CommunityCaseDtos.TaskCommand command) {}
    public static boolean valid(Action1 q) { return q!=null && scope(q.scope()) && text(q.actor(),8192) && text(q.id(),8192); }
    public record Action1Result(Boolean resolved, com.raxim.myscoutee.domain.community.dto.CommunityCaseDtos.TaskItem value) {}
}

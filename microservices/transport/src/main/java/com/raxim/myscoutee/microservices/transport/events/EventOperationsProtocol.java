package com.raxim.myscoutee.microservices.transport.events;

import com.raxim.myscoutee.domain.events.api.EventOperations;

public final class EventOperationsProtocol {
    public static final String QUERYITEMSBYUSERPAGE_1 = "/_internal/v1/events/event-operations/queryitemsbyuserpage_1";
    public static final String QUERYINVITATIONSPAGE_1 = "/_internal/v1/events/event-operations/queryinvitationspage_1";
    public static final String QUERYATTENDINGPAGE_1 = "/_internal/v1/events/event-operations/queryattendingpage_1";
    public static final String QUERYHOSTINGPAGE_1 = "/_internal/v1/events/event-operations/queryhostingpage_1";
    public static final String QUERYTRASHPAGE_1 = "/_internal/v1/events/event-operations/querytrashpage_1";
    public static final String LOADEVENTDETAILBYID_1 = "/_internal/v1/events/event-operations/loadeventdetailbyid_1";
    public static final String REQUESTJOIN_1 = "/_internal/v1/events/event-operations/requestjoin_1";
    public static final String SYNC_1 = "/_internal/v1/events/event-operations/sync_1";
    public static final int MAX_REQUEST_BYTES = 2 * 1024 * 1024, MAX_RESPONSE_BYTES = 8 * 1024 * 1024;
    public static final String AUDIENCE = "events:event-operations";
    public static boolean delegated(String path) { return java.util.Set.of(QUERYITEMSBYUSERPAGE_1, QUERYINVITATIONSPAGE_1, QUERYATTENDINGPAGE_1, QUERYHOSTINGPAGE_1, QUERYTRASHPAGE_1, LOADEVENTDETAILBYID_1, REQUESTJOIN_1, SYNC_1).contains(path); }
    private EventOperationsProtocol() {}
    public static String[] paths() { return new String[]{QUERYITEMSBYUSERPAGE_1, QUERYINVITATIONSPAGE_1, QUERYATTENDINGPAGE_1, QUERYHOSTINGPAGE_1, QUERYTRASHPAGE_1, LOADEVENTDETAILBYID_1, REQUESTJOIN_1, SYNC_1}; }
    public record Error(String code) {}
    public record Scope(Boolean active, String groupId) {
        public static Scope current() { return new Scope(com.raxim.myscoutee.domain.platform.api.JobGroupContext.isActive(), com.raxim.myscoutee.domain.platform.api.JobGroupContext.groupId()); }
    }
    private static boolean text(String value, int limit) { return value == null || value.length() <= limit; }
    private static boolean scope(Scope value) { return value != null && value.active() != null && text(value.groupId(), 512) && (value.active() || value.groupId() == null); }
    private static boolean ids(java.util.Collection<String> values) { return values != null && values.size() <= 4096 && values.stream().allMatch(value -> text(value, 512)); }
    public record Receipt(Boolean completed) {}
    public record QueryItemsByUserPage1(Scope scope, String requestedUserId, Integer requestedLimit, String cursor) {}
    public static boolean valid(QueryItemsByUserPage1 q) { return q!=null && scope(q.scope()) && text(q.requestedUserId(),8192) && text(q.cursor(),8192); }
    public record QueryItemsByUserPage1Result(Boolean resolved, com.raxim.myscoutee.domain.events.dto.EventsDtos.EventsExplorePageDto value) {}
    public record QueryInvitationsPage1(Scope scope, String requestedUserId, Integer requestedLimit, String cursor) {}
    public static boolean valid(QueryInvitationsPage1 q) { return q!=null && scope(q.scope()) && text(q.requestedUserId(),8192) && text(q.cursor(),8192); }
    public record QueryInvitationsPage1Result(Boolean resolved, com.raxim.myscoutee.domain.events.dto.EventsDtos.EventsExplorePageDto value) {}
    public record QueryAttendingPage1(Scope scope, String requestedUserId, Integer requestedLimit, String cursor) {}
    public static boolean valid(QueryAttendingPage1 q) { return q!=null && scope(q.scope()) && text(q.requestedUserId(),8192) && text(q.cursor(),8192); }
    public record QueryAttendingPage1Result(Boolean resolved, com.raxim.myscoutee.domain.events.dto.EventsDtos.EventsExplorePageDto value) {}
    public record QueryHostingPage1(Scope scope, String requestedUserId, Integer requestedLimit, String cursor) {}
    public static boolean valid(QueryHostingPage1 q) { return q!=null && scope(q.scope()) && text(q.requestedUserId(),8192) && text(q.cursor(),8192); }
    public record QueryHostingPage1Result(Boolean resolved, com.raxim.myscoutee.domain.events.dto.EventsDtos.EventsExplorePageDto value) {}
    public record QueryTrashPage1(Scope scope, String requestedUserId, Integer requestedLimit, String cursor) {}
    public static boolean valid(QueryTrashPage1 q) { return q!=null && scope(q.scope()) && text(q.requestedUserId(),8192) && text(q.cursor(),8192); }
    public record QueryTrashPage1Result(Boolean resolved, com.raxim.myscoutee.domain.events.dto.EventsDtos.EventsExplorePageDto value) {}
    public record LoadEventDetailById1(Scope scope, String requestedUserId, String eventId) {}
    public static boolean valid(LoadEventDetailById1 q) { return q!=null && scope(q.scope()) && text(q.requestedUserId(),8192) && text(q.eventId(),8192); }
    public record LoadEventDetailById1Result(Boolean resolved, com.raxim.myscoutee.domain.events.dto.EventsDtos.EventDetailDto value) {}
    public record RequestJoin1(Scope scope, com.raxim.myscoutee.domain.events.dto.EventsDtos.EventActionRequestDto request) {}
    public static boolean valid(RequestJoin1 q) { return q!=null && scope(q.scope()); }
    public record RequestJoin1Result(Boolean resolved, com.raxim.myscoutee.domain.events.dto.EventsDtos.EventParticipationActionResultDto value) {}
    public record Sync1(Scope scope, com.raxim.myscoutee.domain.events.dto.EventsDtos.EventDetailDto request) {}
    public static boolean valid(Sync1 q) { return q!=null && scope(q.scope()); }
    public record Sync1Result(Boolean resolved, com.raxim.myscoutee.domain.events.dto.EventsDtos.EventDto value) {}
}

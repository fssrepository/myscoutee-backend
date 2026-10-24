package com.raxim.myscoutee.microservices.transport.events;

import static com.raxim.myscoutee.microservices.transport.common.ProtocolFields.text;
import static com.raxim.myscoutee.microservices.transport.common.ProtocolFields.ids;

import com.raxim.myscoutee.domain.events.api.ParticipationTickets;

public final class ParticipationTicketsProtocol {
    public static final String SINGLE = "/_internal/v1/events/participation-tickets/single";
    public static final String BATCH = "/_internal/v1/events/participation-tickets/batch";
    public static final String RECORDS = "/_internal/v1/events/participation-tickets/records";
    public static final String CHECK = "/_internal/v1/events/participation-tickets/check";
    public static final int MAX_REQUEST_BYTES = 2 * 1024 * 1024, MAX_RESPONSE_BYTES = 8 * 1024 * 1024;
    private ParticipationTicketsProtocol() {}
    public static String[] paths() { return new String[]{SINGLE, BATCH, RECORDS, CHECK}; }
    public record Error(String code) {}
    public record Scope(Boolean active, String groupId) {
        public static Scope current() { return new Scope(com.raxim.myscoutee.domain.platform.api.JobGroupContext.isActive(), com.raxim.myscoutee.domain.platform.api.JobGroupContext.groupId()); }
    }
    private static boolean scope(Scope value) { return value != null && value.active() != null && text(value.groupId(), 512) && (value.active() || value.groupId() == null); }
    public record User(Scope scope, String userId) {}
    public record Users(Scope scope, java.util.Collection<String> ids) {}
    public record Check(Scope scope, String code, String scannerUserId, java.time.Instant now) {}
    public record CheckResult(Boolean resolved, com.raxim.myscoutee.domain.events.dto.ParticipationTicketDto.CheckInDto value) {}
    public static boolean valid(User value) { return value != null && scope(value.scope()) && text(value.userId(), 512); }
    public static boolean valid(Users value) { return value != null && scope(value.scope()) && ids(value.ids()); }
    public static boolean valid(Check value) { return value != null && scope(value.scope()) && text(value.code(), 8192) && text(value.scannerUserId(), 512); }
}

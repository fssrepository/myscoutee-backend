package com.raxim.myscoutee.microservices.transport.events;

import com.raxim.myscoutee.domain.events.api.EventOperations;
import java.net.URI;
import java.time.Duration;
import com.raxim.myscoutee.microservices.transport.common.RemoteReadTransport;
import io.micrometer.core.instrument.MeterRegistry;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

/** Bounded scoped call to the existing owner; no automatic retries. */
public final class RemoteEventOperations extends RemoteReadTransport implements EventOperations {
    private final ObjectMapper mapper;
    private final com.raxim.myscoutee.microservices.transport.security.ActorDelegation.Signer signer;
    public RemoteEventOperations(URI origin, String token, boolean allowHttp, Duration connectTimeout,
            Duration requestTimeout, ObjectMapper mapper, MeterRegistry metrics, com.raxim.myscoutee.microservices.transport.security.ActorDelegation.Signer signer) {
        super(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics); this.mapper = mapper; this.signer = signer;
    }
    @Override public com.raxim.myscoutee.domain.events.dto.EventsDtos.EventsExplorePageDto queryItemsByUserPage(String requestedUserId, Integer requestedLimit, String cursor) {
        var command = new EventOperationsProtocol.QueryItemsByUserPage1(EventOperationsProtocol.Scope.current(), requestedUserId, requestedLimit, cursor);
        if (!EventOperationsProtocol.valid(command)) throw new IllegalArgumentException("Invalid event-operations request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > EventOperationsProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("event-operations request exceeds byte limit");
        var result = ownerExchange(EventOperationsProtocol.QUERYITEMSBYUSERPAGE_1, bytes, new TypeReference<EventOperationsProtocol.QueryItemsByUserPage1Result>() {},
                "event-operations.queryitemsbyuserpage_1", EventOperationsProtocol.MAX_RESPONSE_BYTES, v -> Boolean.TRUE.equals(v.resolved()));
        return result.value();
    }
    @Override public com.raxim.myscoutee.domain.events.dto.EventsDtos.EventsExplorePageDto queryInvitationsPage(String requestedUserId, Integer requestedLimit, String cursor) {
        var command = new EventOperationsProtocol.QueryInvitationsPage1(EventOperationsProtocol.Scope.current(), requestedUserId, requestedLimit, cursor);
        if (!EventOperationsProtocol.valid(command)) throw new IllegalArgumentException("Invalid event-operations request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > EventOperationsProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("event-operations request exceeds byte limit");
        var result = ownerExchange(EventOperationsProtocol.QUERYINVITATIONSPAGE_1, bytes, new TypeReference<EventOperationsProtocol.QueryInvitationsPage1Result>() {},
                "event-operations.queryinvitationspage_1", EventOperationsProtocol.MAX_RESPONSE_BYTES, v -> Boolean.TRUE.equals(v.resolved()));
        return result.value();
    }
    @Override public com.raxim.myscoutee.domain.events.dto.EventsDtos.EventsExplorePageDto queryAttendingPage(String requestedUserId, Integer requestedLimit, String cursor) {
        var command = new EventOperationsProtocol.QueryAttendingPage1(EventOperationsProtocol.Scope.current(), requestedUserId, requestedLimit, cursor);
        if (!EventOperationsProtocol.valid(command)) throw new IllegalArgumentException("Invalid event-operations request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > EventOperationsProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("event-operations request exceeds byte limit");
        var result = ownerExchange(EventOperationsProtocol.QUERYATTENDINGPAGE_1, bytes, new TypeReference<EventOperationsProtocol.QueryAttendingPage1Result>() {},
                "event-operations.queryattendingpage_1", EventOperationsProtocol.MAX_RESPONSE_BYTES, v -> Boolean.TRUE.equals(v.resolved()));
        return result.value();
    }
    @Override public com.raxim.myscoutee.domain.events.dto.EventsDtos.EventsExplorePageDto queryHostingPage(String requestedUserId, Integer requestedLimit, String cursor) {
        var command = new EventOperationsProtocol.QueryHostingPage1(EventOperationsProtocol.Scope.current(), requestedUserId, requestedLimit, cursor);
        if (!EventOperationsProtocol.valid(command)) throw new IllegalArgumentException("Invalid event-operations request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > EventOperationsProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("event-operations request exceeds byte limit");
        var result = ownerExchange(EventOperationsProtocol.QUERYHOSTINGPAGE_1, bytes, new TypeReference<EventOperationsProtocol.QueryHostingPage1Result>() {},
                "event-operations.queryhostingpage_1", EventOperationsProtocol.MAX_RESPONSE_BYTES, v -> Boolean.TRUE.equals(v.resolved()));
        return result.value();
    }
    @Override public com.raxim.myscoutee.domain.events.dto.EventsDtos.EventsExplorePageDto queryTrashPage(String requestedUserId, Integer requestedLimit, String cursor) {
        var command = new EventOperationsProtocol.QueryTrashPage1(EventOperationsProtocol.Scope.current(), requestedUserId, requestedLimit, cursor);
        if (!EventOperationsProtocol.valid(command)) throw new IllegalArgumentException("Invalid event-operations request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > EventOperationsProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("event-operations request exceeds byte limit");
        var result = ownerExchange(EventOperationsProtocol.QUERYTRASHPAGE_1, bytes, new TypeReference<EventOperationsProtocol.QueryTrashPage1Result>() {},
                "event-operations.querytrashpage_1", EventOperationsProtocol.MAX_RESPONSE_BYTES, v -> Boolean.TRUE.equals(v.resolved()));
        return result.value();
    }
    @Override public com.raxim.myscoutee.domain.events.dto.EventsDtos.EventDetailDto loadEventDetailById(String requestedUserId, String eventId) {
        var command = new EventOperationsProtocol.LoadEventDetailById1(EventOperationsProtocol.Scope.current(), requestedUserId, eventId);
        if (!EventOperationsProtocol.valid(command)) throw new IllegalArgumentException("Invalid event-operations request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > EventOperationsProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("event-operations request exceeds byte limit");
        var result = ownerExchange(EventOperationsProtocol.LOADEVENTDETAILBYID_1, bytes, new TypeReference<EventOperationsProtocol.LoadEventDetailById1Result>() {},
                "event-operations.loadeventdetailbyid_1", EventOperationsProtocol.MAX_RESPONSE_BYTES, v -> Boolean.TRUE.equals(v.resolved()));
        return result.value();
    }
    @Override public com.raxim.myscoutee.domain.events.dto.EventsDtos.EventParticipationActionResultDto requestJoin(com.raxim.myscoutee.domain.events.dto.EventsDtos.EventActionRequestDto request) {
        var command = new EventOperationsProtocol.RequestJoin1(EventOperationsProtocol.Scope.current(), request);
        if (!EventOperationsProtocol.valid(command)) throw new IllegalArgumentException("Invalid event-operations request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > EventOperationsProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("event-operations request exceeds byte limit");
        var result = ownerExchange(EventOperationsProtocol.REQUESTJOIN_1, bytes, new TypeReference<EventOperationsProtocol.RequestJoin1Result>() {},
                "event-operations.requestjoin_1", EventOperationsProtocol.MAX_RESPONSE_BYTES, v -> Boolean.TRUE.equals(v.resolved()));
        return result.value();
    }
    @Override public com.raxim.myscoutee.domain.events.dto.EventsDtos.EventDto sync(com.raxim.myscoutee.domain.events.dto.EventsDtos.EventDetailDto request) {
        var command = new EventOperationsProtocol.Sync1(EventOperationsProtocol.Scope.current(), request);
        if (!EventOperationsProtocol.valid(command)) throw new IllegalArgumentException("Invalid event-operations request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > EventOperationsProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("event-operations request exceeds byte limit");
        var result = ownerExchange(EventOperationsProtocol.SYNC_1, bytes, new TypeReference<EventOperationsProtocol.Sync1Result>() {},
                "event-operations.sync_1", EventOperationsProtocol.MAX_RESPONSE_BYTES, v -> Boolean.TRUE.equals(v.resolved()));
        return result.value();
    }
    private <T> T ownerExchange(String path, byte[] bytes, TypeReference<T> type, String operation, int limit,
            java.util.function.Predicate<T> valid) {
        try {
            if (EventOperationsProtocol.delegated(path)) return exchangeAuthorized(path, bytes, type, operation, limit, valid,
                    java.util.Map.of(com.raxim.myscoutee.microservices.transport.security.ActorDelegation.HEADER,
                            signer.issueForCurrent(EventOperationsProtocol.AUDIENCE, "POST", path, bytes)));
            return exchange(path, bytes, type, operation, limit, valid);
        }
        catch (RemoteReadException failure) {
            if (failure.status() >= 400 && failure.status() < 500 && "OWNER_REJECTED".equals(failure.remoteCode()))
                throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatusCode.valueOf(failure.status()));
            throw failure;
        }
    }

}

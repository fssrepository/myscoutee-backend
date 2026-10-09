package com.raxim.myscoutee.microservices.transport.notifications;

import com.raxim.myscoutee.domain.notifications.api.EventInvitationNotifications;
import java.net.URI;
import java.time.Duration;
import com.raxim.myscoutee.microservices.transport.common.RemoteReadTransport;
import io.micrometer.core.instrument.MeterRegistry;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

/** Bounded scoped call to the existing owner; no automatic retries. */
public final class RemoteEventInvitationNotifications extends RemoteReadTransport implements EventInvitationNotifications {
    private final ObjectMapper mapper;
    public RemoteEventInvitationNotifications(URI origin, String token, boolean allowHttp, Duration connectTimeout,
            Duration requestTimeout, ObjectMapper mapper, MeterRegistry metrics) {
        super(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics); this.mapper = mapper;
    }
    @Override public int markEventInvitationResolved(String userId, String eventId) {
        var command = new EventInvitationNotificationsProtocol.Resolve(EventInvitationNotificationsProtocol.Scope.current(), userId, eventId);
        if (!EventInvitationNotificationsProtocol.valid(command)) throw new IllegalArgumentException("Invalid event-invitation-notifications request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > EventInvitationNotificationsProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("event-invitation-notifications request exceeds byte limit");
        var result = ownerExchange(EventInvitationNotificationsProtocol.RESOLVE, bytes, new TypeReference<EventInvitationNotificationsProtocol.Count>() {},
                "event-invitation-notifications.resolve", EventInvitationNotificationsProtocol.MAX_RESPONSE_BYTES, v -> v.value()!=null && v.value()>=0);
        return result.value();
    }
    private <T> T ownerExchange(String path, byte[] bytes, TypeReference<T> type, String operation, int limit,
            java.util.function.Predicate<T> valid) {
        try { return exchange(path, bytes, type, operation, limit, valid); }
        catch (RemoteReadException failure) {
            if (failure.status() >= 400 && failure.status() < 500 && "OWNER_REJECTED".equals(failure.remoteCode()))
                throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatusCode.valueOf(failure.status()));
            throw failure;
        }
    }

}

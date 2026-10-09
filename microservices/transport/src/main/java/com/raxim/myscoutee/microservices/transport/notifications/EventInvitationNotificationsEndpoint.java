package com.raxim.myscoutee.microservices.transport.notifications;

import java.util.function.Function;
import java.util.function.Predicate;
import com.raxim.myscoutee.domain.notifications.api.EventInvitationNotifications;
import com.raxim.myscoutee.microservices.transport.common.ReadQueryBodies;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import tools.jackson.databind.*;

@RestController
public final class EventInvitationNotificationsEndpoint {
    private final EventInvitationNotifications owner;
    private final ObjectMapper mapper;
    public EventInvitationNotificationsEndpoint(EventInvitationNotifications owner, ObjectMapper mapper) { this.owner = owner; this.mapper = mapper; }
    @PostMapping(value = EventInvitationNotificationsProtocol.RESOLVE, produces = "application/json")
    public ResponseEntity<?> resolve(HttpServletRequest request) throws java.io.IOException {
        return read(request, EventInvitationNotificationsProtocol.Resolve.class, EventInvitationNotificationsProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> new EventInvitationNotificationsProtocol.Count(owner.markEventInvitationResolved(command.userId(), command.eventId()))));
    }
    private <T> ResponseEntity<?> read(HttpServletRequest request, Class<T> type, Predicate<T> valid, Function<T, Object> action)
            throws java.io.IOException {
        try {
            byte[] bytes = ReadQueryBodies.readBytes(request, EventInvitationNotificationsProtocol.MAX_REQUEST_BYTES);
            T query;
            try {
                query = mapper.readerFor(type).with(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES)
                        .with(DeserializationFeature.FAIL_ON_TRAILING_TOKENS).with(DeserializationFeature.FAIL_ON_NULL_FOR_PRIMITIVES).readValue(bytes);
            } catch (RuntimeException invalid) { throw new ReadQueryBodies.RejectedQuery(400, "INVALID_REQUEST"); }
            if (!valid.test(query)) throw new ReadQueryBodies.RejectedQuery(400, "INVALID_REQUEST");
            return response(200, action.apply(query));
        } catch (ReadQueryBodies.RejectedQuery invalid) { return response(invalid.status(), new EventInvitationNotificationsProtocol.Error(invalid.code())); }
        catch (org.springframework.web.server.ResponseStatusException rejected) {
            return response(rejected.getStatusCode().value(), new EventInvitationNotificationsProtocol.Error("OWNER_REJECTED"));
        }
        catch (RuntimeException unavailable) { return response(503, new EventInvitationNotificationsProtocol.Error("EVENT_INVITATION_NOTIFICATIONS_UNAVAILABLE")); }
    }
    private ResponseEntity<?> response(int status, Object body) { return ResponseEntity.status(status).cacheControl(CacheControl.noStore()).body(body); }
}

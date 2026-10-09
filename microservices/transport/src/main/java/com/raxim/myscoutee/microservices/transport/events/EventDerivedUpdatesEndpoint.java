package com.raxim.myscoutee.microservices.transport.events;

import java.util.function.Function;
import java.util.function.Predicate;
import com.raxim.myscoutee.domain.events.api.EventDerivedUpdates;
import com.raxim.myscoutee.microservices.transport.common.ReadQueryBodies;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import tools.jackson.databind.*;

@RestController
public final class EventDerivedUpdatesEndpoint {
    private final EventDerivedUpdates owner;
    private final ObjectMapper mapper;
    public EventDerivedUpdatesEndpoint(EventDerivedUpdates owner, ObjectMapper mapper) { this.owner = owner; this.mapper = mapper; }
    @PostMapping(value = EventDerivedUpdatesProtocol.AFFINITY, produces = "application/json")
    public ResponseEntity<?> affinity(HttpServletRequest request) throws java.io.IOException {
        return read(request, EventDerivedUpdatesProtocol.AffinityCommand.class, EventDerivedUpdatesProtocol::valid,
                command -> new EventDerivedUpdatesProtocol.Result(owner.updateAffinityVersion(command.version(), command.affinity(), command.boost())));
    }
    @PostMapping(value = EventDerivedUpdatesProtocol.STATUS, produces = "application/json")
    public ResponseEntity<?> status(HttpServletRequest request) throws java.io.IOException {
        return read(request, EventDerivedUpdatesProtocol.StatusCommand.class, EventDerivedUpdatesProtocol::valid,
                command -> new EventDerivedUpdatesProtocol.Result(owner.updateStatusVersionIfCurrent(command.version(), command.status(), command.previousStatus())));
    }
    private <T> ResponseEntity<?> read(HttpServletRequest request, Class<T> type, Predicate<T> valid, Function<T, Object> action)
            throws java.io.IOException {
        try {
            byte[] bytes = ReadQueryBodies.readBytes(request, EventDerivedUpdatesProtocol.MAX_REQUEST_BYTES);
            T query;
            try {
                query = mapper.readerFor(type).with(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES)
                        .with(DeserializationFeature.FAIL_ON_TRAILING_TOKENS).readValue(bytes);
            } catch (RuntimeException invalid) { throw new ReadQueryBodies.RejectedQuery(400, "INVALID_REQUEST"); }
            if (!valid.test(query)) throw new ReadQueryBodies.RejectedQuery(400, "INVALID_REQUEST");
            return response(200, action.apply(query));
        } catch (ReadQueryBodies.RejectedQuery invalid) { return response(invalid.status(), new EventDerivedUpdatesProtocol.Error(invalid.code())); }
        catch (RuntimeException unavailable) { return response(503, new EventDerivedUpdatesProtocol.Error("EVENT_UPDATE_OUTCOME_UNKNOWN")); }
    }
    private ResponseEntity<?> response(int status, Object body) { return ResponseEntity.status(status).cacheControl(CacheControl.noStore()).body(body); }
}

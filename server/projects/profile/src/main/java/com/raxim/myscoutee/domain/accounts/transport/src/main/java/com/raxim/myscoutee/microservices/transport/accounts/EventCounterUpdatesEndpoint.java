package com.raxim.myscoutee.microservices.transport.accounts;

import com.raxim.myscoutee.domain.accounts.api.EventCounterUpdates;
import com.raxim.myscoutee.microservices.transport.common.ReadQueryBodies;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import tools.jackson.databind.*;

@RestController
public final class EventCounterUpdatesEndpoint {
    private final EventCounterUpdates owner;
    private final ObjectMapper mapper;
    public EventCounterUpdatesEndpoint(EventCounterUpdates owner, ObjectMapper mapper) { this.owner = owner; this.mapper = mapper; }
    @PostMapping(value = EventCounterUpdatesProtocol.PATH, produces = "application/json")
    public ResponseEntity<?> replace(HttpServletRequest request) throws java.io.IOException {
        try {
            byte[] bytes = ReadQueryBodies.readBytes(request, EventCounterUpdatesProtocol.MAX_REQUEST_BYTES);
            EventCounterUpdatesProtocol.Command command;
            try {
                command = mapper.readerFor(EventCounterUpdatesProtocol.Command.class)
                        .with(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES).with(DeserializationFeature.FAIL_ON_TRAILING_TOKENS)
                        .with(DeserializationFeature.FAIL_ON_MISSING_CREATOR_PROPERTIES).with(DeserializationFeature.FAIL_ON_NULL_FOR_PRIMITIVES).readValue(bytes);
            } catch (RuntimeException invalid) { throw new ReadQueryBodies.RejectedQuery(400, "INVALID_REQUEST"); }
            if (!EventCounterUpdatesProtocol.valid(command)) throw new ReadQueryBodies.RejectedQuery(400, "INVALID_REQUEST");
            return response(200, new EventCounterUpdatesProtocol.Result(owner.replaceExpired(command.changes())));
        } catch (ReadQueryBodies.RejectedQuery invalid) { return response(invalid.status(), new EventCounterUpdatesProtocol.Error(invalid.code())); }
        catch (RuntimeException unavailable) { return response(503, new EventCounterUpdatesProtocol.Error("EVENT_COUNTER_UPDATE_UNAVAILABLE")); }
    }
    private ResponseEntity<?> response(int status, Object body) { return ResponseEntity.status(status).cacheControl(CacheControl.noStore()).body(body); }
}

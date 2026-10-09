package com.raxim.myscoutee.microservices.transport.events;

import com.raxim.myscoutee.domain.events.api.EventWatchDirectory;
import com.raxim.myscoutee.microservices.transport.common.ReadQueryBodies;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import tools.jackson.databind.*;

@RestController
public final class EventWatchDirectoryEndpoint {
    private final EventWatchDirectory owner;
    private final ObjectMapper mapper;
    public EventWatchDirectoryEndpoint(EventWatchDirectory owner, ObjectMapper mapper) { this.owner = owner; this.mapper = mapper; }
    @PostMapping(value = EventWatchDirectoryProtocol.PATH, produces = "application/json")
    public ResponseEntity<?> read(HttpServletRequest request) throws java.io.IOException {
        try {
            byte[] body = ReadQueryBodies.readBytes(request, EventWatchDirectoryProtocol.MAX_REQUEST_BYTES);
            EventWatchDirectoryProtocol.Query query;
            try {
                query = mapper.readerFor(EventWatchDirectoryProtocol.Query.class).with(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES)
                        .with(DeserializationFeature.FAIL_ON_TRAILING_TOKENS).readValue(body);
            } catch (RuntimeException invalid) { throw new ReadQueryBodies.RejectedQuery(400, "INVALID_REQUEST"); }
            if (!EventWatchDirectoryProtocol.valid(query)) throw new ReadQueryBodies.RejectedQuery(400, "INVALID_REQUEST");
            return response(200, java.util.Objects.requireNonNull(owner.watchedEventIds(query.userId())));
        } catch (ReadQueryBodies.RejectedQuery invalid) { return response(invalid.status(), new EventWatchDirectoryProtocol.Error(invalid.code())); }
        catch (RuntimeException unavailable) { return response(503, new EventWatchDirectoryProtocol.Error("EVENT_WATCH_DIRECTORY_UNAVAILABLE")); }
    }
    private ResponseEntity<?> response(int status, Object body) {
        return ResponseEntity.status(status).cacheControl(CacheControl.noStore()).body(body);
    }
}

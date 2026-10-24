package com.raxim.myscoutee.microservices.transport.events;

import com.raxim.myscoutee.domain.events.api.OrganizerEventReads;
import com.raxim.myscoutee.domain.events.dto.OrganizerEventDto;
import com.raxim.myscoutee.microservices.transport.common.ReadQueryBodies;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import tools.jackson.databind.*;

@RestController
public final class OrganizerEventReadsEndpoint {
    private final OrganizerEventReads owner;
    private final ObjectMapper mapper;
    public OrganizerEventReadsEndpoint(OrganizerEventReads owner, ObjectMapper mapper) {
        this.owner = owner;
        this.mapper = mapper;
    }
    @PostMapping(value = {OrganizerEventReadsProtocol.CREATORS, OrganizerEventReadsProtocol.SOURCES}, produces = "application/json")
    public ResponseEntity<?> read(HttpServletRequest request) throws java.io.IOException {
        try {
            byte[] body = ReadQueryBodies.readBytes(request, OrganizerEventReadsProtocol.MAX_REQUEST_BYTES);
            OrganizerEventReadsProtocol.Query query;
            try {
                query = mapper.readerFor(OrganizerEventReadsProtocol.Query.class)
                        .with(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES)
                        .with(DeserializationFeature.FAIL_ON_TRAILING_TOKENS).readValue(body);
            } catch (RuntimeException invalid) { throw new ReadQueryBodies.RejectedQuery(400, "INVALID_REQUEST"); }
            if (!OrganizerEventReadsProtocol.valid(query)) throw new ReadQueryBodies.RejectedQuery(400, "INVALID_REQUEST");
            var events = OrganizerEventReadsProtocol.CREATORS.equals(request.getServletPath())
                    ? owner.activeOriginalEventsByCreators(query.ids()) : owner.storedEventsBySources(query.ids());
            return response(200, events.stream().map(event -> event == null ? null : OrganizerEventDto.from(event)).toList());
        } catch (ReadQueryBodies.RejectedQuery invalid) {
            return response(invalid.status(), new OrganizerEventReadsProtocol.Error(invalid.code()));
        } catch (RuntimeException unavailable) {
            return response(503, new OrganizerEventReadsProtocol.Error("ORGANIZER_EVENTS_UNAVAILABLE"));
        }
    }
    private ResponseEntity<?> response(int status, Object body) {
        return ResponseEntity.status(status).cacheControl(CacheControl.noStore()).body(body);
    }
}

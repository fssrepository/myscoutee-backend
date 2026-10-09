package com.raxim.myscoutee.microservices.transport.events;

import com.raxim.myscoutee.domain.events.api.EventMembershipFacts;
import com.raxim.myscoutee.domain.events.dto.EventMembershipFactsDto;
import com.raxim.myscoutee.microservices.transport.events.EventMembershipFactsProtocol.Error;
import org.springframework.http.CacheControl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public final class EventMembershipFactsEndpoint {
    private final EventMembershipFacts owner;
    public EventMembershipFactsEndpoint(EventMembershipFacts owner) { this.owner = owner; }
    @GetMapping(value = EventMembershipFactsProtocol.PATH, produces = "application/json")
    public ResponseEntity<?> read(@RequestParam(required = false) String id) {
        if (id != null && id.length() > 512) return response(400, new Error("INVALID_REQUEST"));
        try {
            var result = owner.findBySourceId(id).stream().map(value -> value == null ? null : EventMembershipFactsDto.from(value)).toList();
            return result == null ? response(404, new Error("NOT_FOUND")) : response(200, result);
        } catch (RuntimeException unavailable) { return response(503, new Error("EVENT_MEMBERSHIP_FACTS_UNAVAILABLE")); }
    }
    private ResponseEntity<?> response(int status, Object body) {
        return ResponseEntity.status(status).cacheControl(CacheControl.noStore()).body(body);
    }
}

package com.raxim.myscoutee.microservices.transport.events;

import java.io.IOException;
import java.util.List;
import com.raxim.myscoutee.domain.events.api.EventMediaVisibility;
import com.raxim.myscoutee.microservices.transport.common.ReadQueryBodies;
import com.raxim.myscoutee.microservices.transport.common.MediaReferenceQueries;
import com.raxim.myscoutee.microservices.transport.events.EventMediaVisibilityProtocol.Error;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.CacheControl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import tools.jackson.databind.ObjectMapper;

@RestController
public final class EventMediaVisibilityEndpoint {
    private final EventMediaVisibility events;
    private final ObjectMapper mapper;
    public EventMediaVisibilityEndpoint(EventMediaVisibility events, ObjectMapper mapper) { this.events = events; this.mapper = mapper; }
    @PostMapping(value = EventMediaVisibilityProtocol.PATH, produces = "application/json")
    public ResponseEntity<?> event(HttpServletRequest request) throws IOException {
        List<String> urls;
        try { urls = MediaReferenceQueries.read(request, mapper); }
        catch (ReadQueryBodies.RejectedQuery invalid) { return response(invalid.status(), new Error(invalid.code())); }
        try {
            var result = events.event(urls);
            return result == null ? response(404, new Error("NOT_FOUND")) : response(200, result);
        } catch (RuntimeException unavailable) { return response(503, new Error("EVENT_VISIBILITY_UNAVAILABLE")); }
    }
    @GetMapping(value = EventMediaVisibilityProtocol.MEMBERSHIP_PATH, produces = "application/json")
    public ResponseEntity<?> membership(@RequestParam(required = false) String communityId,
            @RequestParam(required = false) String accountId) {
        if ((communityId != null && communityId.length() > 512) || (accountId != null && accountId.length() > 512))
            return response(400, new Error("INVALID_REQUEST"));
        try {
            var result = events.acceptedCommunityMember(communityId, accountId);
            return result == null ? response(404, new Error("NOT_FOUND")) : response(200, result);
        } catch (RuntimeException unavailable) { return response(503, new Error("EVENT_VISIBILITY_UNAVAILABLE")); }
    }
    private ResponseEntity<?> response(int status, Object body) {
        return ResponseEntity.status(status).cacheControl(CacheControl.noStore()).body(body);
    }
}

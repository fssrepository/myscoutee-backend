package com.raxim.myscoutee.microservices.transport.events;

import com.raxim.myscoutee.domain.events.api.FeedbackDirectory;
import com.raxim.myscoutee.domain.events.dto.FeedbackAnswerDto;
import com.raxim.myscoutee.microservices.transport.events.FeedbackDirectoryProtocol.Error;
import org.springframework.http.CacheControl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public final class FeedbackDirectoryEndpoint {
    private final FeedbackDirectory owner;
    public FeedbackDirectoryEndpoint(FeedbackDirectory owner) { this.owner = owner; }
    @GetMapping(value = FeedbackDirectoryProtocol.PATH, produces = "application/json")
    public ResponseEntity<?> read(@RequestParam(required = false) String id) {
        if (id != null && id.length() > 512) return response(400, new Error("INVALID_REQUEST"));
        try {
            var result = owner.findByTargetUserIdOrderBySubmittedAtIsoDesc(id).stream().map(value -> value == null ? null : FeedbackAnswerDto.from(value)).toList();
            return response(200, result);
        } catch (RuntimeException unavailable) { return response(503, new Error("FEEDBACK_DIRECTORY_UNAVAILABLE")); }
    }
    private ResponseEntity<?> response(int status, Object body) {
        return ResponseEntity.status(status).cacheControl(CacheControl.noStore()).body(body);
    }
}

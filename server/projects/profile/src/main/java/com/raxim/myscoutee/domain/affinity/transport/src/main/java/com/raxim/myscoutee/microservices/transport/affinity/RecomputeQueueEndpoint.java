package com.raxim.myscoutee.microservices.transport.affinity;

import com.raxim.myscoutee.domain.affinity.api.RecomputeQueue;
import com.raxim.myscoutee.microservices.transport.affinity.RecomputeQueueProtocol.Error;
import org.springframework.http.CacheControl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public final class RecomputeQueueEndpoint {
    private final RecomputeQueue queue;
    public RecomputeQueueEndpoint(RecomputeQueue queue) { this.queue = queue; }
    @GetMapping(value = RecomputeQueueProtocol.PATH, produces = "application/json")
    public ResponseEntity<?> count(@RequestParam(required = false) String baseGroupId, @RequestParam(required = false) String status) {
        if ((baseGroupId != null && baseGroupId.length() > 512) || (status != null && status.length() > 512))
            return response(400, new Error("INVALID_REQUEST"));
        try { return response(200, queue.count(baseGroupId, status)); }
        catch (RuntimeException unavailable) { return response(503, new Error("RECOMPUTE_QUEUE_UNAVAILABLE")); }
    }
    private ResponseEntity<?> response(int status, Object body) {
        return ResponseEntity.status(status).cacheControl(CacheControl.noStore()).body(body);
    }
}

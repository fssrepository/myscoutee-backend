package com.raxim.myscoutee.microservices.transport.affinity;

import com.raxim.myscoutee.domain.affinity.api.RecomputeMetrics;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

@RestController
public final class RecomputeMetricsEndpoint {
    private final RecomputeMetrics owner;
    public RecomputeMetricsEndpoint(RecomputeMetrics owner) { this.owner = owner; }
    @GetMapping(value = RecomputeMetricsProtocol.PATH, produces = "application/json")
    public ResponseEntity<?> read() {
        try {
            var value = java.util.Objects.requireNonNull(owner.snapshot());
            return response(200, new RecomputeMetricsProtocol.Result(true, value));
        } catch (RuntimeException unavailable) {
            return response(503, new RecomputeMetricsProtocol.Error("RECOMPUTE_METRICS_UNAVAILABLE"));
        }
    }
    private ResponseEntity<?> response(int status, Object body) {
        return ResponseEntity.status(status).cacheControl(CacheControl.noStore()).body(body);
    }
}

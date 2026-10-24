package com.raxim.myscoutee.microservices.transport.content;

import com.raxim.myscoutee.domain.content.api.ContentStatistics;
import com.raxim.myscoutee.microservices.transport.common.ReadQueryBodies;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import tools.jackson.databind.*;

@RestController
public final class ContentStatisticsEndpoint {
    private final ContentStatistics owner;
    private final ObjectMapper mapper;
    public ContentStatisticsEndpoint(ContentStatistics owner, ObjectMapper mapper) { this.owner = owner; this.mapper = mapper; }
    @GetMapping(value = ContentStatisticsProtocol.REPORTS, produces = "application/json")
    public ResponseEntity<?> reports() {
        try { return response(200, owner.unresolvedReports()); }
        catch (RuntimeException unavailable) { return unavailable(); }
    }
    @GetMapping(value = ContentStatisticsProtocol.FEEDBACK, produces = "application/json")
    public ResponseEntity<?> feedback() {
        try { return response(200, owner.unresolvedFeedback()); }
        catch (RuntimeException unavailable) { return unavailable(); }
    }
    @PostMapping(value = ContentStatisticsProtocol.FEED, produces = "application/json")
    public ResponseEntity<?> feed(HttpServletRequest request) throws java.io.IOException {
        try {
            byte[] bytes = ReadQueryBodies.readBytes(request, ContentStatisticsProtocol.MAX_REQUEST_BYTES);
            ContentStatisticsProtocol.Query query;
            try {
                query = mapper.readerFor(ContentStatisticsProtocol.Query.class).with(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES)
                        .with(DeserializationFeature.FAIL_ON_TRAILING_TOKENS).readValue(bytes);
            } catch (RuntimeException invalid) { throw new ReadQueryBodies.RejectedQuery(400, "INVALID_REQUEST"); }
            if (!ContentStatisticsProtocol.valid(query)) throw new ReadQueryBodies.RejectedQuery(400, "INVALID_REQUEST");
            return response(200, java.util.Objects.requireNonNull(owner.feedCounts(query.userId())));
        } catch (ReadQueryBodies.RejectedQuery invalid) { return response(invalid.status(), new ContentStatisticsProtocol.Error(invalid.code())); }
        catch (RuntimeException unavailable) { return unavailable(); }
    }
    private ResponseEntity<?> unavailable() { return response(503, new ContentStatisticsProtocol.Error("CONTENT_STATISTICS_UNAVAILABLE")); }
    private ResponseEntity<?> response(int status, Object body) { return ResponseEntity.status(status).cacheControl(CacheControl.noStore()).body(body); }
}

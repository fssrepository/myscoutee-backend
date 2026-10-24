package com.raxim.myscoutee.microservices.transport.common;

import com.raxim.myscoutee.common.measurement.*;
import com.raxim.myscoutee.domain.platform.api.JobGroupContext;
import jakarta.servlet.http.*;
import java.io.IOException;
import java.time.Instant;
import java.util.function.BiFunction;
import tools.jackson.databind.*;

/** One ordered owner cursor; success requires the terminal count, never just a closed socket. */
public final class MeasurementStream {
    public static final int MAX_REQUEST_BYTES = 4096, MAX_FRAME_BYTES = 16384, MAX_RESPONSE_BYTES = 256 * 1024 * 1024;
    public record Query(Boolean active, String groupId, Instant startInclusive, Instant endExclusive) {
        public static Query current(Instant start, Instant end) {
            return new Query(JobGroupContext.isActive(), JobGroupContext.groupId(), start, end);
        }
    }
    public record Frame(String kind, MeasurementEvidence evidence, Long count) {}
    public record Error(String code) {}
    private MeasurementStream() {}
    public static boolean valid(Query q) {
        return q != null && q.active() != null && (q.active() || q.groupId() == null)
                && (q.groupId() == null || q.groupId().length() <= 512)
                && q.startInclusive() != null && q.endExclusive() != null && q.startInclusive().isBefore(q.endExclusive());
    }
    public static void write(HttpServletRequest request, HttpServletResponse response, ObjectMapper mapper,
            BiFunction<Instant, Instant, EvidenceCursor> open) throws IOException {
        response.setHeader("Cache-Control", "no-store");
        Query query;
        try {
            byte[] bytes = ReadQueryBodies.readBytes(request, MAX_REQUEST_BYTES);
            try { query = mapper.readerFor(Query.class).with(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES)
                    .with(DeserializationFeature.FAIL_ON_TRAILING_TOKENS).readValue(bytes); }
            catch (RuntimeException invalid) { throw new ReadQueryBodies.RejectedQuery(400, "INVALID_REQUEST"); }
            if (!valid(query)) throw new ReadQueryBodies.RejectedQuery(400, "INVALID_REQUEST");
        } catch (ReadQueryBodies.RejectedQuery rejected) {
            response.setStatus(rejected.status()); response.setContentType("application/json");
            response.getOutputStream().write(mapper.writeValueAsBytes(new Error(rejected.code()))); return;
        }
        try {
            JobGroupContext.call(query.active(), query.groupId(), () -> {
                try (var cursor = open.apply(query.startInclusive(), query.endExclusive())) {
                    response.setStatus(200); response.setContentType("application/x-ndjson"); response.setHeader("X-Accel-Buffering", "no");
                    int bytes = 0; long count = 0;
                    while (cursor.hasNext()) {
                        var row = cursor.next();
                        if (row == null) throw new IllegalStateException("Null measurement evidence");
                        bytes += frame(response, mapper, new Frame("evidence", row, null), bytes); count++;
                    }
                    frame(response, mapper, new Frame("complete", null, count), bytes);
                    return null;
                } catch (IOException failure) { throw new java.io.UncheckedIOException(failure); }
            });
        } catch (java.io.UncheckedIOException disconnected) { throw disconnected.getCause(); }
        catch (RuntimeException unavailable) {
            // A truncated stream has no terminal count and must fail the measurement.
            if (response.isCommitted()) throw new IOException("Measurement stream did not complete");
            response.resetBuffer(); response.setStatus(503); response.setContentType("application/json");
            response.getOutputStream().write(mapper.writeValueAsBytes(new Error("MEASUREMENT_UNAVAILABLE")));
        }
    }
    private static int frame(HttpServletResponse response, ObjectMapper mapper, Frame frame, int total) throws IOException {
        byte[] bytes = mapper.writeValueAsBytes(frame);
        if (bytes.length > MAX_FRAME_BYTES || bytes.length + 1 > MAX_RESPONSE_BYTES - total)
            throw new IllegalStateException("Measurement stream exceeds bounds");
        var output = response.getOutputStream(); output.write(bytes); output.write('\n'); output.flush();
        return bytes.length + 1;
    }
}

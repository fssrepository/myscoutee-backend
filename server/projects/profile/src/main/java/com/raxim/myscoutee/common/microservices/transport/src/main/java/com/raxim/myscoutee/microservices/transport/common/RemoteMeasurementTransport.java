package com.raxim.myscoutee.microservices.transport.common;

import com.raxim.myscoutee.common.measurement.*;
import io.micrometer.core.instrument.MeterRegistry;
import java.net.URI;
import java.time.*;
import java.util.NoSuchElementException;
import tools.jackson.databind.*;

/** Six merge inputs remain lazy, sorted and bounded; no remote database cursor token or full-list buffer. */
public abstract class RemoteMeasurementTransport extends RemoteReadTransport {
    private final ObjectMapper mapper;
    protected RemoteMeasurementTransport(URI origin, String token, boolean allowHttp, Duration connectTimeout,
            Duration requestTimeout, ObjectMapper mapper, MeterRegistry metrics) {
        super(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics, Duration.ofMinutes(15)); this.mapper = mapper;
    }
    protected EvidenceCursor evidence(String path, String operation, Instant start, Instant end) {
        var query = MeasurementStream.Query.current(start, end);
        if (!MeasurementStream.valid(query)) throw new IllegalArgumentException("Invalid measurement window");
        return new MeasurementEvidenceCursor(openLines(path, mapper.writeValueAsBytes(query), operation,
                MeasurementStream.MAX_FRAME_BYTES, MeasurementStream.MAX_RESPONSE_BYTES));
    }

    /** Owns the exchange until completion, failure or explicit early close. */
    private final class MeasurementEvidenceCursor implements EvidenceCursor {
        private final LineExchange stream;
        private MeasurementEvidence next, previous;
        private boolean complete, closed;
        private long count;

        private MeasurementEvidenceCursor(LineExchange stream) { this.stream = stream; }
        @Override public boolean hasNext() {
            if (next != null) return true;
            if (complete) return false;
            if (closed) throw new IllegalStateException("Measurement cursor closed");
            try {
                byte[] bytes = stream.next();
                if (bytes == null) throw new RemoteReadException("INCOMPLETE_RESPONSE", 200);
                MeasurementStream.Frame frame;
                try { frame = mapper.readerFor(MeasurementStream.Frame.class)
                        .with(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES)
                        .with(DeserializationFeature.FAIL_ON_TRAILING_TOKENS).readValue(bytes); }
                catch (RuntimeException invalid) { throw new RemoteReadException("INVALID_RESPONSE", 200); }
                if (frame == null) throw new RemoteReadException("INVALID_RESPONSE", 200);
                if ("complete".equals(frame.kind()) && frame.evidence() == null && frame.count() != null && frame.count() == count) {
                    if (stream.next() != null) throw new RemoteReadException("INVALID_RESPONSE", 200);
                    complete = true; close(); return false;
                }
                if (!"evidence".equals(frame.kind()) || frame.evidence() == null || frame.count() != null)
                    throw new RemoteReadException("INVALID_RESPONSE", 200);
                next = frame.evidence();
                if (previous != null && MeasurementEvidence.ORDER.compare(previous, next) > 0)
                    throw new RemoteReadException("UNSORTED_RESPONSE", 200);
                previous = next; count++; return true;
            } catch (RuntimeException failure) { close(); throw failure; }
        }
        @Override public MeasurementEvidence next() {
            if (!hasNext()) throw new NoSuchElementException();
            var value = next; next = null; return value;
        }
        @Override public void close() { closed = true; next = null; stream.close(); }
    }
}

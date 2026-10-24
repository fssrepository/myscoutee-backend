package com.raxim.myscoutee.microservices.transport.events;

import java.net.URI;
import java.time.Duration;
import java.util.function.Consumer;
import com.raxim.myscoutee.domain.events.api.RandomGroupAssignment;
import com.raxim.myscoutee.microservices.transport.common.RemoteReadTransport;
import io.micrometer.core.instrument.MeterRegistry;
import tools.jackson.databind.*;

/** One native execution with live progress; callback stays local and no operation is retried. */
public final class RemoteRandomGroupAssignment extends RemoteReadTransport implements RandomGroupAssignment {
    private final ObjectMapper mapper;
    public RemoteRandomGroupAssignment(URI origin, String token, boolean allowHttp, Duration connectTimeout,
            Duration requestTimeout, ObjectMapper mapper, MeterRegistry metrics) {
        super(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics, Duration.ofMinutes(15)); this.mapper = mapper;
    }
    @Override public Result assignRandomGroups(Consumer<Progress> progress) {
        var command = RandomGroupAssignmentProtocol.Command.current();
        if (!RandomGroupAssignmentProtocol.valid(command)) throw new IllegalArgumentException("Invalid assignment job scope");
        Result[] result = new Result[1];
        exchangeLines(RandomGroupAssignmentProtocol.RUN, mapper.writeValueAsBytes(command), "events.random-group-assignment",
                RandomGroupAssignmentProtocol.MAX_FRAME_BYTES, RandomGroupAssignmentProtocol.MAX_RESPONSE_BYTES, bytes -> {
                    RandomGroupAssignmentProtocol.Frame frame;
                    try {
                        frame = mapper.readerFor(RandomGroupAssignmentProtocol.Frame.class)
                                .with(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES)
                                .with(DeserializationFeature.FAIL_ON_TRAILING_TOKENS).readValue(bytes);
                    } catch (RuntimeException invalid) { throw new RemoteReadException("INVALID_RESPONSE", 200); }
                    if (frame == null || result[0] != null) throw new RemoteReadException("INVALID_RESPONSE", 200);
                    if ("progress".equals(frame.kind()) && frame.progressPercent() != null && frame.progressPercent() >= 0
                            && frame.progressPercent() <= 100 && frame.plans() == null && frame.affectedUsers() == null) {
                        if (progress != null) progress.accept(new Progress(frame.progressPercent(), frame.detail()));
                    } else if ("result".equals(frame.kind()) && frame.plans() != null && frame.plans() >= 0
                            && frame.affectedUsers() != null && frame.affectedUsers() >= 0
                            && frame.progressPercent() == null && frame.detail() == null) {
                        result[0] = new Result(frame.plans(), frame.affectedUsers());
                    } else if ("error".equals(frame.kind())) throw new RemoteReadException("ASSIGNMENT_OUTCOME_UNKNOWN", 200);
                    else throw new RemoteReadException("INVALID_RESPONSE", 200);
                });
        if (result[0] == null) throw new RemoteReadException("INCOMPLETE_RESPONSE", 200);
        return result[0];
    }
}

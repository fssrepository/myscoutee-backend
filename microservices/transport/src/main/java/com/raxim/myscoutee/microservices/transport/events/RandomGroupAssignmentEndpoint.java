package com.raxim.myscoutee.microservices.transport.events;

import java.io.IOException;
import java.io.UncheckedIOException;
import java.util.concurrent.Semaphore;
import com.raxim.myscoutee.domain.events.api.RandomGroupAssignment;
import com.raxim.myscoutee.domain.platform.api.JobGroupContext;
import com.raxim.myscoutee.microservices.transport.common.ReadQueryBodies;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.web.bind.annotation.*;
import tools.jackson.databind.*;

@RestController
public final class RandomGroupAssignmentEndpoint {
    private final RandomGroupAssignment owner;
    private final ObjectMapper mapper;
    private final Semaphore execution = new Semaphore(1);
    public RandomGroupAssignmentEndpoint(RandomGroupAssignment owner, ObjectMapper mapper) { this.owner = owner; this.mapper = mapper; }
    @PostMapping(RandomGroupAssignmentProtocol.RUN)
    public void run(HttpServletRequest request, HttpServletResponse response) throws IOException {
        response.setHeader("Cache-Control", "no-store");
        RandomGroupAssignmentProtocol.Command command;
        try {
            var bytes = ReadQueryBodies.readBytes(request, RandomGroupAssignmentProtocol.MAX_REQUEST_BYTES);
            try {
                command = mapper.readerFor(RandomGroupAssignmentProtocol.Command.class)
                        .with(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES)
                        .with(DeserializationFeature.FAIL_ON_TRAILING_TOKENS).readValue(bytes);
            } catch (RuntimeException error) { throw new ReadQueryBodies.RejectedQuery(400, "INVALID_REQUEST"); }
            if (!RandomGroupAssignmentProtocol.valid(command)) throw new ReadQueryBodies.RejectedQuery(400, "INVALID_REQUEST");
        } catch (ReadQueryBodies.RejectedQuery error) { error(response, error.status(), error.code()); return; }
        if (!execution.tryAcquire()) { error(response, 503, "BUSY"); return; }
        try {
            response.setStatus(200); response.setContentType("application/x-ndjson");
            response.setHeader("X-Accel-Buffering", "no");
            var stream = new Frames(response);
            try {
                JobGroupContext.call(command.active(), command.groupId(), () -> {
                    var result = owner.assignRandomGroups(progress -> stream.send(new RandomGroupAssignmentProtocol.Frame(
                            "progress", progress.progressPercent(), progress.detail(), null, null)));
                    stream.send(new RandomGroupAssignmentProtocol.Frame("result", null, null, result.plans(), result.affectedUsers()));
                    return null;
                });
            } catch (UncheckedIOException disconnected) { throw disconnected.getCause(); }
            catch (RuntimeException failed) { stream.send(new RandomGroupAssignmentProtocol.Frame("error", null, "ASSIGNMENT_OUTCOME_UNKNOWN", null, null)); }
        } finally { execution.release(); }
    }
    private void error(HttpServletResponse response, int status, String code) throws IOException {
        response.setStatus(status); response.setContentType("application/json");
        response.getOutputStream().write(mapper.writeValueAsBytes(new RandomGroupAssignmentProtocol.Error(code)));
    }
    private final class Frames {
        private final HttpServletResponse response;
        private int total;
        Frames(HttpServletResponse response) { this.response = response; }
        void send(RandomGroupAssignmentProtocol.Frame frame) {
            byte[] bytes = mapper.writeValueAsBytes(frame);
            if (bytes.length > RandomGroupAssignmentProtocol.MAX_FRAME_BYTES
                    || bytes.length + 1 > RandomGroupAssignmentProtocol.MAX_RESPONSE_BYTES - total)
                throw new IllegalStateException("Assignment progress exceeds response bounds");
            try {
                var output = response.getOutputStream(); output.write(bytes); output.write('\n'); output.flush();
                total += bytes.length + 1;
            } catch (IOException error) { throw new UncheckedIOException(error); }
        }
    }
}

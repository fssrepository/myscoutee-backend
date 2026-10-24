package com.raxim.myscoutee.microservices.transport.feedback;

import java.util.function.Function;
import java.util.function.Predicate;
import com.raxim.myscoutee.domain.feedback.api.FeedbackPreparation;
import com.raxim.myscoutee.microservices.transport.common.ReadQueryBodies;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import tools.jackson.databind.*;

@RestController
public final class FeedbackPreparationEndpoint {
    private final FeedbackPreparation owner;
    private final ObjectMapper mapper;
    public FeedbackPreparationEndpoint(FeedbackPreparation owner, ObjectMapper mapper) { this.owner = owner; this.mapper = mapper; }
    @PostMapping(value = FeedbackPreparationProtocol.PREPARE, produces = "application/json")
    public ResponseEntity<?> prepare(HttpServletRequest request) throws java.io.IOException {
        return read(request, FeedbackPreparationProtocol.Command.class, FeedbackPreparationProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> new FeedbackPreparationProtocol.Result(owner.prepareSnapshot(command.snapshot()))));
    }
    private <T> ResponseEntity<?> read(HttpServletRequest request, Class<T> type, Predicate<T> valid, Function<T, Object> action)
            throws java.io.IOException {
        try {
            byte[] bytes = ReadQueryBodies.readBytes(request, FeedbackPreparationProtocol.MAX_REQUEST_BYTES);
            T query = ReadQueryBodies.decode(bytes, mapper, type, valid, true);
            return response(200, action.apply(query));
        } catch (ReadQueryBodies.RejectedQuery invalid) { return response(invalid.status(), new FeedbackPreparationProtocol.Error(invalid.code())); }
        catch (RuntimeException unavailable) { return response(503, new FeedbackPreparationProtocol.Error("CASE_FEEDBACK_PREPARATION_UNAVAILABLE")); }
    }
    private ResponseEntity<?> response(int status, Object body) { return ResponseEntity.status(status).cacheControl(CacheControl.noStore()).body(body); }
}

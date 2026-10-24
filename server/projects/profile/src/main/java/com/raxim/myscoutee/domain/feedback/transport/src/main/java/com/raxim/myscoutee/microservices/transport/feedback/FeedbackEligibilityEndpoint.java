package com.raxim.myscoutee.microservices.transport.feedback;

import java.util.function.Function;
import java.util.function.Predicate;
import com.raxim.myscoutee.domain.feedback.api.FeedbackEligibility;
import com.raxim.myscoutee.microservices.transport.common.ReadQueryBodies;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import tools.jackson.databind.*;

@RestController
public final class FeedbackEligibilityEndpoint {
    private final FeedbackEligibility owner;
    private final ObjectMapper mapper;
    public FeedbackEligibilityEndpoint(FeedbackEligibility owner, ObjectMapper mapper) { this.owner = owner; this.mapper = mapper; }
    @PostMapping(value = FeedbackEligibilityProtocol.PROJECT, produces = "application/json")
    public ResponseEntity<?> project(HttpServletRequest request) throws java.io.IOException {
        return read(request, FeedbackEligibilityProtocol.Project.class, FeedbackEligibilityProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> owner.project(command.ids(),command.now())));
    }
    @PostMapping(value = FeedbackEligibilityProtocol.COMPLETE, produces = "application/json")
    public ResponseEntity<?> complete(HttpServletRequest request) throws java.io.IOException {
        return read(request, FeedbackEligibilityProtocol.Complete.class, FeedbackEligibilityProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> receipt(() -> owner.complete(command.projection()))));
    }
    private FeedbackEligibilityProtocol.Receipt receipt(Runnable action) { action.run(); return new FeedbackEligibilityProtocol.Receipt(true); }
    private <T> ResponseEntity<?> read(HttpServletRequest request, Class<T> type, Predicate<T> valid, Function<T, Object> action)
            throws java.io.IOException {
        try {
            byte[] bytes = ReadQueryBodies.readBytes(request, FeedbackEligibilityProtocol.MAX_REQUEST_BYTES);
            T query = ReadQueryBodies.decode(bytes, mapper, type, valid, true);
            return response(200, action.apply(query));
        } catch (ReadQueryBodies.RejectedQuery invalid) { return response(invalid.status(), new FeedbackEligibilityProtocol.Error(invalid.code())); }
        catch (org.springframework.web.server.ResponseStatusException rejected) {
            return response(rejected.getStatusCode().value(), new FeedbackEligibilityProtocol.Error("OWNER_REJECTED"));
        }
        catch (RuntimeException unavailable) { return response(503, new FeedbackEligibilityProtocol.Error("FEEDBACK_ELIGIBILITY_UNAVAILABLE")); }
    }
    private ResponseEntity<?> response(int status, Object body) { return ResponseEntity.status(status).cacheControl(CacheControl.noStore()).body(body); }
}

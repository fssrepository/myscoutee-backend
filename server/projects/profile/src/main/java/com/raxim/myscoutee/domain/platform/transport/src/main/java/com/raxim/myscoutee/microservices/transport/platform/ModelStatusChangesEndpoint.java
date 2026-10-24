package com.raxim.myscoutee.microservices.transport.platform;

import java.util.function.Function;
import java.util.function.Predicate;
import com.raxim.myscoutee.domain.platform.api.ModelStatusChanges;
import com.raxim.myscoutee.microservices.transport.common.ReadQueryBodies;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import tools.jackson.databind.*;

@RestController
public final class ModelStatusChangesEndpoint {
    private final ModelStatusChanges owner;
    private final ObjectMapper mapper;
    public ModelStatusChangesEndpoint(ModelStatusChanges owner, ObjectMapper mapper) { this.owner = owner; this.mapper = mapper; }
    @PostMapping(value = ModelStatusChangesProtocol.PATH, produces = "application/json")
    public ResponseEntity<?> project(HttpServletRequest request) throws java.io.IOException {
        return read(request, ModelStatusChangesProtocol.Command.class, ModelStatusChangesProtocol::valid,
                command -> com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(),
                        () -> com.raxim.myscoutee.domain.platform.dto.ModelStatusOutcomeDto.from(owner.applyForUser(command.userId()))));
    }
    private <T> ResponseEntity<?> read(HttpServletRequest request, Class<T> type, Predicate<T> valid, Function<T, Object> action)
            throws java.io.IOException {
        try {
            byte[] bytes = ReadQueryBodies.readBytes(request, ModelStatusChangesProtocol.MAX_REQUEST_BYTES);
            T query = ReadQueryBodies.decode(bytes, mapper, type, valid, true);
            return response(200, action.apply(query));
        } catch (ReadQueryBodies.RejectedQuery invalid) { return response(invalid.status(), new ModelStatusChangesProtocol.Error(invalid.code())); }
        catch (RuntimeException unavailable) { return response(503, new ModelStatusChangesProtocol.Error("MODEL_STATUS_OUTCOME_UNKNOWN")); }
    }
    private ResponseEntity<?> response(int status, Object body) { return ResponseEntity.status(status).cacheControl(CacheControl.noStore()).body(body); }
}

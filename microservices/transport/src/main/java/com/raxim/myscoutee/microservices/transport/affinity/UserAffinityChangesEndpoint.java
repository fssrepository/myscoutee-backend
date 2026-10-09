package com.raxim.myscoutee.microservices.transport.affinity;

import java.io.IOException;
import com.raxim.myscoutee.domain.affinity.api.UserAffinityChanges;
import com.raxim.myscoutee.domain.affinity.dto.RecomputeTaskDto;
import com.raxim.myscoutee.microservices.transport.common.ReadQueryBodies;
import com.raxim.myscoutee.microservices.transport.affinity.UserAffinityChangesProtocol.*;
import com.raxim.myscoutee.microservices.transport.affinity.UserAffinityChangesProtocol.Error;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import tools.jackson.databind.*;

/** Accounts-owned change signals only; never edits a profile or grants an admin role. */
@RestController
public final class UserAffinityChangesEndpoint {
    private final UserAffinityChanges owner;
    private final ObjectMapper mapper;
    public UserAffinityChangesEndpoint(UserAffinityChanges owner, ObjectMapper mapper) { this.owner = owner; this.mapper = mapper; }
    @PostMapping(value = {UserAffinityChangesProtocol.PROFILE, UserAffinityChangesProtocol.STATUS}, produces = "application/json")
    public ResponseEntity<?> signal(HttpServletRequest request) throws IOException {
        final Signal signal;
        try {
            var bytes = ReadQueryBodies.readBytes(request, UserAffinityChangesProtocol.MAX_REQUEST_BYTES);
            signal = mapper.readerFor(Signal.class).with(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES)
                    .with(DeserializationFeature.FAIL_ON_TRAILING_TOKENS).readValue(bytes);
            if (signal == null || signal.userId() != null && signal.userId().length() > 512)
                return response(400, new Error("INVALID_REQUEST"));
        } catch (ReadQueryBodies.RejectedQuery invalid) {
            return response(invalid.status(), new Error(invalid.code()));
        } catch (RuntimeException invalid) {
            return response(400, new Error("INVALID_REQUEST"));
        }
        try {
            var task = UserAffinityChangesProtocol.PROFILE.equals(request.getRequestURI())
                    ? owner.enqueueUserChanged(signal.userId()) : owner.enqueueAdminStatusChanged(signal.userId());
            return response(200, new Receipt(true, RecomputeTaskDto.from(task)));
        } catch (RuntimeException failure) {
            return response(503, new Error("SIGNAL_OUTCOME_UNKNOWN"));
        }
    }
    private ResponseEntity<?> response(int status, Object body) {
        return ResponseEntity.status(status).cacheControl(CacheControl.noStore()).body(body);
    }
}

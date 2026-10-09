package com.raxim.myscoutee.microservices.transport.accounts;

import com.raxim.myscoutee.domain.accounts.api.FeedbackSession;
import com.raxim.myscoutee.microservices.transport.common.ReadQueryBodies;
import com.raxim.myscoutee.microservices.transport.security.ActorDelegation;
import com.raxim.myscoutee.microservices.transport.security.DelegatedRequestBodies;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.CacheControl;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;
import tools.jackson.databind.ObjectMapper;

@RestController
public final class FeedbackSessionEndpoint {
    private final FeedbackSession owner;
    private final ActorDelegation.Verifier verifier;
    private final ObjectMapper mapper;
    public FeedbackSessionEndpoint(FeedbackSession owner, ActorDelegation.Verifier verifier, ObjectMapper mapper) {
        this.owner = owner; this.verifier = verifier; this.mapper = mapper;
    }
    @PostMapping(value = FeedbackSessionProtocol.PATH, produces = "application/json")
    public ResponseEntity<?> selected(HttpServletRequest request) throws java.io.IOException {
        try {
            var verified = DelegatedRequestBodies.read(request, mapper, verifier, FeedbackSessionProtocol.AUDIENCE,
                    FeedbackSessionProtocol.PATH, FeedbackSessionProtocol.Query.class, FeedbackSessionProtocol.MAX_REQUEST_BYTES);
            if (!FeedbackSessionProtocol.valid(verified.value())) throw new ReadQueryBodies.RejectedQuery(400, "INVALID_REQUEST");
            var selected = verified.call(() -> owner.resolveFeedbackSession(verified.value().requestedUserId()));
            if (selected != null && !selected.identity().equals(verified.principal().getProfileIdentity())) throw new AccessDeniedException("Actor mismatch");
            return response(200, new FeedbackSessionProtocol.Result(true, selected));
        } catch (AccessDeniedException denied) { return response(403, new FeedbackSessionProtocol.Error("INVALID_DELEGATION")); }
        catch (ReadQueryBodies.RejectedQuery invalid) { return response(invalid.status(), new FeedbackSessionProtocol.Error(invalid.code())); }
        catch (RuntimeException unavailable) { return response(503, new FeedbackSessionProtocol.Error("FEEDBACK_SESSION_UNAVAILABLE")); }
    }
    private ResponseEntity<?> response(int status, Object body) {
        return ResponseEntity.status(status).cacheControl(CacheControl.noStore()).body(body);
    }
}

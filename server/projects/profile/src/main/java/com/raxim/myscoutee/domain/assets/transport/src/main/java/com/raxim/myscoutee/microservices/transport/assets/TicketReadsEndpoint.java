package com.raxim.myscoutee.microservices.transport.assets;

import com.raxim.myscoutee.domain.assets.api.TicketReads;
import com.raxim.myscoutee.microservices.transport.common.ReadQueryBodies;
import com.raxim.myscoutee.microservices.transport.security.ActorDelegation;
import com.raxim.myscoutee.microservices.transport.security.DelegatedRequestBodies;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.*;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.*;
import tools.jackson.databind.ObjectMapper;

@RestController
public final class TicketReadsEndpoint {
    private final TicketReads owner;
    private final ActorDelegation.Verifier verifier;
    private final ObjectMapper mapper;
    public TicketReadsEndpoint(TicketReads owner, ActorDelegation.Verifier verifier, ObjectMapper mapper) {
        this.owner = owner; this.verifier = verifier; this.mapper = mapper;
    }
    @PostMapping(value = TicketReadsProtocol.PATH, produces = "application/json")
    public ResponseEntity<?> query(HttpServletRequest request) throws java.io.IOException {
        try {
            var verified = DelegatedRequestBodies.read(request, mapper, verifier, TicketReadsProtocol.AUDIENCE,
                    TicketReadsProtocol.PATH, TicketReadsProtocol.Query.class, TicketReadsProtocol.MAX_REQUEST_BYTES);
            var query = verified.value();
            if (!TicketReadsProtocol.valid(query)) return response(400, new TicketReadsProtocol.Error("INVALID_REQUEST"));
            if (!verified.actor().profileId().equals(query.userId()))
                return response(403, new TicketReadsProtocol.Error("ACTOR_MISMATCH"));
            return response(200, verified.call(() -> owner.queryTicketPage(query.userId(), query.page(), query.pageSize(), query.order())));
        } catch (AccessDeniedException denied) { return response(403, new TicketReadsProtocol.Error("INVALID_DELEGATION")); }
        catch (ReadQueryBodies.RejectedQuery invalid) { return response(invalid.status(), new TicketReadsProtocol.Error(invalid.code())); }
        catch (RuntimeException failed) { return response(503, new TicketReadsProtocol.Error("READ_FAILED")); }
    }
    private ResponseEntity<?> response(int status, Object body) {
        return ResponseEntity.status(status).cacheControl(CacheControl.noStore()).body(body);
    }
}

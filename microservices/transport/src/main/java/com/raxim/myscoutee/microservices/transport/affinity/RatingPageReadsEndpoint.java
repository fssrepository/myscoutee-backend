package com.raxim.myscoutee.microservices.transport.affinity;

import java.util.function.Function;
import java.util.function.Predicate;
import com.raxim.myscoutee.domain.affinity.api.RatingPageReads;
import com.raxim.myscoutee.microservices.transport.common.ReadQueryBodies;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import tools.jackson.databind.*;

@RestController
public final class RatingPageReadsEndpoint {
    private final RatingPageReads owner;
    private final ObjectMapper mapper;
    private final com.raxim.myscoutee.microservices.transport.security.ActorDelegation.Verifier verifier;
    public RatingPageReadsEndpoint(RatingPageReads owner, ObjectMapper mapper, com.raxim.myscoutee.microservices.transport.security.ActorDelegation.Verifier verifier) { this.owner = owner; this.mapper = mapper; this.verifier = verifier; }
    @PostMapping(value = RatingPageReadsProtocol.PAGE, produces = "application/json")
    public ResponseEntity<?> page(HttpServletRequest request) throws java.io.IOException {
        return read(request, RatingPageReadsProtocol.Query.class, RatingPageReadsProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> owner.queryActivityRatePage(command.userId(), command.mode(), command.direction(), command.sort(), command.sortDirection(), command.secondary(), command.badge(), command.cursor(), command.limit(), command.rangeStart(), command.rangeEnd(), command.campaignId())));
    }
    private <T> ResponseEntity<?> read(HttpServletRequest request, Class<T> type, Predicate<T> valid, Function<T, Object> action)
            throws java.io.IOException {
        try {
            var verified = com.raxim.myscoutee.microservices.transport.security.DelegatedRequestBodies.read(
                    request, mapper, verifier, RatingPageReadsProtocol.AUDIENCE, RatingPageReadsProtocol.PAGE, type, RatingPageReadsProtocol.MAX_REQUEST_BYTES);
            T query = verified.value();
            if (!valid.test(query)) throw new ReadQueryBodies.RejectedQuery(400, "INVALID_REQUEST");
            if (!((RatingPageReadsProtocol.Query) query).userId().equals(verified.principal().getUserId()))
                throw new org.springframework.security.access.AccessDeniedException("Actor mismatch");
            return verified.call(() -> response(200, action.apply(query)));
        } catch (org.springframework.security.access.AccessDeniedException denied) { return response(403, new RatingPageReadsProtocol.Error("INVALID_DELEGATION"));
        } catch (ReadQueryBodies.RejectedQuery invalid) { return response(invalid.status(), new RatingPageReadsProtocol.Error(invalid.code())); }
        catch (org.springframework.web.server.ResponseStatusException rejected) {
            return response(rejected.getStatusCode().value(), new RatingPageReadsProtocol.Error("OWNER_REJECTED"));
        }
        catch (RuntimeException unavailable) { return response(503, new RatingPageReadsProtocol.Error("RATING_PAGE_READS_UNAVAILABLE")); }
    }
    private ResponseEntity<?> response(int status, Object body) { return ResponseEntity.status(status).cacheControl(CacheControl.noStore()).body(body); }
}

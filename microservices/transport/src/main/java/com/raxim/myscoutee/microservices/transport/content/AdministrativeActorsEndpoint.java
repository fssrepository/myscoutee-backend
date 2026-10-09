package com.raxim.myscoutee.microservices.transport.content;

import com.raxim.myscoutee.domain.content.api.AdministrativeActors;
import com.raxim.myscoutee.microservices.transport.common.ReadQueryBodies;
import com.raxim.myscoutee.microservices.transport.security.ActorDelegation;
import com.raxim.myscoutee.microservices.transport.security.DelegatedRequestBodies;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.CacheControl;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import tools.jackson.databind.ObjectMapper;

@RestController
public final class AdministrativeActorsEndpoint {
    private final AdministrativeActors owner;
    private final ActorDelegation.Verifier verifier;
    private final ObjectMapper mapper;
    public AdministrativeActorsEndpoint(AdministrativeActors owner, ActorDelegation.Verifier verifier, ObjectMapper mapper) {
        this.owner = owner; this.verifier = verifier; this.mapper = mapper;
    }
    @PostMapping(value = AdministrativeActorsProtocol.ACTOR, produces = "application/json")
    public ResponseEntity<?> actor(HttpServletRequest request) throws java.io.IOException { return read(request, AdministrativeActorsProtocol.ACTOR); }
    @PostMapping(value = AdministrativeActorsProtocol.GROUP, produces = "application/json")
    public ResponseEntity<?> group(HttpServletRequest request) throws java.io.IOException { return read(request, AdministrativeActorsProtocol.GROUP); }
    private ResponseEntity<?> read(HttpServletRequest request, String path) throws java.io.IOException {
        try {
            var verified = DelegatedRequestBodies.read(request, mapper, verifier, AdministrativeActorsProtocol.AUDIENCE,
                    path, AdministrativeActorsProtocol.Query.class, AdministrativeActorsProtocol.MAX_REQUEST_BYTES);
            if (!AdministrativeActorsProtocol.valid(verified.value())) throw new ReadQueryBodies.RejectedQuery(400, "INVALID_REQUEST");
            // Same A authority required by the canonical /admin route. Native
            // moderation still verifies configured admin email and base-profile membership.
            if (verified.principal().getAuthorities().stream().noneMatch(role -> "A".equals(role.getAuthority())))
                throw new AccessDeniedException("Administrator authority required");
            return response(200, verified.call(() -> path.equals(AdministrativeActorsProtocol.ACTOR)
                    ? java.util.Objects.requireNonNull(owner.resolveAdminActor(verified.value().adminUserId()))
                    : new AdministrativeActorsProtocol.GroupResult(true, owner.baseGroupId(verified.value().adminUserId()))));
        } catch (AccessDeniedException denied) { return response(403, new AdministrativeActorsProtocol.Error("INVALID_DELEGATION")); }
        catch (ReadQueryBodies.RejectedQuery invalid) { return response(invalid.status(), new AdministrativeActorsProtocol.Error(invalid.code())); }
        catch (ResponseStatusException rejected) {
            int status = rejected.getStatusCode().value();
            return response(status >= 400 && status < 500 ? status : 503, new AdministrativeActorsProtocol.Error("OWNER_REJECTED"));
        }
        catch (RuntimeException unavailable) { return response(503, new AdministrativeActorsProtocol.Error("ADMINISTRATIVE_ACTOR_UNAVAILABLE")); }
    }
    private ResponseEntity<?> response(int status, Object body) { return ResponseEntity.status(status).cacheControl(CacheControl.noStore()).body(body); }
}

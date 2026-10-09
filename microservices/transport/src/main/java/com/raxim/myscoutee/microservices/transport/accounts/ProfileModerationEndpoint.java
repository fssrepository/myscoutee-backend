package com.raxim.myscoutee.microservices.transport.accounts;

import com.raxim.myscoutee.domain.accounts.api.ProfileModeration;
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
public final class ProfileModerationEndpoint {
    private final ProfileModeration owner;
    private final ActorDelegation.Verifier verifier;
    private final ObjectMapper mapper;
    public ProfileModerationEndpoint(ProfileModeration owner, ActorDelegation.Verifier verifier, ObjectMapper mapper) {
        this.owner = owner; this.verifier = verifier; this.mapper = mapper;
    }
    @PostMapping(value = ProfileModerationProtocol.BLOCK, produces = "application/json")
    public ResponseEntity<?> actor(HttpServletRequest request) throws java.io.IOException { return read(request, ProfileModerationProtocol.BLOCK); }
    @PostMapping(value = ProfileModerationProtocol.UNBLOCK, produces = "application/json")
    public ResponseEntity<?> group(HttpServletRequest request) throws java.io.IOException { return read(request, ProfileModerationProtocol.UNBLOCK); }
    private ResponseEntity<?> read(HttpServletRequest request, String path) throws java.io.IOException {
        try {
            var verified = DelegatedRequestBodies.read(request, mapper, verifier, ProfileModerationProtocol.AUDIENCE,
                    path, ProfileModerationProtocol.Command.class, ProfileModerationProtocol.MAX_REQUEST_BYTES);
            if (!ProfileModerationProtocol.valid(verified.value())) throw new ReadQueryBodies.RejectedQuery(400, "INVALID_REQUEST");
            // The content owner already checks configured admin identity, case eligibility and workspace.
            // This command additionally requires the caller capability and the same signed A actor.
            if (verified.principal().getAuthorities().stream().noneMatch(role -> "A".equals(role.getAuthority())))
                throw new AccessDeniedException("Administrator authority required");
            if (verified.value().notice() != null && (!path.equals(ProfileModerationProtocol.BLOCK)
                    || !verified.value().notice().adminUserId().equals(verified.principal().getUserId())))
                throw new AccessDeniedException("Notice author must match the delegated administrator");
            return response(200, verified.call(() -> {
                if (path.equals(ProfileModerationProtocol.BLOCK))
                    return new ProfileModerationProtocol.Receipt(true, owner.block(verified.value().userId(), verified.value().notice()));
                owner.unblock(verified.value().userId());
                return new ProfileModerationProtocol.Receipt(true, null);
            }));
        } catch (AccessDeniedException denied) { return response(403, new ProfileModerationProtocol.Error("INVALID_DELEGATION")); }
        catch (ReadQueryBodies.RejectedQuery invalid) { return response(invalid.status(), new ProfileModerationProtocol.Error(invalid.code())); }
        catch (ResponseStatusException rejected) {
            int status = rejected.getStatusCode().value();
            return response(status >= 400 && status < 500 ? status : 503, new ProfileModerationProtocol.Error("OWNER_REJECTED"));
        }
        catch (RuntimeException unavailable) { return response(503, new ProfileModerationProtocol.Error("PROFILE_MODERATION_OUTCOME_UNKNOWN")); }
    }
    private ResponseEntity<?> response(int status, Object body) { return ResponseEntity.status(status).cacheControl(CacheControl.noStore()).body(body); }
}

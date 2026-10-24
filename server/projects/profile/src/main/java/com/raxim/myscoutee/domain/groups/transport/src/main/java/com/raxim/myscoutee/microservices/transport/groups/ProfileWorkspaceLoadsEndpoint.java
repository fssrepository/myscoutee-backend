package com.raxim.myscoutee.microservices.transport.groups;

import com.raxim.myscoutee.domain.groups.api.ProfileWorkspaceLoads;
import com.raxim.myscoutee.microservices.transport.common.ReadQueryBodies;
import com.raxim.myscoutee.microservices.transport.security.ActorDelegation;
import com.raxim.myscoutee.microservices.transport.security.DelegatedRequestBodies;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.*;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import tools.jackson.databind.ObjectMapper;

@RestController
public final class ProfileWorkspaceLoadsEndpoint {
    private final ProfileWorkspaceLoads owner;
    private final ActorDelegation.Verifier verifier;
    private final ObjectMapper mapper;
    public ProfileWorkspaceLoadsEndpoint(ProfileWorkspaceLoads owner, ActorDelegation.Verifier verifier, ObjectMapper mapper) {
        this.owner = owner; this.verifier = verifier; this.mapper = mapper;
    }
    @PostMapping(value = ProfileWorkspaceLoadsProtocol.PATH, produces = "application/json")
    public ResponseEntity<?> complete(HttpServletRequest request) throws java.io.IOException {
        try {
            var verified = DelegatedRequestBodies.read(request, mapper, verifier, ProfileWorkspaceLoadsProtocol.AUDIENCE,
                    ProfileWorkspaceLoadsProtocol.PATH, ProfileWorkspaceLoadsProtocol.Command.class, ProfileWorkspaceLoadsProtocol.MAX_REQUEST_BYTES);
            var command = verified.value();
            if (!ProfileWorkspaceLoadsProtocol.valid(command)) return response(400, new ProfileWorkspaceLoadsProtocol.Error("INVALID_REQUEST"));
            var actor = verified.actor();
            String account = actor.accountId().isEmpty() ? actor.profileId() : actor.accountId();
            String currentGroup = command.currentGroupId() == null ? "" : command.currentGroupId();
            if (!account.equals(command.accountId()) || !actor.workspaceGroupId().equals(currentGroup))
                return response(403, new ProfileWorkspaceLoadsProtocol.Error("ACTOR_MISMATCH"));
            var result = verified.call(() -> owner.loadProfileWorkspace(command.accountId(), command.currentGroupId(), command.requestedGroupId()));
            if (result == null) throw new IllegalStateException("Missing workspace completion");
            return response(200, new ProfileWorkspaceLoadsProtocol.Result(true, result));
        } catch (AccessDeniedException denied) { return response(403, new ProfileWorkspaceLoadsProtocol.Error("INVALID_DELEGATION")); }
        catch (ReadQueryBodies.RejectedQuery invalid) { return response(invalid.status(), new ProfileWorkspaceLoadsProtocol.Error(invalid.code())); }
        catch (ResponseStatusException rejected) {
            int status = rejected.getStatusCode().value();
            return response(status >= 400 && status < 500 ? status : 503,
                    new ProfileWorkspaceLoadsProtocol.Error(status >= 400 && status < 500 ? "OWNER_REJECTED" : "COMPLETION_OUTCOME_UNKNOWN"));
        }
        catch (RuntimeException failed) { return response(503, new ProfileWorkspaceLoadsProtocol.Error("COMPLETION_OUTCOME_UNKNOWN")); }
    }
    private ResponseEntity<?> response(int status, Object body) {
        return ResponseEntity.status(status).cacheControl(CacheControl.noStore()).body(body);
    }
}

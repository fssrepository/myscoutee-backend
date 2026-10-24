package com.raxim.myscoutee.microservices.transport.email;

import java.util.Collections;
import com.raxim.myscoutee.domain.email.api.UserActivityScheduling;
import com.raxim.myscoutee.microservices.transport.common.ReadQueryBodies;
import com.raxim.myscoutee.microservices.transport.security.ActorDelegation;
import com.raxim.myscoutee.microservices.transport.email.UserActivitySchedulingProtocol.*;
import com.raxim.myscoutee.microservices.transport.email.UserActivitySchedulingProtocol.Error;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.*;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.*;
import tools.jackson.databind.*;

@RestController
public final class UserActivitySchedulingEndpoint {
    private final UserActivityScheduling owner;
    private final ActorDelegation.Verifier verifier;
    private final ObjectMapper mapper;
    public UserActivitySchedulingEndpoint(UserActivityScheduling owner,ActorDelegation.Verifier verifier,ObjectMapper mapper) {
        this.owner=owner;this.verifier=verifier;this.mapper=mapper;
    }
    @PostMapping(value=UserActivitySchedulingProtocol.PATH,produces="application/json")
    public ResponseEntity<?> submit(HttpServletRequest request) throws java.io.IOException {
        try {
            var verified=com.raxim.myscoutee.microservices.transport.security.DelegatedRequestBodies.read(
                    request,mapper,verifier,UserActivitySchedulingProtocol.AUDIENCE,UserActivitySchedulingProtocol.PATH,Command.class,UserActivitySchedulingProtocol.MAX_REQUEST_BYTES);
            var actor=verified.actor();var command=verified.value();
            if(command.userId()==null || command.userId().isBlank() || command.userId().length()>512)
                return response(400,new Error("INVALID_REQUEST"));
            if(!actor.profileId().equals(command.userId()))return response(403,new Error("ACTOR_MISMATCH"));
            verified.call(() -> { owner.touchUserActivity(command.userId()); return null; });
            return response(200,new Receipt(true));
        } catch(AccessDeniedException denied){return response(403,new Error("INVALID_DELEGATION"));}
        catch(ReadQueryBodies.RejectedQuery invalid){return response(invalid.status(),new Error(invalid.code()));}
        catch(RuntimeException failed){return response(503,new Error("SUBMISSION_OUTCOME_UNKNOWN"));}
    }
    private ResponseEntity<?> response(int status,Object body){return ResponseEntity.status(status).cacheControl(CacheControl.noStore()).body(body);}
}

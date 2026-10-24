package com.raxim.myscoutee.microservices.transport.content;

import java.util.Collections;
import com.raxim.myscoutee.domain.content.api.UserFeedback;
import com.raxim.myscoutee.microservices.transport.common.ReadQueryBodies;
import com.raxim.myscoutee.microservices.transport.security.ActorDelegation;
import com.raxim.myscoutee.microservices.transport.content.UserFeedbackProtocol.*;
import com.raxim.myscoutee.microservices.transport.content.UserFeedbackProtocol.Error;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.*;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.*;
import tools.jackson.databind.*;

@RestController
public final class UserFeedbackEndpoint {
    private final UserFeedback owner;
    private final ActorDelegation.Verifier verifier;
    private final ObjectMapper mapper;
    public UserFeedbackEndpoint(UserFeedback owner,ActorDelegation.Verifier verifier,ObjectMapper mapper) {
        this.owner=owner;this.verifier=verifier;this.mapper=mapper;
    }
    @PostMapping(value=UserFeedbackProtocol.PATH,produces="application/json")
    public ResponseEntity<?> submit(HttpServletRequest request) throws java.io.IOException {
        try {
            var verified=com.raxim.myscoutee.microservices.transport.security.DelegatedRequestBodies.read(
                    request,mapper,verifier,UserFeedbackProtocol.AUDIENCE,UserFeedbackProtocol.PATH,Command.class,UserFeedbackProtocol.MAX_REQUEST_BYTES);
            var actor=verified.actor();var command=verified.value();
            if(command==null || command.requestId()==null || !command.requestId().matches("[a-f0-9]{24}")
                    || command.userId()==null || command.userId().length()>512
                    || command.category()==null || command.subject()==null || command.details()==null)
                return response(400,new Error("INVALID_REQUEST"));
            if(!actor.profileId().equals(command.userId()))return response(403,new Error("ACTOR_MISMATCH"));
            return response(200,new Receipt(verified.call(() -> owner.submitOnce(command.requestId(),command.userId(),command.category(),command.subject(),command.details()))));
        } catch(AccessDeniedException denied){return response(403,new Error("INVALID_DELEGATION"));}
        catch(ReadQueryBodies.RejectedQuery invalid){return response(invalid.status(),new Error(invalid.code()));}
        catch(IllegalArgumentException conflict){return response(409,new Error("REQUEST_CONFLICT"));}
        catch(RuntimeException failed){return response(503,new Error("SUBMISSION_OUTCOME_UNKNOWN"));}
    }
    private ResponseEntity<?> response(int status,Object body){return ResponseEntity.status(status).cacheControl(CacheControl.noStore()).body(body);}
}

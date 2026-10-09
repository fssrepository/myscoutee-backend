package com.raxim.myscoutee.microservices.transport.content;

import com.raxim.myscoutee.domain.content.api.UserReports;
import com.raxim.myscoutee.microservices.transport.common.ReadQueryBodies;
import com.raxim.myscoutee.microservices.transport.security.*;
import com.raxim.myscoutee.microservices.transport.content.UserReportsProtocol.*;
import com.raxim.myscoutee.microservices.transport.content.UserReportsProtocol.Error;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.*;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.*;
import tools.jackson.databind.ObjectMapper;

@RestController
public final class UserReportsEndpoint {
    private final UserReports owner;
    private final ActorDelegation.Verifier verifier;
    private final ObjectMapper mapper;
    public UserReportsEndpoint(UserReports owner,ActorDelegation.Verifier verifier,ObjectMapper mapper) {this.owner=owner;this.verifier=verifier;this.mapper=mapper;}
    @PostMapping(value=UserReportsProtocol.SUBMIT,produces="application/json")
    public ResponseEntity<?> submit(HttpServletRequest request) throws java.io.IOException {
        try {
            var verified=DelegatedRequestBodies.read(request,mapper,verifier,UserReportsProtocol.SUBMIT_AUDIENCE,
                    UserReportsProtocol.SUBMIT,UserReports.ReportDraft.class,UserReportsProtocol.MAX_REQUEST_BYTES);
            var draft=verified.value();
            if(!validKey(draft.syncKey()))return response(400,new Error("INVALID_REQUEST"));
            if(!verified.actor().profileId().equals(draft.userId()))return response(403,new Error("ACTOR_MISMATCH"));
            return response(200,verified.call(() -> owner.submit(draft)));
        } catch(AccessDeniedException denied){return response(403,new Error("INVALID_DELEGATION"));}
        catch(ReadQueryBodies.RejectedQuery invalid){return response(invalid.status(),new Error(invalid.code()));}
        catch(RuntimeException unavailable){return response(503,new Error("SUBMISSION_OUTCOME_UNKNOWN"));}
    }
    @PostMapping(value=UserReportsProtocol.EXISTS,produces="application/json")
    public ResponseEntity<?> exists(HttpServletRequest request) throws java.io.IOException {
        try {
            var verified=DelegatedRequestBodies.read(request,mapper,verifier,UserReportsProtocol.EXISTS_AUDIENCE,
                    UserReportsProtocol.EXISTS,ExistsQuery.class,UserReportsProtocol.MAX_REQUEST_BYTES);
            if(!validKey(verified.value().syncKey()))return response(400,new Error("INVALID_REQUEST"));
            return response(200,new ExistsResult(verified.call(() -> owner.exists(verified.value().syncKey()))));
        } catch(AccessDeniedException denied){return response(403,new Error("INVALID_DELEGATION"));}
        catch(ReadQueryBodies.RejectedQuery invalid){return response(invalid.status(),new Error(invalid.code()));}
        catch(RuntimeException unavailable){return response(503,new Error("REPORT_READ_UNAVAILABLE"));}
    }
    private boolean validKey(String key){return key!=null && !key.isBlank() && key.length()<=512;}
    private ResponseEntity<?> response(int status,Object body){return ResponseEntity.status(status).cacheControl(CacheControl.noStore()).body(body);}
}

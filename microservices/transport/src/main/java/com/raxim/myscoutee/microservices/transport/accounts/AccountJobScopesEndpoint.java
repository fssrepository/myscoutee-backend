package com.raxim.myscoutee.microservices.transport.accounts;

import com.raxim.myscoutee.domain.accounts.api.AccountJobScopes;
import com.raxim.myscoutee.microservices.transport.common.ReadQueryBodies;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import tools.jackson.databind.*;

@RestController
public final class AccountJobScopesEndpoint {
    private final AccountJobScopes owner;
    private final ObjectMapper mapper;
    public AccountJobScopesEndpoint(AccountJobScopes owner, ObjectMapper mapper) { this.owner = owner; this.mapper = mapper; }
    @PostMapping(value = AccountJobScopesProtocol.PATH, produces = "application/json")
    public ResponseEntity<?> read(HttpServletRequest request) throws java.io.IOException {
        try {
            byte[] body = ReadQueryBodies.readBytes(request, AccountJobScopesProtocol.MAX_REQUEST_BYTES);
            AccountJobScopesProtocol.Query query;
            try {
                query = mapper.readerFor(AccountJobScopesProtocol.Query.class).with(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES)
                        .with(DeserializationFeature.FAIL_ON_TRAILING_TOKENS).readValue(body);
            } catch (RuntimeException invalid) { throw new ReadQueryBodies.RejectedQuery(400, "INVALID_REQUEST"); }
            if (!AccountJobScopesProtocol.valid(query)) throw new ReadQueryBodies.RejectedQuery(400, "INVALID_REQUEST");
            return response(200, java.util.Objects.requireNonNull(owner.matchingOwners(query.ids(), query.scope())));
        } catch (ReadQueryBodies.RejectedQuery invalid) { return response(invalid.status(), new AccountJobScopesProtocol.Error(invalid.code())); }
        catch (RuntimeException unavailable) { return response(503, new AccountJobScopesProtocol.Error("ACCOUNT_JOB_SCOPES_UNAVAILABLE")); }
    }
    private ResponseEntity<?> response(int status, Object body) {
        return ResponseEntity.status(status).cacheControl(CacheControl.noStore()).body(body);
    }
}

package com.raxim.myscoutee.microservices.transport.accounts;

import java.util.function.Function;
import java.util.function.Predicate;
import com.raxim.myscoutee.domain.accounts.api.AccountInactivity;
import com.raxim.myscoutee.microservices.transport.common.ReadQueryBodies;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import tools.jackson.databind.*;

@RestController
public final class AccountInactivityEndpoint {
    private final AccountInactivity owner;
    private final ObjectMapper mapper;
    public AccountInactivityEndpoint(AccountInactivity owner, ObjectMapper mapper) { this.owner = owner; this.mapper = mapper; }
    @PostMapping(value = AccountInactivityProtocol.INACTIVATE, produces = "application/json")
    public ResponseEntity<?> inactivate(HttpServletRequest request) throws java.io.IOException {
        return read(request, AccountInactivityProtocol.Inactivate.class, AccountInactivityProtocol::valid,
                command -> com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> new AccountInactivityProtocol.Result(owner.inactivate(command.userId(), command.inactiveDays(), command.now()))));
    }
    private <T> ResponseEntity<?> read(HttpServletRequest request, Class<T> type, Predicate<T> valid, Function<T, Object> action)
            throws java.io.IOException {
        try {
            byte[] bytes = ReadQueryBodies.readBytes(request, AccountInactivityProtocol.MAX_REQUEST_BYTES);
            T query = ReadQueryBodies.decode(bytes, mapper, type, valid, true);
            return response(200, action.apply(query));
        } catch (ReadQueryBodies.RejectedQuery invalid) { return response(invalid.status(), new AccountInactivityProtocol.Error(invalid.code())); }
        catch (RuntimeException unavailable) { return response(503, new AccountInactivityProtocol.Error("ACCOUNT_INACTIVITY_OUTCOME_UNKNOWN")); }
    }
    private ResponseEntity<?> response(int status, Object body) { return ResponseEntity.status(status).cacheControl(CacheControl.noStore()).body(body); }
}

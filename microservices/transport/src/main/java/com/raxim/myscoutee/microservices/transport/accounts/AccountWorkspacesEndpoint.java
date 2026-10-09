package com.raxim.myscoutee.microservices.transport.accounts;

import java.util.function.Function;
import java.util.function.Predicate;
import com.raxim.myscoutee.domain.accounts.api.AccountWorkspaces;
import com.raxim.myscoutee.microservices.transport.common.ReadQueryBodies;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import tools.jackson.databind.*;

@RestController
public final class AccountWorkspacesEndpoint {
    private final AccountWorkspaces owner;
    private final ObjectMapper mapper;
    public AccountWorkspacesEndpoint(AccountWorkspaces owner, ObjectMapper mapper) { this.owner = owner; this.mapper = mapper; }
    @PostMapping(value = AccountWorkspacesProtocol.SELECT, produces = "application/json")
    public ResponseEntity<?> select(HttpServletRequest request) throws java.io.IOException {
        return read(request, AccountWorkspacesProtocol.Select.class, AccountWorkspacesProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> profile(owner.select(command.accountId(), command.groupId()))));
    }
    @PostMapping(value = AccountWorkspacesProtocol.ACTIVATE, produces = "application/json")
    public ResponseEntity<?> activate(HttpServletRequest request) throws java.io.IOException {
        return read(request, AccountWorkspacesProtocol.Select.class, AccountWorkspacesProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> profile(owner.activate(command.accountId(), command.groupId()))));
    }
    @PostMapping(value = AccountWorkspacesProtocol.ADMIT, produces = "application/json")
    public ResponseEntity<?> admit(HttpServletRequest request) throws java.io.IOException {
        return read(request, AccountWorkspacesProtocol.Policy.class, AccountWorkspacesProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> profile(owner.admit(command.group(), command.accountId()))));
    }
    @PostMapping(value = AccountWorkspacesProtocol.POLICY, produces = "application/json")
    public ResponseEntity<?> policy(HttpServletRequest request) throws java.io.IOException {
        return read(request, AccountWorkspacesProtocol.Policy.class, AccountWorkspacesProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> receipt(() -> owner.applyPolicy(command.group()))));
    }
    @PostMapping(value = AccountWorkspacesProtocol.CLEAR, produces = "application/json")
    public ResponseEntity<?> clear(HttpServletRequest request) throws java.io.IOException {
        return read(request, AccountWorkspacesProtocol.Select.class, AccountWorkspacesProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> receipt(() -> owner.clearActiveWorkspace(command.accountId(), command.groupId()))));
    }
    @PostMapping(value = AccountWorkspacesProtocol.ROSTER, produces = "application/json")
    public ResponseEntity<?> roster(HttpServletRequest request) throws java.io.IOException {
        return read(request, AccountWorkspacesProtocol.Roster.class, AccountWorkspacesProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> owner.profilesByGroup(command.accountId())));
    }
    private AccountWorkspacesProtocol.Result profile(com.raxim.myscoutee.domain.accounts.api.DiscoveryProfile value) {
        return new AccountWorkspacesProtocol.Result(true, value == null ? null : com.raxim.myscoutee.domain.accounts.dto.DiscoveryProfileDto.from(value));
    }
    private AccountWorkspacesProtocol.Receipt receipt(Runnable action) { action.run(); return new AccountWorkspacesProtocol.Receipt(true); }
    private <T> ResponseEntity<?> read(HttpServletRequest request, Class<T> type, Predicate<T> valid, Function<T, Object> action)
            throws java.io.IOException {
        try {
            byte[] bytes = ReadQueryBodies.readBytes(request, AccountWorkspacesProtocol.MAX_REQUEST_BYTES);
            T query;
            try {
                query = mapper.readerFor(type).with(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES)
                        .with(DeserializationFeature.FAIL_ON_TRAILING_TOKENS).with(DeserializationFeature.FAIL_ON_NULL_FOR_PRIMITIVES).readValue(bytes);
            } catch (RuntimeException invalid) { throw new ReadQueryBodies.RejectedQuery(400, "INVALID_REQUEST"); }
            if (!valid.test(query)) throw new ReadQueryBodies.RejectedQuery(400, "INVALID_REQUEST");
            return response(200, action.apply(query));
        } catch (ReadQueryBodies.RejectedQuery invalid) { return response(invalid.status(), new AccountWorkspacesProtocol.Error(invalid.code())); }
        catch (org.springframework.web.server.ResponseStatusException rejected) {
            return response(rejected.getStatusCode().value(), new AccountWorkspacesProtocol.Error("OWNER_REJECTED"));
        }
        catch (RuntimeException unavailable) { return response(503, new AccountWorkspacesProtocol.Error("ACCOUNT_WORKSPACES_UNAVAILABLE")); }
    }
    private ResponseEntity<?> response(int status, Object body) { return ResponseEntity.status(status).cacheControl(CacheControl.noStore()).body(body); }
}

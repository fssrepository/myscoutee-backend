package com.raxim.myscoutee.microservices.transport.accounts;

import java.util.function.Function;
import java.util.function.Predicate;
import com.raxim.myscoutee.domain.accounts.api.DiscoveryProfiles;
import com.raxim.myscoutee.microservices.transport.common.ReadQueryBodies;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import tools.jackson.databind.*;

@RestController
public final class DiscoveryProfilesEndpoint {
    private final DiscoveryProfiles owner;
    private final ObjectMapper mapper;
    public DiscoveryProfilesEndpoint(DiscoveryProfiles owner, ObjectMapper mapper) { this.owner = owner; this.mapper = mapper; }
    @PostMapping(value = DiscoveryProfilesProtocol.SINGLE, produces = "application/json")
    public ResponseEntity<?> single(HttpServletRequest request) throws java.io.IOException {
        return read(request, DiscoveryProfilesProtocol.Single.class, DiscoveryProfilesProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> new DiscoveryProfilesProtocol.Result(true, owner.findByUserId(command.id()).map(com.raxim.myscoutee.domain.accounts.dto.DiscoveryProfileDto::from).orElse(null))));
    }
    @PostMapping(value = DiscoveryProfilesProtocol.BATCH, produces = "application/json")
    public ResponseEntity<?> batch(HttpServletRequest request) throws java.io.IOException {
        return read(request, DiscoveryProfilesProtocol.Batch.class, DiscoveryProfilesProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> owner.findByUserIdIn(command.ids()).stream().map(com.raxim.myscoutee.domain.accounts.dto.DiscoveryProfileDto::from).toList()));
    }
    @PostMapping(value = DiscoveryProfilesProtocol.WORKSPACE, produces = "application/json")
    public ResponseEntity<?> workspace(HttpServletRequest request) throws java.io.IOException {
        return read(request, DiscoveryProfilesProtocol.Workspace.class, DiscoveryProfilesProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> owner.findByWorkspaceGroupIdAndAccountUserIdIn(command.groupId(), command.accounts()).stream().map(com.raxim.myscoutee.domain.accounts.dto.DiscoveryProfileDto::from).toList()));
    }
    private <T> ResponseEntity<?> read(HttpServletRequest request, Class<T> type, Predicate<T> valid, Function<T, Object> action)
            throws java.io.IOException {
        try {
            byte[] bytes = ReadQueryBodies.readBytes(request, DiscoveryProfilesProtocol.MAX_REQUEST_BYTES);
            T query;
            try {
                query = mapper.readerFor(type).with(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES)
                        .with(DeserializationFeature.FAIL_ON_TRAILING_TOKENS).with(DeserializationFeature.FAIL_ON_NULL_FOR_PRIMITIVES).readValue(bytes);
            } catch (RuntimeException invalid) { throw new ReadQueryBodies.RejectedQuery(400, "INVALID_REQUEST"); }
            if (!valid.test(query)) throw new ReadQueryBodies.RejectedQuery(400, "INVALID_REQUEST");
            return response(200, action.apply(query));
        } catch (ReadQueryBodies.RejectedQuery invalid) { return response(invalid.status(), new DiscoveryProfilesProtocol.Error(invalid.code())); }
        catch (RuntimeException unavailable) { return response(503, new DiscoveryProfilesProtocol.Error("DISCOVERY_PROFILES_UNAVAILABLE")); }
    }
    private ResponseEntity<?> response(int status, Object body) { return ResponseEntity.status(status).cacheControl(CacheControl.noStore()).body(body); }
}

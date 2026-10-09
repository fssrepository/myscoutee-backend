package com.raxim.myscoutee.microservices.transport.events;

import java.util.function.Function;
import java.util.function.Predicate;
import com.raxim.myscoutee.domain.events.api.AssetMemberships;
import com.raxim.myscoutee.microservices.transport.common.ReadQueryBodies;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import tools.jackson.databind.*;

@RestController
public final class AssetMembershipsEndpoint {
    private final AssetMemberships owner;
    private final ObjectMapper mapper;
    public AssetMembershipsEndpoint(AssetMemberships owner, ObjectMapper mapper) { this.owner = owner; this.mapper = mapper; }
    @PostMapping(value = AssetMembershipsProtocol.PROMOTE, produces = "application/json")
    public ResponseEntity<?> promote(HttpServletRequest request) throws java.io.IOException {
        return read(request, AssetMembershipsProtocol.Promote.class, AssetMembershipsProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> promoted(command)));
    }
    @PostMapping(value = AssetMembershipsProtocol.DELETE, produces = "application/json")
    public ResponseEntity<?> delete(HttpServletRequest request) throws java.io.IOException {
        return read(request, AssetMembershipsProtocol.Delete.class, AssetMembershipsProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> receipt(() -> owner.delete(command.member()))));
    }
    private AssetMembershipsProtocol.Result promoted(AssetMembershipsProtocol.Promote command) {
        var result = owner.promote(command.current(), command.assetId(), command.targetUserId(), command.actorUserId(), command.nowIso());
        return new AssetMembershipsProtocol.Result(true, result == null ? null : com.raxim.myscoutee.domain.events.dto.MemberDirectoryEntryDto.from(result));
    }
    private AssetMembershipsProtocol.Receipt receipt(Runnable action) { action.run(); return new AssetMembershipsProtocol.Receipt(true); }
    private <T> ResponseEntity<?> read(HttpServletRequest request, Class<T> type, Predicate<T> valid, Function<T, Object> action)
            throws java.io.IOException {
        try {
            byte[] bytes = ReadQueryBodies.readBytes(request, AssetMembershipsProtocol.MAX_REQUEST_BYTES);
            T query;
            try {
                query = mapper.readerFor(type).with(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES)
                        .with(DeserializationFeature.FAIL_ON_TRAILING_TOKENS).with(DeserializationFeature.FAIL_ON_NULL_FOR_PRIMITIVES).readValue(bytes);
            } catch (RuntimeException invalid) { throw new ReadQueryBodies.RejectedQuery(400, "INVALID_REQUEST"); }
            if (!valid.test(query)) throw new ReadQueryBodies.RejectedQuery(400, "INVALID_REQUEST");
            return response(200, action.apply(query));
        } catch (ReadQueryBodies.RejectedQuery invalid) { return response(invalid.status(), new AssetMembershipsProtocol.Error(invalid.code())); }
        catch (RuntimeException unavailable) { return response(503, new AssetMembershipsProtocol.Error("ASSET_MEMBERSHIPS_UNAVAILABLE")); }
    }
    private ResponseEntity<?> response(int status, Object body) { return ResponseEntity.status(status).cacheControl(CacheControl.noStore()).body(body); }
}

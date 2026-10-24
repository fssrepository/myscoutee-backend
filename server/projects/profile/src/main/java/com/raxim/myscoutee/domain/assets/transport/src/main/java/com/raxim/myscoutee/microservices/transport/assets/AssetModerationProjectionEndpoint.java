package com.raxim.myscoutee.microservices.transport.assets;

import java.util.function.Function;
import java.util.function.Predicate;
import com.raxim.myscoutee.domain.assets.api.AssetModerationProjection;
import com.raxim.myscoutee.microservices.transport.common.ReadQueryBodies;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import tools.jackson.databind.*;

@RestController
public final class AssetModerationProjectionEndpoint {
    private final AssetModerationProjection owner;
    private final ObjectMapper mapper;
    public AssetModerationProjectionEndpoint(AssetModerationProjection owner, ObjectMapper mapper) { this.owner = owner; this.mapper = mapper; }
    @PostMapping(value = AssetModerationProjectionProtocol.APPLY, produces = "application/json")
    public ResponseEntity<?> apply(HttpServletRequest request) throws java.io.IOException {
        return read(request, AssetModerationProjectionProtocol.Change.class, AssetModerationProjectionProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> receipt(() -> owner.apply(command.sourceId(), command.version(), command.status()))));
    }
    private AssetModerationProjectionProtocol.Receipt receipt(Runnable action) { action.run(); return new AssetModerationProjectionProtocol.Receipt(true); }
    private <T> ResponseEntity<?> read(HttpServletRequest request, Class<T> type, Predicate<T> valid, Function<T, Object> action)
            throws java.io.IOException {
        try {
            byte[] bytes = ReadQueryBodies.readBytes(request, AssetModerationProjectionProtocol.MAX_REQUEST_BYTES);
            T query = ReadQueryBodies.decode(bytes, mapper, type, valid, true);
            return response(200, action.apply(query));
        } catch (ReadQueryBodies.RejectedQuery invalid) { return response(invalid.status(), new AssetModerationProjectionProtocol.Error(invalid.code())); }
        catch (org.springframework.web.server.ResponseStatusException rejected) {
            return response(rejected.getStatusCode().value(), new AssetModerationProjectionProtocol.Error("OWNER_REJECTED"));
        }
        catch (RuntimeException unavailable) { return response(503, new AssetModerationProjectionProtocol.Error("ASSET_MODERATION_PROJECTION_UNAVAILABLE")); }
    }
    private ResponseEntity<?> response(int status, Object body) { return ResponseEntity.status(status).cacheControl(CacheControl.noStore()).body(body); }
}

package com.raxim.myscoutee.microservices.transport.assets;

import java.util.function.Function;
import java.util.function.Predicate;
import com.raxim.myscoutee.domain.assets.api.AssetDerivedUpdates;
import com.raxim.myscoutee.microservices.transport.common.ReadQueryBodies;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import tools.jackson.databind.*;

@RestController
public final class AssetDerivedUpdatesEndpoint {
    private final AssetDerivedUpdates owner;
    private final ObjectMapper mapper;
    public AssetDerivedUpdatesEndpoint(AssetDerivedUpdates owner, ObjectMapper mapper) { this.owner = owner; this.mapper = mapper; }
    @PostMapping(value = AssetDerivedUpdatesProtocol.AFFINITY, produces = "application/json")
    public ResponseEntity<?> affinity(HttpServletRequest request) throws java.io.IOException {
        return read(request, AssetDerivedUpdatesProtocol.AffinityCommand.class, AssetDerivedUpdatesProtocol::valid,
                command -> new AssetDerivedUpdatesProtocol.Result(owner.updateAffinityVersion(command.version(), command.affinity(), command.boost())));
    }
    @PostMapping(value = AssetDerivedUpdatesProtocol.STATUS, produces = "application/json")
    public ResponseEntity<?> status(HttpServletRequest request) throws java.io.IOException {
        return read(request, AssetDerivedUpdatesProtocol.StatusCommand.class, AssetDerivedUpdatesProtocol::valid,
                command -> new AssetDerivedUpdatesProtocol.Result(owner.updateStatusVersionIfCurrent(command.version(), command.status(), command.previousStatus())));
    }
    private <T> ResponseEntity<?> read(HttpServletRequest request, Class<T> type, Predicate<T> valid, Function<T, Object> action)
            throws java.io.IOException {
        try {
            byte[] bytes = ReadQueryBodies.readBytes(request, AssetDerivedUpdatesProtocol.MAX_REQUEST_BYTES);
            T query = ReadQueryBodies.decode(bytes, mapper, type, valid, false);
            return response(200, action.apply(query));
        } catch (ReadQueryBodies.RejectedQuery invalid) { return response(invalid.status(), new AssetDerivedUpdatesProtocol.Error(invalid.code())); }
        catch (RuntimeException unavailable) { return response(503, new AssetDerivedUpdatesProtocol.Error("ASSET_UPDATE_OUTCOME_UNKNOWN")); }
    }
    private ResponseEntity<?> response(int status, Object body) { return ResponseEntity.status(status).cacheControl(CacheControl.noStore()).body(body); }
}

package com.raxim.myscoutee.microservices.transport.accounts;

import java.util.function.Function;
import java.util.function.Predicate;
import com.raxim.myscoutee.domain.accounts.api.AssetProfiles;
import com.raxim.myscoutee.domain.accounts.dto.AssetProfileDto;
import com.raxim.myscoutee.microservices.transport.common.ReadQueryBodies;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import tools.jackson.databind.*;

@RestController
public final class AssetProfilesEndpoint {
    private final AssetProfiles owner;
    private final ObjectMapper mapper;
    public AssetProfilesEndpoint(AssetProfiles owner, ObjectMapper mapper) { this.owner = owner; this.mapper = mapper; }
    @PostMapping(value = AssetProfilesProtocol.SINGLE, produces = "application/json")
    public ResponseEntity<?> single(HttpServletRequest request) throws java.io.IOException {
        return read(request, AssetProfilesProtocol.SingleQuery.class, AssetProfilesProtocol::valid,
                query -> new AssetProfilesProtocol.SingleResult(true, owner.findByUserId(query.userId()).map(AssetProfileDto::from).orElse(null)));
    }
    @PostMapping(value = AssetProfilesProtocol.BATCH, produces = "application/json")
    public ResponseEntity<?> batch(HttpServletRequest request) throws java.io.IOException {
        return read(request, AssetProfilesProtocol.BatchQuery.class, AssetProfilesProtocol::valid,
                query -> owner.findByUserIdIn(query.userIds()).stream().map(AssetProfileDto::from).toList());
    }
    @PostMapping(value = AssetProfilesProtocol.ACCOUNT, produces = "application/json")
    public ResponseEntity<?> account(HttpServletRequest request) throws java.io.IOException {
        return read(request, AssetProfilesProtocol.SingleQuery.class, AssetProfilesProtocol::valid,
                query -> owner.findByAccountUserId(query.userId()).stream().map(AssetProfileDto::from).toList());
    }
    private <T> ResponseEntity<?> read(HttpServletRequest request, Class<T> type, Predicate<T> valid, Function<T, Object> action)
            throws java.io.IOException {
        try {
            byte[] bytes = ReadQueryBodies.readBytes(request, AssetProfilesProtocol.MAX_REQUEST_BYTES);
            T query = ReadQueryBodies.decode(bytes, mapper, type, valid, false);
            return response(200, action.apply(query));
        } catch (ReadQueryBodies.RejectedQuery invalid) { return response(invalid.status(), new AssetProfilesProtocol.Error(invalid.code())); }
        catch (RuntimeException unavailable) { return response(503, new AssetProfilesProtocol.Error("ASSET_PROFILES_UNAVAILABLE")); }
    }
    private ResponseEntity<?> response(int status, Object body) { return ResponseEntity.status(status).cacheControl(CacheControl.noStore()).body(body); }
}

package com.raxim.myscoutee.microservices.transport.assets;

import com.raxim.myscoutee.microservices.transport.common.ProtocolFields;

import java.util.function.Function;
import java.util.function.Predicate;
import com.raxim.myscoutee.domain.assets.api.AssetPrivacy;
import com.raxim.myscoutee.microservices.transport.common.ReadQueryBodies;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import tools.jackson.databind.*;

@RestController
public final class AssetPrivacyEndpoint {
    private final AssetPrivacy owner;
    private final ObjectMapper mapper;
    public AssetPrivacyEndpoint(AssetPrivacy owner, ObjectMapper mapper) { this.owner = owner; this.mapper = mapper; }
    @PostMapping(value = AssetPrivacyProtocol.PURGE_REMAINING_ASSET_REQUESTS, produces = "application/json")
    public ResponseEntity<?> purgeRemainingAssetRequests(HttpServletRequest request) throws java.io.IOException {
        return read(request, ProtocolFields.UserCommand.class, AssetPrivacyProtocol::valid,
                command -> com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(),
                        () -> { owner.purgeRemainingAssetRequests(command.userId()); return new ProtocolFields.Receipt(true); }));
    }
    @PostMapping(value = AssetPrivacyProtocol.PURGE_OWNED_MEDIA, produces = "application/json")
    public ResponseEntity<?> purgeOwnedMedia(HttpServletRequest request) throws java.io.IOException {
        return read(request, com.raxim.myscoutee.microservices.transport.common.ProtocolFields.IdsCommand.class, AssetPrivacyProtocol::valid,
                command -> com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(),
                        () -> { owner.purgeOwnedMedia(command.ids()); return new ProtocolFields.Receipt(true); }));
    }
    @PostMapping(value = AssetPrivacyProtocol.DELETE_OWNED_RECORDS, produces = "application/json")
    public ResponseEntity<?> deleteOwnedRecords(HttpServletRequest request) throws java.io.IOException {
        return read(request, com.raxim.myscoutee.microservices.transport.common.ProtocolFields.IdsCommand.class, AssetPrivacyProtocol::valid,
                command -> com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(),
                        () -> { owner.deleteOwnedRecords(command.ids()); return new ProtocolFields.Receipt(true); }));
    }
    private <T> ResponseEntity<?> read(HttpServletRequest request, Class<T> type, Predicate<T> valid, Function<T, Object> action)
            throws java.io.IOException {
        try {
            byte[] bytes = ReadQueryBodies.readBytes(request, AssetPrivacyProtocol.MAX_REQUEST_BYTES);
            T query = ReadQueryBodies.decode(bytes, mapper, type, valid, true);
            return response(200, action.apply(query));
        } catch (ReadQueryBodies.RejectedQuery invalid) { return response(invalid.status(), new ProtocolFields.Error(invalid.code())); }
        catch (RuntimeException unavailable) { return response(503, new ProtocolFields.Error("PURGE_OUTCOME_UNKNOWN")); }
    }
    private ResponseEntity<?> response(int status, Object body) { return ResponseEntity.status(status).cacheControl(CacheControl.noStore()).body(body); }
}

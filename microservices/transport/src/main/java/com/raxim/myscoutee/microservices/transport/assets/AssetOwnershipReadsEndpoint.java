package com.raxim.myscoutee.microservices.transport.assets;

import java.util.function.Function;
import java.util.function.Predicate;
import com.raxim.myscoutee.domain.assets.api.AssetOwnershipReads;
import com.raxim.myscoutee.domain.assets.dto.AssetOwnershipDto;
import com.raxim.myscoutee.microservices.transport.common.ReadQueryBodies;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import tools.jackson.databind.*;

@RestController
public final class AssetOwnershipReadsEndpoint {
    private final AssetOwnershipReads owner;
    private final ObjectMapper mapper;
    public AssetOwnershipReadsEndpoint(AssetOwnershipReads owner, ObjectMapper mapper) { this.owner = owner; this.mapper = mapper; }
    @PostMapping(value = AssetOwnershipReadsProtocol.BY_ID, produces = "application/json")
    public ResponseEntity<?> findById(HttpServletRequest request) throws java.io.IOException {
        return read(request, AssetOwnershipReadsProtocol.IdQuery.class, AssetOwnershipReadsProtocol::valid,
                query -> new AssetOwnershipReadsProtocol.SingleResult(true, owner.findById(query.id()).map(AssetOwnershipDto::from).orElse(null)));
    }
    @PostMapping(value = AssetOwnershipReadsProtocol.BY_ASSET_ID, produces = "application/json")
    public ResponseEntity<?> findByAssetId(HttpServletRequest request) throws java.io.IOException {
        return read(request, AssetOwnershipReadsProtocol.IdQuery.class, AssetOwnershipReadsProtocol::valid,
                query -> new AssetOwnershipReadsProtocol.SingleResult(true, owner.findByAssetId(query.id()).map(AssetOwnershipDto::from).orElse(null)));
    }
    @PostMapping(value = AssetOwnershipReadsProtocol.BY_OWNER, produces = "application/json")
    public ResponseEntity<?> findByOwnerUserId(HttpServletRequest request) throws java.io.IOException {
        return read(request, AssetOwnershipReadsProtocol.IdQuery.class, AssetOwnershipReadsProtocol::valid,
                query -> owner.findByOwnerUserId(query.id()).stream().map(AssetOwnershipDto::from).toList());
    }
    @PostMapping(value = AssetOwnershipReadsProtocol.ALL, produces = "application/json")
    public ResponseEntity<?> findAll(HttpServletRequest request) throws java.io.IOException {
        return read(request, AssetOwnershipReadsProtocol.EmptyQuery.class, AssetOwnershipReadsProtocol::valid,
                query -> owner.findAll().stream().map(AssetOwnershipDto::from).toList());
    }
    @PostMapping(value = AssetOwnershipReadsProtocol.BY_ASSET_IDS, produces = "application/json")
    public ResponseEntity<?> findByAssetIdIn(HttpServletRequest request) throws java.io.IOException {
        return read(request, AssetOwnershipReadsProtocol.IdsQuery.class, AssetOwnershipReadsProtocol::valid,
                query -> owner.findByAssetIdIn(query.ids()).stream().map(AssetOwnershipDto::from).toList());
    }
    @PostMapping(value = AssetOwnershipReadsProtocol.OWNED, produces = "application/json")
    public ResponseEntity<?> findByOwnerUserIdAndAssetId(HttpServletRequest request) throws java.io.IOException {
        return read(request, AssetOwnershipReadsProtocol.OwnedQuery.class, AssetOwnershipReadsProtocol::valid,
                query -> new AssetOwnershipReadsProtocol.SingleResult(true, owner.findByOwnerUserIdAndAssetId(query.owner(), query.id()).map(AssetOwnershipDto::from).orElse(null)));
    }
    @PostMapping(value = AssetOwnershipReadsProtocol.OWNER_UPDATED, produces = "application/json")
    public ResponseEntity<?> findByOwnerUserIdOrderByUpdatedDateDesc(HttpServletRequest request) throws java.io.IOException {
        return read(request, AssetOwnershipReadsProtocol.IdQuery.class, AssetOwnershipReadsProtocol::valid,
                query -> owner.findByOwnerUserIdOrderByUpdatedDateDesc(query.id()).stream().map(AssetOwnershipDto::from).toList());
    }
    @PostMapping(value = AssetOwnershipReadsProtocol.ID_OR_ASSET_ID, produces = "application/json")
    public ResponseEntity<?> findByIdOrAssetId(HttpServletRequest request) throws java.io.IOException {
        return read(request, AssetOwnershipReadsProtocol.IdQuery.class, AssetOwnershipReadsProtocol::valid,
                query -> new AssetOwnershipReadsProtocol.SingleResult(true, AssetOwnershipDto.from(owner.findByIdOrAssetId(query.id()))));
    }
    @PostMapping(value = AssetOwnershipReadsProtocol.FIRST_ASSET_ID, produces = "application/json")
    public ResponseEntity<?> findFirstByAssetId(HttpServletRequest request) throws java.io.IOException {
        return read(request, AssetOwnershipReadsProtocol.IdQuery.class, AssetOwnershipReadsProtocol::valid,
                query -> new AssetOwnershipReadsProtocol.SingleResult(true, AssetOwnershipDto.from(owner.findFirstByAssetId(query.id()))));
    }
    @PostMapping(value = AssetOwnershipReadsProtocol.OWNERS_AND_IDS, produces = "application/json")
    public ResponseEntity<?> findByOwnersAndIds(HttpServletRequest request) throws java.io.IOException {
        return read(request, AssetOwnershipReadsProtocol.OwnersIdsQuery.class, AssetOwnershipReadsProtocol::valid,
                query -> owner.findByOwnersAndIds(query.owners(), query.ids()).stream().map(AssetOwnershipDto::from).toList());
    }
    @PostMapping(value = AssetOwnershipReadsProtocol.OWNED_EXISTS, produces = "application/json")
    public ResponseEntity<?> ownedExists(HttpServletRequest request) throws java.io.IOException {
        return read(request, AssetOwnershipReadsProtocol.OwnedQuery.class, AssetOwnershipReadsProtocol::valid,
                query -> new AssetOwnershipReadsProtocol.Decision(owner.ownedExists(query.owner(), query.id())));
    }
    private <T> ResponseEntity<?> read(HttpServletRequest request, Class<T> type, Predicate<T> valid, Function<T, Object> action)
            throws java.io.IOException {
        try {
            byte[] bytes = ReadQueryBodies.readBytes(request, AssetOwnershipReadsProtocol.MAX_REQUEST_BYTES);
            T query;
            try {
                query = mapper.readerFor(type).with(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES)
                        .with(DeserializationFeature.FAIL_ON_TRAILING_TOKENS).readValue(bytes);
            } catch (RuntimeException invalid) { throw new ReadQueryBodies.RejectedQuery(400, "INVALID_REQUEST"); }
            if (!valid.test(query)) throw new ReadQueryBodies.RejectedQuery(400, "INVALID_REQUEST");
            return response(200, action.apply(query));
        } catch (ReadQueryBodies.RejectedQuery invalid) { return response(invalid.status(), new AssetOwnershipReadsProtocol.Error(invalid.code())); }
        catch (RuntimeException unavailable) { return response(503, new AssetOwnershipReadsProtocol.Error("ASSET_READ_UNAVAILABLE")); }
    }
    private ResponseEntity<?> response(int status, Object body) { return ResponseEntity.status(status).cacheControl(CacheControl.noStore()).body(body); }
}

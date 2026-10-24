package com.raxim.myscoutee.microservices.transport.events;

import java.io.IOException;
import java.util.List;
import java.util.function.Supplier;
import com.raxim.myscoutee.domain.events.api.MemberDirectory;
import com.raxim.myscoutee.domain.events.dto.MemberDirectoryEntryDto;
import com.raxim.myscoutee.domain.events.dto.MemberDirectoryPageDto;
import com.raxim.myscoutee.microservices.transport.common.ReadQueryBodies.RejectedQuery;
import com.raxim.myscoutee.microservices.transport.events.MemberDirectoryProtocol.Error;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.CacheControl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tools.jackson.databind.ObjectMapper;

@RestController
public final class MemberDirectoryEndpoint {
    private final MemberDirectory members;
    private final ObjectMapper mapper;
    public MemberDirectoryEndpoint(MemberDirectory members, ObjectMapper mapper) { this.members = members; this.mapper = mapper; }
    @GetMapping(value = MemberDirectoryProtocol.ENTRY, produces = "application/json")
    public ResponseEntity<?> entry(@RequestParam(required = false) String ownerType,
            @RequestParam(required = false) String ownerId, @RequestParam(required = false) String userId) {
        return read(() -> members.findByOwnerTypeAndOwnerIdAndUserId(ownerType, ownerId, userId)
                .map(MemberDirectoryEntryDto::from).orElse(null), ownerType, ownerId, userId);
    }
    @GetMapping(value = MemberDirectoryProtocol.OWNER, produces = "application/json")
    public ResponseEntity<?> owner(@RequestParam(required = false) String ownerType, @RequestParam(required = false) String ownerId) {
        return read(() -> entries(members.findByOwnerTypeAndOwnerId(ownerType, ownerId)), ownerType, ownerId);
    }
    @GetMapping(value = MemberDirectoryProtocol.USER, produces = "application/json")
    public ResponseEntity<?> user(@RequestParam(required = false) String ownerType, @RequestParam(required = false) String userId) {
        return read(() -> entries(members.findByOwnerTypeAndUserId(ownerType, userId)), ownerType, userId);
    }
    @GetMapping(value = MemberDirectoryProtocol.ALL, produces = "application/json")
    public ResponseEntity<?> all() { return read(() -> entries(members.findAll())); }
    @GetMapping(value = MemberDirectoryProtocol.VIP, produces = "application/json")
    public ResponseEntity<?> vip(@RequestParam(required = false) String sourceId, @RequestParam(required = false) String userId) {
        return read(() -> members.vipPricingOffer(sourceId, userId), sourceId, userId);
    }
    @GetMapping(value = MemberDirectoryProtocol.PAGE, produces = "application/json")
    public ResponseEntity<?> page(@RequestParam(required = false) String ownerType,
            @RequestParam(required = false) String ownerId, @RequestParam(required = false) String status,
            @RequestParam(required = false) String offset, @RequestParam(required = false) String limit) {
        final int start, size;
        try { start = Integer.parseInt(offset); size = Integer.parseInt(limit); }
        catch (NumberFormatException invalid) { return response(400, new Error("INVALID_REQUEST")); }
        if (!MemberDirectoryProtocol.validPage(start, size)) return response(400, new Error("INVALID_REQUEST"));
        return read(() -> {
            var page = members.pageByOwnerAndStatus(ownerType, ownerId, status, start, size);
            return new MemberDirectoryPageDto(page.total(), entries(page.items()));
        }, ownerType, ownerId, status);
    }
    @PostMapping(value = MemberDirectoryProtocol.OWNERS, produces = "application/json")
    public ResponseEntity<?> owners(HttpServletRequest request) throws IOException {
        try {
            var query = mapper.treeToValue(MemberDirectoryProtocol.read(request, mapper, false), MemberDirectoryProtocol.OwnerQuery.class);
            return read(() -> entries(members.findByOwnerTypeAndOwnerIdIn(query.ownerType(), query.ownerIds())));
        } catch (RejectedQuery invalid) { return response(invalid.status(), new Error(invalid.code())); }
    }
    @PostMapping(value = MemberDirectoryProtocol.ACCEPTED, produces = "application/json")
    public ResponseEntity<?> accepted(HttpServletRequest request) throws IOException {
        try {
            var query = mapper.treeToValue(MemberDirectoryProtocol.read(request, mapper, true), MemberDirectoryProtocol.AcceptedQuery.class);
            return read(() -> entries(members.findAcceptedByOwnerTypeOwnerIdInAndUserId(query.ownerType(), query.ownerIds(), query.userId(), query.status())));
        } catch (RejectedQuery invalid) { return response(invalid.status(), new Error(invalid.code())); }
    }
    private static List<MemberDirectoryEntryDto> entries(List<? extends MemberDirectory.Member> members) {
        return members.stream().map(MemberDirectoryEntryDto::from).toList();
    }
    private ResponseEntity<?> read(Supplier<?> action, String... ids) {
        if (!MemberDirectoryProtocol.validIds(ids)) return response(400, new Error("INVALID_REQUEST"));
        try {
            var value = action.get();
            return value == null ? response(404, new Error("NOT_FOUND")) : response(200, value);
        } catch (RuntimeException unavailable) { return response(503, new Error("MEMBER_DIRECTORY_UNAVAILABLE")); }
    }
    private ResponseEntity<?> response(int status, Object body) {
        return ResponseEntity.status(status).cacheControl(CacheControl.noStore()).body(body);
    }
}

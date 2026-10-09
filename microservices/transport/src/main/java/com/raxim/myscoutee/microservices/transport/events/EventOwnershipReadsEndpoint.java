package com.raxim.myscoutee.microservices.transport.events;

import java.util.function.Function;
import java.util.function.Predicate;
import com.raxim.myscoutee.domain.events.api.EventOwnershipReads;
import com.raxim.myscoutee.domain.events.dto.EventOwnershipDto;
import com.raxim.myscoutee.microservices.transport.common.ReadQueryBodies;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import tools.jackson.databind.*;

@RestController
public final class EventOwnershipReadsEndpoint {
    private final EventOwnershipReads owner;
    private final ObjectMapper mapper;
    public EventOwnershipReadsEndpoint(EventOwnershipReads owner, ObjectMapper mapper) { this.owner = owner; this.mapper = mapper; }
    @PostMapping(value = EventOwnershipReadsProtocol.OWNED, produces = "application/json")
    public ResponseEntity<?> findByOwnerUserIdAndSourceId(HttpServletRequest request) throws java.io.IOException {
        return read(request, EventOwnershipReadsProtocol.OwnedQuery.class, EventOwnershipReadsProtocol::valid,
                query -> new EventOwnershipReadsProtocol.SingleResult(true, owner.findByOwnerUserIdAndSourceId(query.owner(), query.id()).map(EventOwnershipDto::from).orElse(null)));
    }
    @PostMapping(value = EventOwnershipReadsProtocol.OWNED_EXISTS, produces = "application/json")
    public ResponseEntity<?> ownedExists(HttpServletRequest request) throws java.io.IOException {
        return read(request, EventOwnershipReadsProtocol.OwnedQuery.class, EventOwnershipReadsProtocol::valid,
                query -> new EventOwnershipReadsProtocol.Decision(owner.ownedExists(query.owner(), query.id())));
    }
    @PostMapping(value = EventOwnershipReadsProtocol.STORED_FAMILY, produces = "application/json")
    public ResponseEntity<?> findStoredFamilyBySourceId(HttpServletRequest request) throws java.io.IOException {
        return read(request, EventOwnershipReadsProtocol.IdQuery.class, EventOwnershipReadsProtocol::valid,
                query -> owner.findStoredFamilyBySourceId(query.id()).stream().map(EventOwnershipDto::from).toList());
    }
    @PostMapping(value = EventOwnershipReadsProtocol.BY_ID, produces = "application/json")
    public ResponseEntity<?> findById(HttpServletRequest request) throws java.io.IOException {
        return read(request, EventOwnershipReadsProtocol.IdQuery.class, EventOwnershipReadsProtocol::valid,
                query -> new EventOwnershipReadsProtocol.SingleResult(true, owner.findById(query.id()).map(EventOwnershipDto::from).orElse(null)));
    }
    @PostMapping(value = EventOwnershipReadsProtocol.BY_SOURCE_IDS, produces = "application/json")
    public ResponseEntity<?> findBySourceIdIn(HttpServletRequest request) throws java.io.IOException {
        return read(request, EventOwnershipReadsProtocol.IdsQuery.class, EventOwnershipReadsProtocol::valid,
                query -> owner.findBySourceIdIn(query.ids()).stream().map(EventOwnershipDto::from).toList());
    }
    @PostMapping(value = EventOwnershipReadsProtocol.BY_CREATOR, produces = "application/json")
    public ResponseEntity<?> findByCreatorUserId(HttpServletRequest request) throws java.io.IOException {
        return read(request, EventOwnershipReadsProtocol.IdQuery.class, EventOwnershipReadsProtocol::valid,
                query -> owner.findByCreatorUserId(query.id()).stream().map(EventOwnershipDto::from).toList());
    }
    @PostMapping(value = EventOwnershipReadsProtocol.ALL, produces = "application/json")
    public ResponseEntity<?> findAll(HttpServletRequest request) throws java.io.IOException {
        return read(request, EventOwnershipReadsProtocol.EmptyQuery.class, EventOwnershipReadsProtocol::valid,
                query -> owner.findAll().stream().map(EventOwnershipDto::from).toList());
    }
    @PostMapping(value = EventOwnershipReadsProtocol.BY_SOURCE_ID, produces = "application/json")
    public ResponseEntity<?> findBySourceId(HttpServletRequest request) throws java.io.IOException {
        return read(request, EventOwnershipReadsProtocol.IdQuery.class, EventOwnershipReadsProtocol::valid,
                query -> owner.findBySourceId(query.id()).stream().map(EventOwnershipDto::from).toList());
    }
    @PostMapping(value = EventOwnershipReadsProtocol.ID_OR_SOURCE_ID, produces = "application/json")
    public ResponseEntity<?> findByIdOrSourceId(HttpServletRequest request) throws java.io.IOException {
        return read(request, EventOwnershipReadsProtocol.IdQuery.class, EventOwnershipReadsProtocol::valid,
                query -> new EventOwnershipReadsProtocol.SingleResult(true, EventOwnershipDto.from(owner.findByIdOrSourceId(query.id()))));
    }
    @PostMapping(value = EventOwnershipReadsProtocol.CHAT_NAVIGATION, produces = "application/json")
    public ResponseEntity<?> chatNavigationEvents(HttpServletRequest request) throws java.io.IOException {
        return read(request, EventOwnershipReadsProtocol.IdsQuery.class, EventOwnershipReadsProtocol::valid,
                query -> owner.chatNavigationEvents(query.ids()).stream().map(EventOwnershipDto::from).toList());
    }
    @PostMapping(value = EventOwnershipReadsProtocol.DIRECT_OWNER, produces = "application/json")
    public ResponseEntity<?> findDirectOwnerEvents(HttpServletRequest request) throws java.io.IOException {
        return read(request, EventOwnershipReadsProtocol.IdQuery.class, EventOwnershipReadsProtocol::valid,
                query -> owner.findDirectOwnerEvents(query.id()).stream().map(EventOwnershipDto::from).toList());
    }
    @PostMapping(value = EventOwnershipReadsProtocol.ADMIN_VISIBLE, produces = "application/json")
    public ResponseEntity<?> findAdminVisibleEvents(HttpServletRequest request) throws java.io.IOException {
        return read(request, EventOwnershipReadsProtocol.IdQuery.class, EventOwnershipReadsProtocol::valid,
                query -> owner.findAdminVisibleEvents(query.id()).stream().map(EventOwnershipDto::from).toList());
    }
    @PostMapping(value = EventOwnershipReadsProtocol.ACCEPTED_MEMBERSHIP, produces = "application/json")
    public ResponseEntity<?> findAcceptedMembershipEvents(HttpServletRequest request) throws java.io.IOException {
        return read(request, EventOwnershipReadsProtocol.IdQuery.class, EventOwnershipReadsProtocol::valid,
                query -> owner.findAcceptedMembershipEvents(query.id()).stream().map(EventOwnershipDto::from).toList());
    }
    @PostMapping(value = EventOwnershipReadsProtocol.ACTIVE_INVITATION, produces = "application/json")
    public ResponseEntity<?> findActiveInvitationEvents(HttpServletRequest request) throws java.io.IOException {
        return read(request, EventOwnershipReadsProtocol.IdQuery.class, EventOwnershipReadsProtocol::valid,
                query -> owner.findActiveInvitationEvents(query.id()).stream().map(EventOwnershipDto::from).toList());
    }
    @PostMapping(value = EventOwnershipReadsProtocol.PENDING_REQUEST, produces = "application/json")
    public ResponseEntity<?> findPendingRequestEvents(HttpServletRequest request) throws java.io.IOException {
        return read(request, EventOwnershipReadsProtocol.IdQuery.class, EventOwnershipReadsProtocol::valid,
                query -> owner.findPendingRequestEvents(query.id()).stream().map(EventOwnershipDto::from).toList());
    }
    @PostMapping(value = EventOwnershipReadsProtocol.BY_OWNER, produces = "application/json")
    public ResponseEntity<?> findByOwnerUserId(HttpServletRequest request) throws java.io.IOException {
        return read(request, EventOwnershipReadsProtocol.IdQuery.class, EventOwnershipReadsProtocol::valid,
                query -> owner.findByOwnerUserId(query.id()).stream().map(EventOwnershipDto::from).toList());
    }
    @PostMapping(value = EventOwnershipReadsProtocol.BY_ADMIN, produces = "application/json")
    public ResponseEntity<?> findByAdminsContaining(HttpServletRequest request) throws java.io.IOException {
        return read(request, EventOwnershipReadsProtocol.IdQuery.class, EventOwnershipReadsProtocol::valid,
                query -> owner.findByAdminsContaining(query.id()).stream().map(EventOwnershipDto::from).toList());
    }
    @PostMapping(value = EventOwnershipReadsProtocol.HOME_GAME_MEMBERS, produces = "application/json")
    public ResponseEntity<?> findHomeGameMemberProjections(HttpServletRequest request) throws java.io.IOException {
        return read(request, EventOwnershipReadsProtocol.EmptyQuery.class, EventOwnershipReadsProtocol::valid,
                query -> owner.findHomeGameMemberProjections().stream().map(EventOwnershipDto::from).toList());
    }
    @PostMapping(value = EventOwnershipReadsProtocol.ACTIVE_ORIGINALS, produces = "application/json")
    public ResponseEntity<?> activeOriginalEventsByCreators(HttpServletRequest request) throws java.io.IOException {
        return read(request, EventOwnershipReadsProtocol.IdsQuery.class, EventOwnershipReadsProtocol::valid,
                query -> owner.activeOriginalEventsByCreators(query.ids()).stream().map(EventOwnershipDto::from).toList());
    }
    @PostMapping(value = EventOwnershipReadsProtocol.STORED_SOURCES, produces = "application/json")
    public ResponseEntity<?> storedEventsBySources(HttpServletRequest request) throws java.io.IOException {
        return read(request, EventOwnershipReadsProtocol.IdsQuery.class, EventOwnershipReadsProtocol::valid,
                query -> owner.storedEventsBySources(query.ids()).stream().map(EventOwnershipDto::from).toList());
    }
    private <T> ResponseEntity<?> read(HttpServletRequest request, Class<T> type, Predicate<T> valid, Function<T, Object> action)
            throws java.io.IOException {
        try {
            byte[] bytes = ReadQueryBodies.readBytes(request, EventOwnershipReadsProtocol.MAX_REQUEST_BYTES);
            T query;
            try {
                query = mapper.readerFor(type).with(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES)
                        .with(DeserializationFeature.FAIL_ON_TRAILING_TOKENS).readValue(bytes);
            } catch (RuntimeException invalid) { throw new ReadQueryBodies.RejectedQuery(400, "INVALID_REQUEST"); }
            if (!valid.test(query)) throw new ReadQueryBodies.RejectedQuery(400, "INVALID_REQUEST");
            return response(200, action.apply(query));
        } catch (ReadQueryBodies.RejectedQuery invalid) { return response(invalid.status(), new EventOwnershipReadsProtocol.Error(invalid.code())); }
        catch (RuntimeException unavailable) { return response(503, new EventOwnershipReadsProtocol.Error("EVENT_READ_UNAVAILABLE")); }
    }
    private ResponseEntity<?> response(int status, Object body) { return ResponseEntity.status(status).cacheControl(CacheControl.noStore()).body(body); }
}

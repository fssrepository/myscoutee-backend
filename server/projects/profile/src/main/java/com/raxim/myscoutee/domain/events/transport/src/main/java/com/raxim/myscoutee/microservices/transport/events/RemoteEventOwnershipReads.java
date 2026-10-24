package com.raxim.myscoutee.microservices.transport.events;

import java.net.URI;
import java.time.Duration;
import java.util.*;
import com.raxim.myscoutee.domain.events.api.EventOwnershipReads;
import com.raxim.myscoutee.domain.events.dto.EventOwnershipDto;
import com.raxim.myscoutee.microservices.transport.common.RemoteReadTransport;
import io.micrometer.core.instrument.MeterRegistry;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

public final class RemoteEventOwnershipReads extends RemoteReadTransport implements EventOwnershipReads {
    private final ObjectMapper mapper;
    public RemoteEventOwnershipReads(URI origin, String token, boolean allowHttp, Duration connectTimeout,
            Duration requestTimeout, ObjectMapper mapper, MeterRegistry metrics) {
        super(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics); this.mapper = mapper;
    }
    @Override public Optional<EventOwnershipDto> findByOwnerUserIdAndSourceId(String owner, String id) {
        var query = new EventOwnershipReadsProtocol.OwnedQuery(owner, id);
        if (!EventOwnershipReadsProtocol.valid(query)) throw new IllegalArgumentException("Invalid event read");
        byte[] bytes = mapper.writeValueAsBytes(query);
        if (bytes.length > EventOwnershipReadsProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("Event read exceeds byte limit");
        var result = exchange(EventOwnershipReadsProtocol.OWNED, bytes, new TypeReference<EventOwnershipReadsProtocol.SingleResult>() {},
                "event-ownership.owned", EventOwnershipReadsProtocol.MAX_RESPONSE_BYTES, value -> Boolean.TRUE.equals(value.resolved()));
        return Optional.ofNullable(result.value());
    }
    @Override public boolean ownedExists(String owner, String id) {
        var query = new EventOwnershipReadsProtocol.OwnedQuery(owner, id);
        if (!EventOwnershipReadsProtocol.valid(query)) throw new IllegalArgumentException("Invalid event read");
        byte[] bytes = mapper.writeValueAsBytes(query);
        if (bytes.length > EventOwnershipReadsProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("Event read exceeds byte limit");
        var result = exchange(EventOwnershipReadsProtocol.OWNED_EXISTS, bytes, new TypeReference<EventOwnershipReadsProtocol.Decision>() {},
                "event-ownership.owned-exists", EventOwnershipReadsProtocol.MAX_RESPONSE_BYTES, value -> value.value() != null);
        return result.value();
    }
    @Override public List<EventOwnershipDto> findStoredFamilyBySourceId(String id) {
        var query = new EventOwnershipReadsProtocol.IdQuery(id);
        if (!EventOwnershipReadsProtocol.valid(query)) throw new IllegalArgumentException("Invalid event read");
        byte[] bytes = mapper.writeValueAsBytes(query);
        if (bytes.length > EventOwnershipReadsProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("Event read exceeds byte limit");
        var result = exchange(EventOwnershipReadsProtocol.STORED_FAMILY, bytes, new TypeReference<List<EventOwnershipDto>>() {},
                "event-ownership.stored-family", EventOwnershipReadsProtocol.MAX_RESPONSE_BYTES, value -> true);
        return result;
    }
    @Override public Optional<EventOwnershipDto> findById(String id) {
        var query = new EventOwnershipReadsProtocol.IdQuery(id);
        if (!EventOwnershipReadsProtocol.valid(query)) throw new IllegalArgumentException("Invalid event read");
        byte[] bytes = mapper.writeValueAsBytes(query);
        if (bytes.length > EventOwnershipReadsProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("Event read exceeds byte limit");
        var result = exchange(EventOwnershipReadsProtocol.BY_ID, bytes, new TypeReference<EventOwnershipReadsProtocol.SingleResult>() {},
                "event-ownership.by-id", EventOwnershipReadsProtocol.MAX_RESPONSE_BYTES, value -> Boolean.TRUE.equals(value.resolved()));
        return Optional.ofNullable(result.value());
    }
    @Override public List<EventOwnershipDto> findBySourceIdIn(Collection<String> ids) {
        var query = new EventOwnershipReadsProtocol.IdsQuery(ids);
        if (!EventOwnershipReadsProtocol.valid(query)) throw new IllegalArgumentException("Invalid event read");
        byte[] bytes = mapper.writeValueAsBytes(query);
        if (bytes.length > EventOwnershipReadsProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("Event read exceeds byte limit");
        var result = exchange(EventOwnershipReadsProtocol.BY_SOURCE_IDS, bytes, new TypeReference<List<EventOwnershipDto>>() {},
                "event-ownership.by-source-ids", EventOwnershipReadsProtocol.MAX_RESPONSE_BYTES, value -> true);
        return result;
    }
    @Override public List<EventOwnershipDto> findByCreatorUserId(String id) {
        var query = new EventOwnershipReadsProtocol.IdQuery(id);
        if (!EventOwnershipReadsProtocol.valid(query)) throw new IllegalArgumentException("Invalid event read");
        byte[] bytes = mapper.writeValueAsBytes(query);
        if (bytes.length > EventOwnershipReadsProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("Event read exceeds byte limit");
        var result = exchange(EventOwnershipReadsProtocol.BY_CREATOR, bytes, new TypeReference<List<EventOwnershipDto>>() {},
                "event-ownership.by-creator", EventOwnershipReadsProtocol.MAX_RESPONSE_BYTES, value -> true);
        return result;
    }
    @Override public List<EventOwnershipDto> findAll() {
        var query = new EventOwnershipReadsProtocol.EmptyQuery();
        if (!EventOwnershipReadsProtocol.valid(query)) throw new IllegalArgumentException("Invalid event read");
        byte[] bytes = mapper.writeValueAsBytes(query);
        if (bytes.length > EventOwnershipReadsProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("Event read exceeds byte limit");
        var result = exchange(EventOwnershipReadsProtocol.ALL, bytes, new TypeReference<List<EventOwnershipDto>>() {},
                "event-ownership.all", EventOwnershipReadsProtocol.MAX_RESPONSE_BYTES, value -> true);
        return result;
    }
    @Override public List<EventOwnershipDto> findBySourceId(String id) {
        var query = new EventOwnershipReadsProtocol.IdQuery(id);
        if (!EventOwnershipReadsProtocol.valid(query)) throw new IllegalArgumentException("Invalid event read");
        byte[] bytes = mapper.writeValueAsBytes(query);
        if (bytes.length > EventOwnershipReadsProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("Event read exceeds byte limit");
        var result = exchange(EventOwnershipReadsProtocol.BY_SOURCE_ID, bytes, new TypeReference<List<EventOwnershipDto>>() {},
                "event-ownership.by-source-id", EventOwnershipReadsProtocol.MAX_RESPONSE_BYTES, value -> true);
        return result;
    }
    @Override public EventOwnershipDto findByIdOrSourceId(String id) {
        var query = new EventOwnershipReadsProtocol.IdQuery(id);
        if (!EventOwnershipReadsProtocol.valid(query)) throw new IllegalArgumentException("Invalid event read");
        byte[] bytes = mapper.writeValueAsBytes(query);
        if (bytes.length > EventOwnershipReadsProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("Event read exceeds byte limit");
        var result = exchange(EventOwnershipReadsProtocol.ID_OR_SOURCE_ID, bytes, new TypeReference<EventOwnershipReadsProtocol.SingleResult>() {},
                "event-ownership.id-or-source-id", EventOwnershipReadsProtocol.MAX_RESPONSE_BYTES, value -> Boolean.TRUE.equals(value.resolved()));
        return result.value();
    }
    @Override public List<EventOwnershipDto> chatNavigationEvents(Collection<String> ids) {
        var query = new EventOwnershipReadsProtocol.IdsQuery(ids);
        if (!EventOwnershipReadsProtocol.valid(query)) throw new IllegalArgumentException("Invalid event read");
        byte[] bytes = mapper.writeValueAsBytes(query);
        if (bytes.length > EventOwnershipReadsProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("Event read exceeds byte limit");
        var result = exchange(EventOwnershipReadsProtocol.CHAT_NAVIGATION, bytes, new TypeReference<List<EventOwnershipDto>>() {},
                "event-ownership.chat-navigation", EventOwnershipReadsProtocol.MAX_RESPONSE_BYTES, value -> true);
        return result;
    }
    @Override public List<EventOwnershipDto> findDirectOwnerEvents(String id) {
        var query = new EventOwnershipReadsProtocol.IdQuery(id);
        if (!EventOwnershipReadsProtocol.valid(query)) throw new IllegalArgumentException("Invalid event read");
        byte[] bytes = mapper.writeValueAsBytes(query);
        if (bytes.length > EventOwnershipReadsProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("Event read exceeds byte limit");
        var result = exchange(EventOwnershipReadsProtocol.DIRECT_OWNER, bytes, new TypeReference<List<EventOwnershipDto>>() {},
                "event-ownership.direct-owner", EventOwnershipReadsProtocol.MAX_RESPONSE_BYTES, value -> true);
        return result;
    }
    @Override public List<EventOwnershipDto> findAdminVisibleEvents(String id) {
        var query = new EventOwnershipReadsProtocol.IdQuery(id);
        if (!EventOwnershipReadsProtocol.valid(query)) throw new IllegalArgumentException("Invalid event read");
        byte[] bytes = mapper.writeValueAsBytes(query);
        if (bytes.length > EventOwnershipReadsProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("Event read exceeds byte limit");
        var result = exchange(EventOwnershipReadsProtocol.ADMIN_VISIBLE, bytes, new TypeReference<List<EventOwnershipDto>>() {},
                "event-ownership.admin-visible", EventOwnershipReadsProtocol.MAX_RESPONSE_BYTES, value -> true);
        return result;
    }
    @Override public List<EventOwnershipDto> findAcceptedMembershipEvents(String id) {
        var query = new EventOwnershipReadsProtocol.IdQuery(id);
        if (!EventOwnershipReadsProtocol.valid(query)) throw new IllegalArgumentException("Invalid event read");
        byte[] bytes = mapper.writeValueAsBytes(query);
        if (bytes.length > EventOwnershipReadsProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("Event read exceeds byte limit");
        var result = exchange(EventOwnershipReadsProtocol.ACCEPTED_MEMBERSHIP, bytes, new TypeReference<List<EventOwnershipDto>>() {},
                "event-ownership.accepted-membership", EventOwnershipReadsProtocol.MAX_RESPONSE_BYTES, value -> true);
        return result;
    }
    @Override public List<EventOwnershipDto> findActiveInvitationEvents(String id) {
        var query = new EventOwnershipReadsProtocol.IdQuery(id);
        if (!EventOwnershipReadsProtocol.valid(query)) throw new IllegalArgumentException("Invalid event read");
        byte[] bytes = mapper.writeValueAsBytes(query);
        if (bytes.length > EventOwnershipReadsProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("Event read exceeds byte limit");
        var result = exchange(EventOwnershipReadsProtocol.ACTIVE_INVITATION, bytes, new TypeReference<List<EventOwnershipDto>>() {},
                "event-ownership.active-invitation", EventOwnershipReadsProtocol.MAX_RESPONSE_BYTES, value -> true);
        return result;
    }
    @Override public List<EventOwnershipDto> findPendingRequestEvents(String id) {
        var query = new EventOwnershipReadsProtocol.IdQuery(id);
        if (!EventOwnershipReadsProtocol.valid(query)) throw new IllegalArgumentException("Invalid event read");
        byte[] bytes = mapper.writeValueAsBytes(query);
        if (bytes.length > EventOwnershipReadsProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("Event read exceeds byte limit");
        var result = exchange(EventOwnershipReadsProtocol.PENDING_REQUEST, bytes, new TypeReference<List<EventOwnershipDto>>() {},
                "event-ownership.pending-request", EventOwnershipReadsProtocol.MAX_RESPONSE_BYTES, value -> true);
        return result;
    }
    @Override public List<EventOwnershipDto> findByOwnerUserId(String id) {
        var query = new EventOwnershipReadsProtocol.IdQuery(id);
        if (!EventOwnershipReadsProtocol.valid(query)) throw new IllegalArgumentException("Invalid event read");
        byte[] bytes = mapper.writeValueAsBytes(query);
        if (bytes.length > EventOwnershipReadsProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("Event read exceeds byte limit");
        var result = exchange(EventOwnershipReadsProtocol.BY_OWNER, bytes, new TypeReference<List<EventOwnershipDto>>() {},
                "event-ownership.by-owner", EventOwnershipReadsProtocol.MAX_RESPONSE_BYTES, value -> true);
        return result;
    }
    @Override public List<EventOwnershipDto> findByAdminsContaining(String id) {
        var query = new EventOwnershipReadsProtocol.IdQuery(id);
        if (!EventOwnershipReadsProtocol.valid(query)) throw new IllegalArgumentException("Invalid event read");
        byte[] bytes = mapper.writeValueAsBytes(query);
        if (bytes.length > EventOwnershipReadsProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("Event read exceeds byte limit");
        var result = exchange(EventOwnershipReadsProtocol.BY_ADMIN, bytes, new TypeReference<List<EventOwnershipDto>>() {},
                "event-ownership.by-admin", EventOwnershipReadsProtocol.MAX_RESPONSE_BYTES, value -> true);
        return result;
    }
    @Override public List<EventOwnershipDto> findHomeGameMemberProjections() {
        var query = new EventOwnershipReadsProtocol.EmptyQuery();
        if (!EventOwnershipReadsProtocol.valid(query)) throw new IllegalArgumentException("Invalid event read");
        byte[] bytes = mapper.writeValueAsBytes(query);
        if (bytes.length > EventOwnershipReadsProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("Event read exceeds byte limit");
        var result = exchange(EventOwnershipReadsProtocol.HOME_GAME_MEMBERS, bytes, new TypeReference<List<EventOwnershipDto>>() {},
                "event-ownership.home-game-members", EventOwnershipReadsProtocol.MAX_RESPONSE_BYTES, value -> true);
        return result;
    }
    @Override public List<EventOwnershipDto> activeOriginalEventsByCreators(Collection<String> ids) {
        var query = new EventOwnershipReadsProtocol.IdsQuery(ids);
        if (!EventOwnershipReadsProtocol.valid(query)) throw new IllegalArgumentException("Invalid event read");
        byte[] bytes = mapper.writeValueAsBytes(query);
        if (bytes.length > EventOwnershipReadsProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("Event read exceeds byte limit");
        var result = exchange(EventOwnershipReadsProtocol.ACTIVE_ORIGINALS, bytes, new TypeReference<List<EventOwnershipDto>>() {},
                "event-ownership.active-originals", EventOwnershipReadsProtocol.MAX_RESPONSE_BYTES, value -> true);
        return result;
    }
    @Override public List<EventOwnershipDto> storedEventsBySources(Collection<String> ids) {
        var query = new EventOwnershipReadsProtocol.IdsQuery(ids);
        if (!EventOwnershipReadsProtocol.valid(query)) throw new IllegalArgumentException("Invalid event read");
        byte[] bytes = mapper.writeValueAsBytes(query);
        if (bytes.length > EventOwnershipReadsProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("Event read exceeds byte limit");
        var result = exchange(EventOwnershipReadsProtocol.STORED_SOURCES, bytes, new TypeReference<List<EventOwnershipDto>>() {},
                "event-ownership.stored-sources", EventOwnershipReadsProtocol.MAX_RESPONSE_BYTES, value -> true);
        return result;
    }
}

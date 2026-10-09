package com.raxim.myscoutee.microservices.transport.events;

import java.net.URI;
import java.time.Duration;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import com.raxim.myscoutee.common.dto.SharedDtos.PricingConfigDto;
import com.raxim.myscoutee.domain.events.api.MemberDirectory;
import com.raxim.myscoutee.domain.events.dto.MemberDirectoryEntryDto;
import com.raxim.myscoutee.domain.events.dto.MemberDirectoryPageDto;
import com.raxim.myscoutee.microservices.transport.common.RemoteReadTransport;
import io.micrometer.core.instrument.MeterRegistry;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

public final class RemoteMemberDirectory extends RemoteReadTransport implements MemberDirectory {
    private static final TypeReference<List<MemberDirectoryEntryDto>> ENTRIES = new TypeReference<>() {};
    private final ObjectMapper mapper;
    public RemoteMemberDirectory(URI origin, String token, boolean allowHttp, Duration connectTimeout,
            Duration requestTimeout, ObjectMapper mapper, MeterRegistry metrics) {
        super(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics);
        this.mapper = mapper;
    }
    @Override public Optional<MemberDirectoryEntryDto> findByOwnerTypeAndOwnerIdAndUserId(String type, String id, String user) {
        return optional(queryPath(MemberDirectoryProtocol.ENTRY, "ownerType", type, "ownerId", id, "userId", user),
                new TypeReference<MemberDirectoryEntryDto>() {}, "events.member-entry");
    }
    @Override public List<MemberDirectoryEntryDto> findByOwnerTypeAndOwnerId(String type, String id) {
        return entries(queryPath(MemberDirectoryProtocol.OWNER, "ownerType", type, "ownerId", id), "events.members-owner");
    }
    @Override public List<MemberDirectoryEntryDto> findByOwnerTypeAndUserId(String type, String user) {
        return entries(queryPath(MemberDirectoryProtocol.USER, "ownerType", type, "userId", user), "events.members-user");
    }
    @Override public List<MemberDirectoryEntryDto> findAll() { return entries(MemberDirectoryProtocol.ALL, "events.members-all"); }
    @Override public List<MemberDirectoryEntryDto> findByOwnerTypeAndOwnerIdIn(String type, Collection<String> ids) {
        var query = new MemberDirectoryProtocol.OwnerQuery(type, ids == null ? null : new java.util.ArrayList<>(ids));
        return exchange(MemberDirectoryProtocol.OWNERS, MemberDirectoryProtocol.encode(query, ids, mapper, type), ENTRIES,
                "events.members-owners", MemberDirectoryProtocol.MAX_RESPONSE_BYTES, RemoteMemberDirectory::validEntries);
    }
    @Override public List<MemberDirectoryEntryDto> findAcceptedByOwnerTypeOwnerIdInAndUserId(String type, Collection<String> ids, String user, String status) {
        var query = new MemberDirectoryProtocol.AcceptedQuery(type, ids == null ? null : new java.util.ArrayList<>(ids), user, status);
        return exchange(MemberDirectoryProtocol.ACCEPTED, MemberDirectoryProtocol.encode(query, ids, mapper, type, user, status), ENTRIES,
                "events.members-accepted", MemberDirectoryProtocol.MAX_RESPONSE_BYTES, RemoteMemberDirectory::validEntries);
    }
    @Override public PricingConfigDto vipPricingOffer(String source, String user) {
        return optional(queryPath(MemberDirectoryProtocol.VIP, "sourceId", source, "userId", user),
                new TypeReference<PricingConfigDto>() {}, "events.member-vip-pricing").orElse(null);
    }
    @Override public Page pageByOwnerAndStatus(String type, String id, String status, int offset, int limit) {
        if (!MemberDirectoryProtocol.validPage(offset, limit)) throw new IllegalArgumentException("Invalid member page bounds.");
        var page = exchange(queryPath(MemberDirectoryProtocol.PAGE, "ownerType", type, "ownerId", id, "status", status,
                        "offset", Integer.toString(offset), "limit", Integer.toString(limit)),
                new TypeReference<MemberDirectoryPageDto>() {}, "events.members-page", MemberDirectoryProtocol.MAX_RESPONSE_BYTES,
                value -> value.total() >= 0 && value.items() != null && validEntries(value.items()));
        return new Page(page.total(), page.items());
    }
    private List<MemberDirectoryEntryDto> entries(String path, String operation) {
        return exchange(path, ENTRIES, operation, MemberDirectoryProtocol.MAX_RESPONSE_BYTES, RemoteMemberDirectory::validEntries);
    }
    private static boolean validEntries(List<MemberDirectoryEntryDto> items) { return items.stream().allMatch(java.util.Objects::nonNull); }
    private <T> Optional<T> optional(String path, TypeReference<T> type, String operation) {
        try {
            return Optional.of(exchange(path, type, operation, MemberDirectoryProtocol.MAX_RESPONSE_BYTES, value -> true));
        } catch (RemoteReadException failure) {
            if (failure.status() == 404 && "NOT_FOUND".equals(failure.remoteCode())) return Optional.empty();
            throw failure;
        }
    }
}

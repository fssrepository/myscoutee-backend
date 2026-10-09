package com.raxim.myscoutee.microservices.transport.community;

import com.raxim.myscoutee.domain.community.api.Announcements;
import java.net.URI;
import java.time.Duration;
import com.raxim.myscoutee.microservices.transport.common.RemoteReadTransport;
import io.micrometer.core.instrument.MeterRegistry;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

/** Bounded scoped call to the existing owner; no automatic retries. */
public final class RemoteAnnouncements extends RemoteReadTransport implements Announcements {
    private final ObjectMapper mapper;
    private final com.raxim.myscoutee.microservices.transport.security.ActorDelegation.Signer signer;
    public RemoteAnnouncements(URI origin, String token, boolean allowHttp, Duration connectTimeout,
            Duration requestTimeout, ObjectMapper mapper, MeterRegistry metrics, com.raxim.myscoutee.microservices.transport.security.ActorDelegation.Signer signer) {
        super(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics); this.mapper = mapper; this.signer = signer;
    }
    @Override public String actor(String profileId) {
        var command = new AnnouncementsProtocol.Actor1(AnnouncementsProtocol.Scope.current(), profileId);
        if (!AnnouncementsProtocol.valid(command)) throw new IllegalArgumentException("Invalid announcements request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > AnnouncementsProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("announcements request exceeds byte limit");
        var result = ownerExchange(AnnouncementsProtocol.ACTOR_1, bytes, new TypeReference<AnnouncementsProtocol.Actor1Result>() {},
                "announcements.actor_1", AnnouncementsProtocol.MAX_RESPONSE_BYTES, v -> Boolean.TRUE.equals(v.resolved()));
        return result.value();
    }
    @Override public com.raxim.myscoutee.domain.community.dto.CommunityAnnouncementDtos.Item detail(String actor, String id) {
        var command = new AnnouncementsProtocol.Detail1(AnnouncementsProtocol.Scope.current(), actor, id);
        if (!AnnouncementsProtocol.valid(command)) throw new IllegalArgumentException("Invalid announcements request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > AnnouncementsProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("announcements request exceeds byte limit");
        var result = ownerExchange(AnnouncementsProtocol.DETAIL_1, bytes, new TypeReference<AnnouncementsProtocol.Detail1Result>() {},
                "announcements.detail_1", AnnouncementsProtocol.MAX_RESPONSE_BYTES, v -> Boolean.TRUE.equals(v.resolved()));
        return result.value();
    }
    @Override public com.raxim.myscoutee.domain.community.dto.CommunityAnnouncementDtos.Page<com.raxim.myscoutee.domain.community.dto.CommunityAnnouncementDtos.Item> page(String actor, String communityId, String status, int size, String cursor, Boolean voting) {
        var command = new AnnouncementsProtocol.Page1(AnnouncementsProtocol.Scope.current(), actor, communityId, status, size, cursor, voting);
        if (!AnnouncementsProtocol.valid(command)) throw new IllegalArgumentException("Invalid announcements request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > AnnouncementsProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("announcements request exceeds byte limit");
        var result = ownerExchange(AnnouncementsProtocol.PAGE_1, bytes, new TypeReference<AnnouncementsProtocol.Page1Result>() {},
                "announcements.page_1", AnnouncementsProtocol.MAX_RESPONSE_BYTES, v -> Boolean.TRUE.equals(v.resolved()));
        return result.value();
    }
    @Override public com.raxim.myscoutee.domain.community.dto.CommunityAnnouncementDtos.Item save(String actor, com.raxim.myscoutee.domain.community.dto.CommunityAnnouncementDtos.Save r) {
        var command = new AnnouncementsProtocol.Save1(AnnouncementsProtocol.Scope.current(), actor, r);
        if (!AnnouncementsProtocol.valid(command)) throw new IllegalArgumentException("Invalid announcements request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > AnnouncementsProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("announcements request exceeds byte limit");
        var result = ownerExchange(AnnouncementsProtocol.SAVE_1, bytes, new TypeReference<AnnouncementsProtocol.Save1Result>() {},
                "announcements.save_1", AnnouncementsProtocol.MAX_RESPONSE_BYTES, v -> Boolean.TRUE.equals(v.resolved()));
        return result.value();
    }
    @Override public com.raxim.myscoutee.domain.community.dto.CommunityAnnouncementDtos.Item action(String actor, String id, com.raxim.myscoutee.domain.community.dto.CommunityAnnouncementDtos.Command r) {
        var command = new AnnouncementsProtocol.Action1(AnnouncementsProtocol.Scope.current(), actor, id, r);
        if (!AnnouncementsProtocol.valid(command)) throw new IllegalArgumentException("Invalid announcements request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > AnnouncementsProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("announcements request exceeds byte limit");
        var result = ownerExchange(AnnouncementsProtocol.ACTION_1, bytes, new TypeReference<AnnouncementsProtocol.Action1Result>() {},
                "announcements.action_1", AnnouncementsProtocol.MAX_RESPONSE_BYTES, v -> Boolean.TRUE.equals(v.resolved()));
        return result.value();
    }
    private <T> T ownerExchange(String path, byte[] bytes, TypeReference<T> type, String operation, int limit,
            java.util.function.Predicate<T> valid) {
        try {
            if (AnnouncementsProtocol.delegated(path)) return exchangeAuthorized(path, bytes, type, operation, limit, valid,
                    java.util.Map.of(com.raxim.myscoutee.microservices.transport.security.ActorDelegation.HEADER,
                            signer.issueForCurrent(AnnouncementsProtocol.AUDIENCE, "POST", path, bytes)));
            return exchange(path, bytes, type, operation, limit, valid);
        }
        catch (RemoteReadException failure) {
            if (failure.status() >= 400 && failure.status() < 500 && "OWNER_REJECTED".equals(failure.remoteCode()))
                throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatusCode.valueOf(failure.status()));
            throw failure;
        }
    }

}

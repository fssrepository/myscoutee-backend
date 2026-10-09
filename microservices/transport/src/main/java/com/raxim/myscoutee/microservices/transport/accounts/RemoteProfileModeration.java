package com.raxim.myscoutee.microservices.transport.accounts;

import java.net.URI;
import java.time.Duration;
import java.util.Map;
import com.raxim.myscoutee.domain.accounts.api.ProfileModeration;
import com.raxim.myscoutee.domain.administration.dto.AdminDtos.AdminUserDto;
import com.raxim.myscoutee.microservices.transport.common.RemoteReadTransport;
import com.raxim.myscoutee.microservices.transport.security.ActorDelegation;
import io.micrometer.core.instrument.MeterRegistry;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

public final class RemoteProfileModeration extends RemoteReadTransport implements ProfileModeration {
    private final ObjectMapper mapper;
    private final ActorDelegation.Signer signer;
    public RemoteProfileModeration(URI origin, String token, boolean allowHttp, Duration connectTimeout,
            Duration requestTimeout, ObjectMapper mapper, MeterRegistry metrics, ActorDelegation.Signer signer) {
        super(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics); this.mapper = mapper; this.signer = signer;
    }
    @Override public boolean block(String userId) { return block(userId, null); }
    @Override public boolean block(String userId, SupportNotice notice) {
        return read(ProfileModerationProtocol.BLOCK, new ProfileModerationProtocol.Command(userId, notice), new TypeReference<ProfileModerationProtocol.Receipt>() {},
                value -> Boolean.TRUE.equals(value.completed()) && value.changed() != null).changed();
    }
    @Override public void unblock(String userId) {
        read(ProfileModerationProtocol.UNBLOCK, new ProfileModerationProtocol.Command(userId), new TypeReference<ProfileModerationProtocol.Receipt>() {},
                value -> Boolean.TRUE.equals(value.completed()));
    }
    private <T> T read(String path, ProfileModerationProtocol.Command query, TypeReference<T> type, java.util.function.Predicate<T> valid) {
        if (!ProfileModerationProtocol.valid(query)) throw new IllegalArgumentException("Invalid profile moderation command");
        byte[] bytes = mapper.writeValueAsBytes(query);
        String proof = signer.issueForCurrent(ProfileModerationProtocol.AUDIENCE, "POST", path, bytes);
        try {
            return exchangeAuthorized(path, bytes, type, path.equals(ProfileModerationProtocol.BLOCK) ? "profile-moderation.block" : "profile-moderation.unblock",
                    16384, valid, Map.of(ActorDelegation.HEADER, proof));
        } catch (RemoteReadException rejected) {
            if (rejected.status() == 403 && "INVALID_DELEGATION".equals(rejected.remoteCode()))
                throw new org.springframework.security.access.AccessDeniedException("Invalid administrator delegation");
            if (rejected.status() >= 400 && rejected.status() < 500 && "OWNER_REJECTED".equals(rejected.remoteCode()))
                throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatusCode.valueOf(rejected.status()));
            throw rejected;
        }
    }
}

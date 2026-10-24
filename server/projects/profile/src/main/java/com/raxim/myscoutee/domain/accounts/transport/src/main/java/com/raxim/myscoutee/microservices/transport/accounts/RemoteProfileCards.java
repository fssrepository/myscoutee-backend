package com.raxim.myscoutee.microservices.transport.accounts;

import java.net.URI;
import java.time.Duration;
import java.util.Collection;
import java.util.List;
import com.raxim.myscoutee.domain.accounts.api.ProfileCards;
import com.raxim.myscoutee.domain.accounts.dto.AuthDtos.UserDto;
import com.raxim.myscoutee.microservices.transport.common.RemoteReadTransport;
import io.micrometer.core.instrument.MeterRegistry;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

public final class RemoteProfileCards extends RemoteReadTransport implements ProfileCards {
    private final ObjectMapper mapper;
    public RemoteProfileCards(URI origin, String token, boolean allowHttp, Duration connectTimeout,
            Duration requestTimeout, ObjectMapper mapper, MeterRegistry metrics) {
        super(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics);
        this.mapper = mapper;
    }
    @Override public List<UserDto> queryUsersByIds(Collection<String> ids) {
        return exchange(ProfileCardsProtocol.PATH, ProfileCardsProtocol.encode(ids, mapper),
                new TypeReference<List<UserDto>>() {}, "accounts.profile-cards",
                ProfileCardsProtocol.MAX_RESPONSE_BYTES, value -> true);
    }
    @Override public List<UserDto> presentGameCards(Collection<String> ids) {
        return exchange(ProfileCardsProtocol.PRESENT, ProfileCardsProtocol.encode(ids, mapper),
                new TypeReference<List<UserDto>>() {}, "accounts.profile-cards.present",
                ProfileCardsProtocol.MAX_RESPONSE_BYTES, value -> true);
    }
    @Override public List<UserDto> presentProfiles(Collection<String> ids) {
        return exchange(ProfileCardsProtocol.PROFILES, ProfileCardsProtocol.encode(ids, mapper),
                new TypeReference<List<UserDto>>() {}, "accounts.profile-cards.profiles",
                ProfileCardsProtocol.MAX_RESPONSE_BYTES, value -> true);
    }
}

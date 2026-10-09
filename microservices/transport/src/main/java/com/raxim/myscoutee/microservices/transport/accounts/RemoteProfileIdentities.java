package com.raxim.myscoutee.microservices.transport.accounts;

import java.net.URI;
import java.time.Duration;
import java.util.List;
import java.util.Optional;
import com.raxim.myscoutee.domain.accounts.api.ProfileIdentities;
import com.raxim.myscoutee.domain.accounts.dto.ProfileIdentityDto;
import com.raxim.myscoutee.microservices.transport.common.RemoteReadTransport;
import io.micrometer.core.instrument.MeterRegistry;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

public final class RemoteProfileIdentities extends RemoteReadTransport implements ProfileIdentities {
    public RemoteProfileIdentities(URI origin, String token, boolean allowHttp, Duration connectTimeout,
            Duration requestTimeout, ObjectMapper mapper, MeterRegistry metrics) {
        super(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics);
    }

    @Override public Optional<ProfileIdentityDto> findIdentityByUserId(String userId) {
        return identity(ProfileIdentitiesProtocol.PROFILE_PATH, "accounts.profile-identity", userId);
    }

    @Override public Optional<ProfileIdentityDto> findFirstIdentityByUserId(String userId) {
        return identity(ProfileIdentitiesProtocol.FIRST_PROFILE_PATH, "accounts.first-profile-identity", userId);
    }

    private Optional<ProfileIdentityDto> identity(String path, String operation, String userId) {
        try {
            return Optional.of(exchange(queryPath(path, "userId", userId),
                    new TypeReference<ProfileIdentityDto>() {}, operation, 4096, value -> true));
        } catch (RemoteReadException failure) {
            if (failure.status() == 404 && "NOT_FOUND".equals(failure.remoteCode())) return Optional.empty();
            throw failure;
        }
    }

    @Override public boolean existsNotDeleted(String userId) {
        return exchange(queryPath(ProfileIdentitiesProtocol.EXISTS_PATH, "userId", userId),
                new TypeReference<Boolean>() {}, "accounts.profile-exists", 4096, value -> true);
    }

    @Override public List<String> userIdsByWorkspace(String groupId) {
        return exchange(queryPath(ProfileIdentitiesProtocol.WORKSPACE_PATH, "groupId", groupId),
                new TypeReference<List<String>>() {}, "accounts.workspace-profile-ids", ProfileIdentitiesProtocol.MAX_RESPONSE_BYTES, value -> true);
    }

}

package com.raxim.myscoutee.microservices.transport.accounts;

import java.net.URI;
import java.time.Duration;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import com.raxim.myscoutee.domain.accounts.api.Experiences;
import com.raxim.myscoutee.domain.accounts.dto.ExperienceDtos.UserExperiencesResponseDto;
import com.raxim.myscoutee.microservices.transport.common.RemoteReadTransport;
import io.micrometer.core.instrument.MeterRegistry;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

public final class RemoteExperiences extends RemoteReadTransport implements Experiences {
    private final ObjectMapper mapper;
    public RemoteExperiences(URI origin, String token, boolean allowHttp, Duration connectTimeout,
            Duration requestTimeout, ObjectMapper mapper, MeterRegistry metrics) {
        super(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics);
        this.mapper = mapper;
    }
    @Override public Optional<UserExperiencesResponseDto> findByUserId(String id) {
        try {
            return Optional.of(exchange(queryPath(ExperiencesProtocol.ONE, "id", id),
                    new TypeReference<UserExperiencesResponseDto>() {}, "experiences.profile",
                    ExperiencesProtocol.MAX_RESPONSE_BYTES, value -> true));
        } catch (RemoteReadException failure) {
            if (failure.status() == 404 && "NOT_FOUND".equals(failure.remoteCode())) return Optional.empty();
            throw failure;
        }
    }
    @Override public List<UserExperiencesResponseDto> findByUserIdIn(Collection<String> ids) {
        return exchange(ExperiencesProtocol.BATCH, ExperiencesProtocol.encode(ids, mapper),
                new TypeReference<List<UserExperiencesResponseDto>>() {}, "experiences.profiles",
                ExperiencesProtocol.MAX_RESPONSE_BYTES, value -> true);
    }
}

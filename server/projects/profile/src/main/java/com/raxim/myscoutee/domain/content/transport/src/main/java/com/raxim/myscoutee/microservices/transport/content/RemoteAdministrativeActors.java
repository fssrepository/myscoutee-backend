package com.raxim.myscoutee.microservices.transport.content;

import java.net.URI;
import java.time.Duration;
import java.util.Map;
import com.raxim.myscoutee.domain.administration.api.AdministrativeActors;
import com.raxim.myscoutee.domain.administration.dto.AdminDtos.AdminUserDto;
import com.raxim.myscoutee.microservices.transport.common.RemoteReadTransport;
import com.raxim.myscoutee.microservices.transport.security.ActorDelegation;
import io.micrometer.core.instrument.MeterRegistry;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

public final class RemoteAdministrativeActors extends RemoteReadTransport implements AdministrativeActors {
    private final ObjectMapper mapper;
    private final ActorDelegation.Signer signer;
    public RemoteAdministrativeActors(URI origin, String token, boolean allowHttp, Duration connectTimeout,
            Duration requestTimeout, ObjectMapper mapper, MeterRegistry metrics, ActorDelegation.Signer signer) {
        super(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics); this.mapper = mapper; this.signer = signer;
    }
    @Override public AdminUserDto resolveAdminActor(String adminUserId) {
        return read(AdministrativeActorsProtocol.ACTOR, adminUserId, new TypeReference<AdminUserDto>() {},
                value -> value.id() != null && !value.id().isBlank());
    }
    @Override public String baseGroupId(String adminUserId) {
        return read(AdministrativeActorsProtocol.GROUP, adminUserId, new TypeReference<AdministrativeActorsProtocol.GroupResult>() {},
                value -> Boolean.TRUE.equals(value.resolved()) && (value.groupId() == null || value.groupId().length() <= 512)).groupId();
    }
    private <T> T read(String path, String adminUserId, TypeReference<T> type, java.util.function.Predicate<T> valid) {
        var query = new AdministrativeActorsProtocol.Query(adminUserId);
        if (!AdministrativeActorsProtocol.valid(query)) throw new IllegalArgumentException("Invalid administrator query");
        byte[] bytes = mapper.writeValueAsBytes(query);
        String proof = signer.issueForCurrent(AdministrativeActorsProtocol.AUDIENCE, "POST", path, bytes);
        try {
            return exchangeAuthorized(path, bytes, type, path.equals(AdministrativeActorsProtocol.ACTOR) ? "administrative-actors.actor" : "administrative-actors.group",
                    1048576, valid, Map.of(ActorDelegation.HEADER, proof));
        } catch (RemoteReadException rejected) {
            if (rejected.status() == 403 && "INVALID_DELEGATION".equals(rejected.remoteCode()))
                throw new org.springframework.security.access.AccessDeniedException("Invalid administrator delegation");
            if (rejected.status() >= 400 && rejected.status() < 500 && "OWNER_REJECTED".equals(rejected.remoteCode()))
                throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatusCode.valueOf(rejected.status()));
            throw rejected;
        }
    }
}

package com.raxim.myscoutee.microservices.transport.community;

import com.raxim.myscoutee.domain.community.api.ScheduledCases;
import java.net.URI;
import java.time.Duration;
import com.raxim.myscoutee.microservices.transport.common.RemoteReadTransport;
import io.micrometer.core.instrument.MeterRegistry;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

/** Bounded scoped call to the existing owner; no automatic retries. */
public final class RemoteScheduledCases extends RemoteReadTransport implements ScheduledCases {
    private final ObjectMapper mapper;
    private final com.raxim.myscoutee.microservices.transport.security.ActorDelegation.Signer signer;
    public RemoteScheduledCases(URI origin, String token, boolean allowHttp, Duration connectTimeout,
            Duration requestTimeout, ObjectMapper mapper, MeterRegistry metrics, com.raxim.myscoutee.microservices.transport.security.ActorDelegation.Signer signer) {
        super(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics); this.mapper = mapper; this.signer = signer;
    }
    @Override public String actor(String id) {
        var command = new ScheduledCasesProtocol.Actor1(ScheduledCasesProtocol.Scope.current(), id);
        if (!ScheduledCasesProtocol.valid(command)) throw new IllegalArgumentException("Invalid scheduled-cases request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > ScheduledCasesProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("scheduled-cases request exceeds byte limit");
        var result = ownerExchange(ScheduledCasesProtocol.ACTOR_1, bytes, new TypeReference<ScheduledCasesProtocol.Actor1Result>() {},
                "scheduled-cases.actor_1", ScheduledCasesProtocol.MAX_RESPONSE_BYTES, v -> Boolean.TRUE.equals(v.resolved()));
        return result.value();
    }
    @Override public com.raxim.myscoutee.domain.community.dto.CommunityCaseDtos.Page<com.raxim.myscoutee.domain.community.dto.CommunityCaseDtos.TaskItem> page(String actor, int size, String cursor, String status) {
        var command = new ScheduledCasesProtocol.Page1(ScheduledCasesProtocol.Scope.current(), actor, size, cursor, status);
        if (!ScheduledCasesProtocol.valid(command)) throw new IllegalArgumentException("Invalid scheduled-cases request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > ScheduledCasesProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("scheduled-cases request exceeds byte limit");
        var result = ownerExchange(ScheduledCasesProtocol.PAGE_1, bytes, new TypeReference<ScheduledCasesProtocol.Page1Result>() {},
                "scheduled-cases.page_1", ScheduledCasesProtocol.MAX_RESPONSE_BYTES, v -> Boolean.TRUE.equals(v.resolved()));
        return result.value();
    }
    @Override public com.raxim.myscoutee.domain.community.dto.CommunityCaseDtos.TaskItem save(String actor, com.raxim.myscoutee.domain.community.dto.CommunityCaseDtos.SaveTask r) {
        var command = new ScheduledCasesProtocol.Save1(ScheduledCasesProtocol.Scope.current(), actor, r);
        if (!ScheduledCasesProtocol.valid(command)) throw new IllegalArgumentException("Invalid scheduled-cases request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > ScheduledCasesProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("scheduled-cases request exceeds byte limit");
        var result = ownerExchange(ScheduledCasesProtocol.SAVE_1, bytes, new TypeReference<ScheduledCasesProtocol.Save1Result>() {},
                "scheduled-cases.save_1", ScheduledCasesProtocol.MAX_RESPONSE_BYTES, v -> Boolean.TRUE.equals(v.resolved()));
        return result.value();
    }
    @Override public com.raxim.myscoutee.domain.community.dto.CommunityCaseDtos.TaskItem action(String actor, String id, com.raxim.myscoutee.domain.community.dto.CommunityCaseDtos.TaskCommand requestedCommand) {
        var command = new ScheduledCasesProtocol.Action1(ScheduledCasesProtocol.Scope.current(), actor, id, requestedCommand);
        if (!ScheduledCasesProtocol.valid(command)) throw new IllegalArgumentException("Invalid scheduled-cases request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > ScheduledCasesProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("scheduled-cases request exceeds byte limit");
        var result = ownerExchange(ScheduledCasesProtocol.ACTION_1, bytes, new TypeReference<ScheduledCasesProtocol.Action1Result>() {},
                "scheduled-cases.action_1", ScheduledCasesProtocol.MAX_RESPONSE_BYTES, v -> Boolean.TRUE.equals(v.resolved()));
        return result.value();
    }
    private <T> T ownerExchange(String path, byte[] bytes, TypeReference<T> type, String operation, int limit,
            java.util.function.Predicate<T> valid) {
        try {
            if (ScheduledCasesProtocol.delegated(path)) return exchangeAuthorized(path, bytes, type, operation, limit, valid,
                    java.util.Map.of(com.raxim.myscoutee.microservices.transport.security.ActorDelegation.HEADER,
                            signer.issueForCurrent(ScheduledCasesProtocol.AUDIENCE, "POST", path, bytes)));
            return exchange(path, bytes, type, operation, limit, valid);
        }
        catch (RemoteReadException failure) {
            if (failure.status() >= 400 && failure.status() < 500 && "OWNER_REJECTED".equals(failure.remoteCode()))
                throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatusCode.valueOf(failure.status()));
            throw failure;
        }
    }

}

package com.raxim.myscoutee.microservices.transport.community;

import com.raxim.myscoutee.domain.community.api.Cases;
import java.net.URI;
import java.time.Duration;
import com.raxim.myscoutee.microservices.transport.common.RemoteReadTransport;
import io.micrometer.core.instrument.MeterRegistry;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

/** Bounded scoped call to the existing owner; no automatic retries. */
public final class RemoteCases extends RemoteReadTransport implements Cases {
    private final ObjectMapper mapper;
    private final com.raxim.myscoutee.microservices.transport.security.ActorDelegation.Signer signer;
    public RemoteCases(URI origin, String token, boolean allowHttp, Duration connectTimeout,
            Duration requestTimeout, ObjectMapper mapper, MeterRegistry metrics, com.raxim.myscoutee.microservices.transport.security.ActorDelegation.Signer signer) {
        super(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics); this.mapper = mapper; this.signer = signer;
    }
    @Override public String actor(String id) {
        var command = new CasesProtocol.Actor1(CasesProtocol.Scope.current(), id);
        if (!CasesProtocol.valid(command)) throw new IllegalArgumentException("Invalid cases request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > CasesProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("cases request exceeds byte limit");
        var result = ownerExchange(CasesProtocol.ACTOR_1, bytes, new TypeReference<CasesProtocol.Actor1Result>() {},
                "cases.actor_1", CasesProtocol.MAX_RESPONSE_BYTES, v -> Boolean.TRUE.equals(v.resolved()));
        return result.value();
    }
    @Override public com.raxim.myscoutee.domain.community.dto.CommunityCaseDtos.CaseItem detail(String actor, String id) {
        var command = new CasesProtocol.Detail1(CasesProtocol.Scope.current(), actor, id);
        if (!CasesProtocol.valid(command)) throw new IllegalArgumentException("Invalid cases request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > CasesProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("cases request exceeds byte limit");
        var result = ownerExchange(CasesProtocol.DETAIL_1, bytes, new TypeReference<CasesProtocol.Detail1Result>() {},
                "cases.detail_1", CasesProtocol.MAX_RESPONSE_BYTES, v -> Boolean.TRUE.equals(v.resolved()));
        return result.value();
    }
    @Override public com.raxim.myscoutee.domain.community.dto.CommunityCaseDtos.CaseItem read(String actor, String id) {
        var command = new CasesProtocol.Read1(CasesProtocol.Scope.current(), actor, id);
        if (!CasesProtocol.valid(command)) throw new IllegalArgumentException("Invalid cases request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > CasesProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("cases request exceeds byte limit");
        var result = ownerExchange(CasesProtocol.READ_1, bytes, new TypeReference<CasesProtocol.Read1Result>() {},
                "cases.read_1", CasesProtocol.MAX_RESPONSE_BYTES, v -> Boolean.TRUE.equals(v.resolved()));
        return result.value();
    }
    @Override public com.raxim.myscoutee.domain.community.dto.CommunityCaseDtos.Page<com.raxim.myscoutee.domain.community.dto.CommunityCaseDtos.CaseItem> page(String actor, String status, String type, int size, String cursor) {
        var command = new CasesProtocol.Page1(CasesProtocol.Scope.current(), actor, status, type, size, cursor);
        if (!CasesProtocol.valid(command)) throw new IllegalArgumentException("Invalid cases request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > CasesProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("cases request exceeds byte limit");
        var result = ownerExchange(CasesProtocol.PAGE_1, bytes, new TypeReference<CasesProtocol.Page1Result>() {},
                "cases.page_1", CasesProtocol.MAX_RESPONSE_BYTES, v -> Boolean.TRUE.equals(v.resolved()));
        return result.value();
    }
    @Override public com.raxim.myscoutee.domain.community.dto.CommunityCaseDtos.CaseItem save(String actor, com.raxim.myscoutee.domain.community.dto.CommunityCaseDtos.SaveCase r) {
        var command = new CasesProtocol.Save1(CasesProtocol.Scope.current(), actor, r);
        if (!CasesProtocol.valid(command)) throw new IllegalArgumentException("Invalid cases request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > CasesProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("cases request exceeds byte limit");
        var result = ownerExchange(CasesProtocol.SAVE_1, bytes, new TypeReference<CasesProtocol.Save1Result>() {},
                "cases.save_1", CasesProtocol.MAX_RESPONSE_BYTES, v -> Boolean.TRUE.equals(v.resolved()));
        return result.value();
    }
    @Override public com.raxim.myscoutee.domain.community.dto.CommunityCaseDtos.CaseItem action(String actor, String id, com.raxim.myscoutee.domain.community.dto.CommunityCaseDtos.Command r) {
        var command = new CasesProtocol.Action1(CasesProtocol.Scope.current(), actor, id, r);
        if (!CasesProtocol.valid(command)) throw new IllegalArgumentException("Invalid cases request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > CasesProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("cases request exceeds byte limit");
        var result = ownerExchange(CasesProtocol.ACTION_1, bytes, new TypeReference<CasesProtocol.Action1Result>() {},
                "cases.action_1", CasesProtocol.MAX_RESPONSE_BYTES, v -> Boolean.TRUE.equals(v.resolved()));
        return result.value();
    }
    private <T> T ownerExchange(String path, byte[] bytes, TypeReference<T> type, String operation, int limit,
            java.util.function.Predicate<T> valid) {
        try {
            if (CasesProtocol.delegated(path)) return exchangeAuthorized(path, bytes, type, operation, limit, valid,
                    java.util.Map.of(com.raxim.myscoutee.microservices.transport.security.ActorDelegation.HEADER,
                            signer.issueForCurrent(CasesProtocol.AUDIENCE, "POST", path, bytes)));
            return exchange(path, bytes, type, operation, limit, valid);
        }
        catch (RemoteReadException failure) {
            if (failure.status() >= 400 && failure.status() < 500 && "OWNER_REJECTED".equals(failure.remoteCode()))
                throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatusCode.valueOf(failure.status()));
            throw failure;
        }
    }

}

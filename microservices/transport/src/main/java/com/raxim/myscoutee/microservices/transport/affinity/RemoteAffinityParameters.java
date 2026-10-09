package com.raxim.myscoutee.microservices.transport.affinity;

import com.raxim.myscoutee.domain.affinity.api.AffinityParameters;
import java.net.URI;
import java.time.Duration;
import com.raxim.myscoutee.microservices.transport.common.RemoteReadTransport;
import io.micrometer.core.instrument.MeterRegistry;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

/** Bounded scoped call to the existing owner; no automatic retries. */
public final class RemoteAffinityParameters extends RemoteReadTransport implements AffinityParameters {
    private final ObjectMapper mapper;
    private final com.raxim.myscoutee.microservices.transport.security.ActorDelegation.Signer signer;
    public RemoteAffinityParameters(URI origin, String token, boolean allowHttp, Duration connectTimeout,
            Duration requestTimeout, ObjectMapper mapper, MeterRegistry metrics, com.raxim.myscoutee.microservices.transport.security.ActorDelegation.Signer signer) {
        super(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics); this.mapper = mapper; this.signer = signer;
    }
    @Override public com.raxim.myscoutee.domain.administration.dto.AdminDtos.AdminParamsStateDto state(String adminUserId) {
        var command = new AffinityParametersProtocol.State1(AffinityParametersProtocol.Scope.current(), adminUserId);
        if (!AffinityParametersProtocol.valid(command)) throw new IllegalArgumentException("Invalid affinity-parameters request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > AffinityParametersProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("affinity-parameters request exceeds byte limit");
        var result = ownerExchange(AffinityParametersProtocol.STATE_1, bytes, new TypeReference<com.raxim.myscoutee.domain.administration.dto.AdminDtos.AdminParamsStateDto>() {},
                "affinity-parameters.state_1", AffinityParametersProtocol.MAX_RESPONSE_BYTES, v -> true);
        return result;
    }
    @Override public com.raxim.myscoutee.domain.administration.dto.AdminDtos.AdminParamsHistoryDto history(String sectionKey) {
        var command = new AffinityParametersProtocol.History1(AffinityParametersProtocol.Scope.current(), sectionKey);
        if (!AffinityParametersProtocol.valid(command)) throw new IllegalArgumentException("Invalid affinity-parameters request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > AffinityParametersProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("affinity-parameters request exceeds byte limit");
        var result = ownerExchange(AffinityParametersProtocol.HISTORY_1, bytes, new TypeReference<com.raxim.myscoutee.domain.administration.dto.AdminDtos.AdminParamsHistoryDto>() {},
                "affinity-parameters.history_1", AffinityParametersProtocol.MAX_RESPONSE_BYTES, v -> true);
        return result;
    }
    @Override public com.raxim.myscoutee.domain.administration.dto.AdminDtos.AdminParamsHistoryDto history(String sectionKey, String adminUserId) {
        var command = new AffinityParametersProtocol.History2(AffinityParametersProtocol.Scope.current(), sectionKey, adminUserId);
        if (!AffinityParametersProtocol.valid(command)) throw new IllegalArgumentException("Invalid affinity-parameters request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > AffinityParametersProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("affinity-parameters request exceeds byte limit");
        var result = ownerExchange(AffinityParametersProtocol.HISTORY_2, bytes, new TypeReference<com.raxim.myscoutee.domain.administration.dto.AdminDtos.AdminParamsHistoryDto>() {},
                "affinity-parameters.history_2", AffinityParametersProtocol.MAX_RESPONSE_BYTES, v -> true);
        return result;
    }
    @Override public com.raxim.myscoutee.domain.administration.dto.AdminDtos.AdminParamsStateDto save(com.raxim.myscoutee.domain.administration.dto.AdminDtos.AdminParamsSaveRequestDto request) {
        var command = new AffinityParametersProtocol.Save1(AffinityParametersProtocol.Scope.current(), request);
        if (!AffinityParametersProtocol.valid(command)) throw new IllegalArgumentException("Invalid affinity-parameters request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > AffinityParametersProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("affinity-parameters request exceeds byte limit");
        var result = ownerExchange(AffinityParametersProtocol.SAVE_1, bytes, new TypeReference<com.raxim.myscoutee.domain.administration.dto.AdminDtos.AdminParamsStateDto>() {},
                "affinity-parameters.save_1", AffinityParametersProtocol.MAX_RESPONSE_BYTES, v -> true);
        return result;
    }
    @Override public com.raxim.myscoutee.domain.administration.dto.AdminDtos.AdminParamsStateDto revert(String sectionKey, com.raxim.myscoutee.domain.administration.dto.AdminDtos.AdminParamsRevertRequestDto request) {
        var command = new AffinityParametersProtocol.Revert1(AffinityParametersProtocol.Scope.current(), sectionKey, request);
        if (!AffinityParametersProtocol.valid(command)) throw new IllegalArgumentException("Invalid affinity-parameters request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > AffinityParametersProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("affinity-parameters request exceeds byte limit");
        var result = ownerExchange(AffinityParametersProtocol.REVERT_1, bytes, new TypeReference<com.raxim.myscoutee.domain.administration.dto.AdminDtos.AdminParamsStateDto>() {},
                "affinity-parameters.revert_1", AffinityParametersProtocol.MAX_RESPONSE_BYTES, v -> true);
        return result;
    }
    private <T> T ownerExchange(String path, byte[] bytes, TypeReference<T> type, String operation, int limit,
            java.util.function.Predicate<T> valid) {
        try {
            if (AffinityParametersProtocol.delegated(path)) return exchangeAuthorized(path, bytes, type, operation, limit, valid,
                    java.util.Map.of(com.raxim.myscoutee.microservices.transport.security.ActorDelegation.HEADER,
                            signer.issueForCurrent(AffinityParametersProtocol.AUDIENCE, "POST", path, bytes)));
            return exchange(path, bytes, type, operation, limit, valid);
        }
        catch (RemoteReadException failure) {
            if (failure.status() >= 400 && failure.status() < 500 && "OWNER_REJECTED".equals(failure.remoteCode()))
                throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatusCode.valueOf(failure.status()));
            throw failure;
        }
    }

}

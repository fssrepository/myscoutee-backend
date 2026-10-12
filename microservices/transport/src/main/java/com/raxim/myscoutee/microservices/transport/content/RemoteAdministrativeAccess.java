package com.raxim.myscoutee.microservices.transport.content;

import com.raxim.myscoutee.domain.content.api.AdministrativeAccess;
import java.net.URI;
import java.time.Duration;
import com.raxim.myscoutee.microservices.transport.common.RemoteReadTransport;
import io.micrometer.core.instrument.MeterRegistry;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

/** Bounded scoped call to the existing owner; no automatic retries. */
public final class RemoteAdministrativeAccess extends RemoteReadTransport implements AdministrativeAccess {
    private final ObjectMapper mapper;
    private final com.raxim.myscoutee.microservices.transport.security.ActorDelegation.Signer signer;
    public RemoteAdministrativeAccess(URI origin, String token, boolean allowHttp, Duration connectTimeout,
            Duration requestTimeout, ObjectMapper mapper, MeterRegistry metrics, com.raxim.myscoutee.microservices.transport.security.ActorDelegation.Signer signer) {
        super(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics); this.mapper = mapper; this.signer = signer;
    }
    @Override public com.raxim.myscoutee.domain.administration.dto.AdminDtos.AdminDashboardDto dashboard(String adminUserId) {
        var command = new AdministrativeAccessProtocol.Dashboard1(AdministrativeAccessProtocol.Scope.current(), adminUserId);
        if (!AdministrativeAccessProtocol.valid(command)) throw new IllegalArgumentException("Invalid administrative-access request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > AdministrativeAccessProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("administrative-access request exceeds byte limit");
        var result = ownerExchange(AdministrativeAccessProtocol.DASHBOARD_1, bytes, new TypeReference<com.raxim.myscoutee.domain.administration.dto.AdminDtos.AdminDashboardDto>() {},
                "administrative-access.dashboard_1", AdministrativeAccessProtocol.MAX_RESPONSE_BYTES, v -> true);
        return result;
    }
    @Override public com.raxim.myscoutee.domain.administration.dto.AdminDtos.AdminDashboardDto dashboard(String adminUserId, String reportsStatus, String feedbackStatus) {
        var command = new AdministrativeAccessProtocol.Dashboard2(AdministrativeAccessProtocol.Scope.current(), adminUserId, reportsStatus, feedbackStatus);
        if (!AdministrativeAccessProtocol.valid(command)) throw new IllegalArgumentException("Invalid administrative-access request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > AdministrativeAccessProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("administrative-access request exceeds byte limit");
        var result = ownerExchange(AdministrativeAccessProtocol.DASHBOARD_2, bytes, new TypeReference<com.raxim.myscoutee.domain.administration.dto.AdminDtos.AdminDashboardDto>() {},
                "administrative-access.dashboard_2", AdministrativeAccessProtocol.MAX_RESPONSE_BYTES, v -> true);
        return result;
    }

    @Override public com.raxim.myscoutee.domain.administration.dto.AdminDtos.AdminDashboardDto warn(String userId, com.raxim.myscoutee.domain.administration.dto.AdminDtos.AdminActionRequestDto request) {
        var command = new AdministrativeAccessProtocol.Warn1(AdministrativeAccessProtocol.Scope.current(), userId, request);
        if (!AdministrativeAccessProtocol.valid(command)) throw new IllegalArgumentException("Invalid administrative-access request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > AdministrativeAccessProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("administrative-access request exceeds byte limit");
        var result = ownerExchange(AdministrativeAccessProtocol.WARN_1, bytes, new TypeReference<com.raxim.myscoutee.domain.administration.dto.AdminDtos.AdminDashboardDto>() {},
                "administrative-access.warn_1", AdministrativeAccessProtocol.MAX_RESPONSE_BYTES, v -> true);
        return result;
    }
    @Override public com.raxim.myscoutee.domain.administration.dto.AdminDtos.AdminDashboardDto block(String userId, com.raxim.myscoutee.domain.administration.dto.AdminDtos.AdminActionRequestDto request) {
        var command = new AdministrativeAccessProtocol.Block1(AdministrativeAccessProtocol.Scope.current(), userId, request);
        if (!AdministrativeAccessProtocol.valid(command)) throw new IllegalArgumentException("Invalid administrative-access request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > AdministrativeAccessProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("administrative-access request exceeds byte limit");
        var result = ownerExchange(AdministrativeAccessProtocol.BLOCK_1, bytes, new TypeReference<com.raxim.myscoutee.domain.administration.dto.AdminDtos.AdminDashboardDto>() {},
                "administrative-access.block_1", AdministrativeAccessProtocol.MAX_RESPONSE_BYTES, v -> true);
        return result;
    }
    @Override public com.raxim.myscoutee.domain.administration.dto.AdminDtos.AdminDashboardDto unblock(String userId, com.raxim.myscoutee.domain.administration.dto.AdminDtos.AdminActionRequestDto request) {
        var command = new AdministrativeAccessProtocol.Unblock1(AdministrativeAccessProtocol.Scope.current(), userId, request);
        if (!AdministrativeAccessProtocol.valid(command)) throw new IllegalArgumentException("Invalid administrative-access request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > AdministrativeAccessProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("administrative-access request exceeds byte limit");
        var result = ownerExchange(AdministrativeAccessProtocol.UNBLOCK_1, bytes, new TypeReference<com.raxim.myscoutee.domain.administration.dto.AdminDtos.AdminDashboardDto>() {},
                "administrative-access.unblock_1", AdministrativeAccessProtocol.MAX_RESPONSE_BYTES, v -> true);
        return result;
    }
    @Override public com.raxim.myscoutee.domain.administration.dto.AdminDtos.AdminDashboardDto resolveReport(String reportId, com.raxim.myscoutee.domain.administration.dto.AdminDtos.AdminReviewResolveRequestDto request) {
        var command = new AdministrativeAccessProtocol.ResolveReport1(AdministrativeAccessProtocol.Scope.current(), reportId, request);
        if (!AdministrativeAccessProtocol.valid(command)) throw new IllegalArgumentException("Invalid administrative-access request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > AdministrativeAccessProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("administrative-access request exceeds byte limit");
        var result = ownerExchange(AdministrativeAccessProtocol.RESOLVEREPORT_1, bytes, new TypeReference<com.raxim.myscoutee.domain.administration.dto.AdminDtos.AdminDashboardDto>() {},
                "administrative-access.resolvereport_1", AdministrativeAccessProtocol.MAX_RESPONSE_BYTES, v -> true);
        return result;
    }
    @Override public com.raxim.myscoutee.domain.administration.dto.AdminDtos.AdminDashboardDto resolveFeedback(String feedbackId, com.raxim.myscoutee.domain.administration.dto.AdminDtos.AdminReviewResolveRequestDto request) {
        var command = new AdministrativeAccessProtocol.ResolveFeedback1(AdministrativeAccessProtocol.Scope.current(), feedbackId, request);
        if (!AdministrativeAccessProtocol.valid(command)) throw new IllegalArgumentException("Invalid administrative-access request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > AdministrativeAccessProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("administrative-access request exceeds byte limit");
        var result = ownerExchange(AdministrativeAccessProtocol.RESOLVEFEEDBACK_1, bytes, new TypeReference<com.raxim.myscoutee.domain.administration.dto.AdminDtos.AdminDashboardDto>() {},
                "administrative-access.resolvefeedback_1", AdministrativeAccessProtocol.MAX_RESPONSE_BYTES, v -> true);
        return result;
    }



    private <T> T ownerExchange(String path, byte[] bytes, TypeReference<T> type, String operation, int limit,
            java.util.function.Predicate<T> valid) {
        try {
            if (AdministrativeAccessProtocol.delegated(path)) return exchangeAuthorized(path, bytes, type, operation, limit, valid,
                    java.util.Map.of(com.raxim.myscoutee.microservices.transport.security.ActorDelegation.HEADER,
                            signer.issueForCurrent(AdministrativeAccessProtocol.AUDIENCE, "POST", path, bytes)));
            return exchange(path, bytes, type, operation, limit, valid);
        }
        catch (RemoteReadException failure) {
            if (failure.status() >= 400 && failure.status() < 500 && "OWNER_REJECTED".equals(failure.remoteCode()))
                throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatusCode.valueOf(failure.status()));
            throw failure;
        }
    }

}

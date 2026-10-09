package com.raxim.myscoutee.microservices.transport.help;

import com.raxim.myscoutee.domain.help.api.HelpAdministration;
import java.net.URI;
import java.time.Duration;
import com.raxim.myscoutee.microservices.transport.common.RemoteReadTransport;
import io.micrometer.core.instrument.MeterRegistry;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

/** Bounded scoped call to the existing owner; no automatic retries. */
public final class RemoteHelpAdministration extends RemoteReadTransport implements HelpAdministration {
    private final ObjectMapper mapper;
    private final com.raxim.myscoutee.microservices.transport.security.ActorDelegation.Signer signer;
    public RemoteHelpAdministration(URI origin, String token, boolean allowHttp, Duration connectTimeout,
            Duration requestTimeout, ObjectMapper mapper, MeterRegistry metrics, com.raxim.myscoutee.microservices.transport.security.ActorDelegation.Signer signer) {
        super(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics); this.mapper = mapper; this.signer = signer;
    }
    @Override public com.raxim.myscoutee.domain.help.dto.HelpCenterDtos.HelpCenterStateDto adminState(String adminUserId) {
        var command = new HelpAdministrationProtocol.AdminState1(HelpAdministrationProtocol.Scope.current(), adminUserId);
        if (!HelpAdministrationProtocol.valid(command)) throw new IllegalArgumentException("Invalid help-administration request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > HelpAdministrationProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("help-administration request exceeds byte limit");
        var result = ownerExchange(HelpAdministrationProtocol.ADMINSTATE_1, bytes, new TypeReference<com.raxim.myscoutee.domain.help.dto.HelpCenterDtos.HelpCenterStateDto>() {},
                "help-administration.adminstate_1", HelpAdministrationProtocol.MAX_RESPONSE_BYTES, v -> true);
        return result;
    }
    @Override public com.raxim.myscoutee.domain.help.dto.HelpCenterDtos.HelpCenterStateDto adminState(String adminUserId, String documentType) {
        var command = new HelpAdministrationProtocol.AdminState2(HelpAdministrationProtocol.Scope.current(), adminUserId, documentType);
        if (!HelpAdministrationProtocol.valid(command)) throw new IllegalArgumentException("Invalid help-administration request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > HelpAdministrationProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("help-administration request exceeds byte limit");
        var result = ownerExchange(HelpAdministrationProtocol.ADMINSTATE_2, bytes, new TypeReference<com.raxim.myscoutee.domain.help.dto.HelpCenterDtos.HelpCenterStateDto>() {},
                "help-administration.adminstate_2", HelpAdministrationProtocol.MAX_RESPONSE_BYTES, v -> true);
        return result;
    }
    @Override public com.raxim.myscoutee.domain.help.dto.HelpCenterDtos.HelpCenterStateDto adminState(String adminUserId, String documentType, String lang) {
        var command = new HelpAdministrationProtocol.AdminState3(HelpAdministrationProtocol.Scope.current(), adminUserId, documentType, lang);
        if (!HelpAdministrationProtocol.valid(command)) throw new IllegalArgumentException("Invalid help-administration request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > HelpAdministrationProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("help-administration request exceeds byte limit");
        var result = ownerExchange(HelpAdministrationProtocol.ADMINSTATE_3, bytes, new TypeReference<com.raxim.myscoutee.domain.help.dto.HelpCenterDtos.HelpCenterStateDto>() {},
                "help-administration.adminstate_3", HelpAdministrationProtocol.MAX_RESPONSE_BYTES, v -> true);
        return result;
    }
    @Override public com.raxim.myscoutee.domain.help.dto.HelpCenterDtos.HelpCenterStateDto adminState(String adminUserId, String documentType, String lang, String contextKey) {
        var command = new HelpAdministrationProtocol.AdminState4(HelpAdministrationProtocol.Scope.current(), adminUserId, documentType, lang, contextKey);
        if (!HelpAdministrationProtocol.valid(command)) throw new IllegalArgumentException("Invalid help-administration request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > HelpAdministrationProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("help-administration request exceeds byte limit");
        var result = ownerExchange(HelpAdministrationProtocol.ADMINSTATE_4, bytes, new TypeReference<com.raxim.myscoutee.domain.help.dto.HelpCenterDtos.HelpCenterStateDto>() {},
                "help-administration.adminstate_4", HelpAdministrationProtocol.MAX_RESPONSE_BYTES, v -> true);
        return result;
    }
    @Override public com.raxim.myscoutee.domain.help.dto.HelpCenterDtos.HelpCenterStateDto saveRevision(com.raxim.myscoutee.domain.help.dto.HelpCenterDtos.HelpCenterRevisionSaveRequestDto request) {
        var command = new HelpAdministrationProtocol.SaveRevision1(HelpAdministrationProtocol.Scope.current(), request);
        if (!HelpAdministrationProtocol.valid(command)) throw new IllegalArgumentException("Invalid help-administration request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > HelpAdministrationProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("help-administration request exceeds byte limit");
        var result = ownerExchange(HelpAdministrationProtocol.SAVEREVISION_1, bytes, new TypeReference<com.raxim.myscoutee.domain.help.dto.HelpCenterDtos.HelpCenterStateDto>() {},
                "help-administration.saverevision_1", HelpAdministrationProtocol.MAX_RESPONSE_BYTES, v -> true);
        return result;
    }
    @Override public com.raxim.myscoutee.domain.help.dto.HelpCenterDtos.HelpCenterStateDto saveRevision(com.raxim.myscoutee.domain.help.dto.HelpCenterDtos.HelpCenterRevisionSaveRequestDto request, String documentType) {
        var command = new HelpAdministrationProtocol.SaveRevision2(HelpAdministrationProtocol.Scope.current(), request, documentType);
        if (!HelpAdministrationProtocol.valid(command)) throw new IllegalArgumentException("Invalid help-administration request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > HelpAdministrationProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("help-administration request exceeds byte limit");
        var result = ownerExchange(HelpAdministrationProtocol.SAVEREVISION_2, bytes, new TypeReference<com.raxim.myscoutee.domain.help.dto.HelpCenterDtos.HelpCenterStateDto>() {},
                "help-administration.saverevision_2", HelpAdministrationProtocol.MAX_RESPONSE_BYTES, v -> true);
        return result;
    }
    @Override public com.raxim.myscoutee.domain.help.dto.HelpCenterDtos.HelpCenterStateDto activateRevision(String revisionId, com.raxim.myscoutee.domain.help.dto.HelpCenterDtos.HelpCenterAdminActionRequestDto request) {
        var command = new HelpAdministrationProtocol.ActivateRevision1(HelpAdministrationProtocol.Scope.current(), revisionId, request);
        if (!HelpAdministrationProtocol.valid(command)) throw new IllegalArgumentException("Invalid help-administration request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > HelpAdministrationProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("help-administration request exceeds byte limit");
        var result = ownerExchange(HelpAdministrationProtocol.ACTIVATEREVISION_1, bytes, new TypeReference<com.raxim.myscoutee.domain.help.dto.HelpCenterDtos.HelpCenterStateDto>() {},
                "help-administration.activaterevision_1", HelpAdministrationProtocol.MAX_RESPONSE_BYTES, v -> true);
        return result;
    }
    @Override public com.raxim.myscoutee.domain.help.dto.HelpCenterDtos.HelpCenterStateDto activateRevision(String revisionId, com.raxim.myscoutee.domain.help.dto.HelpCenterDtos.HelpCenterAdminActionRequestDto request, String documentType) {
        var command = new HelpAdministrationProtocol.ActivateRevision2(HelpAdministrationProtocol.Scope.current(), revisionId, request, documentType);
        if (!HelpAdministrationProtocol.valid(command)) throw new IllegalArgumentException("Invalid help-administration request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > HelpAdministrationProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("help-administration request exceeds byte limit");
        var result = ownerExchange(HelpAdministrationProtocol.ACTIVATEREVISION_2, bytes, new TypeReference<com.raxim.myscoutee.domain.help.dto.HelpCenterDtos.HelpCenterStateDto>() {},
                "help-administration.activaterevision_2", HelpAdministrationProtocol.MAX_RESPONSE_BYTES, v -> true);
        return result;
    }
    @Override public com.raxim.myscoutee.domain.help.dto.HelpCenterDtos.HelpCenterStateDto deleteRevision(String revisionId, com.raxim.myscoutee.domain.help.dto.HelpCenterDtos.HelpCenterAdminActionRequestDto request) {
        var command = new HelpAdministrationProtocol.DeleteRevision1(HelpAdministrationProtocol.Scope.current(), revisionId, request);
        if (!HelpAdministrationProtocol.valid(command)) throw new IllegalArgumentException("Invalid help-administration request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > HelpAdministrationProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("help-administration request exceeds byte limit");
        var result = ownerExchange(HelpAdministrationProtocol.DELETEREVISION_1, bytes, new TypeReference<com.raxim.myscoutee.domain.help.dto.HelpCenterDtos.HelpCenterStateDto>() {},
                "help-administration.deleterevision_1", HelpAdministrationProtocol.MAX_RESPONSE_BYTES, v -> true);
        return result;
    }
    @Override public com.raxim.myscoutee.domain.help.dto.HelpCenterDtos.HelpCenterStateDto deleteRevision(String revisionId, com.raxim.myscoutee.domain.help.dto.HelpCenterDtos.HelpCenterAdminActionRequestDto request, String documentType) {
        var command = new HelpAdministrationProtocol.DeleteRevision2(HelpAdministrationProtocol.Scope.current(), revisionId, request, documentType);
        if (!HelpAdministrationProtocol.valid(command)) throw new IllegalArgumentException("Invalid help-administration request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > HelpAdministrationProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("help-administration request exceeds byte limit");
        var result = ownerExchange(HelpAdministrationProtocol.DELETEREVISION_2, bytes, new TypeReference<com.raxim.myscoutee.domain.help.dto.HelpCenterDtos.HelpCenterStateDto>() {},
                "help-administration.deleterevision_2", HelpAdministrationProtocol.MAX_RESPONSE_BYTES, v -> true);
        return result;
    }
    private <T> T ownerExchange(String path, byte[] bytes, TypeReference<T> type, String operation, int limit,
            java.util.function.Predicate<T> valid) {
        try {
            if (HelpAdministrationProtocol.delegated(path)) return exchangeAuthorized(path, bytes, type, operation, limit, valid,
                    java.util.Map.of(com.raxim.myscoutee.microservices.transport.security.ActorDelegation.HEADER,
                            signer.issueForCurrent(HelpAdministrationProtocol.AUDIENCE, "POST", path, bytes)));
            return exchange(path, bytes, type, operation, limit, valid);
        }
        catch (RemoteReadException failure) {
            if (failure.status() >= 400 && failure.status() < 500 && "OWNER_REJECTED".equals(failure.remoteCode()))
                throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatusCode.valueOf(failure.status()));
            throw failure;
        }
    }

}

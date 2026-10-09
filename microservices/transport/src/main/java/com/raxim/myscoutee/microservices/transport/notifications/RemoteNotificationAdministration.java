package com.raxim.myscoutee.microservices.transport.notifications;

import com.raxim.myscoutee.domain.notifications.api.NotificationAdministration;
import java.net.URI;
import java.time.Duration;
import com.raxim.myscoutee.microservices.transport.common.RemoteReadTransport;
import io.micrometer.core.instrument.MeterRegistry;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

/** Bounded scoped call to the existing owner; no automatic retries. */
public final class RemoteNotificationAdministration extends RemoteReadTransport implements NotificationAdministration {
    private final ObjectMapper mapper;
    private final com.raxim.myscoutee.microservices.transport.security.ActorDelegation.Signer signer;
    public RemoteNotificationAdministration(URI origin, String token, boolean allowHttp, Duration connectTimeout,
            Duration requestTimeout, ObjectMapper mapper, MeterRegistry metrics, com.raxim.myscoutee.microservices.transport.security.ActorDelegation.Signer signer) {
        super(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics); this.mapper = mapper; this.signer = signer;
    }
    @Override public com.raxim.myscoutee.domain.administration.dto.AdminDtos.AdminNotificationCenterStateDto state(String adminUserId, String filter) {
        var command = new NotificationAdministrationProtocol.State1(NotificationAdministrationProtocol.Scope.current(), adminUserId, filter);
        if (!NotificationAdministrationProtocol.valid(command)) throw new IllegalArgumentException("Invalid notification-administration request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > NotificationAdministrationProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("notification-administration request exceeds byte limit");
        var result = ownerExchange(NotificationAdministrationProtocol.STATE_1, bytes, new TypeReference<com.raxim.myscoutee.domain.administration.dto.AdminDtos.AdminNotificationCenterStateDto>() {},
                "notification-administration.state_1", NotificationAdministrationProtocol.MAX_RESPONSE_BYTES, v -> true);
        return result;
    }
    @Override public com.raxim.myscoutee.domain.administration.dto.AdminDtos.AdminNotificationRuleDto ruleState(String ruleKey, String adminUserId) {
        var command = new NotificationAdministrationProtocol.RuleState1(NotificationAdministrationProtocol.Scope.current(), ruleKey, adminUserId);
        if (!NotificationAdministrationProtocol.valid(command)) throw new IllegalArgumentException("Invalid notification-administration request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > NotificationAdministrationProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("notification-administration request exceeds byte limit");
        var result = ownerExchange(NotificationAdministrationProtocol.RULESTATE_1, bytes, new TypeReference<com.raxim.myscoutee.domain.administration.dto.AdminDtos.AdminNotificationRuleDto>() {},
                "notification-administration.rulestate_1", NotificationAdministrationProtocol.MAX_RESPONSE_BYTES, v -> true);
        return result;
    }
    @Override public com.raxim.myscoutee.domain.administration.dto.AdminDtos.AdminNotificationCenterStateDto save(com.raxim.myscoutee.domain.administration.dto.AdminDtos.AdminNotificationRuleSaveRequestDto request, String filter) {
        var command = new NotificationAdministrationProtocol.Save1(NotificationAdministrationProtocol.Scope.current(), request, filter);
        if (!NotificationAdministrationProtocol.valid(command)) throw new IllegalArgumentException("Invalid notification-administration request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > NotificationAdministrationProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("notification-administration request exceeds byte limit");
        var result = ownerExchange(NotificationAdministrationProtocol.SAVE_1, bytes, new TypeReference<com.raxim.myscoutee.domain.administration.dto.AdminDtos.AdminNotificationCenterStateDto>() {},
                "notification-administration.save_1", NotificationAdministrationProtocol.MAX_RESPONSE_BYTES, v -> true);
        return result;
    }
    @Override public com.raxim.myscoutee.domain.administration.dto.AdminDtos.AdminNotificationRuleRunResultDto run(String ruleKey, com.raxim.myscoutee.domain.administration.dto.AdminDtos.AdminNotificationRuleRunRequestDto request) {
        var command = new NotificationAdministrationProtocol.Run1(NotificationAdministrationProtocol.Scope.current(), ruleKey, request);
        if (!NotificationAdministrationProtocol.valid(command)) throw new IllegalArgumentException("Invalid notification-administration request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > NotificationAdministrationProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("notification-administration request exceeds byte limit");
        var result = ownerExchange(NotificationAdministrationProtocol.RUN_1, bytes, new TypeReference<com.raxim.myscoutee.domain.administration.dto.AdminDtos.AdminNotificationRuleRunResultDto>() {},
                "notification-administration.run_1", NotificationAdministrationProtocol.MAX_RESPONSE_BYTES, v -> true);
        return result;
    }
    private <T> T ownerExchange(String path, byte[] bytes, TypeReference<T> type, String operation, int limit,
            java.util.function.Predicate<T> valid) {
        try {
            if (NotificationAdministrationProtocol.delegated(path)) return exchangeAuthorized(path, bytes, type, operation, limit, valid,
                    java.util.Map.of(com.raxim.myscoutee.microservices.transport.security.ActorDelegation.HEADER,
                            signer.issueForCurrent(NotificationAdministrationProtocol.AUDIENCE, "POST", path, bytes)));
            return exchange(path, bytes, type, operation, limit, valid);
        }
        catch (RemoteReadException failure) {
            if (failure.status() >= 400 && failure.status() < 500 && "OWNER_REJECTED".equals(failure.remoteCode()))
                throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatusCode.valueOf(failure.status()));
            throw failure;
        }
    }

}

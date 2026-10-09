package com.raxim.myscoutee.microservices.transport.chat;

import com.raxim.myscoutee.domain.chat.api.SupportMessages;
import java.net.URI;
import java.time.Duration;
import com.raxim.myscoutee.microservices.transport.common.RemoteReadTransport;
import io.micrometer.core.instrument.MeterRegistry;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

/** Bounded scoped call to the existing owner; no automatic retries. */
public final class RemoteSupportMessages extends RemoteReadTransport implements SupportMessages {
    private final ObjectMapper mapper;
    public RemoteSupportMessages(URI origin, String token, boolean allowHttp, Duration connectTimeout,
            Duration requestTimeout, ObjectMapper mapper, MeterRegistry metrics) {
        super(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics); this.mapper = mapper;
    }
    @Override public com.raxim.myscoutee.domain.chat.dto.ChatDtos.ChatMessageDto sendAdminSupportMessage(String targetUserId, String adminUserId, String adminName, String adminInitials, String text, String supportStatus, String stableMessageId) {
        var command = new SupportMessagesProtocol.Send(SupportMessagesProtocol.Scope.current(), targetUserId, adminUserId, adminName, adminInitials, text, supportStatus, stableMessageId);
        if (!SupportMessagesProtocol.valid(command)) throw new IllegalArgumentException("Invalid support-messages request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > SupportMessagesProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("support-messages request exceeds byte limit");
        var result = ownerExchange(SupportMessagesProtocol.SEND, bytes, new TypeReference<SupportMessagesProtocol.Result>() {},
                "support-messages.send", SupportMessagesProtocol.MAX_RESPONSE_BYTES, v -> Boolean.TRUE.equals(v.resolved()));
        return result.value();
    }
    private <T> T ownerExchange(String path, byte[] bytes, TypeReference<T> type, String operation, int limit,
            java.util.function.Predicate<T> valid) {
        try { return exchange(path, bytes, type, operation, limit, valid); }
        catch (RemoteReadException failure) {
            if (failure.status() >= 400 && failure.status() < 500 && "OWNER_REJECTED".equals(failure.remoteCode()))
                throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatusCode.valueOf(failure.status()));
            throw failure;
        }
    }

    @Override public com.raxim.myscoutee.domain.chat.dto.ChatDtos.ChatMessageDto sendAdminSupportMessage(String targetUserId, String adminUserId, String adminName,
            String adminInitials, String text, String supportStatus) {
        return sendAdminSupportMessage(targetUserId, adminUserId, adminName, adminInitials, text, supportStatus, null);
    }
}

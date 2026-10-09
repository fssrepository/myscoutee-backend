package com.raxim.myscoutee.microservices.transport.chat;

import com.raxim.myscoutee.domain.chat.api.CaseConversations;
import java.net.URI;
import java.time.Duration;
import com.raxim.myscoutee.microservices.transport.common.RemoteReadTransport;
import io.micrometer.core.instrument.MeterRegistry;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

/** Bounded scoped call to the existing owner; no automatic retries. */
public final class RemoteCaseConversations extends RemoteReadTransport implements CaseConversations {
    private final ObjectMapper mapper;
    public RemoteCaseConversations(URI origin, String token, boolean allowHttp, Duration connectTimeout,
            Duration requestTimeout, ObjectMapper mapper, MeterRegistry metrics) {
        super(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics); this.mapper = mapper;
    }
    @Override public void synchronizeCase(com.raxim.myscoutee.domain.community.dto.CaseConversation conversation) {
        var command = new CaseConversationsProtocol.Command(CaseConversationsProtocol.Scope.current(), conversation);
        if (!CaseConversationsProtocol.valid(command)) throw new IllegalArgumentException("Invalid case-conversations request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > CaseConversationsProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("case-conversations request exceeds byte limit");
        var result = ownerExchange(CaseConversationsProtocol.SYNC, bytes, new TypeReference<CaseConversationsProtocol.Receipt>() {},
                "case-conversations.sync", CaseConversationsProtocol.MAX_RESPONSE_BYTES, v -> Boolean.TRUE.equals(v.completed()));
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

}

package com.raxim.myscoutee.microservices.transport.community;

import java.net.URI;
import java.time.Duration;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import com.raxim.myscoutee.domain.community.api.CaseParticipants;
import com.raxim.myscoutee.domain.community.dto.CaseConversation;
import com.raxim.myscoutee.domain.community.dto.CaseVisibilityQueryDto;
import com.raxim.myscoutee.microservices.transport.common.RemoteReadTransport;
import io.micrometer.core.instrument.MeterRegistry;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

public final class RemoteCaseParticipants extends RemoteReadTransport implements CaseParticipants {
    private final ObjectMapper mapper;
    public RemoteCaseParticipants(URI origin, String token, boolean allowHttp, Duration connectTimeout,
            Duration requestTimeout, ObjectMapper mapper, MeterRegistry metrics) {
        super(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics);
        this.mapper = mapper;
    }
    @Override public Optional<CaseConversation> conversation(String caseId) {
        return optional(CaseParticipantsProtocol.CONVERSATION, caseId, new TypeReference<CaseConversation>() {}, "community.case-conversation");
    }
    @Override public Optional<List<String>> activeAccounts(String caseId) {
        return optional(CaseParticipantsProtocol.ACTIVE, caseId, new TypeReference<List<String>>() {}, "community.case-active-accounts");
    }
    private <T> Optional<T> optional(String path, String caseId, TypeReference<T> type, String operation) {
        try {
            return Optional.of(exchange(queryPath(path, "caseId", caseId), type, operation, CaseParticipantsProtocol.MAX_RESPONSE_BYTES, value -> true));
        } catch (RemoteReadException failure) {
            if (failure.status() == 404 && "NOT_FOUND".equals(failure.remoteCode())) return Optional.empty();
            throw failure;
        }
    }
    @Override public int visibleCount(String baseId, String accountId, Collection<String> managedGroups) {
        var query = new CaseVisibilityQueryDto(baseId, accountId, managedGroups == null ? null : new java.util.ArrayList<>(managedGroups));
        return exchange(CaseParticipantsProtocol.COUNT, CaseParticipantsProtocol.encode(query, mapper), new TypeReference<Integer>() {},
                "community.case-visible-count", 4096, value -> value >= 0);
    }
}

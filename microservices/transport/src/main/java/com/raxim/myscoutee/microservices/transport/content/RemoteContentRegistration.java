package com.raxim.myscoutee.microservices.transport.content;

import com.raxim.myscoutee.domain.content.api.ContentRegistration;
import java.net.URI;
import java.time.Duration;
import com.raxim.myscoutee.microservices.transport.common.RemoteReadTransport;
import io.micrometer.core.instrument.MeterRegistry;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

/** Bounded scoped call to the existing owner; no automatic retries. */
public final class RemoteContentRegistration extends RemoteReadTransport implements ContentRegistration {
    private final ObjectMapper mapper;
    public RemoteContentRegistration(URI origin, String token, boolean allowHttp, Duration connectTimeout,
            Duration requestTimeout, ObjectMapper mapper, MeterRegistry metrics) {
        super(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics); this.mapper = mapper;
    }
    @Override public com.raxim.myscoutee.domain.content.dto.ContentModerationDtos.Snapshot snapshot() {
        var command = new ContentRegistrationProtocol.Query(ContentRegistrationProtocol.Scope.current());
        if (!ContentRegistrationProtocol.valid(command)) throw new IllegalArgumentException("Invalid content-registration request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > ContentRegistrationProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("content-registration request exceeds byte limit");
        var result = ownerExchange(ContentRegistrationProtocol.SNAPSHOT, bytes, new TypeReference<com.raxim.myscoutee.domain.content.dto.ContentModerationDtos.Snapshot>() {},
                "content-registration.snapshot", ContentRegistrationProtocol.MAX_RESPONSE_BYTES, value -> value.settings() != null && value.counts() != null);
        return result;
    }
    @Override public com.raxim.myscoutee.domain.content.dto.ContentModerationDtos.Item register(String category, String sourceId, String ownerId, String title, String imageUrl) {
        var command = new ContentRegistrationProtocol.Register(ContentRegistrationProtocol.Scope.current(), category, sourceId, ownerId, title, imageUrl);
        if (!ContentRegistrationProtocol.valid(command)) throw new IllegalArgumentException("Invalid content-registration request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > ContentRegistrationProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("content-registration request exceeds byte limit");
        var result = ownerExchange(ContentRegistrationProtocol.REGISTER, bytes, new TypeReference<com.raxim.myscoutee.domain.content.dto.ContentModerationDtos.Item>() {},
                "content-registration.register", ContentRegistrationProtocol.MAX_RESPONSE_BYTES, value -> java.util.Objects.equals(category, value.category()) && java.util.Objects.equals(sourceId, value.sourceId()));
        return result;
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

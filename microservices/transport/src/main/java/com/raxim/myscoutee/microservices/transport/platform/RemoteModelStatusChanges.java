package com.raxim.myscoutee.microservices.transport.platform;

import java.net.URI;
import java.time.Duration;
import java.util.List;
import com.raxim.myscoutee.domain.platform.api.ModelStatusChanges;
import com.raxim.myscoutee.microservices.transport.common.RemoteReadTransport;
import io.micrometer.core.instrument.MeterRegistry;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

/** Existing owner operation through bounded scoped HTTP. No automatic retries. */
public final class RemoteModelStatusChanges extends RemoteReadTransport implements ModelStatusChanges {
    private final ObjectMapper mapper;
    public RemoteModelStatusChanges(URI origin, String token, boolean allowHttp, Duration connectTimeout,
            Duration requestTimeout, ObjectMapper mapper, MeterRegistry metrics) {
        super(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics); this.mapper = mapper;
    }
    @Override public com.raxim.myscoutee.domain.platform.dto.ModelStatusOutcomeDto applyForUser(String userId) {
        var command = new ModelStatusChangesProtocol.Command(ModelStatusChangesProtocol.Scope.current(), userId);
        if (!ModelStatusChangesProtocol.valid(command)) throw new IllegalArgumentException("Invalid model status command");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > ModelStatusChangesProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("Model status command exceeds byte limit");
        return exchange(ModelStatusChangesProtocol.PATH, bytes,
                new TypeReference<com.raxim.myscoutee.domain.platform.dto.ModelStatusOutcomeDto>() {},
                "model-status.apply", ModelStatusChangesProtocol.MAX_RESPONSE_BYTES,
                value -> value.eventSourceIds() != null && value.assetIds() != null);
    }
}

package com.raxim.myscoutee.microservices.transport.community;

import com.raxim.myscoutee.domain.community.api.CaseFeedbackPreparation;
import java.net.URI;
import java.time.Duration;
import com.raxim.myscoutee.microservices.transport.common.RemoteReadTransport;
import io.micrometer.core.instrument.MeterRegistry;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

/** Bounded scoped call to the existing owner; no automatic retries. */
public final class RemoteCaseFeedbackPreparation extends RemoteReadTransport implements CaseFeedbackPreparation {
    private final ObjectMapper mapper;
    public RemoteCaseFeedbackPreparation(URI origin, String token, boolean allowHttp, Duration connectTimeout,
            Duration requestTimeout, ObjectMapper mapper, MeterRegistry metrics) {
        super(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics); this.mapper = mapper;
    }
    @Override public int prepareSnapshot(String snapshot) {
        var command = new CaseFeedbackPreparationProtocol.Command(CaseFeedbackPreparationProtocol.Scope.current(), snapshot);
        if (!CaseFeedbackPreparationProtocol.valid(command)) throw new IllegalArgumentException("Invalid case-feedback-preparation request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > CaseFeedbackPreparationProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("case-feedback-preparation request exceeds byte limit");
        var result = exchange(CaseFeedbackPreparationProtocol.PREPARE, bytes, new TypeReference<CaseFeedbackPreparationProtocol.Result>() {},
                "case-feedback-preparation.prepare", CaseFeedbackPreparationProtocol.MAX_RESPONSE_BYTES, value -> value.count() != null && value.count() >= 0);
        return result.count();
    }
}

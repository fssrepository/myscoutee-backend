package com.raxim.myscoutee.microservices.transport.feedback;

import com.raxim.myscoutee.domain.feedback.api.FeedbackPreparation;
import java.net.URI;
import java.time.Duration;
import com.raxim.myscoutee.microservices.transport.common.RemoteReadTransport;
import io.micrometer.core.instrument.MeterRegistry;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

/** Bounded scoped call to the existing owner; no automatic retries. */
public final class RemoteFeedbackPreparation extends RemoteReadTransport implements FeedbackPreparation {
    private final ObjectMapper mapper;
    public RemoteFeedbackPreparation(URI origin, String token, boolean allowHttp, Duration connectTimeout,
            Duration requestTimeout, ObjectMapper mapper, MeterRegistry metrics) {
        super(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics); this.mapper = mapper;
    }
    @Override public int prepareSnapshot(String snapshot) {
        var command = new FeedbackPreparationProtocol.Command(FeedbackPreparationProtocol.Scope.current(), snapshot);
        if (!FeedbackPreparationProtocol.valid(command)) throw new IllegalArgumentException("Invalid feedback-preparation request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > FeedbackPreparationProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("feedback-preparation request exceeds byte limit");
        var result = exchange(FeedbackPreparationProtocol.PREPARE, bytes, new TypeReference<FeedbackPreparationProtocol.Result>() {},
                "feedback-preparation.prepare", FeedbackPreparationProtocol.MAX_RESPONSE_BYTES, value -> value.count() != null && value.count() >= 0);
        return result.count();
    }
}

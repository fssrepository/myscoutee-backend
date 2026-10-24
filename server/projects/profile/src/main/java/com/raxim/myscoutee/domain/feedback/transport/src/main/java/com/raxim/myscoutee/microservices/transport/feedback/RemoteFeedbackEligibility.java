package com.raxim.myscoutee.microservices.transport.feedback;

import com.raxim.myscoutee.domain.feedback.api.FeedbackEligibility;
import java.net.URI;
import java.time.Duration;
import com.raxim.myscoutee.microservices.transport.common.RemoteReadTransport;
import io.micrometer.core.instrument.MeterRegistry;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

/** Bounded scoped call to the existing owner; no automatic retries. */
public final class RemoteFeedbackEligibility extends RemoteReadTransport implements FeedbackEligibility {
    private final ObjectMapper mapper;
    public RemoteFeedbackEligibility(URI origin, String token, boolean allowHttp, Duration connectTimeout,
            Duration requestTimeout, ObjectMapper mapper, MeterRegistry metrics) {
        super(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics); this.mapper = mapper;
    }
    @Override public com.raxim.myscoutee.domain.feedback.api.FeedbackEligibility.Projection project(java.util.Collection<String> sourceIds, java.time.Instant now) {
        var command = new FeedbackEligibilityProtocol.Project(FeedbackEligibilityProtocol.Scope.current(), sourceIds, now);
        if (!FeedbackEligibilityProtocol.valid(command)) throw new IllegalArgumentException("Invalid feedback-eligibility request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > FeedbackEligibilityProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("feedback-eligibility request exceeds byte limit");
        var result = ownerExchange(FeedbackEligibilityProtocol.PROJECT, bytes, new TypeReference<com.raxim.myscoutee.domain.feedback.api.FeedbackEligibility.Projection>() {},
                "feedback-eligibility.project", FeedbackEligibilityProtocol.MAX_RESPONSE_BYTES, v -> v.changes()!=null && v.deltas()!=null && v.projectedSources()!=null && v.waitingSources()!=null);
        return result;
    }
    @Override public void complete(com.raxim.myscoutee.domain.feedback.api.FeedbackEligibility.Projection projection) {
        var command = new FeedbackEligibilityProtocol.Complete(FeedbackEligibilityProtocol.Scope.current(), projection);
        if (!FeedbackEligibilityProtocol.valid(command)) throw new IllegalArgumentException("Invalid feedback-eligibility request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > FeedbackEligibilityProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("feedback-eligibility request exceeds byte limit");
        var result = ownerExchange(FeedbackEligibilityProtocol.COMPLETE, bytes, new TypeReference<FeedbackEligibilityProtocol.Receipt>() {},
                "feedback-eligibility.complete", FeedbackEligibilityProtocol.MAX_RESPONSE_BYTES, v -> Boolean.TRUE.equals(v.completed()));
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

package com.raxim.myscoutee.microservices.transport.feedback;

import java.net.URI;
import java.time.Duration;
import java.util.List;
import java.util.Optional;
import com.raxim.myscoutee.domain.feedback.api.FeedbackDirectory;
import com.raxim.myscoutee.domain.feedback.dto.FeedbackAnswerDto;
import com.raxim.myscoutee.microservices.transport.common.RemoteReadTransport;
import io.micrometer.core.instrument.MeterRegistry;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

public final class RemoteFeedbackDirectory extends RemoteReadTransport implements FeedbackDirectory {
    public RemoteFeedbackDirectory(URI origin, String token, boolean allowHttp, Duration connectTimeout,
            Duration requestTimeout, ObjectMapper mapper, MeterRegistry metrics) {
        super(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics);
    }
    @Override public List<FeedbackAnswerDto> findByTargetUserIdOrderBySubmittedAtIsoDesc(String id) {
        return exchange(queryPath(FeedbackDirectoryProtocol.PATH, "id", id), new TypeReference<List<FeedbackAnswerDto>>() {}, "feedback-directory", FeedbackDirectoryProtocol.MAX_RESPONSE_BYTES, value -> true);
    }
}

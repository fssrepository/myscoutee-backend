package com.raxim.myscoutee.microservices.transport.chat;

import com.raxim.myscoutee.domain.chat.api.ChatMeasurement;
import com.raxim.myscoutee.common.measurement.EvidenceCursor;
import com.raxim.myscoutee.microservices.transport.common.RemoteMeasurementTransport;
import java.net.URI;
import java.time.*;
import io.micrometer.core.instrument.MeterRegistry;
import tools.jackson.databind.ObjectMapper;

public final class RemoteChatMeasurement extends RemoteMeasurementTransport implements ChatMeasurement {
    public RemoteChatMeasurement(URI origin, String token, boolean allowHttp, Duration connectTimeout,
            Duration requestTimeout, ObjectMapper mapper, MeterRegistry metrics) {
        super(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics);
    }
    @Override public EvidenceCursor messages(Instant startInclusive, Instant endExclusive) {
        return evidence(ChatMeasurementProtocol.MESSAGES, "chat-measurement.messages", startInclusive, endExclusive);
    }
}

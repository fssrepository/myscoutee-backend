package com.raxim.myscoutee.microservices.transport.affinity;

import com.raxim.myscoutee.microservices.transport.common.ProtocolFields;
import java.net.URI;
import java.time.Duration;
import java.util.List;
import com.raxim.myscoutee.domain.affinity.api.MeetingEvidence;
import com.raxim.myscoutee.microservices.transport.common.RemoteReadTransport;
import io.micrometer.core.instrument.MeterRegistry;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

/** Bounded existing bulk upserts; validate the complete input before sending the first batch. No retries. */
public final class RemoteMeetingEvidence extends RemoteReadTransport implements MeetingEvidence {
    private final ObjectMapper mapper;
    public RemoteMeetingEvidence(URI origin, String token, boolean allowHttp, Duration connectTimeout,
            Duration requestTimeout, ObjectMapper mapper, MeterRegistry metrics) {
        super(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics); this.mapper = mapper;
    }
    @Override public void record(List<Meeting> meetings) {
        if (meetings == null) throw new IllegalArgumentException("Missing meeting projections");
        for (int start = 0; start < meetings.size(); start += MeetingEvidenceProtocol.MAX_ITEMS)
            body(meetings.subList(start, Math.min(meetings.size(), start + MeetingEvidenceProtocol.MAX_ITEMS)));
        for (int start = 0; start < meetings.size(); start += MeetingEvidenceProtocol.MAX_ITEMS) {
            var batch = meetings.subList(start, Math.min(meetings.size(), start + MeetingEvidenceProtocol.MAX_ITEMS));
            exchange(MeetingEvidenceProtocol.PATH, body(batch), new TypeReference<ProtocolFields.Receipt>() {},
                    "meetings.record", MeetingEvidenceProtocol.MAX_RESPONSE_BYTES,
                    value -> Boolean.TRUE.equals(value.completed()));
        }
    }
    private byte[] body(List<Meeting> meetings) {
        var command = new MeetingEvidenceProtocol.Command(meetings);
        if (!MeetingEvidenceProtocol.valid(command)) throw new IllegalArgumentException("Invalid meeting projections");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > MeetingEvidenceProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("Meeting projections exceed byte limit");
        return bytes;
    }
}

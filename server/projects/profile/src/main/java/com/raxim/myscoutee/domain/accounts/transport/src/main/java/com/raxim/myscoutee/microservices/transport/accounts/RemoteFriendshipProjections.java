package com.raxim.myscoutee.microservices.transport.accounts;

import com.raxim.myscoutee.microservices.transport.common.ProtocolFields;
import java.net.URI;
import java.time.Duration;
import java.util.List;
import com.raxim.myscoutee.domain.accounts.api.FriendshipProjections;
import com.raxim.myscoutee.microservices.transport.common.RemoteReadTransport;
import io.micrometer.core.instrument.MeterRegistry;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

/** Bounded existing bulk upserts; validate the complete input before sending the first batch. No retries. */
public final class RemoteFriendshipProjections extends RemoteReadTransport implements FriendshipProjections {
    private final ObjectMapper mapper;
    public RemoteFriendshipProjections(URI origin, String token, boolean allowHttp, Duration connectTimeout,
            Duration requestTimeout, ObjectMapper mapper, MeterRegistry metrics) {
        super(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics); this.mapper = mapper;
    }
    @Override public void projectMeetings(List<Meeting> meetings) {
        if (meetings == null) throw new IllegalArgumentException("Missing meeting projections");
        for (int start = 0; start < meetings.size(); start += FriendshipProjectionsProtocol.MAX_ITEMS)
            body(meetings.subList(start, Math.min(meetings.size(), start + FriendshipProjectionsProtocol.MAX_ITEMS)));
        for (int start = 0; start < meetings.size(); start += FriendshipProjectionsProtocol.MAX_ITEMS) {
            var batch = meetings.subList(start, Math.min(meetings.size(), start + FriendshipProjectionsProtocol.MAX_ITEMS));
            exchange(FriendshipProjectionsProtocol.PATH, body(batch), new TypeReference<ProtocolFields.Receipt>() {},
                    "friendships.project", FriendshipProjectionsProtocol.MAX_RESPONSE_BYTES,
                    value -> Boolean.TRUE.equals(value.completed()));
        }
    }
    private byte[] body(List<Meeting> meetings) {
        var command = new FriendshipProjectionsProtocol.Command(meetings);
        if (!FriendshipProjectionsProtocol.valid(command)) throw new IllegalArgumentException("Invalid meeting projections");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > FriendshipProjectionsProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("Meeting projections exceed byte limit");
        return bytes;
    }
}

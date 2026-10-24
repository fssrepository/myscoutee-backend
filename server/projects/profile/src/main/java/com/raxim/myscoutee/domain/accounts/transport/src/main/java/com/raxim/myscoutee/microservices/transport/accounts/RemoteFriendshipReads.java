package com.raxim.myscoutee.microservices.transport.accounts;

import java.net.URI;
import java.time.Duration;
import java.util.Set;
import com.raxim.myscoutee.domain.accounts.api.FriendshipReads;
import com.raxim.myscoutee.microservices.transport.common.RemoteReadTransport;
import io.micrometer.core.instrument.MeterRegistry;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

/** Inherits the native request-local adjacency reuse; never caches across users, modes or requests. */
public final class RemoteFriendshipReads extends RemoteReadTransport implements FriendshipReads {
    private final ObjectMapper mapper;
    public RemoteFriendshipReads(URI origin, String token, boolean allowHttp, Duration connectTimeout,
            Duration requestTimeout, ObjectMapper mapper, MeterRegistry metrics) {
        super(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics); this.mapper = mapper;
    }
    @Override public boolean pairExists(String first, String second) {
        var query = new FriendshipReadsProtocol.PairQuery(first, second);
        return exchange(FriendshipReadsProtocol.PAIR, body(query, FriendshipReadsProtocol.valid(query)),
                new TypeReference<FriendshipReadsProtocol.Decision>() {}, "friendships.pair", 16384,
                value -> value.friends() != null).friends();
    }
    @Override public Set<String> loadFriendIds(String viewer) {
        var query = new FriendshipReadsProtocol.ViewerQuery(viewer);
        return Set.copyOf(exchange(FriendshipReadsProtocol.ADJACENCY, body(query, FriendshipReadsProtocol.valid(query)),
                new TypeReference<Set<String>>() {}, "friendships.adjacency", FriendshipReadsProtocol.MAX_RESPONSE_BYTES,
                values -> values.stream().allMatch(value -> value != null && value.length() <= 512 && !value.equals(viewer))));
    }
    private byte[] body(Object query, boolean valid) {
        if (!valid) throw new IllegalArgumentException("Invalid friendship query");
        byte[] bytes = mapper.writeValueAsBytes(query);
        if (bytes.length > FriendshipReadsProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("Friendship query exceeds byte limit");
        return bytes;
    }
}

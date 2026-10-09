package com.raxim.myscoutee.microservices.transport.accounts;

import java.util.function.Function;
import java.util.function.Predicate;
import com.raxim.myscoutee.domain.accounts.api.FriendshipReads;
import com.raxim.myscoutee.microservices.transport.common.ReadQueryBodies;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import tools.jackson.databind.*;

@RestController
public final class FriendshipReadsEndpoint {
    private final FriendshipReads owner;
    private final ObjectMapper mapper;
    public FriendshipReadsEndpoint(FriendshipReads owner, ObjectMapper mapper) { this.owner = owner; this.mapper = mapper; }
    @PostMapping(value = FriendshipReadsProtocol.PAIR, produces = "application/json")
    public ResponseEntity<?> pair(HttpServletRequest request) throws java.io.IOException {
        return read(request, FriendshipReadsProtocol.PairQuery.class, FriendshipReadsProtocol::valid,
                query -> new FriendshipReadsProtocol.Decision(owner.pairExists(query.first(), query.second())));
    }
    @PostMapping(value = FriendshipReadsProtocol.ADJACENCY, produces = "application/json")
    public ResponseEntity<?> adjacency(HttpServletRequest request) throws java.io.IOException {
        return read(request, FriendshipReadsProtocol.ViewerQuery.class, FriendshipReadsProtocol::valid,
                query -> owner.friendIds(query.viewer()));
    }
    private <T> ResponseEntity<?> read(HttpServletRequest request, Class<T> type, Predicate<T> valid, Function<T, Object> action)
            throws java.io.IOException {
        try {
            byte[] bytes = ReadQueryBodies.readBytes(request, FriendshipReadsProtocol.MAX_REQUEST_BYTES);
            T query;
            try {
                query = mapper.readerFor(type).with(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES)
                        .with(DeserializationFeature.FAIL_ON_TRAILING_TOKENS).readValue(bytes);
            } catch (RuntimeException invalid) { throw new ReadQueryBodies.RejectedQuery(400, "INVALID_REQUEST"); }
            if (!valid.test(query)) throw new ReadQueryBodies.RejectedQuery(400, "INVALID_REQUEST");
            return response(200, action.apply(query));
        } catch (ReadQueryBodies.RejectedQuery invalid) { return response(invalid.status(), new FriendshipReadsProtocol.Error(invalid.code())); }
        catch (RuntimeException unavailable) { return response(503, new FriendshipReadsProtocol.Error("FRIENDSHIP_READ_UNAVAILABLE")); }
    }
    private ResponseEntity<?> response(int status, Object body) { return ResponseEntity.status(status).cacheControl(CacheControl.noStore()).body(body); }
}

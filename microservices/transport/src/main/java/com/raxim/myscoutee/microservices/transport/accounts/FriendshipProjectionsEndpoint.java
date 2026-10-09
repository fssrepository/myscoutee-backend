package com.raxim.myscoutee.microservices.transport.accounts;

import java.util.function.Function;
import java.util.function.Predicate;
import com.raxim.myscoutee.domain.accounts.api.FriendshipProjections;
import com.raxim.myscoutee.microservices.transport.common.ReadQueryBodies;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import tools.jackson.databind.*;

@RestController
public final class FriendshipProjectionsEndpoint {
    private final FriendshipProjections owner;
    private final ObjectMapper mapper;
    public FriendshipProjectionsEndpoint(FriendshipProjections owner, ObjectMapper mapper) { this.owner = owner; this.mapper = mapper; }
    @PostMapping(value = FriendshipProjectionsProtocol.PATH, produces = "application/json")
    public ResponseEntity<?> project(HttpServletRequest request) throws java.io.IOException {
        return read(request, FriendshipProjectionsProtocol.Command.class, FriendshipProjectionsProtocol::valid,
                command -> { owner.projectMeetings(command.meetings()); return new FriendshipProjectionsProtocol.Receipt(true); });
    }
    private <T> ResponseEntity<?> read(HttpServletRequest request, Class<T> type, Predicate<T> valid, Function<T, Object> action)
            throws java.io.IOException {
        try {
            byte[] bytes = ReadQueryBodies.readBytes(request, FriendshipProjectionsProtocol.MAX_REQUEST_BYTES);
            T query;
            try {
                query = mapper.readerFor(type).with(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES)
                        .with(DeserializationFeature.FAIL_ON_TRAILING_TOKENS).with(DeserializationFeature.FAIL_ON_NULL_FOR_PRIMITIVES).readValue(bytes);
            } catch (RuntimeException invalid) { throw new ReadQueryBodies.RejectedQuery(400, "INVALID_REQUEST"); }
            if (!valid.test(query)) throw new ReadQueryBodies.RejectedQuery(400, "INVALID_REQUEST");
            return response(200, action.apply(query));
        } catch (ReadQueryBodies.RejectedQuery invalid) { return response(invalid.status(), new FriendshipProjectionsProtocol.Error(invalid.code())); }
        catch (RuntimeException unavailable) { return response(503, new FriendshipProjectionsProtocol.Error("FRIENDSHIP_PROJECTION_OUTCOME_UNKNOWN")); }
    }
    private ResponseEntity<?> response(int status, Object body) { return ResponseEntity.status(status).cacheControl(CacheControl.noStore()).body(body); }
}

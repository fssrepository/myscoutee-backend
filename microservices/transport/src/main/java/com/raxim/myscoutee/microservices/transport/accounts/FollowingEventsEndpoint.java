package com.raxim.myscoutee.microservices.transport.accounts;

import java.util.function.Function;
import java.util.function.Predicate;
import com.raxim.myscoutee.domain.accounts.api.FollowingEvents;
import com.raxim.myscoutee.microservices.transport.common.ReadQueryBodies;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import tools.jackson.databind.*;

@RestController
public final class FollowingEventsEndpoint {
    private final FollowingEvents owner;
    private final ObjectMapper mapper;
    public FollowingEventsEndpoint(FollowingEvents owner, ObjectMapper mapper) { this.owner = owner; this.mapper = mapper; }
    @PostMapping(value = FollowingEventsProtocol.ORGANIZERS, produces = "application/json")
    public ResponseEntity<?> organizers(HttpServletRequest request) throws java.io.IOException {
        return read(request, FollowingEventsProtocol.ProfileQuery.class, FollowingEventsProtocol::valid,
                query -> owner.organizerIds(query.profileId()));
    }
    @PostMapping(value = FollowingEventsProtocol.REFRESH, produces = "application/json")
    public ResponseEntity<?> refresh(HttpServletRequest request) throws java.io.IOException {
        return read(request, FollowingEventsProtocol.RefreshCommand.class, FollowingEventsProtocol::valid,
                command -> { owner.refreshForViewers(command.ids()); return new FollowingEventsProtocol.Receipt(true); });
    }
    private <T> ResponseEntity<?> read(HttpServletRequest request, Class<T> type, Predicate<T> valid, Function<T, Object> action)
            throws java.io.IOException {
        try {
            byte[] bytes = ReadQueryBodies.readBytes(request, FollowingEventsProtocol.MAX_REQUEST_BYTES);
            T query;
            try {
                query = mapper.readerFor(type).with(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES)
                        .with(DeserializationFeature.FAIL_ON_TRAILING_TOKENS).readValue(bytes);
            } catch (RuntimeException invalid) { throw new ReadQueryBodies.RejectedQuery(400, "INVALID_REQUEST"); }
            if (!valid.test(query)) throw new ReadQueryBodies.RejectedQuery(400, "INVALID_REQUEST");
            return response(200, action.apply(query));
        } catch (ReadQueryBodies.RejectedQuery invalid) { return response(invalid.status(), new FollowingEventsProtocol.Error(invalid.code())); }
        catch (org.springframework.web.server.ResponseStatusException rejected) {
            int status = rejected.getStatusCode().value();
            if (status == 404 || status == 409)
                return response(status, new FollowingEventsProtocol.Error(status == 404 ? "USER_NOT_FOUND" : "FOLLOWING_CONFLICT"));
            return response(503, new FollowingEventsProtocol.Error("FOLLOWING_OUTCOME_UNKNOWN"));
        }
        catch (RuntimeException unavailable) { return response(503, new FollowingEventsProtocol.Error("FOLLOWING_OUTCOME_UNKNOWN")); }
    }
    private ResponseEntity<?> response(int status, Object body) { return ResponseEntity.status(status).cacheControl(CacheControl.noStore()).body(body); }
}

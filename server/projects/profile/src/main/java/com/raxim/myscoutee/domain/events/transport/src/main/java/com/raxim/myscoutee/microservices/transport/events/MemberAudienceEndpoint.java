package com.raxim.myscoutee.microservices.transport.events;

import java.util.function.Function;
import java.util.function.Predicate;
import com.raxim.myscoutee.domain.events.api.MemberAudience;
import com.raxim.myscoutee.microservices.transport.common.ReadQueryBodies;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import tools.jackson.databind.*;

@RestController
public final class MemberAudienceEndpoint {
    private final MemberAudience owner;
    private final ObjectMapper mapper;
    public MemberAudienceEndpoint(MemberAudience owner, ObjectMapper mapper) { this.owner = owner; this.mapper = mapper; }
    @PostMapping(value = MemberAudienceProtocol.QUERY, produces = "application/json")
    public ResponseEntity<?> query(HttpServletRequest request) throws java.io.IOException {
        return read(request, MemberAudienceProtocol.Query.class, MemberAudienceProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> new MemberAudienceProtocol.Result(true, owner.queryNotificationAudience(command.ownerType(), command.ownerId()))));
    }
    private <T> ResponseEntity<?> read(HttpServletRequest request, Class<T> type, Predicate<T> valid, Function<T, Object> action)
            throws java.io.IOException {
        try {
            byte[] bytes = ReadQueryBodies.readBytes(request, MemberAudienceProtocol.MAX_REQUEST_BYTES);
            T query = ReadQueryBodies.decode(bytes, mapper, type, valid, true);
            return response(200, action.apply(query));
        } catch (ReadQueryBodies.RejectedQuery invalid) { return response(invalid.status(), new MemberAudienceProtocol.Error(invalid.code())); }
        catch (RuntimeException unavailable) { return response(503, new MemberAudienceProtocol.Error("MEMBER_AUDIENCE_UNAVAILABLE")); }
    }
    private ResponseEntity<?> response(int status, Object body) { return ResponseEntity.status(status).cacheControl(CacheControl.noStore()).body(body); }
}

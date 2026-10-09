package com.raxim.myscoutee.microservices.transport.administration;

import com.raxim.myscoutee.domain.administration.api.AdminAudience;
import com.raxim.myscoutee.microservices.transport.common.ReadQueryBodies;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import tools.jackson.databind.*;

@RestController
public final class AdminAudienceEndpoint {
    private final AdminAudience owner;
    private final ObjectMapper mapper;
    public AdminAudienceEndpoint(AdminAudience owner, ObjectMapper mapper) { this.owner = owner; this.mapper = mapper; }
    @PostMapping(value = AdminAudienceProtocol.PATH, produces = "application/json")
    public ResponseEntity<?> read(HttpServletRequest request) throws java.io.IOException {
        try {
            byte[] body = ReadQueryBodies.readBytes(request, AdminAudienceProtocol.MAX_REQUEST_BYTES);
            AdminAudienceProtocol.Query query;
            try {
                query = mapper.readerFor(AdminAudienceProtocol.Query.class).with(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES)
                        .with(DeserializationFeature.FAIL_ON_TRAILING_TOKENS).readValue(body);
            } catch (RuntimeException invalid) { throw new ReadQueryBodies.RejectedQuery(400, "INVALID_REQUEST"); }
            if (!AdminAudienceProtocol.valid(query)) throw new ReadQueryBodies.RejectedQuery(400, "INVALID_REQUEST");
            return response(200, java.util.Objects.requireNonNull(owner.adminNotificationRecipientUserIds(query.actorUserId())));
        } catch (ReadQueryBodies.RejectedQuery invalid) { return response(invalid.status(), new AdminAudienceProtocol.Error(invalid.code())); }
        catch (RuntimeException unavailable) { return response(503, new AdminAudienceProtocol.Error("ADMIN_AUDIENCE_UNAVAILABLE")); }
    }
    private ResponseEntity<?> response(int status, Object body) {
        return ResponseEntity.status(status).cacheControl(CacheControl.noStore()).body(body);
    }
}

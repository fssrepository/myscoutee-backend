package com.raxim.myscoutee.microservices.transport.help;

import com.raxim.myscoutee.domain.help.api.PublicHelpContent;
import com.raxim.myscoutee.microservices.transport.common.ReadQueryBodies;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import tools.jackson.databind.*;

@RestController
public final class PublicHelpContentEndpoint {
    private final PublicHelpContent owner;
    private final ObjectMapper mapper;
    public PublicHelpContentEndpoint(PublicHelpContent owner, ObjectMapper mapper) { this.owner = owner; this.mapper = mapper; }
    @PostMapping(value = PublicHelpContentProtocol.PATH, produces = "application/json")
    public ResponseEntity<?> read(HttpServletRequest request) throws java.io.IOException {
        try {
            byte[] bytes = ReadQueryBodies.readBytes(request, PublicHelpContentProtocol.MAX_REQUEST_BYTES);
            PublicHelpContentProtocol.Query query;
            try {
                query = mapper.readerFor(PublicHelpContentProtocol.Query.class).with(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES)
                        .with(DeserializationFeature.FAIL_ON_TRAILING_TOKENS).readValue(bytes);
            } catch (RuntimeException invalid) { throw new ReadQueryBodies.RejectedQuery(400, "INVALID_REQUEST"); }
            if (!PublicHelpContentProtocol.valid(query)) throw new ReadQueryBodies.RejectedQuery(400, "INVALID_REQUEST");
            return response(200, java.util.Objects.requireNonNull(owner.activeState(query.documentType(), query.lang(),
                    query.acceptLanguage(), query.contextKey(), query.baseGroupId())));
        } catch (ReadQueryBodies.RejectedQuery invalid) { return response(invalid.status(), new PublicHelpContentProtocol.Error(invalid.code())); }
        catch (ResponseStatusException rejected) { return response(rejected.getStatusCode().value(), new PublicHelpContentProtocol.Error("OWNER_REJECTED")); }
        catch (RuntimeException unavailable) { return response(503, new PublicHelpContentProtocol.Error("HELP_CONTENT_UNAVAILABLE")); }
    }
    private ResponseEntity<?> response(int status, Object body) { return ResponseEntity.status(status).cacheControl(CacheControl.noStore()).body(body); }
}

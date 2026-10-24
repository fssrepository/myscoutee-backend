package com.raxim.myscoutee.microservices.transport.accounts;

import com.raxim.myscoutee.domain.accounts.api.ContactDirectory;
import com.raxim.myscoutee.microservices.transport.common.ReadQueryBodies;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import tools.jackson.databind.*;

@RestController
public final class ContactDirectoryEndpoint {
    private final ContactDirectory owner;
    private final ObjectMapper mapper;
    public ContactDirectoryEndpoint(ContactDirectory owner, ObjectMapper mapper) { this.owner = owner; this.mapper = mapper; }
    @PostMapping(value = ContactDirectoryProtocol.PATH, produces = "application/json")
    public ResponseEntity<?> read(HttpServletRequest request) throws java.io.IOException {
        try {
            byte[] body = ReadQueryBodies.readBytes(request, ContactDirectoryProtocol.MAX_REQUEST_BYTES);
            ContactDirectoryProtocol.Query query;
            try {
                query = mapper.readerFor(ContactDirectoryProtocol.Query.class).with(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES)
                        .with(DeserializationFeature.FAIL_ON_TRAILING_TOKENS).readValue(body);
            } catch (RuntimeException invalid) { throw new ReadQueryBodies.RejectedQuery(400, "INVALID_REQUEST"); }
            if (!ContactDirectoryProtocol.valid(query)) throw new ReadQueryBodies.RejectedQuery(400, "INVALID_REQUEST");
            return response(200, java.util.Objects.requireNonNull(owner.savedCandidateIds(query.userId())));
        } catch (ReadQueryBodies.RejectedQuery invalid) { return response(invalid.status(), new ContactDirectoryProtocol.Error(invalid.code())); }
        catch (RuntimeException unavailable) { return response(503, new ContactDirectoryProtocol.Error("CONTACT_DIRECTORY_UNAVAILABLE")); }
    }
    private ResponseEntity<?> response(int status, Object body) {
        return ResponseEntity.status(status).cacheControl(CacheControl.noStore()).body(body);
    }
}

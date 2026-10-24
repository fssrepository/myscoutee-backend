package com.raxim.myscoutee.microservices.transport.accounts;

import java.util.function.Function;
import java.util.function.Predicate;
import com.raxim.myscoutee.domain.accounts.api.EmailProfiles;
import com.raxim.myscoutee.domain.accounts.dto.EmailProfileDto;
import com.raxim.myscoutee.microservices.transport.common.ReadQueryBodies;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import tools.jackson.databind.*;

@RestController
public final class EmailProfilesEndpoint {
    private final EmailProfiles owner;
    private final ObjectMapper mapper;
    public EmailProfilesEndpoint(EmailProfiles owner, ObjectMapper mapper) { this.owner = owner; this.mapper = mapper; }
    @PostMapping(value = EmailProfilesProtocol.SINGLE, produces = "application/json")
    public ResponseEntity<?> single(HttpServletRequest request) throws java.io.IOException {
        return read(request, EmailProfilesProtocol.SingleQuery.class, EmailProfilesProtocol::valid,
                query -> new EmailProfilesProtocol.SingleResult(true, owner.findByUserId(query.userId()).map(EmailProfileDto::from).orElse(null)));
    }
    @PostMapping(value = EmailProfilesProtocol.BATCH, produces = "application/json")
    public ResponseEntity<?> batch(HttpServletRequest request) throws java.io.IOException {
        return read(request, EmailProfilesProtocol.BatchQuery.class, EmailProfilesProtocol::valid,
                query -> owner.findByUserIdIn(query.userIds()).stream().map(EmailProfileDto::from).toList());
    }
    @PostMapping(value = EmailProfilesProtocol.ALL, produces = "application/json")
    public ResponseEntity<?> all(HttpServletRequest request) throws java.io.IOException {
        return read(request, EmailProfilesProtocol.AllQuery.class, java.util.Objects::nonNull,
                query -> owner.findAll().stream().map(EmailProfileDto::from).toList());
    }
    private <T> ResponseEntity<?> read(HttpServletRequest request, Class<T> type, Predicate<T> valid, Function<T, Object> action)
            throws java.io.IOException {
        try {
            byte[] bytes = ReadQueryBodies.readBytes(request, EmailProfilesProtocol.MAX_REQUEST_BYTES);
            T query = ReadQueryBodies.decode(bytes, mapper, type, valid, false);
            return response(200, action.apply(query));
        } catch (ReadQueryBodies.RejectedQuery invalid) { return response(invalid.status(), new EmailProfilesProtocol.Error(invalid.code())); }
        catch (RuntimeException unavailable) { return response(503, new EmailProfilesProtocol.Error("EMAIL_PROFILES_UNAVAILABLE")); }
    }
    private ResponseEntity<?> response(int status, Object body) { return ResponseEntity.status(status).cacheControl(CacheControl.noStore()).body(body); }
}

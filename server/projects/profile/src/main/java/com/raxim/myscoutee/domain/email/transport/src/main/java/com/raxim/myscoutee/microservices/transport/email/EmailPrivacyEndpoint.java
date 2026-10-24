package com.raxim.myscoutee.microservices.transport.email;

import com.raxim.myscoutee.microservices.transport.common.ProtocolFields;

import java.util.function.Function;
import java.util.function.Predicate;
import com.raxim.myscoutee.domain.email.api.EmailPrivacy;
import com.raxim.myscoutee.microservices.transport.common.ReadQueryBodies;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import tools.jackson.databind.*;

@RestController
public final class EmailPrivacyEndpoint {
    private final EmailPrivacy owner;
    private final ObjectMapper mapper;
    public EmailPrivacyEndpoint(EmailPrivacy owner, ObjectMapper mapper) { this.owner = owner; this.mapper = mapper; }
    @PostMapping(value = EmailPrivacyProtocol.PURGE_DELIVERY_DATA, produces = "application/json")
    public ResponseEntity<?> purgeDeliveryData(HttpServletRequest request) throws java.io.IOException {
        return read(request, ProtocolFields.UserCommand.class, EmailPrivacyProtocol::valid,
                command -> com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(),
                        () -> { owner.purgeDeliveryData(command.userId()); return new ProtocolFields.Receipt(true); }));
    }
    @PostMapping(value = EmailPrivacyProtocol.ANONYMIZE_AUTHORS, produces = "application/json")
    public ResponseEntity<?> anonymizeAuthors(HttpServletRequest request) throws java.io.IOException {
        return read(request, ProtocolFields.UserCommand.class, EmailPrivacyProtocol::valid,
                command -> com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(),
                        () -> { owner.anonymizeAuthors(command.userId()); return new ProtocolFields.Receipt(true); }));
    }
    private <T> ResponseEntity<?> read(HttpServletRequest request, Class<T> type, Predicate<T> valid, Function<T, Object> action)
            throws java.io.IOException {
        try {
            byte[] bytes = ReadQueryBodies.readBytes(request, EmailPrivacyProtocol.MAX_REQUEST_BYTES);
            T query = ReadQueryBodies.decode(bytes, mapper, type, valid, true);
            return response(200, action.apply(query));
        } catch (ReadQueryBodies.RejectedQuery invalid) { return response(invalid.status(), new ProtocolFields.Error(invalid.code())); }
        catch (RuntimeException unavailable) { return response(503, new ProtocolFields.Error("PURGE_OUTCOME_UNKNOWN")); }
    }
    private ResponseEntity<?> response(int status, Object body) { return ResponseEntity.status(status).cacheControl(CacheControl.noStore()).body(body); }
}

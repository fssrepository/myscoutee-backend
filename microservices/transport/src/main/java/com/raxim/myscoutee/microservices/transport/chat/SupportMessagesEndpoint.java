package com.raxim.myscoutee.microservices.transport.chat;

import java.util.function.Function;
import java.util.function.Predicate;
import com.raxim.myscoutee.domain.chat.api.SupportMessages;
import com.raxim.myscoutee.microservices.transport.common.ReadQueryBodies;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import tools.jackson.databind.*;

@RestController
public final class SupportMessagesEndpoint {
    private final SupportMessages owner;
    private final ObjectMapper mapper;
    public SupportMessagesEndpoint(SupportMessages owner, ObjectMapper mapper) { this.owner = owner; this.mapper = mapper; }
    @PostMapping(value = SupportMessagesProtocol.SEND, produces = "application/json")
    public ResponseEntity<?> send(HttpServletRequest request) throws java.io.IOException {
        return read(request, SupportMessagesProtocol.Send.class, SupportMessagesProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> new SupportMessagesProtocol.Result(true, owner.sendAdminSupportMessage(command.targetUserId(), command.adminUserId(), command.adminName(), command.adminInitials(), command.text(), command.supportStatus(), command.stableMessageId()))));
    }
    private <T> ResponseEntity<?> read(HttpServletRequest request, Class<T> type, Predicate<T> valid, Function<T, Object> action)
            throws java.io.IOException {
        try {
            byte[] bytes = ReadQueryBodies.readBytes(request, SupportMessagesProtocol.MAX_REQUEST_BYTES);
            T query;
            try {
                query = mapper.readerFor(type).with(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES)
                        .with(DeserializationFeature.FAIL_ON_TRAILING_TOKENS).with(DeserializationFeature.FAIL_ON_NULL_FOR_PRIMITIVES).readValue(bytes);
            } catch (RuntimeException invalid) { throw new ReadQueryBodies.RejectedQuery(400, "INVALID_REQUEST"); }
            if (!valid.test(query)) throw new ReadQueryBodies.RejectedQuery(400, "INVALID_REQUEST");
            return response(200, action.apply(query));
        } catch (ReadQueryBodies.RejectedQuery invalid) { return response(invalid.status(), new SupportMessagesProtocol.Error(invalid.code())); }
        catch (org.springframework.web.server.ResponseStatusException rejected) {
            return response(rejected.getStatusCode().value(), new SupportMessagesProtocol.Error("OWNER_REJECTED"));
        }
        catch (RuntimeException unavailable) { return response(503, new SupportMessagesProtocol.Error("SUPPORT_MESSAGES_UNAVAILABLE")); }
    }
    private ResponseEntity<?> response(int status, Object body) { return ResponseEntity.status(status).cacheControl(CacheControl.noStore()).body(body); }
}

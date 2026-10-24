package com.raxim.myscoutee.microservices.transport.content;

import com.raxim.myscoutee.microservices.transport.common.ProtocolFields;

import java.util.function.Function;
import java.util.function.Predicate;
import com.raxim.myscoutee.domain.content.api.ContentPrivacy;
import com.raxim.myscoutee.microservices.transport.common.ReadQueryBodies;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import tools.jackson.databind.*;

@RestController
public final class ContentPrivacyEndpoint {
    private final ContentPrivacy owner;
    private final ObjectMapper mapper;
    public ContentPrivacyEndpoint(ContentPrivacy owner, ObjectMapper mapper) { this.owner = owner; this.mapper = mapper; }
    @PostMapping(value = ContentPrivacyProtocol.PURGE_IDEA_POSTS, produces = "application/json")
    public ResponseEntity<?> purgeIdeaPosts(HttpServletRequest request) throws java.io.IOException {
        return read(request, ProtocolFields.UserCommand.class, ContentPrivacyProtocol::valid,
                command -> com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(),
                        () -> { owner.purgeIdeaPosts(command.userId()); return new ProtocolFields.Receipt(true); }));
    }
    @PostMapping(value = ContentPrivacyProtocol.PURGE_FEEDBACK, produces = "application/json")
    public ResponseEntity<?> purgeFeedback(HttpServletRequest request) throws java.io.IOException {
        return read(request, ProtocolFields.UserCommand.class, ContentPrivacyProtocol::valid,
                command -> com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(),
                        () -> { owner.purgeFeedback(command.userId()); return new ProtocolFields.Receipt(true); }));
    }
    @PostMapping(value = ContentPrivacyProtocol.PURGE_REPORTS, produces = "application/json")
    public ResponseEntity<?> purgeReports(HttpServletRequest request) throws java.io.IOException {
        return read(request, ProtocolFields.UserCommand.class, ContentPrivacyProtocol::valid,
                command -> com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(),
                        () -> { owner.purgeReports(command.userId()); return new ProtocolFields.Receipt(true); }));
    }
    @PostMapping(value = ContentPrivacyProtocol.PURGE_FEED_VIEWS, produces = "application/json")
    public ResponseEntity<?> purgeFeedViews(HttpServletRequest request) throws java.io.IOException {
        return read(request, ProtocolFields.UserCommand.class, ContentPrivacyProtocol::valid,
                command -> com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(),
                        () -> { owner.purgeFeedViews(command.userId()); return new ProtocolFields.Receipt(true); }));
    }
    @PostMapping(value = ContentPrivacyProtocol.PURGE_SHARE_TOKENS, produces = "application/json")
    public ResponseEntity<?> purgeShareTokens(HttpServletRequest request) throws java.io.IOException {
        return read(request, ProtocolFields.UserCommand.class, ContentPrivacyProtocol::valid,
                command -> com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(),
                        () -> { owner.purgeShareTokens(command.userId()); return new ProtocolFields.Receipt(true); }));
    }
    private <T> ResponseEntity<?> read(HttpServletRequest request, Class<T> type, Predicate<T> valid, Function<T, Object> action)
            throws java.io.IOException {
        try {
            byte[] bytes = ReadQueryBodies.readBytes(request, ContentPrivacyProtocol.MAX_REQUEST_BYTES);
            T query = ReadQueryBodies.decode(bytes, mapper, type, valid, true);
            return response(200, action.apply(query));
        } catch (ReadQueryBodies.RejectedQuery invalid) { return response(invalid.status(), new ProtocolFields.Error(invalid.code())); }
        catch (RuntimeException unavailable) { return response(503, new ProtocolFields.Error("PURGE_OUTCOME_UNKNOWN")); }
    }
    private ResponseEntity<?> response(int status, Object body) { return ResponseEntity.status(status).cacheControl(CacheControl.noStore()).body(body); }
}

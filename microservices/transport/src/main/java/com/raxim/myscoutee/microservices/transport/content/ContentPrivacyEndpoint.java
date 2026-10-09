package com.raxim.myscoutee.microservices.transport.content;

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
        return read(request, ContentPrivacyProtocol.UserCommand.class, ContentPrivacyProtocol::valid,
                command -> com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(),
                        () -> { owner.purgeIdeaPosts(command.userId()); return new ContentPrivacyProtocol.Receipt(true); }));
    }
    @PostMapping(value = ContentPrivacyProtocol.PURGE_FEEDBACK, produces = "application/json")
    public ResponseEntity<?> purgeFeedback(HttpServletRequest request) throws java.io.IOException {
        return read(request, ContentPrivacyProtocol.UserCommand.class, ContentPrivacyProtocol::valid,
                command -> com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(),
                        () -> { owner.purgeFeedback(command.userId()); return new ContentPrivacyProtocol.Receipt(true); }));
    }
    @PostMapping(value = ContentPrivacyProtocol.PURGE_REPORTS, produces = "application/json")
    public ResponseEntity<?> purgeReports(HttpServletRequest request) throws java.io.IOException {
        return read(request, ContentPrivacyProtocol.UserCommand.class, ContentPrivacyProtocol::valid,
                command -> com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(),
                        () -> { owner.purgeReports(command.userId()); return new ContentPrivacyProtocol.Receipt(true); }));
    }
    @PostMapping(value = ContentPrivacyProtocol.PURGE_FEED_VIEWS, produces = "application/json")
    public ResponseEntity<?> purgeFeedViews(HttpServletRequest request) throws java.io.IOException {
        return read(request, ContentPrivacyProtocol.UserCommand.class, ContentPrivacyProtocol::valid,
                command -> com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(),
                        () -> { owner.purgeFeedViews(command.userId()); return new ContentPrivacyProtocol.Receipt(true); }));
    }
    @PostMapping(value = ContentPrivacyProtocol.PURGE_SHARE_TOKENS, produces = "application/json")
    public ResponseEntity<?> purgeShareTokens(HttpServletRequest request) throws java.io.IOException {
        return read(request, ContentPrivacyProtocol.UserCommand.class, ContentPrivacyProtocol::valid,
                command -> com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(),
                        () -> { owner.purgeShareTokens(command.userId()); return new ContentPrivacyProtocol.Receipt(true); }));
    }
    private <T> ResponseEntity<?> read(HttpServletRequest request, Class<T> type, Predicate<T> valid, Function<T, Object> action)
            throws java.io.IOException {
        try {
            byte[] bytes = ReadQueryBodies.readBytes(request, ContentPrivacyProtocol.MAX_REQUEST_BYTES);
            T query;
            try {
                query = mapper.readerFor(type).with(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES)
                        .with(DeserializationFeature.FAIL_ON_TRAILING_TOKENS).with(DeserializationFeature.FAIL_ON_NULL_FOR_PRIMITIVES).readValue(bytes);
            } catch (RuntimeException invalid) { throw new ReadQueryBodies.RejectedQuery(400, "INVALID_REQUEST"); }
            if (!valid.test(query)) throw new ReadQueryBodies.RejectedQuery(400, "INVALID_REQUEST");
            return response(200, action.apply(query));
        } catch (ReadQueryBodies.RejectedQuery invalid) { return response(invalid.status(), new ContentPrivacyProtocol.Error(invalid.code())); }
        catch (RuntimeException unavailable) { return response(503, new ContentPrivacyProtocol.Error("PURGE_OUTCOME_UNKNOWN")); }
    }
    private ResponseEntity<?> response(int status, Object body) { return ResponseEntity.status(status).cacheControl(CacheControl.noStore()).body(body); }
}

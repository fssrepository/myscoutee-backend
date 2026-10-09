package com.raxim.myscoutee.microservices.transport.chat;

import java.util.function.Function;
import java.util.function.Predicate;
import com.raxim.myscoutee.domain.chat.api.AttachmentLifecycle;
import com.raxim.myscoutee.microservices.transport.common.ReadQueryBodies;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import tools.jackson.databind.*;

@RestController
public final class AttachmentLifecycleEndpoint {
    private final AttachmentLifecycle owner;
    private final ObjectMapper mapper;
    public AttachmentLifecycleEndpoint(AttachmentLifecycle owner, ObjectMapper mapper) { this.owner = owner; this.mapper = mapper; }
    @PostMapping(value = AttachmentLifecycleProtocol.PROJECT, produces = "application/json")
    public ResponseEntity<?> project(HttpServletRequest request) throws java.io.IOException {
        return read(request, AttachmentLifecycleProtocol.Project.class, AttachmentLifecycleProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> receipt(() -> owner.project(command.projection()))));
    }
    @PostMapping(value = AttachmentLifecycleProtocol.EVENT_UNAVAILABLE, produces = "application/json")
    public ResponseEntity<?> event_unavailable(HttpServletRequest request) throws java.io.IOException {
        return read(request, AttachmentLifecycleProtocol.Change.class, AttachmentLifecycleProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> receipt(() -> owner.markEventUnavailable(command.id(), command.reason()))));
    }
    @PostMapping(value = AttachmentLifecycleProtocol.EVENT_AVAILABLE, produces = "application/json")
    public ResponseEntity<?> event_available(HttpServletRequest request) throws java.io.IOException {
        return read(request, AttachmentLifecycleProtocol.Change.class, AttachmentLifecycleProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> receipt(() -> owner.markEventAvailable(command.id()))));
    }
    @PostMapping(value = AttachmentLifecycleProtocol.ASSET_UNAVAILABLE, produces = "application/json")
    public ResponseEntity<?> asset_unavailable(HttpServletRequest request) throws java.io.IOException {
        return read(request, AttachmentLifecycleProtocol.Change.class, AttachmentLifecycleProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> receipt(() -> owner.markAssetUnavailable(command.id(), command.reason()))));
    }
    @PostMapping(value = AttachmentLifecycleProtocol.ASSET_AVAILABLE, produces = "application/json")
    public ResponseEntity<?> asset_available(HttpServletRequest request) throws java.io.IOException {
        return read(request, AttachmentLifecycleProtocol.Change.class, AttachmentLifecycleProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> receipt(() -> owner.markAssetAvailable(command.id()))));
    }
    private AttachmentLifecycleProtocol.Receipt receipt(Runnable action) { action.run(); return new AttachmentLifecycleProtocol.Receipt(true); }
    private <T> ResponseEntity<?> read(HttpServletRequest request, Class<T> type, Predicate<T> valid, Function<T, Object> action)
            throws java.io.IOException {
        try {
            byte[] bytes = ReadQueryBodies.readBytes(request, AttachmentLifecycleProtocol.MAX_REQUEST_BYTES);
            T query;
            try {
                query = mapper.readerFor(type).with(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES)
                        .with(DeserializationFeature.FAIL_ON_TRAILING_TOKENS).with(DeserializationFeature.FAIL_ON_NULL_FOR_PRIMITIVES).readValue(bytes);
            } catch (RuntimeException invalid) { throw new ReadQueryBodies.RejectedQuery(400, "INVALID_REQUEST"); }
            if (!valid.test(query)) throw new ReadQueryBodies.RejectedQuery(400, "INVALID_REQUEST");
            return response(200, action.apply(query));
        } catch (ReadQueryBodies.RejectedQuery invalid) { return response(invalid.status(), new AttachmentLifecycleProtocol.Error(invalid.code())); }
        catch (RuntimeException unavailable) { return response(503, new AttachmentLifecycleProtocol.Error("ATTACHMENT_LIFECYCLE_UNAVAILABLE")); }
    }
    private ResponseEntity<?> response(int status, Object body) { return ResponseEntity.status(status).cacheControl(CacheControl.noStore()).body(body); }
}

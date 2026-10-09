package com.raxim.myscoutee.microservices.transport.email;

import java.util.function.Function;
import java.util.function.Predicate;
import com.raxim.myscoutee.domain.email.api.ScheduledMessages;
import com.raxim.myscoutee.microservices.transport.common.ReadQueryBodies;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import tools.jackson.databind.*;

@RestController
public final class ScheduledMessagesEndpoint {
    private final ScheduledMessages owner;
    private final ObjectMapper mapper;
    public ScheduledMessagesEndpoint(ScheduledMessages owner, ObjectMapper mapper) { this.owner = owner; this.mapper = mapper; }
    @PostMapping(value = ScheduledMessagesProtocol.STAGES, produces = "application/json")
    public ResponseEntity<?> stages(HttpServletRequest request) throws java.io.IOException {
        return read(request, ScheduledMessagesProtocol.Event.class, ScheduledMessagesProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> owner.scheduleEventStageReminders(command.event(), command.actor()).stream().map(com.raxim.myscoutee.domain.email.dto.ScheduledMessageTaskDto::from).toList()));
    }
    @PostMapping(value = ScheduledMessagesProtocol.SUSPEND, produces = "application/json")
    public ResponseEntity<?> suspend(HttpServletRequest request) throws java.io.IOException {
        return read(request, ScheduledMessagesProtocol.Suspend.class, ScheduledMessagesProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> owner.suspendEventStageReminders(command.eventId(), command.actor()).stream().map(com.raxim.myscoutee.domain.email.dto.ScheduledMessageTaskDto::from).toList()));
    }
    @PostMapping(value = ScheduledMessagesProtocol.CASE, produces = "application/json")
    public ResponseEntity<?> caseFeedback(HttpServletRequest request) throws java.io.IOException {
        return read(request, ScheduledMessagesProtocol.Feedback.class, ScheduledMessagesProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> receipt(() -> owner.scheduleCaseFeedback(command.closed()))));
    }
    @PostMapping(value = ScheduledMessagesProtocol.DEFINITION, produces = "application/json")
    public ResponseEntity<?> definition(HttpServletRequest request) throws java.io.IOException {
        return read(request, ScheduledMessagesProtocol.Change.class, ScheduledMessagesProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> new ScheduledMessagesProtocol.Result(true, com.raxim.myscoutee.domain.email.dto.ScheduledMessageTaskDto.from(owner.scheduleEventDefinitionChanged(command.eventId(), command.title(), command.audience(), command.reasons(), command.actor())))));
    }
    @PostMapping(value = ScheduledMessagesProtocol.WATCHLIST, produces = "application/json")
    public ResponseEntity<?> watchlist(HttpServletRequest request) throws java.io.IOException {
        return read(request, ScheduledMessagesProtocol.Change.class, ScheduledMessagesProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> new ScheduledMessagesProtocol.Result(true, com.raxim.myscoutee.domain.email.dto.ScheduledMessageTaskDto.from(owner.scheduleEventWatchlistDefinitionChanged(command.eventId(), command.title(), command.audience(), command.reasons(), command.actor())))));
    }
    @PostMapping(value = ScheduledMessagesProtocol.LIFECYCLE_ONCE, produces = "application/json")
    public ResponseEntity<?> lifecycleOnce(HttpServletRequest request) throws java.io.IOException {
        return read(request, ScheduledMessagesProtocol.LifecycleOnce.class, ScheduledMessagesProtocol::valid, command -> {
            var c = command.change();
            return com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(c.scope().active(), c.scope().groupId(),
                () -> new ScheduledMessagesProtocol.Result(true, com.raxim.myscoutee.domain.email.dto.ScheduledMessageTaskDto.from(
                    owner.scheduleEventLifecycleChangedOnce(command.deliveryId(), c.eventId(), c.title(), c.audience(), c.reasons(), c.actor()))));
        });
    }
    @PostMapping(value = ScheduledMessagesProtocol.LIFECYCLE, produces = "application/json")
    public ResponseEntity<?> lifecycle(HttpServletRequest request) throws java.io.IOException {
        return read(request, ScheduledMessagesProtocol.Change.class, ScheduledMessagesProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> new ScheduledMessagesProtocol.Result(true, com.raxim.myscoutee.domain.email.dto.ScheduledMessageTaskDto.from(owner.scheduleEventLifecycleChanged(command.eventId(), command.title(), command.audience(), command.reasons(), command.actor())))));
    }
    private ScheduledMessagesProtocol.Receipt receipt(Runnable action) { action.run(); return new ScheduledMessagesProtocol.Receipt(true); }
    private <T> ResponseEntity<?> read(HttpServletRequest request, Class<T> type, Predicate<T> valid, Function<T, Object> action)
            throws java.io.IOException {
        try {
            byte[] bytes = ReadQueryBodies.readBytes(request, ScheduledMessagesProtocol.MAX_REQUEST_BYTES);
            T query;
            try {
                query = mapper.readerFor(type).with(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES)
                        .with(DeserializationFeature.FAIL_ON_TRAILING_TOKENS).with(DeserializationFeature.FAIL_ON_NULL_FOR_PRIMITIVES).readValue(bytes);
            } catch (RuntimeException invalid) { throw new ReadQueryBodies.RejectedQuery(400, "INVALID_REQUEST"); }
            if (!valid.test(query)) throw new ReadQueryBodies.RejectedQuery(400, "INVALID_REQUEST");
            return response(200, action.apply(query));
        } catch (ReadQueryBodies.RejectedQuery invalid) { return response(invalid.status(), new ScheduledMessagesProtocol.Error(invalid.code())); }
        catch (org.springframework.web.server.ResponseStatusException rejected) {
            return response(rejected.getStatusCode().value(), new ScheduledMessagesProtocol.Error("OWNER_REJECTED"));
        }
        catch (RuntimeException unavailable) { return response(503, new ScheduledMessagesProtocol.Error("SCHEDULED_MESSAGES_UNAVAILABLE")); }
    }
    private ResponseEntity<?> response(int status, Object body) { return ResponseEntity.status(status).cacheControl(CacheControl.noStore()).body(body); }
}

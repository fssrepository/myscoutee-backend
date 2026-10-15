package com.raxim.myscoutee.microservices.transport.email;

import com.raxim.myscoutee.domain.email.api.ScheduledMessages;
import java.net.URI;
import java.time.Duration;
import com.raxim.myscoutee.microservices.transport.common.RemoteReadTransport;
import io.micrometer.core.instrument.MeterRegistry;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

/** Bounded scoped call to the existing owner; no automatic retries. */
public final class RemoteScheduledMessages extends RemoteReadTransport implements ScheduledMessages {
    private final ObjectMapper mapper;
    public RemoteScheduledMessages(URI origin, String token, boolean allowHttp, Duration connectTimeout,
            Duration requestTimeout, ObjectMapper mapper, MeterRegistry metrics) {
        super(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics); this.mapper = mapper;
    }
    @Override public java.util.List<com.raxim.myscoutee.domain.email.dto.ScheduledMessageTaskDto> scheduleEventStageReminders(com.raxim.myscoutee.domain.events.api.EventSchedule event, String actor) {
        var command = new ScheduledMessagesProtocol.Event(ScheduledMessagesProtocol.Scope.current(), com.raxim.myscoutee.domain.events.dto.EventScheduleDto.from(event), actor);
        if (!ScheduledMessagesProtocol.valid(command)) throw new IllegalArgumentException("Invalid scheduled-messages request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > ScheduledMessagesProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("scheduled-messages request exceeds byte limit");
        var result = ownerExchange(ScheduledMessagesProtocol.STAGES, bytes, new TypeReference<java.util.List<com.raxim.myscoutee.domain.email.dto.ScheduledMessageTaskDto>>() {},
                "scheduled-messages.stages", ScheduledMessagesProtocol.MAX_RESPONSE_BYTES, v -> true);
        return result;
    }
    @Override public java.util.List<com.raxim.myscoutee.domain.email.dto.ScheduledMessageTaskDto> suspendEventStageReminders(String eventId, String actor) {
        var command = new ScheduledMessagesProtocol.Suspend(ScheduledMessagesProtocol.Scope.current(), eventId, actor);
        if (!ScheduledMessagesProtocol.valid(command)) throw new IllegalArgumentException("Invalid scheduled-messages request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > ScheduledMessagesProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("scheduled-messages request exceeds byte limit");
        var result = ownerExchange(ScheduledMessagesProtocol.SUSPEND, bytes, new TypeReference<java.util.List<com.raxim.myscoutee.domain.email.dto.ScheduledMessageTaskDto>>() {},
                "scheduled-messages.suspend", ScheduledMessagesProtocol.MAX_RESPONSE_BYTES, v -> true);
        return result;
    }
    @Override public void scheduleCaseFeedback(com.raxim.myscoutee.domain.feedback.api.FeedbackPreparation.Request closed) {
        var command = new ScheduledMessagesProtocol.Feedback(ScheduledMessagesProtocol.Scope.current(), closed);
        if (!ScheduledMessagesProtocol.valid(command)) throw new IllegalArgumentException("Invalid scheduled-messages request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > ScheduledMessagesProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("scheduled-messages request exceeds byte limit");
        var result = ownerExchange(ScheduledMessagesProtocol.CASE, bytes, new TypeReference<ScheduledMessagesProtocol.Receipt>() {},
                "scheduled-messages.case", ScheduledMessagesProtocol.MAX_RESPONSE_BYTES, v -> Boolean.TRUE.equals(v.completed()));
    }
    @Override public com.raxim.myscoutee.domain.email.dto.ScheduledMessageTaskDto scheduleEventDefinitionChanged(String eventId, String title, java.util.Collection<String> audience, java.util.Collection<String> reasons, String actor) {
        var command = new ScheduledMessagesProtocol.Change(ScheduledMessagesProtocol.Scope.current(), eventId, title, audience, reasons, actor);
        if (!ScheduledMessagesProtocol.valid(command)) throw new IllegalArgumentException("Invalid scheduled-messages request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > ScheduledMessagesProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("scheduled-messages request exceeds byte limit");
        var result = ownerExchange(ScheduledMessagesProtocol.DEFINITION, bytes, new TypeReference<ScheduledMessagesProtocol.Result>() {},
                "scheduled-messages.definition", ScheduledMessagesProtocol.MAX_RESPONSE_BYTES, v -> Boolean.TRUE.equals(v.resolved()));
        return result.value();
    }
    @Override public com.raxim.myscoutee.domain.email.dto.ScheduledMessageTaskDto scheduleEventWatchlistDefinitionChanged(String eventId, String title, java.util.Collection<String> audience, java.util.Collection<String> reasons, String actor) {
        var command = new ScheduledMessagesProtocol.Change(ScheduledMessagesProtocol.Scope.current(), eventId, title, audience, reasons, actor);
        if (!ScheduledMessagesProtocol.valid(command)) throw new IllegalArgumentException("Invalid scheduled-messages request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > ScheduledMessagesProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("scheduled-messages request exceeds byte limit");
        var result = ownerExchange(ScheduledMessagesProtocol.WATCHLIST, bytes, new TypeReference<ScheduledMessagesProtocol.Result>() {},
                "scheduled-messages.watchlist", ScheduledMessagesProtocol.MAX_RESPONSE_BYTES, v -> Boolean.TRUE.equals(v.resolved()));
        return result.value();
    }
    @Override public com.raxim.myscoutee.domain.email.dto.ScheduledMessageTaskDto scheduleEventLifecycleChangedOnce(String deliveryId, String eventId, String title, java.util.Collection<String> audience, java.util.Collection<String> reasons, String actor) {
        var command = new ScheduledMessagesProtocol.LifecycleOnce(deliveryId,
                new ScheduledMessagesProtocol.Change(ScheduledMessagesProtocol.Scope.current(), eventId, title, audience, reasons, actor));
        if (!ScheduledMessagesProtocol.valid(command)) throw new IllegalArgumentException("Invalid lifecycle notification command");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > ScheduledMessagesProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("Lifecycle notification exceeds byte limit");
        return exchange(ScheduledMessagesProtocol.LIFECYCLE_ONCE, bytes, new TypeReference<ScheduledMessagesProtocol.Result>() {},
                "scheduled-messages.lifecycle-once", ScheduledMessagesProtocol.MAX_RESPONSE_BYTES, v -> Boolean.TRUE.equals(v.resolved())).value();
    }
    @Override public com.raxim.myscoutee.domain.email.dto.ScheduledMessageTaskDto scheduleEventLifecycleChanged(String eventId, String title, java.util.Collection<String> audience, java.util.Collection<String> reasons, String actor) {
        var command = new ScheduledMessagesProtocol.Change(ScheduledMessagesProtocol.Scope.current(), eventId, title, audience, reasons, actor);
        if (!ScheduledMessagesProtocol.valid(command)) throw new IllegalArgumentException("Invalid scheduled-messages request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > ScheduledMessagesProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("scheduled-messages request exceeds byte limit");
        var result = ownerExchange(ScheduledMessagesProtocol.LIFECYCLE, bytes, new TypeReference<ScheduledMessagesProtocol.Result>() {},
                "scheduled-messages.lifecycle", ScheduledMessagesProtocol.MAX_RESPONSE_BYTES, v -> Boolean.TRUE.equals(v.resolved()));
        return result.value();
    }
    private <T> T ownerExchange(String path, byte[] bytes, TypeReference<T> type, String operation, int limit,
            java.util.function.Predicate<T> valid) {
        try { return exchange(path, bytes, type, operation, limit, valid); }
        catch (RemoteReadException failure) {
            if (failure.status() >= 400 && failure.status() < 500 && "OWNER_REJECTED".equals(failure.remoteCode()))
                throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatusCode.valueOf(failure.status()));
            throw failure;
        }
    }

}

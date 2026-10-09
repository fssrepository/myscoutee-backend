package com.raxim.myscoutee.microservices.transport.chat;

import java.util.function.Function;
import java.util.function.Predicate;
import com.raxim.myscoutee.domain.chat.api.EventConversations;
import com.raxim.myscoutee.microservices.transport.common.ReadQueryBodies;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import tools.jackson.databind.*;

@RestController
public final class EventConversationsEndpoint {
    private final EventConversations owner;
    private final ObjectMapper mapper;
    public EventConversationsEndpoint(EventConversations owner, ObjectMapper mapper) { this.owner = owner; this.mapper = mapper; }
    @PostMapping(value = EventConversationsProtocol.ENSURE, produces = "application/json")
    public ResponseEntity<?> ensure(HttpServletRequest request) throws java.io.IOException {
        return read(request, EventConversationsProtocol.Event.class, EventConversationsProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> new EventConversationsProtocol.Chat(true, owner.ensureMainEventChat(command.event(), command.participants()))));
    }
    @PostMapping(value = EventConversationsProtocol.PUBLISHED, produces = "application/json")
    public ResponseEntity<?> published(HttpServletRequest request) throws java.io.IOException {
        return read(request, EventConversationsProtocol.Event.class, EventConversationsProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> owner.ensurePublishedMainEventChat(command.event(), command.participants())));
    }
    @PostMapping(value = EventConversationsProtocol.STATUS, produces = "application/json")
    public ResponseEntity<?> status(HttpServletRequest request) throws java.io.IOException {
        return read(request, EventConversationsProtocol.Status.class, EventConversationsProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> new EventConversationsProtocol.Count(owner.updateEventChatOwnerStatus(command.eventId(), command.status()))));
    }
    @PostMapping(value = EventConversationsProtocol.POST, produces = "application/json")
    public ResponseEntity<?> post(HttpServletRequest request) throws java.io.IOException {
        return read(request, EventConversationsProtocol.Message.class, EventConversationsProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> new EventConversationsProtocol.Result(true, owner.postSystemMessage(command.chatId(), command.text(), command.systemType()))));
    }
    @PostMapping(value = EventConversationsProtocol.INITIAL, produces = "application/json")
    public ResponseEntity<?> initial(HttpServletRequest request) throws java.io.IOException {
        return read(request, EventConversationsProtocol.Message.class, EventConversationsProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> new EventConversationsProtocol.Result(true, owner.ensureInitialSystemMessage(command.chatId(), command.text(), command.systemType()))));
    }
    private <T> ResponseEntity<?> read(HttpServletRequest request, Class<T> type, Predicate<T> valid, Function<T, Object> action)
            throws java.io.IOException {
        try {
            byte[] bytes = ReadQueryBodies.readBytes(request, EventConversationsProtocol.MAX_REQUEST_BYTES);
            T query;
            try {
                query = mapper.readerFor(type).with(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES)
                        .with(DeserializationFeature.FAIL_ON_TRAILING_TOKENS).with(DeserializationFeature.FAIL_ON_NULL_FOR_PRIMITIVES).readValue(bytes);
            } catch (RuntimeException invalid) { throw new ReadQueryBodies.RejectedQuery(400, "INVALID_REQUEST"); }
            if (!valid.test(query)) throw new ReadQueryBodies.RejectedQuery(400, "INVALID_REQUEST");
            return response(200, action.apply(query));
        } catch (ReadQueryBodies.RejectedQuery invalid) { return response(invalid.status(), new EventConversationsProtocol.Error(invalid.code())); }
        catch (org.springframework.web.server.ResponseStatusException rejected) {
            return response(rejected.getStatusCode().value(), new EventConversationsProtocol.Error("OWNER_REJECTED"));
        }
        catch (RuntimeException unavailable) { return response(503, new EventConversationsProtocol.Error("EVENT_CONVERSATIONS_UNAVAILABLE")); }
    }
    private ResponseEntity<?> response(int status, Object body) { return ResponseEntity.status(status).cacheControl(CacheControl.noStore()).body(body); }
}

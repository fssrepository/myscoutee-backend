package com.raxim.myscoutee.microservices.transport.community;

import com.raxim.myscoutee.microservices.transport.common.ProtocolFields;
import java.util.function.Function;
import java.util.function.Predicate;
import com.raxim.myscoutee.domain.community.api.Cases;
import com.raxim.myscoutee.microservices.transport.common.ReadQueryBodies;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import tools.jackson.databind.*;

@RestController
public final class CasesEndpoint {
    private final Cases owner;
    private final ObjectMapper mapper;
    private final com.raxim.myscoutee.microservices.transport.security.ActorDelegation.Verifier verifier;
    public CasesEndpoint(Cases owner, ObjectMapper mapper, com.raxim.myscoutee.microservices.transport.security.ActorDelegation.Verifier verifier) { this.owner = owner; this.mapper = mapper; this.verifier = verifier; }
    @PostMapping(value = CasesProtocol.ACTOR_1, produces = "application/json")
    public ResponseEntity<?> actor_1(HttpServletRequest request) throws java.io.IOException {
        return read(request, CasesProtocol.Actor1.class, CasesProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> new CasesProtocol.Actor1Result(true, owner.actor(command.id()))));
    }
    @PostMapping(value = CasesProtocol.DETAIL_1, produces = "application/json")
    public ResponseEntity<?> detail_1(HttpServletRequest request) throws java.io.IOException {
        return read(request, CasesProtocol.Detail1.class, CasesProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> new CasesProtocol.Detail1Result(true, owner.detail(command.actor(), command.id()))));
    }
    @PostMapping(value = CasesProtocol.READ_1, produces = "application/json")
    public ResponseEntity<?> read_1(HttpServletRequest request) throws java.io.IOException {
        return read(request, CasesProtocol.Read1.class, CasesProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> new CasesProtocol.Read1Result(true, owner.read(command.actor(), command.id()))));
    }
    @PostMapping(value = CasesProtocol.PAGE_1, produces = "application/json")
    public ResponseEntity<?> page_1(HttpServletRequest request) throws java.io.IOException {
        return read(request, CasesProtocol.Page1.class, CasesProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> new CasesProtocol.Page1Result(true, owner.page(command.actor(), command.status(), command.type(), command.size(), command.cursor()))));
    }
    @PostMapping(value = CasesProtocol.SAVE_1, produces = "application/json")
    public ResponseEntity<?> save_1(HttpServletRequest request) throws java.io.IOException {
        return read(request, CasesProtocol.Save1.class, CasesProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> new CasesProtocol.Save1Result(true, owner.save(command.actor(), command.r()))));
    }
    @PostMapping(value = CasesProtocol.ACTION_1, produces = "application/json")
    public ResponseEntity<?> action_1(HttpServletRequest request) throws java.io.IOException {
        return read(request, CasesProtocol.Action1.class, CasesProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> new CasesProtocol.Action1Result(true, owner.action(command.actor(), command.id(), command.r()))));
    }
    private ProtocolFields.Receipt receipt(Runnable action) { action.run(); return new ProtocolFields.Receipt(true); }
    private <T> ResponseEntity<?> read(HttpServletRequest request, Class<T> type, Predicate<T> valid, Function<T, Object> action)
            throws java.io.IOException {
        return new ReadQueryBodies.CommandReader(CasesProtocol.MAX_REQUEST_BYTES, "CASES_UNAVAILABLE", verifier, CasesProtocol.AUDIENCE, CasesProtocol::delegated)
                .read(request, mapper, type, valid, action);
    }

    @PostMapping(value = CasesProtocol.FEEDBACK_CONTEXT, produces = "application/json")
    public ResponseEntity<?> feedbackContext(HttpServletRequest request) throws java.io.IOException {
        return read(request, CasesProtocol.FeedbackContext.class, CasesProtocol::valid, command ->
            com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(),
                () -> new CasesProtocol.FeedbackContextResult(true, owner.feedbackContext(command.snapshot()))));
    }
}

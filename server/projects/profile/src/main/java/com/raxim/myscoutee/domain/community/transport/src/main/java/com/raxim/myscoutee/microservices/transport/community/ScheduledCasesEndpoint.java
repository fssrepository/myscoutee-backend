package com.raxim.myscoutee.microservices.transport.community;

import com.raxim.myscoutee.microservices.transport.common.ProtocolFields;
import java.util.function.Function;
import java.util.function.Predicate;
import com.raxim.myscoutee.domain.community.api.ScheduledCases;
import com.raxim.myscoutee.microservices.transport.common.ReadQueryBodies;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import tools.jackson.databind.*;

@RestController
public final class ScheduledCasesEndpoint {
    private final ScheduledCases owner;
    private final ObjectMapper mapper;
    private final com.raxim.myscoutee.microservices.transport.security.ActorDelegation.Verifier verifier;
    public ScheduledCasesEndpoint(ScheduledCases owner, ObjectMapper mapper, com.raxim.myscoutee.microservices.transport.security.ActorDelegation.Verifier verifier) { this.owner = owner; this.mapper = mapper; this.verifier = verifier; }
    @PostMapping(value = ScheduledCasesProtocol.ACTOR_1, produces = "application/json")
    public ResponseEntity<?> actor_1(HttpServletRequest request) throws java.io.IOException {
        return read(request, ScheduledCasesProtocol.Actor1.class, ScheduledCasesProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> new ScheduledCasesProtocol.Actor1Result(true, owner.actor(command.id()))));
    }
    @PostMapping(value = ScheduledCasesProtocol.PAGE_1, produces = "application/json")
    public ResponseEntity<?> page_1(HttpServletRequest request) throws java.io.IOException {
        return read(request, ScheduledCasesProtocol.Page1.class, ScheduledCasesProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> new ScheduledCasesProtocol.Page1Result(true, owner.page(command.actor(), command.size(), command.cursor(), command.status()))));
    }
    @PostMapping(value = ScheduledCasesProtocol.SAVE_1, produces = "application/json")
    public ResponseEntity<?> save_1(HttpServletRequest request) throws java.io.IOException {
        return read(request, ScheduledCasesProtocol.Save1.class, ScheduledCasesProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> new ScheduledCasesProtocol.Save1Result(true, owner.save(command.actor(), command.r()))));
    }
    @PostMapping(value = ScheduledCasesProtocol.ACTION_1, produces = "application/json")
    public ResponseEntity<?> action_1(HttpServletRequest request) throws java.io.IOException {
        return read(request, ScheduledCasesProtocol.Action1.class, ScheduledCasesProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> new ScheduledCasesProtocol.Action1Result(true, owner.action(command.actor(), command.id(), command.command()))));
    }
    private ProtocolFields.Receipt receipt(Runnable action) { action.run(); return new ProtocolFields.Receipt(true); }
    private <T> ResponseEntity<?> read(HttpServletRequest request, Class<T> type, Predicate<T> valid, Function<T, Object> action)
            throws java.io.IOException {
        return new ReadQueryBodies.CommandReader(ScheduledCasesProtocol.MAX_REQUEST_BYTES, "SCHEDULED_CASES_UNAVAILABLE", verifier, ScheduledCasesProtocol.AUDIENCE, ScheduledCasesProtocol::delegated)
                .read(request, mapper, type, valid, action);
    }

}

package com.raxim.myscoutee.microservices.transport.events;

import java.util.function.Function;
import java.util.function.Predicate;
import com.raxim.myscoutee.domain.events.api.MingleEncounters;
import com.raxim.myscoutee.microservices.transport.common.ReadQueryBodies;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import tools.jackson.databind.*;

@RestController
public final class MingleEncountersEndpoint {
    private final MingleEncounters owner;
    private final ObjectMapper mapper;
    public MingleEncountersEndpoint(MingleEncounters owner, ObjectMapper mapper) { this.owner = owner; this.mapper = mapper; }
    @PostMapping(value = MingleEncountersProtocol.FIND, produces = "application/json")
    public ResponseEntity<?> find(HttpServletRequest request) throws java.io.IOException {
        return read(request, MingleEncountersProtocol.Query.class, MingleEncountersProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> new MingleEncountersProtocol.Result(true, owner.findSession(command.eventId()).map(com.raxim.myscoutee.domain.events.dto.MingleEncounterDtos.SessionDto::from).orElse(null))));
    }
    @PostMapping(value = MingleEncountersProtocol.ROUNDS, produces = "application/json")
    public ResponseEntity<?> rounds(HttpServletRequest request) throws java.io.IOException {
        return read(request, MingleEncountersProtocol.Batch.class, MingleEncountersProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> owner.completedRounds(command.eventIds()).stream().map(com.raxim.myscoutee.domain.events.dto.MingleEncounterDtos.RoundDto::from).toList()));
    }
    @PostMapping(value = MingleEncountersProtocol.COMPLETED, produces = "application/json")
    public ResponseEntity<?> completed(HttpServletRequest request) throws java.io.IOException {
        return read(request, MingleEncountersProtocol.Query.class, MingleEncountersProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> new MingleEncountersProtocol.Decision(owner.isCompleted(command.eventId()))));
    }
    @PostMapping(value = MingleEncountersProtocol.PENDING, produces = "application/json")
    public ResponseEntity<?> pending(HttpServletRequest request) throws java.io.IOException {
        return read(request, MingleEncountersProtocol.Query.class, MingleEncountersProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> owner.pendingPublication().stream().map(com.raxim.myscoutee.domain.events.dto.MingleEncounterDtos.SessionDto::from).toList()));
    }
    @PostMapping(value = MingleEncountersProtocol.ACK, produces = "application/json")
    public ResponseEntity<?> ack(HttpServletRequest request) throws java.io.IOException {
        return read(request, MingleEncountersProtocol.Ack.class, MingleEncountersProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> receipt(() -> owner.acknowledgePublication(command.session()))));
    }
    private MingleEncountersProtocol.Receipt receipt(Runnable action) { action.run(); return new MingleEncountersProtocol.Receipt(true); }
    private <T> ResponseEntity<?> read(HttpServletRequest request, Class<T> type, Predicate<T> valid, Function<T, Object> action)
            throws java.io.IOException {
        try {
            byte[] bytes = ReadQueryBodies.readBytes(request, MingleEncountersProtocol.MAX_REQUEST_BYTES);
            T query;
            try {
                query = mapper.readerFor(type).with(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES)
                        .with(DeserializationFeature.FAIL_ON_TRAILING_TOKENS).with(DeserializationFeature.FAIL_ON_NULL_FOR_PRIMITIVES).readValue(bytes);
            } catch (RuntimeException invalid) { throw new ReadQueryBodies.RejectedQuery(400, "INVALID_REQUEST"); }
            if (!valid.test(query)) throw new ReadQueryBodies.RejectedQuery(400, "INVALID_REQUEST");
            return response(200, action.apply(query));
        } catch (ReadQueryBodies.RejectedQuery invalid) { return response(invalid.status(), new MingleEncountersProtocol.Error(invalid.code())); }
        catch (org.springframework.web.server.ResponseStatusException rejected) {
            return response(rejected.getStatusCode().value(), new MingleEncountersProtocol.Error("OWNER_REJECTED"));
        }
        catch (RuntimeException unavailable) { return response(503, new MingleEncountersProtocol.Error("MINGLE_ENCOUNTERS_UNAVAILABLE")); }
    }
    private ResponseEntity<?> response(int status, Object body) { return ResponseEntity.status(status).cacheControl(CacheControl.noStore()).body(body); }
}

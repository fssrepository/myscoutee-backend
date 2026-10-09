package com.raxim.myscoutee.microservices.transport.events;

import java.util.function.Function;
import java.util.function.Predicate;
import com.raxim.myscoutee.domain.events.api.ParticipationTickets;
import com.raxim.myscoutee.microservices.transport.common.ReadQueryBodies;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import tools.jackson.databind.*;

@RestController
public final class ParticipationTicketsEndpoint {
    private final ParticipationTickets owner;
    private final ObjectMapper mapper;
    public ParticipationTicketsEndpoint(ParticipationTickets owner, ObjectMapper mapper) { this.owner = owner; this.mapper = mapper; }
    @PostMapping(value = ParticipationTicketsProtocol.SINGLE, produces = "application/json")
    public ResponseEntity<?> single(HttpServletRequest request) throws java.io.IOException {
        return read(request, ParticipationTicketsProtocol.User.class, ParticipationTicketsProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> owner.queryTicketSnapshotRecordsForUser(command.userId()).stream().map(com.raxim.myscoutee.domain.events.dto.ParticipationTicketDto.SnapshotDto::from).toList()));
    }
    @PostMapping(value = ParticipationTicketsProtocol.BATCH, produces = "application/json")
    public ResponseEntity<?> batch(HttpServletRequest request) throws java.io.IOException {
        return read(request, ParticipationTicketsProtocol.Users.class, ParticipationTicketsProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> owner.queryTicketSnapshotRecordsForUsers(command.ids()).stream().map(com.raxim.myscoutee.domain.events.dto.ParticipationTicketDto.SnapshotDto::from).toList()));
    }
    @PostMapping(value = ParticipationTicketsProtocol.RECORDS, produces = "application/json")
    public ResponseEntity<?> records(HttpServletRequest request) throws java.io.IOException {
        return read(request, ParticipationTicketsProtocol.User.class, ParticipationTicketsProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> owner.queryTicketRecordsForUser(command.userId()).stream().map(com.raxim.myscoutee.domain.events.dto.EventOwnershipDto::from).toList()));
    }
    @PostMapping(value = ParticipationTicketsProtocol.CHECK, produces = "application/json")
    public ResponseEntity<?> check(HttpServletRequest request) throws java.io.IOException {
        return read(request, ParticipationTicketsProtocol.Check.class, ParticipationTicketsProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> new ParticipationTicketsProtocol.CheckResult(true, com.raxim.myscoutee.domain.events.dto.ParticipationTicketDto.CheckInDto.from(owner.checkIn(command.code(), command.scannerUserId(), command.now())))));
    }
    private <T> ResponseEntity<?> read(HttpServletRequest request, Class<T> type, Predicate<T> valid, Function<T, Object> action)
            throws java.io.IOException {
        try {
            byte[] bytes = ReadQueryBodies.readBytes(request, ParticipationTicketsProtocol.MAX_REQUEST_BYTES);
            T query;
            try {
                query = mapper.readerFor(type).with(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES)
                        .with(DeserializationFeature.FAIL_ON_TRAILING_TOKENS).with(DeserializationFeature.FAIL_ON_NULL_FOR_PRIMITIVES).readValue(bytes);
            } catch (RuntimeException invalid) { throw new ReadQueryBodies.RejectedQuery(400, "INVALID_REQUEST"); }
            if (!valid.test(query)) throw new ReadQueryBodies.RejectedQuery(400, "INVALID_REQUEST");
            return response(200, action.apply(query));
        } catch (ReadQueryBodies.RejectedQuery invalid) { return response(invalid.status(), new ParticipationTicketsProtocol.Error(invalid.code())); }
        catch (RuntimeException unavailable) { return response(503, new ParticipationTicketsProtocol.Error("PARTICIPATION_TICKETS_UNAVAILABLE")); }
    }
    private ResponseEntity<?> response(int status, Object body) { return ResponseEntity.status(status).cacheControl(CacheControl.noStore()).body(body); }
}

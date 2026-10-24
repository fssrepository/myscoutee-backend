package com.raxim.myscoutee.microservices.transport.integrations;

import java.util.function.Function;
import java.util.function.Predicate;
import com.raxim.myscoutee.domain.integrations.api.ParticipantStatistics;
import com.raxim.myscoutee.microservices.transport.common.ReadQueryBodies;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import tools.jackson.databind.*;

@RestController
public final class ParticipantStatisticsEndpoint {
    private final ParticipantStatistics owner;
    private final ObjectMapper mapper;
    public ParticipantStatisticsEndpoint(ParticipantStatistics owner, ObjectMapper mapper) { this.owner = owner; this.mapper = mapper; }
    @PostMapping(value = ParticipantStatisticsProtocol.SUMMARY, produces = "application/json")
    public ResponseEntity<?> summary(HttpServletRequest request) throws java.io.IOException {
        return read(request, ParticipantStatisticsProtocol.Query.class, ParticipantStatisticsProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> owner.participantSummary(command.owner())));
    }
    private <T> ResponseEntity<?> read(HttpServletRequest request, Class<T> type, Predicate<T> valid, Function<T, Object> action)
            throws java.io.IOException {
        try {
            byte[] bytes = ReadQueryBodies.readBytes(request, ParticipantStatisticsProtocol.MAX_REQUEST_BYTES);
            T query = ReadQueryBodies.decode(bytes, mapper, type, valid, true);
            return response(200, action.apply(query));
        } catch (ReadQueryBodies.RejectedQuery invalid) { return response(invalid.status(), new ParticipantStatisticsProtocol.Error(invalid.code())); }
        catch (RuntimeException unavailable) { return response(503, new ParticipantStatisticsProtocol.Error("PARTICIPANT_STATISTICS_UNAVAILABLE")); }
    }
    private ResponseEntity<?> response(int status, Object body) { return ResponseEntity.status(status).cacheControl(CacheControl.noStore()).body(body); }
}

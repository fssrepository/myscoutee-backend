package com.raxim.myscoutee.microservices.transport.affinity;

import java.util.function.Function;
import java.util.function.Predicate;
import com.raxim.myscoutee.domain.affinity.api.GraphScience;
import com.raxim.myscoutee.microservices.transport.common.ReadQueryBodies;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import tools.jackson.databind.*;

@RestController
public final class GraphScienceEndpoint {
    private final GraphScience owner;
    private final ObjectMapper mapper;
    public GraphScienceEndpoint(GraphScience owner, ObjectMapper mapper) { this.owner = owner; this.mapper = mapper; }
    @PostMapping(value = GraphScienceProtocol.REFRESH, produces = "application/json")
    public ResponseEntity<?> refresh(HttpServletRequest request) throws java.io.IOException {
        return read(request, GraphScienceProtocol.Query.class, GraphScienceProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> owner.refresh(command.key(),command.existing())));
    }
    private <T> ResponseEntity<?> read(HttpServletRequest request, Class<T> type, Predicate<T> valid, Function<T, Object> action)
            throws java.io.IOException {
        try {
            byte[] bytes = ReadQueryBodies.readBytes(request, GraphScienceProtocol.MAX_REQUEST_BYTES);
            T query;
            try {
                query = mapper.readerFor(type).with(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES)
                        .with(DeserializationFeature.FAIL_ON_TRAILING_TOKENS).with(DeserializationFeature.FAIL_ON_NULL_FOR_PRIMITIVES).readValue(bytes);
            } catch (RuntimeException invalid) { throw new ReadQueryBodies.RejectedQuery(400, "INVALID_REQUEST"); }
            if (!valid.test(query)) throw new ReadQueryBodies.RejectedQuery(400, "INVALID_REQUEST");
            return response(200, action.apply(query));
        } catch (ReadQueryBodies.RejectedQuery invalid) { return response(invalid.status(), new GraphScienceProtocol.Error(invalid.code())); }
        catch (org.springframework.web.server.ResponseStatusException rejected) {
            return response(rejected.getStatusCode().value(), new GraphScienceProtocol.Error("OWNER_REJECTED"));
        }
        catch (RuntimeException unavailable) { return response(503, new GraphScienceProtocol.Error("GRAPH_SCIENCE_UNAVAILABLE")); }
    }
    private ResponseEntity<?> response(int status, Object body) { return ResponseEntity.status(status).cacheControl(CacheControl.noStore()).body(body); }
}

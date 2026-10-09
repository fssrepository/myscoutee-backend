package com.raxim.myscoutee.microservices.transport.affinity;

import java.util.function.Function;
import java.util.function.Predicate;
import com.raxim.myscoutee.domain.affinity.api.CampaignRatings;
import com.raxim.myscoutee.microservices.transport.common.ReadQueryBodies;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import tools.jackson.databind.*;

@RestController
public final class CampaignRatingsEndpoint {
    private final CampaignRatings owner;
    private final ObjectMapper mapper;
    public CampaignRatingsEndpoint(CampaignRatings owner, ObjectMapper mapper) { this.owner = owner; this.mapper = mapper; }
    @PostMapping(value = CampaignRatingsProtocol.RELEVANT, produces = "application/json")
    public ResponseEntity<?> relevant(HttpServletRequest request) throws java.io.IOException {
        return read(request, CampaignRatingsProtocol.Query.class, CampaignRatingsProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> owner.relevant(command.viewer(), command.target())));
    }
    @PostMapping(value = CampaignRatingsProtocol.PAIR, produces = "application/json")
    public ResponseEntity<?> pair(HttpServletRequest request) throws java.io.IOException {
        return read(request, CampaignRatingsProtocol.Query.class, CampaignRatingsProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> owner.pair(command.viewer(), command.target())));
    }
    @PostMapping(value = CampaignRatingsProtocol.VIEWER, produces = "application/json")
    public ResponseEntity<?> viewer(HttpServletRequest request) throws java.io.IOException {
        return read(request, CampaignRatingsProtocol.Query.class, CampaignRatingsProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> owner.byViewer(command.viewer())));
    }
    private <T> ResponseEntity<?> read(HttpServletRequest request, Class<T> type, Predicate<T> valid, Function<T, Object> action)
            throws java.io.IOException {
        try {
            byte[] bytes = ReadQueryBodies.readBytes(request, CampaignRatingsProtocol.MAX_REQUEST_BYTES);
            T query;
            try {
                query = mapper.readerFor(type).with(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES)
                        .with(DeserializationFeature.FAIL_ON_TRAILING_TOKENS).with(DeserializationFeature.FAIL_ON_NULL_FOR_PRIMITIVES).readValue(bytes);
            } catch (RuntimeException invalid) { throw new ReadQueryBodies.RejectedQuery(400, "INVALID_REQUEST"); }
            if (!valid.test(query)) throw new ReadQueryBodies.RejectedQuery(400, "INVALID_REQUEST");
            return response(200, action.apply(query));
        } catch (ReadQueryBodies.RejectedQuery invalid) { return response(invalid.status(), new CampaignRatingsProtocol.Error(invalid.code())); }
        catch (org.springframework.web.server.ResponseStatusException rejected) {
            return response(rejected.getStatusCode().value(), new CampaignRatingsProtocol.Error("OWNER_REJECTED"));
        }
        catch (RuntimeException unavailable) { return response(503, new CampaignRatingsProtocol.Error("CAMPAIGN_RATINGS_UNAVAILABLE")); }
    }
    private ResponseEntity<?> response(int status, Object body) { return ResponseEntity.status(status).cacheControl(CacheControl.noStore()).body(body); }
}

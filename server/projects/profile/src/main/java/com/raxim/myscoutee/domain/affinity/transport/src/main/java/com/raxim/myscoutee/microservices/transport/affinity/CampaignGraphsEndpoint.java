package com.raxim.myscoutee.microservices.transport.affinity;

import java.util.function.Function;
import java.util.function.Predicate;
import com.raxim.myscoutee.domain.affinity.api.CampaignGraphs;
import com.raxim.myscoutee.microservices.transport.common.ReadQueryBodies;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import tools.jackson.databind.*;

@RestController
public final class CampaignGraphsEndpoint {
    private final CampaignGraphs owner;
    private final ObjectMapper mapper;
    public CampaignGraphsEndpoint(CampaignGraphs owner, ObjectMapper mapper) { this.owner = owner; this.mapper = mapper; }
    @PostMapping(value = CampaignGraphsProtocol.GRAPHS, produces = "application/json")
    public ResponseEntity<?> graphs(HttpServletRequest request) throws java.io.IOException {
        return read(request, CampaignGraphsProtocol.Query.class, CampaignGraphsProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> graphs(command.ids())));
    }
    private <T> ResponseEntity<?> read(HttpServletRequest request, Class<T> type, Predicate<T> valid, Function<T, Object> action)
            throws java.io.IOException {
        try {
            byte[] bytes = ReadQueryBodies.readBytes(request, CampaignGraphsProtocol.MAX_REQUEST_BYTES);
            T query = ReadQueryBodies.decode(bytes, mapper, type, valid, true);
            return response(200, action.apply(query));
        } catch (ReadQueryBodies.RejectedQuery invalid) { return response(invalid.status(), new CampaignGraphsProtocol.Error(invalid.code())); }
        catch (org.springframework.web.server.ResponseStatusException rejected) {
            return response(rejected.getStatusCode().value(), new CampaignGraphsProtocol.Error("OWNER_REJECTED"));
        }
        catch (RuntimeException unavailable) { return response(503, new CampaignGraphsProtocol.Error("CAMPAIGN_GRAPHS_UNAVAILABLE")); }
    }
    private ResponseEntity<?> response(int status, Object body) { return ResponseEntity.status(status).cacheControl(CacheControl.noStore()).body(body); }
    private java.util.Map<String, com.raxim.myscoutee.domain.affinity.dto.CampaignGraphDto> graphs(java.util.Collection<String> ids) {
        var result = new java.util.LinkedHashMap<String, com.raxim.myscoutee.domain.affinity.dto.CampaignGraphDto>();
        owner.campaignGraphs(ids).forEach((id, graph) -> result.put(id, com.raxim.myscoutee.domain.affinity.dto.CampaignGraphDto.from(graph)));
        return result;
    }
}

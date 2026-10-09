package com.raxim.myscoutee.microservices.transport.campaigns;

import java.util.function.Function;
import java.util.function.Predicate;
import com.raxim.myscoutee.domain.campaigns.api.CampaignCatalog;
import com.raxim.myscoutee.domain.campaigns.dto.CampaignSummaryDto;
import com.raxim.myscoutee.microservices.transport.common.ReadQueryBodies;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import tools.jackson.databind.*;

@RestController
public final class CampaignCatalogEndpoint {
    private final CampaignCatalog owner;
    private final ObjectMapper mapper;
    public CampaignCatalogEndpoint(CampaignCatalog owner, ObjectMapper mapper) { this.owner = owner; this.mapper = mapper; }
    @PostMapping(value = CampaignCatalogProtocol.SINGLE, produces = "application/json")
    public ResponseEntity<?> single(HttpServletRequest request) throws java.io.IOException {
        return read(request, CampaignCatalogProtocol.SingleQuery.class, CampaignCatalogProtocol::valid,
                query -> new CampaignCatalogProtocol.SingleResult(true, CampaignSummaryDto.from(owner.find(query.id()))));
    }
    @PostMapping(value = CampaignCatalogProtocol.BATCH, produces = "application/json")
    public ResponseEntity<?> batch(HttpServletRequest request) throws java.io.IOException {
        return read(request, CampaignCatalogProtocol.BatchQuery.class, CampaignCatalogProtocol::valid, query -> {
            var result = new java.util.LinkedHashMap<String, CampaignSummaryDto>();
            owner.findByIds(query.ids()).forEach((id, value) -> result.put(id, CampaignSummaryDto.from(value)));
            return result;
        });
    }
    @PostMapping(value = CampaignCatalogProtocol.OWNED, produces = "application/json")
    public ResponseEntity<?> owned(HttpServletRequest request) throws java.io.IOException {
        return read(request, CampaignCatalogProtocol.OwnedQuery.class, CampaignCatalogProtocol::valid,
                query -> new CampaignCatalogProtocol.Decision(owner.ownedExists(query.ownerUserId(), query.id())));
    }
    private <T> ResponseEntity<?> read(HttpServletRequest request, Class<T> type, Predicate<T> valid, Function<T, Object> action)
            throws java.io.IOException {
        try {
            byte[] bytes = ReadQueryBodies.readBytes(request, CampaignCatalogProtocol.MAX_REQUEST_BYTES);
            T query;
            try {
                query = mapper.readerFor(type).with(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES)
                        .with(DeserializationFeature.FAIL_ON_TRAILING_TOKENS).readValue(bytes);
            } catch (RuntimeException invalid) { throw new ReadQueryBodies.RejectedQuery(400, "INVALID_REQUEST"); }
            if (!valid.test(query)) throw new ReadQueryBodies.RejectedQuery(400, "INVALID_REQUEST");
            return response(200, action.apply(query));
        } catch (ReadQueryBodies.RejectedQuery invalid) { return response(invalid.status(), new CampaignCatalogProtocol.Error(invalid.code())); }
        catch (RuntimeException unavailable) { return response(503, new CampaignCatalogProtocol.Error("CAMPAIGN_CATALOG_UNAVAILABLE")); }
    }
    private ResponseEntity<?> response(int status, Object body) { return ResponseEntity.status(status).cacheControl(CacheControl.noStore()).body(body); }
}

package com.raxim.myscoutee.microservices.transport.chat;

import java.util.function.Function;
import java.util.function.Predicate;
import com.raxim.myscoutee.domain.chat.api.CampaignConversations;
import com.raxim.myscoutee.microservices.transport.common.ReadQueryBodies;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import tools.jackson.databind.*;

@RestController
public final class CampaignConversationsEndpoint {
    private final CampaignConversations owner;
    private final ObjectMapper mapper;
    public CampaignConversationsEndpoint(CampaignConversations owner, ObjectMapper mapper) { this.owner = owner; this.mapper = mapper; }
    @PostMapping(value = CampaignConversationsProtocol.INTERACTIONS, produces = "application/json")
    public ResponseEntity<?> interactions(HttpServletRequest request) throws java.io.IOException {
        return read(request, CampaignConversationsProtocol.Query.class, CampaignConversationsProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> owner.interactions(command.actorId(), command.targetId())));
    }
    private <T> ResponseEntity<?> read(HttpServletRequest request, Class<T> type, Predicate<T> valid, Function<T, Object> action)
            throws java.io.IOException {
        try {
            byte[] bytes = ReadQueryBodies.readBytes(request, CampaignConversationsProtocol.MAX_REQUEST_BYTES);
            T query;
            try {
                query = mapper.readerFor(type).with(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES)
                        .with(DeserializationFeature.FAIL_ON_TRAILING_TOKENS).with(DeserializationFeature.FAIL_ON_NULL_FOR_PRIMITIVES).readValue(bytes);
            } catch (RuntimeException invalid) { throw new ReadQueryBodies.RejectedQuery(400, "INVALID_REQUEST"); }
            if (!valid.test(query)) throw new ReadQueryBodies.RejectedQuery(400, "INVALID_REQUEST");
            return response(200, action.apply(query));
        } catch (ReadQueryBodies.RejectedQuery invalid) { return response(invalid.status(), new CampaignConversationsProtocol.Error(invalid.code())); }
        catch (org.springframework.web.server.ResponseStatusException rejected) {
            return response(rejected.getStatusCode().value(), new CampaignConversationsProtocol.Error("OWNER_REJECTED"));
        }
        catch (RuntimeException unavailable) { return response(503, new CampaignConversationsProtocol.Error("CAMPAIGN_CONVERSATIONS_UNAVAILABLE")); }
    }
    private ResponseEntity<?> response(int status, Object body) { return ResponseEntity.status(status).cacheControl(CacheControl.noStore()).body(body); }
}

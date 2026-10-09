package com.raxim.myscoutee.microservices.transport.affinity;

import java.io.IOException;
import com.raxim.myscoutee.domain.affinity.api.AffinityStatusChanges;
import com.raxim.myscoutee.domain.affinity.dto.RecomputeTaskDto;
import com.raxim.myscoutee.domain.platform.api.JobGroupContext;
import com.raxim.myscoutee.microservices.transport.common.ReadQueryBodies;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import tools.jackson.databind.*;

/** Additional owner change signals reuse the existing recompute queue and transport capability. */
@RestController
public final class AffinityStatusChangesEndpoint {
    private final AffinityStatusChanges owner;
    private final ObjectMapper mapper;
    public AffinityStatusChangesEndpoint(AffinityStatusChanges owner, ObjectMapper mapper) { this.owner = owner; this.mapper = mapper; }
    @PostMapping(value = {UserAffinityChangesProtocol.EVENT, UserAffinityChangesProtocol.EVENT_MEMBERS,
            UserAffinityChangesProtocol.ASSET, UserAffinityChangesProtocol.ASSET_REQUESTS, UserAffinityChangesProtocol.CONFIG}, produces = "application/json")
    public ResponseEntity<?> change(HttpServletRequest request) throws IOException {
        try {
            var bytes = ReadQueryBodies.readBytes(request, UserAffinityChangesProtocol.MAX_REQUEST_BYTES);
            UserAffinityChangesProtocol.Change change;
            try {
                change = mapper.readerFor(UserAffinityChangesProtocol.Change.class)
                        .with(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES).with(DeserializationFeature.FAIL_ON_TRAILING_TOKENS).readValue(bytes);
            } catch (RuntimeException invalid) { throw new ReadQueryBodies.RejectedQuery(400, "INVALID_REQUEST"); }
            if (!UserAffinityChangesProtocol.valid(change)) throw new ReadQueryBodies.RejectedQuery(400, "INVALID_REQUEST");
            var task = JobGroupContext.call(change.active(), change.groupId(), () -> switch (request.getRequestURI()) {
                case UserAffinityChangesProtocol.EVENT -> owner.enqueueEventChanged(change.targetId(), change.actorUserId());
                case UserAffinityChangesProtocol.EVENT_MEMBERS -> owner.enqueueEventMembersChanged(change.targetId(), change.actorUserId());
                case UserAffinityChangesProtocol.ASSET -> owner.enqueueAssetChanged(change.targetId(), change.actorUserId());
                case UserAffinityChangesProtocol.ASSET_REQUESTS -> owner.enqueueAssetRequestsChanged(change.targetId(), change.actorUserId());
                case UserAffinityChangesProtocol.CONFIG -> owner.enqueueConfigChanged(change.targetId(), change.actorUserId());
                default -> throw new ReadQueryBodies.RejectedQuery(400, "INVALID_REQUEST");
            });
            return response(200, new UserAffinityChangesProtocol.Receipt(true, RecomputeTaskDto.from(task)));
        } catch (ReadQueryBodies.RejectedQuery invalid) { return response(invalid.status(), new UserAffinityChangesProtocol.Error(invalid.code())); }
        catch (RuntimeException failure) { return response(503, new UserAffinityChangesProtocol.Error("SIGNAL_OUTCOME_UNKNOWN")); }
    }
    private ResponseEntity<?> response(int status, Object body) { return ResponseEntity.status(status).cacheControl(CacheControl.noStore()).body(body); }
}

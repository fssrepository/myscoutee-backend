package com.raxim.myscoutee.microservices.transport.events;

import java.util.function.Function;
import java.util.function.Predicate;
import com.raxim.myscoutee.domain.events.api.PartnerInvitationAdmission;
import com.raxim.myscoutee.microservices.transport.common.ReadQueryBodies;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import tools.jackson.databind.*;

@RestController
public final class PartnerInvitationAdmissionEndpoint {
    private final PartnerInvitationAdmission owner;
    private final ObjectMapper mapper;
    private final com.raxim.myscoutee.microservices.transport.security.ActorDelegation.Verifier verifier;
    public PartnerInvitationAdmissionEndpoint(PartnerInvitationAdmission owner, ObjectMapper mapper, com.raxim.myscoutee.microservices.transport.security.ActorDelegation.Verifier verifier) { this.owner = owner; this.mapper = mapper; this.verifier = verifier; }
    @PostMapping(value = PartnerInvitationAdmissionProtocol.CLAIM, produces = "application/json")
    public ResponseEntity<?> claim(HttpServletRequest request) throws java.io.IOException {
        return read(request, PartnerInvitationAdmissionProtocol.Claim.class, PartnerInvitationAdmissionProtocol::valid, command ->
                com.raxim.myscoutee.domain.platform.api.JobGroupContext.call(command.scope().active(), command.scope().groupId(), () -> receipt(() -> owner.claimIntegrationInvite(command.invite(),command.eventRecordId(),command.actorUserId()))));
    }
    private PartnerInvitationAdmissionProtocol.Receipt receipt(Runnable action) { action.run(); return new PartnerInvitationAdmissionProtocol.Receipt(true); }
    private <T> ResponseEntity<?> read(HttpServletRequest request, Class<T> type, Predicate<T> valid, Function<T, Object> action)
            throws java.io.IOException {
        try {
            var verified = com.raxim.myscoutee.microservices.transport.security.DelegatedRequestBodies.read(
                    request, mapper, verifier, PartnerInvitationAdmissionProtocol.AUDIENCE, PartnerInvitationAdmissionProtocol.CLAIM, type, PartnerInvitationAdmissionProtocol.MAX_REQUEST_BYTES);
            T query = verified.value();
            if (!valid.test(query)) throw new ReadQueryBodies.RejectedQuery(400, "INVALID_REQUEST");
            if (!((PartnerInvitationAdmissionProtocol.Claim) query).actorUserId().equals(verified.principal().getUserId()))
                throw new org.springframework.security.access.AccessDeniedException("Actor mismatch");
            return verified.call(() -> response(200, action.apply(query)));
        } catch (org.springframework.security.access.AccessDeniedException denied) { return response(403, new PartnerInvitationAdmissionProtocol.Error("INVALID_DELEGATION"));
        } catch (ReadQueryBodies.RejectedQuery invalid) { return response(invalid.status(), new PartnerInvitationAdmissionProtocol.Error(invalid.code())); }
        catch (org.springframework.web.server.ResponseStatusException rejected) {
            return response(rejected.getStatusCode().value(), new PartnerInvitationAdmissionProtocol.Error("OWNER_REJECTED"));
        }
        catch (RuntimeException unavailable) { return response(503, new PartnerInvitationAdmissionProtocol.Error("PARTNER_INVITATION_ADMISSION_UNAVAILABLE")); }
    }
    private ResponseEntity<?> response(int status, Object body) { return ResponseEntity.status(status).cacheControl(CacheControl.noStore()).body(body); }
}

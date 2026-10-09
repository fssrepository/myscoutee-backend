package com.raxim.myscoutee.microservices.transport.events;

import com.raxim.myscoutee.domain.events.api.PartnerInvitationAdmission;
import java.net.URI;
import java.time.Duration;
import com.raxim.myscoutee.microservices.transport.common.RemoteReadTransport;
import io.micrometer.core.instrument.MeterRegistry;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

/** Bounded scoped call to the existing owner; no automatic retries. */
public final class RemotePartnerInvitationAdmission extends RemoteReadTransport implements PartnerInvitationAdmission {
    private final ObjectMapper mapper;
    private final com.raxim.myscoutee.microservices.transport.security.ActorDelegation.Signer signer;
    public RemotePartnerInvitationAdmission(URI origin, String token, boolean allowHttp, Duration connectTimeout,
            Duration requestTimeout, ObjectMapper mapper, MeterRegistry metrics, com.raxim.myscoutee.microservices.transport.security.ActorDelegation.Signer signer) {
        super(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics); this.mapper = mapper; this.signer = signer;
    }
    @Override public void claimIntegrationInvite(com.raxim.myscoutee.domain.integrations.api.ParticipantInvitation invite, String eventRecordId, String actorUserId) {
        var command = new PartnerInvitationAdmissionProtocol.Claim(PartnerInvitationAdmissionProtocol.Scope.current(), com.raxim.myscoutee.domain.integrations.dto.ParticipantInvitationDto.from(invite), eventRecordId, actorUserId);
        if (!PartnerInvitationAdmissionProtocol.valid(command)) throw new IllegalArgumentException("Invalid partner-invitation-admission request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > PartnerInvitationAdmissionProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("partner-invitation-admission request exceeds byte limit");
        var result = ownerExchange(PartnerInvitationAdmissionProtocol.CLAIM, bytes, new TypeReference<PartnerInvitationAdmissionProtocol.Receipt>() {},
                "partner-invitation-admission.claim", PartnerInvitationAdmissionProtocol.MAX_RESPONSE_BYTES, v -> Boolean.TRUE.equals(v.completed()));
    }
    private <T> T ownerExchange(String path, byte[] bytes, TypeReference<T> type, String operation, int limit,
            java.util.function.Predicate<T> valid) {
        try { return exchangeAuthorized(path, bytes, type, operation, limit, valid,
                    java.util.Map.of(com.raxim.myscoutee.microservices.transport.security.ActorDelegation.HEADER,
                            signer.issueForCurrent(PartnerInvitationAdmissionProtocol.AUDIENCE, "POST", path, bytes))); }
        catch (RemoteReadException failure) {
            if (failure.status() >= 400 && failure.status() < 500 && "OWNER_REJECTED".equals(failure.remoteCode()))
                throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatusCode.valueOf(failure.status()));
            throw failure;
        }
    }

}

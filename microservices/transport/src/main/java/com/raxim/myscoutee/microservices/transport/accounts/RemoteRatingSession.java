package com.raxim.myscoutee.microservices.transport.accounts;

import java.net.URI;
import java.time.Duration;
import java.util.Map;
import com.raxim.myscoutee.domain.accounts.api.RatingSession;
import com.raxim.myscoutee.microservices.transport.common.RemoteReadTransport;
import com.raxim.myscoutee.microservices.transport.security.ActorDelegation;
import io.micrometer.core.instrument.MeterRegistry;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

public final class RemoteRatingSession extends RemoteReadTransport implements RatingSession {
    private final ObjectMapper mapper;
    private final ActorDelegation.Signer signer;
    public RemoteRatingSession(URI origin, String token, boolean allowHttp, Duration connectTimeout,
            Duration requestTimeout, ObjectMapper mapper, MeterRegistry metrics, ActorDelegation.Signer signer) {
        super(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics);
        this.mapper = mapper; this.signer = signer;
    }
    @Override public com.raxim.myscoutee.domain.accounts.dto.RatingSessionDto resolveRatingSession(String requestedUserId) {
        var authentication = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()
                || !(authentication.getPrincipal() instanceof com.raxim.myscoutee.domain.accounts.api.AuthenticatedActor actor))
            throw new org.springframework.security.access.AccessDeniedException("Authenticated selected profile required");
        var query = new RatingSessionProtocol.Query(requestedUserId);
        if (!RatingSessionProtocol.valid(query)) throw new IllegalArgumentException("Invalid profile-selection query");
        byte[] bytes = mapper.writeValueAsBytes(query);
        String proof = signer.issueForCurrent(RatingSessionProtocol.AUDIENCE, "POST", RatingSessionProtocol.PATH, bytes);
        return exchangeAuthorized(RatingSessionProtocol.PATH, bytes, new TypeReference<RatingSessionProtocol.Result>() {},
                "rating-session.resolve", 16384,
                value -> Boolean.TRUE.equals(value.resolved()) && (value.value() == null || actor.getProfileIdentity().equals(value.value().identity())),
                Map.of(ActorDelegation.HEADER, proof)).value();
    }
}

package com.raxim.myscoutee.microservices.transport.groups;

import java.net.URI;
import java.time.Duration;
import com.raxim.myscoutee.domain.groups.api.ProfileWorkspaceLoads;
import com.raxim.myscoutee.domain.groups.dto.ProfileWorkspaceDto;
import com.raxim.myscoutee.microservices.transport.common.RemoteCommandTransport;
import com.raxim.myscoutee.microservices.transport.security.ActorDelegation;
import io.micrometer.core.instrument.MeterRegistry;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

public final class RemoteProfileWorkspaceLoads extends RemoteCommandTransport implements ProfileWorkspaceLoads {
    private final ObjectMapper mapper;
    private final ActorDelegation.Signer issuer;
    public RemoteProfileWorkspaceLoads(URI origin, String token, boolean allowHttp, Duration connectTimeout,
            Duration requestTimeout, ObjectMapper mapper, MeterRegistry metrics, ActorDelegation.Signer issuer) {
        super(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics); this.mapper = mapper; this.issuer = issuer;
    }
    @Override public ProfileWorkspaceDto loadProfileWorkspace(String accountId, String currentGroupId, String requestedGroupId) {
        var request = new ProfileWorkspaceLoadsProtocol.Command(accountId, currentGroupId, requestedGroupId);
        if (!ProfileWorkspaceLoadsProtocol.valid(request)) throw new IllegalArgumentException("Invalid profile workspace request");
        var body = mapper.writeValueAsBytes(request);
        String delegation = issuer.issueForCurrent(ProfileWorkspaceLoadsProtocol.AUDIENCE, "POST", ProfileWorkspaceLoadsProtocol.PATH, body);
        return command(ProfileWorkspaceLoadsProtocol.PATH, body, new TypeReference<ProfileWorkspaceLoadsProtocol.Result>() {},
                "groups.profile-workspace", 1024 * 1024, value -> Boolean.TRUE.equals(value.completed()) && value.context() != null,
                delegation, null).context();
    }
}

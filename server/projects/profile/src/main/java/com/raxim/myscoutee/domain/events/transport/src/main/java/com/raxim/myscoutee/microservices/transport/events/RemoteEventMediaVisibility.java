package com.raxim.myscoutee.microservices.transport.events;

import java.net.URI;
import java.time.Duration;
import java.util.List;
import com.raxim.myscoutee.domain.events.api.EventMediaVisibility;
import com.raxim.myscoutee.domain.events.dto.EventMediaVisibilityDto;
import com.raxim.myscoutee.domain.events.dto.CommunityMediaMembershipDto;
import com.raxim.myscoutee.microservices.transport.common.MediaReferenceQueries;
import com.raxim.myscoutee.microservices.transport.common.RemoteReadTransport;
import io.micrometer.core.instrument.MeterRegistry;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

public final class RemoteEventMediaVisibility extends RemoteReadTransport implements EventMediaVisibility {
    private final ObjectMapper mapper;
    public RemoteEventMediaVisibility(URI origin, String token, boolean allowHttp, Duration connectTimeout,
            Duration requestTimeout, ObjectMapper mapper, MeterRegistry metrics) {
        super(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics);
        this.mapper = mapper;
    }
    @Override public EventMediaVisibilityDto event(List<String> urls) {
        byte[] body = MediaReferenceQueries.encode(urls, mapper);
        try {
            return exchange(EventMediaVisibilityProtocol.PATH, body, new TypeReference<EventMediaVisibilityDto>() {},
                    "events.media-visibility", EventMediaVisibilityProtocol.MAX_RESPONSE_BYTES,
                    value -> value.admins() != null && value.acceptedMemberUserIds() != null
                            && value.invitedMemberUserIds() != null && value.pendingRequestMemberUserIds() != null);
        } catch (RemoteReadException failure) {
            if (failure.status() == 404 && "NOT_FOUND".equals(failure.remoteCode())) return null;
            throw failure;
        }
    }
    @Override public CommunityMediaMembershipDto acceptedCommunityMember(String communityId, String accountId) {
        String path = queryPath(EventMediaVisibilityProtocol.MEMBERSHIP_PATH,
                "communityId", communityId, "accountId", accountId);
        try {
            return exchange(path, new TypeReference<CommunityMediaMembershipDto>() {},
                    "events.media-membership", 4096, value -> true);
        } catch (RemoteReadException failure) {
            if (failure.status() == 404 && "NOT_FOUND".equals(failure.remoteCode())) return null;
            throw failure;
        }
    }
}

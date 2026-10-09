package com.raxim.myscoutee.microservices.transport.accounts;

import java.net.URI;
import java.time.Duration;
import java.util.*;
import com.raxim.myscoutee.domain.accounts.api.FollowingEvents;
import com.raxim.myscoutee.microservices.transport.common.RemoteReadTransport;
import io.micrometer.core.instrument.MeterRegistry;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

/** No automatic retry. Event eligibility inherits the canonical pure default method. */
public final class RemoteFollowingEvents extends RemoteReadTransport implements FollowingEvents {
    private final ObjectMapper mapper;
    public RemoteFollowingEvents(URI origin, String token, boolean allowHttp, Duration connectTimeout,
            Duration requestTimeout, ObjectMapper mapper, MeterRegistry metrics) {
        super(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics); this.mapper = mapper;
    }
    @Override public List<String> organizerIds(String profileId) {
        var query = new FollowingEventsProtocol.ProfileQuery(profileId);
        return exchange(FollowingEventsProtocol.ORGANIZERS, body(query, FollowingEventsProtocol.valid(query)),
                new TypeReference<List<String>>() {}, "following.organizers", FollowingEventsProtocol.MAX_RESPONSE_BYTES,
                values -> values.stream().allMatch(value -> value != null && value.length() <= 512));
    }
    @Override public void refreshForViewers(Collection<String> ids) {
        var command = new FollowingEventsProtocol.RefreshCommand(ids);
        try {
            exchange(FollowingEventsProtocol.REFRESH, body(command, FollowingEventsProtocol.valid(command)),
                new TypeReference<FollowingEventsProtocol.Receipt>() {}, "following.refresh", 16384,
                value -> Boolean.TRUE.equals(value.completed()));
        } catch (RemoteReadException failure) {
            if (failure.status() == 409 && "FOLLOWING_CONFLICT".equals(failure.remoteCode()))
                throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.CONFLICT,
                        "Following changed concurrently. Retry the action.");
            if (failure.status() == 404 && "USER_NOT_FOUND".equals(failure.remoteCode()))
                throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.NOT_FOUND, "User not found.");
            throw failure;
        }
    }
    private byte[] body(Object value, boolean valid) {
        if (!valid) throw new IllegalArgumentException("Invalid following operation");
        byte[] bytes = mapper.writeValueAsBytes(value);
        if (bytes.length > FollowingEventsProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("Following request exceeds byte limit");
        return bytes;
    }
}

package com.raxim.myscoutee.microservices.transport.community;

import com.raxim.myscoutee.domain.community.api.AnnouncementDirectory;
import java.net.URI;
import java.time.Duration;
import com.raxim.myscoutee.microservices.transport.common.RemoteReadTransport;
import io.micrometer.core.instrument.MeterRegistry;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

/** Bounded scoped call to the existing owner; no automatic retries. */
public final class RemoteAnnouncementDirectory extends RemoteReadTransport implements AnnouncementDirectory {
    private final ObjectMapper mapper;
    public RemoteAnnouncementDirectory(URI origin, String token, boolean allowHttp, Duration connectTimeout,
            Duration requestTimeout, ObjectMapper mapper, MeterRegistry metrics) {
        super(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics); this.mapper = mapper;
    }
    @Override public java.util.Optional<Announcement> find(String id) {
        var command = new AnnouncementDirectoryProtocol.Query(AnnouncementDirectoryProtocol.Scope.current(), id);
        if (!AnnouncementDirectoryProtocol.valid(command)) throw new IllegalArgumentException("Invalid announcement-directory request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > AnnouncementDirectoryProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("announcement-directory request exceeds byte limit");
        var result = exchange(AnnouncementDirectoryProtocol.FIND, bytes, new TypeReference<AnnouncementDirectoryProtocol.Result>() {},
                "announcement-directory.find", AnnouncementDirectoryProtocol.MAX_RESPONSE_BYTES, value -> Boolean.TRUE.equals(value.resolved()) && (value.value() == null || java.util.Objects.equals(id, value.value().id())));
        return java.util.Optional.ofNullable(result.value());
    }
}

package com.raxim.myscoutee.microservices.transport.accounts;

import java.net.URI;
import java.time.Duration;
import com.raxim.myscoutee.domain.accounts.api.ContactDirectory;
import com.raxim.myscoutee.microservices.transport.common.RemoteReadTransport;
import io.micrometer.core.instrument.MeterRegistry;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

/** One bounded batch; canonical selection stays with the owner. */
public final class RemoteContactDirectory extends RemoteReadTransport implements ContactDirectory {
    private final ObjectMapper mapper;
    public RemoteContactDirectory(URI origin, String token, boolean allowHttp, Duration connectTimeout,
            Duration requestTimeout, ObjectMapper mapper, MeterRegistry metrics) {
        super(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics); this.mapper = mapper;
    }
    @Override public java.util.Set<String> savedCandidateIds(String userId) {
        var query = new ContactDirectoryProtocol.Query(userId);
        if (!ContactDirectoryProtocol.valid(query)) throw new IllegalArgumentException("Invalid contact-directory request");
        byte[] body = mapper.writeValueAsBytes(query);
        if (body.length > ContactDirectoryProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("Request exceeds limit");
        return exchange(ContactDirectoryProtocol.PATH, body, new TypeReference<java.util.Set<String>>() {},
                "contact-directory.read", 1048576, result -> result.stream().allMatch(item -> item != null && item.length() <= 512));
    }
}

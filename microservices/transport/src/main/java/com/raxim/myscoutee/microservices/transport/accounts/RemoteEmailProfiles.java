package com.raxim.myscoutee.microservices.transport.accounts;

import java.net.URI;
import java.time.Duration;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import com.raxim.myscoutee.domain.accounts.api.EmailProfiles;
import com.raxim.myscoutee.domain.accounts.dto.EmailProfileDto;
import com.raxim.myscoutee.microservices.transport.common.RemoteReadTransport;
import io.micrometer.core.instrument.MeterRegistry;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

public final class RemoteEmailProfiles extends RemoteReadTransport implements EmailProfiles {
    private final ObjectMapper mapper;
    public RemoteEmailProfiles(URI origin, String token, boolean allowHttp, Duration connectTimeout,
            Duration requestTimeout, ObjectMapper mapper, MeterRegistry metrics) {
        super(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics); this.mapper = mapper;
    }
    @Override public Optional<EmailProfileDto> findByUserId(String id) {
        var query = new EmailProfilesProtocol.SingleQuery(id);
        var result = exchange(EmailProfilesProtocol.SINGLE, body(query, EmailProfilesProtocol.valid(query)),
                new TypeReference<EmailProfilesProtocol.SingleResult>() {}, "email-profiles.single", EmailProfilesProtocol.MAX_RESPONSE_BYTES,
                value -> Boolean.TRUE.equals(value.resolved()) && (value.value() == null || java.util.Objects.equals(id, value.value().userId())));
        return Optional.ofNullable(result.value());
    }
    @Override public List<EmailProfileDto> findByUserIdIn(Collection<String> ids) {
        var query = new EmailProfilesProtocol.BatchQuery(ids);
        return exchange(EmailProfilesProtocol.BATCH, body(query, EmailProfilesProtocol.valid(query)),
                new TypeReference<List<EmailProfileDto>>() {}, "email-profiles.batch", EmailProfilesProtocol.MAX_RESPONSE_BYTES,
                values -> values.stream().allMatch(value -> value == null || ids.contains(value.userId())));
    }
    @Override public List<EmailProfileDto> findAll() {
        return exchange(EmailProfilesProtocol.ALL, body(new EmailProfilesProtocol.AllQuery(), true),
                new TypeReference<List<EmailProfileDto>>() {}, "email-profiles.all", EmailProfilesProtocol.MAX_RESPONSE_BYTES, values -> true);
    }
    private byte[] body(Object query, boolean valid) {
        if (!valid) throw new IllegalArgumentException("Invalid email profile query");
        byte[] bytes = mapper.writeValueAsBytes(query);
        if (bytes.length > EmailProfilesProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("Email profile request exceeds limit");
        return bytes;
    }
}

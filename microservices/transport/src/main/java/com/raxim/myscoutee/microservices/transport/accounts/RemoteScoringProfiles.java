package com.raxim.myscoutee.microservices.transport.accounts;

import java.net.URI;
import java.time.Duration;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import com.raxim.myscoutee.domain.accounts.api.ScoringProfiles;
import com.raxim.myscoutee.domain.accounts.dto.ScoringProfileDto;
import com.raxim.myscoutee.microservices.transport.common.RemoteReadTransport;
import io.micrometer.core.instrument.MeterRegistry;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

public final class RemoteScoringProfiles extends RemoteReadTransport implements ScoringProfiles {
    private final ObjectMapper mapper;
    public RemoteScoringProfiles(URI origin, String token, boolean allowHttp, Duration connectTimeout,
            Duration requestTimeout, ObjectMapper mapper, MeterRegistry metrics) {
        super(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics); this.mapper = mapper;
    }
    @Override public Optional<ScoringProfileDto> findByUserId(String id) {
        var query = new ScoringProfilesProtocol.SingleQuery(id);
        var result = exchange(ScoringProfilesProtocol.SINGLE, body(query, ScoringProfilesProtocol.valid(query)),
                new TypeReference<ScoringProfilesProtocol.SingleResult>() {}, "scoring-profiles.single", ScoringProfilesProtocol.MAX_RESPONSE_BYTES,
                value -> Boolean.TRUE.equals(value.resolved()) && (value.value() == null || java.util.Objects.equals(id, value.value().userId())));
        return Optional.ofNullable(result.value());
    }
    @Override public List<ScoringProfileDto> findByUserIdIn(Collection<String> ids) {
        var query = new ScoringProfilesProtocol.BatchQuery(ids);
        return exchange(ScoringProfilesProtocol.BATCH, body(query, ScoringProfilesProtocol.valid(query)),
                new TypeReference<List<ScoringProfileDto>>() {}, "scoring-profiles.batch", ScoringProfilesProtocol.MAX_RESPONSE_BYTES,
                values -> values.stream().allMatch(value -> value == null || ids.contains(value.userId())));
    }
    private byte[] body(Object query, boolean valid) {
        if (!valid) throw new IllegalArgumentException("Invalid asset profile query");
        byte[] bytes = mapper.writeValueAsBytes(query);
        if (bytes.length > ScoringProfilesProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("Asset profile request exceeds limit");
        return bytes;
    }
}

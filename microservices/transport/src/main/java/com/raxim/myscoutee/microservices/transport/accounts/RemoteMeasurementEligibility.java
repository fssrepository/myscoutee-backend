package com.raxim.myscoutee.microservices.transport.accounts;

import java.net.URI;
import java.time.Duration;
import java.util.*;
import com.raxim.myscoutee.domain.accounts.api.MeasurementEligibility;
import com.raxim.myscoutee.microservices.transport.common.RemoteReadTransport;
import io.micrometer.core.instrument.MeterRegistry;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

/** Partition large authoritative evidence sets into bounded owner queries, never one call per user. */
public final class RemoteMeasurementEligibility extends RemoteReadTransport implements MeasurementEligibility {
    private final ObjectMapper mapper;
    public RemoteMeasurementEligibility(URI origin, String token, boolean allowHttp, Duration connectTimeout,
            Duration requestTimeout, ObjectMapper mapper, MeterRegistry metrics) {
        super(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics); this.mapper = mapper;
    }
    @Override public Set<String> eligible(Collection<String> ids) {
        var unique = new ArrayList<>(new LinkedHashSet<>(Objects.requireNonNull(ids)));
        if (unique.stream().anyMatch(id -> id != null && id.length() > 512))
            throw new IllegalArgumentException("Invalid measurement identity");
        var result = new HashSet<String>();
        for (int offset = 0; offset < unique.size(); offset += MeasurementEligibilityProtocol.MAX_IDS) {
            var batch = unique.subList(offset, Math.min(unique.size(), offset + MeasurementEligibilityProtocol.MAX_IDS));
            var requested = new HashSet<>(batch);
            byte[] bytes = mapper.writeValueAsBytes(new MeasurementEligibilityProtocol.Query(batch));
            if (bytes.length > MeasurementEligibilityProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("Measurement query exceeds limit");
            result.addAll(exchange(MeasurementEligibilityProtocol.PATH, bytes, new TypeReference<Set<String>>() {},
                    "accounts.measurement-eligibility", MeasurementEligibilityProtocol.MAX_RESPONSE_BYTES,
                    values -> values.stream().allMatch(id -> id != null && requested.contains(id))));
        }
        return result;
    }
}

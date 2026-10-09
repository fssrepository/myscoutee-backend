package com.raxim.myscoutee.microservices.transport.accounts;

import java.net.URI;
import java.time.Duration;
import com.raxim.myscoutee.domain.accounts.api.LocationEligibility;
import com.raxim.myscoutee.domain.accounts.dto.AuthDtos.UserLocationEligibilityResponseDto;
import com.raxim.myscoutee.microservices.transport.common.RemoteReadTransport;
import io.micrometer.core.instrument.MeterRegistry;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

public final class RemoteLocationEligibility extends RemoteReadTransport implements LocationEligibility {
    private final ObjectMapper mapper;
    public RemoteLocationEligibility(URI origin, String token, boolean allowHttp, Duration connectTimeout,
            Duration requestTimeout, ObjectMapper mapper, MeterRegistry metrics) {
        super(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics); this.mapper = mapper;
    }
    @Override public UserLocationEligibilityResponseDto queryLocationEligibility(Double latitude, Double longitude) {
        // The canonical owner treats non-finite input as missing coordinates.
        // JSON cannot encode NaN/Infinity, so preserve that decision with nulls.
        var query = new LocationEligibilityProtocol.Query(
                latitude == null || !Double.isFinite(latitude) ? null : latitude,
                longitude == null || !Double.isFinite(longitude) ? null : longitude);
        return exchange(LocationEligibilityProtocol.PATH, mapper.writeValueAsBytes(query),
                new TypeReference<UserLocationEligibilityResponseDto>() {}, "accounts.location-eligibility",
                LocationEligibilityProtocol.MAX_RESPONSE_BYTES, value -> true);
    }
}

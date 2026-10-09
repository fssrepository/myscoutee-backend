package com.raxim.myscoutee.microservices.transport.accounts;

import java.net.URI;
import java.time.Duration;
import java.util.Collection;
import java.util.List;
import com.raxim.myscoutee.domain.accounts.api.RatingProfiles;
import com.raxim.myscoutee.domain.accounts.dto.RatingProfileDto;
import com.raxim.myscoutee.microservices.transport.common.RemoteReadTransport;
import io.micrometer.core.instrument.MeterRegistry;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

public final class RemoteRatingProfiles extends RemoteReadTransport implements RatingProfiles {
    private final ObjectMapper mapper;
    public RemoteRatingProfiles(URI origin, String token, boolean allowHttp, Duration connectTimeout,
            Duration requestTimeout, ObjectMapper mapper, MeterRegistry metrics) {
        super(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics);
        this.mapper = mapper;
    }
    @Override public List<RatingProfileDto> queryRatingProfiles(Collection<String> ids) {
        return exchange(RatingProfilesProtocol.PATH, RatingProfilesProtocol.encode(ids, mapper),
                new TypeReference<List<RatingProfileDto>>() {}, "accounts.rating-profiles",
                RatingProfilesProtocol.MAX_RESPONSE_BYTES, value -> true);
    }
}

package com.raxim.myscoutee.microservices.transport.platform;

import java.net.URI;
import java.time.Duration;
import java.util.List;
import com.raxim.myscoutee.common.dto.SharedDtos.LocationCoordinatesDto;
import com.raxim.myscoutee.domain.platform.api.CountryDirectory;
import com.raxim.myscoutee.microservices.transport.common.RemoteReadTransport;
import io.micrometer.core.instrument.MeterRegistry;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

public final class RemoteCountryDirectory extends RemoteReadTransport implements CountryDirectory {
    private final ObjectMapper mapper;
    public RemoteCountryDirectory(URI origin, String token, boolean allowHttp, Duration connectTimeout,
            Duration requestTimeout, ObjectMapper mapper, MeterRegistry metrics) {
        super(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics); this.mapper = mapper;
    }
    @Override public List<CountryDirectoryProtocol.CountryDto> supportedCountries() {
        return exchange(CountryDirectoryProtocol.COUNTRIES, new TypeReference<List<CountryDirectoryProtocol.CountryDto>>() {},
                "platform.countries", 1048576, countries -> countries.stream().allMatch(java.util.Objects::nonNull));
    }
    @Override public String resolvePartitionKey(LocationCoordinatesDto coordinates) { return resolvePartitionKey(coordinates, null); }
    @Override public String resolvePartitionKey(LocationCoordinatesDto coordinates, String preferred) {
        var query = new CountryDirectoryProtocol.Query(coordinates, preferred);
        if (!CountryDirectoryProtocol.valid(query)) throw new IllegalArgumentException("Invalid country query");
        byte[] bytes = mapper.writeValueAsBytes(query);
        if (bytes.length > CountryDirectoryProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("Country query exceeds limit");
        return exchange(CountryDirectoryProtocol.PARTITION, bytes, new TypeReference<CountryDirectoryProtocol.Partition>() {},
                "platform.country-partition", 16384, value -> Boolean.TRUE.equals(value.resolved())).partitionKey();
    }
}

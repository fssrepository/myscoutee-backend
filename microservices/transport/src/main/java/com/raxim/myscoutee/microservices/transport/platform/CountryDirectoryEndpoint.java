package com.raxim.myscoutee.microservices.transport.platform;

import com.raxim.myscoutee.domain.platform.api.CountryDirectory;
import com.raxim.myscoutee.microservices.transport.common.ReadQueryBodies;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import tools.jackson.databind.*;

@RestController
public final class CountryDirectoryEndpoint {
    private final CountryDirectory owner;
    private final ObjectMapper mapper;
    public CountryDirectoryEndpoint(CountryDirectory owner, ObjectMapper mapper) { this.owner = owner; this.mapper = mapper; }
    @GetMapping(value = CountryDirectoryProtocol.COUNTRIES, produces = "application/json")
    public ResponseEntity<?> countries() {
        try {
            return response(200, owner.supportedCountries().stream().map(country ->
                    new CountryDirectoryProtocol.CountryDto(country.getCountryCode(), country.getCountryName())).toList());
        } catch (RuntimeException unavailable) { return unavailable(); }
    }
    @PostMapping(value = CountryDirectoryProtocol.PARTITION, produces = "application/json")
    public ResponseEntity<?> partition(HttpServletRequest request) throws java.io.IOException {
        try {
            byte[] bytes = ReadQueryBodies.readBytes(request, CountryDirectoryProtocol.MAX_REQUEST_BYTES);
            CountryDirectoryProtocol.Query query;
            try {
                query = mapper.readerFor(CountryDirectoryProtocol.Query.class).with(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES)
                        .with(DeserializationFeature.FAIL_ON_TRAILING_TOKENS).readValue(bytes);
            } catch (RuntimeException invalid) { throw new ReadQueryBodies.RejectedQuery(400, "INVALID_REQUEST"); }
            if (!CountryDirectoryProtocol.valid(query)) throw new ReadQueryBodies.RejectedQuery(400, "INVALID_REQUEST");
            return response(200, new CountryDirectoryProtocol.Partition(true, owner.resolvePartitionKey(query.coordinates(), query.preferred())));
        } catch (ReadQueryBodies.RejectedQuery invalid) { return response(invalid.status(), new CountryDirectoryProtocol.Error(invalid.code())); }
        catch (RuntimeException unavailable) { return unavailable(); }
    }
    @PostMapping(value = CountryDirectoryProtocol.PARTITIONS, produces = "application/json")
    public ResponseEntity<?> partitions(HttpServletRequest request) throws java.io.IOException {
        try {
            byte[] bytes = ReadQueryBodies.readBytes(request, CountryDirectoryProtocol.MAX_REQUEST_BYTES);
            CountryDirectoryProtocol.BatchQuery query;
            try {
                query = mapper.readerFor(CountryDirectoryProtocol.BatchQuery.class).with(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES)
                        .with(DeserializationFeature.FAIL_ON_TRAILING_TOKENS).readValue(bytes);
            } catch (RuntimeException invalid) { throw new ReadQueryBodies.RejectedQuery(400, "INVALID_REQUEST"); }
            if (!CountryDirectoryProtocol.valid(query)) throw new ReadQueryBodies.RejectedQuery(400, "INVALID_REQUEST");
            return response(200, new CountryDirectoryProtocol.Partitions(true, owner.resolvePartitionKeys(query.coordinates())));
        } catch (ReadQueryBodies.RejectedQuery invalid) { return response(invalid.status(), new CountryDirectoryProtocol.Error(invalid.code())); }
        catch (RuntimeException unavailable) { return unavailable(); }
    }
    private ResponseEntity<?> unavailable() { return response(503, new CountryDirectoryProtocol.Error("COUNTRY_DIRECTORY_UNAVAILABLE")); }
    private ResponseEntity<?> response(int status, Object body) { return ResponseEntity.status(status).cacheControl(CacheControl.noStore()).body(body); }
}

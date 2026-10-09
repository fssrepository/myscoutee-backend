package com.raxim.myscoutee.microservices.transport.platform;

import com.raxim.myscoutee.common.dto.SharedDtos.LocationCoordinatesDto;
import com.raxim.myscoutee.domain.platform.api.CountryDirectory;

public final class CountryDirectoryProtocol {
    public static final String COUNTRIES = "/_internal/v1/platform/countries";
    public static final String PARTITION = "/_internal/v1/platform/countries/partition";
    public static final int MAX_REQUEST_BYTES = 16384;
    private CountryDirectoryProtocol() {}
    public record CountryDto(String countryCode, String countryName) implements CountryDirectory.Country {
        @Override public String getCountryCode() { return countryCode; }
        @Override public String getCountryName() { return countryName; }
    }
    public record Query(LocationCoordinatesDto coordinates, String preferred) {}
    public record Partition(Boolean resolved, String partitionKey) {}
    public record Error(String code) {}
    public static String[] paths() { return new String[]{COUNTRIES, PARTITION}; }
    public static boolean valid(Query query) {
        return query != null && (query.preferred() == null || query.preferred().length() <= 512);
    }
}

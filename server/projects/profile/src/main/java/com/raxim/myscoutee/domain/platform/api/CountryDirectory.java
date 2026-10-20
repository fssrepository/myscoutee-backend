package com.raxim.myscoutee.domain.platform.api;
public interface CountryDirectory {
    int MAX_PARTITION_BATCH_SIZE = 128;
    java.util.List<? extends Country> supportedCountries();
    interface Country { String getCountryCode(); String getCountryName(); }
    String resolvePartitionKey(com.raxim.myscoutee.common.dto.SharedDtos.LocationCoordinatesDto coordinates);
    String resolvePartitionKey(com.raxim.myscoutee.common.dto.SharedDtos.LocationCoordinatesDto coordinates, String preferred);
    java.util.List<String> resolvePartitionKeys(java.util.List<com.raxim.myscoutee.common.dto.SharedDtos.LocationCoordinatesDto> coordinates);
}

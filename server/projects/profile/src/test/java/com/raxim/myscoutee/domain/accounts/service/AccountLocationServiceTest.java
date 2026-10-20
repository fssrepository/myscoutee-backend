package com.raxim.myscoutee.domain.accounts.service;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.raxim.myscoutee.common.dto.SharedDtos.LocationCoordinatesDto;
import com.raxim.myscoutee.domain.access.api.RegionSecurity;
import com.raxim.myscoutee.domain.platform.api.CountryDirectory;
import java.util.*;
import java.util.stream.IntStream;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;

@Tag("standard")
class AccountLocationServiceTest {
    private final CountryDirectory countries = mock(CountryDirectory.class);
    private final RegionSecurity security = mock(RegionSecurity.class);
    private final AccountLocationService service = new AccountLocationService(null, null, null, countries, security, null);

    @Test
    void disabledRegionSecurityNeedsNoCountryLookup() {
        var point = new LocationCoordinatesDto(47d, 19d);
        assertThat(service.demoLocationRequirements(Arrays.asList(null, point, new LocationCoordinatesDto(91d, 0d))))
                .containsExactlyEntriesOf(Map.of(point, false));
        verifyNoInteractions(countries);
    }

    @Test
    void deduplicatesPointsAndSplitsBoundedBatchesWithoutLosingUnsupportedResults() {
        when(security.isEnabled()).thenReturn(true);
        var points = IntStream.range(0, 129).mapToObj(i -> new LocationCoordinatesDto(0d, (double) i)).toList();
        when(countries.resolvePartitionKeys(points.subList(0, 128))).thenReturn(Collections.nCopies(128, "country:test"));
        when(countries.resolvePartitionKeys(points.subList(128, 129))).thenReturn(Collections.singletonList(null));
        var input = new ArrayList<>(points);
        input.add(points.getFirst());
        input.add(null);
        var result = service.demoLocationRequirements(input);
        assertThat(result).hasSize(129).containsEntry(points.getFirst(), false).containsEntry(points.getLast(), true);
        verify(countries).resolvePartitionKeys(points.subList(0, 128));
        verify(countries).resolvePartitionKeys(points.subList(128, 129));
        verifyNoMoreInteractions(countries);
    }

    @Test
    void incompleteOrFailedCountryChecksCannotBecomeEligibleLocations() {
        when(security.isEnabled()).thenReturn(true);
        var points = List.of(new LocationCoordinatesDto(47d, 19d));
        when(countries.resolvePartitionKeys(points)).thenReturn(List.of());
        assertThatThrownBy(() -> service.demoLocationRequirements(points)).isInstanceOf(IllegalStateException.class);
        when(countries.resolvePartitionKeys(points)).thenThrow(new IllegalStateException("unavailable"));
        assertThatThrownBy(() -> service.demoLocationRequirements(points)).isInstanceOf(IllegalStateException.class);
    }
}

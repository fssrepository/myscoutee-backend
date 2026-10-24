package com.raxim.myscoutee.microservices.transport.platform;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.raxim.myscoutee.common.dto.SharedDtos.LocationCoordinatesDto;
import com.raxim.myscoutee.domain.platform.api.CountryDirectory;
import java.util.*;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import tools.jackson.databind.json.JsonMapper;

class CountryDirectoryBatchTest {
    private final JsonMapper mapper = new JsonMapper();
    private final CountryDirectory owner = mock(CountryDirectory.class);
    private final CountryDirectoryEndpoint endpoint = new CountryDirectoryEndpoint(owner, mapper);

    @Test
    void preservesNullSlotsAndInputOrderThroughJson() throws Exception {
        var points = Arrays.asList(new LocationCoordinatesDto(47d, 19d), null, new LocationCoordinatesDto(0d, 0d));
        when(owner.resolvePartitionKeys(points)).thenReturn(Arrays.asList("country:hu", null, null));
        var response = endpoint.partitions(request(mapper.writeValueAsBytes(new CountryDirectoryProtocol.BatchQuery(points))));
        assertEquals(200, response.getStatusCode().value());
        assertEquals("no-store", response.getHeaders().getCacheControl());
        var decoded = mapper.readValue(mapper.writeValueAsBytes(response.getBody()), CountryDirectoryProtocol.Partitions.class);
        assertEquals(new CountryDirectoryProtocol.Partitions(true, Arrays.asList("country:hu", null, null)), decoded);
        verify(owner).resolvePartitionKeys(points);
    }

    @Test
    void rejectsMalformedOversizedAndUnboundedRequestsBeforeCallingOwner() throws Exception {
        for (var body : List.of("null", "{}", "{\"coordinates\":null}", "{} {}", "{\"coordinates\":[],\"actor\":\"admin\"}")) {
            assertEquals(400, endpoint.partitions(request(body.getBytes(java.nio.charset.StandardCharsets.UTF_8))).getStatusCode().value());
        }
        var oversizedBatch = new CountryDirectoryProtocol.BatchQuery(Collections.nCopies(129, new LocationCoordinatesDto(0d, 0d)));
        assertEquals(400, endpoint.partitions(request(mapper.writeValueAsBytes(oversizedBatch))).getStatusCode().value());
        assertEquals(413, endpoint.partitions(request(new byte[CountryDirectoryProtocol.MAX_REQUEST_BYTES + 1])).getStatusCode().value());
        verifyNoInteractions(owner);
    }

    @Test
    void countryLookupFailureStaysUnavailableAndDoesNotExposeStorageDetails() throws Exception {
        when(owner.resolvePartitionKeys(List.of())).thenThrow(new IllegalStateException("private-storage"));
        var response = endpoint.partitions(request(mapper.writeValueAsBytes(new CountryDirectoryProtocol.BatchQuery(List.of()))));
        assertEquals(503, response.getStatusCode().value());
        assertEquals("no-store", response.getHeaders().getCacheControl());
        assertEquals(new CountryDirectoryProtocol.Error("COUNTRY_DIRECTORY_UNAVAILABLE"), response.getBody());
    }

    private MockHttpServletRequest request(byte[] body) {
        var request = new MockHttpServletRequest("POST", CountryDirectoryProtocol.PARTITIONS);
        request.setContentType("application/json");
        request.setContent(body);
        return request;
    }
}

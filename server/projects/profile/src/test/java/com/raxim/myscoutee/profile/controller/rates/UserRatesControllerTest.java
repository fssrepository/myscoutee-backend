package com.raxim.myscoutee.profile.controller.rates;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.raxim.myscoutee.profile.data.dto.rates.RatesDtos.UserRatesSyncRequestDto;
import com.raxim.myscoutee.profile.data.dto.rates.RatesDtos.UserRatesSyncResponseDto;
import com.raxim.myscoutee.profile.service.UserRatesService;

@ExtendWith(MockitoExtension.class)
class UserRatesControllerTest {
    @Mock
    private UserRatesService userRatesService;

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders
                .standaloneSetup(new UserRatesController(userRatesService))
                .build();
    }

    @Test
    void syncAcceptsRateDtoAndReturnsSyncResult() throws Exception {
        when(userRatesService.sync(any(UserRatesSyncRequestDto.class)))
                .thenReturn(new UserRatesSyncResponseDto(List.of("rate-1"), List.of("bad-rate")));

        mockMvc.perform(post("/user-rates/sync")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "rates": [
                                    {
                                      "id": "rate-1",
                                      "fromUserId": "owner-1",
                                      "toUserId": "candidate-1",
                                      "rate": 9,
                                      "mode": "single",
                                      "createdAtIso": "2026-05-08T10:00:00Z",
                                      "updatedAtIso": "2026-05-08T10:01:00Z",
                                      "ownerUserId": "owner-1",
                                      "displayDirection": "given",
                                      "socialContext": "friends-in-common",
                                      "bridgeUserId": "bridge-1",
                                      "bridgeCount": 2,
                                      "scoreGiven": 9,
                                      "scoreReceived": 0,
                                      "happenedAtIso": "2026-05-08T10:00:00Z",
                                      "distanceMetersExact": 1200
                                    }
                                  ]
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.syncedRateIds[0]").value("rate-1"))
                .andExpect(jsonPath("$.failedRateIds[0]").value("bad-rate"));

        ArgumentCaptor<UserRatesSyncRequestDto> requestCaptor = ArgumentCaptor.forClass(UserRatesSyncRequestDto.class);
        verify(userRatesService).sync(requestCaptor.capture());

        UserRatesSyncRequestDto request = requestCaptor.getValue();
        assertThat(request.rates()).hasSize(1);
        assertThat(request.rates().get(0).id()).isEqualTo("rate-1");
        assertThat(request.rates().get(0).fromUserId()).isEqualTo("owner-1");
        assertThat(request.rates().get(0).toUserId()).isEqualTo("candidate-1");
        assertThat(request.rates().get(0).rate()).isEqualTo(9);
        assertThat(request.rates().get(0).mode()).isEqualTo("single");
        assertThat(request.rates().get(0).ownerUserId()).isEqualTo("owner-1");
        assertThat(request.rates().get(0).displayDirection()).isEqualTo("given");
        assertThat(request.rates().get(0).socialContext()).isEqualTo("friends-in-common");
        assertThat(request.rates().get(0).bridgeUserId()).isEqualTo("bridge-1");
        assertThat(request.rates().get(0).bridgeCount()).isEqualTo(2);
        assertThat(request.rates().get(0).scoreGiven()).isEqualTo(9);
        assertThat(request.rates().get(0).scoreReceived()).isZero();
        assertThat(request.rates().get(0).distanceMetersExact()).isEqualTo(1200);
    }
}

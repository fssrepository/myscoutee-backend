package com.raxim.myscoutee.profile.controller.operator;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.raxim.myscoutee.profile.data.dto.operator.OperatorRevenueDtos.OperatorRevenueSyncDto;
import com.raxim.myscoutee.profile.service.operator.OperatorRevenueReportService;
import com.raxim.myscoutee.profile.service.operator.OperatorRevenueService;
import com.raxim.myscoutee.profile.service.operator.OperatorSettlementService;

class OperatorRevenueControllerTest {
    @Test
    void revenueRoutesUseTheOperatorWorkspacePath() throws Exception {
        OperatorRevenueService revenueService =
                mock(OperatorRevenueService.class);
        OperatorRevenueReportService reportService =
                mock(OperatorRevenueReportService.class);
        OperatorSettlementService settlementService =
                mock(OperatorSettlementService.class);
        when(reportService.synchronizeNow()).thenReturn(
                new OperatorRevenueSyncDto(
                        "SYNCHRONIZED",
                        null,
                        "Revenue reports are synchronized.",
                        0,
                        0,
                        0,
                        0L,
                        0L,
                        "2026-07-28T00:00:00Z"));
        var mockMvc = MockMvcBuilders.standaloneSetup(
                        new OperatorRevenueController(
                                revenueService,
                                reportService,
                                settlementService))
                .build();

        mockMvc.perform(get("/operator/revenue"))
                .andExpect(status().isOk());
        mockMvc.perform(post("/operator/revenue/synchronize"))
                .andExpect(status().isOk());
        mockMvc.perform(get("/operator/revenue/reports")
                        .param("status", "BLOCKED")
                        .param("page", "2")
                        .param("size", "10"))
                .andExpect(status().isOk());
        mockMvc.perform(post(
                        "/operator/revenue/reports/{reportId}/requeue",
                        "a".repeat(24)))
                .andExpect(status().isOk());
        mockMvc.perform(get("/operator/revenue/settlements")
                        .param("currencyCode", "EUR")
                        .param("fromPeriod", "2026-01")
                        .param("throughPeriod", "2026-06")
                        .param("limit", "10"))
                .andExpect(status().isOk());
        mockMvc.perform(get("/operator/revenue/settlements"))
                .andExpect(status().isOk());

        verify(revenueService).revenue();
        verify(reportService).synchronizeNow();
        verify(reportService).reports("BLOCKED", 2, 10);
        verify(reportService).requeue("a".repeat(24));
        verify(settlementService).settlements(
                "EUR",
                "2026-01",
                "2026-06",
                false,
                10,
                null,
                null);
        verify(settlementService).settlements(
                null,
                null,
                null,
                false,
                20,
                null,
                null);
    }

    @Test
    void controllerRequiresDistinctOperatorAuthority() {
        PreAuthorize annotation =
                OperatorRevenueController.class.getAnnotation(
                        PreAuthorize.class);

        assertThat(annotation).isNotNull();
        assertThat(annotation.value()).isEqualTo("hasAuthority('O')");
        assertThat(annotation.value()).doesNotContain("'A'");
    }
}

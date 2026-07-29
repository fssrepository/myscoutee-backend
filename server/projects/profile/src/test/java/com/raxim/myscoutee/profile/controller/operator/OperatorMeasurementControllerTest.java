package com.raxim.myscoutee.profile.controller.operator;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.raxim.myscoutee.profile.service.operator.OperatorQualifiedMauReportService;

class OperatorMeasurementControllerTest {
    @Test
    void measurementRoutesUseTheOperatorWorkspacePath()
            throws Exception {
        OperatorQualifiedMauReportService service =
                mock(OperatorQualifiedMauReportService.class);
        var mockMvc = MockMvcBuilders.standaloneSetup(
                        new OperatorMeasurementController(service))
                .build();

        mockMvc.perform(post(
                        "/operator/measurements/synchronize"))
                .andExpect(status().isOk());
        mockMvc.perform(get("/operator/measurements/reports")
                        .param("status", "BLOCKED")
                        .param("page", "2")
                        .param("size", "10"))
                .andExpect(status().isOk());
        mockMvc.perform(post(
                        "/operator/measurements/reports/{reportId}/requeue",
                        "a".repeat(24)))
                .andExpect(status().isOk());

        verify(service).synchronizeNow();
        verify(service).reports("BLOCKED", 2, 10);
        verify(service).requeue("a".repeat(24));
    }

    @Test
    void controllerRequiresDistinctOperatorAuthority() {
        PreAuthorize annotation =
                OperatorMeasurementController.class.getAnnotation(
                        PreAuthorize.class);

        assertThat(annotation).isNotNull();
        assertThat(annotation.value()).isEqualTo("hasAuthority('O')");
        assertThat(annotation.value()).doesNotContain("'A'");
    }
}

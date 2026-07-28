package com.raxim.myscoutee.profile.controller.deployment;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.raxim.myscoutee.profile.data.dto.operator.OperatorConfigurationDtos.DeploymentBrandingDto;
import com.raxim.myscoutee.profile.data.dto.operator.OperatorConfigurationDtos.DeploymentThemePreset;
import com.raxim.myscoutee.profile.service.operator.OperatorConfigurationService;

class DeploymentConfigurationControllerTest {
    @Test
    void publicRouteReturnsExactlyBrandingAndNoOperatorOrSecretState() throws Exception {
        OperatorConfigurationService service = mock(OperatorConfigurationService.class);
        when(service.branding()).thenReturn(new DeploymentBrandingDto(
                "Community",
                "Welcome home",
                "/media/public?key=images%2Fbranding%2Fmedium",
                DeploymentThemePreset.FOREST,
                7L));
        var mockMvc = MockMvcBuilders
                .standaloneSetup(new DeploymentConfigurationController(service))
                .build();

        mockMvc.perform(get("/deployment/configuration"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.productName").value("Community"))
                .andExpect(jsonPath("$.homeLabel").value("Welcome home"))
                .andExpect(jsonPath("$.logoUrl")
                        .value("/media/public?key=images%2Fbranding%2Fmedium"))
                .andExpect(jsonPath("$.themePreset").value("FOREST"))
                .andExpect(jsonPath("$.revision").value(7))
                .andExpect(jsonPath("$.payment").doesNotExist())
                .andExpect(jsonPath("$.firebase").doesNotExist())
                .andExpect(jsonPath("$.updatedAt").doesNotExist())
                .andExpect(jsonPath("$.credential").doesNotExist());

        verify(service).branding();
    }
}

package com.raxim.myscoutee.profile.controller.operator;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.raxim.myscoutee.profile.data.dto.operator.OperatorConfigurationDtos.ConfigurationTestRequestDto;
import com.raxim.myscoutee.profile.data.dto.operator.OperatorConfigurationDtos.OperatorConfigurationUpdateDto;
import com.raxim.myscoutee.profile.service.operator.OperatorConfigurationService;

class OperatorConfigurationControllerTest {
    @Test
    void controllerRequiresOperatorAuthorityWithNoAdminFallback() {
        PreAuthorize annotation =
                OperatorConfigurationController.class.getAnnotation(PreAuthorize.class);

        assertThat(annotation).isNotNull();
        assertThat(annotation.value()).isEqualTo("hasAuthority('O')");
        assertThat(annotation.value()).doesNotContain("'A'");
    }

    @Test
    void routesUseGetPutAndPluralTestsPath() throws Exception {
        OperatorConfigurationService service = mock(OperatorConfigurationService.class);
        var mockMvc = MockMvcBuilders
                .standaloneSetup(new OperatorConfigurationController(service))
                .build();

        mockMvc.perform(get("/operator/configuration"))
                .andExpect(status().isOk());
        mockMvc.perform(put("/operator/configuration")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "adminEmails": ["admin@example.test"],
                                  "socialLinks": [
                                    {
                                      "provider": "discord",
                                      "label": "Discord",
                                      "url": "https://discord.example.test/community",
                                      "icon": "discord",
                                      "handle": "@community"
                                    }
                                  ],
                                  "branding": {
                                    "productName": "Community",
                                    "logoUrl": "/media/public?key=images%2Flogo",
                                    "themePreset": "AURORA"
                                  },
                                  "payment": {
                                    "providerId": "stripe",
                                    "credential": "write-only-token"
                                  },
                                  "firebase": {
                                    "projectId": "community-project",
                                    "authenticationCredential": "",
                                    "messagingCredential": ""
                                  }
                                }
                                """))
                .andExpect(status().isOk());
        mockMvc.perform(post("/operator/configuration/tests")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"kind":"FIREBASE_MESSAGING"}
                                """))
                .andExpect(status().isOk());

        verify(service).configuration();
        verify(service).update(any(OperatorConfigurationUpdateDto.class));
        verify(service).test(any(ConfigurationTestRequestDto.class));
    }
}

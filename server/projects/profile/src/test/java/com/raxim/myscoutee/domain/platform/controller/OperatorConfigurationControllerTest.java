package com.raxim.myscoutee.domain.platform.controller;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.http.MediaType;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.raxim.myscoutee.domain.platform.dto.OperatorConfigurationDtos.ConfigurationTestRequestDto;
import com.raxim.myscoutee.domain.platform.dto.OperatorConfigurationDtos.OperatorConfigurationUpdateDto;
import com.raxim.myscoutee.domain.platform.api.DeploymentConfigurationManagement;

@org.junit.jupiter.api.Tag("standard")
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
        DeploymentConfigurationManagement service = mock(DeploymentConfigurationManagement.class);
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
                                  "privacyContact": {
                                    "dataControllerName": "Community Cooperative",
                                    "privacyContactEmail": "privacy@community.example"
                                  },
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
                                    "logoUrl": "/media/public?key=images%2Flogo"
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
        mockMvc.perform(post(
                        "/operator/configuration/firebase/activate"))
                .andExpect(status().isOk());

        verify(service).configuration();
        ArgumentCaptor<OperatorConfigurationUpdateDto> updateCaptor =
                ArgumentCaptor.forClass(OperatorConfigurationUpdateDto.class);
        verify(service).update(updateCaptor.capture());
        assertThat(updateCaptor.getValue().privacyContact().dataControllerName())
                .isEqualTo("Community Cooperative");
        assertThat(updateCaptor.getValue().privacyContact().privacyContactEmail())
                .isEqualTo("privacy@community.example");
        verify(service).test(any(ConfigurationTestRequestDto.class));
        verify(service).activateFirebase();
    }
}

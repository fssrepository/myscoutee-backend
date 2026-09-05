package com.raxim.myscoutee.profile.controller.deployment;

import java.util.List;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.raxim.myscoutee.profile.data.dto.operator.OperatorConfigurationDtos.DeploymentPrivacyContactDto;
import com.raxim.myscoutee.profile.data.dto.operator.OperatorConfigurationDtos.DeploymentPublicConfigurationDto;
import com.raxim.myscoutee.profile.data.dto.operator.OperatorConfigurationDtos.DeploymentSocialLinkDto;
import com.raxim.myscoutee.profile.data.dto.operator.OperatorConfigurationDtos.DeploymentThemePreset;
import com.raxim.myscoutee.profile.data.dto.operator.OperatorConfigurationDtos.FirebasePublicConfigurationDto;
import com.raxim.myscoutee.profile.service.operator.OperatorConfigurationService;

class DeploymentConfigurationControllerTest {
    @Test
    void publicRouteReturnsBrandingSocialAndPrivacyStateWithoutOperatorSecrets()
            throws Exception {
        OperatorConfigurationService service = mock(OperatorConfigurationService.class);
        when(service.publicConfiguration()).thenReturn(
                new DeploymentPublicConfigurationDto(
                        "Community",
                        2,
                        "Welcome home",
                        "/media/public?key=images%2Fbranding%2Fmedium",
                        DeploymentThemePreset.FOREST,
                        7L,
                        "stripe",
                        List.of(new DeploymentSocialLinkDto(
                                "discord",
                                "Discord",
                                "https://discord.example.test/community",
                                "discord",
                                "@community")),
                        new DeploymentPrivacyContactDto(
                                true,
                                "Community Cooperative",
                                "privacy@community.example")));
        var mockMvc = MockMvcBuilders
                .standaloneSetup(new DeploymentConfigurationController(service))
                .build();

        mockMvc.perform(get("/deployment/configuration"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.productName").value("Community"))
                .andExpect(jsonPath("$.logoCharacterIndex").value(2))
                .andExpect(jsonPath("$.homeLabel").value("Welcome home"))
                .andExpect(jsonPath("$.logoUrl")
                        .value("/media/public?key=images%2Fbranding%2Fmedium"))
                .andExpect(jsonPath("$.themePreset").value("FOREST"))
                .andExpect(jsonPath("$.revision").value(7))
                .andExpect(jsonPath("$.paymentProviderId").value("stripe"))
                .andExpect(jsonPath("$.socialLinks[0].provider")
                        .value("discord"))
                .andExpect(jsonPath("$.socialLinks[0].label")
                        .value("Discord"))
                .andExpect(jsonPath("$.socialLinks[0].url")
                        .value("https://discord.example.test/community"))
                .andExpect(jsonPath("$.socialLinks[0].icon")
                        .value("discord"))
                .andExpect(jsonPath("$.socialLinks[0].handle")
                        .value("@community"))
                .andExpect(jsonPath("$.privacyContact.configured")
                        .value(true))
                .andExpect(jsonPath("$.privacyContact.dataControllerName")
                        .value("Community Cooperative"))
                .andExpect(jsonPath("$.privacyContact.privacyContactEmail")
                        .value("privacy@community.example"))
                .andExpect(jsonPath("$.adminEmails").doesNotExist())
                .andExpect(jsonPath("$.payment").doesNotExist())
                .andExpect(jsonPath("$.firebase").doesNotExist())
                .andExpect(jsonPath("$.updatedAt").doesNotExist())
                .andExpect(jsonPath("$.credential").doesNotExist());

        verify(service).publicConfiguration();
    }

    @Test
    void publicFirebaseRouteReturnsOnlyBrowserBootstrapFields()
            throws Exception {
        OperatorConfigurationService service =
                mock(OperatorConfigurationService.class);
        when(service.publicFirebaseConfiguration()).thenReturn(
                new FirebasePublicConfigurationDto(
                        4L,
                        "browser-api-key",
                        "community.firebaseapp.com",
                        "community",
                        "community.firebasestorage.app",
                        "123456789",
                        "1:123456789:web:abc",
                        "",
                        "public-vapid-key"));
        var mockMvc = MockMvcBuilders
                .standaloneSetup(
                        new DeploymentConfigurationController(service))
                .build();

        mockMvc.perform(get(
                        "/deployment/configuration/firebase-config"))
                .andExpect(status().isOk())
                .andExpect(header().string("Cache-Control", "no-store"))
                .andExpect(header().string("Pragma", "no-cache"))
                .andExpect(jsonPath("$.apiKey")
                        .value("browser-api-key"))
                .andExpect(jsonPath("$.revision").value(4))
                .andExpect(jsonPath("$.projectId")
                        .value("community"))
                .andExpect(jsonPath("$.vapidKey")
                        .value("public-vapid-key"))
                .andExpect(jsonPath("$.credential").doesNotExist())
                .andExpect(jsonPath("$.privateKey").doesNotExist());

        verify(service).publicFirebaseConfiguration();
    }
}

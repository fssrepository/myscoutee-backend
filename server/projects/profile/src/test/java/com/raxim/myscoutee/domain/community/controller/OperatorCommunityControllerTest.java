package com.raxim.myscoutee.domain.community.controller;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.raxim.myscoutee.domain.community.service.CommunityProviderService;

@org.junit.jupiter.api.Tag("standard")
class OperatorCommunityControllerTest {
    @Test
    void controllerRequiresOperatorAuthorityWithNoAdminFallback() {
        PreAuthorize annotation =
                OperatorCommunityController.class.getAnnotation(PreAuthorize.class);

        assertThat(annotation).isNotNull();
        assertThat(annotation.value()).isEqualTo("hasAuthority('O')");
        assertThat(annotation.value()).doesNotContain("'A'");
    }

    @Test
    void providerRouteReadsTheDeploymentCatalog() throws Exception {
        CommunityProviderService service = mock(CommunityProviderService.class);
        var mockMvc = MockMvcBuilders
                .standaloneSetup(new OperatorCommunityController(service))
                .build();

        mockMvc.perform(get("/operator/community/providers"))
                .andExpect(status().isOk());

        verify(service).availableProviders();
    }
}

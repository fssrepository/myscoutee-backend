package com.raxim.myscoutee.profile.controller.operator;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import com.raxim.myscoutee.profile.data.dto.operator.OperatorRegistryDtos.RegistryInspectRequestDto;
import com.raxim.myscoutee.profile.data.dto.operator.OperatorRegistryDtos.RegistryInspectionDto;
import com.raxim.myscoutee.profile.data.dto.operator.OperatorRegistryDtos.RegistryRegisterRequestDto;
import com.raxim.myscoutee.profile.service.operator.OperatorRegistryService;

class OperatorRegistryControllerTest {
    @Test
    void statusRouteMatchesTheNginxStrippedApiPrefix() throws Exception {
        OperatorRegistryService service = mock(OperatorRegistryService.class);
        var mockMvc = MockMvcBuilders
                .standaloneSetup(new OperatorRegistryController(service))
                .build();

        mockMvc.perform(get("/operator/registry"))
                .andExpect(status().isOk());

        verify(service).status();
    }

    @Test
    void controllerRequiresDistinctOperatorAuthority() {
        PreAuthorize annotation = OperatorRegistryController.class.getAnnotation(PreAuthorize.class);

        assertThat(annotation).isNotNull();
        assertThat(annotation.value()).isEqualTo("hasAuthority('O')");
        assertThat(annotation.value()).doesNotContain("'A'");
    }

    @Test
    void inspectDelegatesWithAuthenticatedActorAndExactRequest() {
        OperatorRegistryService service = mock(OperatorRegistryService.class);
        OperatorRegistryController controller = new OperatorRegistryController(service);
        RegistryInspectRequestDto request =
                new RegistryInspectRequestDto("https://registry.example", "program:one");
        RegistryInspectionDto expected =
                new RegistryInspectionDto("token", "expires", "https://registry.example", false, null);
        var authentication = new UsernamePasswordAuthenticationToken(
                "operator-1",
                null,
                java.util.List.of(new SimpleGrantedAuthority("O")));
        when(service.inspect(request, "operator-1")).thenReturn(expected);

        assertThat(controller.inspect(request, authentication)).isSameAs(expected);
        verify(service).inspect(request, "operator-1");
    }

    @Test
    void registerDelegatesOnlyFromTheExplicitRegisterRoute() {
        OperatorRegistryService service = mock(OperatorRegistryService.class);
        OperatorRegistryController controller = new OperatorRegistryController(service);
        RegistryRegisterRequestDto request =
                new RegistryRegisterRequestDto("https://registry.example", "program:one");
        var authentication = new UsernamePasswordAuthenticationToken(
                "operator-1",
                null,
                java.util.List.of(new SimpleGrantedAuthority("O")));

        controller.register(request, authentication);

        verify(service).register(request, "operator-1");
    }
}

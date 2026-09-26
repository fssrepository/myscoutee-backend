package com.raxim.myscoutee.profile.controller.integration;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import java.util.Map;
import java.util.Base64;
import java.nio.charset.StandardCharsets;
import org.junit.jupiter.api.Test;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.http.MediaType;
import com.raxim.myscoutee.profile.service.McpAuthorizationService;

class McpOAuthControllerTest {
    final McpAuthorizationService service = mock(McpAuthorizationService.class);
    final org.springframework.test.web.servlet.MockMvc mvc = MockMvcBuilders.standaloneSetup(new McpOAuthController(service)).build();
    @Test void acceptsBothAdvertisedClientAuthenticationMethodsAndForbidsCaching() throws Exception {
        when(service.exchange(anyMap(),eq("client"),eq("secret+value"),anyString())).thenReturn(Map.of("access_token","token","token_type","Bearer"));
        String basic = Base64.getEncoder().encodeToString("client:secret%2Bvalue".getBytes(StandardCharsets.UTF_8));
        mvc.perform(post("/mcp/oauth/token").contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .header("Authorization","Basic "+basic).param("grant_type","authorization_code"))
                .andExpect(status().isOk()).andExpect(header().string("Cache-Control","no-store")).andExpect(jsonPath("$.access_token").value("token"));
        mvc.perform(post("/mcp/oauth/token").contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .param("client_id","client").param("client_secret","secret+value").param("grant_type","refresh_token"))
                .andExpect(status().isOk());
        verify(service,times(2)).exchange(anyMap(),eq("client"),eq("secret+value"),anyString());
    }
    @Test void rejectsAmbiguousOrMalformedCredentialsAndQueryStringSecrets() throws Exception {
        mvc.perform(post("/mcp/oauth/token").contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .param("client_id","a","b")).andExpect(status().isBadRequest()).andExpect(jsonPath("$.error").value("invalid_request"));
        mvc.perform(post("/mcp/oauth/token").contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .header("Authorization","Basic bad").param("client_secret","secret"))
                .andExpect(status().isUnauthorized()).andExpect(header().exists("WWW-Authenticate"));
        mvc.perform(post("/mcp/oauth/token?client_secret=secret").contentType(MediaType.APPLICATION_FORM_URLENCODED))
                .andExpect(status().isBadRequest());
        mvc.perform(post("/mcp/oauth/token").contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .header("Authorization","Basic abc","Basic def")).andExpect(status().isBadRequest());
        verifyNoInteractions(service);
    }
}

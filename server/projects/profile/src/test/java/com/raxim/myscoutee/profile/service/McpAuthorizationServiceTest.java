package com.raxim.myscoutee.profile.service;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;
import static com.raxim.myscoutee.profile.service.IntegrationTokenService.hash;
import java.time.Instant;
import java.util.*;
import java.net.URI;
import org.junit.jupiter.api.*;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.web.server.ResponseStatusException;
import com.raxim.myscoutee.common.config.mongo.*;
import com.raxim.myscoutee.profile.repository.*;
import com.raxim.myscoutee.profile.data.document.*;
import com.raxim.myscoutee.profile.data.dto.integration.McpDtos;

class McpAuthorizationServiceTest {
    final IntegrationTokensRepository tokens = mock(IntegrationTokensRepository.class);
    final McpAuthorizationRepository grants = mock(McpAuthorizationRepository.class);
    final UsersRepository users = mock(UsersRepository.class);
    final CommunityGroupsRepository groups = mock(CommunityGroupsRepository.class);
    final IntegrationPublicEndpointResolver endpoint = mock(IntegrationPublicEndpointResolver.class);
    final IntegrationTokenService keys = spy(new IntegrationTokenService(tokens,
            mock(IntegrationWebhookSubscriptionsRepository.class), mock(MongoTemplate.class)));
    final McpAuthorizationService service = new McpAuthorizationService(keys, tokens, grants, users, groups, endpoint);
    final String id = UUID.randomUUID().toString(), verifier = "x".repeat(43);
    IntegrationToken client;
    @BeforeEach void setup() {
        when(endpoint.resolve()).thenReturn("https://app.example/api/integrations/v1");
        client = new IntegrationToken(); client.setId(id); client.setScope("mcp"); client.setOwnerUserId("owner");
        client.setName("Claude"); client.setRedirectUri("https://client.example/callback");
        client.setExpiresAtIso(Instant.now().plusSeconds(86400).toString());
        when(tokens.findById(id)).thenReturn(Optional.of(client));
        Users owner = new Users(); owner.setUserId("owner"); owner.setName("Owner");
        when(users.findByUserId("owner")).thenReturn(Optional.of(owner));
    }
    @AfterEach void cleanup() { MongoSessionModeContext.clear(); }
    McpDtos.Authorization request(String callback, String resource, String challenge) {
        return new McpDtos.Authorization(id, callback, resource, "myscoutee:api", "code", challenge, "S256", "state +/?&");
    }
    McpDtos.Authorization request() { return request(client.getRedirectUri(), service.resource(), hash(verifier)); }
    Map<String,String> exchange(String code) {
        return new HashMap<>(Map.of("grant_type","authorization_code", "code",code,"code_verifier",verifier,
                "resource",service.resource(),"redirect_uri",client.getRedirectUri()));
    }
    void authenticated() {
        doReturn(new IntegrationTokenService.AuthenticatedIntegrationClient("owner",id,id))
                .when(keys).authenticateClient("secret",id,"ip","mcp");
    }
    @Test void metadataUsesCanonicalOriginAndOnlySupportedGrants() {
        assertThat(service.metadata()).containsEntry("issuer","https://app.example")
                .containsEntry("authorization_endpoint","https://app.example/mcp/authorize")
                .containsEntry("code_challenge_methods_supported",List.of("S256"));
        assertThat(service.metadata()).doesNotContainKeys("registration_endpoint","client_id_metadata_document_supported");
        assertThat(service.resourceMetadata()).containsEntry("resource","https://app.example/mcp/private");
    }
    @Test void consentBindsHashToExactClientResourcePkceAndNeverPersistsRawCode() {
        var redirect = service.authorize("owner", new McpDtos.Consent(request(),true));
        var captured = org.mockito.ArgumentCaptor.forClass(McpAuthorization.class);
        verify(grants).save(captured.capture()); var saved=captured.getValue();
        String code=URI.create(redirect.url()).getRawQuery().split("&")[0].substring(5);
        assertThat(code).startsWith("mcc_"); assertThat(saved.id).isEqualTo(hash(code));
        assertThat(saved.clientId).isEqualTo(id); assertThat(saved.ownerUserId).isEqualTo("owner");
        assertThat(saved.challenge).isEqualTo(hash(verifier)); assertThat(saved.resource).isEqualTo(service.resource());
        assertThat(saved.expiresAt).isBefore(Instant.now().plusSeconds(301));
        assertThat(redirect.url()).contains("&iss=https%3A%2F%2Fapp.example", "&state=state+%2B%2F%3F%26");
    }
    @Test void denialReturnsValidatedCallbackWithoutCreatingAuthorization() {
        assertThat(service.authorize("owner",new McpDtos.Consent(request(),false)).url()).contains("?error=access_denied&iss=");
        verifyNoInteractions(grants);
    }
    @Test void rejectsForeignAccountRedirectResourcePlainPkceAndDemoBeforePersisting() {
        Users other=new Users();other.setUserId("other");when(users.findByUserId("other")).thenReturn(Optional.of(other));
        assertThatThrownBy(()->service.authorize("other",new McpDtos.Consent(request(),true))).isInstanceOf(ResponseStatusException.class);
        for(var bad:List.of(request("https://attacker.example",service.resource(),hash(verifier)),
                request(client.getRedirectUri(),"https://elsewhere.example/mcp/private",hash(verifier)),
                request(client.getRedirectUri(),service.resource(),"bad"))) {
            assertThatThrownBy(()->service.authorize("owner",new McpDtos.Consent(bad,true))).isInstanceOf(ResponseStatusException.class);
        }
        MongoSessionModeContext.set(MongoSessionMode.DEMO);
        assertThatThrownBy(()->service.authorize("owner",new McpDtos.Consent(request(),true))).isInstanceOf(ResponseStatusException.class);
        verifyNoInteractions(grants);
    }
    @Test void exchangeConsumesCodeOnceAndSavesOnlyHashedCredentials() {
        authenticated(); McpAuthorization code = new McpAuthorization();code.ownerUserId="owner";
        when(grants.consumeCode(hash("code"),id,client.getRedirectUri(),service.resource(),hash(verifier))).thenReturn(code).thenReturn(null);
        var result=service.exchange(exchange("code"),id,"secret","ip");
        var captor=org.mockito.ArgumentCaptor.forClass(McpAuthorization.class);verify(grants).save(captor.capture());
        var saved=captor.getValue();
        assertThat(saved.accessHash).isEqualTo(hash((String)result.get("access_token")));
        assertThat(saved.refreshHash).isEqualTo(hash((String)result.get("refresh_token")));
        assertThat(saved.expiresAt).isEqualTo(Instant.parse(client.getExpiresAtIso()));
        assertThatThrownBy(()->service.exchange(exchange("code"),id,"secret","ip")).hasMessageContaining("invalid_grant");
        verify(grants,times(1)).save(any());
    }
    @Test void wrongClientScopeResourceOrVerifierCannotIssueGrant() {
        assertThatThrownBy(()->service.exchange(exchange("code"),id,"wrong","ip")).hasMessageContaining("invalid_client");
        authenticated(); var wrong=exchange("code");wrong.put("resource","https://other.example");
        assertThatThrownBy(()->service.exchange(wrong,id,"secret","ip")).hasMessageContaining("invalid_target");
        wrong.put("resource",service.resource());wrong.put("code_verifier","short");
        assertThatThrownBy(()->service.exchange(wrong,id,"secret","ip")).hasMessageContaining("invalid_grant");
        client.setScope("integration");
        assertThatThrownBy(()->service.exchange(exchange("code"),id,"secret","ip")).hasMessageContaining("invalid_client");
        verifyNoInteractions(grants);
    }
    @Test void refreshRotationAndReplayRevokeTheSameClientFamily() {
        authenticated(); var grant=new McpAuthorization();grant.expiresAt=Instant.now().plusSeconds(10000);
        String resource = service.resource();
        when(grants.rotate(eq(hash("old-refresh")),eq(id),eq(resource),anyString(),anyString())).thenReturn(grant).thenReturn(null);
        var input=Map.of("grant_type","refresh_token","refresh_token","old-refresh","resource",service.resource());
        var result=service.exchange(input,id,"secret","ip");
        assertThat((String)result.get("refresh_token")).startsWith("mcr_");
        assertThatThrownBy(()->service.exchange(input,id,"secret","ip")).hasMessageContaining("invalid_grant");
        verify(grants).revokeReplayedRefresh(hash("old-refresh"),id);
    }
    @Test void accessChecksActiveClientEveryTimeAndDoesNotAcceptClientSecretAsBearer() {
        var grant=new McpAuthorization();grant.clientId=id;grant.ownerUserId="owner";
        String access="mca_"+"a".repeat(43);
        when(grants.access(hash(access),service.resource())).thenReturn(grant);
        assertThat(service.authenticate(access).ownerUserId()).isEqualTo("owner");
        client.setRevokedAtIso(Instant.now().toString()); assertThat(service.authenticate(access)).isNull();
        assertThat(service.authenticate("msc_"+"a".repeat(43))).isNull();
    }
    @Test void rejectsUnsafeCallbacksWithoutThrowingNullPointer() {
        for(String url:List.of("http:/missing","http://example.com/callback","https://x@a/cb","https://a/*","https://a/cb#f","javascript:alert(1)"))
            assertThatThrownBy(()->McpAuthorizationService.redirectUri(url)).isInstanceOf(ResponseStatusException.class);
        assertThat(McpAuthorizationService.redirectUri("http://127.0.0.1:4352/callback")).contains("4352");
    }
}

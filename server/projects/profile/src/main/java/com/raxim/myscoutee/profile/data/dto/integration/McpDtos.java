package com.raxim.myscoutee.profile.data.dto.integration;

import java.util.List;
import com.raxim.myscoutee.profile.data.dto.integration.IntegrationDtos.IntegrationTokenDto;

public final class McpDtos {
    private McpDtos() {}
    public record ClientRequest(String name, String redirectUri) {}
    public record Client(IntegrationTokenDto token, String redirectUri) {}
    public record Created(Client client, String secret) {}
    public record Settings(String resource, int maxClients, boolean remoteEnabled, List<Client> clients) {}
    public record Authorization(String clientId, String redirectUri, String resource, String scope,
            String responseType, String codeChallenge, String codeChallengeMethod, String state) {}
    public record Consent(Authorization authorization, boolean approve) {}
    public record Context(String clientName, String profileName, String groupName, String redirectUri) {}
    public record Redirect(String url) {}
}

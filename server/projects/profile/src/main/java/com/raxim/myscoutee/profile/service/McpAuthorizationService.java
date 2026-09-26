package com.raxim.myscoutee.profile.service;

import static com.raxim.myscoutee.profile.service.IntegrationTokenService.MCP_SCOPE;
import static com.raxim.myscoutee.profile.service.IntegrationTokenService.hash;

import java.net.URI;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.time.Instant;
import java.util.Base64;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import com.raxim.myscoutee.common.config.mongo.MongoSessionMode;
import com.raxim.myscoutee.common.config.mongo.MongoSessionModeContext;
import com.raxim.myscoutee.profile.data.document.IntegrationToken;
import com.raxim.myscoutee.profile.data.document.McpAuthorization;
import com.raxim.myscoutee.profile.data.dto.integration.McpDtos;
import com.raxim.myscoutee.profile.data.dto.integration.IntegrationDtos.IntegrationTokenCreateRequestDto;
import com.raxim.myscoutee.profile.repository.*;
import com.raxim.myscoutee.profile.service.IntegrationTokenService.AuthenticatedIntegrationClient;

/** OAuth protocol adapter. Profile keys, revocation and all API authorization retain their existing owners. */
@Service
public class McpAuthorizationService {
    public static final String SCOPE = "myscoutee:api";
    private final IntegrationTokenService keys;
    private final IntegrationTokensRepository tokens;
    private final McpAuthorizationRepository grants;
    private final UsersRepository users;
    private final CommunityGroupsRepository groups;
    private final IntegrationPublicEndpointResolver endpoint;
    private final SecureRandom random = new SecureRandom();

    public McpAuthorizationService(IntegrationTokenService keys, IntegrationTokensRepository tokens,
            McpAuthorizationRepository grants, UsersRepository users, CommunityGroupsRepository groups,
            IntegrationPublicEndpointResolver endpoint) {
        this.keys = keys; this.tokens = tokens; this.grants = grants; this.users = users;
        this.groups = groups; this.endpoint = endpoint;
    }
    public String origin() {
        URI api = URI.create(endpoint.resolve());
        if (!"https".equals(api.getScheme()) && !("http".equals(api.getScheme())
                && api.getHost() != null && List.of("localhost", "127.0.0.1", "[::1]").contains(api.getHost()))) {
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, "HTTPS integration URL required");
        }
        return api.getScheme() + "://" + api.getRawAuthority();
    }
    public String resource() { return origin() + "/mcp/private"; }
    public Map<String, Object> metadata() {
        String root = origin();
        return Map.of("issuer", root, "authorization_endpoint", root + "/mcp/authorize",
                "token_endpoint", root + "/api/mcp/oauth/token",
                "response_types_supported", List.of("code"),
                "grant_types_supported", List.of("authorization_code", "refresh_token"),
                "token_endpoint_auth_methods_supported", List.of("client_secret_basic", "client_secret_post"),
                "code_challenge_methods_supported", List.of("S256"),
                "scopes_supported", List.of(SCOPE), "authorization_response_iss_parameter_supported", true);
    }
    public Map<String, Object> resourceMetadata() {
        return Map.of("resource", resource(), "authorization_servers", List.of(origin()),
                "scopes_supported", List.of(SCOPE), "bearer_methods_supported", List.of("header"));
    }
    public McpDtos.Settings settings(String owner) {
        var clients = tokens.findByOwnerUserIdOrderByCreatedAtIsoDesc(owner).stream()
                .filter(this::isClient).map(t -> new McpDtos.Client(keys.toDto(t), t.getRedirectUri())).toList();
        return new McpDtos.Settings(resource(), IntegrationTokenService.MAX_ACTIVE_TOKENS,
                MongoSessionModeContext.currentMode() == MongoSessionMode.REAL, clients);
    }
    public McpDtos.Created create(String owner, McpDtos.ClientRequest input) {
        if (input == null || input.name() == null || input.name().isBlank() || input.name().length() > 80)
            throw error("invalid_request");
        String redirect = redirectUri(input.redirectUri());
        var created = keys.create(owner, new IntegrationTokenCreateRequestDto(input.name(), 90), MCP_SCOPE);
        var token = tokens.findByIdAndOwnerUserId(created.token().id(), owner).orElseThrow();
        token.setRedirectUri(redirect);
        tokens.save(token);
        return new McpDtos.Created(new McpDtos.Client(created.token(), redirect), created.value());
    }
    public void revoke(String owner, String id) {
        keys.revoke(owner, id, MCP_SCOPE);
        grants.revokeClient(id);
    }
    public McpDtos.Context context(String actor, McpDtos.Authorization request) {
        var client = validate(request);
        requireAccount(actor, client.getOwnerUserId());
        var profile = users.findByUserId(client.getOwnerUserId()).orElseThrow(() -> error("access_denied"));
        String group = profile.getWorkspaceGroupId() == null || profile.getWorkspaceGroupId().isBlank() ? null
                : groups.findById(profile.getWorkspaceGroupId()).orElseThrow(() -> error("access_denied")).name();
        return new McpDtos.Context(client.getName(), profile.getName(), group, client.getRedirectUri());
    }
    public McpDtos.Redirect authorize(String actor, McpDtos.Consent consent) {
        if (consent == null) throw error("invalid_request");
        var request = consent.authorization();
        var client = validate(request);
        requireAccount(actor, client.getOwnerUserId());
        String code = randomValue("mcc_");
        if (consent.approve()) {
            var value = new McpAuthorization();
            value.id = hash(code); value.kind = "code"; value.clientId = client.getId();
            value.ownerUserId = client.getOwnerUserId(); value.redirectUri = request.redirectUri();
            value.resource = request.resource(); value.challenge = request.codeChallenge();
            value.expiresAt = Instant.now().plusSeconds(300);
            grants.save(value);
        }
        String callback = request.redirectUri() + "?" + (consent.approve() ? "code=" + code : "error=access_denied")
                + "&iss=" + encode(origin()) + (request.state() == null ? "" : "&state=" + encode(request.state()));
        return new McpDtos.Redirect(callback);
    }
    public Map<String, Object> exchange(Map<String, String> input, String clientId, String secret, String address) {
        var identity = keys.authenticateClient(secret, clientId, address, MCP_SCOPE);
        if (identity == null || !identity.tokenId().equals(clientId))
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "invalid_client");
        var client = requireClient(clientId);
        if (!resource().equals(input.get("resource"))) throw error("invalid_target");
        if (input.containsKey("scope") && !SCOPE.equals(input.get("scope"))) throw error("invalid_scope");
        String access = randomValue("mca_"); String refresh = randomValue("mcr_");
        McpAuthorization grant;
        if ("authorization_code".equals(input.get("grant_type"))) {
            String verifier = input.getOrDefault("code_verifier", "");
            if (!verifier.matches("[A-Za-z0-9._~-]{43,128}")) throw error("invalid_grant");
            var code = grants.consumeCode(hash(bounded(input.get("code"))), clientId,
                    input.get("redirect_uri"), resource(), hash(verifier));
            if (code == null || !code.ownerUserId.equals(identity.ownerUserId())) throw error("invalid_grant");
            grant = new McpAuthorization();
            grant.id = UUID.randomUUID().toString(); grant.kind = "grant";
            grant.clientId = clientId; grant.ownerUserId = identity.ownerUserId(); grant.resource = resource();
            grant.accessHash = hash(access); grant.refreshHash = hash(refresh); grant.usedRefreshHashes = List.of();
            grant.accessExpiresAt = Instant.now().plusSeconds(3600);
            grant.expiresAt = Instant.parse(client.getExpiresAtIso());
            grants.save(grant);
        } else if ("refresh_token".equals(input.get("grant_type"))) {
            String refreshHash = hash(bounded(input.get("refresh_token")));
            grant = grants.rotate(refreshHash, clientId, resource(), hash(access), hash(refresh));
            if (grant == null) {
                grants.revokeReplayedRefresh(refreshHash, clientId);
                throw error("invalid_grant");
            }
        } else throw error("unsupported_grant_type");
        return Map.of("access_token", access, "refresh_token", refresh, "token_type", "Bearer",
                "expires_in", Math.min(3600, Math.max(0, grant.expiresAt.getEpochSecond() - Instant.now().getEpochSecond())), "scope", SCOPE);
    }
    public AuthenticatedIntegrationClient authenticate(String bearer) {
        if (bearer == null || !bearer.matches("mca_[A-Za-z0-9_-]{43}")) return null;
        var grant = grants.access(hash(bearer), resource());
        if (grant == null) return null;
        var client = tokens.findById(grant.clientId).filter(this::isClient).orElse(null);
        if (client == null || !client.getOwnerUserId().equals(grant.ownerUserId)) return null;
        return new AuthenticatedIntegrationClient(grant.ownerUserId, grant.clientId, grant.clientId);
    }
    private IntegrationToken validate(McpDtos.Authorization r) {
        if (MongoSessionModeContext.currentMode() != MongoSessionMode.REAL) throw error("access_denied");
        if (r == null || !"code".equals(r.responseType()) || !"S256".equals(r.codeChallengeMethod())
                || r.codeChallenge() == null || !r.codeChallenge().matches("[A-Za-z0-9_-]{43}")
                || (r.state() != null && r.state().length() > 1024)) throw error("invalid_request");
        var client = requireClient(r.clientId());
        if (!client.getRedirectUri().equals(r.redirectUri())) throw error("invalid_request");
        if (!resource().equals(r.resource())) throw error("invalid_target");
        if (!SCOPE.equals(r.scope())) throw error("invalid_scope");
        return client;
    }
    private IntegrationToken requireClient(String id) {
        if (id == null || id.length() > 80) throw error("invalid_client");
        return tokens.findById(id).filter(this::isClient).orElseThrow(() -> error("invalid_client"));
    }
    private boolean isClient(IntegrationToken t) {
        return keys.isActive(t) && MCP_SCOPE.equals(t.getScope()) && t.getRedirectUri() != null;
    }
    private void requireAccount(String actor, String owner) {
        var a = users.findByUserId(actor).orElseThrow(() -> error("access_denied"));
        var o = users.findByUserId(owner).orElseThrow(() -> error("access_denied"));
        String aa = a.getAccountUserId() == null || a.getAccountUserId().isBlank() ? a.getUserId() : a.getAccountUserId();
        String oa = o.getAccountUserId() == null || o.getAccountUserId().isBlank() ? o.getUserId() : o.getAccountUserId();
        if (!aa.equals(oa)) throw new ResponseStatusException(HttpStatus.FORBIDDEN, "access_denied");
    }
    static String redirectUri(String value) {
        try {
            if (value == null || value.length() > 2048) throw error("invalid_request");
            var uri = URI.create(value);
            boolean secure = "https".equals(uri.getScheme());
            boolean loopback = "http".equals(uri.getScheme()) && uri.getHost() != null && List.of("127.0.0.1", "localhost", "[::1]").contains(uri.getHost());
            if ((!secure && !loopback) || uri.getHost() == null || uri.getUserInfo() != null
                    || uri.getFragment() != null || uri.getQuery() != null || value.contains("*")) throw error("invalid_request");
            return value;
        } catch (IllegalArgumentException ex) { throw error("invalid_request"); }
    }
    private String randomValue(String prefix) {
        byte[] bytes = new byte[32]; random.nextBytes(bytes);
        return prefix + Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }
    private static String bounded(String value) {
        if (value == null || value.length() > 256) throw error("invalid_grant");
        return value;
    }
    private static String encode(String value) { return URLEncoder.encode(value, StandardCharsets.UTF_8); }
    private static ResponseStatusException error(String value) { return new ResponseStatusException(HttpStatus.BAD_REQUEST, value); }
}

package com.raxim.myscoutee.registry;

import java.io.IOException;
import java.io.InputStream;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.LinkedHashMap;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;

import com.raxim.myscoutee.common.config.properties.RegistryProperties;

import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

public final class RegistryHttpClient {
    private final RegistryProperties properties;
    private final ObjectMapper objectMapper;
    private final HttpClient httpClient;

    public RegistryHttpClient(RegistryProperties properties, ObjectMapper objectMapper) {
        this(
                properties,
                objectMapper,
                HttpClient.newBuilder()
                        .connectTimeout(positive(properties.getConnectTimeout(), "registry connect timeout"))
                        .followRedirects(HttpClient.Redirect.NEVER)
                        .build());
    }

    RegistryHttpClient(
            RegistryProperties properties,
            ObjectMapper objectMapper,
            HttpClient httpClient) {
        this.properties = Objects.requireNonNull(properties, "Registry properties must not be null.");
        this.objectMapper = Objects.requireNonNull(objectMapper, "ObjectMapper must not be null.");
        this.httpClient = Objects.requireNonNull(httpClient, "HttpClient must not be null.");
    }

    public RegistryProtocol.RegistryIdentityResponse inspectIdentity() {
        return get(
                RegistryProtocol.REGISTRY_IDENTITY_PATH,
                RegistryProtocol.RegistryIdentityResponse.class);
    }

    public RegistryProtocol.RegistrationResponse register(RegistryProtocol.RegistrationRequest request) {
        return post(
                RegistryProtocol.REGISTRATION_PATH,
                request,
                RegistryProtocol.RegistrationResponse.class);
    }

    public RegistryProtocol.BatchResponse submitInstallationBatch(RegistryProtocol.BatchRequest request) {
        return post(
                RegistryProtocol.MAU_BATCH_PATH,
                request,
                RegistryProtocol.BatchResponse.class);
    }

    public RegistryProtocol.BatchResponse submitMauBatch(
            RegistryProtocol.BatchRequest request) {
        return post(
                RegistryProtocol.MAU_BATCH_PATH,
                request,
                RegistryProtocol.BatchResponse.class);
    }

    public RegistryProtocol.RevenueBatchResponse submitRevenueBatch(
            RegistryProtocol.RevenueBatchRequest request) {
        return post(
                RegistryProtocol.REVENUE_BATCH_PATH,
                request,
                RegistryProtocol.RevenueBatchResponse.class);
    }

    public RegistryProtocol.SettlementQueryResponse querySettlements(
            RegistryProtocol.SettlementQueryRequest request) {
        return post(
                RegistryProtocol.SETTLEMENT_QUERY_PATH,
                Objects.requireNonNull(
                        request,
                        "Settlement query request must not be null."),
                RegistryProtocol.SettlementQueryResponse.class);
    }

    public RegistryProtocol.GlobalIdentityVoprfKey
            currentGlobalIdentityVoprfKey() {
        return get(
                RegistryProtocol.GLOBAL_IDENTITY_VOPRF_KEY_PATH,
                RegistryProtocol.GlobalIdentityVoprfKey.class);
    }

    public RegistryProtocol.GlobalIdentityEvaluationResponse
            evaluateGlobalIdentity(
                    RegistryProtocol.GlobalIdentityEvaluationRequest request) {
        return post(
                RegistryProtocol.GLOBAL_IDENTITY_EVALUATE_PATH,
                Objects.requireNonNull(
                        request,
                        "Global-identity evaluation request must not be null."),
                RegistryProtocol.GlobalIdentityEvaluationResponse.class);
    }

    public RegistryProtocol.GlobalIdentityMutationResponse linkGlobalIdentity(
            RegistryProtocol.GlobalIdentityLinkRequest request) {
        return post(
                RegistryProtocol.GLOBAL_IDENTITY_LINK_PATH,
                Objects.requireNonNull(
                        request,
                        "Global-identity link request must not be null."),
                RegistryProtocol.GlobalIdentityMutationResponse.class);
    }

    public RegistryProtocol.GlobalIdentityMutationResponse
            applyGlobalIdentityLinkAction(
                    RegistryProtocol.GlobalIdentityLinkActionRequest request) {
        return post(
                RegistryProtocol.GLOBAL_IDENTITY_LINK_ACTION_PATH,
                Objects.requireNonNull(
                        request,
                        "Global-identity link action request must not be null."),
                RegistryProtocol.GlobalIdentityMutationResponse.class);
    }

    public RegistryProtocol.GlobalIdentityPresenceBatchResponse
            submitGlobalIdentityPresenceBatch(
                    RegistryProtocol.GlobalIdentityPresenceBatchRequest request) {
        return post(
                RegistryProtocol.GLOBAL_IDENTITY_PRESENCE_BATCH_PATH,
                Objects.requireNonNull(
                        request,
                        "Global-identity presence batch request must not be null."),
                RegistryProtocol.GlobalIdentityPresenceBatchResponse.class);
    }

    public RegistryProtocol.OperatorActionResponse applyOperatorAction(
            RegistryProtocol.OperatorActionRequest request) {
        return post(
                RegistryProtocol.OPERATOR_ACTION_PATH,
                request,
                RegistryProtocol.OperatorActionResponse.class);
    }

    public RegistryProtocol.OperatorClaimStatusResponse operatorClaimStatus(
            String deploymentId) {
        String normalizedDeploymentId = RegistryProtocol.requireDeploymentId(deploymentId);
        return get(
                RegistryProtocol.OPERATOR_CLAIM_STATUS_PATH_PREFIX + normalizedDeploymentId,
                RegistryProtocol.OperatorClaimStatusResponse.class);
    }

    public RegistryProtocol.LeaderboardPage leaderboard(
            String view,
            String throughPeriod,
            Integer limit,
            String cursor) {
        Map<String, String> query = new LinkedHashMap<>();
        putQuery(query, "view", view);
        putQuery(query, "through_period", throughPeriod);
        if (limit != null) {
            putQuery(query, "limit", Integer.toString(limit));
        }
        putQuery(query, "cursor", cursor);
        return get(
                RegistryProtocol.LEADERBOARD_PATH,
                query,
                RegistryProtocol.LeaderboardPage.class);
    }

    public RegistryProtocol.LeaderboardDeploymentPage leaderboardDeployments(
            String groupId,
            String throughPeriod,
            Integer limit,
            String cursor) {
        String normalizedGroupId = RegistryProtocol.requireOperatorGroupId(groupId);
        Map<String, String> query = new LinkedHashMap<>();
        putQuery(query, "through_period", throughPeriod);
        if (limit != null) {
            putQuery(query, "limit", Integer.toString(limit));
        }
        putQuery(query, "cursor", cursor);
        return get(
                RegistryProtocol.LEADERBOARD_PATH + "/groups/" + normalizedGroupId + "/deployments",
                query,
                RegistryProtocol.LeaderboardDeploymentPage.class);
    }

    public RegistryProtocol.AnnouncementPage announcements(
            String kind,
            String severity,
            String channel,
            boolean includeExpired,
            Integer limit,
            String cursor) {
        Map<String, String> query = new LinkedHashMap<>();
        putQuery(query, "kind", kind);
        putQuery(query, "severity", severity);
        putQuery(query, "channel", channel);
        if (includeExpired) {
            putQuery(query, "include_expired", "true");
        }
        if (limit != null) {
            putQuery(query, "limit", Integer.toString(limit));
        }
        putQuery(query, "cursor", cursor);
        return get(
                RegistryProtocol.ANNOUNCEMENT_PATH,
                query,
                RegistryProtocol.AnnouncementPage.class);
    }

    public URI endpoint(String path) {
        RegistryProtocol.requireCanonical(path, "registry request path");
        URI baseUri;
        try {
            baseUri = URI.create(properties.getBaseUrl());
        } catch (IllegalArgumentException exception) {
            throw new IllegalStateException("REGISTRY_BASE_URL is not a valid URI.", exception);
        }
        String scheme = baseUri.getScheme() == null
                ? ""
                : baseUri.getScheme().toLowerCase(Locale.ROOT);
        boolean supportedScheme = "https".equals(scheme)
                || ("http".equals(scheme)
                        && properties.isAllowInsecureHttp()
                        && isAllowedInsecureHttpHost(baseUri.getHost()));
        if (!supportedScheme) {
            throw new IllegalStateException(
                    "Registry base URL must use HTTPS; insecure HTTP is allowed only for an explicitly "
                            + "enabled and allow-listed development endpoint.");
        }
        if (baseUri.getHost() == null
                || baseUri.getUserInfo() != null
                || baseUri.getQuery() != null
                || baseUri.getFragment() != null
                || (baseUri.getPath() != null
                        && !baseUri.getPath().isEmpty()
                        && !"/".equals(baseUri.getPath()))) {
            throw new IllegalStateException(
                    "Registry base URL must be an origin without credentials, query, fragment, or path.");
        }
        try {
            return new URI(
                    scheme,
                    null,
                    baseUri.getHost(),
                    baseUri.getPort(),
                    path,
                    null,
                    null);
        } catch (Exception exception) {
            throw new IllegalStateException("Unable to construct the registry endpoint URI.", exception);
        }
    }

    private <T> T get(String path, Class<T> responseType) {
        HttpRequest request = requestBuilder(path)
                .GET()
                .build();
        return send(request, responseType);
    }

    private <T> T get(String path, Map<String, String> query, Class<T> responseType) {
        URI endpoint = endpoint(path);
        StringBuilder queryString = new StringBuilder();
        for (Map.Entry<String, String> entry : query.entrySet()) {
            if (queryString.length() > 0) {
                queryString.append('&');
            }
            queryString.append(URLEncoder.encode(entry.getKey(), StandardCharsets.UTF_8))
                    .append('=')
                    .append(URLEncoder.encode(entry.getValue(), StandardCharsets.UTF_8));
        }
        URI requestUri = queryString.isEmpty()
                ? endpoint
                : URI.create(endpoint.toASCIIString() + "?" + queryString);
        HttpRequest request = requestBuilder(requestUri)
                .GET()
                .build();
        return send(request, responseType);
    }

    private <T> T post(String path, Object requestBody, Class<T> responseType) {
        try {
            String json = objectMapper.writeValueAsString(requestBody);
            HttpRequest request = requestBuilder(path)
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(json, StandardCharsets.UTF_8))
                    .build();
            return send(request, responseType);
        } catch (RegistryHttpException exception) {
            throw exception;
        } catch (RuntimeException exception) {
            throw new RegistryHttpException(
                    0,
                    "registry_unavailable",
                    "Unable to prepare the registry request.",
                    exception);
        }
    }

    private HttpRequest.Builder requestBuilder(String path) {
        return requestBuilder(endpoint(path));
    }

    private HttpRequest.Builder requestBuilder(URI endpoint) {
        return HttpRequest.newBuilder(endpoint)
                .timeout(positive(properties.getRequestTimeout(), "registry request timeout"))
                .header("Accept", "application/json")
                .header("User-Agent", "myscoutee-backend/" + safeSoftwareVersion());
    }

    private static void putQuery(Map<String, String> query, String key, String value) {
        String normalized = safeText(value);
        if (!normalized.isEmpty()) {
            query.put(key, normalized);
        }
    }

    private <T> T send(HttpRequest request, Class<T> responseType) {
        try {
            HttpResponse<InputStream> response = httpClient.send(
                    request,
                    HttpResponse.BodyHandlers.ofInputStream());
            byte[] body;
            try (InputStream responseBody = response.body()) {
                body = responseBody.readNBytes(properties.getMaxResponseBytes() + 1);
            }
            if (body.length > properties.getMaxResponseBytes()) {
                throw new RegistryHttpException(
                        response.statusCode(),
                        "registry_response_too_large",
                        "Registry response exceeded the configured size limit.");
            }
            if (response.statusCode() < 200 || response.statusCode() >= 300) {
                throw errorResponse(response.statusCode(), body);
            }
            String contentType = response.headers().firstValue("Content-Type").orElse("");
            if (!contentType.toLowerCase(Locale.ROOT).startsWith("application/json")) {
                throw new RegistryHttpException(
                        response.statusCode(),
                        "registry_invalid_content_type",
                        "Registry success response was not application/json.");
            }
            return objectMapper.readValue(body, responseType);
        } catch (RegistryHttpException exception) {
            throw exception;
        } catch (InterruptedException exception) {
            Thread.currentThread().interrupt();
            throw new RegistryHttpException(
                    0,
                    "registry_interrupted",
                    "Registry request was interrupted.",
                    exception);
        } catch (IOException | RuntimeException exception) {
            throw new RegistryHttpException(
                    0,
                    "registry_unavailable",
                    "Unable to communicate with the registry.",
                    exception);
        }
    }

    private RegistryHttpException errorResponse(int statusCode, byte[] body) {
        String code = "registry_http_" + statusCode;
        String message = "Registry returned HTTP " + statusCode + ".";
        try {
            JsonNode root = objectMapper.readTree(body);
            JsonNode error = root == null ? null : root.path("error");
            if (error != null && !error.isMissingNode() && !error.isNull()) {
                String parsedCode = safeText(error.path("code").asText(""));
                String parsedMessage = safeText(error.path("message").asText(""));
                if (!parsedCode.isEmpty()) {
                    code = parsedCode;
                }
                if (!parsedMessage.isEmpty()) {
                    message = parsedMessage;
                }
            }
        } catch (RuntimeException ignored) {
            // Preserve the status-only error without reflecting an untrusted response body.
        }
        return new RegistryHttpException(statusCode, code, message);
    }

    private String safeSoftwareVersion() {
        String version = safeText(properties.getSoftwareVersion());
        return version.isEmpty() ? "unknown" : version.replaceAll("[^A-Za-z0-9._-]", "_");
    }

    private static Duration positive(Duration value, String name) {
        if (value == null || value.isNegative() || value.isZero()) {
            throw new IllegalArgumentException(name + " must be positive.");
        }
        return value;
    }

    private static String safeText(String value) {
        return value == null ? "" : value.trim();
    }

    private static boolean isLiteralLoopback(String host) {
        String normalized = safeText(host).toLowerCase(Locale.ROOT);
        if ("localhost".equals(normalized) || "::1".equals(normalized)
                || "0:0:0:0:0:0:0:1".equals(normalized)) {
            return true;
        }
        if (!normalized.startsWith("127.")) {
            return false;
        }
        String[] octets = normalized.split("\\.", -1);
        if (octets.length != 4) {
            return false;
        }
        for (String octet : octets) {
            try {
                int value = Integer.parseInt(octet);
                if (value < 0 || value > 255) {
                    return false;
                }
            } catch (NumberFormatException exception) {
                return false;
            }
        }
        return true;
    }

    private boolean isAllowedInsecureHttpHost(String host) {
        if (isLiteralLoopback(host)) {
            return true;
        }
        String normalized = safeText(host).toLowerCase(Locale.ROOT);
        if (normalized.isEmpty()) {
            return false;
        }
        for (String configured : properties.getInsecureHttpAllowedHosts().split(",", -1)) {
            String allowed = safeText(configured).toLowerCase(Locale.ROOT);
            if (!allowed.isEmpty() && allowed.equals(normalized)) {
                return true;
            }
        }
        return false;
    }

    public static final class RegistryHttpException extends RuntimeException {
        private static final long serialVersionUID = 1L;

        private final int statusCode;
        private final String errorCode;

        RegistryHttpException(int statusCode, String errorCode, String message) {
            super(message);
            this.statusCode = statusCode;
            this.errorCode = errorCode;
        }

        RegistryHttpException(int statusCode, String errorCode, String message, Throwable cause) {
            super(message, cause);
            this.statusCode = statusCode;
            this.errorCode = errorCode;
        }

        public int getStatusCode() {
            return statusCode;
        }

        public String getErrorCode() {
            return errorCode;
        }
    }
}

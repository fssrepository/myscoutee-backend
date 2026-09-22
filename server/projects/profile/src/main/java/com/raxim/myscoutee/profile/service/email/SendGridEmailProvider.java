package com.raxim.myscoutee.profile.service.email;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import com.raxim.myscoutee.common.config.properties.EmailProperties;

import tools.jackson.databind.ObjectMapper;

@Component
public class SendGridEmailProvider implements EmailProvider {
    private static final Logger LOGGER = LoggerFactory.getLogger(SendGridEmailProvider.class);

    private final EmailProperties emailProperties;
    private final ObjectMapper objectMapper;
    private final HttpClient httpClient = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(10))
            .build();

    public SendGridEmailProvider(
            EmailProperties emailProperties,
            ObjectMapper objectMapper) {
        this.emailProperties = emailProperties;
        this.objectMapper = objectMapper;
    }

    @Override
    public String providerKey() {
        return "sendgrid";
    }

    @Override
    public com.raxim.myscoutee.profile.service.operator.OperatorEmailConfigurationService.Provider configurationDescriptor() {
        return new com.raxim.myscoutee.profile.service.operator.OperatorEmailConfigurationService.Provider("sendgrid", "SendGrid", "mail", "blue");
    }
    @Override
    public EmailSendResult send(EmailSendRequest request) { return sendConfigured(request, emailProperties.getSendgrid().getApiKey()); }
    @Override
    public EmailSendResult sendConfigured(EmailSendRequest request, String credential) {
        if (request == null || !StringUtils.hasText(request.toEmail())) {
            return new EmailSendResult(false, null, "Missing recipient email.");
        }
        if (!StringUtils.hasText(credential)) {
            return new EmailSendResult(false, null, "Missing SendGrid API key.");
        }
        if (!StringUtils.hasText(emailProperties.getSendgrid().getEndpoint())) {
            return new EmailSendResult(false, null, "Missing SendGrid endpoint.");
        }

        try {
            String payload = objectMapper.writeValueAsString(buildPayload(request));
            HttpRequest httpRequest = HttpRequest.newBuilder()
                    .uri(URI.create(emailProperties.getSendgrid().getEndpoint().trim()))
                    .timeout(Duration.ofSeconds(20))
                    .header("Authorization", "Bearer " + credential.trim())
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(payload))
                    .build();
            HttpResponse<String> response = httpClient.send(httpRequest, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() >= 200 && response.statusCode() < 300) {
                String messageId = response.headers().firstValue("X-Message-Id").orElse(null);
                return new EmailSendResult(true, safeText(messageId), null);
            }
            String errorBody = previewBody(response.body());
            LOGGER.warn("SendGrid email failed with status {} and body {}.", response.statusCode(), errorBody);
            return new EmailSendResult(false, null, "SendGrid status " + response.statusCode() + ": " + errorBody);
        } catch (InterruptedException exception) {
            Thread.currentThread().interrupt();
            return new EmailSendResult(false, null, "Email request interrupted.");
        } catch (Exception exception) {
            LOGGER.warn("Unable to send email via SendGrid.", exception);
            return new EmailSendResult(false, null, exception.getMessage());
        }
    }

    private Map<String, Object> buildPayload(EmailSendRequest request) {
        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("from", Map.of(
                "email", safeText(request.fromEmail()),
                "name", safeText(request.fromName())));
        payload.put("reply_to", Map.of("email", safeText(request.replyTo())));
        payload.put("subject", safeText(request.subject()));
        payload.put("personalizations", List.of(Map.of(
                "to", List.of(Map.of(
                        "email", safeText(request.toEmail()),
                        "name", safeText(request.toName()))),
                "custom_args", request.metadata() == null ? Map.of() : new LinkedHashMap<>(request.metadata()))));

        List<Map<String, String>> content = new ArrayList<>();
        if (StringUtils.hasText(request.textBody())) {
            content.add(Map.of(
                    "type", "text/plain",
                    "value", request.textBody()));
        }
        if (StringUtils.hasText(request.htmlBody())) {
            content.add(Map.of(
                    "type", "text/html",
                    "value", request.htmlBody()));
        }
        payload.put("content", content);
        return payload;
    }

    private String previewBody(String value) {
        String normalized = safeText(value);
        if (normalized.length() <= 400) {
            return normalized;
        }
        return normalized.substring(0, 397) + "...";
    }

    private String safeText(String value) {
        return value == null ? "" : value.trim();
    }
}

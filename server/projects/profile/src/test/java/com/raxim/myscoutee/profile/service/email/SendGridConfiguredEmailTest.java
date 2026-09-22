package com.raxim.myscoutee.profile.service.email;
import java.net.InetSocketAddress;
import java.util.Map;
import java.util.concurrent.atomic.AtomicReference;
import com.sun.net.httpserver.HttpServer;
import org.junit.jupiter.api.Test;
import com.raxim.myscoutee.common.config.properties.EmailProperties;
import tools.jackson.databind.ObjectMapper;
import static org.junit.jupiter.api.Assertions.*;
class SendGridConfiguredEmailTest {
    @Test void sendsConfiguredCredentialAndPayloadToStubWithoutChangingEnvironmentCredential() throws Exception {
        var server = HttpServer.create(new InetSocketAddress("127.0.0.1", 0), 0);
        var authorization = new AtomicReference<String>(); var body = new AtomicReference<String>();
        server.createContext("/v3/mail/send", exchange -> {
            authorization.set(exchange.getRequestHeaders().getFirst("Authorization")); body.set(new String(exchange.getRequestBody().readAllBytes(), java.nio.charset.StandardCharsets.UTF_8));
            exchange.getResponseHeaders().set("X-Message-Id", "stub-accepted"); exchange.sendResponseHeaders(202, -1); exchange.close();
        }); server.start();
        try {
            var properties = new EmailProperties(); properties.getSendgrid().setApiKey("environment-key");
            properties.getSendgrid().setEndpoint("http://127.0.0.1:" + server.getAddress().getPort() + "/v3/mail/send");
            var mapper = new ObjectMapper(); var provider = new SendGridEmailProvider(properties, mapper);
            var result = provider.sendConfigured(new EmailSendRequest("recipient@example.test", "Viewer", "Deletion reminder", "", "Five days remain.",
                    "sender@example.test", "MyScoutee", "sender@example.test", "account-deletion-warning", Map.of("deletionEpisode", "episode-1")), "operator-key");
            assertTrue(result.accepted()); assertEquals("stub-accepted", result.providerMessageId()); assertEquals("Bearer operator-key", authorization.get());
            var json = mapper.readTree(body.get()); assertEquals("sender@example.test", json.path("from").path("email").asText());
            assertEquals("recipient@example.test", json.path("personalizations").get(0).path("to").get(0).path("email").asText());
            assertEquals("episode-1", json.path("personalizations").get(0).path("custom_args").path("deletionEpisode").asText());
            assertEquals("environment-key", properties.getSendgrid().getApiKey());
        } finally { server.stop(0); }
    }
    @Test void invalidProviderResponseIsNotReportedAsDelivered() throws Exception {
        var server = HttpServer.create(new InetSocketAddress("127.0.0.1", 0), 0);
        server.createContext("/", exchange -> { exchange.sendResponseHeaders(401, -1); exchange.close(); }); server.start();
        try {
            var config = new EmailProperties(); config.getSendgrid().setEndpoint("http://127.0.0.1:" + server.getAddress().getPort());
            var provider = new SendGridEmailProvider(config, new ObjectMapper());
            assertFalse(provider.sendConfigured(new EmailSendRequest("recipient@example.test", "", "Subject", "", "Body", "sender@example.test", "", "sender@example.test", "warning", Map.of()), "bad-key").accepted());
        } finally { server.stop(0); }
    }
}

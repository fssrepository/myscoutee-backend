package com.raxim.myscoutee.domain.registry;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import org.junit.jupiter.api.Test;

import com.raxim.myscoutee.common.config.JsonConfig;
import com.raxim.myscoutee.domain.registry.config.RegistryProperties;

@org.junit.jupiter.api.Tag("standard")
class RegistryHttpClientTest {
    @Test
    void rejectsPlainHttpUnlessOperatorExplicitlyAllowsIt() {
        RegistryProperties properties = new RegistryProperties();
        properties.setBaseUrl("http://127.0.0.1:8080");
        RegistryHttpClient client = new RegistryHttpClient(
                properties,
                new JsonConfig().objectMapper());

        assertThatThrownBy(() -> client.endpoint(RegistryProtocol.REGISTRATION_PATH))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("HTTPS");

        properties.setAllowInsecureHttp(true);
        assertThat(client.endpoint(RegistryProtocol.REGISTRATION_PATH).toString())
                .isEqualTo("http://127.0.0.1:8080/v1/deployments/register");

        properties.setBaseUrl("http://registry.example.test");
        assertThatThrownBy(() -> client.endpoint(RegistryProtocol.REGISTRATION_PATH))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("allow-listed development endpoint");

        properties.setBaseUrl("http://registry:8080");
        properties.setInsecureHttpAllowedHosts("registry");
        assertThat(client.endpoint(RegistryProtocol.REGISTRATION_PATH).toString())
                .isEqualTo("http://registry:8080/v1/deployments/register");
    }

    @Test
    void rejectsBaseUrlsThatCouldChangeTheSignedRequestTarget() {
        RegistryProperties properties = new RegistryProperties();
        properties.setBaseUrl("https://registry.example.test/prefix?tenant=other");
        RegistryHttpClient client = new RegistryHttpClient(
                properties,
                new JsonConfig().objectMapper());

        assertThatThrownBy(() -> client.endpoint(RegistryProtocol.MAU_BATCH_PATH))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("without credentials, query, fragment, or path");
    }

    @Test
    void settlementQueryUsesThePinnedEndpointAndRejectsMissingBodies() {
        RegistryProperties properties = new RegistryProperties();
        properties.setBaseUrl("https://registry.example.test");
        RegistryHttpClient client = new RegistryHttpClient(
                properties,
                new JsonConfig().objectMapper());

        assertThat(client.endpoint(
                        RegistryProtocol.SETTLEMENT_QUERY_PATH).toString())
                .isEqualTo(
                        "https://registry.example.test/v1/settlements/query");
        assertThatThrownBy(() -> client.querySettlements(null))
                .isInstanceOf(NullPointerException.class)
                .hasMessageContaining("must not be null");
    }
}

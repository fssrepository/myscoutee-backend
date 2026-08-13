package com.raxim.myscoutee.profile.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.Test;
import org.springframework.core.env.Environment;
import org.springframework.core.env.Profiles;
import org.springframework.web.server.ResponseStatusException;

class PaymentApiEndpointResolverTest {

    @Test
    void stripeCustomEndpointRequiresExplicitDevSimulatorAndTestCredential() {
        Environment dev = environment(true);

        assertThat(new StripeApiEndpointResolver(
                dev,
                "http://payment-simulator:18082/",
                true).resolve("sk_test_myscoutee"))
                .isEqualTo("http://payment-simulator:18082");

        assertThatThrownBy(() -> new StripeApiEndpointResolver(
                environment(false),
                "http://payment-simulator:18082",
                true).resolve("sk_test_myscoutee"))
                .isInstanceOf(ResponseStatusException.class);
        assertThatThrownBy(() -> new StripeApiEndpointResolver(
                dev,
                "https://api.stripe.com",
                true).resolve("sk_test_myscoutee"))
                .isInstanceOf(ResponseStatusException.class);
        assertThatThrownBy(() -> new StripeApiEndpointResolver(
                dev,
                "http://payment-simulator:18082",
                true).resolve("sk_live_forbidden"))
                .isInstanceOf(ResponseStatusException.class);
    }

    @Test
    void barionDefaultsToProductionButCustomEndpointRequiresExplicitDevSimulator() {
        assertThat(new BarionApiEndpointResolver(environment(false), "", false).resolve())
                .isEqualTo("https://api.barion.com");
        assertThat(new BarionApiEndpointResolver(
                environment(true),
                "http://127.0.0.1:18082/",
                true).resolve())
                .isEqualTo("http://127.0.0.1:18082");

        assertThatThrownBy(() -> new BarionApiEndpointResolver(
                environment(false),
                "http://payment-simulator:18082",
                true).resolve())
                .isInstanceOf(ResponseStatusException.class);
        assertThatThrownBy(() -> new BarionApiEndpointResolver(
                environment(true),
                "http://example.com:18082",
                true).resolve())
                .isInstanceOf(ResponseStatusException.class);
    }

    private Environment environment(boolean devProfile) {
        Environment environment = mock(Environment.class);
        when(environment.acceptsProfiles(any(Profiles.class))).thenReturn(devProfile);
        return environment;
    }
}

package com.raxim.myscoutee.domain.payments.document;

import com.raxim.myscoutee.domain.payments.service.BarionApiEndpointResolver;
import com.raxim.myscoutee.domain.payments.service.StripeApiEndpointResolver;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.AfterEach;
import org.springframework.core.env.Environment;
import org.springframework.core.env.Profiles;
import org.springframework.web.server.ResponseStatusException;

import com.raxim.myscoutee.common.config.mongo.MongoSessionMode;
import com.raxim.myscoutee.common.config.mongo.MongoSessionModeContext;

@org.junit.jupiter.api.Tag("standard")
class PaymentApiEndpointResolverTest {

    @AfterEach
    void clearMode() {
        MongoSessionModeContext.clear();
    }

    @Test
    void stripeCustomEndpointRequiresExplicitDevSimulatorAndTestCredential() {
        MongoSessionModeContext.set(MongoSessionMode.DEMO);
        Environment dev = environment(true);

        assertThat(new StripeApiEndpointResolver(
                dev,
                "http://payment-simulator:18082/",
                true).resolve("sk_test_myscoutee"))
                .isEqualTo("http://payment-simulator:18082");

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
        MongoSessionModeContext.set(MongoSessionMode.DEMO);
        assertThat(new BarionApiEndpointResolver(
                environment(true),
                "http://127.0.0.1:18082/",
                true).resolve())
                .isEqualTo("http://127.0.0.1:18082");

        assertThatThrownBy(() -> new BarionApiEndpointResolver(
                environment(true),
                "http://example.com:18082",
                true).resolve())
                .isInstanceOf(ResponseStatusException.class);
    }

    @Test
    void realSessionNeverUsesTheDemoEndpoints() {
        MongoSessionModeContext.set(MongoSessionMode.REAL);
        assertThat(new StripeApiEndpointResolver(
                environment(false),
                "http://payment-simulator:18082",
                true).resolve("sk_live_operator"))
                .isNull();
        assertThat(new BarionApiEndpointResolver(
                environment(false),
                "http://payment-simulator:18082",
                true).resolve())
                .isEqualTo("https://api.barion.com");
    }

    private Environment environment(boolean devProfile) {
        Environment environment = mock(Environment.class);
        when(environment.acceptsProfiles(any(Profiles.class))).thenReturn(devProfile);
        return environment;
    }
}

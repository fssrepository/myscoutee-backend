package com.raxim.myscoutee.profile.service.operator;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.web.server.ResponseStatusException;

import com.raxim.myscoutee.common.config.mongo.MongoSessionMode;
import com.raxim.myscoutee.common.config.mongo.MongoSessionModeContext;
import com.raxim.myscoutee.profile.data.document.DeploymentConfiguration;
import com.raxim.myscoutee.profile.repository.DeploymentConfigurationRepository;

class DeploymentPaymentRoutingResolverTest {
    @AfterEach
    void clearSessionMode() {
        MongoSessionModeContext.clear();
    }

    @Test
    void resolvesDeploymentOwnedUrlsWithoutVendorFallbacks() {
        DeploymentConfigurationRepository repository =
                mock(DeploymentConfigurationRepository.class);
        DeploymentConfiguration configuration = configuration(
                "barion",
                "https://community.example.test",
                "merchant@example.test");
        when(repository.findById(DeploymentConfiguration.SINGLETON_ID))
                .thenReturn(Optional.of(configuration));

        var routing =
                new DeploymentPaymentRoutingResolver(repository).require("barion");

        assertThat(routing.merchantAccount())
                .isEqualTo("merchant@example.test");
        assertThat(routing.successUrl())
                .isEqualTo("https://community.example.test/payment/success");
        assertThat(routing.callbackUrl())
                .isEqualTo("https://community.example.test/api/payment/callback");
    }

    @Test
    void failsClosedWhenRoutingIsMissingOrBelongsToAnotherProvider() {
        DeploymentConfigurationRepository repository =
                mock(DeploymentConfigurationRepository.class);
        when(repository.findById(DeploymentConfiguration.SINGLETON_ID))
                .thenReturn(Optional.of(configuration(
                        "stripe",
                        null,
                        null)));
        DeploymentPaymentRoutingResolver resolver =
                new DeploymentPaymentRoutingResolver(repository);

        assertThatThrownBy(() -> resolver.require("stripe"))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("public deployment URL");
        assertThatThrownBy(() -> resolver.require("barion"))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("not configured for barion");
    }

    @Test
    void usesIsolatedRoutingOnlyWhenPaymentSimulatorIsEnabled() {
        DeploymentConfigurationRepository repository =
                mock(DeploymentConfigurationRepository.class);
        DeploymentPaymentRoutingResolver resolver =
                new DeploymentPaymentRoutingResolver(
                        repository,
                        true,
                        "http://localhost/",
                        "merchant@myscoutee.local");
        MongoSessionModeContext.set(MongoSessionMode.DEMO);

        var stripe = resolver.require("stripe");
        var barion = resolver.require("barion");

        assertThat(stripe.successUrl("stripe"))
                .isEqualTo("http://localhost/game?payment=success&session_id={CHECKOUT_SESSION_ID}");
        assertThat(barion.callbackUrl("barion"))
                .isEqualTo("http://localhost/api/payment/webhooks/barion");
        assertThat(barion.merchantAccount())
                .isEqualTo("merchant@myscoutee.local");
    }

    @Test
    void keepsRealRoutingIsolatedWhenPaymentSimulatorIsEnabled() {
        DeploymentConfigurationRepository repository =
                mock(DeploymentConfigurationRepository.class);
        when(repository.findById(DeploymentConfiguration.SINGLETON_ID))
                .thenReturn(Optional.of(configuration(
                        "stripe",
                        "https://live.example.test",
                        null)));
        DeploymentPaymentRoutingResolver resolver =
                new DeploymentPaymentRoutingResolver(
                        repository,
                        true,
                        "https://demo.example.test",
                        "merchant@demo.invalid");
        MongoSessionModeContext.set(MongoSessionMode.REAL);

        var routing = resolver.require("stripe");

        assertThat(routing.successUrl())
                .isEqualTo("https://live.example.test/payment/success");
        assertThat(routing.callbackUrl())
                .isEqualTo("https://live.example.test/api/payment/callback");
    }

    private DeploymentConfiguration configuration(
            String provider,
            String publicBaseUrl,
            String merchantAccount) {
        DeploymentConfiguration configuration =
                new DeploymentConfiguration();
        DeploymentConfiguration.Payment payment =
                new DeploymentConfiguration.Payment();
        payment.setProviderId(provider);
        payment.setPublicBaseUrl(publicBaseUrl);
        payment.setMerchantAccount(merchantAccount);
        configuration.setPayment(payment);
        return configuration;
    }
}

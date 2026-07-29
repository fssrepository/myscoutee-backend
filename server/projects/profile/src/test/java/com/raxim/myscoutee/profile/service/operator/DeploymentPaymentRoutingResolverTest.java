package com.raxim.myscoutee.profile.service.operator;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.springframework.web.server.ResponseStatusException;

import com.raxim.myscoutee.profile.data.document.DeploymentConfiguration;
import com.raxim.myscoutee.profile.repository.DeploymentConfigurationRepository;

class DeploymentPaymentRoutingResolverTest {
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

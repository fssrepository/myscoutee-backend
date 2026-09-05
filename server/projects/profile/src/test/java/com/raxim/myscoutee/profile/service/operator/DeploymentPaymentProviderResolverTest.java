package com.raxim.myscoutee.profile.service.operator;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import com.raxim.myscoutee.profile.data.document.DeploymentConfiguration;
import com.raxim.myscoutee.profile.data.dto.operator.OperatorConfigurationDtos.PaymentProviderDto;
import com.raxim.myscoutee.profile.repository.DeploymentConfigurationRepository;

class DeploymentPaymentProviderResolverTest {
    @Test
    void selectedProviderIsAuthoritativeWhenCallerOmitsIt() {
        Fixture fixture = fixture("barion", List.of(
                provider("stripe", "Stripe"),
                provider("barion", "Barion")));

        assertThat(fixture.resolver().resolveActiveProvider(null))
                .isEqualTo("barion");
    }

    @Test
    void callerCannotOverrideTheOperatorSelectedProvider() {
        Fixture fixture = fixture("barion", List.of(
                provider("stripe", "Stripe"),
                provider("barion", "Barion")));

        assertThatThrownBy(
                () -> fixture.resolver().resolveActiveProvider("stripe"))
                .isInstanceOfSatisfying(
                        ResponseStatusException.class,
                        exception -> {
                            assertThat(exception.getStatusCode())
                                    .isEqualTo(HttpStatus.BAD_REQUEST);
                            assertThat(exception.getReason())
                                    .isEqualTo("Payment provider changed. Retokenize your card.");
                        });
    }

    @Test
    void missingOrDisabledSelectionFailsClosed() {
        Fixture missing = fixture(null, List.of(
                provider("stripe", "Stripe")));
        Fixture disabled = fixture("barion", List.of(
                provider("stripe", "Stripe")));

        assertUnavailable(
                () -> missing.resolver().resolveActiveProvider(null),
                "not selected");
        assertUnavailable(
                () -> disabled.resolver().resolveActiveProvider(null),
                "not available");
    }

    private Fixture fixture(
            String providerId,
            List<PaymentProviderDto> availableProviders) {
        DeploymentConfiguration configuration = new DeploymentConfiguration();
        DeploymentConfiguration.Payment payment =
                new DeploymentConfiguration.Payment();
        payment.setProviderId(providerId);
        configuration.setPayment(payment);
        DeploymentConfigurationRepository repository =
                mock(DeploymentConfigurationRepository.class);
        when(repository.findById(DeploymentConfiguration.SINGLETON_ID))
                .thenReturn(Optional.of(configuration));
        PaymentProviderService providerService =
                mock(PaymentProviderService.class);
        when(providerService.availableProviders())
                .thenReturn(availableProviders);
        return new Fixture(new DeploymentPaymentProviderResolver(
                repository,
                providerService));
    }

    private PaymentProviderDto provider(String id, String label) {
        return new PaymentProviderDto(id, label, null, null, "teal");
    }

    private void assertUnavailable(
            org.assertj.core.api.ThrowableAssert.ThrowingCallable callable,
            String message) {
        assertThatThrownBy(callable)
                .isInstanceOfSatisfying(
                        ResponseStatusException.class,
                        exception -> {
                            assertThat(exception.getStatusCode())
                                    .isEqualTo(HttpStatus.SERVICE_UNAVAILABLE);
                            assertThat(exception.getReason()).contains(message);
                        });
    }

    private record Fixture(
            DeploymentPaymentProviderResolver resolver) {
    }
}

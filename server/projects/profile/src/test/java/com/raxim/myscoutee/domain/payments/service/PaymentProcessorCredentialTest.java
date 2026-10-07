package com.raxim.myscoutee.domain.payments.service;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.web.server.ResponseStatusException;

import com.raxim.myscoutee.domain.events.dto.EventsDtos.EventCheckoutLineItemDto;
import com.raxim.myscoutee.domain.events.dto.EventsDtos.EventCheckoutRequestDto;
import com.raxim.myscoutee.domain.payments.service.DeploymentPaymentCredentialResolver;
import com.raxim.myscoutee.domain.payments.service.DeploymentPaymentRoutingResolver;

@org.junit.jupiter.api.Tag("standard")
class PaymentProcessorCredentialTest {
    @Test
    void stripeResolvesTheRegisteredRuntimeCredentialPerRequest() {
        DeploymentPaymentCredentialResolver resolver =
                mock(DeploymentPaymentCredentialResolver.class);
        DeploymentPaymentRoutingResolver routingResolver =
                mock(DeploymentPaymentRoutingResolver.class);
        when(resolver.resolve("stripe", "legacy-stripe-env")).thenReturn("");
        StripePaymentProcessor processor =
                new StripePaymentProcessor(
                        resolver,
                        routingResolver,
                        "legacy-stripe-env");

        assertThatThrownBy(() -> processor.pay(request(), "checkout-1"))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("Stripe payment credential is not configured");
        verify(resolver).resolve("stripe", "legacy-stripe-env");
    }

    @Test
    void barionResolvesTheRegisteredRuntimeCredentialPerRequest() {
        DeploymentPaymentCredentialResolver resolver =
                mock(DeploymentPaymentCredentialResolver.class);
        DeploymentPaymentRoutingResolver routingResolver =
                mock(DeploymentPaymentRoutingResolver.class);
        when(resolver.resolve("barion", "legacy-barion-env")).thenReturn("");
        BarionPaymentProcessor processor =
                new BarionPaymentProcessor(
                        resolver,
                        routingResolver,
                        "legacy-barion-env");

        assertThatThrownBy(() -> processor.pay(request(), "checkout-1"))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("Barion payment credential is not configured");
        verify(resolver).resolve("barion", "legacy-barion-env");
    }

    private EventCheckoutRequestDto request() {
        return new EventCheckoutRequestDto(
                "user-1",
                "event-1",
                null,
                List.of(),
                List.of(),
                List.of(),
                List.of(),
                List.of(),
                "pay",
                List.of(new EventCheckoutLineItemDto(
                        "ticket-1",
                        "ticket",
                        "Ticket",
                        "One seat",
                        12.50,
                        "EUR")),
                12.50,
                "EUR",
                null);
    }
}

package com.raxim.myscoutee.profile.service;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.mockito.Mockito.verifyNoInteractions;

import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.NullAndEmptySource;
import org.junit.jupiter.params.provider.ValueSource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventCheckoutRequestDto;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventCheckoutLineItemDto;
import com.raxim.myscoutee.profile.service.operator.DeploymentPaymentCredentialResolver;
import com.raxim.myscoutee.profile.service.operator.DeploymentPaymentRoutingResolver;

class BarionPaymentProcessorSecurityTest {

    @ParameterizedTest
    @NullAndEmptySource
    @ValueSource(strings = { " ", "VIP admission" })
    void optionalCheckoutDetailProducesARequiredBarionDescription(String detail) {
        var credentials = mock(DeploymentPaymentCredentialResolver.class);
        var routing = mock(DeploymentPaymentRoutingResolver.class);
        var endpoint = mock(BarionApiEndpointResolver.class);
        var rest = mock(RestTemplate.class);
        var request = mock(EventCheckoutRequestDto.class);
        when(credentials.resolve("barion", "")).thenReturn("test-pos-key");
        when(routing.require("barion")).thenReturn(
                new DeploymentPaymentRoutingResolver.PaymentRouting("https://example.test", "merchant@example.test"));
        when(endpoint.resolve()).thenReturn("https://provider.example.test");
        when(request.lineItems()).thenReturn(List.of(
                new EventCheckoutLineItemDto("ticket", "event", "Event admission", detail, 5d, "EUR")));
        when(request.currency()).thenReturn("EUR");
        when(request.totalAmount()).thenReturn(5d);
        when(rest.exchange(eq("https://provider.example.test/v2/Payment/Start"), eq(HttpMethod.POST),
                any(HttpEntity.class), eq(Map.class))).thenAnswer(call -> {
                    Map<?, ?> body = (Map<?, ?>) ((HttpEntity<?>) call.getArgument(2)).getBody();
                    Map<?, ?> transaction = (Map<?, ?>) ((List<?>) body.get("Transactions")).getFirst();
                    Map<?, ?> item = (Map<?, ?>) ((List<?>) transaction.get("Items")).getFirst();
                    assertThat(item.get("Description")).isEqualTo(
                            detail == null || detail.isBlank() ? "Event admission" : detail);
                    assertThat(item.get("Name")).isEqualTo("Event admission");
                    return ResponseEntity.ok(Map.of("PaymentId", "11111111-1111-4111-8111-111111111111", "Status", "Succeeded"));
                });
        var processor = new BarionPaymentProcessor(credentials, routing, endpoint, "", rest);
        assertThat(processor.prepareAuthorization(request, "test-session").status())
                .isEqualTo(PaymentProcessor.AuthorizationStatus.CAPTURED);
    }

    @Test
    void callbackPaymentIdMustBeAGuidBeforeAnyCredentialOrNetworkAccess() {
        DeploymentPaymentCredentialResolver credentials = mock(DeploymentPaymentCredentialResolver.class);
        DeploymentPaymentRoutingResolver routing = mock(DeploymentPaymentRoutingResolver.class);
        BarionApiEndpointResolver endpoint = mock(BarionApiEndpointResolver.class);
        RestTemplate restTemplate = mock(RestTemplate.class);
        BarionPaymentProcessor processor = new BarionPaymentProcessor(
                credentials,
                routing,
                endpoint,
                "",
                restTemplate);

        assertThatThrownBy(() -> processor.retrieveAuthorization(null, "../paymentstate?POSKey=leak"))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("GUID");

        verifyNoInteractions(credentials, routing, endpoint, restTemplate);
    }
}

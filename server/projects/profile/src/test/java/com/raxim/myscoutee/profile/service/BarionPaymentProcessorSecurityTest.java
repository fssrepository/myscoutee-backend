package com.raxim.myscoutee.profile.service;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verifyNoInteractions;

import org.junit.jupiter.api.Test;
import org.springframework.web.client.RestTemplate;

import com.raxim.myscoutee.profile.service.operator.DeploymentPaymentCredentialResolver;
import com.raxim.myscoutee.profile.service.operator.DeploymentPaymentRoutingResolver;

class BarionPaymentProcessorSecurityTest {

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

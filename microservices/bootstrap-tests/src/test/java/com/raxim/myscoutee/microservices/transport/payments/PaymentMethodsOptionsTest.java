package com.raxim.myscoutee.microservices.transport.payments;

import com.raxim.myscoutee.domain.payments.api.PaymentMethods;
import com.raxim.myscoutee.domain.platform.api.JobGroupContext;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import tools.jackson.databind.json.JsonMapper;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class PaymentMethodsOptionsTest {
    @Test void existingAvailabilityResponseCarriesSummaryCurrenciesInOneScopedOwnerCall() throws Exception {
        var owner = mock(PaymentMethods.class);
        when(owner.options()).thenAnswer(call -> {
            assertTrue(JobGroupContext.isActive());
            assertEquals("myscoutee-community", JobGroupContext.groupId());
            return new PaymentMethods.Options(true, List.of("EUR", "HUF", "USD"), java.util.Map.of("EUR", 1D, "HUF", 0.0025D));
        });
        var mapper = new JsonMapper();
        var request = new MockHttpServletRequest("POST", PaymentMethodsProtocol.AVAILABLE);
        request.setContentType("application/json");
        request.setContent(mapper.writeValueAsBytes(new PaymentMethodsProtocol.Query(
                new PaymentMethodsProtocol.Scope(true, "myscoutee-community"))));
        var response = new PaymentMethodsEndpoint(owner, mapper).available(request);
        assertEquals(200, response.getStatusCode().value());
        var wire = mapper.readValue(mapper.writeValueAsBytes(response.getBody()), PaymentMethodsProtocol.Decision.class);
        assertTrue(wire.value());
        assertEquals(List.of("EUR", "HUF", "USD"), wire.currencies());
        assertEquals(java.util.Map.of("EUR", 1D, "HUF", 0.0025D), wire.eurRates());
        verify(owner).options();
        verifyNoMoreInteractions(owner);
    }
}

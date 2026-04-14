package com.raxim.myscoutee.profile.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventCheckoutRequestDto;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventCheckoutSessionDto;

import java.util.List;
import java.util.Map;

@Service
public class BarionPaymentProcessor implements PaymentProcessor {

    @Value("${payment.barion.apiKey:}")
    private String posKey;

    private final RestTemplate restTemplate = new RestTemplate();

    @Override
    public String getType() {
        return "barion";
    }

    @Override
    public EventCheckoutSessionDto checkout(EventCheckoutRequestDto request) {
        return new EventCheckoutSessionDto(
            "barion_pending_" + System.currentTimeMillis(),
            getType(),
            "gateway",
            "pending",
            request.totalAmount(),
            request.currency(),
            null
        );
    }

    @Override
    public EventCheckoutSessionDto pay(EventCheckoutRequestDto request, String paymentSessionId) {
        String barionUrl = "https://api.barion.com/v2/Payment/Start";

        Map<String, Object> barionRequest = Map.of(
            "POSKey", posKey,
            "PaymentType", "Immediate",
            "GuestCheckOut", true,
            "FundingSources", List.of("All"),
            "PaymentRequestId", "PAY-" + System.currentTimeMillis(),
            "Transactions", List.of(Map.of(
                "POSTransactionId", "TX-" + System.currentTimeMillis(),
                "Payee", "info@myscoutee.com",
                "Total", request.totalAmount(),
                "Items", request.lineItems().stream().map(item -> Map.of(
                    "Name", item.label(),
                    "Description", item.detail(),
                    "Quantity", 1,
                    "Unit", "pcs",
                    "UnitPrice", item.amount(),
                    "ItemTotal", item.amount()
                )).toList()
            )),
            "RedirectUrl", "https://myscoutee.com/payment/success",
            "CallbackUrl", "https://myscoutee.com/api/payment/callback"
        );

        try {
            @SuppressWarnings("unchecked")
            Map<String, Object> response = restTemplate.postForObject(barionUrl, barionRequest, Map.class);
            if (response != null && response.containsKey("GatewayUrl")) {
                return new EventCheckoutSessionDto(
                    (String) response.get("PaymentId"),
                    getType(),
                    "gateway",
                    "requires_action",
                    request.totalAmount(),
                    request.currency(),
                    (String) response.get("GatewayUrl")
                );
            }
            throw new RuntimeException("Barion payment start failed: " + response);
        } catch (Exception e) {
            throw new RuntimeException("Failed to call Barion API", e);
        }
    }
}

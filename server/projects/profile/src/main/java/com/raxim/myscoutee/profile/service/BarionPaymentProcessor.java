package com.raxim.myscoutee.profile.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.server.ResponseStatusException;

import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventCheckoutRequestDto;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventCheckoutSessionDto;
import com.raxim.myscoutee.profile.service.operator.DeploymentPaymentCredentialResolver;
import com.raxim.myscoutee.profile.service.operator.DeploymentPaymentRoutingResolver;
import com.raxim.myscoutee.profile.service.operator.DeploymentPaymentRoutingResolver.PaymentRouting;

import java.util.List;
import java.util.Map;

@Service
public class BarionPaymentProcessor implements PaymentProcessor {

    private final DeploymentPaymentCredentialResolver credentialResolver;
    private final DeploymentPaymentRoutingResolver routingResolver;
    private final String environmentPosKey;
    private final RestTemplate restTemplate = new RestTemplate();

    public BarionPaymentProcessor(
            DeploymentPaymentCredentialResolver credentialResolver,
            DeploymentPaymentRoutingResolver routingResolver,
            @Value("${payment.barion.apiKey:}") String environmentPosKey) {
        this.credentialResolver = credentialResolver;
        this.routingResolver = routingResolver;
        this.environmentPosKey = environmentPosKey;
    }

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
        String posKey = credentialResolver.resolve(getType(), environmentPosKey);
        if (!StringUtils.hasText(posKey)) {
            throw new ResponseStatusException(
                    HttpStatus.SERVICE_UNAVAILABLE,
                    "Barion payment credential is not configured.");
        }
        PaymentRouting routing = routingResolver.require(getType());

        Map<String, Object> barionRequest = Map.of(
            "POSKey", posKey,
            "PaymentType", "Immediate",
            "GuestCheckOut", true,
            "FundingSources", List.of("All"),
            "PaymentRequestId", "PAY-" + System.currentTimeMillis(),
            "Transactions", List.of(Map.of(
                "POSTransactionId", "TX-" + System.currentTimeMillis(),
                "Payee", routing.merchantAccount(),
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
            "RedirectUrl", routing.successUrl(),
            "CallbackUrl", routing.callbackUrl()
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

package com.raxim.myscoutee.profile.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.server.ResponseStatusException;

import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventCheckoutRequestDto;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventCheckoutSessionDto;
import com.raxim.myscoutee.profile.service.operator.DeploymentPaymentCredentialResolver;
import com.raxim.myscoutee.profile.service.operator.DeploymentPaymentRoutingResolver;
import com.raxim.myscoutee.profile.service.operator.DeploymentPaymentRoutingResolver.PaymentRouting;
import com.stripe.model.checkout.Session;
import com.stripe.net.RequestOptions;
import com.stripe.param.checkout.SessionCreateParams;

import java.util.ArrayList;
import java.util.List;

@Service
public class StripePaymentProcessor implements PaymentProcessor {

    private final DeploymentPaymentCredentialResolver credentialResolver;
    private final DeploymentPaymentRoutingResolver routingResolver;
    private final String environmentApiKey;

    public StripePaymentProcessor(
            DeploymentPaymentCredentialResolver credentialResolver,
            DeploymentPaymentRoutingResolver routingResolver,
            @Value("${payment.stripe.apiKey:}") String environmentApiKey) {
        this.credentialResolver = credentialResolver;
        this.routingResolver = routingResolver;
        this.environmentApiKey = environmentApiKey;
    }

    @Override
    public String getType() {
        return "stripe";
    }

    @Override
    public EventCheckoutSessionDto checkout(EventCheckoutRequestDto request) {
        // Here we could perform server-side validation of prices/items
        return new EventCheckoutSessionDto(
            "pending_" + System.currentTimeMillis(),
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
        List<SessionCreateParams.LineItem> lineItems = new ArrayList<>();
        request.lineItems().forEach(item -> {
            lineItems.add(
                SessionCreateParams.LineItem.builder()
                    .setQuantity(1L)
                    .setPriceData(
                        SessionCreateParams.LineItem.PriceData.builder()
                            .setCurrency(item.currency().toLowerCase())
                            .setUnitAmount((long) (item.amount() * 100))
                            .setProductData(
                                SessionCreateParams.LineItem.PriceData.ProductData.builder()
                                    .setName(item.label())
                                    .setDescription(item.detail())
                                    .build()
                            )
                            .build()
                    )
                    .build()
            );
        });

        String apiKey = credentialResolver.resolve(getType(), environmentApiKey);
        if (!StringUtils.hasText(apiKey)) {
            throw new ResponseStatusException(
                    HttpStatus.SERVICE_UNAVAILABLE,
                    "Stripe payment credential is not configured.");
        }
        PaymentRouting routing = routingResolver.require(getType());
        try {
            SessionCreateParams params = SessionCreateParams.builder()
                .setMode(SessionCreateParams.Mode.PAYMENT)
                .setSuccessUrl(routing.successUrl())
                .setCancelUrl(routing.cancelUrl())
                .addAllLineItem(lineItems)
                .build();

            RequestOptions requestOptions = RequestOptions.builder()
                    .setApiKey(apiKey)
                    .build();
            Session session = Session.create(params, requestOptions);

            return new EventCheckoutSessionDto(
                session.getId(),
                getType(),
                "gateway",
                "requires_action",
                request.totalAmount(),
                request.currency(),
                session.getUrl()
            );
        } catch (Exception e) {
            throw new RuntimeException("Failed to create Stripe session", e);
        }
    }
}

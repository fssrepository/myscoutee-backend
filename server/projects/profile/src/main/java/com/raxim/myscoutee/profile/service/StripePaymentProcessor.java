package com.raxim.myscoutee.profile.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventCheckoutRequestDto;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventCheckoutSessionDto;
import com.stripe.Stripe;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;

import java.util.ArrayList;
import java.util.List;

@Service
public class StripePaymentProcessor implements PaymentProcessor {

    @Value("${payment.stripe.apiKey:}")
    private String apiKey;

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
        Stripe.apiKey = apiKey;

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

        try {
            SessionCreateParams params = SessionCreateParams.builder()
                .setMode(SessionCreateParams.Mode.PAYMENT)
                .setSuccessUrl("https://myscoutee.com/payment/success")
                .setCancelUrl("https://myscoutee.com/payment/cancel")
                .addAllLineItem(lineItems)
                .build();

            Session session = Session.create(params);

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

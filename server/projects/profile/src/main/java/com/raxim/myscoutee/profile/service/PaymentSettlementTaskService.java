package com.raxim.myscoutee.profile.service;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.time.Duration;
import java.time.format.DateTimeParseException;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.raxim.myscoutee.profile.data.document.Payment;
import com.raxim.myscoutee.profile.repository.PaymentsRepository;

@Service
public class PaymentSettlementTaskService {
    private static final Duration CLIENT_FULFILLMENT_TIMEOUT = Duration.ofMinutes(10);

    private final PaymentsRepository paymentsRepository;
    private final PaymentGatewayOperationService gatewayOperationService;
    private final boolean paymentEnabled;

    public PaymentSettlementTaskService(
            PaymentsRepository paymentsRepository,
            PaymentGatewayOperationService gatewayOperationService,
            @Value("${payment.enablePay:false}") boolean paymentEnabled) {
        this.paymentsRepository = paymentsRepository;
        this.gatewayOperationService = gatewayOperationService;
        this.paymentEnabled = paymentEnabled;
    }

    @Scheduled(fixedDelayString = "${payment.settlement.pollDelay:PT1M}")
    public void captureCompletedBookings() {
        if (!paymentEnabled) {
            return;
        }
        Instant now = Instant.now();
        expireUnfulfilledClientAuthorizations(now);
        for (Payment payment : paymentsRepository.findByStatusAndBookingStatus("authorized", "joined")) {
            if (payment == null
                    || !"succeeded".equals(normalize(payment.getFulfillmentStatus()))
                    || !hasEnded(payment.getBookingEndAtIso(), now)) {
                continue;
            }
            gatewayOperationService.enqueueCapture(
                    payment,
                    BigDecimal.valueOf(payment.getAmount() == null ? 0D : payment.getAmount()),
                    "event-settlement");
        }
        for (Payment payment : paymentsRepository.findByStatusAndBookingStatus("authorized", "cancelled")) {
            if (payment == null) {
                continue;
            }
            gatewayOperationService.enqueueRelease(payment, "booking-cancelled");
        }
    }

    private void expireUnfulfilledClientAuthorizations(Instant now) {
        for (Payment payment : paymentsRepository.findByStatusAndFulfillmentStatusAndFulfillmentKind(
                "authorized",
                "pending",
                PaymentService.FULFILLMENT_KIND_CLIENT)) {
            Instant createdAt = parseInstant(payment == null ? null : payment.getCreatedDate());
            if (createdAt == null || createdAt.plus(CLIENT_FULFILLMENT_TIMEOUT).isAfter(now)) {
                continue;
            }
            payment.setFulfillmentStatus("failed");
            payment.setFailedAtIso(now.toString());
            payment.setLastGatewayError("The client payment was not fulfilled within 10 minutes.");
            Payment expired = paymentsRepository.save(payment);
            gatewayOperationService.enqueueRelease(expired, "client-fulfillment-timeout");
        }
    }

    private boolean hasEnded(String endAtIso, Instant now) {
        Instant endAt = parseInstant(endAtIso);
        return endAt != null && !endAt.isAfter(now);
    }

    private Instant parseInstant(String value) {
        if (!StringUtils.hasText(value)) {
            return null;
        }
        try {
            return Instant.parse(value.trim());
        } catch (DateTimeParseException ignored) {
            try {
                return LocalDateTime.parse(value.trim()).toInstant(ZoneOffset.UTC);
            } catch (DateTimeParseException alsoIgnored) {
                return null;
            }
        }
    }

    private String normalize(String value) {
        return value == null ? "" : value.trim().toLowerCase();
    }
}

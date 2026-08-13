package com.raxim.myscoutee.profile.service;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.time.format.DateTimeParseException;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.raxim.myscoutee.profile.data.document.Payment;
import com.raxim.myscoutee.profile.repository.PaymentsRepository;

@Service
public class PaymentSettlementTaskService {
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

    private boolean hasEnded(String endAtIso, Instant now) {
        if (!StringUtils.hasText(endAtIso)) {
            return false;
        }
        try {
            return !Instant.parse(endAtIso.trim()).isAfter(now);
        } catch (DateTimeParseException ignored) {
            try {
                return !LocalDateTime.parse(endAtIso.trim()).toInstant(ZoneOffset.UTC).isAfter(now);
            } catch (DateTimeParseException alsoIgnored) {
                return false;
            }
        }
    }

    private String normalize(String value) {
        return value == null ? "" : value.trim().toLowerCase();
    }
}

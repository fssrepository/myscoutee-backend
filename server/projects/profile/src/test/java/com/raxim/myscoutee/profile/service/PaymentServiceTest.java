package com.raxim.myscoutee.profile.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.Duration;
import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicInteger;

import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.server.ResponseStatusException;

import com.raxim.myscoutee.profile.data.document.Payment;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventCheckoutLineItemDto;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventCheckoutRequestDto;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventCheckoutSessionDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.PricingCancellationPolicyDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.PricingCancellationRuleDto;
import com.raxim.myscoutee.profile.repository.PaymentsRepository;

class PaymentServiceTest {
    @Test
    void disabledPaymentModeUsesDummySessionsWithoutCallingConfiguredProcessor() {
        Map<String, Payment> paymentsBySession = new HashMap<>();
        PaymentsRepository repository = inMemoryRepository(paymentsBySession);
        RecordingPaymentProcessor stripe = new RecordingPaymentProcessor("stripe");
        PaymentService service = paymentService(repository, false, stripe);

        EventCheckoutRequestDto request = checkoutRequest("user-1", "event-1", 25d, "EUR");
        EventCheckoutSessionDto checkout = service.checkout(request, "stripe");
        EventCheckoutSessionDto paid = service.pay(request, checkout.id(), "stripe");

        assertThat(checkout.id()).startsWith("dummy_");
        assertThat(checkout.provider()).isEqualTo("dummy");
        assertThat(checkout.status()).isEqualTo("approved");
        assertThat(paid.id()).isEqualTo(checkout.id());
        assertThat(paid.provider()).isEqualTo("dummy");
        assertThat(stripe.checkoutCalls()).isZero();
        assertThat(stripe.payCalls()).isZero();

        Payment payment = paymentsBySession.get(checkout.id());
        assertThat(payment).isNotNull();
        assertThat(payment.getProvider()).isEqualTo("stripe");
        assertThat(payment.getCheckoutSessionId()).isEqualTo(checkout.id());
        assertThat(payment.getGatewaySessionId()).isEqualTo(checkout.id());
        assertThat(payment.getBookingStatus()).isEqualTo("initiated");
        assertThat(payment.getAmount()).isEqualTo(25d);
        assertThat(payment.getCurrency()).isEqualTo("EUR");
    }

    @Test
    void enabledPaymentModeRoutesToRequestedProcessorAndPersistsGatewaySession() {
        Map<String, Payment> paymentsBySession = new HashMap<>();
        PaymentsRepository repository = inMemoryRepository(paymentsBySession);
        RecordingPaymentProcessor stripe = new RecordingPaymentProcessor("stripe");
        RecordingPaymentProcessor barion = new RecordingPaymentProcessor("barion");
        PaymentService service = paymentService(repository, true, stripe, barion);

        EventCheckoutRequestDto request = checkoutRequest("user-2", "event-2", 31.5d, "HUF");
        EventCheckoutSessionDto checkout = service.checkout(request, "barion");
        EventCheckoutSessionDto paid = service.pay(request, checkout.id(), "barion");

        assertThat(checkout.id()).isEqualTo("barion_checkout_1");
        assertThat(paid.id()).isEqualTo("barion_gateway_1");
        assertThat(barion.checkoutCalls()).isEqualTo(1);
        assertThat(barion.payCalls()).isEqualTo(1);
        assertThat(barion.paySessionIds()).containsExactly(checkout.id());
        assertThat(stripe.checkoutCalls()).isZero();
        assertThat(stripe.payCalls()).isZero();

        Payment payment = paymentsBySession.get(paid.id());
        assertThat(payment).isNotNull();
        assertThat(payment.getProvider()).isEqualTo("barion");
        assertThat(payment.getCheckoutSessionId()).isEqualTo(checkout.id());
        assertThat(payment.getGatewaySessionId()).isEqualTo(paid.id());
        assertThat(payment.getStatus()).isEqualTo("approved");
        assertThat(payment.getAmount()).isEqualTo(31.5d);
        assertThat(payment.getCurrency()).isEqualTo("HUF");
    }

    @Test
    void providerFailureDoesNotPersistPaymentRequest() {
        PaymentsRepository repository = org.mockito.Mockito.mock(PaymentsRepository.class);
        when(repository.findByGatewaySessionId(anyString())).thenReturn(Optional.empty());
        when(repository.findByCheckoutSessionId(anyString())).thenReturn(Optional.empty());
        when(repository.findById(anyString())).thenReturn(Optional.empty());
        PaymentProcessor failingProcessor = new PaymentProcessor() {
            @Override
            public String getType() {
                return "stripe";
            }

            @Override
            public EventCheckoutSessionDto checkout(EventCheckoutRequestDto request) {
                throw new ResponseStatusException(org.springframework.http.HttpStatus.BAD_GATEWAY, "Provider unavailable.");
            }

            @Override
            public EventCheckoutSessionDto pay(EventCheckoutRequestDto request, String paymentSessionId) {
                throw new ResponseStatusException(org.springframework.http.HttpStatus.BAD_GATEWAY, "Provider unavailable.");
            }
        };
        PaymentService service = paymentService(repository, true, failingProcessor);

        assertThatThrownBy(() -> service.checkout(checkoutRequest("user-3", "event-3", 10d, "EUR"), "stripe"))
                .isInstanceOf(ResponseStatusException.class);
        verify(repository, never()).save(any(Payment.class));
    }

    @Test
    void cancelJoinedBookingComputesPartialRefundFromEligibleRule() {
        Map<String, Payment> paymentsBySession = new HashMap<>();
        PaymentsRepository repository = inMemoryRepository(paymentsBySession);
        PaymentService service = paymentService(repository, true, new RecordingPaymentProcessor("stripe"));
        Payment payment = joinedPayment(
                "checkout-refund",
                "gateway-refund",
                "user-4",
                "event-4",
                Instant.now().plus(Duration.ofDays(3)).toString(),
                new PricingCancellationPolicyDto(true, List.of(
                        new PricingCancellationRuleDto("full-7d", "days", 7, "full", 100d),
                        new PricingCancellationRuleDto("partial-1d", "days", 1, "percent", 40d))));
        savePayment(paymentsBySession, payment);
        when(repository.findByUserIdAndSourceId("user-4", "event-4")).thenReturn(List.of(payment));

        service.cancelEventBooking("user-4", "event-4", null, null);

        assertThat(payment.getBookingStatus()).isEqualTo("cancelled");
        assertThat(payment.getRefundStatus()).isEqualTo("partial");
        assertThat(payment.getRefundedAmount()).isEqualTo(40d);
        assertThat(payment.getRefundCurrency()).isEqualTo("EUR");
        assertThat(payment.getRefundRuleId()).isEqualTo("partial-1d");
        assertThat(payment.getStatus()).isEqualTo("partially_refunded");
    }

    private PaymentService paymentService(PaymentsRepository repository, boolean enablePay, PaymentProcessor... processors) {
        PaymentService service = new PaymentService(
                List.of(processors),
                repository,
                org.mockito.Mockito.mock(EventCheckoutBasketService.class));
        ReflectionTestUtils.setField(service, "enablePay", enablePay);
        return service;
    }

    private PaymentsRepository inMemoryRepository(Map<String, Payment> paymentsBySession) {
        PaymentsRepository repository = org.mockito.Mockito.mock(PaymentsRepository.class);
        when(repository.findByGatewaySessionId(anyString())).thenAnswer(invocation ->
                Optional.ofNullable(paymentsBySession.get(invocation.getArgument(0, String.class))));
        when(repository.findByCheckoutSessionId(anyString())).thenAnswer(invocation ->
                Optional.ofNullable(paymentsBySession.get(invocation.getArgument(0, String.class))));
        when(repository.findById(anyString())).thenAnswer(invocation ->
                Optional.ofNullable(paymentsBySession.get(invocation.getArgument(0, String.class))));
        when(repository.save(any(Payment.class))).thenAnswer(invocation -> {
            Payment payment = invocation.getArgument(0, Payment.class);
            savePayment(paymentsBySession, payment);
            return payment;
        });
        return repository;
    }

    private void savePayment(Map<String, Payment> paymentsBySession, Payment payment) {
        if (payment.getCheckoutSessionId() != null) {
            paymentsBySession.put(payment.getCheckoutSessionId(), payment);
        }
        if (payment.getGatewaySessionId() != null) {
            paymentsBySession.put(payment.getGatewaySessionId(), payment);
        }
        if (payment.getId() != null) {
            paymentsBySession.put(payment.getId(), payment);
        }
    }

    private EventCheckoutRequestDto checkoutRequest(String userId, String sourceId, double amount, String currency) {
        return new EventCheckoutRequestDto(
                userId,
                sourceId,
                null,
                List.of("sub-event-1"),
                List.of(),
                List.of("policy-1"),
                List.of(),
                List.of(),
                "draft",
                List.of(new EventCheckoutLineItemDto("ticket", "event-ticket", "Ticket", "One seat", amount, currency)),
                amount,
                currency,
                null);
    }

    private Payment joinedPayment(
            String checkoutSessionId,
            String gatewaySessionId,
            String userId,
            String sourceId,
            String bookingStartAtIso,
            PricingCancellationPolicyDto cancellationPolicy) {
        Payment payment = new Payment();
        payment.setCheckoutSessionId(checkoutSessionId);
        payment.setGatewaySessionId(gatewaySessionId);
        payment.setUserId(userId);
        payment.setSourceId(sourceId);
        payment.setProvider("stripe");
        payment.setStatus("approved");
        payment.setAmount(100d);
        payment.setCurrency("EUR");
        payment.setBookingStatus("joined");
        payment.setJoinedAtIso(Instant.now().minus(Duration.ofHours(1)).toString());
        payment.setBookingStartAtIso(bookingStartAtIso);
        payment.setCancellationPolicy(cancellationPolicy);
        payment.setRefundStatus("none");
        payment.setCreatedDate(Instant.now().minus(Duration.ofHours(2)).toString());
        return payment;
    }

    private static class RecordingPaymentProcessor implements PaymentProcessor {
        private final String type;
        private final AtomicInteger checkoutCalls = new AtomicInteger();
        private final AtomicInteger payCalls = new AtomicInteger();
        private final List<String> paySessionIds = new java.util.ArrayList<>();

        RecordingPaymentProcessor(String type) {
            this.type = type;
        }

        @Override
        public String getType() {
            return type;
        }

        @Override
        public EventCheckoutSessionDto checkout(EventCheckoutRequestDto request) {
            int call = checkoutCalls.incrementAndGet();
            return new EventCheckoutSessionDto(
                    type + "_checkout_" + call,
                    type,
                    type,
                    "created",
                    request == null ? 0d : request.totalAmount(),
                    request == null ? "USD" : request.currency(),
                    "/" + type + "/checkout");
        }

        @Override
        public EventCheckoutSessionDto pay(EventCheckoutRequestDto request, String paymentSessionId) {
            int call = payCalls.incrementAndGet();
            paySessionIds.add(paymentSessionId);
            return new EventCheckoutSessionDto(
                    type + "_gateway_" + call,
                    type,
                    type,
                    "approved",
                    request == null ? 0d : request.totalAmount(),
                    request == null ? "USD" : request.currency(),
                    null);
        }

        int checkoutCalls() {
            return checkoutCalls.get();
        }

        int payCalls() {
            return payCalls.get();
        }

        List<String> paySessionIds() {
            return List.copyOf(paySessionIds);
        }
    }
}

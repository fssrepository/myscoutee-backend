package com.raxim.myscoutee.profile.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.Duration;
import java.time.Instant;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicReference;

import org.junit.jupiter.api.Test;
import org.springframework.dao.OptimisticLockingFailureException;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.server.ResponseStatusException;

import com.raxim.myscoutee.profile.data.document.Payment;
import com.raxim.myscoutee.profile.data.document.SavedPaymentMethod;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventCheckoutLineItemDto;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventCheckoutRequestDto;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventCheckoutSessionDto;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventCheckoutStateChangeRequestDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.PricingCancellationPolicyDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.PricingCancellationRuleDto;
import com.raxim.myscoutee.profile.repository.ActivityEventsRepository;
import com.raxim.myscoutee.profile.repository.PaymentsRepository;
import com.raxim.myscoutee.profile.service.PaymentGateway.AuthorizationResult;
import com.raxim.myscoutee.profile.service.operator.DeploymentPaymentProviderResolver;

class PaymentServiceTest {
    @Test
    void synchronousWebhookAuthorizationDoesNotReopenBasketBeforeFulfillmentCompletes() {
        PaymentsRepository repository = org.mockito.Mockito.mock(PaymentsRepository.class);
        EventCheckoutBasketService basketService = org.mockito.Mockito.mock(EventCheckoutBasketService.class);
        EventCheckoutPricingService pricingService = org.mockito.Mockito.mock(EventCheckoutPricingService.class);
        SavedPaymentMethodsService savedPaymentMethodsService = org.mockito.Mockito.mock(SavedPaymentMethodsService.class);
        AtomicBoolean basketProtected = new AtomicBoolean();
        AtomicReference<Payment> concurrentPayment = new AtomicReference<>();
        AtomicInteger saveCalls = new AtomicInteger();
        EventCheckoutRequestDto request = withPaymentMethod(
                checkoutRequest("user-race", "event-race", 25d, "EUR"),
                "card-race");
        when(pricingService.reprice(request)).thenReturn(request);
        when(repository.findByUserIdAndSourceId("user-race", "event-race")).thenReturn(List.of());
        when(repository.findByCheckoutSessionId(anyString()))
                .thenAnswer(invocation -> Optional.ofNullable(concurrentPayment.get()));
        when(basketService.updateBasketState(any(EventCheckoutStateChangeRequestDto.class)))
                .thenAnswer(invocation -> {
                    basketProtected.set(true);
                    return null;
                });

        SavedPaymentMethod method = new SavedPaymentMethod();
        method.setUserId("user-race");
        method.setProvider("stripe");
        method.setProviderPaymentMethodRef("pm-race");
        method.setStatus("active");
        when(savedPaymentMethodsService.requireActive("user-race", "card-race", null)).thenReturn(method);

        PaymentProcessor stripe = new PaymentProcessor() {
            @Override
            public String getType() {
                return "stripe";
            }

            @Override
            public AuthorizationResult prepareAuthorization(
                    EventCheckoutRequestDto authoritativeRequest,
                    String paymentSessionId,
                    String providerPaymentMethodReference) {
                assertThat(basketProtected).as("basket is protected before external authorization").isTrue();
                return new AuthorizationResult(
                        "stripe",
                        "pi-race",
                        "pi-race",
                        PaymentGateway.AuthorizationStatus.AUTHORIZED,
                        java.math.BigDecimal.valueOf(authoritativeRequest.totalAmount()),
                        authoritativeRequest.currency(),
                        null,
                        null,
                        "requires_capture");
            }
        };
        when(repository.save(any(Payment.class))).thenAnswer(invocation -> {
            Payment payment = invocation.getArgument(0, Payment.class);
            if (saveCalls.incrementAndGet() == 1) {
                payment.setId("payment-race");
                payment.setVersion(0L);
                concurrentPayment.set(payment);
                return payment;
            }
            Payment webhookPayment = new Payment();
            webhookPayment.setId("payment-race");
            webhookPayment.setVersion(3L);
            webhookPayment.setUserId(payment.getUserId());
            webhookPayment.setSourceId(payment.getSourceId());
            webhookPayment.setProvider(payment.getProvider());
            webhookPayment.setStatus("authorized");
            webhookPayment.setAmount(payment.getAmount());
            webhookPayment.setCurrency(payment.getCurrency());
            webhookPayment.setCheckoutSessionId(payment.getCheckoutSessionId());
            webhookPayment.setGatewayAuthorizationId("pi-race");
            webhookPayment.setFulfillmentStatus("pending");
            webhookPayment.setFulfillmentKind(PaymentService.FULFILLMENT_KIND_EVENT_JOIN);
            webhookPayment.setBookingStatus("initiated");
            concurrentPayment.set(webhookPayment);
            throw new OptimisticLockingFailureException("webhook updated the payment");
        });

        PaymentService service = new PaymentService(
                List.of(stripe),
                repository,
                basketService,
                pricingService,
                paymentProviderResolver(),
                savedPaymentMethodsService,
                null);
        ReflectionTestUtils.setField(service, "enablePay", true);

        EventCheckoutSessionDto result = service.payCheckout(request, "stripe");

        assertThat(result.status()).isEqualTo("authorized");
        assertThat(concurrentPayment.get().getStatus()).isEqualTo("authorized");
        assertThat(concurrentPayment.get().getFulfillmentStatus()).isEqualTo("pending");
        verify(repository, times(2)).save(any(Payment.class));
        verify(basketService).updateBasketState(org.mockito.ArgumentMatchers.argThat(state ->
                "user-race".equals(state.userId())
                        && "event-race".equals(state.sourceId())
                        && "pay".equals(state.checkoutState())
                        && "pending".equals(state.resultState())
                        && state.checkoutSessionId() != null
                        && state.checkoutSessionId().startsWith("pay_")));
        verify(basketService, never()).saveBasket(any(EventCheckoutRequestDto.class));
    }

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
    void enabledPaymentModeUsesTheDeploymentSelectedProviderWhenCallerOmitsIt() {
        Map<String, Payment> paymentsBySession = new HashMap<>();
        PaymentsRepository repository = inMemoryRepository(paymentsBySession);
        RecordingPaymentProcessor stripe = new RecordingPaymentProcessor("stripe");
        RecordingPaymentProcessor barion = new RecordingPaymentProcessor("barion");
        DeploymentPaymentProviderResolver resolver =
                org.mockito.Mockito.mock(DeploymentPaymentProviderResolver.class);
        when(resolver.resolveActiveProvider(null)).thenReturn("barion");
        EventCheckoutPricingService pricingService =
                org.mockito.Mockito.mock(EventCheckoutPricingService.class);
        EventCheckoutRequestDto request =
                checkoutRequest("user-operator", "event-operator", 31.5d, "HUF");
        when(pricingService.reprice(request)).thenReturn(request);
        PaymentService service = new PaymentService(
                List.of(stripe, barion),
                repository,
                org.mockito.Mockito.mock(EventCheckoutBasketService.class),
                pricingService,
                resolver);
        ReflectionTestUtils.setField(service, "enablePay", true);

        EventCheckoutSessionDto checkout = service.checkout(request, null);

        assertThat(checkout.provider()).isEqualTo("barion");
        assertThat(barion.checkoutCalls()).isEqualTo(1);
        assertThat(stripe.checkoutCalls()).isZero();
        verify(resolver).resolveActiveProvider(null);
    }

    @Test
    void knownStartedAuthorizationKeepsItsProviderWhenDeploymentConfigurationChanges() {
        Map<String, Payment> paymentsBySession = new HashMap<>();
        PaymentsRepository repository = inMemoryRepository(paymentsBySession);
        Payment started = new Payment();
        started.setId("payment-started");
        started.setCheckoutSessionId("pay_started");
        started.setGatewaySessionId("pi_started");
        started.setGatewayActionUrl("/payment-wait/stripe/pay_started");
        started.setUserId("user-started");
        started.setSourceId("event-started");
        started.setPaymentMethodId("card-stripe");
        started.setProvider("stripe");
        started.setStatus("customer_action_required");
        started.setFulfillmentKind(PaymentService.FULFILLMENT_KIND_EVENT_JOIN);
        started.setFulfillmentStatus("pending");
        started.setBookingStatus("initiated");
        started.setAmount(31.5d);
        started.setCurrency("HUF");
        started.setOptionalSubEventIds(List.of("sub-event-1"));
        started.setCreatedDate(Instant.now().toString());
        savePayment(paymentsBySession, started);
        when(repository.findByUserIdAndSourceId("user-started", "event-started"))
                .thenReturn(List.of(started));

        DeploymentPaymentProviderResolver resolver =
                org.mockito.Mockito.mock(DeploymentPaymentProviderResolver.class);
        EventCheckoutPricingService pricingService =
                org.mockito.Mockito.mock(EventCheckoutPricingService.class);
        EventCheckoutRequestDto request = withPaymentMethod(
                checkoutRequest("user-started", "event-started", 31.5d, "HUF"),
                "card-stripe");
        when(pricingService.reprice(request)).thenReturn(request);
        PaymentService service = new PaymentService(
                List.of(new RecordingPaymentProcessor("stripe"), new RecordingPaymentProcessor("barion")),
                repository,
                org.mockito.Mockito.mock(EventCheckoutBasketService.class),
                pricingService,
                resolver);
        ReflectionTestUtils.setField(service, "enablePay", true);

        EventCheckoutSessionDto result = service.payCheckout(request, "stripe", "pay_started");

        assertThat(result.id()).isEqualTo("pay_started");
        assertThat(result.provider()).isEqualTo("stripe");
        assertThat(result.status()).isEqualTo("requires_action");
        verifyNoInteractions(resolver);
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
    void authoritativeQuoteReplacesForgedAmountsBeforeProcessorAndPersistsPromoAudit() {
        Map<String, Payment> paymentsBySession = new HashMap<>();
        PaymentsRepository repository = inMemoryRepository(paymentsBySession);
        RecordingPaymentProcessor stripe = new RecordingPaymentProcessor("stripe");
        EventCheckoutPricingService pricingService = org.mockito.Mockito.mock(EventCheckoutPricingService.class);
        EventCheckoutRequestDto forged = checkoutRequest("user-promo", "event-promo", 0.01d, "EUR");
        EventCheckoutRequestDto canonical = withAppliedPromoCodes(
                checkoutRequest("user-promo", "event-promo", 25d, "EUR"),
                List.of("SAVE10", "LESS5"));
        when(pricingService.reprice(forged)).thenReturn(canonical);

        PaymentService service = new PaymentService(
                List.of(stripe),
                repository,
                org.mockito.Mockito.mock(EventCheckoutBasketService.class),
                pricingService,
                paymentProviderResolver());
        ReflectionTestUtils.setField(service, "enablePay", true);

        EventCheckoutSessionDto checkout = service.checkout(forged, "stripe");

        assertThat(stripe.checkoutRequests()).singleElement().satisfies(request -> {
            assertThat(request.totalAmount()).isEqualTo(25d);
            assertThat(request.lineItems()).extracting(EventCheckoutLineItemDto::amount).containsExactly(25d);
            assertThat(request.appliedPromoCodes()).containsExactly("SAVE10", "LESS5");
        });
        Payment payment = paymentsBySession.get(checkout.id());
        assertThat(payment.getAmount()).isEqualTo(25d);
        assertThat(payment.getAppliedPromoCodes()).containsExactly("SAVE10", "LESS5");
        assertThat(payment.getBookingStatus()).isEqualTo("initiated");
    }

    @Test
    void legacyResourceCheckoutWithNoEventBasketRemainsUnchangedThroughPaymentService() {
        Map<String, Payment> paymentsBySession = new HashMap<>();
        PaymentsRepository repository = inMemoryRepository(paymentsBySession);
        RecordingPaymentProcessor stripe = new RecordingPaymentProcessor("stripe");
        ActivityEventsRepository eventsRepository = org.mockito.Mockito.mock(ActivityEventsRepository.class);
        when(eventsRepository.findBySourceId("asset-1")).thenReturn(List.of());
        EventCheckoutPricingService pricingService = new EventCheckoutPricingService(
                eventsRepository,
                org.mockito.Mockito.mock(TranslationService.class));
        PaymentService service = new PaymentService(
                List.of(stripe),
                repository,
                org.mockito.Mockito.mock(EventCheckoutBasketService.class),
                pricingService,
                paymentProviderResolver());
        ReflectionTestUtils.setField(service, "enablePay", true);
        EventCheckoutRequestDto resourceRequest = new EventCheckoutRequestDto(
                "user-resource",
                "asset-1",
                null,
                List.of(),
                List.of(),
                List.of(),
                List.of(),
                List.of(),
                "draft",
                List.of(new EventCheckoutLineItemDto(
                        "asset-ticket",
                        "resource",
                        "Kayak",
                        "One booking",
                        15d,
                        "EUR")),
                15d,
                "EUR",
                null,
                List.of());

        EventCheckoutSessionDto checkout = service.checkout(resourceRequest, "stripe");

        assertThat(stripe.checkoutRequests()).containsExactly(resourceRequest);
        assertThat(checkout.amount()).isEqualTo(15d);
        Payment payment = paymentsBySession.get(checkout.id());
        assertThat(payment.getSourceId()).isEqualTo("asset-1");
        assertThat(payment.getAmount()).isEqualTo(15d);
        assertThat(payment.getCurrency()).isEqualTo("EUR");
    }

    @Test
    void sessionBoundPaymentCannotTransitionBetweenPaidAndFreeCanonicalAmounts() {
        Map<String, Payment> paymentsBySession = new HashMap<>();
        PaymentsRepository repository = inMemoryRepository(paymentsBySession);
        RecordingPaymentProcessor stripe = new RecordingPaymentProcessor("stripe");
        PaymentService service = paymentService(repository, true, stripe);

        Payment paidSession = new Payment();
        paidSession.setCheckoutSessionId("checkout-paid");
        paidSession.setUserId("user-amount");
        paidSession.setSourceId("event-amount");
        paidSession.setAmount(25d);
        paidSession.setCurrency("EUR");
        savePayment(paymentsBySession, paidSession);

        assertThatThrownBy(() -> service.pay(
                checkoutRequest("user-amount", "event-amount", 0d, "EUR"),
                "checkout-paid",
                "stripe"))
                .isInstanceOfSatisfying(ResponseStatusException.class,
                        exception -> assertThat(exception.getStatusCode())
                                .isEqualTo(org.springframework.http.HttpStatus.CONFLICT));

        Payment freeSession = new Payment();
        freeSession.setCheckoutSessionId("checkout-free");
        freeSession.setUserId("user-amount");
        freeSession.setSourceId("event-amount");
        freeSession.setAmount(0d);
        freeSession.setCurrency("EUR");
        savePayment(paymentsBySession, freeSession);

        assertThatThrownBy(() -> service.pay(
                checkoutRequest("user-amount", "event-amount", 25d, "EUR"),
                "checkout-free",
                "stripe"))
                .isInstanceOfSatisfying(ResponseStatusException.class,
                        exception -> assertThat(exception.getStatusCode())
                                .isEqualTo(org.springframework.http.HttpStatus.CONFLICT));
        assertThat(stripe.payCalls()).isZero();
    }

    @Test
    void paymentAuditUsesTheExactPersistedSessionAmountAndRejectsMismatchedScope() {
        Map<String, Payment> paymentsBySession = new HashMap<>();
        PaymentsRepository repository = inMemoryRepository(paymentsBySession);
        PaymentService service = paymentService(repository, false, new RecordingPaymentProcessor("stripe"));
        Payment payment = new Payment();
        payment.setId("payment-audit-1");
        payment.setCheckoutSessionId("checkout-audit-1");
        payment.setUserId("borrower-1");
        payment.setSourceId("asset-1");
        payment.setProvider("dummy");
        payment.setStatus("approved");
        payment.setBookingStatus("joined");
        payment.setAmount(12d);
        payment.setCurrency("USD");
        payment.setLineItems(List.of(new EventCheckoutLineItemDto(
                "asset-line",
                "resource",
                "Evening Transfer Sedan",
                "Mar 23, 12:00 AM - 12:45 AM",
                12d,
                "USD")));
        savePayment(paymentsBySession, payment);

        var audit = service.loadPaymentAudit("borrower-1", "asset-1", "checkout-audit-1");

        assertThat(audit).isNotNull();
        assertThat(audit.amount()).isEqualTo(12d);
        assertThat(audit.status()).isEqualTo("approved");
        assertThat(audit.bookingStatus()).isEqualTo("joined");
        assertThat(audit.lineItems()).singleElement().satisfies(line -> {
            assertThat(line.label()).isEqualTo("Evening Transfer Sedan");
            assertThat(line.amount()).isEqualTo(12d);
        });
        assertThat(service.loadPaymentAudit("another-user", "asset-1", "checkout-audit-1")).isNull();
        assertThat(service.loadPaymentAudit("borrower-1", "another-asset", "checkout-audit-1")).isNull();
    }

    @Test
    void assetQuantityPriceChangesAppendImmutableRevisionsAndLatestRevisionWins() {
        Map<String, Payment> paymentsBySession = new HashMap<>();
        PaymentsRepository repository = inMemoryRepository(paymentsBySession);
        PaymentService service = paymentService(repository, false, new RecordingPaymentProcessor("stripe"));
        Payment original = new Payment();
        original.setId("payment-original");
        original.setCheckoutSessionId("checkout-root");
        original.setUserId("borrower-1");
        original.setSourceId("asset-1");
        original.setProvider("dummy");
        original.setStatus("approved");
        original.setBookingStatus("joined");
        original.setAmount(12d);
        original.setCurrency("USD");
        original.setAuditKind("payment");
        original.setRevisionNumber(0);
        original.setBookingQuantity(1);
        savePayment(paymentsBySession, original);

        var firstRevision = service.recordAssetBookingPriceRevision(
                "checkout-root",
                "borrower-1",
                "asset-1",
                "Evening Transfer Sedan",
                "Mar 23, 12:00 AM - 12:45 AM",
                1,
                2,
                12d,
                24d,
                "USD");
        var secondRevision = service.recordAssetBookingPriceRevision(
                "checkout-root",
                "borrower-1",
                "asset-1",
                "Evening Transfer Sedan",
                "Mar 23, 12:00 AM - 12:45 AM",
                2,
                3,
                24d,
                36d,
                "USD");
        var latest = service.loadPaymentAudit("borrower-1", "asset-1", "checkout-root");

        assertThat(original.getAmount()).isEqualTo(12d);
        assertThat(firstRevision.amount()).isEqualTo(24d);
        assertThat(firstRevision.adjustmentAmount()).isEqualTo(12d);
        assertThat(firstRevision.revisionNumber()).isEqualTo(1);
        assertThat(secondRevision.amount()).isEqualTo(36d);
        assertThat(secondRevision.revisionNumber()).isEqualTo(2);
        assertThat(latest.amount()).isEqualTo(36d);
        assertThat(latest.bookingQuantity()).isEqualTo(3);
        assertThat(latest.auditKind()).isEqualTo("booking_price_revision");
        assertThat(latest.pricingSummaryRows()).extracting(row -> row.amount())
                .containsExactly(24d, 12d);
    }

    @Test
    void assetQuantityRevisionUsesThePreviouslyCommittedBookingTotalWhenTheOldAuditIsStale() {
        Map<String, Payment> paymentsBySession = new HashMap<>();
        PaymentsRepository repository = inMemoryRepository(paymentsBySession);
        PaymentService service = paymentService(repository, false, new RecordingPaymentProcessor("stripe"));
        Payment original = new Payment();
        original.setId("payment-original");
        original.setCheckoutSessionId("checkout-root");
        original.setUserId("borrower-1");
        original.setSourceId("asset-1");
        original.setProvider("dummy");
        original.setStatus("approved");
        original.setBookingStatus("joined");
        original.setAmount(12d);
        original.setCurrency("USD");
        savePayment(paymentsBySession, original);

        var revision = service.recordAssetBookingPriceRevision(
                "checkout-root",
                "borrower-1",
                "asset-1",
                "Evening Transfer Sedan",
                "Mar 23, 12:00 AM - 12:45 AM",
                2,
                3,
                24d,
                36d,
                "USD");

        assertThat(original.getAmount()).isEqualTo(12d);
        assertThat(revision.amount()).isEqualTo(36d);
        assertThat(revision.adjustmentAmount()).isEqualTo(12d);
        assertThat(revision.bookingQuantity()).isEqualTo(3);
        assertThat(revision.pricingSummaryRows()).extracting(row -> row.amount())
                .containsExactly(24d, 12d);
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

    @Test
    void cancelAuthorizedBookingKeepsTheGatewayAuthorizationForDurableReleaseInsteadOfInventingARefund() {
        Map<String, Payment> paymentsBySession = new HashMap<>();
        PaymentsRepository repository = inMemoryRepository(paymentsBySession);
        PaymentService service = paymentService(repository, true, new RecordingPaymentProcessor("stripe"));
        Payment payment = joinedPayment(
                "checkout-authorized",
                "gateway-authorized",
                "user-authorized",
                "event-authorized",
                Instant.now().plus(Duration.ofDays(3)).toString(),
                new PricingCancellationPolicyDto(true, List.of(
                        new PricingCancellationRuleDto("full-7d", "days", 7, "full", 100d))));
        payment.setStatus("authorized");
        savePayment(paymentsBySession, payment);
        when(repository.findByUserIdAndSourceId("user-authorized", "event-authorized"))
                .thenReturn(List.of(payment));

        service.cancelEventBooking("user-authorized", "event-authorized", null, null);

        assertThat(payment.getBookingStatus()).isEqualTo("cancelled");
        assertThat(payment.getStatus()).isEqualTo("authorized");
        assertThat(payment.getRefundStatus()).isEqualTo("none");
        assertThat(payment.getRefundedAmount()).isNull();
        assertThat(payment.getRefundedAtIso()).isNull();
        assertThat(payment.getRefundNote()).isEqualTo("Authorization release pending.");
    }

    @Test
    void pendingEventJoinStatesAreResolvedByOneBatchRead() {
        PaymentsRepository repository = org.mockito.Mockito.mock(PaymentsRepository.class);
        Payment pending = new Payment();
        pending.setUserId("user-1");
        pending.setSourceId("event-1");
        pending.setBookingStatus("initiated");
        pending.setCreatedDate("2026-07-23T10:00:00Z");
        Payment joined = new Payment();
        joined.setUserId("user-1");
        joined.setSourceId("event-2");
        joined.setBookingStatus("joined");
        joined.setJoinedAtIso("2026-07-23T11:00:00Z");
        when(repository.findByUserIdAndSourceIdIn(
                "user-1",
                List.of("event-1", "event-2")))
                .thenReturn(List.of(pending, joined));
        PaymentService service =
                paymentService(repository, false, new RecordingPaymentProcessor("stripe"));

        Set<String> result = service.findPendingEventJoinSourceIds(
                " user-1 ",
                List.of(" event-1 ", "event-2", "event-1"));

        assertThat(result).containsExactly("event-1");
        verify(repository).findByUserIdAndSourceIdIn(
                "user-1",
                List.of("event-1", "event-2"));
        verify(repository, never()).findByUserIdAndSourceId(anyString(), anyString());
    }

    @Test
    void terminalMembershipAcceptanceFinalizesTheLatestPendingEventPaymentOnce() {
        PaymentsRepository repository = org.mockito.Mockito.mock(PaymentsRepository.class);
        Payment payment = new Payment();
        payment.setUserId("user-1");
        payment.setSourceId("event-1");
        payment.setBookingStatus("initiated");
        payment.setCreatedDate("2026-08-12T18:00:00Z");
        when(repository.findByUserIdAndSourceId("user-1", "event-1"))
                .thenReturn(List.of(payment));
        when(repository.save(any(Payment.class)))
                .thenAnswer(invocation -> invocation.getArgument(0, Payment.class));
        PaymentService service =
                paymentService(repository, false, new RecordingPaymentProcessor("stripe"));

        assertThat(service.finalizePendingEventJoin(" user-1 ", " event-1 ")).isTrue();
        assertThat(service.finalizePendingEventJoin("user-1", "event-1")).isFalse();

        assertThat(payment.getBookingStatus()).isEqualTo("joined");
        assertThat(payment.getJoinedAtIso()).isNotBlank();
        assertThat(payment.getRefundStatus()).isEqualTo("none");
        verify(repository).save(payment);
    }

    @Test
    void authorizedPaymentIsIncludedInAccountedSpendingBeforeDelayedCapture() {
        PaymentsRepository repository = org.mockito.Mockito.mock(PaymentsRepository.class);
        Payment payment = new Payment();
        payment.setAuditKind("payment");
        payment.setStatus("authorized");
        payment.setAmount(3200D);
        PaymentService service =
                paymentService(repository, true, new RecordingPaymentProcessor("barion"));

        Double accounted = ReflectionTestUtils.invokeMethod(service, "accountedSpentAmount", payment);

        assertThat(accounted).isEqualTo(3200D);
    }

    @Test
    void paidAssetTakeOverAuthorizesSuccessorBeforeReleasingAndRefundingPredecessor() {
        Map<String, Payment> paymentsBySession = new HashMap<>();
        PaymentsRepository repository = inMemoryRepository(paymentsBySession);
        RecordingPaymentProcessor barion = new RecordingPaymentProcessor("barion");
        PaymentService service = paymentService(repository, true, barion);

        Payment predecessor = new Payment();
        predecessor.setId("old-payment");
        predecessor.setCheckoutSessionId("old-session");
        predecessor.setGatewaySessionId("old-gateway");
        predecessor.setGatewayAuthorizationId("old-authorization");
        predecessor.setUserId("old-manager");
        predecessor.setRecipientUserId("asset-owner");
        predecessor.setSourceId("asset-1");
        predecessor.setContextEventId("event-1");
        predecessor.setContextSubEventId("subevent-1");
        predecessor.setProvider("barion");
        predecessor.setStatus("authorized");
        predecessor.setBookingStatus("joined");
        predecessor.setRefundStatus("none");
        predecessor.setAmount(3200d);
        predecessor.setAccountedSpentAmount(3200d);
        predecessor.setCurrency("HUF");
        savePayment(paymentsBySession, predecessor);

        Payment successor = new Payment();
        successor.setId("new-payment");
        successor.setCheckoutSessionId("new-session");
        successor.setGatewaySessionId("new-gateway");
        successor.setGatewayAuthorizationId("new-authorization");
        successor.setUserId("new-manager");
        successor.setRecipientUserId("asset-owner");
        successor.setSourceId("asset-1");
        successor.setProvider("barion");
        successor.setStatus("authorized");
        successor.setBookingStatus("initiated");
        successor.setRefundStatus("none");
        successor.setAmount(3200d);
        successor.setAccountedSpentAmount(3200d);
        successor.setCurrency("HUF");
        savePayment(paymentsBySession, successor);

        PaymentService.AssetPaymentReplacement replacement = service.validateAssetPaymentReplacement(
                "old-session",
                "new-session",
                "old-manager",
                "new-manager",
                "asset-1",
                "event-1",
                "subevent-1");
        service.completeAssetPaymentReplacement(replacement, "new-manager", "event-1", "subevent-1");

        assertThat(successor.getPredecessorPaymentId()).isEqualTo("old-payment");
        assertThat(successor.getBookingStatus()).isEqualTo("joined");
        assertThat(successor.getContextEventId()).isEqualTo("event-1");
        assertThat(successor.getContextSubEventId()).isEqualTo("subevent-1");
        assertThat(predecessor.getSuccessorPaymentId()).isEqualTo("new-payment");
        assertThat(predecessor.getStatus()).isEqualTo("released");
        assertThat(predecessor.getRefundStatus()).isEqualTo("full");
        assertThat(predecessor.getRefundedAmount()).isEqualTo(3200d);
        assertThat(predecessor.getRefundRequestStatus()).isEqualTo("approved");
        assertThat(predecessor.getRefundReviewedByUserId()).isEqualTo("new-manager");
        assertThat(barion.releaseCalls()).isEqualTo(1);
    }

    @Test
    void approvedPolicyRefundExecutesARealProviderRefundAfterCapture() {
        Map<String, Payment> paymentsBySession = new HashMap<>();
        PaymentsRepository repository = inMemoryRepository(paymentsBySession);
        RecordingPaymentProcessor stripe = new RecordingPaymentProcessor("stripe");
        PaymentService service = paymentService(repository, true, stripe);
        Payment payment = new Payment();
        payment.setId("captured-payment");
        payment.setCheckoutSessionId("captured-session");
        payment.setGatewayAuthorizationId("pi_captured");
        payment.setUserId("payer");
        payment.setRecipientUserId("recipient");
        payment.setSourceId("asset-1");
        payment.setProvider("stripe");
        payment.setStatus("captured");
        payment.setAmount(3200d);
        payment.setCurrency("HUF");
        payment.setAuditKind("payment");
        payment.setAccountedSpentAmount(3200d);
        savePayment(paymentsBySession, payment);

        service.approvePolicyRefund(
                payment,
                Instant.now().toString(),
                1600d,
                "HUF",
                "refund-50-percent",
                "50% refund");

        assertThat(stripe.refundCalls()).isEqualTo(1);
        assertThat(payment.getGatewayRefundId()).isEqualTo("stripe_refund_1");
        assertThat(payment.getGatewayRefundStatus()).isEqualTo("succeeded");
        assertThat(payment.getStatus()).isEqualTo("partially_refunded");
        assertThat(payment.getRefundedAmount()).isEqualTo(1600d);
    }

    private PaymentService paymentService(PaymentsRepository repository, boolean enablePay, PaymentProcessor... processors) {
        EventCheckoutPricingService pricingService = org.mockito.Mockito.mock(EventCheckoutPricingService.class);
        when(pricingService.reprice(any(EventCheckoutRequestDto.class))).thenAnswer(invocation -> invocation.getArgument(0));
        PaymentService service = new PaymentService(
                List.of(processors),
                repository,
                org.mockito.Mockito.mock(EventCheckoutBasketService.class),
                pricingService,
                paymentProviderResolver());
        ReflectionTestUtils.setField(service, "enablePay", enablePay);
        return service;
    }

    private DeploymentPaymentProviderResolver paymentProviderResolver() {
        DeploymentPaymentProviderResolver resolver =
                org.mockito.Mockito.mock(DeploymentPaymentProviderResolver.class);
        when(resolver.resolveActiveProvider(anyString()))
                .thenAnswer(invocation -> invocation.getArgument(0, String.class));
        return resolver;
    }

    private PaymentsRepository inMemoryRepository(Map<String, Payment> paymentsBySession) {
        PaymentsRepository repository = org.mockito.Mockito.mock(PaymentsRepository.class);
        when(repository.findByGatewaySessionId(anyString())).thenAnswer(invocation ->
                Optional.ofNullable(paymentsBySession.get(invocation.getArgument(0, String.class))));
        when(repository.findByCheckoutSessionId(anyString())).thenAnswer(invocation ->
                Optional.ofNullable(paymentsBySession.get(invocation.getArgument(0, String.class))));
        when(repository.findById(anyString())).thenAnswer(invocation ->
                Optional.ofNullable(paymentsBySession.get(invocation.getArgument(0, String.class))));
        when(repository.findByRevisionRootSessionId(anyString())).thenAnswer(invocation -> {
            String rootSessionId = invocation.getArgument(0, String.class);
            return paymentsBySession.values().stream()
                    .distinct()
                    .filter(payment -> rootSessionId.equals(payment.getRevisionRootSessionId()))
                    .toList();
        });
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

    private EventCheckoutRequestDto withAppliedPromoCodes(
            EventCheckoutRequestDto request,
            List<String> appliedPromoCodes) {
        return new EventCheckoutRequestDto(
                request.userId(),
                request.sourceId(),
                request.slotSourceId(),
                request.optionalSubEventIds(),
                request.assetSelections(),
                request.acceptedPolicyIds(),
                request.basketItems(),
                request.pricingSummaryRows(),
                request.checkoutState(),
                request.lineItems(),
                request.totalAmount(),
                request.currency(),
                request.pendingReason(),
                appliedPromoCodes);
    }

    private EventCheckoutRequestDto withPaymentMethod(
            EventCheckoutRequestDto request,
            String paymentMethodId) {
        return new EventCheckoutRequestDto(
                request.userId(),
                request.sourceId(),
                request.slotSourceId(),
                request.optionalSubEventIds(),
                request.assetSelections(),
                request.acceptedPolicyIds(),
                request.basketItems(),
                request.pricingSummaryRows(),
                request.checkoutState(),
                request.lineItems(),
                request.totalAmount(),
                request.currency(),
                request.pendingReason(),
                request.appliedPromoCodes(),
                paymentMethodId);
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
        private final AtomicInteger releaseCalls = new AtomicInteger();
        private final AtomicInteger refundCalls = new AtomicInteger();
        private final List<String> paySessionIds = new java.util.ArrayList<>();
        private final List<EventCheckoutRequestDto> checkoutRequests = new java.util.ArrayList<>();

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
            checkoutRequests.add(request);
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

        @Override
        public AuthorizationResult releaseAuthorization(
                String gatewayAuthorizationId,
                String idempotencyKey) {
            releaseCalls.incrementAndGet();
            return new AuthorizationResult(
                    type,
                    type + "_released_" + releaseCalls.get(),
                    gatewayAuthorizationId,
                    PaymentGateway.AuthorizationStatus.RELEASED,
                    java.math.BigDecimal.ZERO,
                    "HUF",
                    null,
                    null,
                    idempotencyKey);
        }

        @Override
        public PaymentGateway.RefundResult refundCapturedPayment(
                String gatewayAuthorizationId,
                java.math.BigDecimal amount,
                String currency,
                String idempotencyKey) {
            int call = refundCalls.incrementAndGet();
            return new PaymentGateway.RefundResult(
                    type,
                    gatewayAuthorizationId,
                    type + "_refund_" + call,
                    PaymentGateway.RefundStatus.SUCCEEDED,
                    amount,
                    currency,
                    "succeeded");
        }

        int checkoutCalls() {
            return checkoutCalls.get();
        }

        int payCalls() {
            return payCalls.get();
        }

        int releaseCalls() {
            return releaseCalls.get();
        }

        int refundCalls() {
            return refundCalls.get();
        }

        List<String> paySessionIds() {
            return List.copyOf(paySessionIds);
        }

        List<EventCheckoutRequestDto> checkoutRequests() {
            return List.copyOf(checkoutRequests);
        }
    }
}

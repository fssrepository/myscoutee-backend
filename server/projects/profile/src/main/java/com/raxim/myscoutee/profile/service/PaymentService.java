package com.raxim.myscoutee.profile.service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.time.format.DateTimeParseException;
import java.util.Collection;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.UUID;
import java.math.BigDecimal;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.OptimisticLockingFailureException;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;

import com.raxim.myscoutee.profile.data.document.Payment;
import com.raxim.myscoutee.profile.data.document.SavedPaymentMethod;
import com.raxim.myscoutee.profile.data.document.Users;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventCheckoutBasketItemDto;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventCheckoutPaymentAuditDto;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventCheckoutRequestDto;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventCheckoutSessionDto;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventCheckoutStateChangeRequestDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.PricingCancellationPolicyDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.PricingCancellationRuleDto;
import com.raxim.myscoutee.profile.repository.ActivityEventsRepository;
import com.raxim.myscoutee.profile.repository.AssetsRepository;
import com.raxim.myscoutee.profile.repository.PaymentsRepository;
import com.raxim.myscoutee.profile.service.operator.DeploymentPaymentProviderResolver;
import com.raxim.myscoutee.profile.service.PaymentGateway.AuthorizationResult;
import com.raxim.myscoutee.profile.service.PaymentGateway.AuthorizationStatus;
import com.raxim.myscoutee.profile.service.PaymentGateway.RefundResult;
import com.raxim.myscoutee.profile.service.PaymentGateway.RefundStatus;

@Service
public class PaymentService {
    private static final String BOOKING_STATUS_INITIATED = "initiated";
    private static final String BOOKING_STATUS_JOINED = "joined";
    private static final String BOOKING_STATUS_CANCELLED = "cancelled";
    private static final String REFUND_STATUS_NONE = "none";
    private static final String REFUND_STATUS_NOT_ELIGIBLE = "not_eligible";
    private static final String REFUND_STATUS_PARTIAL = "partial";
    private static final String REFUND_STATUS_FULL = "full";
    private static final String AUDIT_KIND_PAYMENT = "payment";
    private static final String AUDIT_KIND_REFUND = "refund";
    private static final String AUDIT_KIND_BOOKING_PRICE_REVISION = "booking_price_revision";
    private static final String FULFILLMENT_PENDING = "pending";
    private static final String FULFILLMENT_SUCCEEDED = "succeeded";
    private static final String FULFILLMENT_FAILED = "failed";
    public static final String FULFILLMENT_KIND_EVENT_JOIN = "event_join";
    public static final String FULFILLMENT_KIND_CLIENT = "client";

    private final Map<String, PaymentProcessor> processors;
    private final PaymentsRepository paymentsRepository;
    private final EventCheckoutBasketService eventCheckoutBasketService;
    private final EventCheckoutPricingService eventCheckoutPricingService;
    private final DeploymentPaymentProviderResolver paymentProviderResolver;
    private final SavedPaymentMethodsService savedPaymentMethodsService;
    private final MongoTemplate mongoTemplate;
    private final ActivityEventsRepository activityEventsRepository;
    private final AssetsRepository assetsRepository;

    @Value("${payment.enablePay:false}")
    private boolean enablePay;

    @Autowired
    public PaymentService(
            List<PaymentProcessor> processorList,
            PaymentsRepository paymentsRepository,
            EventCheckoutBasketService eventCheckoutBasketService,
            EventCheckoutPricingService eventCheckoutPricingService,
            DeploymentPaymentProviderResolver paymentProviderResolver,
            SavedPaymentMethodsService savedPaymentMethodsService,
            MongoTemplate mongoTemplate,
            ActivityEventsRepository activityEventsRepository,
            AssetsRepository assetsRepository) {
        this.processors = processorList.stream()
                .collect(Collectors.toMap(PaymentProcessor::getType, p -> p));
        this.paymentsRepository = paymentsRepository;
        this.eventCheckoutBasketService = eventCheckoutBasketService;
        this.eventCheckoutPricingService = eventCheckoutPricingService;
        this.paymentProviderResolver = paymentProviderResolver;
        this.savedPaymentMethodsService = savedPaymentMethodsService;
        this.mongoTemplate = mongoTemplate;
        this.activityEventsRepository = activityEventsRepository;
        this.assetsRepository = assetsRepository;
    }

    PaymentService(
            List<PaymentProcessor> processorList,
            PaymentsRepository paymentsRepository,
            EventCheckoutBasketService eventCheckoutBasketService,
            EventCheckoutPricingService eventCheckoutPricingService,
            DeploymentPaymentProviderResolver paymentProviderResolver,
            SavedPaymentMethodsService savedPaymentMethodsService,
            MongoTemplate mongoTemplate) {
        this(
                processorList,
                paymentsRepository,
                eventCheckoutBasketService,
                eventCheckoutPricingService,
                paymentProviderResolver,
                savedPaymentMethodsService,
                mongoTemplate,
                null,
                null);
    }

    PaymentService(
            List<PaymentProcessor> processorList,
            PaymentsRepository paymentsRepository,
            EventCheckoutBasketService eventCheckoutBasketService,
            EventCheckoutPricingService eventCheckoutPricingService,
            DeploymentPaymentProviderResolver paymentProviderResolver) {
        this(
                processorList,
                paymentsRepository,
                eventCheckoutBasketService,
                eventCheckoutPricingService,
                paymentProviderResolver,
                null,
                null,
                null,
                null);
    }

    public EventCheckoutSessionDto checkout(EventCheckoutRequestDto request, String provider) {
        EventCheckoutRequestDto authoritativeRequest = eventCheckoutPricingService.reprice(request);
        String normalizedProvider = resolveConfiguredProvider(provider);
        EventCheckoutSessionDto sessionDto = !enablePay
                ? createDummySession(authoritativeRequest, null)
                : resolveProcessor(normalizedProvider).checkout(authoritativeRequest);

        Payment payment = findByAnySessionId(sessionDto.id()).orElseGet(Payment::new);
        ensurePaymentRequestCompatible(payment, authoritativeRequest);
        hydratePaymentRequest(payment, authoritativeRequest, normalizedProvider);
        payment.setCheckoutSessionId(sessionDto.id());
        if (!enablePay) {
            payment.setGatewaySessionId(sessionDto.id());
        }
        payment.setStatus(safeText(sessionDto.status()));
        payment.setBookingStatus(hasText(payment.getBookingStatus()) ? payment.getBookingStatus() : BOOKING_STATUS_INITIATED);
        payment.setRefundStatus(hasText(payment.getRefundStatus()) ? payment.getRefundStatus() : REFUND_STATUS_NONE);
        payment.setCreatedDate(hasText(payment.getCreatedDate()) ? payment.getCreatedDate() : nowIso());
        saveAndProjectSpending(payment);
        eventCheckoutBasketService.saveBasket(withCheckoutState(authoritativeRequest, "confirmed", sessionDto.id()));
        return sessionDto;
    }

    public EventCheckoutSessionDto pay(EventCheckoutRequestDto request, String paymentSessionId, String provider) {
        String normalizedProvider = resolveConfiguredProvider(provider);
        Payment payment = findByAnySessionId(paymentSessionId).orElseGet(Payment::new);
        EventCheckoutRequestDto authoritativeRequest = eventCheckoutPricingService.reprice(request);
        ensurePaymentRequestCompatible(payment, authoritativeRequest);
        EventCheckoutSessionDto sessionDto = !enablePay
                ? createDummySession(authoritativeRequest, paymentSessionId)
                : resolveProcessor(normalizedProvider).pay(authoritativeRequest, paymentSessionId);

        hydratePaymentRequest(payment, authoritativeRequest, normalizedProvider);
        payment.setCheckoutSessionId(hasText(payment.getCheckoutSessionId()) ? payment.getCheckoutSessionId() : normalizeId(paymentSessionId));
        payment.setGatewaySessionId(normalizeId(sessionDto.id()));
        payment.setStatus(safeText(sessionDto.status()));
        payment.setBookingStatus(hasText(payment.getBookingStatus()) ? payment.getBookingStatus() : BOOKING_STATUS_INITIATED);
        payment.setRefundStatus(hasText(payment.getRefundStatus()) ? payment.getRefundStatus() : REFUND_STATUS_NONE);
        payment.setCreatedDate(hasText(payment.getCreatedDate()) ? payment.getCreatedDate() : nowIso());
        saveAndProjectSpending(payment);
        eventCheckoutBasketService.saveBasket(withCheckoutState(authoritativeRequest, "pay", payment.getCheckoutSessionId()));
        return sessionDto;
    }

    public EventCheckoutSessionDto payCheckout(EventCheckoutRequestDto request, String provider) {
        return payCheckout(request, provider, null, FULFILLMENT_KIND_EVENT_JOIN);
    }

    public EventCheckoutSessionDto payCheckout(
            EventCheckoutRequestDto request,
            String provider,
            String startedPaymentSessionId) {
        return payCheckout(request, provider, startedPaymentSessionId, FULFILLMENT_KIND_EVENT_JOIN);
    }

    public EventCheckoutSessionDto authorizeClientCheckout(EventCheckoutRequestDto request, String provider) {
        return payCheckout(request, provider, null, FULFILLMENT_KIND_CLIENT);
    }

    private EventCheckoutSessionDto payCheckout(
            EventCheckoutRequestDto request,
            String provider,
            String startedPaymentSessionId,
            String fulfillmentKind) {
        EventCheckoutRequestDto authoritativeRequest = eventCheckoutPricingService.reprice(request);
        Optional<Payment> startedPayment = findReusableAuthorization(
                authoritativeRequest,
                null,
                fulfillmentKind).filter(payment -> paymentSessionMatches(payment, startedPaymentSessionId));
        if (startedPayment.isPresent()) {
            Payment payment = startedPayment.get();
            eventCheckoutBasketService.saveBasket(withCheckoutState(
                    authoritativeRequest,
                    "pay",
                    payment.getCheckoutSessionId()));
            return toCheckoutSession(payment);
        }
        String normalizedProvider = resolveConfiguredProvider(provider);
        SavedPaymentMethod selectedPaymentMethod = validateSelectedPaymentMethod(authoritativeRequest, normalizedProvider);
        if (!enablePay) {
            EventCheckoutSessionDto sessionDto = createDummySession(authoritativeRequest, null);
            Payment payment = findByAnySessionId(sessionDto.id()).orElseGet(Payment::new);
            ensurePaymentRequestCompatible(payment, authoritativeRequest);
            hydratePaymentRequest(payment, authoritativeRequest, normalizedProvider);
            payment.setFulfillmentKind(fulfillmentKind);
            String sessionId = normalizeId(sessionDto.id());
            payment.setCheckoutSessionId(hasText(payment.getCheckoutSessionId()) ? payment.getCheckoutSessionId() : sessionId);
            payment.setGatewaySessionId(sessionId);
            payment.setStatus(safeText(sessionDto.status()));
            payment.setFulfillmentStatus(FULFILLMENT_SUCCEEDED);
            payment.setBookingStatus(hasText(payment.getBookingStatus()) ? payment.getBookingStatus() : BOOKING_STATUS_INITIATED);
            payment.setRefundStatus(hasText(payment.getRefundStatus()) ? payment.getRefundStatus() : REFUND_STATUS_NONE);
            payment.setCreatedDate(hasText(payment.getCreatedDate()) ? payment.getCreatedDate() : nowIso());
            saveAndProjectSpending(payment);
            eventCheckoutBasketService.saveBasket(withCheckoutState(authoritativeRequest, "pay", payment.getCheckoutSessionId()));
            return sessionDto;
        }

        Optional<Payment> reusable = findReusableAuthorization(authoritativeRequest, normalizedProvider, fulfillmentKind);
        if (reusable.isPresent()) {
            Payment payment = reusable.get();
            eventCheckoutBasketService.saveBasket(withCheckoutState(authoritativeRequest, "pay", payment.getCheckoutSessionId()));
            return toCheckoutSession(payment);
        }

        Payment payment = new Payment();
        hydratePaymentRequest(payment, authoritativeRequest, normalizedProvider);
        payment.setFulfillmentKind(fulfillmentKind);
        payment.setCheckoutSessionId("pay_" + UUID.randomUUID());
        payment.setStatus(statusValue(AuthorizationStatus.AUTHORIZATION_PENDING));
        payment.setFulfillmentStatus(FULFILLMENT_PENDING);
        payment.setBookingStatus(BOOKING_STATUS_INITIATED);
        payment.setRefundStatus(REFUND_STATUS_NONE);
        payment.setCreatedDate(nowIso());
        payment = saveAndProjectSpending(payment);

        try {
            eventCheckoutBasketService.updateBasketState(new EventCheckoutStateChangeRequestDto(
                    authoritativeRequest.userId(),
                    authoritativeRequest.sourceId(),
                    authoritativeRequest.slotSourceId(),
                    "pay",
                    FULFILLMENT_PENDING,
                    null,
                    payment.getCheckoutSessionId()));
            AuthorizationResult authorization = resolveProcessor(normalizedProvider)
                    .prepareAuthorization(
                            authoritativeRequest,
                            payment.getCheckoutSessionId(),
                            selectedPaymentMethod.getProviderPaymentMethodRef());
            payment = applyGatewayAuthorization(
                    payment.getCheckoutSessionId(),
                    authorization,
                    null).payment();
            return toCheckoutSession(payment);
        } catch (OptimisticLockingFailureException conflict) {
            throw conflict;
        } catch (RuntimeException exception) {
            payment.setStatus(statusValue(AuthorizationStatus.FAILED));
            payment.setFailedAtIso(nowIso());
            payment.setFulfillmentStatus(FULFILLMENT_FAILED);
            payment.setLastGatewayError(safeGatewayError(exception));
            saveAndProjectSpending(payment);
            throw exception;
        }
    }

    public GatewayTransition applyGatewayAuthorization(
            String internalPaymentSessionId,
            AuthorizationResult authorization,
            String gatewayEventId) {
        String normalizedEventId = normalizeId(gatewayEventId);
        OptimisticLockingFailureException lastConflict = null;
        for (int attempt = 0; attempt < 3; attempt += 1) {
            Payment payment = findGatewayPayment(internalPaymentSessionId, authorization)
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.NOT_FOUND,
                            "Payment session for the gateway event was not found."));
            validateGatewayResult(payment, authorization);
            if (hasText(normalizedEventId) && payment.getProcessedGatewayEventIds().contains(normalizedEventId)) {
                return new GatewayTransition(payment, false, true);
            }
            if (!hasText(normalizedEventId) && gatewayResultAlreadyApplied(payment, authorization)) {
                return new GatewayTransition(payment, false, true);
            }
            String previousStatus = safeText(payment.getStatus());
            if (!isAllowedGatewayTransition(previousStatus, authorization.status())) {
                return new GatewayTransition(payment, false, true);
            }
            applyGatewayResult(payment, authorization);
            if (hasText(normalizedEventId)) {
                List<String> eventIds = new java.util.ArrayList<>(payment.getProcessedGatewayEventIds());
                eventIds.add(normalizedEventId);
                payment.setProcessedGatewayEventIds(eventIds.size() <= 100
                        ? eventIds
                        : eventIds.subList(eventIds.size() - 100, eventIds.size()));
            }
            try {
                Payment saved = saveAndProjectSpending(payment);
                boolean newlyAuthorized = authorization.status() == AuthorizationStatus.AUTHORIZED
                        && !statusValue(AuthorizationStatus.AUTHORIZED).equals(previousStatus);
                return new GatewayTransition(saved, newlyAuthorized, false);
            } catch (OptimisticLockingFailureException conflict) {
                lastConflict = conflict;
            }
        }
        throw lastConflict;
    }

    private boolean gatewayResultAlreadyApplied(Payment payment, AuthorizationResult authorization) {
        String expectedStatus = statusValue(authorization.status());
        String currentStatus = safeText(payment.getStatus());
        boolean compatibleStatus = expectedStatus.equals(currentStatus)
                || (AuthorizationStatus.AUTHORIZED == authorization.status()
                        && "captured".equals(currentStatus));
        String expectedAuthorizationId = normalizeId(authorization.gatewayAuthorizationId());
        String expectedGatewaySessionId = normalizeId(authorization.gatewayCheckoutId());
        boolean sameAuthorization = hasText(expectedAuthorizationId)
                ? expectedAuthorizationId.equals(normalizeId(payment.getGatewayAuthorizationId()))
                : hasText(expectedGatewaySessionId)
                        && expectedGatewaySessionId.equals(normalizeId(payment.getGatewaySessionId()));
        return compatibleStatus && sameAuthorization;
    }

    public Payment markGatewayFulfillment(String paymentId, boolean succeeded, String failureReason) {
        Payment payment = paymentsRepository.findById(normalizeId(paymentId))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Payment was not found."));
        payment.setFulfillmentStatus(succeeded ? FULFILLMENT_SUCCEEDED : FULFILLMENT_FAILED);
        payment.setLastGatewayError(succeeded ? null : safeText(failureReason));
        return saveAndProjectSpending(payment);
    }

    public Payment recordGatewayOperationFailure(String paymentId, RuntimeException failure) {
        Payment payment = paymentsRepository.findById(normalizeId(paymentId))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Payment was not found."));
        payment.setLastGatewayError(safeGatewayError(failure));
        return saveAndProjectSpending(payment);
    }

    public AuthorizationResult releaseGatewayAuthorization(Payment payment, String operationKey) {
        if (payment == null) {
            throw new IllegalArgumentException("Payment is required.");
        }
        AuthorizationResult result = resolveProcessor(payment.getProvider()).releaseAuthorization(
                payment.getGatewayAuthorizationId(),
                operationKey);
        applyGatewayAuthorization(payment.getCheckoutSessionId(), result, "operation:" + operationKey);
        return result;
    }

    public AuthorizationResult captureGatewayAuthorization(Payment payment, BigDecimal amount, String operationKey) {
        if (payment == null) {
            throw new IllegalArgumentException("Payment is required.");
        }
        AuthorizationResult result = resolveProcessor(payment.getProvider()).captureAuthorization(
                payment.getGatewayAuthorizationId(),
                amount,
                operationKey);
        applyGatewayAuthorization(payment.getCheckoutSessionId(), result, "operation:" + operationKey);
        return result;
    }

    public record GatewayTransition(Payment payment, boolean newlyAuthorized, boolean duplicateEvent) {}

    public void recordEventJoin(
            String paymentSessionId,
            String userId,
            String sourceId,
            String slotSourceId,
            String bookingStartAtIso,
            PricingCancellationPolicyDto cancellationPolicy) {
        recordEventJoin(
                paymentSessionId,
                userId,
                sourceId,
                slotSourceId,
                bookingStartAtIso,
                null,
                cancellationPolicy);
    }

    public void recordEventJoin(
            String paymentSessionId,
            String userId,
            String sourceId,
            String slotSourceId,
            String bookingStartAtIso,
            String bookingEndAtIso,
            PricingCancellationPolicyDto cancellationPolicy) {
        recordBooking(
                paymentSessionId,
                userId,
                sourceId,
                slotSourceId,
                bookingStartAtIso,
                bookingEndAtIso,
                cancellationPolicy);
    }

    public void recordAssetBooking(
            String paymentSessionId,
            String userId,
            String sourceId,
            String slotSourceId,
            String bookingStartAtIso,
            String bookingEndAtIso,
            PricingCancellationPolicyDto cancellationPolicy) {
        recordAssetBooking(
                paymentSessionId,
                userId,
                sourceId,
                slotSourceId,
                bookingStartAtIso,
                bookingEndAtIso,
                cancellationPolicy,
                null,
                null);
    }

    public void recordAssetBooking(
            String paymentSessionId,
            String userId,
            String sourceId,
            String slotSourceId,
            String bookingStartAtIso,
            String bookingEndAtIso,
            PricingCancellationPolicyDto cancellationPolicy,
            String eventId,
            String subEventId) {
        Payment payment = recordBooking(
                paymentSessionId,
                userId,
                sourceId,
                slotSourceId,
                bookingStartAtIso,
                bookingEndAtIso,
                cancellationPolicy);
        if (payment != null) {
            payment.setContextEventId(normalizeId(eventId));
            payment.setContextSubEventId(normalizeId(subEventId));
            payment = saveAndProjectSpending(payment);
        }
        if (payment != null
                && FULFILLMENT_KIND_CLIENT.equals(safeText(payment.getFulfillmentKind()))
                && Set.of(
                        statusValue(AuthorizationStatus.AUTHORIZED),
                        statusValue(AuthorizationStatus.CAPTURED)).contains(safeText(payment.getStatus()))
                && !FULFILLMENT_SUCCEEDED.equals(safeText(payment.getFulfillmentStatus()))) {
            markGatewayFulfillment(payment.getId(), true, null);
        }
    }

    public Payment approveFullRefund(Payment payment, String reviewedAtIso) {
        return approveFullRefund(
                payment,
                reviewedAtIso,
                "owner-approved-request",
                "Full refund approved by the payment recipient.");
    }

    public Payment refundFailedFulfillment(Payment payment, String reason) {
        return approveFullRefund(
                payment,
                nowIso(),
                "fulfillment-compensation",
                hasText(reason) ? reason : "The paid checkout could not be fulfilled.");
    }

    public Payment approvePolicyRefund(
            Payment payment,
            String reviewedAtIso,
            double refundableAmount,
            String refundCurrency,
            String refundRuleId,
            String refundNote) {
        if (payment == null) {
            throw new IllegalArgumentException("Payment is required.");
        }
        double paidAmount = safeAmount(payment.getAmount());
        double approvedAmount = Math.min(paidAmount, safeAmount(refundableAmount));
        if (approvedAmount <= 0) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "The refund policy does not allow a refund.");
        }
        Payment current = payment;
        if (statusValue(AuthorizationStatus.AUTHORIZED).equals(safeText(current.getStatus()))
                && hasText(current.getGatewayAuthorizationId())
                && !"cash".equalsIgnoreCase(safeText(current.getProvider()))
                && !"dummy".equalsIgnoreCase(safeText(current.getProvider()))) {
            if (approvedAmount >= paidAmount) {
                releaseGatewayAuthorization(current, "refund-request:" + normalizeId(current.getId()));
            } else {
                captureGatewayAuthorization(
                        current,
                        BigDecimal.valueOf(roundMoney(paidAmount - approvedAmount)),
                        "refund-request:" + normalizeId(current.getId()));
            }
            current = paymentsRepository.findById(current.getId()).orElse(current);
        } else if (statusValue(AuthorizationStatus.CAPTURED).equals(safeText(current.getStatus()))
                && hasText(current.getGatewayAuthorizationId())
                && !"cash".equalsIgnoreCase(safeText(current.getProvider()))
                && !"dummy".equalsIgnoreCase(safeText(current.getProvider()))) {
            refundCapturedPayment(
                    current,
                    BigDecimal.valueOf(approvedAmount),
                    "refund-request:" + normalizeId(current.getId()));
            current = paymentsRepository.findById(current.getId()).orElse(current);
        }
        boolean full = approvedAmount >= paidAmount;
        current.setRefundStatus(full ? REFUND_STATUS_FULL : REFUND_STATUS_PARTIAL);
        current.setRefundedAmount(approvedAmount);
        current.setRefundCurrency(hasText(refundCurrency) ? refundCurrency : safeCurrency(current.getCurrency()));
        current.setRefundedAtIso(hasText(reviewedAtIso) ? reviewedAtIso : nowIso());
        current.setRefundRuleId(hasText(refundRuleId) ? refundRuleId : "owner-approved-request");
        current.setRefundNote(hasText(refundNote) ? refundNote : "Refund approved by the payment recipient.");
        current = saveAndProjectSpending(current);
        saveRefundHistoryRecord(current);
        return current;
    }

    private RefundResult refundCapturedPayment(
            Payment payment,
            BigDecimal amount,
            String operationKey) {
        PaymentProcessor processor = resolveProcessor(payment.getProvider());
        RefundResult result;
        if (hasText(payment.getGatewayRefundId())
                && RefundStatus.PENDING.name().equalsIgnoreCase(safeText(payment.getGatewayRefundStatus()))) {
            result = processor.retrieveRefund(payment.getGatewayRefundId());
        } else if (RefundStatus.SUCCEEDED.name().equalsIgnoreCase(safeText(payment.getGatewayRefundStatus()))) {
            return new RefundResult(
                    safeText(payment.getProvider()),
                    safeText(payment.getGatewayAuthorizationId()),
                    safeText(payment.getGatewayRefundId()),
                    RefundStatus.SUCCEEDED,
                    amount,
                    safeCurrency(payment.getCurrency()),
                    safeText(payment.getGatewayRefundStatus()));
        } else {
            result = processor.refundCapturedPayment(
                    payment.getGatewayAuthorizationId(),
                    amount,
                    payment.getCurrency(),
                    operationKey);
        }
        validateRefundResult(payment, amount, result);
        OptimisticLockingFailureException lastConflict = null;
        Payment current = paymentsRepository.findById(payment.getId()).orElse(payment);
        for (int attempt = 0; attempt < 3; attempt += 1) {
            current.setGatewayRefundId(normalizeId(result.gatewayRefundId()));
            current.setGatewayRefundStatus(result.status().name().toLowerCase(java.util.Locale.ROOT));
            current.setLastGatewayError(result.status() == RefundStatus.SUCCEEDED ? null : safeText(result.providerStatus()));
            try {
                paymentsRepository.save(current);
                lastConflict = null;
                break;
            } catch (OptimisticLockingFailureException conflict) {
                lastConflict = conflict;
                current = paymentsRepository.findById(payment.getId()).orElseThrow(() -> conflict);
            }
        }
        if (lastConflict != null) {
            throw lastConflict;
        }
        if (result.status() == RefundStatus.PENDING) {
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, "The payment provider is still processing the refund.");
        }
        if (result.status() != RefundStatus.SUCCEEDED) {
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "The payment provider rejected the refund.");
        }
        return result;
    }

    private void validateRefundResult(Payment payment, BigDecimal expectedAmount, RefundResult result) {
        if (result == null) {
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Payment provider returned no refund result.");
        }
        if (!safeText(payment.getProvider()).equals(safeText(result.provider()))) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Payment refund provider does not match the payment.");
        }
        if (!normalizeId(payment.getGatewayAuthorizationId()).equals(normalizeId(result.gatewayAuthorizationId()))) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Payment refund does not match the provider payment.");
        }
        BigDecimal actualAmount = result.amount() == null ? BigDecimal.ZERO : result.amount().stripTrailingZeros();
        if (expectedAmount.stripTrailingZeros().compareTo(actualAmount) != 0) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Payment provider refund amount does not match the approved amount.");
        }
        if (!safeCurrency(payment.getCurrency()).equalsIgnoreCase(safeCurrency(result.currency()))) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Payment provider refund currency does not match the payment.");
        }
    }

    public AssetPaymentReplacement validateAssetPaymentReplacement(
            String predecessorPaymentSessionId,
            String successorPaymentSessionId,
            String predecessorUserId,
            String successorUserId,
            String assetId,
            String eventId,
            String subEventId) {
        String normalizedPredecessorSessionId = normalizeId(predecessorPaymentSessionId);
        String normalizedSuccessorSessionId = normalizeId(successorPaymentSessionId);
        String normalizedPredecessorUserId = normalizeId(predecessorUserId);
        String normalizedSuccessorUserId = normalizeId(successorUserId);
        String normalizedAssetId = normalizeId(assetId);
        String normalizedEventId = normalizeId(eventId);
        String normalizedSubEventId = normalizeId(subEventId);
        if (!hasText(normalizedPredecessorSessionId)) {
            if (hasText(normalizedSuccessorSessionId)) {
                throw new ResponseStatusException(
                        HttpStatus.CONFLICT,
                        "A successor payment cannot replace a free assignment.");
            }
            return AssetPaymentReplacement.free();
        }
        if (!hasText(normalizedSuccessorSessionId)
                || !hasText(normalizedPredecessorUserId)
                || !hasText(normalizedSuccessorUserId)
                || normalizedPredecessorUserId.equals(normalizedSuccessorUserId)
                || !hasText(normalizedAssetId)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Both assignment payments are required.");
        }

        Payment predecessor = findByAnySessionId(normalizedPredecessorSessionId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "The predecessor payment was not found."));
        Payment successor = findByAnySessionId(normalizedSuccessorSessionId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "The successor payment was not found."));
        validateAssetReplacementPaymentIdentity(
                predecessor,
                normalizedPredecessorUserId,
                normalizedAssetId,
                normalizedEventId,
                normalizedSubEventId,
                "predecessor");
        validateAssetReplacementPaymentIdentity(
                successor,
                normalizedSuccessorUserId,
                normalizedAssetId,
                null,
                null,
                "successor");
        if (!Set.of("authorized", "captured", "approved").contains(safeText(successor.getStatus()))
                || BOOKING_STATUS_CANCELLED.equals(safeText(successor.getBookingStatus()))
                || REFUND_STATUS_FULL.equals(safeText(successor.getRefundStatus()))) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "The successor payment is not authorized.");
        }
        if (!safeCurrency(predecessor.getCurrency()).equalsIgnoreCase(safeCurrency(successor.getCurrency()))
                || BigDecimal.valueOf(roundMoney(safeAmount(predecessor.getAmount())))
                        .compareTo(BigDecimal.valueOf(roundMoney(safeAmount(successor.getAmount())))) != 0) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "The successor payment does not match the predecessor payment.");
        }
        String linkedSuccessorId = normalizeId(predecessor.getSuccessorPaymentId());
        if (hasText(linkedSuccessorId) && !linkedSuccessorId.equals(normalizeId(successor.getId()))) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "The predecessor payment was already replaced.");
        }
        String linkedPredecessorId = normalizeId(successor.getPredecessorPaymentId());
        if (hasText(linkedPredecessorId) && !linkedPredecessorId.equals(normalizeId(predecessor.getId()))) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "The successor payment already replaces another payment.");
        }
        return new AssetPaymentReplacement(
                normalizeId(predecessor.getId()),
                normalizeId(successor.getId()),
                true);
    }

    public void completeAssetPaymentReplacement(
            AssetPaymentReplacement replacement,
            String successorUserId,
            String eventId,
            String subEventId) {
        if (replacement == null || !replacement.paymentRequired()) {
            return;
        }
        Payment predecessor = paymentsRepository.findById(replacement.predecessorPaymentId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "The predecessor payment was not found."));
        Payment successor = paymentsRepository.findById(replacement.successorPaymentId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "The successor payment was not found."));
        String nowIso = nowIso();

        successor.setPredecessorPaymentId(normalizeId(predecessor.getId()));
        successor.setContextEventId(normalizeId(eventId));
        successor.setContextSubEventId(normalizeId(subEventId));
        successor.setBookingStatus(BOOKING_STATUS_JOINED);
        successor.setJoinedAtIso(hasText(successor.getJoinedAtIso()) ? successor.getJoinedAtIso() : nowIso);
        if (!hasText(successor.getRefundStatus())) {
            successor.setRefundStatus(REFUND_STATUS_NONE);
        }
        successor = saveAndProjectSpending(successor);

        predecessor.setSuccessorPaymentId(normalizeId(successor.getId()));
        predecessor.setRefundRequestStatus("approved");
        predecessor.setRefundReviewedAtIso(nowIso);
        predecessor.setRefundReviewedByUserId(normalizeId(successorUserId));
        predecessor = saveAndProjectSpending(predecessor);
        if (REFUND_STATUS_FULL.equals(safeText(predecessor.getRefundStatus()))) {
            saveRefundHistoryRecord(predecessor);
            return;
        }
        approveFullRefund(
                predecessor,
                nowIso,
                "assignment-manager-takeover",
                "The predecessor payment was refunded after the successor paid and took over the Asset assignment.");
    }

    private Payment approveFullRefund(
            Payment payment,
            String reviewedAtIso,
            String refundRuleId,
            String refundNote) {
        return approvePolicyRefund(
                payment,
                reviewedAtIso,
                safeAmount(payment == null ? null : payment.getAmount()),
                payment == null ? null : payment.getCurrency(),
                refundRuleId,
                refundNote);
    }

    private void validateAssetReplacementPaymentIdentity(
            Payment payment,
            String expectedUserId,
            String expectedAssetId,
            String expectedEventId,
            String expectedSubEventId,
            String label) {
        if (payment == null
                || !normalizeId(expectedUserId).equals(normalizeId(payment.getUserId()))
                || !normalizeId(expectedAssetId).equals(normalizeId(payment.getSourceId()))) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "The " + label + " payment identity does not match the assignment.");
        }
        if (hasText(expectedEventId)
                && hasText(payment.getContextEventId())
                && !normalizeId(expectedEventId).equals(normalizeId(payment.getContextEventId()))) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "The " + label + " payment Event scope does not match.");
        }
        if (hasText(expectedSubEventId)
                && hasText(payment.getContextSubEventId())
                && !normalizeId(expectedSubEventId).equals(normalizeId(payment.getContextSubEventId()))) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "The " + label + " payment Sub-event scope does not match.");
        }
    }

    public record AssetPaymentReplacement(
            String predecessorPaymentId,
            String successorPaymentId,
            boolean paymentRequired) {
        public static AssetPaymentReplacement free() {
            return new AssetPaymentReplacement(null, null, false);
        }
    }

    public EventCheckoutPaymentAuditDto loadPaymentAudit(
            String userId,
            String sourceId,
            String paymentSessionId) {
        String normalizedUserId = normalizeId(userId);
        String normalizedSourceId = normalizeId(sourceId);
        String normalizedSessionId = normalizeId(paymentSessionId);
        if (!hasText(normalizedUserId)
                || !hasText(normalizedSourceId)
                || !hasText(normalizedSessionId)) {
            return null;
        }

        return findByAnySessionId(normalizedSessionId)
                .filter(payment -> normalizedUserId.equals(normalizeId(payment.getUserId())))
                .filter(payment -> normalizedSourceId.equals(normalizeId(payment.getSourceId())))
                .map(this::latestPaymentRevision)
                .map(this::toPaymentAudit)
                .orElse(null);
    }

    public EventCheckoutPaymentAuditDto recordAssetBookingPriceRevision(
            String paymentSessionId,
            String userId,
            String sourceId,
            String assetTitle,
            String timeframe,
            Integer previousQuantity,
            Integer nextQuantity,
            Double previousTotalAmount,
            Double nextTotalAmount,
            String currency) {
        String normalizedUserId = normalizeId(userId);
        String normalizedSourceId = normalizeId(sourceId);
        Payment anchor = findByAnySessionId(paymentSessionId).orElse(null);
        if (anchor == null
                || !hasText(normalizedUserId)
                || !hasText(normalizedSourceId)
                || !normalizedUserId.equals(normalizeId(anchor.getUserId()))
                || !normalizedSourceId.equals(normalizeId(anchor.getSourceId()))) {
            return null;
        }

        Payment previous = latestPaymentRevision(anchor);
        double previousTotal = previousTotalAmount == null || !Double.isFinite(previousTotalAmount)
                ? roundMoney(safeAmount(previous.getAmount()))
                : roundMoney(safeAmount(previousTotalAmount));
        double nextTotal = roundMoney(safeAmount(nextTotalAmount));
        int normalizedPreviousQuantity = previousQuantity == null
                ? safeQuantity(previous.getBookingQuantity())
                : safeQuantity(previousQuantity);
        int normalizedNextQuantity = safeQuantity(nextQuantity);
        if (previousTotal == nextTotal && normalizedPreviousQuantity == normalizedNextQuantity) {
            return toPaymentAudit(previous);
        }

        String rootSessionId = revisionRootSessionId(previous);
        Payment revision = new Payment();
        revision.setUserId(normalizedUserId);
        revision.setRecipientUserId(previous.getRecipientUserId());
        revision.setSourceId(normalizedSourceId);
        revision.setProvider(hasText(previous.getProvider()) ? previous.getProvider() : "audit");
        revision.setStatus(hasText(previous.getStatus()) ? previous.getStatus() : "approved");
        revision.setAmount(nextTotal);
        revision.setCurrency(safeCurrency(currency));
        revision.setCheckoutSessionId("audit_revision_" + UUID.randomUUID());
        revision.setSlotSourceId(previous.getSlotSourceId());
        revision.setBookingStartAtIso(previous.getBookingStartAtIso());
        revision.setOptionalSubEventIds(previous.getOptionalSubEventIds());
        revision.setAcceptedPolicyIds(previous.getAcceptedPolicyIds());
        revision.setBasketItems(List.of());
        revision.setPricingSummaryRows(List.of(
                new com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventCheckoutPricingSummaryRowDto(
                        "base-payment-audit",
                        "asset.borrow.payment.previous.total",
                        null,
                        previousTotal,
                        safeCurrency(currency),
                        null),
                new com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventCheckoutPricingSummaryRowDto(
                        "quantity-adjustment",
                        "asset.borrow.payment.quantity.adjustment",
                        normalizedPreviousQuantity + " → " + normalizedNextQuantity,
                        roundMoney(nextTotal - previousTotal),
                        safeCurrency(currency),
                        null)));
        revision.setLineItems(List.of(
                new com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventCheckoutLineItemDto(
                        "resource:" + normalizedSourceId,
                        "resource",
                        hasText(assetTitle) ? assetTitle.trim() : "Asset booking",
                        hasText(timeframe) ? timeframe.trim() : "",
                        nextTotal,
                        safeCurrency(currency))));
        revision.setAppliedPromoCodes(previous.getAppliedPromoCodes());
        revision.setBookingStatus(hasText(previous.getBookingStatus()) ? previous.getBookingStatus() : BOOKING_STATUS_JOINED);
        revision.setJoinedAtIso(nowIso());
        revision.setRefundStatus(REFUND_STATUS_NONE);
        revision.setCancellationPolicy(previous.getCancellationPolicy());
        revision.setAuditKind(AUDIT_KIND_BOOKING_PRICE_REVISION);
        revision.setRevisionRootSessionId(rootSessionId);
        revision.setSupersedesPaymentId(previous.getId());
        revision.setRevisionNumber(revisionNumber(previous) + 1);
        revision.setAdjustmentAmount(roundMoney(nextTotal - previousTotal));
        revision.setBookingQuantity(normalizedNextQuantity);
        revision.setCreatedDate(nowIso());
        return toPaymentAudit(saveAndProjectSpending(revision));
    }

    public void cancelAssetBooking(
            String paymentSessionId,
            String fallbackBookingStartAtIso,
            PricingCancellationPolicyDto fallbackCancellationPolicy) {
        Payment payment = findByAnySessionId(paymentSessionId).orElse(null);
        if (payment == null) {
            return;
        }
        cancelBooking(payment, fallbackBookingStartAtIso, fallbackCancellationPolicy);
    }

    private Payment recordBooking(
            String paymentSessionId,
            String userId,
            String sourceId,
            String slotSourceId,
            String bookingStartAtIso,
            String bookingEndAtIso,
            PricingCancellationPolicyDto cancellationPolicy) {
        Payment payment = findByAnySessionId(paymentSessionId).orElse(null);
        if (payment == null) {
            return null;
        }

        String normalizedUserId = normalizeId(userId);
        String normalizedSourceId = normalizeId(sourceId);
        if (!hasText(normalizedSourceId)) {
            return null;
        }

        if (hasText(normalizedUserId)) {
            payment.setUserId(normalizedUserId);
        }
        payment.setSourceId(normalizedSourceId);
        payment.setSlotSourceId(normalizeId(slotSourceId));
        payment.setBookingStartAtIso(hasText(bookingStartAtIso) ? bookingStartAtIso.trim() : payment.getBookingStartAtIso());
        payment.setBookingEndAtIso(hasText(bookingEndAtIso) ? bookingEndAtIso.trim() : payment.getBookingEndAtIso());
        payment.setCancellationPolicy(cancellationPolicy);
        if (!BOOKING_STATUS_JOINED.equals(safeText(payment.getBookingStatus())) || !hasText(payment.getJoinedAtIso())) {
            payment.setJoinedAtIso(nowIso());
        }
        payment.setBookingStatus(BOOKING_STATUS_JOINED);
        if (!hasText(payment.getRefundStatus())) {
            payment.setRefundStatus(REFUND_STATUS_NONE);
        }
        return saveAndProjectSpending(payment);
    }

    public void cancelEventBooking(
            String userId,
            String sourceId,
            String fallbackBookingStartAtIso,
            PricingCancellationPolicyDto fallbackCancellationPolicy) {
        String normalizedUserId = normalizeId(userId);
        String normalizedSourceId = normalizeId(sourceId);
        if (!hasText(normalizedUserId) || !hasText(normalizedSourceId)) {
            return;
        }

        Payment payment = paymentsRepository.findByUserIdAndSourceId(normalizedUserId, normalizedSourceId).stream()
                .filter(Objects::nonNull)
                .filter(this::isPrimaryPayment)
                .filter(item -> BOOKING_STATUS_JOINED.equals(safeText(item.getBookingStatus())))
                .filter(item -> !BOOKING_STATUS_CANCELLED.equals(safeText(item.getBookingStatus())))
                .filter(item -> !REFUND_STATUS_FULL.equals(safeText(item.getRefundStatus())))
                .max(Comparator.comparing(item -> sortableIso(item.getJoinedAtIso() != null ? item.getJoinedAtIso() : item.getCreatedDate())))
                .orElse(null);
        if (payment == null) {
            return;
        }
        cancelBooking(payment, fallbackBookingStartAtIso, fallbackCancellationPolicy);
    }

    public boolean hasPendingEventJoin(String userId, String sourceId) {
        return findLatestOpenEventPayment(userId, sourceId)
                .map(payment -> !BOOKING_STATUS_JOINED.equals(safeText(payment.getBookingStatus())))
                .orElse(false);
    }

    public boolean finalizePendingEventJoin(String userId, String sourceId) {
        Payment payment = findLatestOpenEventPayment(userId, sourceId).orElse(null);
        if (payment == null || BOOKING_STATUS_JOINED.equals(safeText(payment.getBookingStatus()))) {
            return false;
        }
        payment.setBookingStatus(BOOKING_STATUS_JOINED);
        payment.setJoinedAtIso(nowIso());
        if (!hasText(payment.getRefundStatus())) {
            payment.setRefundStatus(REFUND_STATUS_NONE);
        }
        saveAndProjectSpending(payment);
        return true;
    }

    public Set<String> findPendingEventJoinSourceIds(String userId, Collection<String> sourceIds) {
        String normalizedUserId = normalizeId(userId);
        List<String> normalizedSourceIds = sourceIds == null
                ? List.of()
                : sourceIds.stream()
                        .map(this::normalizeId)
                        .filter(this::hasText)
                        .distinct()
                        .toList();
        if (!hasText(normalizedUserId) || normalizedSourceIds.isEmpty()) {
            return Set.of();
        }
        Map<String, Payment> latestOpenBySourceId = new LinkedHashMap<>();
        for (Payment payment : paymentsRepository.findByUserIdAndSourceIdIn(normalizedUserId, normalizedSourceIds)) {
            String sourceId = normalizeId(payment == null ? null : payment.getSourceId());
            if (!hasText(sourceId) || !isPrimaryPayment(payment)
                    || BOOKING_STATUS_CANCELLED.equals(safeText(payment.getBookingStatus()))
                    || REFUND_STATUS_FULL.equals(safeText(payment.getRefundStatus()))) {
                continue;
            }
            Payment current = latestOpenBySourceId.get(sourceId);
            if (current == null || sortableIso(
                    hasText(payment.getJoinedAtIso()) ? payment.getJoinedAtIso() : payment.getCreatedDate())
                    > sortableIso(hasText(current.getJoinedAtIso()) ? current.getJoinedAtIso() : current.getCreatedDate())) {
                latestOpenBySourceId.put(sourceId, payment);
            }
        }
        return latestOpenBySourceId.entrySet().stream()
                .filter(entry -> !BOOKING_STATUS_JOINED.equals(safeText(entry.getValue().getBookingStatus())))
                .map(Map.Entry::getKey)
                .collect(java.util.stream.Collectors.toUnmodifiableSet());
    }

    public boolean hasJoinedEventJoin(String userId, String sourceId) {
        return findLatestOpenEventPayment(userId, sourceId)
                .map(payment -> BOOKING_STATUS_JOINED.equals(safeText(payment.getBookingStatus())))
                .orElse(false);
    }

    private void cancelBooking(
            Payment payment,
            String fallbackBookingStartAtIso,
            PricingCancellationPolicyDto fallbackCancellationPolicy) {
        if (payment == null) {
            return;
        }
        if (BOOKING_STATUS_CANCELLED.equals(safeText(payment.getBookingStatus()))
                || REFUND_STATUS_FULL.equals(safeText(payment.getRefundStatus()))) {
            return;
        }

        String cancellationTimeIso = nowIso();
        if (statusValue(AuthorizationStatus.AUTHORIZED).equals(safeText(payment.getStatus()))) {
            payment.setBookingStatus(BOOKING_STATUS_CANCELLED);
            payment.setCancelledAtIso(cancellationTimeIso);
            payment.setRefundStatus(REFUND_STATUS_NONE);
            payment.setRefundedAmount(null);
            payment.setRefundedAtIso(null);
            payment.setRefundRuleId(null);
            payment.setRefundNote("Authorization release pending.");
            saveAndProjectSpending(payment);
            return;
        }
        String bookingStartAtIso = hasText(payment.getBookingStartAtIso())
                ? payment.getBookingStartAtIso()
                : (hasText(fallbackBookingStartAtIso) ? fallbackBookingStartAtIso.trim() : null);
        PricingCancellationPolicyDto policy = payment.getCancellationPolicy() != null
                ? payment.getCancellationPolicy()
                : fallbackCancellationPolicy;

        RefundComputation refund = computeRefund(
                safeAmount(payment.getAmount()),
                hasText(payment.getCurrency()) ? payment.getCurrency() : "USD",
                policy,
                bookingStartAtIso,
                cancellationTimeIso);

        payment.setBookingStatus(BOOKING_STATUS_CANCELLED);
        payment.setCancelledAtIso(cancellationTimeIso);
        payment.setRefundedAmount(refund.amount());
        payment.setRefundCurrency(refund.currency());
        payment.setRefundRuleId(refund.ruleId());
        payment.setRefundNote(refund.note());
        payment.setRefundStatus(refund.status());
        if (refund.amount() > 0) {
            payment.setRefundedAtIso(cancellationTimeIso);
        }
        payment = saveAndProjectSpending(payment);
        if (refund.amount() > 0) {
            saveRefundHistoryRecord(payment);
        }
    }

    private Optional<Payment> findLatestOpenEventPayment(String userId, String sourceId) {
        String normalizedUserId = normalizeId(userId);
        String normalizedSourceId = normalizeId(sourceId);
        if (!hasText(normalizedUserId) || !hasText(normalizedSourceId)) {
            return Optional.empty();
        }
        return paymentsRepository.findByUserIdAndSourceId(normalizedUserId, normalizedSourceId).stream()
                .filter(Objects::nonNull)
                .filter(this::isPrimaryPayment)
                .filter(item -> !BOOKING_STATUS_CANCELLED.equals(safeText(item.getBookingStatus())))
                .filter(item -> !REFUND_STATUS_FULL.equals(safeText(item.getRefundStatus())))
                .max(Comparator.comparing(item -> sortableIso(
                        hasText(item.getJoinedAtIso()) ? item.getJoinedAtIso() : item.getCreatedDate()
                )));
    }

    private PaymentProcessor resolveProcessor(String provider) {
        PaymentProcessor processor = processors.get(provider);
        if (processor == null) {
            throw new IllegalArgumentException("Unsupported payment provider: " + provider);
        }
        return processor;
    }

    private Optional<Payment> findReusableAuthorization(
            EventCheckoutRequestDto request,
            String provider,
            String fulfillmentKind) {
        String userId = normalizeId(request == null ? null : request.userId());
        String sourceId = normalizeId(request == null ? null : request.sourceId());
        if (!hasText(userId) || !hasText(sourceId)) {
            return Optional.empty();
        }
        Set<String> reusableStatuses = Set.of(
                statusValue(AuthorizationStatus.AUTHORIZATION_PENDING),
                statusValue(AuthorizationStatus.CUSTOMER_ACTION_REQUIRED),
                statusValue(AuthorizationStatus.AUTHORIZED),
                statusValue(AuthorizationStatus.CAPTURED));
        return paymentsRepository.findByUserIdAndSourceId(userId, sourceId).stream()
                .filter(Objects::nonNull)
                .filter(this::isPrimaryPayment)
                .filter(item -> !hasText(provider)
                        || safeText(provider).equals(safeText(item.getProvider())))
                .filter(item -> safeText(fulfillmentKind).equals(safeText(item.getFulfillmentKind())))
                .filter(item -> Objects.equals(
                        normalizeId(item.getPaymentMethodId()),
                        normalizeId(request.paymentMethodId())))
                .filter(item -> reusableStatuses.contains(safeText(item.getStatus())))
                .filter(item -> !BOOKING_STATUS_CANCELLED.equals(safeText(item.getBookingStatus())))
                .filter(item -> !FULFILLMENT_FAILED.equals(safeText(item.getFulfillmentStatus())))
                .filter(item -> Objects.equals(
                        normalizeId(item.getSlotSourceId()),
                        normalizeId(request.slotSourceId())))
                .filter(item -> safeCurrency(item.getCurrency()).equals(safeCurrency(request.currency())))
                .filter(item -> roundMoney(safeAmount(item.getAmount())) == roundMoney(safeAmount(request.totalAmount())))
                .max(Comparator.comparing(item -> sortableIso(item.getCreatedDate())));
    }

    private boolean paymentSessionMatches(Payment payment, String paymentSessionId) {
        String expected = normalizeId(paymentSessionId);
        return hasText(expected) && (expected.equals(normalizeId(payment.getCheckoutSessionId()))
                || expected.equals(normalizeId(payment.getGatewaySessionId()))
                || expected.equals(normalizeId(payment.getId())));
    }

    private Optional<Payment> findGatewayPayment(
            String internalPaymentSessionId,
            AuthorizationResult authorization) {
        String internalId = normalizeId(internalPaymentSessionId);
        if (hasText(internalId)) {
            Optional<Payment> byInternalId = paymentsRepository.findByCheckoutSessionId(internalId)
                    .or(() -> paymentsRepository.findById(internalId));
            if (byInternalId.isPresent()) {
                return byInternalId;
            }
        }
        if (authorization != null && hasText(authorization.gatewayAuthorizationId())) {
            Optional<Payment> byAuthorization = paymentsRepository
                    .findByGatewayAuthorizationId(normalizeId(authorization.gatewayAuthorizationId()));
            if (byAuthorization.isPresent()) {
                return byAuthorization;
            }
        }
        if (authorization != null && hasText(authorization.gatewayCheckoutId())) {
            return paymentsRepository.findByGatewaySessionId(normalizeId(authorization.gatewayCheckoutId()));
        }
        return Optional.empty();
    }

    private void validateGatewayResult(Payment payment, AuthorizationResult authorization) {
        if (payment == null || authorization == null) {
            throw new ResponseStatusException(HttpStatus.BAD_GATEWAY, "Payment provider returned no authorization result.");
        }
        if (!safeText(payment.getProvider()).equals(safeText(authorization.provider()))) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Payment provider identity does not match the session.");
        }
        BigDecimal expectedAmount = BigDecimal.valueOf(safeAmount(payment.getAmount())).stripTrailingZeros();
        BigDecimal actualAmount = authorization.amount() == null
                ? BigDecimal.ZERO
                : authorization.amount().stripTrailingZeros();
        boolean exactAuthorizationAmountRequired = switch (authorization.status()) {
            case PAYMENT_METHOD_READY, AUTHORIZATION_PENDING, CUSTOMER_ACTION_REQUIRED, AUTHORIZED -> true;
            default -> false;
        };
        if ((exactAuthorizationAmountRequired && expectedAmount.compareTo(actualAmount) != 0)
                || (!exactAuthorizationAmountRequired
                        && (actualAmount.signum() < 0 || actualAmount.compareTo(expectedAmount) > 0))) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Payment provider amount does not match the session.");
        }
        if (!safeCurrency(payment.getCurrency()).equalsIgnoreCase(safeCurrency(authorization.currency()))) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Payment provider currency does not match the session.");
        }
    }

    private void applyGatewayResult(Payment payment, AuthorizationResult authorization) {
        if (hasText(authorization.gatewayCheckoutId())) {
            payment.setGatewaySessionId(normalizeId(authorization.gatewayCheckoutId()));
        }
        if (hasText(authorization.gatewayAuthorizationId())) {
            payment.setGatewayAuthorizationId(normalizeId(authorization.gatewayAuthorizationId()));
        }
        payment.setStatus(statusValue(authorization.status()));
        payment.setGatewayStatus(safeText(authorization.providerStatus()));
        payment.setGatewayActionUrl(normalizeUrl(authorization.customerActionUrl()));
        payment.setAuthorizationExpiresAtIso(normalizeId(authorization.captureBeforeIso()));
        switch (authorization.status()) {
            case AUTHORIZED -> payment.setGatewayApprovedAtIso(
                    hasText(payment.getGatewayApprovedAtIso()) ? payment.getGatewayApprovedAtIso() : nowIso());
            case CAPTURED -> payment.setCapturedAtIso(
                    hasText(payment.getCapturedAtIso()) ? payment.getCapturedAtIso() : nowIso());
            case RELEASED -> payment.setReleasedAtIso(
                    hasText(payment.getReleasedAtIso()) ? payment.getReleasedAtIso() : nowIso());
            case EXPIRED, FAILED -> payment.setFailedAtIso(
                    hasText(payment.getFailedAtIso()) ? payment.getFailedAtIso() : nowIso());
            default -> {
                // Non-terminal provider state: preserve lifecycle timestamps.
            }
        }
    }

    private EventCheckoutSessionDto toCheckoutSession(Payment payment) {
        return new EventCheckoutSessionDto(
                payment.getCheckoutSessionId(),
                payment.getProvider(),
                "gateway",
                switch (safeText(payment.getStatus())) {
                    case "customer_action_required" -> "requires_action";
                    default -> safeText(payment.getStatus());
                },
                safeAmount(payment.getAmount()),
                safeCurrency(payment.getCurrency()),
                normalizeUrl(payment.getGatewayActionUrl()));
    }

    private String statusValue(AuthorizationStatus status) {
        return status == null ? "failed" : status.name().toLowerCase(java.util.Locale.ROOT);
    }

    private boolean isAllowedGatewayTransition(String previousStatus, AuthorizationStatus nextStatus) {
        String previous = safeText(previousStatus);
        String next = statusValue(nextStatus);
        if (!hasText(previous) || previous.equals(next)) {
            return true;
        }
        return switch (previous) {
            case "captured", "released", "expired" -> false;
            case "authorized" -> Set.of("captured", "released", "expired", "failed").contains(next);
            case "customer_action_required" -> Set.of(
                    "authorization_pending", "authorized", "captured", "expired", "failed").contains(next);
            case "failed" -> Set.of(
                    "authorization_pending", "customer_action_required", "authorized", "captured", "expired").contains(next);
            default -> true;
        };
    }

    private String normalizeUrl(String value) {
        return hasText(value) ? value.trim() : null;
    }

    private String safeGatewayError(RuntimeException exception) {
        Throwable current = exception;
        String firstMessage = null;
        while (current != null) {
            if (current instanceof ResponseStatusException responseStatusException
                    && hasText(responseStatusException.getReason())) {
                return responseStatusException.getReason();
            }
            if (!hasText(firstMessage) && hasText(current.getMessage())) {
                firstMessage = current.getMessage().trim();
            }
            current = current.getCause();
        }
        return hasText(firstMessage) ? firstMessage : "Payment provider failure.";
    }

    private void hydratePaymentRequest(Payment payment, EventCheckoutRequestDto request, String provider) {
        payment.setUserId(normalizeId(request == null ? null : request.userId()));
        payment.setSourceId(normalizeId(request == null ? null : request.sourceId()));
        payment.setRecipientUserId(resolvePaymentRecipientUserId(payment));
        payment.setPaymentMethodId(normalizeId(request == null ? null : request.paymentMethodId()));
        payment.setProvider(provider);
        payment.setAmount(request == null ? 0D : safeAmount(request.totalAmount()));
        payment.setCurrency(request == null ? "USD" : safeCurrency(request.currency()));
        payment.setSlotSourceId(normalizeId(request == null ? null : request.slotSourceId()));
        payment.setOptionalSubEventIds(request == null ? List.of() : normalizeStrings(request.optionalSubEventIds()));
        payment.setAcceptedPolicyIds(request == null ? List.of() : normalizeStrings(request.acceptedPolicyIds()));
        payment.setBasketItems(request == null || request.basketItems() == null ? List.of() : request.basketItems());
        payment.setPricingSummaryRows(request == null || request.pricingSummaryRows() == null ? List.of() : request.pricingSummaryRows());
        payment.setLineItems(request == null || request.lineItems() == null ? List.of() : request.lineItems());
        payment.setAppliedPromoCodes(request == null ? List.of() : normalizePromoCodes(request.appliedPromoCodes()));
        payment.setAuditKind(hasText(payment.getAuditKind()) ? payment.getAuditKind() : AUDIT_KIND_PAYMENT);
        payment.setRevisionNumber(payment.getRevisionNumber() == null ? 0 : Math.max(0, payment.getRevisionNumber()));
    }

    private EventCheckoutPaymentAuditDto toPaymentAudit(Payment payment) {
        return new EventCheckoutPaymentAuditDto(
                payment.getId(),
                payment.getUserId(),
                payment.getSourceId(),
                payment.getCheckoutSessionId(),
                payment.getProvider(),
                payment.getStatus(),
                payment.getBookingStatus(),
                hasText(payment.getAuditKind()) ? payment.getAuditKind() : AUDIT_KIND_PAYMENT,
                revisionNumber(payment),
                payment.getAdjustmentAmount(),
                payment.getBookingQuantity(),
                payment.getSupersedesPaymentId(),
                safeAmount(payment.getAmount()),
                safeCurrency(payment.getCurrency()),
                copyNonNull(payment.getBasketItems()),
                copyNonNull(payment.getPricingSummaryRows()),
                copyNonNull(payment.getLineItems()),
                payment.getJoinedAtIso(),
                payment.getCreatedDate());
    }

    private Payment latestPaymentRevision(Payment anchor) {
        if (anchor == null) {
            return null;
        }
        String rootSessionId = revisionRootSessionId(anchor);
        List<Payment> revisions = hasText(rootSessionId)
                ? copyNonNull(paymentsRepository.findByRevisionRootSessionId(rootSessionId))
                : List.of();
        return revisions.stream()
                .filter(payment -> Objects.equals(normalizeId(anchor.getUserId()), normalizeId(payment.getUserId())))
                .filter(payment -> Objects.equals(normalizeId(anchor.getSourceId()), normalizeId(payment.getSourceId())))
                .max(Comparator
                        .comparingInt(this::revisionNumber)
                        .thenComparing(payment -> sortableIso(payment.getCreatedDate())))
                .orElse(anchor);
    }

    private Payment saveAndProjectSpending(Payment payment) {
        double previousAccounted = roundMoney(safeAmount(payment == null ? null : payment.getAccountedSpentAmount()));
        double nextAccounted = accountedSpentAmount(payment);
        if (payment != null) {
            payment.setAccountedSpentAmount(nextAccounted);
        }
        Payment saved = paymentsRepository.save(payment);
        double delta = roundSignedMoney(nextAccounted - previousAccounted);
        String userId = normalizeId(saved.getUserId());
        String recipientUserId = normalizeId(saved.getRecipientUserId());
        String currency = safeCurrency(saved.getCurrency()).toUpperCase(java.util.Locale.ROOT);
        if (mongoTemplate != null
                && currency.matches("[A-Z]{3}")
                && Math.abs(delta) >= 0.005D) {
            incrementPaymentTotal(userId, "paymentSpentTotals", currency, delta);
            incrementPaymentTotal(userId, "paymentAllTotals", currency, delta);
            incrementPaymentTotal(recipientUserId, "paymentIncomeTotals", currency, delta);
            incrementPaymentTotal(recipientUserId, "paymentAllTotals", currency, delta);
        }
        return saved;
    }

    private void incrementPaymentTotal(String userId, String field, String currency, double delta) {
        if (!hasText(userId)) return;
        mongoTemplate.updateFirst(
                Query.query(Criteria.where("userId").is(userId)),
                new Update().inc(field + "." + currency, delta),
                Users.class);
    }

    private String resolvePaymentRecipientUserId(Payment payment) {
        String existing = normalizeId(payment == null ? null : payment.getRecipientUserId());
        if (hasText(existing)) return existing;
        String sourceId = normalizeId(payment == null ? null : payment.getSourceId());
        if (!hasText(sourceId)) return null;
        if (activityEventsRepository != null) {
            String eventRecipient = activityEventsRepository.findBySourceId(sourceId).stream()
                    .filter(Objects::nonNull)
                    .map(event -> firstText(
                            event.getOrganizerUserId(),
                            event.getCreatorUserId(),
                            event.getOwnerUserId()))
                    .filter(this::hasText)
                    .findFirst()
                    .orElse(null);
            if (hasText(eventRecipient)) return eventRecipient;
        }
        if (assetsRepository != null) {
            String assetRecipient = assetsRepository.findByAssetId(sourceId)
                    .map(asset -> normalizeId(asset.getOwnerUserId()))
                    .orElse(null);
            if (!hasText(assetRecipient) && sourceId.contains(":")) {
                String assetId = sourceId.substring(sourceId.lastIndexOf(':') + 1);
                assetRecipient = assetsRepository.findByAssetId(assetId)
                        .map(asset -> normalizeId(asset.getOwnerUserId()))
                        .orElse(null);
            }
            if (hasText(assetRecipient)) return assetRecipient;
        }
        return null;
    }

    private String firstText(String... values) {
        if (values == null) return null;
        for (String value : values) {
            String normalized = normalizeId(value);
            if (hasText(normalized)) return normalized;
        }
        return null;
    }

    private double accountedSpentAmount(Payment payment) {
        if (payment == null || !AUDIT_KIND_PAYMENT.equals(safeText(payment.getAuditKind()))) {
            return 0D;
        }
        String status = safeText(payment.getStatus());
        boolean releasedRefund = "released".equals(status)
                && (safeAmount(payment.getRefundedAmount()) > 0
                        || payment.getProcessedGatewayEventIds().stream()
                                .map(this::safeText)
                                .anyMatch(eventId -> eventId.startsWith("operation:refund-request:")));
        if (!releasedRefund && !Set.of("authorized", "captured", "approved", "partially_refunded", "refunded").contains(status)) {
            return 0D;
        }
        return roundMoney(safeAmount(payment.getAmount()));
    }

    private boolean isPrimaryPayment(Payment payment) {
        return payment != null
                && (!hasText(payment.getAuditKind()) || AUDIT_KIND_PAYMENT.equals(safeText(payment.getAuditKind())));
    }

    Payment saveRefundHistoryRecord(Payment payment) {
        double amount = safeAmount(payment == null ? null : payment.getRefundedAmount());
        String refundedAtIso = payment == null ? null : normalizeId(payment.getRefundedAtIso());
        String paymentKey = firstText(
                payment == null ? null : payment.getId(),
                payment == null ? null : payment.getCheckoutSessionId(),
                payment == null ? null : payment.getGatewaySessionId());
        if (amount <= 0 || !hasText(refundedAtIso) || !hasText(paymentKey)) {
            return null;
        }
        String historyId = "refund:" + paymentKey;
        Payment history = paymentsRepository.findById(historyId).orElseGet(Payment::new);
        double previousAmount = safeAmount(history.getAccountedSpentAmount());
        history.setId(historyId);
        history.setUserId(normalizeId(payment.getUserId()));
        history.setRecipientUserId(normalizeId(payment.getRecipientUserId()));
        history.setSourceId(normalizeId(payment.getSourceId()));
        history.setPaymentMethodId(normalizeId(payment.getPaymentMethodId()));
        history.setProvider(safeText(payment.getProvider()));
        history.setStatus("refunded");
        history.setAmount(amount);
        history.setCurrency(hasText(payment.getRefundCurrency())
                ? payment.getRefundCurrency()
                : safeCurrency(payment.getCurrency()));
        history.setGatewayRefundId(payment.getGatewayRefundId());
        history.setGatewayRefundStatus(payment.getGatewayRefundStatus());
        history.setFulfillmentKind(payment.getFulfillmentKind());
        history.setFulfillmentStatus(payment.getFulfillmentStatus());
        history.setContextEventId(payment.getContextEventId());
        history.setContextSubEventId(payment.getContextSubEventId());
        history.setBookingStatus(payment.getBookingStatus());
        history.setBookingStartAtIso(payment.getBookingStartAtIso());
        history.setBookingEndAtIso(payment.getBookingEndAtIso());
        history.setRefundStatus(payment.getRefundStatus());
        history.setRefundedAmount(amount);
        history.setRefundCurrency(history.getCurrency());
        history.setRefundedAtIso(refundedAtIso);
        history.setRefundRuleId(payment.getRefundRuleId());
        history.setRefundNote(payment.getRefundNote());
        history.setRefundRequestStatus(payment.getRefundRequestStatus());
        history.setRefundRequestedAtIso(payment.getRefundRequestedAtIso());
        history.setRefundRequestedByUserId(payment.getRefundRequestedByUserId());
        history.setRefundReviewedAtIso(payment.getRefundReviewedAtIso());
        history.setRefundReviewedByUserId(payment.getRefundReviewedByUserId());
        history.setCancellationPolicy(payment.getCancellationPolicy());
        history.setAuditKind(AUDIT_KIND_REFUND);
        history.setSupersedesPaymentId(normalizeId(payment.getId()));
        history.setAccountedSpentAmount(amount);
        history.setCreatedDate(refundedAtIso);
        Payment saved = paymentsRepository.save(history);
        double delta = roundSignedMoney(amount - previousAmount);
        String currency = safeCurrency(saved.getCurrency()).toUpperCase(java.util.Locale.ROOT);
        if (mongoTemplate != null && currency.matches("[A-Z]{3}") && Math.abs(delta) >= 0.005D) {
            incrementPaymentTotal(saved.getUserId(), "paymentIncomeTotals", currency, delta);
            incrementPaymentTotal(saved.getUserId(), "paymentAllTotals", currency, delta);
            incrementPaymentTotal(saved.getRecipientUserId(), "paymentSpentTotals", currency, delta);
            incrementPaymentTotal(saved.getRecipientUserId(), "paymentAllTotals", currency, delta);
        }
        return saved;
    }

    private String revisionRootSessionId(Payment payment) {
        if (payment == null) {
            return null;
        }
        if (hasText(payment.getRevisionRootSessionId())) {
            return normalizeId(payment.getRevisionRootSessionId());
        }
        if (hasText(payment.getCheckoutSessionId())) {
            return normalizeId(payment.getCheckoutSessionId());
        }
        if (hasText(payment.getGatewaySessionId())) {
            return normalizeId(payment.getGatewaySessionId());
        }
        return normalizeId(payment.getId());
    }

    private int revisionNumber(Payment payment) {
        return payment == null || payment.getRevisionNumber() == null
                ? 0
                : Math.max(0, payment.getRevisionNumber());
    }

    private int safeQuantity(Integer value) {
        return Math.max(1, value == null ? 1 : value);
    }

    private <T> List<T> copyNonNull(List<T> values) {
        return values == null
                ? List.of()
                : values.stream().filter(Objects::nonNull).toList();
    }

    private Optional<Payment> findByAnySessionId(String sessionId) {
        String normalizedSessionId = normalizeId(sessionId);
        if (!hasText(normalizedSessionId)) {
            return Optional.empty();
        }
        return paymentsRepository.findByGatewaySessionId(normalizedSessionId)
                .or(() -> paymentsRepository.findByGatewayAuthorizationId(normalizedSessionId))
                .or(() -> paymentsRepository.findByCheckoutSessionId(normalizedSessionId))
                .or(() -> paymentsRepository.findById(normalizedSessionId));
    }

    private EventCheckoutRequestDto withCheckoutState(EventCheckoutRequestDto request, String checkoutState, String checkoutSessionId) {
        if (request == null) {
            return null;
        }
        String normalizedSessionId = normalizeId(checkoutSessionId);
        List<EventCheckoutBasketItemDto> basketItems = request.basketItems() == null
                ? List.of()
                : request.basketItems().stream()
                        .filter(Objects::nonNull)
                        .map(item -> new EventCheckoutBasketItemDto(
                                item.id(),
                                item.kind(),
                                item.sourceId(),
                                item.slotSourceId(),
                                item.slotTemplateId(),
                                item.selectedDateKey(),
                                item.subEventId(),
                                item.resourceType(),
                                item.label(),
                                item.detail(),
                                item.amount(),
                                item.currency(),
                                item.quantity(),
                                checkoutState,
                                item.resultState(),
                                item.pricingSummaryRows(),
                                hasText(item.checkoutSessionId()) ? item.checkoutSessionId() : normalizedSessionId,
                                item.createdAtIso(),
                                item.updatedAtIso(),
                                item.expiresAtIso()))
                        .toList();
        return new EventCheckoutRequestDto(
                request.userId(),
                request.sourceId(),
                request.slotSourceId(),
                request.optionalSubEventIds(),
                request.assetSelections(),
                request.acceptedPolicyIds(),
                basketItems,
                request.pricingSummaryRows(),
                checkoutState,
                request.lineItems(),
                request.totalAmount(),
                request.currency(),
                request.pendingReason(),
                normalizePromoCodes(request.appliedPromoCodes()),
                request.paymentMethodId());
    }

    private SavedPaymentMethod validateSelectedPaymentMethod(EventCheckoutRequestDto request, String provider) {
        String paymentMethodId = normalizeId(request == null ? null : request.paymentMethodId());
        if (!hasText(paymentMethodId)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Select a saved payment card.");
        }
        if (savedPaymentMethodsService == null) {
            throw new IllegalStateException("Saved payment methods are not configured.");
        }
        SavedPaymentMethod method = savedPaymentMethodsService.requireActive(
                normalizeId(request.userId()),
                paymentMethodId,
                null);
        if (enablePay && !safeText(provider).equalsIgnoreCase(safeText(method.getProvider()))) {
            throw new PaymentProviderChangedException(
                    HttpStatus.CONFLICT,
                    provider);
        }
        return method;
    }

    private void ensurePaymentRequestCompatible(Payment payment, EventCheckoutRequestDto request) {
        if (payment == null) {
            return;
        }
        ensureSameValue("user", payment.getUserId(), normalizeId(request == null ? null : request.userId()));
        ensureSameValue("source", payment.getSourceId(), normalizeId(request == null ? null : request.sourceId()));
        ensureSameValue("currency", payment.getCurrency(), request == null ? null : safeCurrency(request.currency()));
        double requestedAmount = request == null ? 0D : safeAmount(request.totalAmount());
        double existingAmount = safeAmount(payment.getAmount());
        boolean persistedOrSessionBound = hasText(payment.getId())
                || hasText(payment.getCheckoutSessionId())
                || hasText(payment.getGatewaySessionId());
        if (persistedOrSessionBound && roundMoney(existingAmount) != roundMoney(requestedAmount)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Payment session amount cannot be changed.");
        }
    }

    private void ensureSameValue(String label, String existing, String requested) {
        String normalizedExisting = normalizeId(existing);
        String normalizedRequested = normalizeId(requested);
        if (hasText(normalizedExisting) && hasText(normalizedRequested) && !normalizedExisting.equals(normalizedRequested)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Payment session " + label + " cannot be changed.");
        }
    }

    private RefundComputation computeRefund(
            double paidAmount,
            String currency,
            PricingCancellationPolicyDto policy,
            String bookingStartAtIso,
            String cancelledAtIso) {
        if (paidAmount <= 0) {
            return new RefundComputation(0D, currency, REFUND_STATUS_NONE, null, "This booking did not charge a paid amount.");
        }

        LocalDateTime bookingStart = parseDateTime(bookingStartAtIso);
        LocalDateTime cancelledAt = parseDateTime(cancelledAtIso);
        if (bookingStart == null || cancelledAt == null || policy == null || !Boolean.TRUE.equals(policy.enabled())) {
            return new RefundComputation(0D, currency, REFUND_STATUS_NOT_ELIGIBLE, null, "No cancellation reimbursement policy was active for this booking.");
        }

        PricingCancellationRuleDto eligibleRule = resolveEligibleRule(policy.rules(), bookingStart, cancelledAt);
        if (eligibleRule == null) {
            return new RefundComputation(0D, currency, REFUND_STATUS_NOT_ELIGIBLE, null, "This cancellation falls outside the configured reimbursement windows.");
        }

        double refundAmount = switch (safeText(eligibleRule.refundKind())) {
            case "full" -> paidAmount;
            case "fixed_amount" -> Math.min(paidAmount, safeAmount(eligibleRule.refundValue()));
            case "none" -> 0D;
            default -> roundMoney(paidAmount * (Math.max(0D, Math.min(100D, safeAmount(eligibleRule.refundValue()))) / 100D));
        };
        refundAmount = roundMoney(refundAmount);

        String status = refundAmount <= 0
                ? REFUND_STATUS_NOT_ELIGIBLE
                : refundAmount >= roundMoney(paidAmount)
                    ? REFUND_STATUS_FULL
                    : REFUND_STATUS_PARTIAL;
        return new RefundComputation(
                refundAmount,
                currency,
                status,
                normalizeId(eligibleRule.id()),
                describeRefund(eligibleRule));
    }

    private PricingCancellationRuleDto resolveEligibleRule(
            List<PricingCancellationRuleDto> rules,
            LocalDateTime bookingStart,
            LocalDateTime cancelledAt) {
        if (rules == null || rules.isEmpty()) {
            return null;
        }

        PricingCancellationRuleDto bestRule = null;
        LocalDateTime bestDeadline = null;
        for (PricingCancellationRuleDto rule : rules) {
            if (rule == null) {
                continue;
            }
            LocalDateTime deadline = applyOffset(bookingStart, rule);
            if (deadline == null || cancelledAt.isAfter(deadline)) {
                continue;
            }
            if (bestRule == null || deadline.isBefore(bestDeadline)) {
                bestRule = rule;
                bestDeadline = deadline;
            }
        }
        return bestRule;
    }

    private LocalDateTime applyOffset(LocalDateTime bookingStart, PricingCancellationRuleDto rule) {
        int offsetValue = Math.max(0, rule.offsetValue() == null ? 0 : rule.offsetValue());
        return switch (safeText(rule.offsetUnit())) {
            case "hours" -> bookingStart.minusHours(offsetValue);
            case "weeks" -> bookingStart.minusWeeks(offsetValue);
            case "months" -> bookingStart.minusMonths(offsetValue);
            default -> bookingStart.minusDays(offsetValue);
        };
    }

    private String describeRefund(PricingCancellationRuleDto rule) {
        String window = Math.max(0, rule.offsetValue() == null ? 0 : rule.offsetValue()) + " " + safeText(rule.offsetUnit());
        return switch (safeText(rule.refundKind())) {
            case "full" -> "Full refund when cancelled at least " + window + " before start.";
            case "fixed_amount" -> "Refund " + roundMoney(safeAmount(rule.refundValue())) + " when cancelled at least " + window + " before start.";
            case "none" -> "No refund within the " + window + " cancellation window.";
            default -> "Refund " + roundMoney(safeAmount(rule.refundValue())) + "% when cancelled at least " + window + " before start.";
        };
    }

    private EventCheckoutSessionDto createDummySession(EventCheckoutRequestDto request, String existingSessionId) {
        String sessionId = hasText(existingSessionId) ? existingSessionId.trim() : "dummy_" + UUID.randomUUID();
        return new EventCheckoutSessionDto(
                sessionId,
                "dummy",
                "dummy",
                "approved",
                request == null ? 0D : request.totalAmount(),
                request == null ? "USD" : safeCurrency(request.currency()),
                null
        );
    }

    private String normalizeProvider(String provider) {
        String normalized = safeText(provider).toLowerCase();
        return hasText(normalized) ? normalized : "stripe";
    }

    private String resolveConfiguredProvider(String requestedProvider) {
        if (!enablePay) {
            return normalizeProvider(requestedProvider);
        }
        return savedPaymentMethodsService == null
                ? paymentProviderResolver.resolveActiveProvider(requestedProvider)
                : savedPaymentMethodsService.resolvePaymentProvider(requestedProvider);
    }

    private String safeCurrency(String currency) {
        String normalized = safeText(currency).toUpperCase();
        return hasText(normalized) ? normalized : "USD";
    }

    private List<String> normalizeStrings(List<String> values) {
        if (values == null || values.isEmpty()) {
            return List.of();
        }
        return values.stream()
                .map(this::normalizeId)
                .filter(this::hasText)
                .distinct()
                .toList();
    }

    private List<String> normalizePromoCodes(List<String> values) {
        if (values == null || values.isEmpty()) {
            return List.of();
        }
        return values.stream()
                .map(this::safeText)
                .filter(this::hasText)
                .map(value -> value.toUpperCase(java.util.Locale.ROOT))
                .distinct()
                .toList();
    }

    private LocalDateTime parseDateTime(String value) {
        if (!hasText(value)) {
            return null;
        }
        try {
            return LocalDateTime.parse(value.trim());
        } catch (DateTimeParseException ignored) {
        }
        try {
            return Instant.parse(value.trim()).atOffset(ZoneOffset.UTC).toLocalDateTime();
        } catch (DateTimeParseException ignored) {
            return null;
        }
    }

    private long sortableIso(String value) {
        LocalDateTime parsed = parseDateTime(value);
        return parsed == null ? Long.MIN_VALUE : parsed.toInstant(ZoneOffset.UTC).toEpochMilli();
    }

    private String normalizeId(String value) {
        return hasText(value) ? value.trim() : null;
    }

    private String safeText(String value) {
        return value == null ? "" : value.trim();
    }

    private boolean hasText(String value) {
        return StringUtils.hasText(value);
    }

    private String nowIso() {
        return Instant.now().toString();
    }

    private double safeAmount(Double value) {
        return value == null ? 0D : roundMoney(value);
    }

    private double roundMoney(double value) {
        return Math.round(Math.max(0D, value) * 100D) / 100D;
    }

    private double roundSignedMoney(double value) {
        return Math.round(value * 100D) / 100D;
    }

    private record RefundComputation(
            double amount,
            String currency,
            String status,
            String ruleId,
            String note) {
    }
}

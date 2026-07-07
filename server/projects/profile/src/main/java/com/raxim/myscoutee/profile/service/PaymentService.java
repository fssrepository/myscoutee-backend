package com.raxim.myscoutee.profile.service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.time.format.DateTimeParseException;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.server.ResponseStatusException;

import com.raxim.myscoutee.profile.data.document.Payment;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventCheckoutBasketItemDto;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventCheckoutRequestDto;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventCheckoutSessionDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.PricingCancellationPolicyDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.PricingCancellationRuleDto;
import com.raxim.myscoutee.profile.repository.PaymentsRepository;

@Service
public class PaymentService {
    private static final String BOOKING_STATUS_INITIATED = "initiated";
    private static final String BOOKING_STATUS_JOINED = "joined";
    private static final String BOOKING_STATUS_CANCELLED = "cancelled";
    private static final String REFUND_STATUS_NONE = "none";
    private static final String REFUND_STATUS_NOT_ELIGIBLE = "not_eligible";
    private static final String REFUND_STATUS_PARTIAL = "partial";
    private static final String REFUND_STATUS_FULL = "full";

    private final Map<String, PaymentProcessor> processors;
    private final PaymentsRepository paymentsRepository;
    private final EventCheckoutBasketService eventCheckoutBasketService;

    @Value("${payment.enablePay:false}")
    private boolean enablePay;

    public PaymentService(
            List<PaymentProcessor> processorList,
            PaymentsRepository paymentsRepository,
            EventCheckoutBasketService eventCheckoutBasketService) {
        this.processors = processorList.stream()
                .collect(Collectors.toMap(PaymentProcessor::getType, p -> p));
        this.paymentsRepository = paymentsRepository;
        this.eventCheckoutBasketService = eventCheckoutBasketService;
    }

    public EventCheckoutSessionDto checkout(EventCheckoutRequestDto request, String provider) {
        String normalizedProvider = normalizeProvider(provider);
        EventCheckoutSessionDto sessionDto = !enablePay
                ? createDummySession(request, null)
                : resolveProcessor(normalizedProvider).checkout(request);

        Payment payment = findByAnySessionId(sessionDto.id()).orElseGet(Payment::new);
        ensurePaymentRequestCompatible(payment, request);
        hydratePaymentRequest(payment, request, normalizedProvider);
        payment.setCheckoutSessionId(sessionDto.id());
        if (!enablePay) {
            payment.setGatewaySessionId(sessionDto.id());
        }
        payment.setStatus(safeText(sessionDto.status()));
        payment.setBookingStatus(hasText(payment.getBookingStatus()) ? payment.getBookingStatus() : BOOKING_STATUS_INITIATED);
        payment.setRefundStatus(hasText(payment.getRefundStatus()) ? payment.getRefundStatus() : REFUND_STATUS_NONE);
        payment.setCreatedDate(hasText(payment.getCreatedDate()) ? payment.getCreatedDate() : nowIso());
        paymentsRepository.save(payment);
        eventCheckoutBasketService.saveBasket(withCheckoutState(request, "confirmed", sessionDto.id()));
        return sessionDto;
    }

    public EventCheckoutSessionDto pay(EventCheckoutRequestDto request, String paymentSessionId, String provider) {
        String normalizedProvider = normalizeProvider(provider);
        Payment payment = findByAnySessionId(paymentSessionId).orElseGet(Payment::new);
        ensurePaymentRequestCompatible(payment, request);
        EventCheckoutSessionDto sessionDto = !enablePay
                ? createDummySession(request, paymentSessionId)
                : resolveProcessor(normalizedProvider).pay(request, paymentSessionId);

        hydratePaymentRequest(payment, request, normalizedProvider);
        payment.setCheckoutSessionId(hasText(payment.getCheckoutSessionId()) ? payment.getCheckoutSessionId() : normalizeId(paymentSessionId));
        payment.setGatewaySessionId(normalizeId(sessionDto.id()));
        payment.setStatus(safeText(sessionDto.status()));
        payment.setBookingStatus(hasText(payment.getBookingStatus()) ? payment.getBookingStatus() : BOOKING_STATUS_INITIATED);
        payment.setRefundStatus(hasText(payment.getRefundStatus()) ? payment.getRefundStatus() : REFUND_STATUS_NONE);
        payment.setCreatedDate(hasText(payment.getCreatedDate()) ? payment.getCreatedDate() : nowIso());
        paymentsRepository.save(payment);
        eventCheckoutBasketService.saveBasket(withCheckoutState(request, "pay", payment.getCheckoutSessionId()));
        return sessionDto;
    }

    public void recordEventJoin(
            String paymentSessionId,
            String userId,
            String sourceId,
            String slotSourceId,
            String bookingStartAtIso,
            PricingCancellationPolicyDto cancellationPolicy) {
        recordBooking(paymentSessionId, userId, sourceId, slotSourceId, bookingStartAtIso, cancellationPolicy);
    }

    public void recordAssetBooking(
            String paymentSessionId,
            String userId,
            String sourceId,
            String slotSourceId,
            String bookingStartAtIso,
            PricingCancellationPolicyDto cancellationPolicy) {
        recordBooking(paymentSessionId, userId, sourceId, slotSourceId, bookingStartAtIso, cancellationPolicy);
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

    private void recordBooking(
            String paymentSessionId,
            String userId,
            String sourceId,
            String slotSourceId,
            String bookingStartAtIso,
            PricingCancellationPolicyDto cancellationPolicy) {
        Payment payment = findByAnySessionId(paymentSessionId).orElse(null);
        if (payment == null) {
            return;
        }

        String normalizedUserId = normalizeId(userId);
        String normalizedSourceId = normalizeId(sourceId);
        if (!hasText(normalizedSourceId)) {
            return;
        }

        if (hasText(normalizedUserId)) {
            payment.setUserId(normalizedUserId);
        }
        payment.setSourceId(normalizedSourceId);
        payment.setSlotSourceId(normalizeId(slotSourceId));
        payment.setBookingStartAtIso(hasText(bookingStartAtIso) ? bookingStartAtIso.trim() : payment.getBookingStartAtIso());
        payment.setCancellationPolicy(cancellationPolicy);
        if (!BOOKING_STATUS_JOINED.equals(safeText(payment.getBookingStatus())) || !hasText(payment.getJoinedAtIso())) {
            payment.setJoinedAtIso(nowIso());
        }
        payment.setBookingStatus(BOOKING_STATUS_JOINED);
        if (!hasText(payment.getRefundStatus())) {
            payment.setRefundStatus(REFUND_STATUS_NONE);
        }
        paymentsRepository.save(payment);
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
            payment.setStatus(REFUND_STATUS_FULL.equals(refund.status()) ? "refunded" : "partially_refunded");
        }
        paymentsRepository.save(payment);
    }

    private Optional<Payment> findLatestOpenEventPayment(String userId, String sourceId) {
        String normalizedUserId = normalizeId(userId);
        String normalizedSourceId = normalizeId(sourceId);
        if (!hasText(normalizedUserId) || !hasText(normalizedSourceId)) {
            return Optional.empty();
        }
        return paymentsRepository.findByUserIdAndSourceId(normalizedUserId, normalizedSourceId).stream()
                .filter(Objects::nonNull)
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

    private void hydratePaymentRequest(Payment payment, EventCheckoutRequestDto request, String provider) {
        payment.setUserId(normalizeId(request == null ? null : request.userId()));
        payment.setSourceId(normalizeId(request == null ? null : request.sourceId()));
        payment.setProvider(provider);
        payment.setAmount(request == null ? 0D : safeAmount(request.totalAmount()));
        payment.setCurrency(request == null ? "USD" : safeCurrency(request.currency()));
        payment.setSlotSourceId(normalizeId(request == null ? null : request.slotSourceId()));
        payment.setOptionalSubEventIds(request == null ? List.of() : normalizeStrings(request.optionalSubEventIds()));
        payment.setAcceptedPolicyIds(request == null ? List.of() : normalizeStrings(request.acceptedPolicyIds()));
        payment.setBasketItems(request == null || request.basketItems() == null ? List.of() : request.basketItems());
        payment.setPricingSummaryRows(request == null || request.pricingSummaryRows() == null ? List.of() : request.pricingSummaryRows());
        payment.setLineItems(request == null || request.lineItems() == null ? List.of() : request.lineItems());
    }

    private Optional<Payment> findByAnySessionId(String sessionId) {
        String normalizedSessionId = normalizeId(sessionId);
        if (!hasText(normalizedSessionId)) {
            return Optional.empty();
        }
        return paymentsRepository.findByGatewaySessionId(normalizedSessionId)
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
                request.pendingReason());
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
        if (existingAmount > 0D && requestedAmount > 0D && roundMoney(existingAmount) != roundMoney(requestedAmount)) {
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

    private record RefundComputation(
            double amount,
            String currency,
            String status,
            String ruleId,
            String note) {
    }
}

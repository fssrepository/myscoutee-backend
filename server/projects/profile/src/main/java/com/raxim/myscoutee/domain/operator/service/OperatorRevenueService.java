package com.raxim.myscoutee.domain.operator.service;

import com.raxim.myscoutee.domain.operator.mapper.OperatorRevenueMapper;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.Clock;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.TreeMap;
import java.util.TreeSet;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.raxim.myscoutee.domain.assets.api.AssetCatalog;
import com.raxim.myscoutee.domain.events.api.EventOwnership.Event;
import com.raxim.myscoutee.domain.assets.api.AssetOwnership.Asset;
import com.raxim.myscoutee.domain.assets.dto.AssetDetails.AssetRequestRecord;
import com.raxim.myscoutee.domain.payments.api.RevenuePayment;
import com.raxim.myscoutee.domain.events.api.EventOwnership.SubEvent;
import com.raxim.myscoutee.domain.operator.dto.OperatorRevenueDtos.OperatorRevenueDto;
import com.raxim.myscoutee.common.dto.SharedDtos.PricingConfigDto;
import com.raxim.myscoutee.common.dto.SharedDtos.PricingSlotOverrideDto;
import com.raxim.myscoutee.domain.events.api.EventOwnershipReads;
import com.raxim.myscoutee.domain.assets.api.AssetOwnershipReads;
import com.raxim.myscoutee.domain.payments.api.PaymentRevenue;
import com.raxim.myscoutee.domain.registry.api.RegistryProtocol;

@Service
public class OperatorRevenueService {
    public static final String RULESET_VERSION =
            RegistryProtocol.REVENUE_RULESET_VERSION;
    public static final int COMMISSION_RATE_BASIS_POINTS =
            RegistryProtocol.REVENUE_COMMISSION_RATE_BASIS_POINTS;

    private static final Logger LOGGER =
            LoggerFactory.getLogger(OperatorRevenueService.class);
    private static final int TIMELINE_DAYS = 14;
    private static final Set<String> FINALIZED_PAYMENT_STATUSES =
            Set.of("approved", "partially_refunded", "refunded");
    private static final Set<String> REFUNDED_PAYMENT_STATUSES =
            Set.of("partially_refunded", "refunded");
    private static final String PAYMENT_AUDIT_KIND = "payment";
    private static final String SIMULATED_PAYMENT_PROVIDER = "dummy";
    private static final String STATUS_ACCEPTED = "accepted";
    private static final String REQUEST_KIND_BORROW = "borrow";

    private final EventOwnershipReads activityEventsRepository;
    private final AssetOwnershipReads assetsRepository;
    private final PaymentRevenue paymentsRepository;
    private final OperatorRevenueMapper mapper;
    private final Clock clock;

    @Autowired
    public OperatorRevenueService(
            EventOwnershipReads activityEventsRepository,
            AssetOwnershipReads assetsRepository,
            PaymentRevenue paymentsRepository,
            OperatorRevenueMapper mapper) {
        this(
                activityEventsRepository,
                assetsRepository,
                paymentsRepository,
                mapper,
                Clock.systemUTC());
    }

    OperatorRevenueService(
            EventOwnershipReads activityEventsRepository,
            AssetOwnershipReads assetsRepository,
            PaymentRevenue paymentsRepository,
            OperatorRevenueMapper mapper,
            Clock clock) {
        this.activityEventsRepository = Objects.requireNonNull(activityEventsRepository);
        this.assetsRepository = Objects.requireNonNull(assetsRepository);
        this.paymentsRepository = Objects.requireNonNull(paymentsRepository);
        this.mapper = Objects.requireNonNull(mapper);
        this.clock = Objects.requireNonNull(clock);
    }

    public OperatorRevenueDto revenue() {
        OperatorRevenueSnapshot snapshot = snapshot();
        logRejectedRecords(snapshot.diagnostics());
        return mapper.toDto(snapshot);
    }

    OperatorRevenueSnapshot snapshot() {
        Instant now = clock.instant();
        Accumulation accumulation = new Accumulation(now);
        accumulateEvents(accumulation, activityEventsRepository.findAll());
        accumulateAssets(accumulation, assetsRepository.findAll());
        accumulatePayments(
                accumulation,
                paymentsRepository.findRevenueCandidates(),
                null);
        return accumulation.snapshot();
    }

    /**
     * Returns only finalized, captured-payment accounting for one original
     * payment UTC day. Projections and user identifiers never leave this
     * service.
     */
    DailyRevenueSnapshot dailyRevenue(LocalDate period) {
        Objects.requireNonNull(period, "Revenue period must not be null.");
        return dailyRevenueHistory(Set.of(period)).stream()
                .filter(snapshot -> period.equals(snapshot.period()))
                .findFirst()
                .orElseThrow();
    }

    /**
     * Builds finalized-payment aggregates for the requested days with one
     * repository read. Every requested period is materialized even when it
     * contains no payments.
     */
    List<DailyRevenueSnapshot> dailyRevenueHistory(
            Set<LocalDate> requiredPeriods) {
        Instant generatedAt = clock.instant();
        Map<LocalDate, Accumulation> byPeriod = new TreeMap<>();
        for (LocalDate period : requiredPeriods == null
                ? Set.<LocalDate>of()
                : requiredPeriods) {
            if (period != null) {
                byPeriod.put(period, new Accumulation(generatedAt));
            }
        }
        long unmappedTimestampRecords = 0L;
        for (RevenuePayment payment
                : nonNull(paymentsRepository.findRevenueCandidates())) {
            if (isSimulatedPayment(payment)
                    || isPaymentRevision(payment)
                    || !FINALIZED_PAYMENT_STATUSES.contains(
                            normalize(payment.getStatus()))) {
                continue;
            }
            Optional<LocalDate> originalDay = parseUtcDay(
                    payment.getCreatedDate());
            if (originalDay.isEmpty()) {
                unmappedTimestampRecords++;
                continue;
            }
            Accumulation accumulation = byPeriod.get(originalDay.get());
            if (accumulation == null) {
                continue;
            }
            accumulatePayment(accumulation, payment, originalDay.get());
        }
        if (unmappedTimestampRecords > 0L) {
            LOGGER.warn(
                    "Operator daily revenue ignored {} finalized payment(s) with invalid UTC timestamps.",
                    unmappedTimestampRecords);
        }
        return byPeriod.entrySet().stream()
                .map(entry -> dailySnapshot(
                        entry.getKey(),
                        entry.getValue().snapshot()))
                .toList();
    }

    /**
     * Discovers the completed UTC days that contain at least one finalized,
     * non-simulated payment candidate. This is used only to establish the
     * historical backfill boundary; the actual amount and currency validation
     * still happens while building each immutable daily snapshot.
     */
    Set<LocalDate> finalizedRevenuePeriodsBefore(LocalDate exclusiveEnd) {
        Objects.requireNonNull(
                exclusiveEnd,
                "Revenue period upper bound must not be null.");
        Set<LocalDate> periods = new TreeSet<>();
        for (RevenuePayment payment
                : nonNull(paymentsRepository.findRevenueCandidates())) {
            if (isSimulatedPayment(payment)
                    || isPaymentRevision(payment)
                    || !FINALIZED_PAYMENT_STATUSES.contains(
                            normalize(payment.getStatus()))) {
                continue;
            }
            parseUtcDay(payment.getCreatedDate())
                    .filter(period -> period.isBefore(exclusiveEnd))
                    .ifPresent(periods::add);
        }
        return Set.copyOf(periods);
    }

    private DailyRevenueSnapshot dailySnapshot(
            LocalDate period,
            OperatorRevenueSnapshot snapshot) {
        logRejectedRecords(snapshot.diagnostics());
        return new DailyRevenueSnapshot(
                period,
                snapshot.currencies().stream()
                        .map(currency -> new DailyCurrencyRevenue(
                                currency.currencyCode(),
                                currency.fractionDigits(),
                                currency.capturedPaymentMinor(),
                                currency.refundedPaymentMinor(),
                                currency.netPaymentMinor(),
                                currency.commissionBasisMinor(),
                                currency.estimatedCommissionMinor(),
                                currency.paymentCount()))
                        .toList(),
                snapshot.diagnostics());
    }

    private void accumulateEvents(
            Accumulation accumulation,
            List<? extends Event> events) {
        for (Event event : nonNull(events)) {
            if (Boolean.TRUE.equals(event.getGenerated())
                    || !StringUtils.hasText(safeText(event.getSourceId()))
                    || !Boolean.TRUE.equals(event.getTicketing())) {
                continue;
            }
            accumulation.eventSourceIds.add(event.getSourceId().trim());
            Map<CurrencyKey, Long> unitMinorByCurrency = new TreeMap<>();
            addPricingUnit(
                    accumulation,
                    unitMinorByCurrency,
                    event.getPricing());
            for (SubEvent subEvent : nonNull(event.getSubEvents())) {
                if (Boolean.TRUE.equals(subEvent.optional())) {
                    addPricingUnit(
                            accumulation,
                            unitMinorByCurrency,
                            subEvent.pricing());
                }
            }
            if (unitMinorByCurrency.isEmpty()) {
                continue;
            }
            long capacity = positiveCount(event.getCapacityTotal());
            Optional<LocalDate> createdDay = parseUtcDay(
                    firstNonBlank(event.getCreatedDate(), event.getUpdatedDate()));
            if (createdDay.isEmpty()) {
                accumulation.diagnostics.invalidTimestampRecords++;
            }
            for (Map.Entry<CurrencyKey, Long> entry : unitMinorByCurrency.entrySet()) {
                if (entry.getValue() <= 0L) {
                    continue;
                }
                long projected;
                try {
                    projected = Math.multiplyExact(entry.getValue(), capacity);
                } catch (ArithmeticException exception) {
                    accumulation.diagnostics.invalidMonetaryRecords++;
                    continue;
                }
                CurrencyAccumulator currency =
                        accumulation.currency(entry.getKey());
                TimelineAccumulator timeline =
                        createdDay.map(currency::timeline).orElse(null);
                try {
                    long nextPayableEvents =
                            Math.addExact(currency.payableEvents, 1L);
                    long nextProjectedEventMinor =
                            Math.addExact(currency.projectedEventMinor, projected);
                    long nextTimelinePayableEvents = timeline == null
                            ? 0L
                            : Math.addExact(timeline.payableEvents, 1L);
                    long nextTimelineProjectedEventMinor = timeline == null
                            ? 0L
                            : Math.addExact(
                                    timeline.projectedEventMinor,
                                    projected);
                    currency.payableEvents = nextPayableEvents;
                    currency.projectedEventMinor = nextProjectedEventMinor;
                    if (timeline != null) {
                        timeline.payableEvents = nextTimelinePayableEvents;
                        timeline.projectedEventMinor =
                                nextTimelineProjectedEventMinor;
                    }
                } catch (ArithmeticException exception) {
                    accumulation.diagnostics.invalidMonetaryRecords++;
                }
            }
        }
    }

    private void accumulateAssets(
            Accumulation accumulation,
            List<? extends Asset> assets) {
        for (Asset asset : nonNull(assets)) {
            if (!StringUtils.hasText(safeText(asset.getAssetId()))) {
                continue;
            }
            accumulation.assetIds.add(asset.getAssetId().trim());
            Map<CurrencyKey, Long> unitMinorByCurrency = new TreeMap<>();
            addPricingUnit(accumulation, unitMinorByCurrency, asset.getPricing());
            if (unitMinorByCurrency.isEmpty()) {
                continue;
            }
            long quantity = positiveCount(asset.getQuantity());
            Optional<LocalDate> createdDay = parseUtcDay(
                    firstNonBlank(asset.getCreatedDate(), asset.getUpdatedDate()));
            if (createdDay.isEmpty()) {
                accumulation.diagnostics.invalidTimestampRecords++;
            }
            String category = assetRevenueCategory(asset);
            for (Map.Entry<CurrencyKey, Long> entry : unitMinorByCurrency.entrySet()) {
                if (entry.getValue() <= 0L) {
                    continue;
                }
                long projected;
                try {
                    projected = Math.multiplyExact(entry.getValue(), quantity);
                } catch (ArithmeticException exception) {
                    accumulation.diagnostics.invalidMonetaryRecords++;
                    continue;
                }
                CurrencyAccumulator currency =
                        accumulation.currency(entry.getKey());
                CategoryAccumulator categoryAccumulator =
                        currency.categories.computeIfAbsent(
                                category,
                                ignored -> new CategoryAccumulator(category));
                TimelineAccumulator timeline =
                        createdDay.map(currency::timeline).orElse(null);
                try {
                    long nextPayableAssets =
                            Math.addExact(currency.payableAssets, 1L);
                    long nextProjectedAssetMinor =
                            Math.addExact(currency.projectedAssetMinor, projected);
                    long nextCategoryPayableAssets =
                            Math.addExact(categoryAccumulator.payableAssets, 1L);
                    long nextCategoryProjectedMinor =
                            Math.addExact(
                                    categoryAccumulator.projectedMinor,
                                    projected);
                    long nextTimelinePayableAssets = timeline == null
                            ? 0L
                            : Math.addExact(timeline.payableAssets, 1L);
                    long nextTimelineProjectedAssetMinor = timeline == null
                            ? 0L
                            : Math.addExact(
                                    timeline.projectedAssetMinor,
                                    projected);
                    currency.payableAssets = nextPayableAssets;
                    currency.projectedAssetMinor = nextProjectedAssetMinor;
                    categoryAccumulator.payableAssets =
                            nextCategoryPayableAssets;
                    categoryAccumulator.projectedMinor =
                            nextCategoryProjectedMinor;
                    if (timeline != null) {
                        timeline.payableAssets = nextTimelinePayableAssets;
                        timeline.projectedAssetMinor =
                                nextTimelineProjectedAssetMinor;
                    }
                } catch (ArithmeticException exception) {
                    accumulation.diagnostics.invalidMonetaryRecords++;
                    continue;
                }
                for (AssetRequestRecord request : nonNull(asset.getRequests())) {
                    if (isAcceptedBorrowRequest(request)
                            && StringUtils.hasText(safeText(request.userId()))) {
                        currency.assetBorrowers.add(request.userId().trim());
                    }
                }
            }
        }
    }

    private void accumulatePayments(
            Accumulation accumulation,
            List<? extends RevenuePayment> payments,
            LocalDate onlyOriginalPaymentDay) {
        for (RevenuePayment payment : nonNull(payments)) {
            accumulatePayment(
                    accumulation,
                    payment,
                    onlyOriginalPaymentDay);
        }
    }

    private void accumulatePayment(
            Accumulation accumulation,
            RevenuePayment payment,
            LocalDate onlyOriginalPaymentDay) {
        if (isSimulatedPayment(payment)) {
            accumulation.diagnostics.excludedSimulatedPayments++;
            return;
        }
        if (isPaymentRevision(payment)) {
            accumulation.diagnostics.excludedPaymentRevisions++;
            return;
        }
        String status = normalize(payment.getStatus());
        if (!FINALIZED_PAYMENT_STATUSES.contains(status)) {
            accumulation.diagnostics.excludedUnfinalizedPayments++;
            return;
        }
        Optional<LocalDate> createdDay = parseUtcDay(payment.getCreatedDate());
        if (createdDay.isEmpty()) {
            accumulation.diagnostics.invalidTimestampRecords++;
            if (onlyOriginalPaymentDay != null) {
                return;
            }
        }
        if (onlyOriginalPaymentDay != null
                && !onlyOriginalPaymentDay.equals(createdDay.orElse(null))) {
            return;
        }
        Optional<CurrencyKey> currencyKey = currency(
                payment.getCurrency(),
                accumulation.diagnostics);
        if (currencyKey.isEmpty()) {
            return;
        }
        Optional<Long> capturedMinor = moneyToMinor(
                payment.getAmount(),
                currencyKey.get(),
                accumulation.diagnostics);
        if (capturedMinor.isEmpty() || capturedMinor.get() <= 0L) {
            if (capturedMinor.isPresent()) {
                accumulation.diagnostics.invalidMonetaryRecords++;
            }
            return;
        }
        Optional<Long> refundedMinor = refundMinor(
                payment,
                status,
                currencyKey.get(),
                capturedMinor.get(),
                accumulation.diagnostics);
        if (refundedMinor.isEmpty()) {
            return;
        }
        CurrencyAccumulator currency =
                accumulation.currency(currencyKey.get());
        TimelineAccumulator timeline =
                createdDay.map(currency::timeline).orElse(null);
        try {
            long nextCapturedPaymentMinor = Math.addExact(
                    currency.capturedPaymentMinor,
                    capturedMinor.get());
            long nextRefundedPaymentMinor = Math.addExact(
                    currency.refundedPaymentMinor,
                    refundedMinor.get());
                long nextPaymentCount =
                        Math.addExact(currency.paymentCount, 1L);
                if (nextCapturedPaymentMinor
                                > RegistryProtocol.REVENUE_MAX_MINOR
                        || nextRefundedPaymentMinor
                                > RegistryProtocol.REVENUE_MAX_MINOR
                        || nextPaymentCount
                                > RegistryProtocol
                                        .REVENUE_MAX_PAYMENT_COUNT) {
                    throw new ArithmeticException(
                            "Revenue protocol aggregate limit exceeded.");
                }
            long nextTimelineCapturedPaymentMinor = timeline == null
                    ? 0L
                    : Math.addExact(
                            timeline.capturedPaymentMinor,
                            capturedMinor.get());
            long nextTimelineRefundedPaymentMinor = timeline == null
                    ? 0L
                    : Math.addExact(
                            timeline.refundedPaymentMinor,
                            refundedMinor.get());
            long nextTimelinePaymentCount = timeline == null
                    ? 0L
                    : Math.addExact(timeline.paymentCount, 1L);
            currency.capturedPaymentMinor = nextCapturedPaymentMinor;
            currency.refundedPaymentMinor = nextRefundedPaymentMinor;
            currency.paymentCount = nextPaymentCount;
            if (timeline != null) {
                timeline.capturedPaymentMinor =
                        nextTimelineCapturedPaymentMinor;
                timeline.refundedPaymentMinor =
                        nextTimelineRefundedPaymentMinor;
                timeline.paymentCount = nextTimelinePaymentCount;
            }
        } catch (ArithmeticException exception) {
            accumulation.diagnostics.invalidMonetaryRecords++;
            return;
        }
        String userId = safeText(payment.getUserId());
        if (StringUtils.hasText(userId)) {
            currency.payingUsers.add(userId);
            String sourceId = safeText(payment.getSourceId());
            if (accumulation.eventSourceIds.contains(sourceId)) {
                currency.eventBuyers.add(userId);
            }
            if (accumulation.assetIds.contains(sourceId)) {
                currency.assetBorrowers.add(userId);
            }
        }
        if (timeline != null && StringUtils.hasText(userId)) {
            timeline.payingUsers.add(userId);
        }
    }

    private void addPricingUnit(
            Accumulation accumulation,
            Map<CurrencyKey, Long> unitMinorByCurrency,
            PricingConfigDto pricing) {
        if (pricing == null || Boolean.FALSE.equals(pricing.enabled())) {
            return;
        }
        Optional<CurrencyKey> currency =
                currency(pricing.currency(), accumulation.diagnostics);
        if (currency.isEmpty()) {
            return;
        }
        Optional<Long> base = moneyToMinor(
                pricing.basePrice(),
                currency.get(),
                accumulation.diagnostics);
        if (base.isEmpty()) {
            return;
        }
        long unitMinor = base.get();
        if (Boolean.TRUE.equals(pricing.slotPricingEnabled())) {
            for (PricingSlotOverrideDto override : nonNull(pricing.slotOverrides())) {
                Optional<Long> candidate = moneyToMinor(
                        override.price(),
                        currency.get(),
                        accumulation.diagnostics);
                if (candidate.isPresent()) {
                    unitMinor = Math.max(unitMinor, candidate.get());
                }
            }
        }
        if (unitMinor > 0L) {
            try {
                unitMinorByCurrency.merge(
                        currency.get(),
                        unitMinor,
                        Math::addExact);
            } catch (ArithmeticException exception) {
                accumulation.diagnostics.invalidMonetaryRecords++;
            }
        }
    }

    private Optional<Long> refundMinor(
            RevenuePayment payment,
            String status,
            CurrencyKey currency,
            long capturedMinor,
            MutableDiagnostics diagnostics) {
        boolean refundedStatus = REFUNDED_PAYMENT_STATUSES.contains(status);
        Double refundedAmount = payment.getRefundedAmount();
        if (!refundedStatus) {
            if (refundedAmount == null || refundedAmount.doubleValue() == 0D) {
                return Optional.of(0L);
            }
            diagnostics.invalidRefundRecords++;
            return Optional.empty();
        }
        if (refundedAmount == null
                || !Double.isFinite(refundedAmount)
                || refundedAmount <= 0D) {
            diagnostics.invalidRefundRecords++;
            return Optional.empty();
        }
        Optional<CurrencyKey> refundCurrency =
                currency(payment.getRefundCurrency(), diagnostics);
        if (refundCurrency.isEmpty()) {
            return Optional.empty();
        }
        if (!currency.equals(refundCurrency.get())) {
            diagnostics.mismatchedRefundCurrencyRecords++;
            return Optional.empty();
        }
        Optional<Long> converted =
                moneyToMinor(refundedAmount, currency, diagnostics);
        if (converted.isEmpty()
                || converted.get() <= 0L
                || converted.get() > capturedMinor) {
            diagnostics.invalidRefundRecords++;
            return Optional.empty();
        }
        return converted;
    }

    private Optional<CurrencyKey> currency(
            String value,
            MutableDiagnostics diagnostics) {
        String normalized = safeText(value).toUpperCase(Locale.ROOT);
        if (!normalized.matches("[A-Z]{3}")) {
            diagnostics.invalidCurrencyRecords++;
            return Optional.empty();
        }
        try {
            int fractionDigits =
                    RegistryProtocol.revenueCurrencyFractionDigits(
                            normalized);
            return Optional.of(new CurrencyKey(
                    normalized,
                    fractionDigits));
        } catch (IllegalArgumentException exception) {
            diagnostics.invalidCurrencyRecords++;
            return Optional.empty();
        }
    }

    private Optional<Long> moneyToMinor(
            Number value,
            CurrencyKey currency,
            MutableDiagnostics diagnostics) {
        if (value == null
                || !Double.isFinite(value.doubleValue())
                || value.doubleValue() < 0D) {
            diagnostics.invalidMonetaryRecords++;
            return Optional.empty();
        }
        try {
            long minor = BigDecimal.valueOf(value.doubleValue())
                    .setScale(currency.fractionDigits(), RoundingMode.HALF_EVEN)
                    .movePointRight(currency.fractionDigits())
                    .longValueExact();
            if (minor > RegistryProtocol.REVENUE_MAX_MINOR) {
                diagnostics.invalidMonetaryRecords++;
                return Optional.empty();
            }
            return Optional.of(minor);
        } catch (ArithmeticException exception) {
            diagnostics.invalidMonetaryRecords++;
            return Optional.empty();
        }
    }

    static long commissionMinor(long netMinor) {
        if (netMinor < 0L) {
            throw new IllegalArgumentException(
                    "Commission basis must not be negative.");
        }
        return RegistryProtocol.revenueCommissionMinor(netMinor);
    }

    private Optional<LocalDate> parseUtcDay(String value) {
        try {
            return Optional.of(Instant.parse(safeText(value))
                    .atZone(ZoneOffset.UTC)
                    .toLocalDate());
        } catch (RuntimeException exception) {
            return Optional.empty();
        }
    }

    private boolean isPaymentRevision(RevenuePayment payment) {
        return StringUtils.hasText(safeText(payment.getAuditKind()))
                && !PAYMENT_AUDIT_KIND.equals(normalize(payment.getAuditKind()));
    }

    private boolean isSimulatedPayment(RevenuePayment payment) {
        return SIMULATED_PAYMENT_PROVIDER.equals(
                normalize(payment == null ? null : payment.getProvider()))
                || normalize(payment == null
                        ? null
                        : payment.getCheckoutSessionId())
                        .startsWith("dummy_")
                || normalize(payment == null
                        ? null
                        : payment.getGatewaySessionId())
                        .startsWith("dummy_");
    }

    private boolean isAcceptedBorrowRequest(AssetRequestRecord request) {
        return request != null
                && STATUS_ACCEPTED.equals(normalize(request.status()))
                && REQUEST_KIND_BORROW.equals(normalize(request.requestKind()));
    }

    private String assetRevenueCategory(Asset asset) {
        String value = firstNonBlank(asset.getType(), asset.getCategory());
        String normalized = normalize(value);
        if ("transport".equals(normalized) || "vehicle".equals(normalized)) {
            return AssetCatalog.TYPE_TRANSPORT;
        }
        if ("accommodation".equals(normalized)
                || "lodging".equals(normalized)
                || "property".equals(normalized)) {
            return AssetCatalog.TYPE_ACCOMMODATION;
        }
        if ("supplies".equals(normalized)
                || "supply".equals(normalized)
                || "equipment".equals(normalized)
                || "gear".equals(normalized)) {
            return AssetCatalog.TYPE_SUPPLIES;
        }
        return StringUtils.hasText(value) ? value.trim() : "Asset";
    }

    private long positiveCount(Number value) {
        return value == null ? 1L : Math.max(1L, value.longValue());
    }

    private void logRejectedRecords(
            OperatorRevenueSnapshot.RevenueDiagnostics diagnostics) {
        if (diagnostics.rejectedRecordCount() > 0L) {
            LOGGER.warn(
                    "Operator revenue ignored {} invalid record(s): currencies={}, money={}, "
                            + "refund-currency={}, refunds={}, timestamps={}.",
                    diagnostics.rejectedRecordCount(),
                    diagnostics.invalidCurrencyRecords(),
                    diagnostics.invalidMonetaryRecords(),
                    diagnostics.mismatchedRefundCurrencyRecords(),
                    diagnostics.invalidRefundRecords(),
                    diagnostics.invalidTimestampRecords());
        }
    }

    private static <T> List<T> nonNull(List<T> values) {
        return values == null
                ? List.of()
                : values.stream().filter(Objects::nonNull).toList();
    }

    private static String firstNonBlank(String first, String second) {
        return first != null && StringUtils.hasText(first)
                ? first.trim()
                : safeText(second);
    }

    private static String safeText(String value) {
        return value == null ? "" : value.trim();
    }

    private static String normalize(String value) {
        return safeText(value).toLowerCase(Locale.ROOT);
    }

    record DailyRevenueSnapshot(
            LocalDate period,
            List<DailyCurrencyRevenue> currencies,
            OperatorRevenueSnapshot.RevenueDiagnostics diagnostics) {
    }

    record DailyCurrencyRevenue(
            String currencyCode,
            int fractionDigits,
            long capturedMinor,
            long refundedMinor,
            long netMinor,
            long commissionBasisMinor,
            long estimatedCommissionMinor,
            long paymentCount) {
    }

    private record CurrencyKey(
            String currencyCode,
            int fractionDigits)
            implements Comparable<CurrencyKey> {
        @Override
        public int compareTo(CurrencyKey other) {
            return currencyCode.compareTo(other.currencyCode);
        }
    }

    private static final class Accumulation {
        private final Instant generatedAt;
        private final Map<CurrencyKey, CurrencyAccumulator> currencies =
                new TreeMap<>();
        private final Set<String> eventSourceIds = new LinkedHashSet<>();
        private final Set<String> assetIds = new LinkedHashSet<>();
        private final MutableDiagnostics diagnostics = new MutableDiagnostics();

        private Accumulation(Instant generatedAt) {
            this.generatedAt = generatedAt;
        }

        private CurrencyAccumulator currency(CurrencyKey key) {
            return currencies.computeIfAbsent(
                    key,
                    ignored -> new CurrencyAccumulator(key, generatedAt));
        }

        private OperatorRevenueSnapshot snapshot() {
            return new OperatorRevenueSnapshot(
                    generatedAt,
                    currencies.values().stream()
                            .map(CurrencyAccumulator::snapshot)
                            .toList(),
                    diagnostics.snapshot());
        }
    }

    private static final class CurrencyAccumulator {
        private final CurrencyKey key;
        private final LocalDate generatedOn;
        private long payableEvents;
        private long payableAssets;
        private long projectedEventMinor;
        private long projectedAssetMinor;
        private long capturedPaymentMinor;
        private long refundedPaymentMinor;
        private long paymentCount;
        private final Set<String> payingUsers = new LinkedHashSet<>();
        private final Set<String> eventBuyers = new LinkedHashSet<>();
        private final Set<String> assetBorrowers = new LinkedHashSet<>();
        private final Map<String, CategoryAccumulator> categories =
                new LinkedHashMap<>();
        private final Map<LocalDate, TimelineAccumulator> timeline =
                new TreeMap<>();

        private CurrencyAccumulator(CurrencyKey key, Instant generatedAt) {
            this.key = key;
            this.generatedOn = generatedAt.atZone(ZoneOffset.UTC).toLocalDate();
        }

        private TimelineAccumulator timeline(LocalDate day) {
            return timeline.computeIfAbsent(
                    day,
                    ignored -> new TimelineAccumulator());
        }

        private OperatorRevenueSnapshot.CurrencySnapshot snapshot() {
            long netMinor = Math.subtractExact(
                    capturedPaymentMinor,
                    refundedPaymentMinor);
            long commissionMinor = commissionMinor(netMinor);
            List<OperatorRevenueSnapshot.TimelinePointSnapshot> timelinePoints =
                    new ArrayList<>();
            for (int index = 0; index < TIMELINE_DAYS; index++) {
                LocalDate day = generatedOn.minusDays(TIMELINE_DAYS - 1L - index);
                TimelineAccumulator point =
                        timeline.getOrDefault(day, new TimelineAccumulator());
                timelinePoints.add(point.snapshot(day));
            }
            return new OperatorRevenueSnapshot.CurrencySnapshot(
                    key.currencyCode(),
                    key.fractionDigits(),
                    payableEvents,
                    payableAssets,
                    projectedEventMinor,
                    projectedAssetMinor,
                    capturedPaymentMinor,
                    refundedPaymentMinor,
                    netMinor,
                    netMinor,
                    commissionMinor,
                    paymentCount,
                    payingUsers.size(),
                    eventBuyers.size(),
                    assetBorrowers.size(),
                    categories.values().stream()
                            .sorted(Comparator
                                    .comparingLong(
                                            (CategoryAccumulator category) ->
                                                    category.projectedMinor)
                                    .reversed()
                                    .thenComparing(category -> category.label))
                            .map(CategoryAccumulator::snapshot)
                            .toList(),
                    List.copyOf(timelinePoints));
        }
    }

    private static final class CategoryAccumulator {
        private final String label;
        private long payableAssets;
        private long projectedMinor;

        private CategoryAccumulator(String label) {
            this.label = label;
        }

        private OperatorRevenueSnapshot.AssetCategorySnapshot snapshot() {
            return new OperatorRevenueSnapshot.AssetCategorySnapshot(
                    label,
                    label,
                    payableAssets,
                    projectedMinor);
        }
    }

    private static final class TimelineAccumulator {
        private long payableEvents;
        private long payableAssets;
        private long projectedEventMinor;
        private long projectedAssetMinor;
        private long capturedPaymentMinor;
        private long refundedPaymentMinor;
        private long paymentCount;
        private final Set<String> payingUsers = new LinkedHashSet<>();

        private OperatorRevenueSnapshot.TimelinePointSnapshot snapshot(
                LocalDate day) {
            long netMinor = Math.subtractExact(
                    capturedPaymentMinor,
                    refundedPaymentMinor);
            return new OperatorRevenueSnapshot.TimelinePointSnapshot(
                    day.format(DateTimeFormatter.ISO_LOCAL_DATE),
                    payableEvents,
                    payableAssets,
                    projectedEventMinor,
                    projectedAssetMinor,
                    capturedPaymentMinor,
                    refundedPaymentMinor,
                    netMinor,
                    netMinor,
                    commissionMinor(netMinor),
                    paymentCount,
                    payingUsers.size());
        }
    }

    private static final class MutableDiagnostics {
        private long invalidCurrencyRecords;
        private long invalidMonetaryRecords;
        private long mismatchedRefundCurrencyRecords;
        private long invalidRefundRecords;
        private long invalidTimestampRecords;
        private long excludedUnfinalizedPayments;
        private long excludedPaymentRevisions;
        private long excludedSimulatedPayments;

        private OperatorRevenueSnapshot.RevenueDiagnostics snapshot() {
            return new OperatorRevenueSnapshot.RevenueDiagnostics(
                    invalidCurrencyRecords,
                    invalidMonetaryRecords,
                    mismatchedRefundCurrencyRecords,
                    invalidRefundRecords,
                    invalidTimestampRecords,
                    excludedUnfinalizedPayments,
                    excludedPaymentRevisions,
                    excludedSimulatedPayments);
        }
    }
}

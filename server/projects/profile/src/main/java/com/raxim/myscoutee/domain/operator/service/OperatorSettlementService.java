package com.raxim.myscoutee.domain.operator.service;
import com.raxim.myscoutee.common.security.crypto.CanonicalValues;

import java.math.BigInteger;
import java.security.SecureRandom;
import java.time.Clock;
import java.time.Instant;
import java.time.YearMonth;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.server.ResponseStatusException;

import com.raxim.myscoutee.common.config.mongo.MongoSessionMode;
import com.raxim.myscoutee.common.config.mongo.MongoSessionModeContext;
import com.raxim.myscoutee.domain.operator.dto.OperatorRevenueDtos.OperatorSettlementDto;
import com.raxim.myscoutee.domain.operator.dto.OperatorRevenueDtos.OperatorSettlementPageDto;
import com.raxim.myscoutee.domain.registry.dto.RegistryRegisteredState.RegisteredRuntime;
import com.raxim.myscoutee.domain.operator.service.OperatorRevenueRegistryRuntimeResolver.Resolution;
import com.raxim.myscoutee.domain.registry.api.RegistryHttpException;
import com.raxim.myscoutee.domain.registry.api.RegistryProtocol;
import com.raxim.myscoutee.domain.registry.api.RegistryProtocol.SettlementHistoryItem;
import com.raxim.myscoutee.domain.registry.api.RegistryProtocol.SettlementQueryRequest;
import com.raxim.myscoutee.domain.registry.api.RegistryProtocol.SettlementQueryResponse;

import tools.jackson.databind.ObjectMapper;

/**
 * Reads the current deployment's private, registry-signed technical
 * settlements.
 *
 * <p>The registry remains the source of truth. This service neither projects
 * nor repairs settlement data in MongoDB; every response is verified against
 * the operator-selected registry trust anchor before it is mapped to the
 * frontend contract.</p>
 */
@Service
public class OperatorSettlementService {
    private final OperatorRevenueRegistryRuntimeResolver runtimeResolver;
    private final ObjectMapper objectMapper;
    private final Clock clock;
    private final SecureRandom secureRandom;

    @Autowired
    public OperatorSettlementService(
            OperatorRevenueRegistryRuntimeResolver runtimeResolver,
            ObjectMapper objectMapper) {
        this(
                runtimeResolver,
                objectMapper,
                Clock.systemUTC(),
                new SecureRandom());
    }

    OperatorSettlementService(
            OperatorRevenueRegistryRuntimeResolver runtimeResolver,
            ObjectMapper objectMapper,
            Clock clock,
            SecureRandom secureRandom) {
        this.runtimeResolver = Objects.requireNonNull(runtimeResolver);
        this.objectMapper = Objects.requireNonNull(objectMapper);
        this.clock = Objects.requireNonNull(clock);
        this.secureRandom = Objects.requireNonNull(secureRandom);
    }

    public OperatorSettlementPageDto settlements(
            String currencyCode,
            String fromPeriod,
            String throughPeriod,
            boolean includeSuperseded,
            int limit,
            String afterPeriod,
            String afterSettlementId) {
        Query query = validateQuery(
                currencyCode,
                fromPeriod,
                throughPeriod,
                includeSuperseded,
                limit,
                afterPeriod,
                afterSettlementId);
        RegisteredRuntime runtime = requireRuntime(
                MongoSessionModeContext.currentMode());
        Instant now = clock.instant();
        String timestamp = now.toString();
        String nonce = RegistryProtocol.randomToken(
                "nonce_",
                secureRandom);
        String queryId = RegistryProtocol.randomToken(
                "query_",
                secureRandom);
        SettlementQueryRequest unsigned = new SettlementQueryRequest(
                RegistryProtocol.PROTOCOL_VERSION,
                runtime.state().registryScope(),
                runtime.state().deploymentId(),
                timestamp,
                nonce,
                queryId,
                query.currencyCode(),
                query.fromPeriod(),
                query.throughPeriod(),
                query.includeSuperseded(),
                query.limit(),
                query.afterPeriod(),
                query.afterSettlementId(),
                "",
                "");
        String payloadHash = CanonicalValues.sha256(
                RegistryProtocol.settlementQueryPayload(unsigned));
        byte[] requestMessage = RegistryProtocol.signedRequest(
                "POST",
                RegistryProtocol.SETTLEMENT_QUERY_PATH,
                RegistryProtocol.PROTOCOL_VERSION,
                runtime.state().registryScope(),
                runtime.state().deploymentId(),
                timestamp,
                nonce,
                queryId,
                payloadHash);
        SettlementQueryRequest request = new SettlementQueryRequest(
                unsigned.protocolVersion(),
                unsigned.registryScope(),
                unsigned.deploymentId(),
                unsigned.timestamp(),
                unsigned.nonce(),
                unsigned.queryId(),
                unsigned.currencyCode(),
                unsigned.fromPeriod(),
                unsigned.throughPeriod(),
                unsigned.includeSuperseded(),
                unsigned.limit(),
                unsigned.afterPeriod(),
                unsigned.afterSettlementId(),
                payloadHash,
                runtime.deploymentCrypto().signBase64(requestMessage));
        try {
            SettlementQueryResponse response = runtimeResolver.transport(runtime).querySettlements(request);
            verifyResponse(
                    runtime,
                    query,
                    request,
                    requestMessage,
                    response);
            return new OperatorSettlementPageDto(
                    response.items().stream()
                            .map(this::toDto)
                            .toList(),
                    empty(response.nextAfterPeriod()),
                    empty(response.nextAfterSettlementId()),
                    response.generatedAt());
        } catch (RegistryHttpException exception) {
            throw new ResponseStatusException(
                    exception.getStatusCode() >= 400
                            && exception.getStatusCode() < 500
                                    ? HttpStatus.CONFLICT
                                    : HttpStatus.BAD_GATEWAY,
                    safeMessage(exception),
                    exception);
        } catch (RuntimeException exception) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_GATEWAY,
                    safeMessage(exception),
                    exception);
        }
    }

    private void verifyResponse(
            RegisteredRuntime runtime,
            Query query,
            SettlementQueryRequest request,
            byte[] requestMessage,
            SettlementQueryResponse response) {
        if (response == null || response.items() == null) {
            throw new IllegalStateException(
                    "Registry settlement response is incomplete.");
        }
        RegistryProtocol.requireToken(response.queryId(), "query_id");
        CanonicalValues.requireHash(response.queryHash(), "query_hash");
        CanonicalValues.requireHash(response.itemsHash(), "items_hash");
        RegistryProtocol.requireRegistryKeyId(response.registryKeyId());
        CanonicalValues.requireUtcTimestamp(
                response.generatedAt(),
                "generated_at");
        if (!RegistryProtocol.PROTOCOL_VERSION.equals(
                    response.protocolVersion())
                || !runtime.state().registryScope().equals(
                        response.registryScope())
                || !runtime.state().deploymentId().equals(
                        response.deploymentId())
                || !request.queryId().equals(response.queryId())
                || !runtime.registryKeyId().equals(
                        response.registryKeyId())
                || !runtime.registryPublicKeyBase64().equals(
                        response.registryPublicKey())
                || !RegistryProtocol.hashEquals(
                        CanonicalValues.sha256(requestMessage),
                        response.queryHash())
                || !RegistryProtocol.hashEquals(
                        RegistryProtocol.settlementHistoryItemsHash(
                                response.items()),
                        response.itemsHash())
                || !com.raxim.myscoutee.common.security.crypto.Ed25519Signatures.verifyBase64(
                        runtime.registryPublicKey(),
                        RegistryProtocol.settlementQueryResponse(response),
                        response.signature())) {
            throw new IllegalStateException(
                    "Registry settlement response signature or request binding is invalid.");
        }

        boolean hasNextPeriod = !empty(
                response.nextAfterPeriod()).isEmpty();
        boolean hasNextSettlement = !empty(
                response.nextAfterSettlementId()).isEmpty();
        if (hasNextPeriod != hasNextSettlement) {
            throw new IllegalStateException(
                    "Registry settlement cursor is incomplete.");
        }
        if (hasNextPeriod) {
            requireResponsePeriod(
                    response.nextAfterPeriod(),
                    "next_after_period");
            RegistryProtocol.requireSettlementId(
                    response.nextAfterSettlementId());
        }

        Set<String> itemKeys = new HashSet<>();
        Set<String> settlementIds = new HashSet<>();
        Set<String> currentRevisionKeys = new HashSet<>();
        SettlementHistoryItem previous = null;
        for (SettlementHistoryItem item : response.items()) {
            validateItem(query, item);
            String itemKey = item.settlementId()
                    + "\n"
                    + item.beneficiaryType()
                    + "\n"
                    + item.beneficiaryId();
            if (!itemKeys.add(itemKey)) {
                throw new IllegalStateException(
                        "Registry settlement response contains a duplicate item.");
            }
            boolean firstRowForSettlement = settlementIds.add(
                    item.settlementId());
            if (!firstRowForSettlement
                    && (previous == null
                            || !previous.settlementId().equals(
                                    item.settlementId()))) {
                throw new IllegalStateException(
                        "Registry settlement response repeats a non-contiguous settlement.");
            }
            if (!query.includeSuperseded()
                    && !currentRevisionKeys.add(
                            item.period() + "\n" + item.currencyCode())
                    && (previous == null
                            || !previous.settlementId().equals(
                                    item.settlementId()))) {
                throw new IllegalStateException(
                        "Registry settlement response contains superseded revisions.");
            }
            validateItemPosition(query, previous, item);
            previous = item;
        }
        if (settlementIds.size() > query.limit()) {
            throw new IllegalStateException(
                    "Registry settlement response exceeds the requested page size.");
        }
        if (hasNextPeriod) {
            if (previous == null
                    || settlementIds.size() != query.limit()
                    || !response.nextAfterPeriod().equals(previous.period())
                    || !response.nextAfterSettlementId().equals(
                            previous.settlementId())) {
                throw new IllegalStateException(
                        "Registry settlement response cursor does not match the page boundary.");
            }
        }
    }

    void validateItem(
            Query query,
            SettlementHistoryItem item) {
        if (item == null) {
            throw new IllegalStateException(
                    "Registry settlement item is missing.");
        }
        RegistryProtocol.requireSettlementId(item.settlementId());
        YearMonth period = requireResponsePeriod(item.period(), "period");
        int fractionDigits =
                RegistryProtocol.requireRevenueCurrencyFractionDigits(
                        item.currencyCode(),
                        Math.toIntExact(item.fractionDigits()));
        if (fractionDigits != item.fractionDigits()
                || item.revision() <= 0L
                || !RegistryProtocol.SETTLEMENT_BENEFICIARY_OPERATOR_GROUP
                        .equals(item.beneficiaryType())
                || !RegistryProtocol.SETTLEMENT_VALUATION_RULESET_VERSION
                        .equals(item.valuationRulesetVersion())
                || !within(
                        item.baseValuationMultiplierBasisPoints(),
                        RegistryProtocol
                                .SETTLEMENT_MINIMUM_BASE_VALUATION_MULTIPLIER_BASIS_POINTS,
                        RegistryProtocol
                                .SETTLEMENT_MAXIMUM_BASE_VALUATION_MULTIPLIER_BASIS_POINTS)
                || !safeMinor(item.networkPoolMinor())
                || !safeMinor(item.networkPoolAllocationMinor())
                || item.networkPoolAllocationMinor()
                        > item.networkPoolMinor()
                || !safeMinor(item.ttmCommissionBasisMinor())
                || !safeMinor(item.ttmNetworkCommissionPoolMinor())
                || !safeMinor(item.indicativeNetworkValueMinor())
                || !safeMinor(item.indicativeValueAllocationMinor())
                || item.indicativeValueAllocationMinor()
                        > item.indicativeNetworkValueMinor()
                || !safeMinor(item.recentThreeMonthAverageMinor())
                || !safeMinor(item.priorThreeMonthAverageMinor())
                || !safeMinor(item.earlierThreeMonthAverageMinor())
                || !within(
                        item.recentGrowthBasisPoints(),
                        RegistryProtocol
                                .SETTLEMENT_MINIMUM_GROWTH_BASIS_POINTS,
                        RegistryProtocol
                                .SETTLEMENT_MAXIMUM_GROWTH_BASIS_POINTS)
                || !within(
                        item.priorGrowthBasisPoints(),
                        RegistryProtocol
                                .SETTLEMENT_MINIMUM_GROWTH_BASIS_POINTS,
                        RegistryProtocol
                                .SETTLEMENT_MAXIMUM_GROWTH_BASIS_POINTS)
                || !within(
                        item.accelerationBasisPoints(),
                        RegistryProtocol
                                .SETTLEMENT_MINIMUM_ACCELERATION_BASIS_POINTS,
                        RegistryProtocol
                                .SETTLEMENT_MAXIMUM_ACCELERATION_BASIS_POINTS)
                || !within(
                        item.valuationAdjustmentBasisPoints(),
                        RegistryProtocol
                                .SETTLEMENT_MINIMUM_VALUATION_ADJUSTMENT_BASIS_POINTS,
                        RegistryProtocol
                                .SETTLEMENT_MAXIMUM_VALUATION_ADJUSTMENT_BASIS_POINTS)
                || !item.valuationIsNonBinding()
                || item.throughLedgerIndex() <= 0L
                || item.throughAuditIndex() < 0L
                || item.throughReviewIndex() < 0L
                || item.throughEligibilityIndex() < 0L
                || !hasValidValuationDerivation(item)) {
            throw new IllegalStateException(
                    "Registry settlement item violates the supported valuation ruleset.");
        }
        RegistryProtocol.requireOperatorGroupId(item.beneficiaryId());
        CanonicalValues.requireHash(
                item.sourceFingerprint(),
                "source_fingerprint");
        CanonicalValues.requireHash(
                item.settlementHash(),
                "settlement_hash");
        CanonicalValues.requireUtcTimestamp(
                item.acceptedAt(),
                "accepted_at");
        validateShare(item.shareNumerator(), item.shareDenominator());
        if (item.revision() == 1L) {
            if (!empty(item.supersedesSettlementId()).isEmpty()) {
                throw new IllegalStateException(
                        "Initial settlement revision supersedes another settlement.");
            }
        } else {
            RegistryProtocol.requireSettlementId(
                    item.supersedesSettlementId());
        }
        if (StringUtils.hasText(query.currencyCode())
                && !query.currencyCode().equals(item.currencyCode())) {
            throw new IllegalStateException(
                    "Registry settlement item does not match the currency filter.");
        }
        if (StringUtils.hasText(query.fromPeriod())
                && period.isBefore(parseCanonicalPeriod(
                        query.fromPeriod(),
                        "from_period"))) {
            throw new IllegalStateException(
                    "Registry settlement item is before the requested period.");
        }
        if (StringUtils.hasText(query.throughPeriod())
                && period.isAfter(parseCanonicalPeriod(
                        query.throughPeriod(),
                        "through_period"))) {
            throw new IllegalStateException(
                    "Registry settlement item is after the requested period.");
        }
    }

    private static boolean safeMinor(long value) {
        return value >= 0L
                && value <= RegistryProtocol.SETTLEMENT_MAXIMUM_SAFE_MINOR;
    }

    void validateItemPosition(
            Query query,
            SettlementHistoryItem previous,
            SettlementHistoryItem item) {
        YearMonth period = parseCanonicalPeriod(item.period(), "period");
        if (StringUtils.hasText(query.afterPeriod())) {
            YearMonth after = parseCanonicalPeriod(
                    query.afterPeriod(),
                    "after_period");
            if (period.isAfter(after)
                    || (period.equals(after)
                            && item.settlementId().compareTo(
                                    query.afterSettlementId()) <= 0)) {
                throw new IllegalStateException(
                        "Registry settlement item is outside the requested cursor.");
            }
        }
        if (previous == null) {
            return;
        }
        YearMonth previousPeriod = parseCanonicalPeriod(
                previous.period(),
                "period");
        if (item.settlementId().equals(previous.settlementId())) {
            if (!sameSettlementMetadata(previous, item)) {
                throw new IllegalStateException(
                        "Registry settlement allocation rows disagree.");
            }
            return;
        }
        if (period.isAfter(previousPeriod)
                || (period.equals(previousPeriod)
                        && item.settlementId().compareTo(
                                previous.settlementId()) <= 0)) {
            throw new IllegalStateException(
                    "Registry settlement response is not in canonical order.");
        }
    }

    private static boolean sameSettlementMetadata(
            SettlementHistoryItem left,
            SettlementHistoryItem right) {
        return Objects.equals(left.period(), right.period())
                && Objects.equals(
                        left.currencyCode(),
                        right.currencyCode())
                && left.fractionDigits() == right.fractionDigits()
                && left.revision() == right.revision()
                && Objects.equals(
                        left.supersedesSettlementId(),
                        right.supersedesSettlementId())
                && left.networkPoolMinor() == right.networkPoolMinor()
                && left.ttmCommissionBasisMinor()
                        == right.ttmCommissionBasisMinor()
                && left.ttmNetworkCommissionPoolMinor()
                        == right.ttmNetworkCommissionPoolMinor()
                && left.indicativeNetworkValueMinor()
                        == right.indicativeNetworkValueMinor()
                && Objects.equals(
                        left.valuationRulesetVersion(),
                        right.valuationRulesetVersion())
                && left.baseValuationMultiplierBasisPoints()
                        == right.baseValuationMultiplierBasisPoints()
                && left.recentThreeMonthAverageMinor()
                        == right.recentThreeMonthAverageMinor()
                && left.priorThreeMonthAverageMinor()
                        == right.priorThreeMonthAverageMinor()
                && left.earlierThreeMonthAverageMinor()
                        == right.earlierThreeMonthAverageMinor()
                && left.recentGrowthBasisPoints()
                        == right.recentGrowthBasisPoints()
                && left.priorGrowthBasisPoints()
                        == right.priorGrowthBasisPoints()
                && left.accelerationBasisPoints()
                        == right.accelerationBasisPoints()
                && left.valuationAdjustmentBasisPoints()
                        == right.valuationAdjustmentBasisPoints()
                && left.effectiveValuationMultiplierBasisPoints()
                        == right.effectiveValuationMultiplierBasisPoints()
                && left.valuationIsNonBinding()
                        == right.valuationIsNonBinding()
                && left.throughLedgerIndex() == right.throughLedgerIndex()
                && left.throughAuditIndex() == right.throughAuditIndex()
                && left.throughReviewIndex() == right.throughReviewIndex()
                && left.throughEligibilityIndex()
                        == right.throughEligibilityIndex()
                && Objects.equals(
                        left.sourceFingerprint(),
                        right.sourceFingerprint())
                && Objects.equals(
                        left.settlementHash(),
                        right.settlementHash())
                && Objects.equals(left.acceptedAt(), right.acceptedAt());
    }

    private static boolean hasValidValuationDerivation(
            SettlementHistoryItem item) {
        long expectedPriorGrowth = growthBasisPoints(
                item.earlierThreeMonthAverageMinor(),
                item.priorThreeMonthAverageMinor());
        long expectedRecentGrowth = growthBasisPoints(
                item.priorThreeMonthAverageMinor(),
                item.recentThreeMonthAverageMinor());
        long expectedAcceleration = clamp(
                expectedRecentGrowth - expectedPriorGrowth,
                RegistryProtocol
                        .SETTLEMENT_MINIMUM_ACCELERATION_BASIS_POINTS,
                RegistryProtocol
                        .SETTLEMENT_MAXIMUM_ACCELERATION_BASIS_POINTS);
        long expectedAdjustment = clamp(
                expectedRecentGrowth
                        / RegistryProtocol
                                .SETTLEMENT_ACCELERATION_ADJUSTMENT_DIVISOR
                        + expectedAcceleration
                                / RegistryProtocol
                                        .SETTLEMENT_ACCELERATION_ADJUSTMENT_DIVISOR,
                RegistryProtocol
                        .SETTLEMENT_MINIMUM_VALUATION_ADJUSTMENT_BASIS_POINTS,
                RegistryProtocol
                        .SETTLEMENT_MAXIMUM_VALUATION_ADJUSTMENT_BASIS_POINTS);
        BigInteger expectedMultiplier = BigInteger.valueOf(
                        item.baseValuationMultiplierBasisPoints())
                .multiply(BigInteger.valueOf(10_000L + expectedAdjustment))
                .divide(BigInteger.valueOf(10_000L));
        BigInteger ttmBasis = BigInteger.valueOf(
                item.ttmCommissionBasisMinor());
        BigInteger expectedTtmPool = ttmBasis
                .multiply(BigInteger.valueOf(
                        RegistryProtocol
                                .REVENUE_COMMISSION_RATE_BASIS_POINTS))
                .divide(BigInteger.valueOf(10_000L));
        BigInteger expectedIndicativeValue = ttmBasis
                .multiply(expectedMultiplier)
                .divide(BigInteger.valueOf(10_000L));
        return item.priorGrowthBasisPoints() == expectedPriorGrowth
                && item.recentGrowthBasisPoints() == expectedRecentGrowth
                && item.accelerationBasisPoints() == expectedAcceleration
                && item.valuationAdjustmentBasisPoints()
                        == expectedAdjustment
                && expectedMultiplier.equals(BigInteger.valueOf(
                        item.effectiveValuationMultiplierBasisPoints()))
                && expectedTtmPool.equals(BigInteger.valueOf(
                        item.ttmNetworkCommissionPoolMinor()))
                && expectedIndicativeValue.equals(BigInteger.valueOf(
                        item.indicativeNetworkValueMinor()));
    }

    private static long growthBasisPoints(
            long previous,
            long current) {
        if (previous == 0L) {
            return current == 0L
                    ? 0L
                    : RegistryProtocol
                            .SETTLEMENT_MAXIMUM_GROWTH_BASIS_POINTS;
        }
        BigInteger growth = BigInteger.valueOf(current)
                .subtract(BigInteger.valueOf(previous))
                .multiply(BigInteger.valueOf(10_000L))
                .divide(BigInteger.valueOf(previous));
        BigInteger minimum = BigInteger.valueOf(
                RegistryProtocol.SETTLEMENT_MINIMUM_GROWTH_BASIS_POINTS);
        BigInteger maximum = BigInteger.valueOf(
                RegistryProtocol.SETTLEMENT_MAXIMUM_GROWTH_BASIS_POINTS);
        if (growth.compareTo(minimum) < 0) {
            return minimum.longValueExact();
        }
        if (growth.compareTo(maximum) > 0) {
            return maximum.longValueExact();
        }
        return growth.longValueExact();
    }

    Query validateQuery(
            String currencyCode,
            String fromPeriod,
            String throughPeriod,
            boolean includeSuperseded,
            int limit,
            String afterPeriod,
            String afterSettlementId) {
        try {
            String normalizedCurrency = optionalCanonical(
                    currencyCode,
                    "currency_code");
            String normalizedFrom = optionalCanonical(
                    fromPeriod,
                    "from_period");
            String normalizedThrough = optionalCanonical(
                    throughPeriod,
                    "through_period");
            String normalizedAfter = optionalCanonical(
                    afterPeriod,
                    "after_period");
            String normalizedAfterSettlement = optionalCanonical(
                    afterSettlementId,
                    "after_settlement_id");
            if (!normalizedCurrency.isEmpty()) {
                RegistryProtocol.requireRevenueCurrencyCode(
                        normalizedCurrency);
            }
            YearMonth from = normalizedFrom.isEmpty()
                    ? null
                    : parseCanonicalPeriod(
                            normalizedFrom,
                            "from_period");
            YearMonth through = normalizedThrough.isEmpty()
                    ? null
                    : parseCanonicalPeriod(
                            normalizedThrough,
                            "through_period");
            if (from != null && through != null
                    && from.isAfter(through)) {
                throw new IllegalArgumentException(
                        "Settlement period range is invalid.");
            }
            if (limit < 1
                    || limit
                            > RegistryProtocol.SETTLEMENT_MAX_QUERY_LIMIT) {
                throw new IllegalArgumentException(
                        "Settlement page size must be between 1 and 100.");
            }
            boolean hasAfter = !normalizedAfter.isEmpty();
            boolean hasAfterSettlement =
                    !normalizedAfterSettlement.isEmpty();
            if (hasAfter != hasAfterSettlement) {
                throw new IllegalArgumentException(
                        "Settlement cursor is incomplete.");
            }
            if (hasAfter) {
                parseCanonicalPeriod(
                        normalizedAfter,
                        "after_period");
                RegistryProtocol.requireSettlementId(
                        normalizedAfterSettlement);
            }
            return new Query(
                    normalizedCurrency,
                    normalizedFrom,
                    normalizedThrough,
                    includeSuperseded,
                    limit,
                    normalizedAfter,
                    normalizedAfterSettlement);
        } catch (IllegalArgumentException exception) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    safeMessage(exception),
                    exception);
        }
    }

    private RegisteredRuntime requireRuntime(
            MongoSessionMode requestedMode) {
        Resolution resolution = runtimeResolver.resolveSettlement(
                requestedMode == null
                        ? MongoSessionMode.REAL
                        : requestedMode);
        if (resolution.isReady()) {
            return resolution.runtime();
        }
        throw new ResponseStatusException(
                "BLOCKED".equals(resolution.state())
                        ? HttpStatus.SERVICE_UNAVAILABLE
                        : HttpStatus.CONFLICT,
                StringUtils.hasText(resolution.message())
                        ? resolution.message()
                        : "Registered deployment evidence is unavailable.");
    }

    private OperatorSettlementDto toDto(
            SettlementHistoryItem item) {
        return new OperatorSettlementDto(
                item.settlementId(),
                item.period(),
                item.currencyCode(),
                Math.toIntExact(item.fractionDigits()),
                item.revision(),
                empty(item.supersedesSettlementId()),
                item.beneficiaryType(),
                item.beneficiaryId(),
                item.shareNumerator(),
                item.shareDenominator(),
                item.networkPoolMinor(),
                item.networkPoolAllocationMinor(),
                item.ttmCommissionBasisMinor(),
                item.ttmNetworkCommissionPoolMinor(),
                item.indicativeNetworkValueMinor(),
                item.indicativeValueAllocationMinor(),
                item.valuationRulesetVersion(),
                item.baseValuationMultiplierBasisPoints(),
                item.recentThreeMonthAverageMinor(),
                item.priorThreeMonthAverageMinor(),
                item.earlierThreeMonthAverageMinor(),
                item.recentGrowthBasisPoints(),
                item.priorGrowthBasisPoints(),
                item.accelerationBasisPoints(),
                item.valuationAdjustmentBasisPoints(),
                item.effectiveValuationMultiplierBasisPoints(),
                item.valuationIsNonBinding(),
                item.throughLedgerIndex(),
                item.throughAuditIndex(),
                item.throughReviewIndex(),
                item.throughEligibilityIndex(),
                item.sourceFingerprint(),
                item.settlementHash(),
                item.acceptedAt());
    }

    private static void validateShare(
            String numerator,
            String denominator) {
        try {
            BigInteger normalizedNumerator =
                    new BigInteger(CanonicalValues.requireCanonical(
                            numerator,
                            "share_numerator"));
            BigInteger normalizedDenominator =
                    new BigInteger(CanonicalValues.requireCanonical(
                            denominator,
                            "share_denominator"));
            if (normalizedNumerator.signum() < 0
                    || normalizedDenominator.signum() <= 0
                    || normalizedNumerator.compareTo(
                            normalizedDenominator) > 0
                    || !normalizedNumerator.gcd(
                            normalizedDenominator).equals(BigInteger.ONE)
                    || !normalizedNumerator.toString().equals(numerator)
                    || !normalizedDenominator.toString().equals(
                            denominator)) {
                throw new IllegalArgumentException();
            }
        } catch (RuntimeException exception) {
            throw new IllegalStateException(
                    "Registry settlement share is not a canonical rational.",
                    exception);
        }
    }

    private static YearMonth parseCanonicalPeriod(
            String value,
            String fieldName) {
        try {
            String normalized = CanonicalValues.requireCanonical(
                    value,
                    fieldName);
            YearMonth period = YearMonth.parse(normalized);
            if (!period.toString().equals(normalized)) {
                throw new IllegalArgumentException();
            }
            return period;
        } catch (RuntimeException exception) {
            throw new IllegalArgumentException(
                    fieldName + " must be YYYY-MM.",
                    exception);
        }
    }

    private static YearMonth requireResponsePeriod(
            String value,
            String fieldName) {
        try {
            return parseCanonicalPeriod(value, fieldName);
        } catch (IllegalArgumentException exception) {
            throw new IllegalStateException(
                    "Registry settlement " + fieldName
                            + " is not canonical.",
                    exception);
        }
    }

    private static boolean within(
            long value,
            long minimum,
            long maximum) {
        return value >= minimum && value <= maximum;
    }

    private static long clamp(
            long value,
            long minimum,
            long maximum) {
        return Math.max(minimum, Math.min(maximum, value));
    }

    private static String empty(String value) {
        return value == null ? "" : value;
    }

    private static String optionalCanonical(
            String value,
            String fieldName) {
        return value == null || value.isEmpty()
                ? ""
                : CanonicalValues.requireCanonical(value, fieldName);
    }

    private static String safeMessage(RuntimeException exception) {
        String message = exception == null ? "" : exception.getMessage();
        return StringUtils.hasText(message)
                ? message.trim()
                : "Registry settlement query failed.";
    }

    record Query(
            String currencyCode,
            String fromPeriod,
            String throughPeriod,
            boolean includeSuperseded,
            int limit,
            String afterPeriod,
            String afterSettlementId) {
    }
}

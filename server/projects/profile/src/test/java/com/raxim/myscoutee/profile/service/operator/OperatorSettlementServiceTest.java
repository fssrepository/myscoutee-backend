package com.raxim.myscoutee.profile.service.operator;

import static org.assertj.core.api.Assertions.assertThatCode;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.mock;

import java.security.SecureRandom;
import java.time.Clock;
import java.time.Instant;
import java.time.ZoneOffset;

import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import com.raxim.myscoutee.registry.RegistryProtocol;
import com.raxim.myscoutee.registry.RegistryProtocol.SettlementHistoryItem;

import tools.jackson.databind.ObjectMapper;

class OperatorSettlementServiceTest {
    private static final String HASH =
            "sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
    private static final String SETTLEMENT_ID =
            "stl_0123456789abcdef0123456789abcdef";

    @Test
    void rejectsNonCanonicalFiltersAndIncompleteCursorsAsBadRequests() {
        OperatorSettlementService service = service();

        assertBadRequest(() -> service.validateQuery(
                "eur",
                "",
                "",
                false,
                20,
                "",
                ""));
        assertBadRequest(() -> service.validateQuery(
                "EUR",
                " 2026-01",
                "",
                false,
                20,
                "",
                ""));
        assertBadRequest(() -> service.validateQuery(
                "EUR",
                "",
                "",
                false,
                20,
                "2026-06",
                ""));
        assertBadRequest(() -> service.validateQuery(
                "EUR",
                "",
                "",
                false,
                20,
                "2026-06",
                "stl_not-canonical"));
    }

    @Test
    void rejectsRegistryItemsWithInconsistentValuationDerivation() {
        OperatorSettlementService service = service();
        var query = service.validateQuery(
                "EUR",
                "2026-01",
                "2026-06",
                false,
                20,
                "",
                "");
        SettlementHistoryItem item = validItem();
        SettlementHistoryItem invalid = copy(
                item,
                item.networkPoolMinor(),
                item.accelerationBasisPoints() + 1L,
                item.ttmNetworkCommissionPoolMinor(),
                item.indicativeNetworkValueMinor());

        assertThatCode(() -> service.validateItem(query, item))
                .doesNotThrowAnyException();
        assertThatThrownBy(() -> service.validateItem(query, invalid))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("valuation ruleset");
        assertThatThrownBy(() -> service.validateItem(
                        query,
                        copy(
                                item,
                                item.networkPoolMinor(),
                                item.accelerationBasisPoints(),
                                item.ttmNetworkCommissionPoolMinor() + 1L,
                                item.indicativeNetworkValueMinor())))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("valuation ruleset");
        assertThatThrownBy(() -> service.validateItem(
                        query,
                        copy(
                                item,
                                item.networkPoolMinor(),
                                item.accelerationBasisPoints(),
                                item.ttmNetworkCommissionPoolMinor(),
                                item.indicativeNetworkValueMinor() + 1L)))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("valuation ruleset");
        assertThatThrownBy(() -> service.validateItem(
                        query,
                        copy(
                                item,
                                RegistryProtocol
                                        .SETTLEMENT_MAXIMUM_SAFE_MINOR + 1L,
                                item.accelerationBasisPoints(),
                                item.ttmNetworkCommissionPoolMinor(),
                                item.indicativeNetworkValueMinor())))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("valuation ruleset");
    }

    @Test
    void rejectsRegistryItemsThatDoNotFollowTheOpaqueCursor() {
        OperatorSettlementService service = service();
        var query = service.validateQuery(
                "EUR",
                "",
                "",
                false,
                20,
                "2026-06",
                SETTLEMENT_ID);

        assertThatThrownBy(() -> service.validateItemPosition(
                        query,
                        null,
                        validItem()))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("outside the requested cursor");
    }

    private static OperatorSettlementService service() {
        return new OperatorSettlementService(
                mock(OperatorRevenueRegistryRuntimeResolver.class),
                new ObjectMapper(),
                Clock.fixed(
                        Instant.parse("2026-07-29T00:00:00Z"),
                        ZoneOffset.UTC),
                new SecureRandom());
    }

    private static SettlementHistoryItem validItem() {
        return new SettlementHistoryItem(
                SETTLEMENT_ID,
                "2026-06",
                "EUR",
                2L,
                1L,
                "",
                RegistryProtocol.SETTLEMENT_BENEFICIARY_OPERATOR_GROUP,
                "opg_0123456789abcdef0123456789abcdef",
                "1",
                "10",
                500L,
                50L,
                10_000L,
                500L,
                36_000L,
                3_600L,
                RegistryProtocol.SETTLEMENT_VALUATION_RULESET_VERSION,
                30_000L,
                180L,
                120L,
                100L,
                5_000L,
                2_000L,
                3_000L,
                2_000L,
                36_000L,
                true,
                100L,
                20L,
                10L,
                5L,
                HASH,
                HASH,
                "2026-07-29T00:00:01Z");
    }

    private static SettlementHistoryItem copy(
            SettlementHistoryItem item,
            long networkPoolMinor,
            long accelerationBasisPoints,
            long ttmNetworkCommissionPoolMinor,
            long indicativeNetworkValueMinor) {
        return new SettlementHistoryItem(
                item.settlementId(),
                item.period(),
                item.currencyCode(),
                item.fractionDigits(),
                item.revision(),
                item.supersedesSettlementId(),
                item.beneficiaryType(),
                item.beneficiaryId(),
                item.shareNumerator(),
                item.shareDenominator(),
                networkPoolMinor,
                item.networkPoolAllocationMinor(),
                item.ttmCommissionBasisMinor(),
                ttmNetworkCommissionPoolMinor,
                indicativeNetworkValueMinor,
                item.indicativeValueAllocationMinor(),
                item.valuationRulesetVersion(),
                item.baseValuationMultiplierBasisPoints(),
                item.recentThreeMonthAverageMinor(),
                item.priorThreeMonthAverageMinor(),
                item.earlierThreeMonthAverageMinor(),
                item.recentGrowthBasisPoints(),
                item.priorGrowthBasisPoints(),
                accelerationBasisPoints,
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

    private static void assertBadRequest(Runnable action) {
        assertThatThrownBy(action::run)
                .isInstanceOfSatisfying(
                        ResponseStatusException.class,
                        exception -> org.assertj.core.api.Assertions
                                .assertThat(exception.getStatusCode())
                                .isEqualTo(HttpStatus.BAD_REQUEST));
    }
}

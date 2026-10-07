package com.raxim.myscoutee.domain.operator.service;

import com.raxim.myscoutee.domain.operator.mapper.OperatorRevenueMapper;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.time.Clock;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.util.List;
import java.util.Set;

import org.junit.jupiter.api.Test;

import com.raxim.myscoutee.domain.payments.document.Payment;
import com.raxim.myscoutee.domain.events.repository.ActivityEventsRepository;
import com.raxim.myscoutee.domain.assets.repository.AssetsRepository;
import com.raxim.myscoutee.domain.payments.repository.PaymentsRepository;

@org.junit.jupiter.api.Tag("standard")
class OperatorRevenueServiceTest {
    private static final Instant NOW =
            Instant.parse("2026-07-28T12:00:00Z");

    @Test
    void aggregatesFinalizedPaymentsPerPinnedCurrencyWithoutMixing() {
        PaymentsRepository payments = mock(PaymentsRepository.class);
        when(payments.findRevenueCandidates()).thenReturn(List.of(
                payment("approved", 10.005D, "EUR", null, null, null),
                payment("approved", 123.5D, "JPY", null, null, null),
                payment("approved", 1.2345D, "BHD", null, null, null),
                payment(
                        "partially_refunded",
                        10.01D,
                        "USD",
                        2.00D,
                        "USD",
                        null),
                payment("pending", 999D, "EUR", null, null, null),
                payment(
                        "requires_action",
                        999D,
                        "USD",
                        null,
                        null,
                        null),
                payment(
                        "partially_refunded",
                        8D,
                        "USD",
                        1D,
                        "EUR",
                        null),
                payment(
                        "approved",
                        7D,
                        "EUR",
                        null,
                        null,
                        "booking-price-revision")));
        OperatorRevenueService service = service(payments);

        var response = service.revenue();

        assertThat(response.rulesetVersion())
                .isEqualTo("net-captured-revenue-v1");
        assertThat(response.commissionRateBasisPoints()).isEqualTo(500);
        assertThat(response.currencies())
                .extracting(currency -> currency.currencyCode())
                .containsExactly("BHD", "EUR", "JPY", "USD");
        var bhd = response.currencies().get(0);
        var eur = response.currencies().get(1);
        var jpy = response.currencies().get(2);
        var usd = response.currencies().get(3);
        assertThat(bhd.fractionDigits()).isEqualTo(3);
        assertThat(bhd.capturedPaymentMinor()).isEqualTo(1_234L);
        assertThat(eur.fractionDigits()).isEqualTo(2);
        assertThat(eur.capturedPaymentMinor()).isEqualTo(1_000L);
        assertThat(jpy.fractionDigits()).isZero();
        assertThat(jpy.capturedPaymentMinor()).isEqualTo(124L);
        assertThat(usd.capturedPaymentMinor()).isEqualTo(1_001L);
        assertThat(usd.refundedPaymentMinor()).isEqualTo(200L);
        assertThat(usd.netPaymentMinor()).isEqualTo(801L);
        assertThat(usd.commissionBasisMinor()).isEqualTo(801L);
        assertThat(usd.estimatedCommissionMinor()).isEqualTo(40L);
        assertThat(usd.paymentCount()).isEqualTo(1L);
    }

    @Test
    void dailyReportsKeepRefundsOnTheOriginalPaymentDayAndMaterializeEmptyDays() {
        PaymentsRepository payments = mock(PaymentsRepository.class);
        Payment refunded = payment(
                "refunded",
                25D,
                "EUR",
                25D,
                "EUR",
                null);
        refunded.setCreatedDate("2026-07-25T23:59:59Z");
        refunded.setRefundedAtIso("2026-07-28T01:00:00Z");
        when(payments.findRevenueCandidates()).thenReturn(List.of(refunded));
        OperatorRevenueService service = service(payments);

        var reports = service.dailyRevenueHistory(Set.of(
                LocalDate.parse("2026-07-25"),
                LocalDate.parse("2026-07-27")));

        assertThat(reports).hasSize(2);
        var originalDay = reports.get(0);
        var emptyDay = reports.get(1);
        assertThat(originalDay.period())
                .isEqualTo(LocalDate.parse("2026-07-25"));
        assertThat(originalDay.currencies()).hasSize(1);
        assertThat(originalDay.currencies().getFirst().capturedMinor())
                .isEqualTo(2_500L);
        assertThat(originalDay.currencies().getFirst().refundedMinor())
                .isEqualTo(2_500L);
        assertThat(originalDay.currencies().getFirst().netMinor()).isZero();
        assertThat(emptyDay.period())
                .isEqualTo(LocalDate.parse("2026-07-27"));
        assertThat(emptyDay.currencies()).isEmpty();
    }

    @Test
    void simulatedApprovedCheckoutNeverContributesRevenue() {
        PaymentsRepository payments = mock(PaymentsRepository.class);
        Payment real = payment(
                "approved",
                10D,
                "EUR",
                null,
                null,
                "payment");
        real.setProvider("stripe");
        Payment simulated = payment(
                "approved",
                999D,
                "EUR",
                null,
                null,
                "payment");
        simulated.setProvider("dummy");
        simulated.setCheckoutSessionId("dummy_test-session");
        when(payments.findRevenueCandidates()).thenReturn(
                List.of(real, simulated));
        OperatorRevenueService service = service(payments);

        var response = service.revenue();

        assertThat(response.currencies()).hasSize(1);
        assertThat(response.currencies().getFirst().capturedPaymentMinor())
                .isEqualTo(1_000L);
        assertThat(response.currencies().getFirst().paymentCount())
                .isEqualTo(1L);
    }

    @Test
    void historicalBackfillBoundaryUsesOnlyCompletedRealPaymentDays() {
        PaymentsRepository payments = mock(PaymentsRepository.class);
        Payment oldest = payment(
                "approved",
                10D,
                "EUR",
                null,
                null,
                "payment");
        oldest.setProvider("stripe");
        oldest.setCreatedDate("2026-05-04T23:59:59Z");
        Payment currentDay = payment(
                "approved",
                10D,
                "EUR",
                null,
                null,
                "payment");
        currentDay.setProvider("stripe");
        currentDay.setCreatedDate("2026-07-28T00:00:00Z");
        Payment simulated = payment(
                "approved",
                999D,
                "EUR",
                null,
                null,
                "payment");
        simulated.setProvider("dummy");
        simulated.setCreatedDate("2026-04-01T00:00:00Z");
        when(payments.findRevenueCandidates()).thenReturn(
                List.of(oldest, currentDay, simulated));
        OperatorRevenueService service = service(payments);

        assertThat(service.finalizedRevenuePeriodsBefore(
                        LocalDate.parse("2026-07-28")))
                .containsExactly(LocalDate.parse("2026-05-04"));
    }

    private OperatorRevenueService service(
            PaymentsRepository paymentsRepository) {
        ActivityEventsRepository events =
                mock(ActivityEventsRepository.class);
        AssetsRepository assets = mock(AssetsRepository.class);
        when(events.findAll()).thenReturn(List.of());
        when(assets.findAll()).thenReturn(List.of());
        return new OperatorRevenueService(
                events,
                new com.raxim.myscoutee.domain.assets.service.AssetOwnershipService(assets), new com.raxim.myscoutee.domain.payments.service.PaymentRevenueService(paymentsRepository),
                new OperatorRevenueMapper(),
                Clock.fixed(NOW, ZoneOffset.UTC));
    }

    private Payment payment(
            String status,
            double amount,
            String currency,
            Double refundedAmount,
            String refundCurrency,
            String auditKind) {
        Payment payment = new Payment();
        payment.setId(
                status + "-" + currency + "-" + amount + "-" + refundCurrency);
        payment.setStatus(status);
        payment.setAmount(amount);
        payment.setCurrency(currency);
        payment.setRefundedAmount(refundedAmount);
        payment.setRefundCurrency(refundCurrency);
        payment.setAuditKind(auditKind);
        payment.setCreatedDate("2026-07-27T10:00:00Z");
        payment.setUserId("user-" + currency);
        return payment;
    }
}

package com.raxim.myscoutee.domain.payments.service;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;
import java.time.LocalDate;
import java.util.List;
import java.nio.charset.StandardCharsets;
import org.bson.Document;
import org.junit.jupiter.api.Test;
import org.springframework.data.mongodb.core.MongoTemplate;
import com.raxim.myscoutee.domain.payments.document.Payment;

@org.junit.jupiter.api.Tag("standard")
class ExchangeRateTest {
    @Test void weekendUsesPriorObservationAndNeverFutureOrStaleRates() {
        var rows = List.of(new Document("_id", "2026-09-21").append("source", "test").append("rates", new Document("HUF", "410")),
                new Document("_id", "2026-09-18").append("source", "test").append("rates", new Document("HUF", "400")));
        var quote = ExchangeRateStore.quote(rows, LocalDate.parse("2026-09-20"), "HUF");
        assertThat(quote.date()).isEqualTo("2026-09-18");
        assertThat(quote.eurPerUnit()).isEqualByComparingTo("0.0025");
        assertThat(ExchangeRateStore.quote(rows, LocalDate.parse("2026-10-01"), "HUF")).isNull();
        assertThat(ExchangeRateStore.quote(rows, LocalDate.parse("2026-09-20"), "EUR").date()).isEqualTo("2026-09-18");
    }
    @Test void seededDefaultCoversFirstPaymentAndSourceOutageWhileDailyRatesTakePriority() {
        var defaults = new Document("_id", "default-v1").append("default", true)
                .append("source", "seed-default-v1").append("rates", new Document("EUR", "1").append("HUF", "400"));
        var daily = new Document("_id", "2026-09-18").append("source", "daily")
                .append("rates", new Document("HUF", "410"));
        var rows = List.of(defaults, daily); // Mongo descending IDs put the default first.
        var fresh = ExchangeRateStore.quote(List.of(defaults), LocalDate.parse("2026-09-18"), "HUF");
        assertThat(fresh.date()).isEqualTo("default-v1");
        assertThat(fresh.source()).isEqualTo("seed-default-v1");
        assertThat(fresh.eurPerUnit()).isEqualByComparingTo("0.0025");
        assertThat(ExchangeRateStore.quote(rows, LocalDate.parse("2026-09-20"), "HUF").source()).isEqualTo("daily");
        assertThat(ExchangeRateStore.quote(rows, LocalDate.parse("2026-10-01"), "HUF").source()).isEqualTo("seed-default-v1");
        assertThat(ExchangeRateStore.quote(rows, LocalDate.parse("2026-09-17"), "EUR").date()).isEqualTo("default-v1");

        var store = mock(ExchangeRateStore.class);
        when(store.observations()).thenReturn(List.of(defaults));
        var payment = new Payment(); payment.setAuditKind("payment"); payment.setStatus("captured");
        payment.setCurrency("HUF"); payment.setAmount(5000D); payment.setCreatedDate("2026-09-18T10:00:00Z");
        var service = paymentService(store);
        service.prepare(payment);
        assertThat(payment.getEuro().amountMinor()).isEqualTo(1250);
        assertThat(payment.getEuro().rateDate()).isEqualTo("default-v1");
        reset(store); // Later refresh/refund must retain the exact original seeded basis.
        payment.setRefundedAmount(5000D); payment.setRefundedAtIso("2026-09-22T12:00:00Z");
        service.prepare(payment);
        assertThat(payment.getEuro().refundedMinor()).isEqualTo(1250);
        verifyNoInteractions(store);
    }

    @Test void refundsKeepOriginalRateAndUnroundedBasis() {
        ExchangeRateStore store = mock(ExchangeRateStore.class);
        when(store.observations()).thenReturn(List.of(new Document("_id", "2026-09-18").append("source", "test")
                .append("rates", new Document("HUF", "400"))));
        PaymentEuroService service = paymentService(store);
        Payment payment = new Payment(); payment.setAuditKind("payment"); payment.setStatus("captured");
        payment.setCurrency("HUF"); payment.setAmount(5001D); payment.setCreatedDate("2026-09-18T10:00:00Z");
        service.prepare(payment);
        assertThat(payment.getEuro().amountMinor()).isEqualTo(1250);
        assertThat(new java.math.BigDecimal(payment.getEuro().amount())).isEqualByComparingTo("12.5025");
        reset(store); // A refund must not consult a newly refreshed rate.
        payment.setRefundedAtIso("2026-09-22T12:00:00Z"); payment.setRefundedAmount(5001D);
        service.prepare(payment);
        assertThat(payment.getEuro().refundedMinor()).isEqualTo(payment.getEuro().amountMinor());
        verifyNoInteractions(store);
    }
    @Test void missingRateLeavesThePaymentUnconverted() {
        ExchangeRateStore store = mock(ExchangeRateStore.class); when(store.observations()).thenReturn(List.of());
        Payment payment = new Payment(); payment.setAuditKind("payment"); payment.setStatus("captured");
        payment.setCurrency("HUF"); payment.setAmount(10D); payment.setCreatedDate("2026-09-18T10:00:00Z");
        paymentService(store).prepare(payment);
        assertThat(payment.getEuro()).isNull(); assertThat(payment.getStatus()).isEqualTo("captured");
    }
    @Test void developmentRejectsExternalSourcesAndEmbeddedCredentials() {
        var source = new ExchangeRateSource(" payment-simulator, ", "http://payment-simulator:18082");
        assertThat(source.validate("http://payment-simulator:18082/exchange-rates/eurofxref.xml")).contains("payment-simulator");
        assertThatThrownBy(() -> source.validate("https://example.com/rates")).isInstanceOf(IllegalArgumentException.class);
        assertThatThrownBy(() -> source.validate("http://secret@payment-simulator/rates")).isInstanceOf(IllegalArgumentException.class);
    }
    @Test void productionAllowsPublicHttpsAndOnlyDemoCanUseTheConfiguredSimulatorOrigin() {
        var source = new ExchangeRateSource(" , ", "http://payment-simulator:18082");
        assertThat(source.validate("https://www.ecb.europa.eu/stats/eurofxref/eurofxref-hist-90d.xml")).startsWith("https://");
        assertThatThrownBy(() -> source.validate("http://payment-simulator:18082/exchange-rates/eurofxref.xml"))
                .isInstanceOf(IllegalArgumentException.class);
        com.raxim.myscoutee.common.config.mongo.MongoSessionModeContext.set(com.raxim.myscoutee.common.config.mongo.MongoSessionMode.DEMO);
        try {
            assertThat(source.validate("http://payment-simulator:18082/exchange-rates/eurofxref.xml")).startsWith("http://payment-simulator:");
            assertThatThrownBy(() -> source.validate("http://payment-simulator:9999/rates")).isInstanceOf(IllegalArgumentException.class);
            assertThatThrownBy(() -> source.validate("http://other-internal-service:18082/rates")).isInstanceOf(IllegalArgumentException.class);
        } finally { com.raxim.myscoutee.common.config.mongo.MongoSessionModeContext.clear(); }
    }
    @Test void parserRejectsExternalEntitiesAndNonPositiveRates() {
        assertThatThrownBy(() -> ExchangeRateSource.parse("<!DOCTYPE x [<!ENTITY e SYSTEM 'file:///etc/passwd'>]><Cube/>".getBytes(StandardCharsets.UTF_8), "test"))
                .isInstanceOf(Exception.class);
        assertThatThrownBy(() -> ExchangeRateSource.parse("<Cube time='2026-09-18'><Cube currency='HUF' rate='0'/></Cube>".getBytes(StandardCharsets.UTF_8), "test"))
                .isInstanceOf(IllegalArgumentException.class);
    }
    @Test void displaySnapshotUsesOneCachedReadAndExistingFreshnessRules() {
        var store = mock(ExchangeRateStore.class);
        var today = LocalDate.now(java.time.ZoneOffset.UTC);
        when(store.observations()).thenReturn(List.of(
                new Document("_id", "default-v1").append("default", true).append("rates", new Document("HUF", "400")),
                new Document("_id", today.plusDays(1).toString()).append("rates", new Document("HUF", "800")),
                new Document("_id", today.toString()).append("rates", new Document("HUF", "500")),
                new Document("_id", today.minusDays(8).toString()).append("rates", new Document("USD", "1.1"))));
        var snapshot = paymentService(store).displayEuroRates();
        assertThat(snapshot).containsEntry("EUR", 1D).containsEntry("HUF", 0.002D).doesNotContainKey("USD");
        verify(store, times(1)).observations();
    }
    private PaymentEuroService paymentService(ExchangeRateStore store) {
        var service = new PaymentEuroService(store, mock(MongoTemplate.class), null, null, null);
        org.springframework.test.util.ReflectionTestUtils.setField(service, "jobGroupScope",
            com.raxim.myscoutee.domain.groups.service.GroupTestSupport.jobScope(mock(MongoTemplate.class)));
        return service;
    }
}

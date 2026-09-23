package com.raxim.myscoutee.profile.service.exchange;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;
import java.time.LocalDate;
import java.util.List;
import java.nio.charset.StandardCharsets;
import org.bson.Document;
import org.junit.jupiter.api.Test;
import org.springframework.data.mongodb.core.MongoTemplate;
import com.raxim.myscoutee.profile.data.document.Payment;

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
    @Test void refundsKeepOriginalRateAndUnroundedBasis() {
        ExchangeRateStore store = mock(ExchangeRateStore.class);
        when(store.observations()).thenReturn(List.of(new Document("_id", "2026-09-18").append("source", "test")
                .append("rates", new Document("HUF", "400"))));
        PaymentEuroService service = new PaymentEuroService(store, mock(MongoTemplate.class));
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
        new PaymentEuroService(store, mock(MongoTemplate.class)).prepare(payment);
        assertThat(payment.getEuro()).isNull(); assertThat(payment.getStatus()).isEqualTo("captured");
    }
    @Test void developmentRejectsExternalSourcesAndEmbeddedCredentials() {
        var source = new ExchangeRateSource("exchange-rate-simulator");
        assertThat(source.validate("http://exchange-rate-simulator:18083/eurofxref.xml")).contains("exchange-rate-simulator");
        assertThatThrownBy(() -> source.validate("https://example.com/rates")).isInstanceOf(IllegalArgumentException.class);
        assertThatThrownBy(() -> source.validate("http://secret@exchange-rate-simulator/rates")).isInstanceOf(IllegalArgumentException.class);
    }
    @Test void parserRejectsExternalEntitiesAndNonPositiveRates() {
        assertThatThrownBy(() -> ExchangeRateSource.parse("<!DOCTYPE x [<!ENTITY e SYSTEM 'file:///etc/passwd'>]><Cube/>".getBytes(StandardCharsets.UTF_8), "test"))
                .isInstanceOf(Exception.class);
        assertThatThrownBy(() -> ExchangeRateSource.parse("<Cube time='2026-09-18'><Cube currency='HUF' rate='0'/></Cube>".getBytes(StandardCharsets.UTF_8), "test"))
                .isInstanceOf(IllegalArgumentException.class);
    }
}

package com.raxim.myscoutee.profile.service;

import org.junit.jupiter.api.Test;
import com.raxim.myscoutee.profile.data.document.Payment;
import com.raxim.myscoutee.profile.repository.AffiliateRevenueRepository;
import org.springframework.data.mongodb.core.MongoTemplate;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class AffiliateRevenueServiceTest {
    private Payment payment(String status) {
        Payment value = new Payment(); value.setStatus(status); value.setAmount(123.45);
        value.setFulfillmentKind(PaymentService.FULFILLMENT_KIND_EVENT_JOIN); return value;
    }
    @Test void authorizationIsNotRevenueUntilSettled() {
        for (String status : new String[]{"authorized", "authorization_pending", "failed", "released"}) {
            assertEquals(0L, AffiliateRevenueService.contribution(payment(status)).gross());
        }
        assertEquals(new AffiliateRevenueService.Contribution(12345L, 0L, 1L),
                AffiliateRevenueService.contribution(payment("captured")));
    }
    @Test void onlyCompletedRefundsReduceRevenueAndCannotExceedGross() {
        Payment payment = payment("partially_refunded"); payment.setRefundedAmount(20.01);
        assertEquals(0L, AffiliateRevenueService.contribution(payment).refunded());
        payment.setRefundedAtIso("2026-09-22T00:00:00Z");
        assertEquals(2001L, AffiliateRevenueService.contribution(payment).refunded());
        payment.setRefundedAmount(900.0);
        assertEquals(12345L, AffiliateRevenueService.contribution(payment).refunded());
    }
    @Test void assetPurchaseDoesNotAddAnEventBooking() {
        Payment payment = payment("approved"); payment.setFulfillmentKind("client");
        assertEquals(new AffiliateRevenueService.Contribution(12345L, 0L, 0L), AffiliateRevenueService.contribution(payment));
    }
    @Test void failedCounterWriteKeepsPaymentPendingAndSuccessUsesVersionFence() {
        MongoTemplate mongo = mock(MongoTemplate.class);
        AffiliateRevenueRepository repository = mock(AffiliateRevenueRepository.class);
        var service = new AffiliateRevenueService(mongo, repository, null);
        Payment payment = payment("captured"); payment.setId("payment"); payment.setVersion(3L);
        payment.setAffiliateRevenuePending(true); payment.setAffiliateOwnerUserId("owner"); payment.setCurrency("EUR");
        doThrow(new IllegalStateException("interrupted")).doNothing().when(repository)
                .record("owner", "payment", 3L, "EUR", 12345L, 0L, 1L);
        assertThrows(IllegalStateException.class, () -> service.record(payment));
        verifyNoInteractions(mongo);
        service.record(payment);
        var query = org.mockito.ArgumentCaptor.forClass(org.springframework.data.mongodb.core.query.Query.class);
        var update = org.mockito.ArgumentCaptor.forClass(org.springframework.data.mongodb.core.query.Update.class);
        verify(mongo).updateFirst(query.capture(), update.capture(), eq(Payment.class));
        assertEquals(3L, update.getValue().getUpdateObject().get("$set", org.bson.Document.class).get("version"));
        assertEquals(3L, query.getValue().getQueryObject().get("version"));
    }
}

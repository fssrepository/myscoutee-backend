package com.raxim.myscoutee.domain.payments.service;

import org.junit.jupiter.api.Test;
import com.raxim.myscoutee.domain.payments.document.Payment;
import com.raxim.myscoutee.domain.payments.repository.AffiliateRevenueRepository;
import org.springframework.data.mongodb.core.MongoTemplate;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@org.junit.jupiter.api.Tag("standard")
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
    @Test void cashNeverContributesRevenueRefundsOrBookings() {
        for (String status : new String[]{"approved", "captured", "partially_refunded", "refunded"}) {
            Payment payment = payment(status);
            payment.setProvider("cash");
            payment.setRefundedAmount(20.0);
            payment.setRefundedAtIso("2026-09-25T00:00:00Z");
            assertEquals(new AffiliateRevenueService.Contribution(0L, 0L, 0L),
                    AffiliateRevenueService.contribution(payment));
        }
    }
    @Test void newCashPaymentDoesNotAcquireAffiliateRevenueAttribution() {
        MongoTemplate mongo = mock(MongoTemplate.class);
        AffiliateRevenueRepository repository = mock(AffiliateRevenueRepository.class);
        var service = new AffiliateRevenueService(mongo, repository, null);
        Payment payment = payment("approved");
        payment.setAuditKind("payment");
        payment.setProvider("cash");
        service.prepare(payment);
        assertTrue(payment.isAffiliateAttributionResolved());
        assertNull(payment.getAffiliateOwnerUserId());
        assertFalse(payment.isAffiliateRevenuePending());
        verifyNoInteractions(mongo, repository);
    }
    @Test void previouslyAttributedCashPaymentQueuesAZeroContribution() {
        MongoTemplate mongo = mock(MongoTemplate.class);
        AffiliateRevenueRepository repository = mock(AffiliateRevenueRepository.class);
        var service = new AffiliateRevenueService(mongo, repository, null);
        Payment payment = payment("captured");
        payment.setAuditKind("payment");
        payment.setProvider("cash");
        payment.setId("cash-payment");
        payment.setCurrency("EUR");
        payment.setVersion(4L);
        payment.setAffiliateAttributionResolved(true);
        payment.setAffiliateOwnerUserId("owner");
        service.prepare(payment);
        service.record(payment);
        verify(repository).record("owner", "cash-payment", 4L, "EUR", 0L, 0L, 0L);
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

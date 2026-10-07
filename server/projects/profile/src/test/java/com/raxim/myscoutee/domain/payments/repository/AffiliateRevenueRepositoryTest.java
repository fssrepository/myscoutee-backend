package com.raxim.myscoutee.domain.payments.repository;

import org.junit.jupiter.api.Test;
import org.bson.Document;
import org.bson.conversions.Bson;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.FindIterable;
import com.mongodb.client.model.UpdateOptions;
import com.mongodb.client.result.UpdateResult;
import org.springframework.data.mongodb.core.MongoTemplate;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@org.junit.jupiter.api.Tag("standard")
class AffiliateRevenueRepositoryTest {
    @Test @SuppressWarnings("unchecked") void partialRefundWritesOnlyTheDeltaAndFencesItsCommit() {
        MongoTemplate mongo = mock(MongoTemplate.class);
        MongoCollection<Document> partners = mock(MongoCollection.class), ledger = mock(MongoCollection.class);
        FindIterable<Document> partnerFind = mock(FindIterable.class), ledgerFind = mock(FindIterable.class);
        when(mongo.getCollection("affiliatePartners")).thenReturn(partners);
        when(mongo.getCollection("affiliatePaymentContributions")).thenReturn(ledger);
        when(partners.find(any(Bson.class))).thenReturn(partnerFind);
        when(partnerFind.first()).thenReturn(new Document("_id", "owner").append("revision", 9L));
        when(ledger.find(any(Bson.class))).thenReturn(ledgerFind);
        when(ledgerFind.first()).thenReturn(new Document("version", 1L).append("currency", "EUR")
                .append("gross", 10000L).append("refunded", 0L).append("bookings", 1L).append("purchases", 1L));
        when(partners.updateOne(any(Bson.class), any(Bson.class))).thenReturn(UpdateResult.acknowledged(1L, 1L, null));
        new AffiliateRevenueRepository(mongo).record("owner", "payment", 2L, "EUR", 10000L, 2500L, 1L);
        var filters = org.mockito.ArgumentCaptor.forClass(Bson.class);
        var writes = org.mockito.ArgumentCaptor.forClass(Bson.class);
        verify(partners, times(2)).updateOne(filters.capture(), writes.capture());
        Document increment = ((Document) writes.getAllValues().get(1)).get("$inc", Document.class);
        assertEquals(-2500L, increment.get("totals.EUR.netMinor"));
        assertEquals(2500L, increment.get("totals.EUR.refundedMinor"));
        assertEquals(0L, increment.get("totals.EUR.grossMinor"));
        assertEquals(0L, increment.get("eventBookings"));
        String operation = ((Document) writes.getAllValues().get(0)).get("$set", Document.class).get("pending", Document.class).getString("id");
        assertEquals(operation, ((Document) filters.getAllValues().get(1)).getString("pending.id"));
        assertEquals(9L, ((Document) filters.getAllValues().get(0)).get("revision"));
    }
}

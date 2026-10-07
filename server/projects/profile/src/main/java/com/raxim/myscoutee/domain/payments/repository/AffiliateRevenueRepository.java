package com.raxim.myscoutee.domain.payments.repository;

import java.util.List;
import java.util.UUID;
import org.bson.Document;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Repository;
import com.mongodb.client.model.UpdateOptions;

/** Mutation-time counters with a recoverable single-operation journal per partner.
 * The contribution ledger is separate, so partner records do not grow per payment. */
@Repository
public class AffiliateRevenueRepository {
    private final MongoTemplate mongo;
    public AffiliateRevenueRepository(MongoTemplate mongo) { this.mongo = mongo; }

    public Document summary(String owner) {
        return mongo.getCollection("affiliatePartners").find(new Document("_id", owner))
                .projection(new Document("totals", 1).append("purchases", 1).append("eventBookings", 1)).first();
    }

    public void record(String owner, String paymentId, long version, String currency,
            long gross, long refunded, long bookings) {
        var partners = mongo.getCollection("affiliatePartners");
        var ledger = mongo.getCollection("affiliatePaymentContributions");
        partners.updateOne(new Document("_id", owner), new Document("$setOnInsert",
                new Document("revision", 0L)), new UpdateOptions().upsert(true));
        String ledgerId = owner + ":" + paymentId;
        for (int attempt = 0; attempt < 20; attempt++) {
            Document partner = partners.find(new Document("_id", owner)).first();
            Document pending = partner.get("pending", Document.class);
            if (pending != null) { complete(owner, pending); continue; }
            long revision = number(partner, "revision");
            Document previous = ledger.find(new Document("_id", ledgerId)).first();
            if (previous != null && number(previous, "version") >= version) {
                // A ledger row can precede its counter commit. Help that operation before acknowledging.
                Document current = partners.find(new Document("_id", owner)).first();
                Document unfinished = current.get("pending", Document.class);
                if (unfinished != null) { complete(owner, unfinished); continue; }
                return;
            }
            if (previous != null && !currency.equals(previous.getString("currency"))) {
                throw new IllegalStateException("Affiliate payment currency cannot change");
            }
            Document next = new Document("_id", ledgerId).append("ownerUserId", owner).append("version", version)
                    .append("currency", currency).append("gross", gross).append("refunded", refunded)
                    .append("bookings", bookings).append("purchases", gross > 0 ? 1L : 0L);
            Document delta = new Document("totals." + currency + ".grossMinor", gross - number(previous, "gross"))
                    .append("totals." + currency + ".refundedMinor", refunded - number(previous, "refunded"))
                    .append("totals." + currency + ".netMinor", gross - refunded - number(previous, "gross") + number(previous, "refunded"))
                    .append("eventBookings", bookings - number(previous, "bookings"))
                    .append("purchases", (gross > 0 ? 1L : 0L) - number(previous, "purchases"));
            Document operation = new Document("id", UUID.randomUUID().toString()).append("next", next).append("delta", delta);
            if (partners.updateOne(new Document("_id", owner).append("revision", revision).append("pending", null),
                    new Document("$set", new Document("pending", operation))).getModifiedCount() == 1) {
                complete(owner, operation);
                return;
            }
        }
        throw new IllegalStateException("Affiliate counter is busy; payment remains queued");
    }

    private void complete(String owner, Document operation) {
        Document next = operation.get("next", Document.class);
        // A stale helper must never replace a newer contribution after another helper completed it.
        mongo.getCollection("affiliatePaymentContributions").updateOne(new Document("_id", next.getString("_id")),
                List.of(new Document("$replaceWith", new Document("$cond", List.of(
                        new Document("$lte", List.of(new Document("$ifNull", List.of("$version", -1L)), number(next, "version"))),
                        new Document("$literal", next), "$$ROOT")))), new UpdateOptions().upsert(true));
        Document increment = new Document(operation.get("delta", Document.class));
        increment.append("revision", 1L);
        // The pending ID is also the idempotency fence: exactly one helper can apply this delta.
        mongo.getCollection("affiliatePartners").updateOne(
                new Document("_id", owner).append("pending.id", operation.getString("id")),
                new Document("$inc", increment).append("$unset", new Document("pending", "")));
    }

    public static long number(Document value, String field) {
        return value != null && value.get(field) instanceof Number number ? number.longValue() : 0L;
    }
}

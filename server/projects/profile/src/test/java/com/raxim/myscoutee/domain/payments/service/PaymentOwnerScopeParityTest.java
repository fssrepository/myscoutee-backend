package com.raxim.myscoutee.domain.payments.service;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;
import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;
import org.bson.Document;
import org.junit.jupiter.api.*;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.*;
import com.mongodb.client.MongoClients;
import de.flapdoodle.embed.mongo.distribution.Version;
import de.flapdoodle.embed.mongo.transitions.Mongod;
import com.raxim.myscoutee.common.mongo.OwnerScopedQuery;
import com.raxim.myscoutee.domain.accounts.service.AccountJobScopeService;
import com.raxim.myscoutee.domain.accounts.service.AccountPaymentTotalsService;
import com.raxim.myscoutee.domain.accounts.api.PaymentTotals.Direction;
import com.raxim.myscoutee.domain.platform.api.JobAudience.WorkspaceScope;
import com.raxim.myscoutee.domain.payments.document.Payment;

@Tag("embedded")
class PaymentOwnerScopeParityTest {
    @Test void ownerSelectionMatchesLegacyJoinBeforeSkipAndLimitAcrossBatchBoundaries() {
        try (var mongod = Mongod.instance().start(Version.Main.V6_0)) {
            var address = mongod.current().getServerAddress();
            try (var client = MongoClients.create("mongodb://" + address.getHost() + ":" + address.getPort())) {
                var mongo = new MongoTemplate(client, "payment-owner-parity");
                mongo.getCollection("users").insertMany(List.of(
                    new Document("userId", "other").append("workspaceGroupId", "outside"),
                    new Document("userId", "member").append("workspaceGroupId", "inside"),
                    new Document("userId", "global"),
                    new Document("userId", "duplicate").append("workspaceGroupId", "inside"),
                    new Document("userId", "duplicate").append("workspaceGroupId", "outside")));
                var payments = new ArrayList<Document>();
                for (int i=0;i<1007;i++) payments.add(new Document("_id", "backlog-"+i).append("userId", "other").append("amount", (double)i));
                for (int i=0;i<15;i++) payments.add(new Document("_id", "active-"+i).append("userId", "member").append("amount", 1100d+i));
                payments.add(new Document("_id", "duplicate").append("userId", "duplicate").append("amount", 1200d));
                payments.add(new Document("_id", "global").append("userId", "global").append("amount", 1201d));
                payments.add(new Document("_id", "missing").append("userId", "absent").append("amount", 1202d));
                mongo.getCollection("payments").insertMany(payments);
                var owners = new AccountJobScopeService(mongo);
                for (boolean included : List.of(true, false)) {
                    var scope = new WorkspaceScope(Set.of("inside"), included);
                    var query = Query.query(Criteria.where("amount").gte(0)).with(Sort.by("amount")).skip(2).limit(9);
                    var expected = mongo.getCollection("payments").aggregate(List.of(
                        new Document("$match", query.getQueryObject()),
                        new Document("$lookup", new Document("from", "users").append("localField", "userId").append("foreignField", "userId").append("as", "__jobOwner")),
                        new Document("$match", new Document("__jobOwner.0", new Document("$exists", true))),
                        new Document("$match", new Document("__jobOwner.workspaceGroupId", new Document(included ? "$in" : "$nin", List.of("inside")))),
                        new Document("$sort", query.getSortObject()), new Document("$skip", 2), new Document("$limit", 9)
                    )).map(row -> row.getString("_id")).into(new ArrayList<>());
                    var batches = new AtomicInteger();
                    var actual = OwnerScopedQuery.find(mongo, query, Payment.class, Payment::getUserId, ids -> {
                        batches.incrementAndGet(); assertThat(ids.size()).isLessThanOrEqualTo(1000);
                        return owners.matchingOwners(ids, scope);
                    });
                    assertThat(actual).extracting(Payment::getId).containsExactlyElementsOf(expected).hasSize(9);
                    assertThat(batches.get()).isEqualTo(included ? 2 : 1);
                    assertThat(owners.matchingOwners(List.of("duplicate", "global", "absent"), scope))
                        .containsExactlyElementsOf(included ? Set.of("duplicate") : Set.of("global"));
                }
                // Receipt retries must never reverse the same money twice or make pending counters negative.
                mongo.getCollection("users").updateOne(new Document("userId", "member"), new Document("$set", new Document("paymentSpentTotals.EUR", 20d).append("paymentAllTotals.EUR", 20d).append("paymentRefundsPending", 1)));
                var totals = new AccountPaymentTotalsService(mongo);
                totals.reverseReceipt("member", "receipt-1", Direction.SPENT, "EUR", 7d);
                totals.reverseReceipt("member", "receipt-1", Direction.SPENT, "EUR", 7d);
                totals.decrementPendingRefunds("member"); totals.decrementPendingRefunds("member");
                var member = mongo.getCollection("users").find(new Document("userId", "member")).first();
                assertThat(member.get("paymentSpentTotals", Document.class).getDouble("EUR")).isEqualTo(13d);
                assertThat(member.get("paymentAllTotals", Document.class).getDouble("EUR")).isEqualTo(13d);
                assertThat(member.getInteger("paymentRefundsPending")).isZero();
                var cancellations = new EventPaymentCancellationService(mongo, null);
                for (String id : List.of("before", "after", "already-refunded", "cancelled")) {
                    mongo.getCollection("payments").insertOne(new Document("_id", id).append("sourceId", "event")
                        .append("userId", "member").append("auditKind", "payment").append("amount", 20d)
                        .append("status", "captured").append("version", 1L)
                        .append("bookingStatus", id.equals("cancelled") ? "cancelled" : "joined")
                        .append("capturedAtIso", id.equals("after") ? "2026-10-08T00:00:00Z" : "2026-10-06T00:00:00Z")
                        .append("refundedAmount", id.equals("already-refunded") ? 20d : 0d));
                }
                cancellations.grantChangedTerms("event", "2026-10-07T00:00:00Z");
                cancellations.grantChangedTerms("event", "2026-10-07T00:00:00Z");
                assertThat(cancellations.eligibleParticipantPayments("event", "member")).extracting(p -> p.getId()).containsExactly("before");
                assertThat(mongo.getCollection("payments").find(new Document("_id", "before")).first().getLong("version")).isEqualTo(2L);
                cancellations.queueAdminRemovals("event", List.of("member"), "organizer");
                cancellations.queueAdminRemovals("event", List.of("member"), "organizer");
                var queued = mongo.getCollection("payments").find(new Document("_id", "before")).first();
                assertThat(queued.getDouble("refundRequestedTargetAmount")).isEqualTo(20d);
                assertThat(queued.getString("cancellationRequestedBy")).isEqualTo("organizer");
                assertThat(queued.getLong("version")).isEqualTo(3L);
                cancellations.acknowledgeCancelledRequest("before");
                assertThat(mongo.getCollection("payments").find(new Document("_id", "before")).first()).containsKey("refundRequestedTargetAmount");
                mongo.getCollection("payments").updateOne(new Document("_id", "before"), new Document("$set", new Document("bookingStatus", "cancelled")));
                cancellations.acknowledgeCancelledRequest("before");
                assertThat(mongo.getCollection("payments").find(new Document("_id", "before")).first()).doesNotContainKey("refundRequestedTargetAmount");
            }
        }
    }
}

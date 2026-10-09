package com.raxim.myscoutee.domain.payments.service;
import java.util.*;
import org.bson.Document;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.*;
import com.raxim.myscoutee.domain.payments.api.EventPaymentCancellations;
import com.raxim.myscoutee.domain.payments.document.Payment;
@Service
public class EventPaymentCancellationService implements EventPaymentCancellations {
 private final MongoTemplate mongo;
 private final PaymentJobQueries jobs;
 public EventPaymentCancellationService(MongoTemplate mongo, PaymentJobQueries jobs) { this.mongo = mongo; this.jobs = jobs; }
 public List<Payment> eligibleParticipantPayments(String sourceId, String userId) {
  return mongo.find(Query.query(paymentScope(sourceId, userId).and("eventChangeRefundEligible").is(true)), Payment.class);
 }
 public void queueAdminRemovals(String sourceId, Collection<String> userIds, String actorUserId) {
        if (userIds.isEmpty()) return;
        List<Payment> eligible = mongo.find(Query.query(paymentScope(sourceId, null)
                .and("userId").in(userIds).and("bookingStatus").ne("cancelled")), Payment.class);
        enqueueRefunds(eligible, actorUserId, "event-member-removed");
    }
    private void enqueueRefunds(List<Payment> eligible, String actor, String reason) {
        if (eligible.isEmpty()) return;
        // Persist all requests before removing membership or calling the provider.
        var writes = mongo.bulkOps(org.springframework.data.mongodb.core.BulkOperations.BulkMode.UNORDERED, Payment.class);
        for (Payment payment : eligible) {
            writes.updateOne(Query.query(Criteria.where("_id").is(payment.getId()).and("refundRequestedTargetAmount").is(null)),
                    new Update().set("refundRequestedTargetAmount", payment.getAmount())
                            .set("cancellationRequestedBy", actor).set("cancellationReason", reason)
                            .set("cancellationSessionMode", com.raxim.myscoutee.common.config.mongo.MongoSessionModeContext.currentMode().name()).inc("version", 1L));
        }
        writes.execute();
    }

 public List<Payment> pendingRequestedCancellations() {
  return jobs.find(Query.query(Criteria.where("auditKind").is("payment").and("refundRequestedTargetAmount").gt(0)).limit(20), Payment.class, Payment::getUserId);
 }
 public void acknowledgeCancelledRequest(String paymentId) {
                    mongo.updateFirst(Query.query(Criteria.where("_id").is(paymentId)
                                    .and("bookingStatus").is("cancelled")),
                            new Update().unset("refundRequestedTargetAmount").inc("version", 1L), Payment.class);
 }
 private static Criteria pendingCancellation(String sourceId) {
        Criteria pending = paymentScope(sourceId, null).andOperator(new Criteria().orOperator(
                Criteria.where("bookingStatus").ne("cancelled"),
                Criteria.where("$expr").is(new Document("$lt", List.of(
                        new Document("$ifNull", List.of("$refundedAmount", 0)), "$amount")))));
        return pending;
 }
 public List<Payment> pendingForCancelledEvent(String sourceId) {
  return mongo.find(Query.query(pendingCancellation(sourceId)).limit(20), Payment.class);
 }
 public boolean hasPendingForCancelledEvent(String sourceId) { return mongo.exists(Query.query(pendingCancellation(sourceId)), Payment.class); }
 public List<String> participantIds(String sourceId) { return mongo.findDistinct(Query.query(paymentScope(sourceId, null)), "userId", Payment.class, String.class); }
 public void grantChangedTerms(String sourceId, String stamp) {
        var paidAt = new Document("$ifNull", List.of("$capturedAtIso",
                new Document("$ifNull", List.of("$gatewayApprovedAtIso", "$createdDate"))));
        Criteria scope = paymentScope(sourceId, null)
                .and("$expr").is(new Document("$and", List.of(new Document("$lte", List.of(paidAt, stamp)),
                        new Document("$lt", List.of(new Document("$ifNull", List.of("$refundedAmount", 0)), "$amount")))))
                .and("bookingStatus").ne("cancelled");
        mongo.updateMulti(Query.query(scope).addCriteria(Criteria.where("eventChangeRefundEligible").ne(true)),
                new Update().set("eventChangeRefundEligible", true).inc("version", 1L), Payment.class);
 }
 public List<String> eligibleUserIds(String sourceId) {
  return mongo.findDistinct(Query.query(paymentScope(sourceId, null).and("eventChangeRefundEligible").is(true)), "userId", Payment.class, String.class);
 }
    private static Criteria paymentScope(String sourceId, String userId) {
        Criteria scope = new Criteria().orOperator(Criteria.where("sourceId").is(sourceId), Criteria.where("contextEventId").is(sourceId), Criteria.where("slotSourceId").is(sourceId))
                .and("auditKind").is("payment").and("amount").gt(0)
                .and("status").in("authorized", "approved", "captured", "partially_refunded", "refunded");
        if (StringUtils.hasText(userId)) scope.and("userId").is(userId);
        return scope;
    }

}

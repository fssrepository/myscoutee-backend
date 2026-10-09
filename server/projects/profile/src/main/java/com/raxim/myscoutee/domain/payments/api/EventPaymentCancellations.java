package com.raxim.myscoutee.domain.payments.api;
import java.util.*;
/** Payment-owned cancellation persistence and bounded worker routing views. */
public interface EventPaymentCancellations {
 List<? extends CancellationPayment> eligibleParticipantPayments(String sourceId, String userId);
 void queueAdminRemovals(String sourceId, Collection<String> userIds, String actorUserId);
 List<? extends CancellationPayment> pendingRequestedCancellations();
 void acknowledgeCancelledRequest(String paymentId);
 List<? extends CancellationPayment> pendingForCancelledEvent(String sourceId);
 boolean hasPendingForCancelledEvent(String sourceId);
 List<String> participantIds(String sourceId);
 void grantChangedTerms(String sourceId, String stamp);
 List<String> eligibleUserIds(String sourceId);
}

package com.raxim.myscoutee.domain.payments.api;
import java.util.*;
/** Payment-owned cancellation persistence. Returned views are local, read-only snapshots. */
public interface EventPaymentCancellations {
 List<? extends PaymentView> eligibleParticipantPayments(String sourceId, String userId);
 void queueAdminRemovals(String sourceId, Collection<String> userIds, String actorUserId);
 List<? extends PaymentView> pendingRequestedCancellations();
 void acknowledgeCancelledRequest(String paymentId);
 List<? extends PaymentView> pendingForCancelledEvent(String sourceId);
 boolean hasPendingForCancelledEvent(String sourceId);
 List<String> participantIds(String sourceId);
 void grantChangedTerms(String sourceId, String stamp);
 List<String> eligibleUserIds(String sourceId);
}

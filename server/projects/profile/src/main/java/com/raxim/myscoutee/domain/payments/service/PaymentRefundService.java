package com.raxim.myscoutee.domain.payments.service;

import static com.raxim.myscoutee.domain.payments.dto.PaymentDtos.PaymentHistoryMutationDto;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.springframework.http.HttpStatus;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.server.ResponseStatusException;

import com.raxim.myscoutee.domain.payments.document.Payment;
import com.raxim.myscoutee.domain.accounts.document.Users;
import com.raxim.myscoutee.domain.payments.repository.PaymentsRepository;
import com.raxim.myscoutee.domain.notifications.service.NotificationOutboxService;
import com.raxim.myscoutee.domain.notifications.service.NotificationOutboxService.NotificationIntent;

@Service
public class PaymentRefundService {
    private static final Set<String> REFUNDABLE_STATUSES = Set.of(
            "authorized", "captured", "approved", "partially_refunded");

    private final PaymentsRepository paymentsRepository;
    private final PaymentService paymentService;
    private final SavedPaymentMethodsService paymentMethodsService;
    private final NotificationOutboxService notificationOutboxService;
    private final MongoTemplate mongoTemplate;

    public PaymentRefundService(
            PaymentsRepository paymentsRepository,
            PaymentService paymentService,
            SavedPaymentMethodsService paymentMethodsService,
            NotificationOutboxService notificationOutboxService,
            MongoTemplate mongoTemplate) {
        this.paymentsRepository = paymentsRepository;
        this.paymentService = paymentService;
        this.paymentMethodsService = paymentMethodsService;
        this.notificationOutboxService = notificationOutboxService;
        this.mongoTemplate = mongoTemplate;
    }

    public synchronized PaymentHistoryMutationDto requestRefund(String paymentId, String actorUserId) {
        return requestRefund(paymentId, actorUserId, false);
    }

    public synchronized PaymentHistoryMutationDto requestChangedTermsRefund(String paymentId, String actorUserId) {
        return requestRefund(paymentId, actorUserId, true);
    }

    private PaymentHistoryMutationDto requestRefund(String paymentId, String actorUserId, boolean changedTerms) {
        String actorId = requiredId(actorUserId, "Current user");
        Payment payment = requirePayment(paymentId);
        if (!actorId.equals(normalize(payment.getUserId()))) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only the payer can request this refund.");
        }
        String recipientUserId = normalize(payment.getRecipientUserId());
        if (!StringUtils.hasText(recipientUserId) || recipientUserId.equals(actorId)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "This payment has no separate recipient.");
        }
        if (!REFUNDABLE_STATUSES.contains(normalize(payment.getStatus()).toLowerCase())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "This payment can no longer be refunded.");
        }
        if (StringUtils.hasText(payment.getAuditKind()) && !"payment".equals(payment.getAuditKind())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Payment audit revisions cannot be refunded.");
        }
        if (changedTerms && !payment.isEventChangeRefundEligible()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "No changed-terms refund is available.");
        }
        String historyId = changedTerms ? paymentService.refundHistoryIdForTarget(payment, payment.getAmount()) : refundHistoryId(payment);
        Payment existingRequest = paymentsRepository.findById(historyId).orElse(null);
        String requestStatus = refundRequestStatus(existingRequest);
        if ("pending".equals(requestStatus) || "approved".equals(requestStatus)) {
            if (changedTerms && "pending".equals(requestStatus) && !"event-terms-changed".equals(existingRequest.getRefundRuleId())) {
                double remaining = Math.max(0D, payment.getAmount() - (payment.getRefundedAmount() == null ? 0D : payment.getRefundedAmount()));
                existingRequest.setAmount(remaining);
                existingRequest.setRefundedAmount(remaining);
                existingRequest.setGatewayRefundTargetAmount(payment.getAmount());
                existingRequest.setRefundRuleId("event-terms-changed");
                existingRequest.setRefundNote("Changed event terms: full remaining refund.");
                existingRequest = paymentsRepository.save(existingRequest);
            }
            return paymentMethodsService.mutationDto(existingRequest, actorId);
        }
        if (existingRequest != null) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "A refund is already recorded for this payment.");
        }

        String now = Instant.now().toString();
        PaymentRefundCalculator.Preview refund = changedTerms
                ? new PaymentRefundCalculator.Preview(payment.getAmount(),
                        Math.max(0D, payment.getAmount() - (payment.getRefundedAmount() == null ? 0D : payment.getRefundedAmount())),
                        payment.getCurrency(), "available", "event-terms-changed", null, null,
                        "full", 100D, "Changed event terms: full remaining refund.")
                : PaymentRefundCalculator.preview(payment, now);
        if (refund.refundableAmount() <= 0) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "The refund policy does not allow a refund.");
        }
        Payment saved = changedTerms
                ? paymentService.saveRefundRequestHistoryRecord(payment, now, actorId, refund, historyId, payment.getAmount())
                : paymentService.saveRefundRequestHistoryRecord(payment, now, actorId, refund);
        if (saved == null) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "The refund request could not be recorded.");
        }
        incrementRecipientPendingCounter(recipientUserId);
        enqueueRefundNotification(saved, actorId, recipientUserId, false);
        return paymentMethodsService.mutationDto(saved, actorId);
    }

    public synchronized PaymentHistoryMutationDto approveRefund(String paymentId, String actorUserId) {
        String actorId = requiredId(actorUserId, "Current user");
        Payment selected = requirePayment(paymentId);
        Payment request = "refund".equals(normalize(selected.getAuditKind()))
                ? selected
                : paymentsRepository.findById(refundHistoryId(selected)).orElse(null);
        Payment payment = "refund".equals(normalize(selected.getAuditKind()))
                ? requirePayment(selected.getSupersedesPaymentId())
                : selected;
        if (!actorId.equals(normalize(payment.getRecipientUserId()))) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Only the payment recipient can approve this refund.");
        }
        String requestStatus = refundRequestStatus(request);
        if ("approved".equals(requestStatus)) {
            return paymentMethodsService.mutationDto(request, actorId);
        }
        if (!"pending".equals(requestStatus)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "There is no pending refund request for this payment.");
        }

        String now = Instant.now().toString();
        Payment refunded = "event-terms-changed".equals(request.getRefundRuleId())
                ? paymentService.completeEventCancellation(payment, "event-terms-changed")
                : paymentService.approvePolicyRefund(
                payment,
                now,
                request.getRefundedAmount() == null ? 0D : request.getRefundedAmount(),
                request.getRefundCurrency(),
                request.getRefundRuleId(),
                request.getRefundNote());
        Payment history = paymentService.saveRefundHistoryRecord(refunded);
        if (history == null) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "The refund history could not be recorded.");
        }
        history.setRefundRequestStatus("approved");
        history.setRefundReviewedAtIso(now);
        history.setRefundReviewedByUserId(actorId);
        history = paymentsRepository.save(history);
        enqueueRefundNotification(history, actorId, normalize(refunded.getUserId()), true);
        return paymentMethodsService.mutationDto(history, actorId);
    }

    private Payment requirePayment(String paymentId) {
        return paymentsRepository.findById(requiredId(paymentId, "Payment"))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Payment was not found."));
    }

    private void incrementRecipientPendingCounter(String recipientUserId) {
        mongoTemplate.updateFirst(
                Query.query(Criteria.where("userId").is(recipientUserId)),
                new Update().inc("paymentRefundsPending", 1),
                Users.class);
    }

    private void enqueueRefundNotification(
            Payment payment,
            String actorUserId,
            String recipientUserId,
            boolean approved) {
        if (!StringUtils.hasText(recipientUserId)||recipientUserId.equals(actorUserId)) return;
        String paymentId = StringUtils.hasText(normalize(payment.getSupersedesPaymentId()))
                ? normalize(payment.getSupersedesPaymentId())
                : normalize(payment.getId());
        String sourceId = normalize(payment.getSourceId());
        String type = approved ? "payment-refund-approved" : "payment-refund-requested";
        Map<String, String> payload = new LinkedHashMap<>();
        payload.put("paymentId", paymentId);
        var recipient=mongoTemplate.findOne(Query.query(Criteria.where("userId").is(recipientUserId)),Users.class);
        if(recipient!=null&&recipient.getWorkspaceGroupId()!=null)payload.put("workspaceGroupId",recipient.getWorkspaceGroupId());
        payload.put("sourceId", sourceId);
        payload.put("refundRequestStatus", approved ? "approved" : "pending");
        payload.put("refundAmount", Double.toString(payment.getRefundedAmount() == null ? 0D : payment.getRefundedAmount()));
        payload.put("refundCurrency", normalize(payment.getRefundCurrency()));
        payload.put("refundRuleId", normalize(payment.getRefundRuleId()));
        payload.put("notification_title_key", "notification.kind." + type + ".title");
        payload.put("notification_message_key", "notification.kind." + type + ".message");
        notificationOutboxService.enqueue(new NotificationIntent(
                type,
                "payment",
                paymentId,
                "payment-participant",
                List.of(recipientUserId),
                approved ? "Refund approved" : "Refund requested",
                approved
                        ? "The payment recipient approved your refund request."
                        : "A payer requested a refund for " + sourceId + ".",
                "/game?payments=1",
                "/assets/logo/heart.webp",
                "/assets/logo/heart.webp",
                type + "-" + paymentId,
                payload,
                actorUserId));
    }

    private String refundRequestStatus(Payment payment) {
        String status = normalize(payment == null ? null : payment.getRefundRequestStatus()).toLowerCase();
        return StringUtils.hasText(status) ? status : "none";
    }

    private String refundHistoryId(Payment payment) {
        return "refund:" + requiredId(payment == null ? null : payment.getId(), "Payment");
    }

    private String requiredId(String value, String label) {
        String normalized = normalize(value);
        if (!StringUtils.hasText(normalized)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, label + " is required.");
        }
        return normalized;
    }

    private String normalize(String value) {
        return value == null ? "" : value.trim();
    }
}

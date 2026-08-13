package com.raxim.myscoutee.profile.service;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.Instant;
import java.time.format.DateTimeParseException;
import java.util.Comparator;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.dao.OptimisticLockingFailureException;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.raxim.myscoutee.profile.data.document.Payment;
import com.raxim.myscoutee.profile.data.document.PaymentGatewayOperation;
import com.raxim.myscoutee.profile.repository.PaymentGatewayOperationsRepository;
import com.raxim.myscoutee.profile.repository.PaymentsRepository;

@Service
public class PaymentGatewayOperationService {
    private static final String STATUS_PENDING = "pending";
    private static final String STATUS_IN_PROGRESS = "in_progress";
    private static final String STATUS_SUCCEEDED = "succeeded";
    private static final String OPERATION_CAPTURE = "capture";
    private static final String OPERATION_RELEASE = "release";

    private final PaymentGatewayOperationsRepository operationsRepository;
    private final PaymentsRepository paymentsRepository;
    private final PaymentService paymentService;
    private final boolean paymentEnabled;

    public PaymentGatewayOperationService(
            PaymentGatewayOperationsRepository operationsRepository,
            PaymentsRepository paymentsRepository,
            PaymentService paymentService,
            @Value("${payment.enablePay:false}") boolean paymentEnabled) {
        this.operationsRepository = operationsRepository;
        this.paymentsRepository = paymentsRepository;
        this.paymentService = paymentService;
        this.paymentEnabled = paymentEnabled;
    }

    public PaymentGatewayOperation enqueueCapture(Payment payment, BigDecimal amount, String reason) {
        return enqueue(payment, OPERATION_CAPTURE, amount, reason);
    }

    public PaymentGatewayOperation enqueueRelease(Payment payment, String reason) {
        return enqueue(payment, OPERATION_RELEASE, null, reason);
    }

    @Scheduled(fixedDelayString = "${payment.operations.pollDelay:PT5S}")
    public void processPendingOperations() {
        if (!paymentEnabled) {
            return;
        }
        Instant now = Instant.now();
        operationsRepository.findByStatusIn(List.of(STATUS_PENDING, STATUS_IN_PROGRESS)).stream()
                .filter(operation -> isDue(operation, now))
                .sorted(Comparator.comparing(PaymentGatewayOperation::getCreatedAtIso))
                .limit(20)
                .forEach(this::claimAndProcess);
    }

    private PaymentGatewayOperation enqueue(
            Payment payment,
            String operationType,
            BigDecimal amount,
            String reason) {
        if (payment == null || !StringUtils.hasText(payment.getId())) {
            throw new IllegalArgumentException("A persisted payment is required for a gateway operation.");
        }
        String operationKey = "payment:" + payment.getId() + ":" + operationType + ":" + normalize(reason);
        PaymentGatewayOperation existing = operationsRepository.findByOperationKey(operationKey).orElse(null);
        if (existing != null) {
            assertSameOperationPayload(existing, payment, operationType, amount);
            return existing;
        }
        try {
            PaymentGatewayOperation operation = new PaymentGatewayOperation();
            operation.setOperationKey(operationKey);
            operation.setStatus(STATUS_PENDING);
            operation.setOperationType(operationType);
            operation.setPaymentId(payment.getId());
            operation.setAmount(amount == null ? null : amount.toPlainString());
            operation.setAttempts(0);
            operation.setNextAttemptAtIso(Instant.now().toString());
            operation.setCreatedAtIso(Instant.now().toString());
            return operationsRepository.save(operation);
        } catch (DuplicateKeyException race) {
            PaymentGatewayOperation raced = operationsRepository.findByOperationKey(operationKey)
                    .orElseThrow(() -> race);
            assertSameOperationPayload(raced, payment, operationType, amount);
            return raced;
        }
    }

    private void assertSameOperationPayload(
            PaymentGatewayOperation existing,
            Payment payment,
            String operationType,
            BigDecimal amount) {
        boolean samePayment = payment.getId().equals(existing.getPaymentId());
        boolean sameType = operationType.equals(existing.getOperationType());
        BigDecimal expectedAmount = amount == null ? null : amount.stripTrailingZeros();
        BigDecimal existingAmount = parseAmount(existing.getAmount());
        if (existingAmount != null) {
            existingAmount = existingAmount.stripTrailingZeros();
        }
        if (!samePayment || !sameType || !java.util.Objects.equals(expectedAmount, existingAmount)) {
            throw new IllegalStateException(
                    "A payment gateway idempotency key cannot be reused with a different operation payload.");
        }
    }

    private void claimAndProcess(PaymentGatewayOperation candidate) {
        Instant now = Instant.now();
        candidate.setStatus(STATUS_IN_PROGRESS);
        candidate.setLockedAtIso(now.toString());
        final PaymentGatewayOperation claimed;
        try {
            claimed = operationsRepository.save(candidate);
        } catch (OptimisticLockingFailureException lostClaim) {
            return;
        }
        try {
            Payment payment = paymentsRepository.findById(claimed.getPaymentId())
                    .orElseThrow(() -> new IllegalStateException("Payment for queued gateway operation was not found."));
            if (OPERATION_CAPTURE.equals(claimed.getOperationType())) {
                paymentService.captureGatewayAuthorization(
                        payment,
                        parseAmount(claimed.getAmount()),
                        claimed.getOperationKey());
            } else if (OPERATION_RELEASE.equals(claimed.getOperationType())) {
                paymentService.releaseGatewayAuthorization(payment, claimed.getOperationKey());
            } else {
                throw new IllegalStateException("Unsupported queued payment gateway operation.");
            }
            claimed.setStatus(STATUS_SUCCEEDED);
            claimed.setCompletedAtIso(Instant.now().toString());
            claimed.setLockedAtIso(null);
            claimed.setLastError(null);
            operationsRepository.save(claimed);
        } catch (RuntimeException failure) {
            int attempts = Math.max(0, claimed.getAttempts() == null ? 0 : claimed.getAttempts()) + 1;
            claimed.setAttempts(attempts);
            claimed.setStatus(STATUS_PENDING);
            claimed.setLockedAtIso(null);
            claimed.setLastError(failure.getClass().getSimpleName());
            claimed.setNextAttemptAtIso(Instant.now().plus(retryDelay(attempts)).toString());
            operationsRepository.save(claimed);
        }
    }

    private boolean isDue(PaymentGatewayOperation operation, Instant now) {
        if (STATUS_IN_PROGRESS.equals(operation.getStatus())) {
            return parseInstant(operation.getLockedAtIso())
                    .map(lockedAt -> lockedAt.plus(Duration.ofMinutes(5)).isBefore(now))
                    .orElse(true);
        }
        return parseInstant(operation.getNextAttemptAtIso())
                .map(next -> !next.isAfter(now))
                .orElse(true);
    }

    private java.util.Optional<Instant> parseInstant(String value) {
        if (!StringUtils.hasText(value)) {
            return java.util.Optional.empty();
        }
        try {
            return java.util.Optional.of(Instant.parse(value.trim()));
        } catch (DateTimeParseException ignored) {
            return java.util.Optional.empty();
        }
    }

    private Duration retryDelay(int attempts) {
        long seconds = Math.min(15 * 60L, 5L * (1L << Math.min(8, Math.max(0, attempts - 1))));
        return Duration.ofSeconds(seconds);
    }

    private BigDecimal parseAmount(String value) {
        if (!StringUtils.hasText(value)) {
            return null;
        }
        return new BigDecimal(value.trim());
    }

    private String normalize(String value) {
        String normalized = value == null ? "default" : value.trim().toLowerCase();
        return normalized.isEmpty() ? "default" : normalized.replaceAll("[^a-z0-9._-]+", "-");
    }
}

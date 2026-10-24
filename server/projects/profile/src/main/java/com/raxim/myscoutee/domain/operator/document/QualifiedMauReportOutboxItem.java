package com.raxim.myscoutee.domain.operator.document;

import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import com.raxim.myscoutee.domain.registry.api.RegistryProtocol;

/**
 * Durable, append-only client journal for completed monthly QMAU snapshots.
 *
 * <p>The completed-period evidence commitment and logical payload are
 * immutable. Only delivery attempts, retry scheduling, and the verified
 * registry receipt change after insertion.</p>
 */
@Document(collection = "qualifiedMauReportOutbox")
@CompoundIndexes({
        @CompoundIndex(
                name = "qmau_outbox_deployment_period_revision",
                def = "{'deploymentId': 1, 'period': 1, 'revision': 1}",
                unique = true),
        @CompoundIndex(
                name = "qmau_outbox_delivery",
                def = "{'deploymentId': 1, 'status': 1, 'nextRetryAt': 1,"
                        + " 'period': 1, 'revision': 1}")
})
@lombok.Getter @lombok.Setter
public class QualifiedMauReportOutboxItem extends RegistryOutboxIdentity {
    public static final int SCHEMA_VERSION = 1;

    public QualifiedMauReportOutboxItem() { super(SCHEMA_VERSION); }

    private String period;
    private String windowStart;
    private String windowEnd;
    private Long revision;
    private String supersedesBatchId;
    private String kind;
    private String rulesetVersion;
    private Long qualifiedMauCount;
    private Long actionCount;
    private Map<String, Long> actionCounts = new LinkedHashMap<>();
    private String commitmentHash;
    private String payloadHash;
    @Indexed(name = "qmau_outbox_idempotency", unique = true)
    private String idempotencyKey;
    private String status;
    private Integer attemptCount;
    private String nextRetryAt;
    private SignedAttempt lastAttempt;
    private Failure lastFailure;
    private RegistryProtocol.BatchResponse acceptedResponse;
    private String acceptedAt;
    private String createdAt;
    private String updatedAt;

    public void setActionCounts(Map<String, Long> actionCounts) {
        this.actionCounts = actionCounts == null
                ? new LinkedHashMap<>()
                : new LinkedHashMap<>(actionCounts);
    }

    @lombok.Getter @lombok.Setter
    public static class SignedAttempt {
        private String timestamp;
        private String nonce;
        private String payloadHash;
        private String signature;

        public SignedAttempt() {
        }

        public SignedAttempt(
                String timestamp,
                String nonce,
                String payloadHash,
                String signature) {
            this.timestamp = timestamp;
            this.nonce = nonce;
            this.payloadHash = payloadHash;
            this.signature = signature;
        }

    }

    @lombok.Getter @lombok.Setter
    public static class Failure {
        private String code;
        private String message;
        private String at;
        private Boolean retryable;

        public Failure() {
        }

        public Failure(
                String code,
                String message,
                String at,
                Boolean retryable) {
            this.code = code;
            this.message = message;
            this.at = at;
            this.retryable = retryable;
        }

    }
}

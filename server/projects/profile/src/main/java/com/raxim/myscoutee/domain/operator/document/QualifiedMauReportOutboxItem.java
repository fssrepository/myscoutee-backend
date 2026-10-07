package com.raxim.myscoutee.domain.operator.document;

import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Version;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import com.raxim.myscoutee.domain.registry.RegistryProtocol;

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
public class QualifiedMauReportOutboxItem {
    public static final int SCHEMA_VERSION = 1;
    public static final String STATUS_PENDING = "PENDING";
    public static final String STATUS_ACCEPTED = "ACCEPTED";
    public static final String STATUS_BLOCKED = "BLOCKED";

    @Id
    private String id;
    @Version
    private Long version;
    private Integer schemaVersion = SCHEMA_VERSION;
    private String registryScope;
    private String deploymentId;
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

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public Long getVersion() { return version; }
    public void setVersion(Long version) { this.version = version; }
    public Integer getSchemaVersion() { return schemaVersion; }
    public void setSchemaVersion(Integer schemaVersion) { this.schemaVersion = schemaVersion; }
    public String getRegistryScope() { return registryScope; }
    public void setRegistryScope(String registryScope) { this.registryScope = registryScope; }
    public String getDeploymentId() { return deploymentId; }
    public void setDeploymentId(String deploymentId) { this.deploymentId = deploymentId; }
    public String getPeriod() { return period; }
    public void setPeriod(String period) { this.period = period; }
    public String getWindowStart() { return windowStart; }
    public void setWindowStart(String windowStart) { this.windowStart = windowStart; }
    public String getWindowEnd() { return windowEnd; }
    public void setWindowEnd(String windowEnd) { this.windowEnd = windowEnd; }
    public Long getRevision() { return revision; }
    public void setRevision(Long revision) { this.revision = revision; }
    public String getSupersedesBatchId() { return supersedesBatchId; }
    public void setSupersedesBatchId(String supersedesBatchId) { this.supersedesBatchId = supersedesBatchId; }
    public String getKind() { return kind; }
    public void setKind(String kind) { this.kind = kind; }
    public String getRulesetVersion() { return rulesetVersion; }
    public void setRulesetVersion(String rulesetVersion) { this.rulesetVersion = rulesetVersion; }
    public Long getQualifiedMauCount() { return qualifiedMauCount; }
    public void setQualifiedMauCount(Long qualifiedMauCount) { this.qualifiedMauCount = qualifiedMauCount; }
    public Long getActionCount() { return actionCount; }
    public void setActionCount(Long actionCount) { this.actionCount = actionCount; }
    public Map<String, Long> getActionCounts() { return actionCounts; }
    public void setActionCounts(Map<String, Long> actionCounts) {
        this.actionCounts = actionCounts == null
                ? new LinkedHashMap<>()
                : new LinkedHashMap<>(actionCounts);
    }
    public String getCommitmentHash() { return commitmentHash; }
    public void setCommitmentHash(String commitmentHash) { this.commitmentHash = commitmentHash; }
    public String getPayloadHash() { return payloadHash; }
    public void setPayloadHash(String payloadHash) { this.payloadHash = payloadHash; }
    public String getIdempotencyKey() { return idempotencyKey; }
    public void setIdempotencyKey(String idempotencyKey) { this.idempotencyKey = idempotencyKey; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public Integer getAttemptCount() { return attemptCount; }
    public void setAttemptCount(Integer attemptCount) { this.attemptCount = attemptCount; }
    public String getNextRetryAt() { return nextRetryAt; }
    public void setNextRetryAt(String nextRetryAt) { this.nextRetryAt = nextRetryAt; }
    public SignedAttempt getLastAttempt() { return lastAttempt; }
    public void setLastAttempt(SignedAttempt lastAttempt) { this.lastAttempt = lastAttempt; }
    public Failure getLastFailure() { return lastFailure; }
    public void setLastFailure(Failure lastFailure) { this.lastFailure = lastFailure; }
    public RegistryProtocol.BatchResponse getAcceptedResponse() { return acceptedResponse; }
    public void setAcceptedResponse(RegistryProtocol.BatchResponse acceptedResponse) { this.acceptedResponse = acceptedResponse; }
    public String getAcceptedAt() { return acceptedAt; }
    public void setAcceptedAt(String acceptedAt) { this.acceptedAt = acceptedAt; }
    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }
    public String getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(String updatedAt) { this.updatedAt = updatedAt; }

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

        public String getTimestamp() { return timestamp; }
        public void setTimestamp(String timestamp) { this.timestamp = timestamp; }
        public String getNonce() { return nonce; }
        public void setNonce(String nonce) { this.nonce = nonce; }
        public String getPayloadHash() { return payloadHash; }
        public void setPayloadHash(String payloadHash) { this.payloadHash = payloadHash; }
        public String getSignature() { return signature; }
        public void setSignature(String signature) { this.signature = signature; }
    }

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

        public String getCode() { return code; }
        public void setCode(String code) { this.code = code; }
        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
        public String getAt() { return at; }
        public void setAt(String at) { this.at = at; }
        public Boolean getRetryable() { return retryable; }
        public void setRetryable(Boolean retryable) { this.retryable = retryable; }
    }
}

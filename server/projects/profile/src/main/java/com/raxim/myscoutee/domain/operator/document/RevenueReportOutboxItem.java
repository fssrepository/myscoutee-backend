package com.raxim.myscoutee.domain.operator.document;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Version;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import com.raxim.myscoutee.domain.registry.RegistryProtocol;

/**
 * Durable, append-only client-side journal for signed daily revenue reports.
 *
 * <p>A period/revision row is never rewritten with different accounting
 * content. Delivery attempts may refresh their timestamp, nonce, and
 * signature, while the logical idempotency key and payload remain stable.</p>
 */
@Document(collection = "revenueReportOutbox")
@CompoundIndexes({
        @CompoundIndex(
                name = "revenue_outbox_deployment_period_revision",
                def = "{'deploymentId': 1, 'period': 1, 'revision': 1}",
                unique = true),
        @CompoundIndex(
                name = "revenue_outbox_delivery",
                def = "{'deploymentId': 1, 'status': 1, 'nextRetryAt': 1, 'period': 1, 'revision': 1}")
})
public class RevenueReportOutboxItem {
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
    private Long revision;
    private String supersedesBatchId;
    private String kind;
    private String rulesetVersion;
    private Integer commissionRateBasisPoints;
    private List<RegistryProtocol.RevenueCurrencyRow> currencies =
            new ArrayList<>();
    private String aggregateHash;
    private String payloadHash;
    @Indexed(name = "revenue_outbox_idempotency", unique = true)
    private String idempotencyKey;
    private String status;
    private Integer attemptCount;
    private String nextRetryAt;
    private SignedAttempt lastAttempt;
    private Failure lastFailure;
    private RegistryProtocol.RevenueBatchResponse acceptedResponse;
    private String acceptedAt;
    private String createdAt;
    private String updatedAt;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Long getVersion() {
        return version;
    }

    public void setVersion(Long version) {
        this.version = version;
    }

    public Integer getSchemaVersion() {
        return schemaVersion;
    }

    public void setSchemaVersion(Integer schemaVersion) {
        this.schemaVersion = schemaVersion;
    }

    public String getRegistryScope() {
        return registryScope;
    }

    public void setRegistryScope(String registryScope) {
        this.registryScope = registryScope;
    }

    public String getDeploymentId() {
        return deploymentId;
    }

    public void setDeploymentId(String deploymentId) {
        this.deploymentId = deploymentId;
    }

    public String getPeriod() {
        return period;
    }

    public void setPeriod(String period) {
        this.period = period;
    }

    public Long getRevision() {
        return revision;
    }

    public void setRevision(Long revision) {
        this.revision = revision;
    }

    public String getSupersedesBatchId() {
        return supersedesBatchId;
    }

    public void setSupersedesBatchId(String supersedesBatchId) {
        this.supersedesBatchId = supersedesBatchId;
    }

    public String getKind() {
        return kind;
    }

    public void setKind(String kind) {
        this.kind = kind;
    }

    public String getRulesetVersion() {
        return rulesetVersion;
    }

    public void setRulesetVersion(String rulesetVersion) {
        this.rulesetVersion = rulesetVersion;
    }

    public Integer getCommissionRateBasisPoints() {
        return commissionRateBasisPoints;
    }

    public void setCommissionRateBasisPoints(Integer commissionRateBasisPoints) {
        this.commissionRateBasisPoints = commissionRateBasisPoints;
    }

    public List<RegistryProtocol.RevenueCurrencyRow> getCurrencies() {
        return currencies;
    }

    public void setCurrencies(
            List<RegistryProtocol.RevenueCurrencyRow> currencies) {
        this.currencies = currencies == null
                ? new ArrayList<>()
                : new ArrayList<>(currencies);
    }

    public String getAggregateHash() {
        return aggregateHash;
    }

    public void setAggregateHash(String aggregateHash) {
        this.aggregateHash = aggregateHash;
    }

    public String getPayloadHash() {
        return payloadHash;
    }

    public void setPayloadHash(String payloadHash) {
        this.payloadHash = payloadHash;
    }

    public String getIdempotencyKey() {
        return idempotencyKey;
    }

    public void setIdempotencyKey(String idempotencyKey) {
        this.idempotencyKey = idempotencyKey;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Integer getAttemptCount() {
        return attemptCount;
    }

    public void setAttemptCount(Integer attemptCount) {
        this.attemptCount = attemptCount;
    }

    public String getNextRetryAt() {
        return nextRetryAt;
    }

    public void setNextRetryAt(String nextRetryAt) {
        this.nextRetryAt = nextRetryAt;
    }

    public SignedAttempt getLastAttempt() {
        return lastAttempt;
    }

    public void setLastAttempt(SignedAttempt lastAttempt) {
        this.lastAttempt = lastAttempt;
    }

    public Failure getLastFailure() {
        return lastFailure;
    }

    public void setLastFailure(Failure lastFailure) {
        this.lastFailure = lastFailure;
    }

    public RegistryProtocol.RevenueBatchResponse getAcceptedResponse() {
        return acceptedResponse;
    }

    public void setAcceptedResponse(
            RegistryProtocol.RevenueBatchResponse acceptedResponse) {
        this.acceptedResponse = acceptedResponse;
    }

    public String getAcceptedAt() {
        return acceptedAt;
    }

    public void setAcceptedAt(String acceptedAt) {
        this.acceptedAt = acceptedAt;
    }

    public String getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    public String getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(String updatedAt) {
        this.updatedAt = updatedAt;
    }

    public static class SignedAttempt {
        private String timestamp;
        private String nonce;
        private String signature;
        private String persistedAt;

        public String getTimestamp() {
            return timestamp;
        }

        public void setTimestamp(String timestamp) {
            this.timestamp = timestamp;
        }

        public String getNonce() {
            return nonce;
        }

        public void setNonce(String nonce) {
            this.nonce = nonce;
        }

        public String getSignature() {
            return signature;
        }

        public void setSignature(String signature) {
            this.signature = signature;
        }

        public String getPersistedAt() {
            return persistedAt;
        }

        public void setPersistedAt(String persistedAt) {
            this.persistedAt = persistedAt;
        }
    }

    public static class Failure {
        private String code;
        private String message;
        private String at;
        private Boolean retryable;

        public String getCode() {
            return code;
        }

        public void setCode(String code) {
            this.code = code;
        }

        public String getMessage() {
            return message;
        }

        public void setMessage(String message) {
            this.message = message;
        }

        public String getAt() {
            return at;
        }

        public void setAt(String at) {
            this.at = at;
        }

        public Boolean getRetryable() {
            return retryable;
        }

        public void setRetryable(Boolean retryable) {
            this.retryable = retryable;
        }
    }
}

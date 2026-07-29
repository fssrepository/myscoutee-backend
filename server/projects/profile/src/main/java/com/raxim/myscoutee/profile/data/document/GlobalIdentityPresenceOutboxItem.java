package com.raxim.myscoutee.profile.data.document;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Version;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import com.raxim.myscoutee.registry.RegistryProtocol;

/**
 * Durable delivery journal for the opaque identity commitments attached to an
 * already accepted QMAU revision. It intentionally contains no local user id,
 * email, Firebase UID, provider subject, or action evidence.
 */
@Document(collection = "globalIdentityPresenceChunkOutbox")
@CompoundIndexes({
        @CompoundIndex(
                name = "global_identity_presence_deployment_period_revision_chunk",
                def = "{'deploymentId': 1, 'period': 1, 'revision': 1,"
                        + " 'chunkIndex': 1}",
                unique = true),
        @CompoundIndex(
                name = "global_identity_presence_delivery",
                def = "{'deploymentId': 1, 'status': 1, 'nextRetryAt': 1,"
                        + " 'period': 1, 'revision': 1, 'chunkIndex': 1}")
})
public class GlobalIdentityPresenceOutboxItem {
    public static final int SCHEMA_VERSION = 2;
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
    private String qmauReportId;
    private String qmauCommitmentHash;
    private String period;
    private Long revision;
    private String supersedesBatchId;
    private Long reportedQmauCount;
    private Long keyVersion;
    private String suite;
    private String submissionId;
    private Integer chunkIndex;
    private Integer chunkCount;
    private Long totalCommitmentCount;
    private String commitmentSetHash;
    private List<String> networkIdentityCommitments = new ArrayList<>();
    private Boolean materializationComplete = true;
    private String payloadHash;
    @Indexed(name = "global_identity_presence_idempotency", unique = true)
    private String idempotencyKey;
    private String status;
    private Integer attemptCount;
    private String nextRetryAt;
    private SignedAttempt lastAttempt;
    private Failure lastFailure;
    private RegistryProtocol.GlobalIdentityPresenceBatchResponse acceptedResponse;
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
    public String getQmauReportId() { return qmauReportId; }
    public void setQmauReportId(String qmauReportId) { this.qmauReportId = qmauReportId; }
    public String getQmauCommitmentHash() { return qmauCommitmentHash; }
    public void setQmauCommitmentHash(String qmauCommitmentHash) { this.qmauCommitmentHash = qmauCommitmentHash; }
    public String getPeriod() { return period; }
    public void setPeriod(String period) { this.period = period; }
    public Long getRevision() { return revision; }
    public void setRevision(Long revision) { this.revision = revision; }
    public String getSupersedesBatchId() { return supersedesBatchId; }
    public void setSupersedesBatchId(String supersedesBatchId) { this.supersedesBatchId = supersedesBatchId; }
    public Long getReportedQmauCount() { return reportedQmauCount; }
    public void setReportedQmauCount(Long reportedQmauCount) { this.reportedQmauCount = reportedQmauCount; }
    public Long getKeyVersion() { return keyVersion; }
    public void setKeyVersion(Long keyVersion) { this.keyVersion = keyVersion; }
    public String getSuite() { return suite; }
    public void setSuite(String suite) { this.suite = suite; }
    public String getSubmissionId() { return submissionId; }
    public void setSubmissionId(String submissionId) { this.submissionId = submissionId; }
    public Integer getChunkIndex() { return chunkIndex; }
    public void setChunkIndex(Integer chunkIndex) { this.chunkIndex = chunkIndex; }
    public Integer getChunkCount() { return chunkCount; }
    public void setChunkCount(Integer chunkCount) { this.chunkCount = chunkCount; }
    public Long getTotalCommitmentCount() { return totalCommitmentCount; }
    public void setTotalCommitmentCount(Long totalCommitmentCount) { this.totalCommitmentCount = totalCommitmentCount; }
    public String getCommitmentSetHash() { return commitmentSetHash; }
    public void setCommitmentSetHash(String commitmentSetHash) { this.commitmentSetHash = commitmentSetHash; }
    public List<String> getNetworkIdentityCommitments() { return List.copyOf(networkIdentityCommitments); }
    public void setNetworkIdentityCommitments(List<String> commitments) {
        this.networkIdentityCommitments = commitments == null
                ? new ArrayList<>()
                : new ArrayList<>(commitments);
    }
    public Boolean getMaterializationComplete() { return materializationComplete; }
    public void setMaterializationComplete(Boolean materializationComplete) { this.materializationComplete = materializationComplete; }
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
    public RegistryProtocol.GlobalIdentityPresenceBatchResponse getAcceptedResponse() { return acceptedResponse; }
    public void setAcceptedResponse(RegistryProtocol.GlobalIdentityPresenceBatchResponse acceptedResponse) { this.acceptedResponse = acceptedResponse; }
    public String getAcceptedAt() { return acceptedAt; }
    public void setAcceptedAt(String acceptedAt) { this.acceptedAt = acceptedAt; }
    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }
    public String getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(String updatedAt) { this.updatedAt = updatedAt; }

    public static class SignedAttempt {
        private String timestamp;
        private String nonce;
        private String signature;

        public SignedAttempt() {
        }

        public SignedAttempt(
                String timestamp,
                String nonce,
                String signature) {
            this.timestamp = timestamp;
            this.nonce = nonce;
            this.signature = signature;
        }

        public String getTimestamp() { return timestamp; }
        public void setTimestamp(String timestamp) { this.timestamp = timestamp; }
        public String getNonce() { return nonce; }
        public void setNonce(String nonce) { this.nonce = nonce; }
        public String getSignature() { return signature; }
        public void setSignature(String signature) { this.signature = signature; }
    }

    public static class Failure {
        private String code;
        private String at;
        private Boolean retryable;

        public Failure() {
        }

        public Failure(String code, String at, Boolean retryable) {
            this.code = code;
            this.at = at;
            this.retryable = retryable;
        }

        public String getCode() { return code; }
        public void setCode(String code) { this.code = code; }
        public String getAt() { return at; }
        public void setAt(String at) { this.at = at; }
        public Boolean getRetryable() { return retryable; }
        public void setRetryable(Boolean retryable) { this.retryable = retryable; }
    }
}

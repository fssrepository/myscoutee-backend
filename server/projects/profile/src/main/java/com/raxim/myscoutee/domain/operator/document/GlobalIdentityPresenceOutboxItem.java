package com.raxim.myscoutee.domain.operator.document;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import com.raxim.myscoutee.domain.registry.api.RegistryProtocol;

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
@lombok.Getter @lombok.Setter
public class GlobalIdentityPresenceOutboxItem extends RegistryOutboxIdentity {
    public static final int SCHEMA_VERSION = 2;

    public GlobalIdentityPresenceOutboxItem() { super(SCHEMA_VERSION); }

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
    private List<String> signedRequestHashes = new ArrayList<>();
    private Failure lastFailure;
    private RegistryProtocol.GlobalIdentityPresenceBatchResponse acceptedResponse;
    private String acceptedAt;
    private String createdAt;
    private String updatedAt;

    public List<String> getNetworkIdentityCommitments() { return List.copyOf(networkIdentityCommitments); }
    public void setNetworkIdentityCommitments(List<String> commitments) {
        this.networkIdentityCommitments = commitments == null
                ? new ArrayList<>()
                : new ArrayList<>(commitments);
    }
    public List<String> getSignedRequestHashes() {
        return signedRequestHashes == null
                ? List.of()
                : List.copyOf(signedRequestHashes);
    }
    public void setSignedRequestHashes(List<String> requestHashes) {
        this.signedRequestHashes = requestHashes == null
                ? new ArrayList<>()
                : new ArrayList<>(requestHashes);
    }

    @lombok.Getter @lombok.Setter
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

    }

    @lombok.Getter @lombok.Setter
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

    }
}

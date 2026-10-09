package com.raxim.myscoutee.domain.operator.document;

import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Version;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.index.CompoundIndexes;
import org.springframework.data.mongodb.core.mapping.Document;

import com.raxim.myscoutee.domain.registry.api.RegistryProtocol;

/**
 * Deployment-local journal for one user's privacy-preserving global identity.
 *
 * <p>The local user id is never sent to the registry. Email addresses,
 * Firebase UIDs, provider subjects, and plain identifier hashes are
 * deliberately absent from this collection. The registry-visible value is an
 * RFC 9497 VOPRF-derived opaque commitment.</p>
 */
@Document(collection = "globalIdentityLinkStates")
@CompoundIndexes({
        @CompoundIndex(
                name = "global_identity_link_deployment_user",
                def = "{'deploymentId': 1, 'localUserId': 1}",
                unique = true),
        @CompoundIndex(
                name = "global_identity_link_presence",
                def = "{'deploymentId': 1, 'status': 1, 'keyVersion': 1,"
                        + " 'localUserId': 1}")
})
public class GlobalIdentityLinkState {
    public static final int SCHEMA_VERSION = 1;
    public static final String STATUS_PENDING = "PENDING";
    public static final String STATUS_ACTIVE = "ACTIVE";
    public static final String STATUS_UNLINKED = "UNLINKED";

    @Id
    private String id;
    @Version
    private Long version;
    private Integer schemaVersion = SCHEMA_VERSION;
    private String registryScope;
    private String deploymentId;
    private String localUserId;
    private String status;
    private Long keyVersion;
    private String suite;
    private String networkIdentityCommitment;
    private String linkId;
    private String consentVersion;
    private String consentEvidenceCommitment;
    private String consentEvidenceNonce;
    private String verifiedAt;
    private String activeFromPeriod;
    private String inactiveFromPeriod;
    private Long latestEventIndex;
    private String latestEventHash;
    private PendingOperation pendingOperation;
    private RegistryProtocol.GlobalIdentityMutationResponse acceptedResponse;
    private String lastOperationIdempotencyKey;
    private Boolean purgeRequested;
    private String purgeTombstoneId;
    private String purgeRequestedAt;
    private String purgedAt;
    private String purgeUnlinkIdempotencyKey;
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
    public String getLocalUserId() { return localUserId; }
    public void setLocalUserId(String localUserId) { this.localUserId = localUserId; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public Long getKeyVersion() { return keyVersion; }
    public void setKeyVersion(Long keyVersion) { this.keyVersion = keyVersion; }
    public String getSuite() { return suite; }
    public void setSuite(String suite) { this.suite = suite; }
    public String getNetworkIdentityCommitment() { return networkIdentityCommitment; }
    public void setNetworkIdentityCommitment(String networkIdentityCommitment) { this.networkIdentityCommitment = networkIdentityCommitment; }
    public String getLinkId() { return linkId; }
    public void setLinkId(String linkId) { this.linkId = linkId; }
    public String getConsentVersion() { return consentVersion; }
    public void setConsentVersion(String consentVersion) { this.consentVersion = consentVersion; }
    public String getConsentEvidenceCommitment() { return consentEvidenceCommitment; }
    public void setConsentEvidenceCommitment(String consentEvidenceCommitment) { this.consentEvidenceCommitment = consentEvidenceCommitment; }
    public String getConsentEvidenceNonce() { return consentEvidenceNonce; }
    public void setConsentEvidenceNonce(String consentEvidenceNonce) { this.consentEvidenceNonce = consentEvidenceNonce; }
    public String getVerifiedAt() { return verifiedAt; }
    public void setVerifiedAt(String verifiedAt) { this.verifiedAt = verifiedAt; }
    public String getActiveFromPeriod() { return activeFromPeriod; }
    public void setActiveFromPeriod(String activeFromPeriod) { this.activeFromPeriod = activeFromPeriod; }
    public String getInactiveFromPeriod() { return inactiveFromPeriod; }
    public void setInactiveFromPeriod(String inactiveFromPeriod) { this.inactiveFromPeriod = inactiveFromPeriod; }
    public Long getLatestEventIndex() { return latestEventIndex; }
    public void setLatestEventIndex(Long latestEventIndex) { this.latestEventIndex = latestEventIndex; }
    public String getLatestEventHash() { return latestEventHash; }
    public void setLatestEventHash(String latestEventHash) { this.latestEventHash = latestEventHash; }
    public PendingOperation getPendingOperation() { return pendingOperation; }
    public void setPendingOperation(PendingOperation pendingOperation) { this.pendingOperation = pendingOperation; }
    public RegistryProtocol.GlobalIdentityMutationResponse getAcceptedResponse() { return acceptedResponse; }
    public void setAcceptedResponse(RegistryProtocol.GlobalIdentityMutationResponse acceptedResponse) { this.acceptedResponse = acceptedResponse; }
    public String getLastOperationIdempotencyKey() { return lastOperationIdempotencyKey; }
    public void setLastOperationIdempotencyKey(String lastOperationIdempotencyKey) { this.lastOperationIdempotencyKey = lastOperationIdempotencyKey; }
    public Boolean getPurgeRequested() { return purgeRequested; }
    public void setPurgeRequested(Boolean purgeRequested) { this.purgeRequested = purgeRequested; }
    public String getPurgeTombstoneId() { return purgeTombstoneId; }
    public void setPurgeTombstoneId(String purgeTombstoneId) { this.purgeTombstoneId = purgeTombstoneId; }
    public String getPurgeRequestedAt() { return purgeRequestedAt; }
    public void setPurgeRequestedAt(String purgeRequestedAt) { this.purgeRequestedAt = purgeRequestedAt; }
    public String getPurgedAt() { return purgedAt; }
    public void setPurgedAt(String purgedAt) { this.purgedAt = purgedAt; }
    public String getPurgeUnlinkIdempotencyKey() { return purgeUnlinkIdempotencyKey; }
    public void setPurgeUnlinkIdempotencyKey(String purgeUnlinkIdempotencyKey) { this.purgeUnlinkIdempotencyKey = purgeUnlinkIdempotencyKey; }
    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }
    public String getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(String updatedAt) { this.updatedAt = updatedAt; }

    public static class PendingOperation {
        private String action;
        private String idempotencyKey;
        private Long keyVersion;
        private String suite;
        private String networkIdentityCommitment;
        private String consentVersion;
        private String consentEvidenceCommitment;
        private String consentEvidenceNonce;
        private String verifiedAt;
        private String effectivePeriod;
        private String reasonCommitment;
        private String payloadHash;
        private String createdAt;

        public PendingOperation() {
        }

        public String getAction() { return action; }
        public void setAction(String action) { this.action = action; }
        public String getIdempotencyKey() { return idempotencyKey; }
        public void setIdempotencyKey(String idempotencyKey) { this.idempotencyKey = idempotencyKey; }
        public Long getKeyVersion() { return keyVersion; }
        public void setKeyVersion(Long keyVersion) { this.keyVersion = keyVersion; }
        public String getSuite() { return suite; }
        public void setSuite(String suite) { this.suite = suite; }
        public String getNetworkIdentityCommitment() { return networkIdentityCommitment; }
        public void setNetworkIdentityCommitment(String networkIdentityCommitment) { this.networkIdentityCommitment = networkIdentityCommitment; }
        public String getConsentVersion() { return consentVersion; }
        public void setConsentVersion(String consentVersion) { this.consentVersion = consentVersion; }
        public String getConsentEvidenceCommitment() { return consentEvidenceCommitment; }
        public void setConsentEvidenceCommitment(String consentEvidenceCommitment) { this.consentEvidenceCommitment = consentEvidenceCommitment; }
        public String getConsentEvidenceNonce() { return consentEvidenceNonce; }
        public void setConsentEvidenceNonce(String consentEvidenceNonce) { this.consentEvidenceNonce = consentEvidenceNonce; }
        public String getVerifiedAt() { return verifiedAt; }
        public void setVerifiedAt(String verifiedAt) { this.verifiedAt = verifiedAt; }
        public String getEffectivePeriod() { return effectivePeriod; }
        public void setEffectivePeriod(String effectivePeriod) { this.effectivePeriod = effectivePeriod; }
        public String getReasonCommitment() { return reasonCommitment; }
        public void setReasonCommitment(String reasonCommitment) { this.reasonCommitment = reasonCommitment; }
        public String getPayloadHash() { return payloadHash; }
        public void setPayloadHash(String payloadHash) { this.payloadHash = payloadHash; }
        public String getCreatedAt() { return createdAt; }
        public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }
    }
}

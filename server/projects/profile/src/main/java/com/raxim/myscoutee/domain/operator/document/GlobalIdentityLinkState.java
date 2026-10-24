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
@lombok.Getter @lombok.Setter
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

    @lombok.Getter @lombok.Setter
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

    }
}

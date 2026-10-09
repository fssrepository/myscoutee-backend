package com.raxim.myscoutee.domain.registry.dto;
import java.util.*;
import java.time.Instant;
import java.nio.file.Path;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.raxim.myscoutee.domain.registry.api.RegistryProtocol;
import com.raxim.myscoutee.domain.registry.api.RegistryProtocol.*;
public final class RegistryState {
    private RegistryState() {}
    public record LocalState(
            @JsonProperty("schema_version") Integer schemaVersion,
            @JsonProperty("protocol_version") String protocolVersion,
            @JsonProperty("registry_scope") String registryScope,
            @JsonProperty("public_key_fingerprint") String publicKeyFingerprint,
            @JsonProperty("registration_idempotency_key") String registrationIdempotencyKey,
            @JsonProperty("registration_software_version") String registrationSoftwareVersion,
            @JsonProperty("installation_idempotency_key") String installationIdempotencyKey,
            @JsonProperty("installation_period") String installationPeriod,
            @JsonProperty("trusted_registry_key_fingerprint") String trustedRegistryKeyFingerprint,
            @JsonProperty("deployment_id") String deploymentId,
            RegistrationProtocolState registration,
            @JsonProperty("installation_batch") RegistryProtocol.BatchResponse installationBatch,
            @JsonProperty("updated_at") String updatedAt) {

        public LocalState withRegistration(
                RegistryProtocol.RegistrationResponse response,
                String trustedFingerprint,
                Instant now) {
            return new LocalState(
                    schemaVersion,
                    protocolVersion,
                    registryScope,
                    publicKeyFingerprint,
                    registrationIdempotencyKey,
                    registrationSoftwareVersion,
                    installationIdempotencyKey,
                    installationPeriod,
                    trustedFingerprint,
                    response.deploymentId(),
                    new RegistrationProtocolState(response),
                    installationBatch,
                    now.toString());
        }

        public LocalState withInstallationBatch(
                RegistryProtocol.BatchResponse response,
                Instant now) {
            return new LocalState(
                    schemaVersion,
                    protocolVersion,
                    registryScope,
                    publicKeyFingerprint,
                    registrationIdempotencyKey,
                    registrationSoftwareVersion,
                    installationIdempotencyKey,
                    installationPeriod,
                    trustedRegistryKeyFingerprint,
                    deploymentId,
                    registration,
                    response,
                    now.toString());
        }
    }
    public record RegistrationProtocolState(
            RegistryProtocol.RegistrationResponse receipt) {
        public String deploymentId() {
            return receipt == null ? null : receipt.deploymentId();
        }
    }
    public record OperatorActionJournalEntry(
            @JsonProperty("schema_version") Integer schemaVersion,
            @JsonProperty("protocol_version") String protocolVersion,
            @JsonProperty("registry_scope") String registryScope,
            @JsonProperty("deployment_id") String deploymentId,
            @JsonProperty("request_timestamp") String requestTimestamp,
            String nonce,
            @JsonProperty("idempotency_key") String idempotencyKey,
            String action,
            @JsonProperty("operator_name") String operatorName,
            @JsonProperty("operator_avatar_url") String operatorAvatarUrl,
            @JsonProperty("legal_name") String legalName,
            @JsonProperty("registration_number") String registrationNumber,
            String jurisdiction,
            @JsonProperty("registered_address") String registeredAddress,
            String website,
            @JsonProperty("verification_contact_name") String verificationContactName,
            @JsonProperty("verification_contact_role") String verificationContactRole,
            @JsonProperty("verification_contact_email") String verificationContactEmail,
            @JsonProperty("authority_attested") Boolean authorityAttested,
            @JsonProperty("client_token_hash") String clientTokenHash,
            @JsonProperty("token_ttl_seconds") Long tokenTtlSeconds,
            @JsonProperty("token_id") String tokenId,
            @JsonProperty("link_id") String linkId,
            @JsonProperty("payload_hash") String payloadHash,
            @JsonProperty("request_signature") String requestSignature,
            RegistryProtocol.OperatorActionReceipt receipt) {
    }
    public record OperatorClaimStatusEvidence(
            @JsonProperty("schema_version") Integer schemaVersion,
            RegistryProtocol.OperatorClaimStatusReceipt status) {
    }
    public record BindingArchiveRequest(
            String registryBaseUrl,
            String registryScope,
            String registryKeyId,
            String registryPublicKeyFingerprint,
            String deploymentId,
            RegistryProtocol.OperatorActionReceipt deactivationReceipt,
            String archivedAt,
            String archivedBy) {
    }
    public record BindingArchive(
            String archiveId,
            String deploymentId,
            String registryScope,
            Path archiveDirectory) {
    }
    public record BindingArchiveManifest(
            @JsonProperty("schema_version") Integer schemaVersion,
            @JsonProperty("archive_id") String archiveId,
            @JsonProperty("registry_base_url") String registryBaseUrl,
            @JsonProperty("registry_scope") String registryScope,
            @JsonProperty("registry_key_id") String registryKeyId,
            @JsonProperty("registry_public_key_fingerprint")
            String registryPublicKeyFingerprint,
            @JsonProperty("deployment_id") String deploymentId,
            @JsonProperty("deactivation_audit_index")
            Long deactivationAuditIndex,
            @JsonProperty("deactivation_audit_hash")
            String deactivationAuditHash,
            @JsonProperty("deactivated_at") String deactivatedAt,
            @JsonProperty("archived_at") String archivedAt,
            @JsonProperty("archived_by") String archivedBy) {
    }
}

package com.raxim.myscoutee.profile.data.document;

import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Version;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "operatorRegistrySettings")
public class OperatorRegistrySettings {
    public static final String SINGLETON_ID = "deployment-registry";
    public static final int SCHEMA_VERSION = 2;

    @Id
    private String id = SINGLETON_ID;
    @Version
    private Long version;
    private Integer schemaVersion = SCHEMA_VERSION;
    private String lifecycle = "UNCONFIGURED";
    private Boolean enabled = false;
    private DraftInspection draftInspection;
    private RegistrySelection selection;
    private RegistrationRequest registrationRequest;
    private NodeIdentity nodeIdentity;
    private EnrollmentSummary enrollment;
    private Audit audit = new Audit();
    private Failure lastError;

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

    public String getLifecycle() {
        return lifecycle;
    }

    public void setLifecycle(String lifecycle) {
        this.lifecycle = lifecycle;
    }

    public Boolean getEnabled() {
        return enabled;
    }

    public void setEnabled(Boolean enabled) {
        this.enabled = enabled;
    }

    public DraftInspection getDraftInspection() {
        return draftInspection;
    }

    public void setDraftInspection(DraftInspection draftInspection) {
        this.draftInspection = draftInspection;
    }

    public RegistrySelection getSelection() {
        return selection;
    }

    public void setSelection(RegistrySelection selection) {
        this.selection = selection;
    }

    public RegistrationRequest getRegistrationRequest() {
        return registrationRequest;
    }

    public void setRegistrationRequest(RegistrationRequest registrationRequest) {
        this.registrationRequest = registrationRequest;
    }

    public NodeIdentity getNodeIdentity() {
        return nodeIdentity;
    }

    public void setNodeIdentity(NodeIdentity nodeIdentity) {
        this.nodeIdentity = nodeIdentity;
    }

    public EnrollmentSummary getEnrollment() {
        return enrollment;
    }

    public void setEnrollment(EnrollmentSummary enrollment) {
        this.enrollment = enrollment;
    }

    public Audit getAudit() {
        return audit;
    }

    public void setAudit(Audit audit) {
        this.audit = audit;
    }

    public Failure getLastError() {
        return lastError;
    }

    public void setLastError(Failure lastError) {
        this.lastError = lastError;
    }

    public static class DraftInspection {
        private String baseUrl;
        private String protocolVersion;
        private String registryScope;
        private String registryKeyId;
        private String registryPublicKeyFingerprint;
        private String identityEndpoint;
        private String tokenHash;
        private String inspectedAt;
        private String expiresAt;
        private String inspectedBy;

        public String getBaseUrl() { return baseUrl; }
        public void setBaseUrl(String baseUrl) { this.baseUrl = baseUrl; }
        public String getProtocolVersion() { return protocolVersion; }
        public void setProtocolVersion(String protocolVersion) { this.protocolVersion = protocolVersion; }
        public String getRegistryScope() { return registryScope; }
        public void setRegistryScope(String registryScope) { this.registryScope = registryScope; }
        public String getRegistryKeyId() { return registryKeyId; }
        public void setRegistryKeyId(String registryKeyId) { this.registryKeyId = registryKeyId; }
        public String getRegistryPublicKeyFingerprint() { return registryPublicKeyFingerprint; }
        public void setRegistryPublicKeyFingerprint(String value) { this.registryPublicKeyFingerprint = value; }
        public String getIdentityEndpoint() { return identityEndpoint; }
        public void setIdentityEndpoint(String identityEndpoint) { this.identityEndpoint = identityEndpoint; }
        public String getTokenHash() { return tokenHash; }
        public void setTokenHash(String tokenHash) { this.tokenHash = tokenHash; }
        public String getInspectedAt() { return inspectedAt; }
        public void setInspectedAt(String inspectedAt) { this.inspectedAt = inspectedAt; }
        public String getExpiresAt() { return expiresAt; }
        public void setExpiresAt(String expiresAt) { this.expiresAt = expiresAt; }
        public String getInspectedBy() { return inspectedBy; }
        public void setInspectedBy(String inspectedBy) { this.inspectedBy = inspectedBy; }
    }

    public static class RegistrySelection {
        private String baseUrl;
        private String protocolVersion;
        private String registryScope;
        private String registryKeyId;
        private String registryPublicKeyFingerprint;
        private String identityEndpoint;
        private String confirmedAt;
        private String confirmedBy;

        public String getBaseUrl() { return baseUrl; }
        public void setBaseUrl(String baseUrl) { this.baseUrl = baseUrl; }
        public String getProtocolVersion() { return protocolVersion; }
        public void setProtocolVersion(String protocolVersion) { this.protocolVersion = protocolVersion; }
        public String getRegistryScope() { return registryScope; }
        public void setRegistryScope(String registryScope) { this.registryScope = registryScope; }
        public String getRegistryKeyId() { return registryKeyId; }
        public void setRegistryKeyId(String registryKeyId) { this.registryKeyId = registryKeyId; }
        public String getRegistryPublicKeyFingerprint() { return registryPublicKeyFingerprint; }
        public void setRegistryPublicKeyFingerprint(String value) { this.registryPublicKeyFingerprint = value; }
        public String getIdentityEndpoint() { return identityEndpoint; }
        public void setIdentityEndpoint(String identityEndpoint) { this.identityEndpoint = identityEndpoint; }
        public String getConfirmedAt() { return confirmedAt; }
        public void setConfirmedAt(String confirmedAt) { this.confirmedAt = confirmedAt; }
        public String getConfirmedBy() { return confirmedBy; }
        public void setConfirmedBy(String confirmedBy) { this.confirmedBy = confirmedBy; }
    }

    public static class RegistrationRequest {
        private String baseUrl;
        private String registryScope;
        private String registryKeyId;
        private String registryPublicKeyFingerprint;
        private String requestedAt;
        private String requestedBy;

        public String getBaseUrl() { return baseUrl; }
        public void setBaseUrl(String baseUrl) { this.baseUrl = baseUrl; }
        public String getRegistryScope() { return registryScope; }
        public void setRegistryScope(String registryScope) { this.registryScope = registryScope; }
        public String getRegistryKeyId() { return registryKeyId; }
        public void setRegistryKeyId(String registryKeyId) { this.registryKeyId = registryKeyId; }
        public String getRegistryPublicKeyFingerprint() {
            return registryPublicKeyFingerprint;
        }
        public void setRegistryPublicKeyFingerprint(String value) {
            this.registryPublicKeyFingerprint = value;
        }
        public String getRequestedAt() { return requestedAt; }
        public void setRequestedAt(String requestedAt) { this.requestedAt = requestedAt; }
        public String getRequestedBy() { return requestedBy; }
        public void setRequestedBy(String requestedBy) { this.requestedBy = requestedBy; }
    }

    public static class NodeIdentity {
        private String state;
        private String publicKeyFingerprint;
        private String initializedAt;

        public String getState() { return state; }
        public void setState(String state) { this.state = state; }
        public String getPublicKeyFingerprint() { return publicKeyFingerprint; }
        public void setPublicKeyFingerprint(String value) { this.publicKeyFingerprint = value; }
        public String getInitializedAt() { return initializedAt; }
        public void setInitializedAt(String initializedAt) { this.initializedAt = initializedAt; }
    }

    public static class EnrollmentSummary {
        private String deploymentCode;
        private String installationTestBatchId;
        private String installationTestAcceptedAt;
        private Long installationTestLedgerIndex;
        private String completedAt;

        public String getDeploymentCode() { return deploymentCode; }
        public void setDeploymentCode(String deploymentCode) { this.deploymentCode = deploymentCode; }
        public String getInstallationTestBatchId() { return installationTestBatchId; }
        public void setInstallationTestBatchId(String value) { this.installationTestBatchId = value; }
        public String getInstallationTestAcceptedAt() { return installationTestAcceptedAt; }
        public void setInstallationTestAcceptedAt(String value) { this.installationTestAcceptedAt = value; }
        public Long getInstallationTestLedgerIndex() { return installationTestLedgerIndex; }
        public void setInstallationTestLedgerIndex(Long value) { this.installationTestLedgerIndex = value; }
        public String getCompletedAt() { return completedAt; }
        public void setCompletedAt(String completedAt) { this.completedAt = completedAt; }
    }

    public static class Audit {
        private String createdAt;
        private String updatedAt;
        private String lastAttemptAt;
        private String lastSuccessAt;
        private String disabledAt;
        private String disabledBy;
        private String updatedBy;

        public String getCreatedAt() { return createdAt; }
        public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }
        public String getUpdatedAt() { return updatedAt; }
        public void setUpdatedAt(String updatedAt) { this.updatedAt = updatedAt; }
        public String getLastAttemptAt() { return lastAttemptAt; }
        public void setLastAttemptAt(String lastAttemptAt) { this.lastAttemptAt = lastAttemptAt; }
        public String getLastSuccessAt() { return lastSuccessAt; }
        public void setLastSuccessAt(String lastSuccessAt) { this.lastSuccessAt = lastSuccessAt; }
        public String getDisabledAt() { return disabledAt; }
        public void setDisabledAt(String disabledAt) { this.disabledAt = disabledAt; }
        public String getDisabledBy() { return disabledBy; }
        public void setDisabledBy(String disabledBy) { this.disabledBy = disabledBy; }
        public String getUpdatedBy() { return updatedBy; }
        public void setUpdatedBy(String updatedBy) { this.updatedBy = updatedBy; }
    }

    public static class Failure {
        private String code;
        private String message;
        private String at;
        private Boolean retryable;

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

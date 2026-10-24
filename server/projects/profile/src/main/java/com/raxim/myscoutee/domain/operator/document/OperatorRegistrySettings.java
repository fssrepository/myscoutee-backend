package com.raxim.myscoutee.domain.operator.document;

import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Version;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "operatorRegistrySettings")
@lombok.Getter @lombok.Setter
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

    @lombok.Getter @lombok.Setter
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

    }

    @lombok.Getter @lombok.Setter
    public static class RegistrySelection {
        private String baseUrl;
        private String protocolVersion;
        private String registryScope;
        private String registryKeyId;
        private String registryPublicKeyFingerprint;
        private String identityEndpoint;
        private String confirmedAt;
        private String confirmedBy;

    }

    @lombok.Getter @lombok.Setter
    public static class RegistrationRequest {
        private String baseUrl;
        private String registryScope;
        private String registryKeyId;
        private String registryPublicKeyFingerprint;
        private String requestedAt;
        private String requestedBy;

    }

    @lombok.Getter @lombok.Setter
    public static class NodeIdentity {
        private String state;
        private String publicKeyFingerprint;
        private String initializedAt;

    }

    @lombok.Getter @lombok.Setter
    public static class EnrollmentSummary {
        private String deploymentCode;
        private String installationTestBatchId;
        private String installationTestAcceptedAt;
        private Long installationTestLedgerIndex;
        private String completedAt;

    }

    @lombok.Getter @lombok.Setter
    public static class Audit {
        private String createdAt;
        private String updatedAt;
        private String lastAttemptAt;
        private String lastSuccessAt;
        private String disabledAt;
        private String disabledBy;
        private String updatedBy;

    }

    @lombok.Getter @lombok.Setter
    public static class Failure {
        private String code;
        private String message;
        private String at;
        private Boolean retryable;

    }
}

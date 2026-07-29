package com.raxim.myscoutee.profile.data.document;

import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Version;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "deploymentConfigurations")
public class DeploymentConfiguration {
    public static final String SINGLETON_ID = "deployment-configuration";
    public static final int SCHEMA_VERSION = 3;

    @Id
    private String id;
    @Version
    private Long version;
    private Integer schemaVersion;
    private Branding branding;
    private List<SocialLink> socialLinks;
    private PrivacyContact privacyContact;
    private Payment payment;
    private Firebase firebase;
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

    public Branding getBranding() {
        return branding;
    }

    public void setBranding(Branding branding) {
        this.branding = branding;
    }

    public Payment getPayment() {
        return payment;
    }

    public List<SocialLink> getSocialLinks() {
        return socialLinks;
    }

    public void setSocialLinks(List<SocialLink> socialLinks) {
        this.socialLinks = socialLinks;
    }

    public PrivacyContact getPrivacyContact() {
        return privacyContact;
    }

    public void setPrivacyContact(PrivacyContact privacyContact) {
        this.privacyContact = privacyContact;
    }

    public void setPayment(Payment payment) {
        this.payment = payment;
    }

    public Firebase getFirebase() {
        return firebase;
    }

    public void setFirebase(Firebase firebase) {
        this.firebase = firebase;
    }

    public String getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(String updatedAt) {
        this.updatedAt = updatedAt;
    }

    public static class Branding {
        private String productName;
        private Integer logoCharacterIndex;
        private String homeLabel;
        private String logoUrl;
        private String themePreset;
        private Long revision;

        public String getProductName() {
            return productName;
        }

        public void setProductName(String productName) {
            this.productName = productName;
        }

        public Integer getLogoCharacterIndex() {
            return logoCharacterIndex;
        }

        public void setLogoCharacterIndex(Integer logoCharacterIndex) {
            this.logoCharacterIndex = logoCharacterIndex;
        }

        public String getHomeLabel() {
            return homeLabel;
        }

        public void setHomeLabel(String homeLabel) {
            this.homeLabel = homeLabel;
        }

        public String getLogoUrl() {
            return logoUrl;
        }

        public void setLogoUrl(String logoUrl) {
            this.logoUrl = logoUrl;
        }

        public String getThemePreset() {
            return themePreset;
        }

        public void setThemePreset(String themePreset) {
            this.themePreset = themePreset;
        }

        public Long getRevision() {
            return revision;
        }

        public void setRevision(Long revision) {
            this.revision = revision;
        }
    }

    public static class Payment {
        private String providerId;
        private EncryptedSecret credentialEnvelope;
        private String credentialMask;

        public String getProviderId() {
            return providerId;
        }

        public void setProviderId(String providerId) {
            this.providerId = providerId;
        }

        public EncryptedSecret getCredentialEnvelope() {
            return credentialEnvelope;
        }

        public void setCredentialEnvelope(EncryptedSecret credentialEnvelope) {
            this.credentialEnvelope = credentialEnvelope;
        }

        public String getCredentialMask() {
            return credentialMask;
        }

        public void setCredentialMask(String credentialMask) {
            this.credentialMask = credentialMask;
        }
    }

    public static class SocialLink {
        private String provider;
        private String label;
        private String url;
        private String icon;
        private String handle;

        public String getProvider() {
            return provider;
        }

        public void setProvider(String provider) {
            this.provider = provider;
        }

        public String getLabel() {
            return label;
        }

        public void setLabel(String label) {
            this.label = label;
        }

        public String getUrl() {
            return url;
        }

        public void setUrl(String url) {
            this.url = url;
        }

        public String getIcon() {
            return icon;
        }

        public void setIcon(String icon) {
            this.icon = icon;
        }

        public String getHandle() {
            return handle;
        }

        public void setHandle(String handle) {
            this.handle = handle;
        }
    }

    public static class PrivacyContact {
        private String dataControllerName;
        private String privacyContactEmail;

        public String getDataControllerName() {
            return dataControllerName;
        }

        public void setDataControllerName(String dataControllerName) {
            this.dataControllerName = dataControllerName;
        }

        public String getPrivacyContactEmail() {
            return privacyContactEmail;
        }

        public void setPrivacyContactEmail(String privacyContactEmail) {
            this.privacyContactEmail = privacyContactEmail;
        }
    }

    public static class Firebase {
        private String projectId;
        private Long revision;
        private boolean active;
        private Long authenticationTestedRevision;
        private String authenticationTestedAt;
        private Long messagingTestedRevision;
        private String messagingTestedAt;
        private String activatedAt;
        private FirebasePublicClient publicClient;
        private EncryptedSecret authenticationCredentialEnvelope;
        private EncryptedSecret messagingCredentialEnvelope;

        public String getProjectId() {
            return projectId;
        }

        public void setProjectId(String projectId) {
            this.projectId = projectId;
        }

        public Long getRevision() {
            return revision;
        }

        public void setRevision(Long revision) {
            this.revision = revision;
        }

        public boolean isActive() {
            return active;
        }

        public void setActive(boolean active) {
            this.active = active;
        }

        public Long getAuthenticationTestedRevision() {
            return authenticationTestedRevision;
        }

        public void setAuthenticationTestedRevision(
                Long authenticationTestedRevision) {
            this.authenticationTestedRevision =
                    authenticationTestedRevision;
        }

        public String getAuthenticationTestedAt() {
            return authenticationTestedAt;
        }

        public void setAuthenticationTestedAt(
                String authenticationTestedAt) {
            this.authenticationTestedAt = authenticationTestedAt;
        }

        public Long getMessagingTestedRevision() {
            return messagingTestedRevision;
        }

        public void setMessagingTestedRevision(
                Long messagingTestedRevision) {
            this.messagingTestedRevision = messagingTestedRevision;
        }

        public String getMessagingTestedAt() {
            return messagingTestedAt;
        }

        public void setMessagingTestedAt(String messagingTestedAt) {
            this.messagingTestedAt = messagingTestedAt;
        }

        public String getActivatedAt() {
            return activatedAt;
        }

        public void setActivatedAt(String activatedAt) {
            this.activatedAt = activatedAt;
        }

        public FirebasePublicClient getPublicClient() {
            return publicClient;
        }

        public void setPublicClient(FirebasePublicClient publicClient) {
            this.publicClient = publicClient;
        }

        public EncryptedSecret getAuthenticationCredentialEnvelope() {
            return authenticationCredentialEnvelope;
        }

        public void setAuthenticationCredentialEnvelope(
                EncryptedSecret authenticationCredentialEnvelope) {
            this.authenticationCredentialEnvelope = authenticationCredentialEnvelope;
        }

        public EncryptedSecret getMessagingCredentialEnvelope() {
            return messagingCredentialEnvelope;
        }

        public void setMessagingCredentialEnvelope(
                EncryptedSecret messagingCredentialEnvelope) {
            this.messagingCredentialEnvelope = messagingCredentialEnvelope;
        }
    }

    public static class FirebasePublicClient {
        private String apiKey;
        private String authDomain;
        private String storageBucket;
        private String messagingSenderId;
        private String appId;
        private String measurementId;
        private String vapidKey;

        public String getApiKey() {
            return apiKey;
        }

        public void setApiKey(String apiKey) {
            this.apiKey = apiKey;
        }

        public String getAuthDomain() {
            return authDomain;
        }

        public void setAuthDomain(String authDomain) {
            this.authDomain = authDomain;
        }

        public String getStorageBucket() {
            return storageBucket;
        }

        public void setStorageBucket(String storageBucket) {
            this.storageBucket = storageBucket;
        }

        public String getMessagingSenderId() {
            return messagingSenderId;
        }

        public void setMessagingSenderId(String messagingSenderId) {
            this.messagingSenderId = messagingSenderId;
        }

        public String getAppId() {
            return appId;
        }

        public void setAppId(String appId) {
            this.appId = appId;
        }

        public String getMeasurementId() {
            return measurementId;
        }

        public void setMeasurementId(String measurementId) {
            this.measurementId = measurementId;
        }

        public String getVapidKey() {
            return vapidKey;
        }

        public void setVapidKey(String vapidKey) {
            this.vapidKey = vapidKey;
        }
    }

    public static class EncryptedSecret {
        private String algorithm;
        private String keyId;
        private String nonce;
        private String ciphertext;

        public String getAlgorithm() {
            return algorithm;
        }

        public void setAlgorithm(String algorithm) {
            this.algorithm = algorithm;
        }

        public String getKeyId() {
            return keyId;
        }

        public void setKeyId(String keyId) {
            this.keyId = keyId;
        }

        public String getNonce() {
            return nonce;
        }

        public void setNonce(String nonce) {
            this.nonce = nonce;
        }

        public String getCiphertext() {
            return ciphertext;
        }

        public void setCiphertext(String ciphertext) {
            this.ciphertext = ciphertext;
        }
    }
}

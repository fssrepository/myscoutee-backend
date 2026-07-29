package com.raxim.myscoutee.profile.data.dto.operator;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public final class OperatorConfigurationDtos {
    private OperatorConfigurationDtos() {
    }

    public enum DeploymentThemePreset {
        AURORA,
        OCEAN,
        FOREST,
        SUNSET,
        VIOLET,
        ROSE,
        AMBER,
        SLATE,
        AQUARIUS,
        MONOCHROME
    }

    public enum ConfigurationTestKind {
        FIREBASE_AUTHENTICATION,
        FIREBASE_MESSAGING
    }

    @JsonInclude(JsonInclude.Include.ALWAYS)
    public record DeploymentBrandingDto(
            String productName,
            Integer logoCharacterIndex,
            String homeLabel,
            String logoUrl,
            DeploymentThemePreset themePreset,
            long revision,
            List<DeploymentSocialLinkDto> socialLinks) {
    }

    @JsonInclude(JsonInclude.Include.ALWAYS)
    public record DeploymentPrivacyContactDto(
            boolean configured,
            String dataControllerName,
            String privacyContactEmail) {
    }

    @JsonInclude(JsonInclude.Include.ALWAYS)
    public record DeploymentPublicConfigurationDto(
            String productName,
            Integer logoCharacterIndex,
            String homeLabel,
            String logoUrl,
            DeploymentThemePreset themePreset,
            long revision,
            List<DeploymentSocialLinkDto> socialLinks,
            DeploymentPrivacyContactDto privacyContact) {
    }

    @JsonInclude(JsonInclude.Include.ALWAYS)
    public record DeploymentSocialLinkDto(
            @NotBlank @Size(max = 32) String provider,
            @NotBlank @Size(max = 80) String label,
            @NotBlank @Size(max = 2048) String url,
            @Size(max = 64) String icon,
            @Size(max = 80) String handle) {
    }

    @JsonInclude(JsonInclude.Include.ALWAYS)
    public record PaymentProviderDto(
            String id,
            String label,
            String logoUrl,
            String logoAlt,
            String palette) {
    }

    @JsonInclude(JsonInclude.Include.ALWAYS)
    public record PaymentConfigurationDto(
            List<PaymentProviderDto> availableProviders,
            String providerId,
            String publicBaseUrl,
            String merchantAccount,
            boolean credentialConfigured,
            String credentialMask) {
    }

    @JsonInclude(JsonInclude.Include.ALWAYS)
    public record FirebasePublicConfigurationDto(
            long revision,
            String apiKey,
            String authDomain,
            String projectId,
            String storageBucket,
            String messagingSenderId,
            String appId,
            String measurementId,
            String vapidKey) {
    }

    @JsonInclude(JsonInclude.Include.ALWAYS)
    public record FirebaseConfigurationDto(
            String projectId,
            boolean authenticationCredentialConfigured,
            boolean messagingCredentialConfigured,
            FirebasePublicConfigurationDto publicConfiguration,
            boolean active,
            boolean readyToActivate,
            String authenticationTestedAt,
            String messagingTestedAt,
            String activatedAt) {
    }

    @JsonInclude(JsonInclude.Include.ALWAYS)
    public record OperatorConfigurationDto(
            String capability,
            String unavailableReason,
            List<String> adminEmails,
            DeploymentPrivacyContactDto privacyContact,
            List<DeploymentSocialLinkDto> socialLinks,
            DeploymentBrandingDto branding,
            PaymentConfigurationDto payment,
            FirebaseConfigurationDto firebase,
            String updatedAt) {
        public OperatorConfigurationDto(
                String capability,
                String unavailableReason,
                List<String> adminEmails,
                List<DeploymentSocialLinkDto> socialLinks,
                DeploymentBrandingDto branding,
                PaymentConfigurationDto payment,
                FirebaseConfigurationDto firebase,
                String updatedAt) {
            this(
                    capability,
                    unavailableReason,
                    adminEmails,
                    null,
                    socialLinks,
                    branding,
                    payment,
                    firebase,
                    updatedAt);
        }
    }

    public record BrandingUpdateDto(
            @NotBlank @Size(max = 80) String productName,
            Integer logoCharacterIndex,
            @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
            @Size(max = 120) String homeLabel,
            @NotNull @Size(max = 2048) String logoUrl,
            @NotNull DeploymentThemePreset themePreset) {
        public BrandingUpdateDto(
                String productName,
                Integer logoCharacterIndex,
                String logoUrl,
                DeploymentThemePreset themePreset) {
            this(
                    productName,
                    logoCharacterIndex,
                    null,
                    logoUrl,
                    themePreset);
        }
    }

    public record PaymentUpdateDto(
            @Size(max = 64) String providerId,
            @Size(max = 2048) String publicBaseUrl,
            @Size(max = 254) String merchantAccount,
            @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
            @Size(max = 16384) String credential) {
        public PaymentUpdateDto(
                String providerId,
                String credential) {
            this(providerId, null, null, credential);
        }
    }

    public record PrivacyContactUpdateDto(
            @Size(max = 160) String dataControllerName,
            @Size(max = 254) String privacyContactEmail) {
    }

    public record FirebaseUpdateDto(
            @Size(max = 160) String projectId,
            @Size(max = 256) String apiKey,
            @Size(max = 253) String authDomain,
            @Size(max = 512) String storageBucket,
            @Size(max = 64) String messagingSenderId,
            @Size(max = 256) String appId,
            @Size(max = 64) String measurementId,
            @Size(max = 512) String vapidKey,
            @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
            @Size(max = 65536) String authenticationCredential,
            @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
            @Size(max = 65536) String messagingCredential) {
        public FirebaseUpdateDto(
                String projectId,
                String authenticationCredential,
                String messagingCredential) {
            this(
                    projectId,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    null,
                    authenticationCredential,
                    messagingCredential);
        }
    }

    public record OperatorConfigurationUpdateDto(
            @NotNull @Size(max = 32)
            List<@NotBlank @Email @Size(max = 254) String> adminEmails,
            @Valid PrivacyContactUpdateDto privacyContact,
            @NotNull @Size(max = 12)
            List<@NotNull @Valid DeploymentSocialLinkDto> socialLinks,
            @NotNull @Valid BrandingUpdateDto branding,
            @Valid PaymentUpdateDto payment,
            @Valid FirebaseUpdateDto firebase) {
        public OperatorConfigurationUpdateDto(
                List<String> adminEmails,
                List<DeploymentSocialLinkDto> socialLinks,
                BrandingUpdateDto branding,
                PaymentUpdateDto payment,
                FirebaseUpdateDto firebase) {
            this(
                    adminEmails,
                    null,
                    socialLinks,
                    branding,
                    payment,
                    firebase);
        }
    }

    public record ConfigurationTestRequestDto(
            @NotNull ConfigurationTestKind kind,
            @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
            @Size(max = 4096) String destinationToken,
            @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
            @Size(max = 4096) String browserReadinessToken,
            @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
            Long browserConfigurationRevision,
            @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
            @Size(max = 256) String browserAppId) {
        public ConfigurationTestRequestDto(ConfigurationTestKind kind) {
            this(kind, null, null, null, null);
        }

        public ConfigurationTestRequestDto(
                ConfigurationTestKind kind,
                String destinationToken) {
            this(kind, destinationToken, null, null, null);
        }
    }

    @JsonInclude(JsonInclude.Include.ALWAYS)
    public record ConfigurationTestResultDto(
            ConfigurationTestKind kind,
            boolean success,
            String message,
            String testedAt,
            FirebaseConfigurationDto firebase) {
    }
}

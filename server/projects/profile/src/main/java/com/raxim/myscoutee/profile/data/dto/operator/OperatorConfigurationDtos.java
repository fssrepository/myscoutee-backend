package com.raxim.myscoutee.profile.data.dto.operator;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.validation.Valid;
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
            long revision) {
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
            boolean credentialConfigured,
            String credentialMask) {
    }

    @JsonInclude(JsonInclude.Include.ALWAYS)
    public record FirebaseConfigurationDto(
            String projectId,
            boolean authenticationCredentialConfigured,
            boolean messagingCredentialConfigured) {
    }

    @JsonInclude(JsonInclude.Include.ALWAYS)
    public record OperatorConfigurationDto(
            String capability,
            String unavailableReason,
            DeploymentBrandingDto branding,
            PaymentConfigurationDto payment,
            FirebaseConfigurationDto firebase,
            String updatedAt) {
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
            @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
            @Size(max = 16384) String credential) {
    }

    public record FirebaseUpdateDto(
            @Size(max = 160) String projectId,
            @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
            @Size(max = 65536) String authenticationCredential,
            @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
            @Size(max = 65536) String messagingCredential) {
    }

    public record OperatorConfigurationUpdateDto(
            @NotNull @Valid BrandingUpdateDto branding,
            @Valid PaymentUpdateDto payment,
            @Valid FirebaseUpdateDto firebase) {
    }

    public record ConfigurationTestRequestDto(
            @NotNull ConfigurationTestKind kind) {
    }

    @JsonInclude(JsonInclude.Include.ALWAYS)
    public record ConfigurationTestResultDto(
            ConfigurationTestKind kind,
            boolean success,
            String message,
            String testedAt) {
    }
}

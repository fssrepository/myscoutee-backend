package com.raxim.myscoutee.profile.service.operator;

import java.util.List;

import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import com.raxim.myscoutee.profile.data.document.DeploymentConfiguration;
import com.raxim.myscoutee.profile.data.dto.operator.OperatorConfigurationDtos.DeploymentBrandingDto;
import com.raxim.myscoutee.profile.data.dto.operator.OperatorConfigurationDtos.DeploymentThemePreset;
import com.raxim.myscoutee.profile.data.dto.operator.OperatorConfigurationDtos.FirebaseConfigurationDto;
import com.raxim.myscoutee.profile.data.dto.operator.OperatorConfigurationDtos.OperatorConfigurationDto;
import com.raxim.myscoutee.profile.data.dto.operator.OperatorConfigurationDtos.PaymentConfigurationDto;
import com.raxim.myscoutee.profile.data.dto.operator.OperatorConfigurationDtos.PaymentProviderDto;

@Component
public class OperatorConfigurationMapper {
    public DeploymentBrandingDto toBranding(DeploymentConfiguration configuration) {
        DeploymentConfiguration.Branding branding = configuration.getBranding();
        return new DeploymentBrandingDto(
                requireText(branding.getProductName(), "Deployment product name"),
                branding.getLogoCharacterIndex(),
                requireText(branding.getHomeLabel(), "Deployment home label"),
                safeText(branding.getLogoUrl()),
                theme(branding.getThemePreset()),
                branding.getRevision());
    }

    public OperatorConfigurationDto toOperatorConfiguration(
            DeploymentConfiguration configuration,
            List<PaymentProviderDto> availableProviders,
            String unavailableReason) {
        DeploymentConfiguration.Payment payment = configuration.getPayment();
        DeploymentConfiguration.Firebase firebase = configuration.getFirebase();
        boolean credentialConfigured = payment.getCredentialEnvelope() != null;
        return new OperatorConfigurationDto(
                StringUtils.hasText(unavailableReason)
                        ? "BACKEND_UNAVAILABLE"
                        : "AVAILABLE",
                StringUtils.hasText(unavailableReason) ? unavailableReason.trim() : null,
                toBranding(configuration),
                new PaymentConfigurationDto(
                        availableProviders == null ? List.of() : List.copyOf(availableProviders),
                        blankToNull(payment.getProviderId()),
                        credentialConfigured,
                        credentialConfigured
                                ? payment.getCredentialMask().trim()
                                : null),
                new FirebaseConfigurationDto(
                        safeText(firebase.getProjectId()),
                        firebase.getAuthenticationCredentialEnvelope() != null,
                        firebase.getMessagingCredentialEnvelope() != null),
                blankToNull(configuration.getUpdatedAt()));
    }

    private DeploymentThemePreset theme(String value) {
        try {
            return DeploymentThemePreset.valueOf(requireText(
                    value,
                    "Deployment theme preset"));
        } catch (IllegalArgumentException exception) {
            throw new IllegalStateException(
                    "Deployment theme preset is unsupported.",
                    exception);
        }
    }

    private String requireText(String value, String fieldName) {
        if (!StringUtils.hasText(value)) {
            throw new IllegalStateException(fieldName + " is missing.");
        }
        return value.trim();
    }

    private String blankToNull(String value) {
        return StringUtils.hasText(value) ? value.trim() : null;
    }

    private String safeText(String value) {
        return value == null ? "" : value.trim();
    }
}

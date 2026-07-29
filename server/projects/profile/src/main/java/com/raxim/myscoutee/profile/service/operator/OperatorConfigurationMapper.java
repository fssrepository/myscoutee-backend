package com.raxim.myscoutee.profile.service.operator;

import java.net.URI;
import java.net.URISyntaxException;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.regex.Pattern;

import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import com.raxim.myscoutee.profile.data.document.DeploymentConfiguration;
import com.raxim.myscoutee.profile.data.dto.operator.OperatorConfigurationDtos.DeploymentBrandingDto;
import com.raxim.myscoutee.profile.data.dto.operator.OperatorConfigurationDtos.DeploymentPrivacyContactDto;
import com.raxim.myscoutee.profile.data.dto.operator.OperatorConfigurationDtos.DeploymentPublicConfigurationDto;
import com.raxim.myscoutee.profile.data.dto.operator.OperatorConfigurationDtos.DeploymentSocialLinkDto;
import com.raxim.myscoutee.profile.data.dto.operator.OperatorConfigurationDtos.DeploymentThemePreset;
import com.raxim.myscoutee.profile.data.dto.operator.OperatorConfigurationDtos.FirebaseConfigurationDto;
import com.raxim.myscoutee.profile.data.dto.operator.OperatorConfigurationDtos.FirebasePublicConfigurationDto;
import com.raxim.myscoutee.profile.data.dto.operator.OperatorConfigurationDtos.OperatorConfigurationDto;
import com.raxim.myscoutee.profile.data.dto.operator.OperatorConfigurationDtos.PaymentConfigurationDto;
import com.raxim.myscoutee.profile.data.dto.operator.OperatorConfigurationDtos.PaymentProviderDto;

@Component
public class OperatorConfigurationMapper {
    private static final Pattern PROVIDER_PATTERN =
            Pattern.compile("^[a-z0-9][a-z0-9._-]*$");

    public DeploymentBrandingDto toBranding(DeploymentConfiguration configuration) {
        DeploymentConfiguration.Branding branding = configuration.getBranding();
        return new DeploymentBrandingDto(
                requireText(branding.getProductName(), "Deployment product name"),
                branding.getLogoCharacterIndex(),
                requireText(branding.getHomeLabel(), "Deployment home label"),
                safeText(branding.getLogoUrl()),
                theme(branding.getThemePreset()),
                branding.getRevision(),
                toSocialLinks(configuration));
    }

    public DeploymentPublicConfigurationDto toPublicConfiguration(
            DeploymentConfiguration configuration) {
        DeploymentConfiguration.Branding branding = configuration.getBranding();
        return new DeploymentPublicConfigurationDto(
                requireText(branding.getProductName(), "Deployment product name"),
                branding.getLogoCharacterIndex(),
                requireText(branding.getHomeLabel(), "Deployment home label"),
                safeText(branding.getLogoUrl()),
                theme(branding.getThemePreset()),
                branding.getRevision(),
                toSocialLinks(configuration),
                toPrivacyContact(configuration));
    }

    public DeploymentPrivacyContactDto toPrivacyContact(
            DeploymentConfiguration configuration) {
        DeploymentConfiguration.PrivacyContact privacyContact =
                configuration.getPrivacyContact();
        String dataControllerName = safeText(
                privacyContact == null
                        ? null
                        : privacyContact.getDataControllerName());
        String privacyContactEmail = safeText(
                privacyContact == null
                        ? null
                        : privacyContact.getPrivacyContactEmail())
                .toLowerCase(Locale.ROOT);
        boolean configured = StringUtils.hasText(dataControllerName)
                && StringUtils.hasText(privacyContactEmail);
        return new DeploymentPrivacyContactDto(
                configured,
                dataControllerName,
                privacyContactEmail);
    }

    public OperatorConfigurationDto toOperatorConfiguration(
            DeploymentConfiguration configuration,
            List<PaymentProviderDto> availableProviders,
            List<String> adminEmails,
            String unavailableReason) {
        DeploymentConfiguration.Payment payment = configuration.getPayment();
        boolean credentialConfigured = payment.getCredentialEnvelope() != null;
        return new OperatorConfigurationDto(
                StringUtils.hasText(unavailableReason)
                        ? "BACKEND_UNAVAILABLE"
                        : "AVAILABLE",
                StringUtils.hasText(unavailableReason) ? unavailableReason.trim() : null,
                adminEmails == null ? List.of() : List.copyOf(adminEmails),
                toPrivacyContact(configuration),
                toSocialLinks(configuration),
                toBranding(configuration),
                new PaymentConfigurationDto(
                        availableProviders == null ? List.of() : List.copyOf(availableProviders),
                        blankToNull(payment.getProviderId()),
                        credentialConfigured,
                        credentialConfigured
                                ? payment.getCredentialMask().trim()
                                : null),
                toFirebaseConfiguration(configuration),
                blankToNull(configuration.getUpdatedAt()));
    }

    public FirebaseConfigurationDto toFirebaseConfiguration(
            DeploymentConfiguration configuration) {
        DeploymentConfiguration.Firebase firebase =
                configuration.getFirebase();
        DeploymentConfiguration.FirebasePublicClient publicClient =
                firebase.getPublicClient();
        long firebaseRevision = firebaseRevision(firebase);
        boolean readyToActivate =
                firebase.getAuthenticationCredentialEnvelope() != null
                && firebase.getMessagingCredentialEnvelope() != null
                && completePublicConfiguration(firebase, publicClient)
                && Long.valueOf(firebaseRevision).equals(
                        firebase.getAuthenticationTestedRevision())
                && Long.valueOf(firebaseRevision).equals(
                        firebase.getMessagingTestedRevision());
        return new FirebaseConfigurationDto(
                safeText(firebase.getProjectId()),
                firebase.getAuthenticationCredentialEnvelope() != null,
                firebase.getMessagingCredentialEnvelope() != null,
                toPublicFirebaseConfiguration(firebase, publicClient),
                firebase.isActive(),
                readyToActivate,
                blankToNull(firebase.getAuthenticationTestedAt()),
                blankToNull(firebase.getMessagingTestedAt()),
                blankToNull(firebase.getActivatedAt()));
    }

    public FirebasePublicConfigurationDto toPublicFirebaseConfiguration(
            DeploymentConfiguration configuration) {
        DeploymentConfiguration.Firebase firebase =
                configuration.getFirebase();
        return toPublicFirebaseConfiguration(
                firebase,
                firebase.getPublicClient());
    }

    public List<DeploymentSocialLinkDto> toSocialLinks(
            DeploymentConfiguration configuration) {
        if (configuration.getSocialLinks() == null) {
            throw new IllegalStateException(
                    "Deployment social-link seed is missing.");
        }
        Set<String> providers = new LinkedHashSet<>();
        Set<String> urls = new LinkedHashSet<>();
        return configuration.getSocialLinks().stream()
                .map(link -> {
                    if (link == null) {
                        throw new IllegalStateException(
                                "Deployment social link is invalid.");
                    }
                    String provider = requiredSocialText(
                            link.getProvider(),
                            32,
                            "provider")
                            .toLowerCase(Locale.ROOT);
                    if (!PROVIDER_PATTERN.matcher(provider).matches()) {
                        throw new IllegalStateException(
                                "Deployment social-link provider is invalid.");
                    }
                    String url = socialUrl(link.getUrl());
                    if (!providers.add(provider) || !urls.add(url)) {
                        throw new IllegalStateException(
                                "Deployment social links contain a duplicate "
                                        + "provider or URL.");
                    }
                    return new DeploymentSocialLinkDto(
                            provider,
                            requiredSocialText(link.getLabel(), 80, "label"),
                            url,
                            optionalSocialText(link.getIcon(), 64, "icon"),
                            optionalSocialText(link.getHandle(), 80, "handle"));
                })
                .toList();
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

    private FirebasePublicConfigurationDto toPublicFirebaseConfiguration(
            DeploymentConfiguration.Firebase firebase,
            DeploymentConfiguration.FirebasePublicClient publicClient) {
        return new FirebasePublicConfigurationDto(
                firebaseRevision(firebase),
                safeText(publicClient == null
                        ? null
                        : publicClient.getApiKey()),
                safeText(publicClient == null
                        ? null
                        : publicClient.getAuthDomain()),
                safeText(firebase == null ? null : firebase.getProjectId()),
                safeText(publicClient == null
                        ? null
                        : publicClient.getStorageBucket()),
                safeText(publicClient == null
                        ? null
                        : publicClient.getMessagingSenderId()),
                safeText(publicClient == null
                        ? null
                        : publicClient.getAppId()),
                safeText(publicClient == null
                        ? null
                        : publicClient.getMeasurementId()),
                safeText(publicClient == null
                        ? null
                        : publicClient.getVapidKey()));
    }

    private long firebaseRevision(
            DeploymentConfiguration.Firebase firebase) {
        return firebase == null || firebase.getRevision() == null
                ? 0L
                : Math.max(0L, firebase.getRevision());
    }

    private boolean completePublicConfiguration(
            DeploymentConfiguration.Firebase firebase,
            DeploymentConfiguration.FirebasePublicClient publicClient) {
        return firebase != null
                && publicClient != null
                && StringUtils.hasText(firebase.getProjectId())
                && StringUtils.hasText(publicClient.getApiKey())
                && StringUtils.hasText(publicClient.getAuthDomain())
                && StringUtils.hasText(publicClient.getMessagingSenderId())
                && StringUtils.hasText(publicClient.getAppId())
                && StringUtils.hasText(publicClient.getVapidKey());
    }

    private String requiredSocialText(
            String value,
            int maximumLength,
            String fieldName) {
        String normalized = optionalSocialText(
                value,
                maximumLength,
                fieldName);
        if (!StringUtils.hasText(normalized)) {
            throw new IllegalStateException(
                    "Deployment social-link " + fieldName + " is missing.");
        }
        return normalized;
    }

    private String optionalSocialText(
            String value,
            int maximumLength,
            String fieldName) {
        String normalized = value == null ? "" : value.trim();
        if (normalized.length() > maximumLength
                || normalized.chars().anyMatch(Character::isISOControl)) {
            throw new IllegalStateException(
                    "Deployment social-link " + fieldName + " is invalid.");
        }
        return StringUtils.hasText(normalized) ? normalized : null;
    }

    private String socialUrl(String value) {
        String normalized = requiredSocialText(value, 2048, "URL");
        try {
            URI uri = new URI(normalized);
            if (!"https".equalsIgnoreCase(uri.getScheme())
                    || !StringUtils.hasText(uri.getHost())
                    || uri.getUserInfo() != null) {
                throw new IllegalStateException(
                        "Deployment social-link URL is invalid.");
            }
            return normalized;
        } catch (URISyntaxException exception) {
            throw new IllegalStateException(
                    "Deployment social-link URL is invalid.",
                    exception);
        }
    }
}

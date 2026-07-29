package com.raxim.myscoutee.profile.service.operator;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.concurrent.atomic.AtomicReference;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.raxim.myscoutee.profile.data.document.DeploymentConfiguration;
import com.raxim.myscoutee.profile.repository.DeploymentConfigurationRepository;

@Service
public class DeploymentBrandingResolver {
    private static final Logger LOGGER =
            LoggerFactory.getLogger(DeploymentBrandingResolver.class);
    private static final String DEFAULT_PRODUCT_NAME = "MyScoutee";
    private static final String DEFAULT_LOGO_URL =
            "/assets/logo/heart.webp";
    private static final String LEGACY_LOGO_WEBP =
            "assets/logo/heart.webp";
    private static final String LEGACY_LOGO_PNG =
            "assets/logo/heart.png";

    private final DeploymentConfigurationRepository repository;
    private final AtomicReference<ResolvedDeploymentBranding> lastKnownGood =
            new AtomicReference<>(fallback());

    public DeploymentBrandingResolver(
            DeploymentConfigurationRepository repository) {
        this.repository = repository;
    }

    public ResolvedDeploymentBranding resolve() {
        try {
            DeploymentConfiguration configuration = repository
                    .findById(DeploymentConfiguration.SINGLETON_ID)
                    .orElse(null);
            DeploymentConfiguration.Branding branding =
                    configuration == null
                            ? null
                            : configuration.getBranding();
            ResolvedDeploymentBranding resolved =
                    new ResolvedDeploymentBranding(
                            firstNonBlank(
                                    branding == null
                                            ? null
                                            : branding.getProductName(),
                                    DEFAULT_PRODUCT_NAME),
                            firstNonBlank(
                                    branding == null
                                            ? null
                                            : branding.getLogoUrl(),
                                    DEFAULT_LOGO_URL),
                            branding == null
                                            || branding.getRevision() == null
                                    ? 0L
                                    : Math.max(
                                            0L,
                                            branding.getRevision()));
            lastKnownGood.set(resolved);
            return resolved;
        } catch (RuntimeException exception) {
            LOGGER.warn(
                    "Could not resolve deployment branding; using the "
                            + "last known good snapshot.",
                    exception);
            return lastKnownGood.get();
        }
    }

    public static ResolvedDeploymentBranding fallback() {
        return new ResolvedDeploymentBranding(
                DEFAULT_PRODUCT_NAME,
                DEFAULT_LOGO_URL,
                0L);
    }

    private static String firstNonBlank(String first, String second) {
        String normalized = safeText(first);
        return StringUtils.hasText(normalized)
                ? normalized
                : safeText(second);
    }

    private static String safeText(String value) {
        return value == null ? "" : value.trim();
    }

    public record ResolvedDeploymentBranding(
            String productName,
            String logoUrl,
            long revision) {
        public String applicationIcon(String candidate) {
            String normalized = safeText(candidate);
            String withoutLeadingSlash = normalized.startsWith("/")
                    ? normalized.substring(1)
                    : normalized;
            return !StringUtils.hasText(normalized)
                    || LEGACY_LOGO_WEBP.equalsIgnoreCase(withoutLeadingSlash)
                    || LEGACY_LOGO_PNG.equalsIgnoreCase(withoutLeadingSlash)
                            ? logoUrl
                            : normalized;
        }

        public Map<String, String> enrich(
                Map<String, String> source) {
            Map<String, String> variables = new LinkedHashMap<>();
            if (source != null) {
                variables.putAll(source);
            }
            variables.put("productName", productName);
            variables.put("product_name", productName);
            variables.put("productLogoUrl", logoUrl);
            variables.put("product_logo_url", logoUrl);
            variables.put(
                    "productBrandingRevision",
                    Long.toString(revision));
            variables.put(
                    "product_branding_revision",
                    Long.toString(revision));
            return variables;
        }
    }
}

package com.raxim.myscoutee.profile.service;

import java.net.URI;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.raxim.myscoutee.profile.data.document.DeploymentConfiguration;
import com.raxim.myscoutee.profile.repository.DeploymentConfigurationRepository;

@Service
public class IntegrationPublicEndpointResolver {
    private final DeploymentConfigurationRepository repository;
    private final String fallbackBaseUrl;

    public IntegrationPublicEndpointResolver(
            DeploymentConfigurationRepository repository,
            @Value("${integration.public-base-url:http://localhost/api/integrations/v1}")
            String fallbackBaseUrl) {
        this.repository = repository;
        this.fallbackBaseUrl = requirePublicBaseUrl(fallbackBaseUrl);
    }

    @Cacheable(
            value = "deployment_integration",
            key = "T(com.raxim.myscoutee.common.config.mongo.MongoSessionModeContext).currentMode().name()")
    public String resolve() {
        String configured = repository
                .findById(DeploymentConfiguration.SINGLETON_ID)
                .map(DeploymentConfiguration::getIntegration)
                .map(DeploymentConfiguration.Integration::getPublicBaseUrl)
                .orElse(null);
        return StringUtils.hasText(configured)
                ? requirePublicBaseUrl(configured)
                : fallbackBaseUrl;
    }

    private static String requirePublicBaseUrl(String value) {
        String normalized = value == null
                ? ""
                : value.trim().replaceAll("/+$", "");
        try {
            URI uri = URI.create(normalized);
            String scheme = uri.getScheme();
            if (("http".equalsIgnoreCase(scheme) || "https".equalsIgnoreCase(scheme))
                    && StringUtils.hasText(uri.getHost())
                    && !StringUtils.hasText(uri.getUserInfo())) {
                return normalized;
            }
        } catch (IllegalArgumentException ignored) {
            // Rejected below with one stable configuration error.
        }
        throw new IllegalStateException(
                "Integration public base URL must be an absolute HTTP(S) URL.");
    }
}

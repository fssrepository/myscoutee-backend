package com.raxim.myscoutee.profile.service.operator;

import java.util.Locale;
import java.util.Objects;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.raxim.myscoutee.profile.data.document.DeploymentConfiguration;
import com.raxim.myscoutee.profile.repository.DeploymentConfigurationRepository;
import com.raxim.myscoutee.common.config.mongo.MongoSessionMode;
import com.raxim.myscoutee.common.config.mongo.MongoSessionModeContext;
import com.raxim.myscoutee.profile.service.PaymentSimulatorRegistrationClient;

@Service
public class DeploymentPaymentCredentialResolver {
    private static final String PAYMENT_CREDENTIAL_PURPOSE_PREFIX =
            "payment-credential/";

    private final DeploymentConfigurationRepository repository;
    private final DeploymentConfigurationCrypto crypto;
    private final PaymentSimulatorRegistrationClient simulatorClient;

    @Autowired
    public DeploymentPaymentCredentialResolver(
            DeploymentConfigurationRepository repository,
            DeploymentConfigurationCrypto crypto,
            PaymentSimulatorRegistrationClient simulatorClient) {
        this.repository = Objects.requireNonNull(repository);
        this.crypto = Objects.requireNonNull(crypto);
        this.simulatorClient = Objects.requireNonNull(simulatorClient);
    }

    DeploymentPaymentCredentialResolver(
            DeploymentConfigurationRepository repository,
            DeploymentConfigurationCrypto crypto) {
        this.repository = Objects.requireNonNull(repository);
        this.crypto = Objects.requireNonNull(crypto);
        this.simulatorClient = null;
    }

    /**
     * The encrypted operator credential takes precedence for its selected
     * provider. The existing environment setting remains a compatibility
     * fallback only when that provider has no registered operator credential.
     */
    public String resolve(String providerId, String environmentFallback) {
        String normalizedProvider = normalize(providerId);
        if (MongoSessionModeContext.currentMode() == MongoSessionMode.DEMO) {
            return simulatorClient != null && simulatorClient.isEnabled()
                    ? simulatorClient.credentialFor(normalizedProvider)
                    : "";
        }
        DeploymentConfiguration configuration = repository
                .findById(DeploymentConfiguration.SINGLETON_ID)
                .orElse(null);
        DeploymentConfiguration.Payment payment =
                configuration == null ? null : configuration.getPayment();
        if (payment != null
                && normalizedProvider.equals(normalize(payment.getProviderId()))
                && payment.getCredentialEnvelope() != null) {
            return crypto.decrypt(
                    credentialPurpose(normalizedProvider),
                    payment.getCredentialEnvelope());
        }
        return StringUtils.hasText(environmentFallback)
                ? environmentFallback.trim()
                : "";
    }

    private String normalize(String value) {
        return value == null ? "" : value.trim().toLowerCase(Locale.ROOT);
    }

    static String credentialPurpose(String providerId) {
        if (!StringUtils.hasText(providerId)) {
            throw new IllegalArgumentException(
                    "Payment provider id is required for credential encryption.");
        }
        return PAYMENT_CREDENTIAL_PURPOSE_PREFIX
                + providerId.trim().toLowerCase(Locale.ROOT);
    }
}

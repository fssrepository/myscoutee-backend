package com.raxim.myscoutee.domain.payments.service;

import com.raxim.myscoutee.domain.platform.api.SecretEncryption;

import java.util.Locale;
import java.util.Objects;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.raxim.myscoutee.domain.platform.api.DeploymentSettings.Configuration;
import com.raxim.myscoutee.domain.platform.api.DeploymentSettings;
import com.raxim.myscoutee.common.config.mongo.MongoSessionMode;
import com.raxim.myscoutee.common.config.mongo.MongoSessionModeContext;
import com.raxim.myscoutee.domain.payments.service.PaymentSimulatorRegistrationClient;

@Service
public class DeploymentPaymentCredentialResolver {
    private static final String PAYMENT_CREDENTIAL_PURPOSE_PREFIX =
            "payment-credential/";

    private final DeploymentSettings repository;
    private final SecretEncryption crypto;
    private final PaymentSimulatorRegistrationClient simulatorClient;

    @Autowired
    public DeploymentPaymentCredentialResolver(
            DeploymentSettings repository,
            SecretEncryption crypto,
            PaymentSimulatorRegistrationClient simulatorClient) {
        this.repository = Objects.requireNonNull(repository);
        this.crypto = Objects.requireNonNull(crypto);
        this.simulatorClient = Objects.requireNonNull(simulatorClient);
    }

    DeploymentPaymentCredentialResolver(
            DeploymentSettings repository,
            SecretEncryption crypto) {
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
        Configuration configuration = repository
                .findById(DeploymentSettings.SINGLETON_ID)
                .orElse(null);
        DeploymentSettings.Payment payment =
                configuration == null ? null : configuration.getPayment();
        if (payment != null
                && normalizedProvider.equals(normalize(payment.getProviderId()))
                && payment.getCredentialEnvelope() != null) {
            return crypto.decrypt(
                    com.raxim.myscoutee.domain.payments.api.PaymentCredentialPurpose.credentialPurpose(normalizedProvider),
                    payment.getCredentialEnvelope());
        }
        return StringUtils.hasText(environmentFallback)
                ? environmentFallback.trim()
                : "";
    }

    private String normalize(String value) {
        return value == null ? "" : value.trim().toLowerCase(Locale.ROOT);
    }


}

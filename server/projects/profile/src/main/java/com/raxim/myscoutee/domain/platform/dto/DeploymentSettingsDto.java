package com.raxim.myscoutee.domain.platform.dto;

import com.raxim.myscoutee.domain.platform.api.DeploymentSettings;

/** Exact existing consumer view; Firebase credentials and operator-only configuration are excluded. */
public record DeploymentSettingsDto(IntegrationDto integration, PaymentDto payment) implements DeploymentSettings.Configuration {
    public record IntegrationDto(String publicBaseUrl) implements DeploymentSettings.Integration {
        @Override public String getPublicBaseUrl() { return publicBaseUrl; }
    }
    public record PaymentDto(String providerId, String publicBaseUrl, String merchantAccount,
            String exchangeRateUrl, EncryptedSecret credentialEnvelope, String credentialMask) implements DeploymentSettings.Payment {
        @Override public String getProviderId() { return providerId; }
        @Override public String getPublicBaseUrl() { return publicBaseUrl; }
        @Override public String getMerchantAccount() { return merchantAccount; }
        @Override public String getExchangeRateUrl() { return exchangeRateUrl; }
        @Override public EncryptedSecret getCredentialEnvelope() { return credentialEnvelope; }
        @Override public String getCredentialMask() { return credentialMask; }
    }
    public static DeploymentSettingsDto from(DeploymentSettings.Configuration value) {
        var integration = value.getIntegration(); var payment = value.getPayment();
        return new DeploymentSettingsDto(integration == null ? null : new IntegrationDto(integration.getPublicBaseUrl()),
                payment == null ? null : new PaymentDto(payment.getProviderId(), payment.getPublicBaseUrl(), payment.getMerchantAccount(),
                        payment.getExchangeRateUrl(), payment.getCredentialEnvelope(), payment.getCredentialMask()));
    }
    @Override public IntegrationDto getIntegration() { return integration; }
    @Override public PaymentDto getPayment() { return payment; }
}

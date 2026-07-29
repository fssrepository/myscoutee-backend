package com.raxim.myscoutee.profile.service.operator;

import java.util.Locale;
import java.util.Objects;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.server.ResponseStatusException;

import com.raxim.myscoutee.profile.data.document.DeploymentConfiguration;
import com.raxim.myscoutee.profile.repository.DeploymentConfigurationRepository;

@Service
public class DeploymentPaymentRoutingResolver {
    private final DeploymentConfigurationRepository repository;

    public DeploymentPaymentRoutingResolver(
            DeploymentConfigurationRepository repository) {
        this.repository = Objects.requireNonNull(repository);
    }

    public PaymentRouting require(String providerId) {
        String normalizedProvider = normalize(providerId);
        DeploymentConfiguration configuration = repository
                .findById(DeploymentConfiguration.SINGLETON_ID)
                .orElseThrow(() -> unavailable(
                        "Deployment payment routing is unavailable."));
        DeploymentConfiguration.Payment payment = configuration.getPayment();
        if (payment == null
                || !normalizedProvider.equals(normalize(payment.getProviderId()))) {
            throw unavailable(
                    "Payment routing is not configured for " + normalizedProvider + ".");
        }
        String publicBaseUrl = trim(payment.getPublicBaseUrl());
        if (!StringUtils.hasText(publicBaseUrl)) {
            throw unavailable(
                    "The operator has not configured the public deployment URL "
                            + "for payment callbacks.");
        }
        String merchantAccount = trim(payment.getMerchantAccount());
        if ("barion".equals(normalizedProvider)
                && !StringUtils.hasText(merchantAccount)) {
            throw unavailable(
                    "The operator has not configured the Barion merchant account.");
        }
        return new PaymentRouting(
                publicBaseUrl,
                StringUtils.hasText(merchantAccount) ? merchantAccount : null);
    }

    private String normalize(String value) {
        return value == null
                ? ""
                : value.trim().toLowerCase(Locale.ROOT);
    }

    private String trim(String value) {
        return value == null ? "" : value.trim();
    }

    private ResponseStatusException unavailable(String message) {
        return new ResponseStatusException(
                HttpStatus.SERVICE_UNAVAILABLE,
                message);
    }

    public record PaymentRouting(
            String publicBaseUrl,
            String merchantAccount) {
        public String successUrl() {
            return publicBaseUrl + "/payment/success";
        }

        public String cancelUrl() {
            return publicBaseUrl + "/payment/cancel";
        }

        public String callbackUrl() {
            return publicBaseUrl + "/api/payment/callback";
        }
    }
}

package com.raxim.myscoutee.domain.payments.service;

import java.util.List;
import java.util.Locale;
import java.util.Objects;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.server.ResponseStatusException;

import com.raxim.myscoutee.domain.platform.api.DeploymentSettings.Configuration;
import com.raxim.myscoutee.domain.operator.dto.OperatorConfigurationDtos.PaymentProviderDto;
import com.raxim.myscoutee.domain.platform.api.DeploymentSettings;
import com.raxim.myscoutee.domain.payments.service.PaymentProviderChangedException;

@Service
public class DeploymentPaymentProviderResolver {
    private final DeploymentSettings repository;
    private final PaymentProviderService paymentProviderService;

    public DeploymentPaymentProviderResolver(
            DeploymentSettings repository,
            PaymentProviderService paymentProviderService) {
        this.repository = Objects.requireNonNull(repository);
        this.paymentProviderService = Objects.requireNonNull(paymentProviderService);
    }

    public String resolveActiveProvider(String requestedProvider) {
        Configuration configuration = repository
                .findById(DeploymentSettings.SINGLETON_ID)
                .orElseThrow(() -> unavailable(
                        "Deployment payment configuration is unavailable."));
        DeploymentSettings.Payment payment = configuration.getPayment();
        String activeProvider = normalize(
                payment == null ? null : payment.getProviderId());
        if (!StringUtils.hasText(activeProvider)) {
            if (StringUtils.hasText(normalize(requestedProvider))) {
                throw new PaymentProviderChangedException(
                        HttpStatus.BAD_REQUEST,
                        null);
            }
            throw unavailable(
                    "The operator has not selected a payment provider.");
        }

        List<PaymentProviderDto> availableProviders;
        try {
            availableProviders = paymentProviderService.availableProviders();
        } catch (RuntimeException exception) {
            throw new ResponseStatusException(
                    HttpStatus.SERVICE_UNAVAILABLE,
                    "Payment provider catalog is unavailable.",
                    exception);
        }
        boolean active = availableProviders.stream()
                .anyMatch(provider -> activeProvider.equals(provider.id()));
        if (!active) {
            throw unavailable(
                    "The operator-selected payment provider is not available.");
        }

        String requested = normalize(requestedProvider);
        if (StringUtils.hasText(requested)
                && !activeProvider.equals(requested)) {
            throw new PaymentProviderChangedException(
                    HttpStatus.BAD_REQUEST,
                    activeProvider);
        }
        return activeProvider;
    }

    private String normalize(String value) {
        return value == null
                ? ""
                : value.trim().toLowerCase(Locale.ROOT);
    }

    private ResponseStatusException unavailable(String message) {
        return new ResponseStatusException(
                HttpStatus.SERVICE_UNAVAILABLE,
                message);
    }
}

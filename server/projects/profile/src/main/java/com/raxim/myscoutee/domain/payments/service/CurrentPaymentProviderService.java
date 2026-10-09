package com.raxim.myscoutee.domain.payments.service;

import com.raxim.myscoutee.domain.payments.api.PaymentProviderChangedException;

import java.util.Locale;
import java.util.Objects;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.server.ResponseStatusException;

import com.raxim.myscoutee.common.config.mongo.MongoSessionMode;
import com.raxim.myscoutee.common.config.mongo.MongoSessionModeContext;
import com.raxim.myscoutee.domain.platform.api.DeploymentSettings.Configuration;
import com.raxim.myscoutee.domain.platform.api.DeploymentSettings;

@Service
public class CurrentPaymentProviderService implements com.raxim.myscoutee.domain.payments.api.CurrentPaymentProvider {
    public static final String RESPONSE_HEADER = "X-MyScoutee-Payment-Provider";
    public static final String CASH_ONLY_WIRE_VALUE = "none";

    private final DeploymentSettings repository;
    private final PaymentSimulatorRegistrationClient simulatorClient;

    public CurrentPaymentProviderService(
            DeploymentSettings repository,
            PaymentSimulatorRegistrationClient simulatorClient) {
        this.repository = Objects.requireNonNull(repository);
        this.simulatorClient = Objects.requireNonNull(simulatorClient);
    }

    public Snapshot snapshot() {
        try {
            return resolveSnapshot();
        } catch (RuntimeException exception) {
            return Snapshot.unavailable();
        }
    }

    public void requireCashOnly() {
        Snapshot snapshot = resolveSnapshot();
        if (StringUtils.hasText(snapshot.provider())) {
            throw new PaymentProviderChangedException(
                    HttpStatus.CONFLICT,
                    snapshot.provider());
        }
    }

    private Snapshot resolveSnapshot() {
        if (MongoSessionModeContext.currentMode() == MongoSessionMode.DEMO) {
            if (!simulatorClient.isEnabled()) {
                return Snapshot.available(null);
            }
            PaymentSimulatorRegistrationClient.GatewayConfiguration configuration =
                    simulatorClient.configuration();
            String provider = normalize(configuration.provider());
            return Snapshot.available(
                    configuration.connected() ? provider : null);
        }

        Configuration configuration = repository
                .findById(DeploymentSettings.SINGLETON_ID)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.SERVICE_UNAVAILABLE,
                        "Deployment payment configuration is unavailable."));
        DeploymentSettings.Payment payment = configuration.getPayment();
        return Snapshot.available(normalize(
                payment == null ? null : payment.getProviderId()));
    }

    private String normalize(String value) {
        String normalized = value == null
                ? ""
                : value.trim().toLowerCase(Locale.ROOT);
        return StringUtils.hasText(normalized)
                && !CASH_ONLY_WIRE_VALUE.equals(normalized)
                        ? normalized
                        : null;
    }

    public record Snapshot(boolean available, String provider) {
        public static Snapshot available(String provider) {
            return new Snapshot(true, provider);
        }

        public static Snapshot unavailable() {
            return new Snapshot(false, null);
        }

        public String wireValue() {
            return StringUtils.hasText(provider)
                    ? provider
                    : CASH_ONLY_WIRE_VALUE;
        }
    }
}

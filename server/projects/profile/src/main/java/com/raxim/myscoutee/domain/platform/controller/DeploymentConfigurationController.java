package com.raxim.myscoutee.domain.platform.controller;

import java.util.Locale;

import org.springframework.http.CacheControl;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.raxim.myscoutee.domain.operator.dto.OperatorConfigurationDtos.DeploymentPublicConfigurationDto;
import com.raxim.myscoutee.domain.operator.dto.OperatorConfigurationDtos.FirebasePublicConfigurationDto;
import com.raxim.myscoutee.domain.payments.service.PaymentSimulatorRegistrationClient;
import com.raxim.myscoutee.domain.operator.service.OperatorConfigurationService;
import com.raxim.myscoutee.common.config.mongo.MongoSessionMode;
import com.raxim.myscoutee.common.config.mongo.MongoSessionModeContext;

@RestController
@RequestMapping("/deployment/configuration")
public class DeploymentConfigurationController {
    private final OperatorConfigurationService service;
    private final PaymentSimulatorRegistrationClient simulatorClient;

    public DeploymentConfigurationController(
            OperatorConfigurationService service,
            PaymentSimulatorRegistrationClient simulatorClient) {
        this.service = service;
        this.simulatorClient = simulatorClient;
    }

    @GetMapping
    public DeploymentPublicConfigurationDto configuration() {
        DeploymentPublicConfigurationDto configuration =
                service.publicConfiguration();
        if (MongoSessionModeContext.currentMode() != MongoSessionMode.DEMO) {
            return configuration;
        }
        PaymentSimulatorRegistrationClient.GatewayConfiguration simulatorConfiguration =
                simulatorClient.isEnabled() ? simulatorClient.configuration() : null;
        String provider = simulatorConfiguration == null
                ? "none"
                : simulatorConfiguration.provider();
        String paymentProviderId = "none".equalsIgnoreCase(provider)
                || simulatorConfiguration == null
                || !simulatorConfiguration.connected()
                ? null
                : provider.trim().toLowerCase(Locale.ROOT);
        return new DeploymentPublicConfigurationDto(
                configuration.productName(),
                configuration.logoCharacterIndex(),
                configuration.homeLabel(),
                configuration.logoUrl(),
                configuration.revision(),
                paymentProviderId,
                configuration.firebaseMessagingConfigured(),
                configuration.socialLinks(),
                configuration.privacyContact());
    }

    @GetMapping("/firebase-config")
    public ResponseEntity<FirebasePublicConfigurationDto>
            firebaseConfiguration() {
        FirebasePublicConfigurationDto configuration =
                service.publicFirebaseConfiguration();
        return ResponseEntity.status(configuration == null
                        ? HttpStatus.NO_CONTENT : HttpStatus.OK)
                .cacheControl(CacheControl.noStore())
                .header("Pragma", "no-cache")
                .body(configuration);
    }
}

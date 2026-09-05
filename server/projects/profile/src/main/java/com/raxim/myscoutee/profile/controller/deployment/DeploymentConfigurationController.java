package com.raxim.myscoutee.profile.controller.deployment;

import java.util.Locale;

import org.springframework.http.CacheControl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.raxim.myscoutee.profile.data.dto.operator.OperatorConfigurationDtos.DeploymentPublicConfigurationDto;
import com.raxim.myscoutee.profile.data.dto.operator.OperatorConfigurationDtos.FirebasePublicConfigurationDto;
import com.raxim.myscoutee.profile.service.PaymentSimulatorRegistrationClient;
import com.raxim.myscoutee.profile.service.operator.OperatorConfigurationService;

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
        if (!simulatorClient.isEnabled()) {
            return configuration;
        }
        String provider = simulatorClient.configuration().provider();
        String paymentProviderId = "none".equalsIgnoreCase(provider)
                ? null
                : provider.trim().toLowerCase(Locale.ROOT);
        return new DeploymentPublicConfigurationDto(
                configuration.productName(),
                configuration.logoCharacterIndex(),
                configuration.homeLabel(),
                configuration.logoUrl(),
                configuration.themePreset(),
                configuration.revision(),
                paymentProviderId,
                configuration.socialLinks(),
                configuration.privacyContact());
    }

    @GetMapping("/firebase-config")
    public ResponseEntity<FirebasePublicConfigurationDto>
            firebaseConfiguration() {
        return ResponseEntity.ok()
                .cacheControl(CacheControl.noStore())
                .header("Pragma", "no-cache")
                .body(service.publicFirebaseConfiguration());
    }
}

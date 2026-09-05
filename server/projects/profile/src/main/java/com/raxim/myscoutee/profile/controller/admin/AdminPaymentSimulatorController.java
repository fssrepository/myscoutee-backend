package com.raxim.myscoutee.profile.controller.admin;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.raxim.myscoutee.profile.service.PaymentSimulatorRegistrationClient;
import com.raxim.myscoutee.profile.service.PaymentSimulatorRegistrationClient.GatewayConfigurationAccess;

@RestController
@RequestMapping("/admin/payment-simulator")
public class AdminPaymentSimulatorController {
    private final PaymentSimulatorRegistrationClient simulatorClient;

    public AdminPaymentSimulatorController(PaymentSimulatorRegistrationClient simulatorClient) {
        this.simulatorClient = simulatorClient;
    }

    @PostMapping("/configuration-access")
    @PreAuthorize("hasAuthority('A')")
    public GatewayConfigurationAccess createConfigurationAccess() {
        return simulatorClient.createConfigurationAccess();
    }
}

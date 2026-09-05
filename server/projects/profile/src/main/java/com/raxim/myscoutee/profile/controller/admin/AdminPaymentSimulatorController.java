package com.raxim.myscoutee.profile.controller.admin;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.server.ResponseStatusException;

import com.raxim.myscoutee.common.config.firebase.dto.FirebasePrincipal;
import com.raxim.myscoutee.common.config.mongo.MongoSessionMode;
import com.raxim.myscoutee.common.config.mongo.MongoSessionModeContext;
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
        requireDemoAdmin();
        return simulatorClient.createConfigurationAccess();
    }

    @PostMapping("/authorization-access")
    @PreAuthorize("hasAuthority('A')")
    public GatewayConfigurationAccess createAuthorizationAccess() {
        requireDemoAdmin();
        return simulatorClient.createAuthorizationAccess();
    }

    private void requireDemoAdmin() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String userId = authentication != null
                && authentication.getPrincipal() instanceof FirebasePrincipal principal
                ? principal.getUserId()
                : "";
        if (MongoSessionModeContext.currentMode() != MongoSessionMode.DEMO
                || userId == null
                || !userId.trim().startsWith("admin-demo-")) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "Payment simulator administration is available only to demo admins.");
        }
    }
}

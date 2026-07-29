package com.raxim.myscoutee.profile.controller.deployment;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.raxim.myscoutee.profile.data.dto.operator.OperatorConfigurationDtos.DeploymentBrandingDto;
import com.raxim.myscoutee.profile.data.dto.operator.OperatorConfigurationDtos.FirebasePublicConfigurationDto;
import com.raxim.myscoutee.profile.service.operator.OperatorConfigurationService;

@RestController
@RequestMapping("/deployment/configuration")
public class DeploymentConfigurationController {
    private final OperatorConfigurationService service;

    public DeploymentConfigurationController(OperatorConfigurationService service) {
        this.service = service;
    }

    @GetMapping
    public DeploymentBrandingDto configuration() {
        return service.branding();
    }

    @GetMapping("/firebase-config")
    public FirebasePublicConfigurationDto firebaseConfiguration() {
        return service.publicFirebaseConfiguration();
    }
}

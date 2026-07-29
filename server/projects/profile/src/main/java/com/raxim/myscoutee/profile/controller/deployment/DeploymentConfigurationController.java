package com.raxim.myscoutee.profile.controller.deployment;

import org.springframework.http.CacheControl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.raxim.myscoutee.profile.data.dto.operator.OperatorConfigurationDtos.DeploymentPublicConfigurationDto;
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
    public DeploymentPublicConfigurationDto configuration() {
        return service.publicConfiguration();
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

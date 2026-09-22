package com.raxim.myscoutee.profile.controller.operator;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import com.raxim.myscoutee.profile.service.operator.OperatorEmailConfigurationService;
import com.raxim.myscoutee.profile.service.operator.OperatorEmailConfigurationService.*;
@RestController
@RequestMapping("/operator/email-configuration")
@PreAuthorize("hasAuthority('O')")
public class OperatorEmailConfigurationController {
    private final OperatorEmailConfigurationService service;
    public OperatorEmailConfigurationController(OperatorEmailConfigurationService service) { this.service = service; }
    @GetMapping public Snapshot get() { return service.snapshot(); }
    @PutMapping public Snapshot save(@RequestBody Save request) { return service.save(request); }
}

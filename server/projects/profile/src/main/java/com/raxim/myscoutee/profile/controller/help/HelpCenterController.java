package com.raxim.myscoutee.profile.controller.help;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.raxim.myscoutee.profile.data.dto.help.HelpCenterDtos.HelpCenterStateDto;
import com.raxim.myscoutee.profile.service.HelpCenterService;

@RestController
@RequestMapping("/help")
public class HelpCenterController {
    private final HelpCenterService helpCenterService;

    public HelpCenterController(HelpCenterService helpCenterService) {
        this.helpCenterService = helpCenterService;
    }

    @GetMapping("/active")
    public HelpCenterStateDto active() {
        return helpCenterService.activeState();
    }
}

package com.raxim.myscoutee.profile.controller.auth;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.raxim.myscoutee.profile.data.dto.auth.AuthDtos.FacebookDataDeletionResponseDto;
import com.raxim.myscoutee.profile.service.FacebookDataDeletionService;

@RestController
@RequestMapping("/auth/facebook")
public class FacebookDataDeletionController {
    private final FacebookDataDeletionService facebookDataDeletionService;

    public FacebookDataDeletionController(FacebookDataDeletionService facebookDataDeletionService) {
        this.facebookDataDeletionService = facebookDataDeletionService;
    }

    @PostMapping("/data-deletion")
    public FacebookDataDeletionResponseDto deleteFacebookUserData(
            @RequestParam("signed_request") String signedRequest) {
        return facebookDataDeletionService.handleSignedRequest(signedRequest);
    }
}

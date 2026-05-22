package com.raxim.myscoutee.profile.controller.help;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.raxim.myscoutee.profile.data.dto.help.HelpCenterDtos.HelpCenterStateDto;
import com.raxim.myscoutee.profile.data.dto.help.HelpCenterDtos.PrivacyConsentDto;
import com.raxim.myscoutee.profile.data.dto.help.HelpCenterDtos.PrivacyConsentSaveRequestDto;
import com.raxim.myscoutee.profile.service.HelpCenterService;

@RestController
@RequestMapping
public class HelpCenterController {
    private final HelpCenterService helpCenterService;

    public HelpCenterController(HelpCenterService helpCenterService) {
        this.helpCenterService = helpCenterService;
    }

    @GetMapping("/help/active")
    public HelpCenterStateDto activeHelp(
            @RequestHeader(name = "accept-language", defaultValue = "en") String acceptLanguage,
            @RequestParam(value = "lang", required = false) String lang) {
        return helpCenterService.activeState("help", lang, acceptLanguage);
    }

    @GetMapping("/privacy/active")
    public HelpCenterStateDto activePrivacy(
            @RequestHeader(name = "accept-language", defaultValue = "en") String acceptLanguage,
            @RequestParam(value = "lang", required = false) String lang) {
        return helpCenterService.activeState("privacy", lang, acceptLanguage);
    }

    @GetMapping("/explanation/active")
    public HelpCenterStateDto activeExplanation(
            @RequestHeader(name = "accept-language", defaultValue = "en") String acceptLanguage,
            @RequestParam(value = "lang", required = false) String lang,
            @RequestParam(value = "contextKey", required = false) String contextKey) {
        return helpCenterService.activeState("explanation", lang, acceptLanguage, contextKey);
    }

    @GetMapping("/privacy/consents")
    public PrivacyConsentDto privacyConsent(
            @RequestParam("userId") String userId,
            @RequestParam("revisionId") String revisionId,
            @RequestParam(name = "revisionVersion", required = false) Integer revisionVersion) {
        return helpCenterService.privacyConsent(userId, revisionId, revisionVersion);
    }

    @PostMapping("/privacy/consents")
    public PrivacyConsentDto savePrivacyConsent(@RequestBody(required = false) PrivacyConsentSaveRequestDto request) {
        return helpCenterService.savePrivacyConsent(request);
    }
}

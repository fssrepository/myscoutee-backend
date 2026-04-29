package com.raxim.myscoutee.profile.controller.share;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.raxim.myscoutee.profile.data.dto.share.ShareTokenDtos.ShareTokenCreateRequestDto;
import com.raxim.myscoutee.profile.data.dto.share.ShareTokenDtos.ShareTokenCreateResponseDto;
import com.raxim.myscoutee.profile.data.dto.share.ShareTokenDtos.ShareTokenResolvedItemDto;
import com.raxim.myscoutee.profile.service.ShareTokensService;

@RestController
@RequestMapping("/share-tokens")
public class ShareTokensController {
    private final ShareTokensService shareTokensService;

    public ShareTokensController(ShareTokensService shareTokensService) {
        this.shareTokensService = shareTokensService;
    }

    @PostMapping
    public ShareTokenCreateResponseDto createToken(@RequestBody ShareTokenCreateRequestDto request) {
        return new ShareTokenCreateResponseDto(shareTokensService.createToken(request));
    }

    @GetMapping("/resolve")
    public ShareTokenResolvedItemDto resolveToken(
            @RequestParam("token") String token,
            @RequestParam(value = "userId", required = false) String userId) {
        return shareTokensService.resolveToken(token, userId);
    }
}

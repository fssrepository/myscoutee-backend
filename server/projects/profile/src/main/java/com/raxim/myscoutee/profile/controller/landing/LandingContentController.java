package com.raxim.myscoutee.profile.controller.landing;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.raxim.myscoutee.profile.data.dto.landing.LandingContentDtos.LandingContentDto;
import com.raxim.myscoutee.profile.service.HelpCenterService;
import com.raxim.myscoutee.profile.service.IdeaPostsService;

@RestController
@RequestMapping("/landing")
public class LandingContentController {
    private final HelpCenterService helpCenterService;
    private final IdeaPostsService ideaPostsService;

    public LandingContentController(HelpCenterService helpCenterService, IdeaPostsService ideaPostsService) {
        this.helpCenterService = helpCenterService;
        this.ideaPostsService = ideaPostsService;
    }

    @GetMapping("/content")
    public LandingContentDto content() {
        return new LandingContentDto(
                helpCenterService.activeState("privacy"),
                ideaPostsService.publicPosts());
    }
}

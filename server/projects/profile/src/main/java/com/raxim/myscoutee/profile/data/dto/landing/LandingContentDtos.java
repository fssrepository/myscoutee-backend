package com.raxim.myscoutee.profile.data.dto.landing;

import java.util.List;

import com.raxim.myscoutee.profile.data.dto.help.HelpCenterDtos.HelpCenterStateDto;
import com.raxim.myscoutee.profile.data.dto.idea.IdeaPostDtos.IdeaPostDto;

public final class LandingContentDtos {
    private LandingContentDtos() {
    }

    public record LandingContentDto(
            HelpCenterStateDto privacy,
            List<IdeaPostDto> ideas) {
    }
}

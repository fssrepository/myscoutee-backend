package com.raxim.myscoutee.domain.content.api;

import java.util.List;
import com.raxim.myscoutee.domain.content.dto.FeedPostMediaVisibilityDto;

public interface ContentMediaVisibility {
    FeedPostMediaVisibilityDto feedPost(List<String> urls);
}

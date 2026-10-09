package com.raxim.myscoutee.domain.community.api;

import java.util.List;
import com.raxim.myscoutee.domain.community.dto.AnnouncementMediaVisibilityDto;
import com.raxim.myscoutee.domain.community.dto.OfferingMediaVisibilityDto;

public interface CommunityMediaVisibility {
    AnnouncementMediaVisibilityDto announcement(List<String> urls);
    OfferingMediaVisibilityDto offering(List<String> urls);
}

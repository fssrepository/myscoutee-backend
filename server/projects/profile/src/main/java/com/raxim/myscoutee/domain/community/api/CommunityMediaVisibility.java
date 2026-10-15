package com.raxim.myscoutee.domain.community.api;

import java.util.List;
import com.raxim.myscoutee.domain.community.dto.AnnouncementMediaVisibilityDto;
import com.raxim.myscoutee.domain.community.dto.OfferingMediaVisibilityDto;

public interface CommunityMediaVisibility {
    /** Referenced document URLs across every lifecycle bucket, in one bounded batch. */
    List<String> referencedDocuments(List<String> urls);
    AnnouncementMediaVisibilityDto announcement(List<String> urls);
    OfferingMediaVisibilityDto offering(List<String> urls);
}

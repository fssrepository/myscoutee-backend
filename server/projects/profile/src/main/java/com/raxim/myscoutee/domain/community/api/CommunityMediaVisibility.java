package com.raxim.myscoutee.domain.community.api;

import java.util.List;

public interface CommunityMediaVisibility {
    Announcement announcement(List<String> urls);
    Offering offering(List<String> urls);
    record Announcement(String communityId, String status) {}
    record Offering(String baseGroupId, String status) {}
}

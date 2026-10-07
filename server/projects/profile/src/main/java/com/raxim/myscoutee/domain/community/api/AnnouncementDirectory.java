package com.raxim.myscoutee.domain.community.api;
import java.util.Optional;
public interface AnnouncementDirectory {
    Optional<Announcement> find(String id);
    record Announcement(String id, String communityId, String status) {}
}

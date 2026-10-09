package com.raxim.myscoutee.domain.community.api;
import java.util.*;
import com.raxim.myscoutee.domain.community.dto.CommunityAnnouncementDtos.*;
public interface Announcements {
    String actor(String profileId);
    Item detail(String actor, String id);
    Page<Item> page(String actor, String communityId, String status, int size, String cursor, Boolean voting);
    Item save(String actor, Save r);
    Item action(String actor, String id, Command r);
}

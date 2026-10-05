package com.raxim.myscoutee.profile.data.dto.community;

import java.util.List;
import java.util.Map;
import com.raxim.myscoutee.profile.data.document.DocumentAttachment;

public final class CommunityAnnouncementDtos {
    private CommunityAnnouncementDtos() {}
    public record Item(String id, String communityId, String authorAccountId, String title, String body,
            List<DocumentAttachment> attachments, String status, boolean voting, String deadlineIso, boolean closed,
            boolean canVote, String myBallot, Map<String, Integer> results,
            int eligibleMembers, int castVotes,
            boolean canManage, String publishedAtIso, String createdAtIso, String updatedAtIso, Long version) {}
    public record Save(String userId, String id, String communityId, String title, String body,
            List<DocumentAttachment> attachments, boolean voting, String deadlineIso, Long version) {}
    public record Command(String userId, String action, String choice, Long version) {}
    public record Page<T>(List<T> items, long total, String nextCursor) {}
}

package com.raxim.myscoutee.profile.data.dto.activities;

import java.util.List;

import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.ActivityMemberEntryDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.ActivityMemberOwnerRefDto;

public final class ActivityMembersDtos {
    private ActivityMembersDtos() {
    }

    public record ActivityMembersSummariesRequestDto(
            List<ActivityMemberOwnerRefDto> owners) {
    }

    public record ActivityMembersReplaceRequestDto(
            ActivityMemberOwnerRefDto owner,
            List<ActivityMemberEntryDto> members,
            Integer capacityTotal,
            String actorUserId,
            String eventId,
            String subEventId) {
        public ActivityMembersReplaceRequestDto(
                ActivityMemberOwnerRefDto owner,
                List<ActivityMemberEntryDto> members,
                Integer capacityTotal,
                String actorUserId) {
            this(owner, members, capacityTotal, actorUserId, null, null);
        }
    }

    public record ActivityMembersInviteRequestDto(
            ActivityMemberOwnerRefDto owner,
            List<String> userIds,
            String actorUserId) {
    }

    public record ActivityMemberActionRequestDto(
            ActivityMemberOwnerRefDto owner,
            String actorUserId,
            String targetUserId,
            String action,
            String reason,
            String eventId,
            String subEventId) {
        public ActivityMemberActionRequestDto(
                ActivityMemberOwnerRefDto owner,
                String actorUserId,
                String targetUserId,
                String action,
                String reason) {
            this(owner, actorUserId, targetUserId, action, reason, null, null);
        }
    }
}

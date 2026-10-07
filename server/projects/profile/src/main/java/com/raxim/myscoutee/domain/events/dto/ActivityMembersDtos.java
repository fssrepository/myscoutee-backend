package com.raxim.myscoutee.domain.events.dto;

import java.util.List;
import com.raxim.myscoutee.domain.groups.dto.CommunityGroupDtos.Group;

import com.raxim.myscoutee.domain.accounts.dto.AuthDtos.UserMenuCountersDto;
import com.raxim.myscoutee.common.dto.SharedDtos.ActivityMemberEntryDto;
import com.raxim.myscoutee.common.dto.SharedDtos.ActivityMemberOwnerRefDto;

public final class ActivityMembersDtos {
    private ActivityMembersDtos() {
    }

    public record ActivityMembersSummariesRequestDto(
            List<ActivityMemberOwnerRefDto> owners) {
    }

    public record ActivityMemberSyncKnownItemDto(
            String id,
            String revision) {
    }

    public record ActivityMembersSyncRequestDto(
            ActivityMemberOwnerRefDto owner,
            List<ActivityMemberSyncKnownItemDto> knownItems,
            String eventId,
            String subEventId,
            String assetRequestId) {
        public ActivityMembersSyncRequestDto(ActivityMemberOwnerRefDto owner,
                List<ActivityMemberSyncKnownItemDto> knownItems, String eventId, String subEventId) {
            this(owner, knownItems, eventId, subEventId, null);
        }
    }

    public record ActivityMembersSyncResponseDto(
            List<ActivityMemberEntryDto> upserts,
            List<String> removedIds,
            Integer total) {
    }

    /** Lightweight Mongo projection for one user's membership state per owner. */
    public record ActivityMemberStatusDto(
            String ownerId,
            String status) {
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

    public record ActivityMemberInviteRejectionDto(
            String userId,
            String reason) {
    }

    public record ActivityMembersInviteResponseDto(
            List<ActivityMemberEntryDto> members,
            List<String> invitedUserIds,
            List<ActivityMemberInviteRejectionDto> rejections, Group group) {
        public ActivityMembersInviteResponseDto(List<ActivityMemberEntryDto> members, List<String> invitedUserIds,
                List<ActivityMemberInviteRejectionDto> rejections) { this(members, invitedUserIds, rejections, null); }
    }

    public record ActivityMemberActionRequestDto(
            ActivityMemberOwnerRefDto owner,
            String actorUserId,
            String targetUserId,
            String action,
            String reason,
            String eventId,
            String subEventId,
            String targetMemberId,
            String assetRequestId) {
        public ActivityMemberActionRequestDto(
                ActivityMemberOwnerRefDto owner, String actorUserId, String targetUserId,
                String action, String reason, String eventId, String subEventId, String targetMemberId) {
            this(owner, actorUserId, targetUserId, action, reason, eventId, subEventId, targetMemberId, null);
        }
        public ActivityMemberActionRequestDto(
                ActivityMemberOwnerRefDto owner,
                String actorUserId,
                String targetUserId,
                String action,
                String reason) {
            this(owner, actorUserId, targetUserId, action, reason, null, null, null);
        }

        public ActivityMemberActionRequestDto(
                ActivityMemberOwnerRefDto owner,
                String actorUserId,
                String targetUserId,
                String action,
                String reason,
                String eventId,
                String subEventId) {
            this(owner, actorUserId, targetUserId, action, reason, eventId, subEventId, null);
        }
    }

    public record ActivityMemberActionResponseDto(
            List<ActivityMemberEntryDto> members,
            UserMenuCountersDto counterOverrides, Group group) {
        public ActivityMemberActionResponseDto(List<ActivityMemberEntryDto> members, UserMenuCountersDto counterOverrides) {
            this(members, counterOverrides, null);
        }
    }
}

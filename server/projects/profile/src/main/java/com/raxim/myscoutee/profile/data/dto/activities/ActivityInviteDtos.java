package com.raxim.myscoutee.profile.data.dto.activities;

import java.util.List;

import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.ActivityMemberEntryDto;

public final class ActivityInviteDtos {
    private ActivityInviteDtos() {
    }

    public record ActivityInviteCandidatesRequestDto(
            String activeUserId,
            String ownerId,
            String ownerType,
            String parentOwnerId,
            String parentOwnerType,
            String sort,
            Integer page,
            Integer pageSize,
            List<String> existingMemberUserIds,
            List<String> pendingInviteUserIds,String purpose) {
        public ActivityInviteCandidatesRequestDto(String activeUserId,String ownerId,String ownerType,String parentOwnerId,String parentOwnerType,String sort,Integer page,Integer pageSize,List<String> existingMemberUserIds,List<String> pendingInviteUserIds) {
            this(activeUserId,ownerId,ownerType,parentOwnerId,parentOwnerType,sort,page,pageSize,existingMemberUserIds,pendingInviteUserIds,null);
        }
        public ActivityInviteCandidatesRequestDto(
                String activeUserId,
                String ownerId,
                String ownerType,
                String sort) {
            this(activeUserId, ownerId, ownerType, null, null, sort, 0, 16, null, null);
        }

        public ActivityInviteCandidatesRequestDto(
                String activeUserId,
                String ownerId,
                String ownerType,
                String parentOwnerId,
                String parentOwnerType,
                String sort,
                Integer page,
                Integer pageSize) {
            this(activeUserId, ownerId, ownerType, parentOwnerId, parentOwnerType, sort, page, pageSize, null, null);
        }

        public ActivityInviteCandidatesRequestDto(
                String activeUserId,
                String ownerId,
                String ownerType,
                String parentOwnerId,
                String parentOwnerType,
                String sort,
                Integer page,
                Integer pageSize,
                List<String> existingMemberUserIds) {
            this(activeUserId, ownerId, ownerType, parentOwnerId, parentOwnerType, sort, page, pageSize, existingMemberUserIds, null);
        }
    }

    public record ActivityInviteCandidatesPageDto(
            List<ActivityMemberEntryDto> items,
            Integer total,
            Integer page,
            Integer pageSize) {
    }
}

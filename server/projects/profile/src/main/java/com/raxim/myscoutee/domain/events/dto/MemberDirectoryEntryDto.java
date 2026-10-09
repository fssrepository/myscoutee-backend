package com.raxim.myscoutee.domain.events.dto;

import com.raxim.myscoutee.domain.events.api.MemberDirectory;

/** Detached existing membership view; excludes attendance, counters and invitation audit. */
public record MemberDirectoryEntryDto(
        String suppressionRootOwnerId,
        String statusBeforeSuppression,
        String requestKind,
        String managerGrantedByUserId,
        String id,
        String syncKey,
        String ownerType,
        String ownerId,
        String invitedByUserId,
        String metAtIso,
        String actionAtIso,
        String createdDate,
        String createdUser,
        String updatedDate,
        String updatedUser,
        String userId,
        String role,
        String status) implements MemberDirectory.Member {
    public static MemberDirectoryEntryDto from(MemberDirectory.Member member) {
        return new MemberDirectoryEntryDto(
                member.getSuppressionRootOwnerId(),
                member.getStatusBeforeSuppression(),
                member.getRequestKind(),
                member.getManagerGrantedByUserId(),
                member.getId(),
                member.getSyncKey(),
                member.getOwnerType(),
                member.getOwnerId(),
                member.getInvitedByUserId(),
                member.getMetAtIso(),
                member.getActionAtIso(),
                member.getCreatedDate(),
                member.getCreatedUser(),
                member.getUpdatedDate(),
                member.getUpdatedUser(),
                member.getUserId(),
                member.getRole(),
                member.getStatus());
    }
    @Override public String getSuppressionRootOwnerId() { return suppressionRootOwnerId; }
    @Override public String getStatusBeforeSuppression() { return statusBeforeSuppression; }
    @Override public String getRequestKind() { return requestKind; }
    @Override public String getManagerGrantedByUserId() { return managerGrantedByUserId; }
    @Override public String getId() { return id; }
    @Override public String getSyncKey() { return syncKey; }
    @Override public String getOwnerType() { return ownerType; }
    @Override public String getOwnerId() { return ownerId; }
    @Override public String getInvitedByUserId() { return invitedByUserId; }
    @Override public String getMetAtIso() { return metAtIso; }
    @Override public String getActionAtIso() { return actionAtIso; }
    @Override public String getCreatedDate() { return createdDate; }
    @Override public String getCreatedUser() { return createdUser; }
    @Override public String getUpdatedDate() { return updatedDate; }
    @Override public String getUpdatedUser() { return updatedUser; }
    @Override public String getUserId() { return userId; }
    @Override public String getRole() { return role; }
    @Override public String getStatus() { return status; }
}

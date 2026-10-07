package com.raxim.myscoutee.domain.events.api;

import java.util.List;
import java.util.Optional;

public interface MemberDirectory {
    java.util.List<? extends Member> findByOwnerTypeAndUserId(String type, String user);
    java.util.List<? extends Member> findByOwnerTypeAndOwnerIdIn(String type, java.util.Collection<String> ids);
    java.util.List<? extends Member> findAll();
    Optional<? extends Member> findByOwnerTypeAndOwnerIdAndUserId(String ownerType, String ownerId, String userId);
    List<? extends Member> findByOwnerTypeAndOwnerId(String ownerType, String ownerId);
    interface Member {
        String getRequestKind(); String getManagerGrantedByUserId();
        String getId();
        String getSyncKey();
        String getOwnerType();
        String getOwnerId();
        String getInvitedByUserId();
        String getMetAtIso();
        String getActionAtIso();
        String getCreatedDate();
        String getCreatedUser();
        String getUpdatedDate();
        String getUpdatedUser(); String getUserId(); String getRole(); String getStatus(); }
    List<? extends Member> findAcceptedByOwnerTypeOwnerIdInAndUserId(String type, java.util.Collection<String> ids, String userId, String status);
}

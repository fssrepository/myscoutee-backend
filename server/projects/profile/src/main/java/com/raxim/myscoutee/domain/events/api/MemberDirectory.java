package com.raxim.myscoutee.domain.events.api;

import java.util.List;
import java.util.Optional;

public interface MemberDirectory {
    Optional<? extends Member> findByOwnerTypeAndOwnerIdAndUserId(String ownerType, String ownerId, String userId);
    List<? extends Member> findByOwnerTypeAndOwnerId(String ownerType, String ownerId);
    interface Member { String getUserId(); String getRole(); String getStatus(); }
}

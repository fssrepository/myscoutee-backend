package com.raxim.myscoutee.domain.accounts.api;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface ProfileDirectory {
    List<? extends WorkspaceProfile> findByProfileStatus(String status);
    List<? extends WorkspaceProfile> findByWorkspaceGroupIdAndAccountUserIdIn(String groupId, Collection<String> accounts);
    List<? extends WorkspaceProfile> findAll();
    Optional<? extends WorkspaceProfile> findByUserId(String userId);
    List<? extends WorkspaceProfile> findByUserIdIn(Collection<String> userIds);
    List<? extends WorkspaceProfile> findByEmailIn(Collection<String> emails);
    List<? extends WorkspaceProfile> findByAccountUserId(String accountId);
    WorkspaceProfile findFirstByUserId(String id);
    boolean existsNotDeleted(String id);
    List<? extends WorkspaceProfile> findNotDeletedByUserIdIn(Collection<String> ids);
    List<String> userIdsByWorkspace(String groupId);
}

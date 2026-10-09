package com.raxim.myscoutee.domain.accounts.api;

import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.Set;

/** Existing account directory reads with identity, lifecycle and display facts. */
public interface ProfileSummaries {
    List<? extends ProfileSummary> findByProfileStatus(String status);
    Optional<? extends ProfileSummary> findByUserId(String userId);
    List<? extends ProfileSummary> findByUserIdIn(Collection<String> userIds);
    List<? extends ProfileSummary> findByWorkspaceGroupIdAndAccountUserIdIn(String groupId, Collection<String> accounts);
    List<? extends ProfileSummary> findByWorkspaceGroupId(String groupId);
    long countByUserIdIn(Collection<String> ids);
    List<? extends ProfileSummary> pageByUserIdIn(Collection<String> ids, int offset, int limit);
    Set<String> savedContactIds(String userId);
    /** Existing payment-member roster query, retaining its owner ordering and total. */
    com.raxim.myscoutee.domain.accounts.dto.PaymentMemberSummariesDto paymentMemberSummaries(
            String workspace, String actor, int page, int size);
}

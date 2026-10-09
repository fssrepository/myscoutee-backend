package com.raxim.myscoutee.domain.community.mapper;

import com.raxim.myscoutee.domain.accounts.api.ProfileSummary;
import com.raxim.myscoutee.domain.community.document.CommunityScheduledTask;
import com.raxim.myscoutee.domain.community.document.ServiceCase;
import com.raxim.myscoutee.domain.groups.api.GroupView;

import java.util.Map;

import com.raxim.myscoutee.domain.community.dto.CommunityCaseDtos.*;

public final class CommunityCaseMapper {
    private CommunityCaseMapper() {}
    public static CaseItem toDto(ServiceCase c, String accountId, boolean canManage, GroupView group, Map<String, ? extends ProfileSummary> users) {
        var members = c.participantAccountIds().stream().map(users::get).filter(java.util.Objects::nonNull)
                .map(u -> new Member(u.getUserId(), u.getName(), u.getImages() == null || u.getImages().isEmpty() ? null : u.getImages().getFirst(),
                        "woman".equalsIgnoreCase(u.getGender()) ? "woman" : "man", c.membershipStatus(u.getUserId()))).toList();
        boolean review = canManage || "accepted".equals(c.membershipStatus(accountId));
        return new CaseItem(c.id(), c.communityId(), group == null ? "" : group.name(), c.ownerAccountId(), c.title(), c.description(),
                c.caseType(), c.status(), c.audienceAll(), c.audienceAccountIds(), c.audienceAccountIds().size(), members,
                c.support(), c.recommendations().stream().map(r -> new Recommendation(r.accountId(), r.providerAccountId(), r.serviceId(), users.containsKey(r.providerAccountId()) ? users.get(r.providerAccountId()).getName() : "", users.containsKey(r.accountId()) ? users.get(r.accountId()).getName() : "")).toList(), review ? c.offers() : java.util.List.of(), c.boardTasks(), c.membershipStatus(accountId), review, c.chatParticipantAccountIds().contains(accountId), c.chatAccountIds(), canManage, c.canTakeOver(accountId), c.attentionAccountIds().contains(accountId),
                c.scheduledTaskId(), c.dueAtIso(), c.createdAtIso(), c.updatedAtIso(), c.version());
    }
    public static TaskItem toDto(CommunityScheduledTask t, GroupView group, int affectedCount, boolean canManage) {
        return new TaskItem(t.id(), t.communityId(), group == null ? "" : group.name(), t.title(), t.description(), t.caseType(), t.audienceAll(),
                t.audienceAccountIds(), affectedCount, t.startAtIso(), t.nextDueAtIso(), t.frequency(), t.enabled(), t.deleted() ? "trash" : t.enabled() ? "active" : "paused", canManage, t.createdAtIso(), t.updatedAtIso(), t.version());
    }
}

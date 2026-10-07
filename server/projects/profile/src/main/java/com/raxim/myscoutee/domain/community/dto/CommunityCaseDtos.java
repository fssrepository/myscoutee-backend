package com.raxim.myscoutee.domain.community.dto;

import java.util.List;
import com.raxim.myscoutee.common.dto.SharedDtos.PolicyItemDto;
import java.util.Map;
import com.raxim.myscoutee.domain.community.document.ServiceCase;

public final class CommunityCaseDtos {
    private CommunityCaseDtos() {}
    public record Member(String accountId, String name, String avatarUrl, String gender, String status) {}
    public record Recommendation(String accountId, String providerAccountId, String serviceId, String providerName, String recommenderName) {}
    public record CaseItem(String id, String communityId, String communityName, String ownerAccountId,
            String title, String description, String caseType, String status, boolean audienceAll,
            List<String> audienceAccountIds, int affectedCount, List<Member> members,
            List<ServiceCase.Support> support, List<Recommendation> recommendations, List<ServiceCase.Offer> offers,
            List<ServiceCase.BoardTask> boardTasks, String membershipStatus, boolean canReviewOffers, boolean canChat, List<String> chatAccountIds, boolean canManage, boolean canTakeOver, boolean unread, String scheduledTaskId, String dueAtIso,
            String createdAtIso, String updatedAtIso, Long version) {}
    public record SaveCase(String userId, String id, String communityId, String title, String description,
            String caseType, boolean audienceAll, List<String> audienceAccountIds, Long version) {}
    public record Command(String userId, String action, Long version, String providerAccountId,
            String serviceId, String offerId, Double amount, String currency, String note,
            List<String> memberAccountIds, ServiceCase.BoardTask task, String taskId, String workPolicy, String refundPolicy, List<PolicyItemDto> workPolicies, List<PolicyItemDto> refundPolicies) {}
    public record Page<T>(List<T> items, long total, String nextCursor, Map<String, Long> context) {}
    public record TaskItem(String id, String communityId, String communityName, String title, String description,
            String caseType, boolean audienceAll, List<String> audienceAccountIds, int affectedCount,
            String startAtIso, String nextDueAtIso, String frequency, boolean enabled, String status, boolean canManage, String createdAtIso, String updatedAtIso, Long version) {}
    public record SaveTask(String userId, String id, String communityId, String title, String description,
            String caseType, boolean audienceAll, List<String> audienceAccountIds, String startAtIso,
            String frequency, boolean enabled, Long version) {}
    public record TaskCommand(String userId, String action, Long version) {}
}

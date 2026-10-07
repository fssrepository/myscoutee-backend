package com.raxim.myscoutee.domain.community.dto;
import java.util.List;
import com.raxim.myscoutee.common.dto.SharedDtos.PolicyItemDto;
/** Immutable case values shared by persistence and the public case contract. */
public final class CaseDetails {
    private CaseDetails() {}
    public record BoardTask(String id, String title, String description, String status,
            List<String> assigneeAccountIds, List<String> dependsOnIds, String startAtIso, String endAtIso, List<String> offerIds) {
        public BoardTask { offerIds = offerIds == null ? List.of() : List.copyOf(offerIds); }
    }
    public record Support(String accountId, String serviceId, String status) {}
    public record Recommendation(String accountId, String providerAccountId, String serviceId) {}
    public record Offer(String id, String providerAccountId, String serviceId, double amount, String currency,
            String note, String status, String createdAtIso, String workPolicy, String refundPolicy,
            List<PolicyItemDto> workPolicies, List<PolicyItemDto> refundPolicies) {
        public Offer {
            workPolicies = workPolicies == null ? List.of() : List.copyOf(workPolicies);
            refundPolicies = refundPolicies == null ? List.of() : List.copyOf(refundPolicies);
        }
    }
}

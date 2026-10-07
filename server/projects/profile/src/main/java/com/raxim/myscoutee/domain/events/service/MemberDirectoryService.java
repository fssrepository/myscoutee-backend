package com.raxim.myscoutee.domain.events.service;

import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Service;
import com.raxim.myscoutee.domain.events.api.MemberDirectory;
import com.raxim.myscoutee.domain.events.document.ActivityMember;
import com.raxim.myscoutee.domain.events.repository.ActivityMembersRepository;

@Service
public class MemberDirectoryService implements MemberDirectory {
    private final ActivityMembersRepository members;
    public MemberDirectoryService(ActivityMembersRepository members) { this.members = members; }
    @Override public Optional<ActivityMember> findByOwnerTypeAndOwnerIdAndUserId(String type, String id, String user) { return members.findByOwnerTypeAndOwnerIdAndUserId(type, id, user); }
    @Override public List<ActivityMember> findByOwnerTypeAndOwnerId(String type, String id) { return members.findByOwnerTypeAndOwnerId(type, id); }
    @Override public java.util.List<ActivityMember> findByOwnerTypeAndUserId(String type, String user) { return members.findByOwnerTypeAndUserId(type, user); }
    @Override public java.util.List<ActivityMember> findByOwnerTypeAndOwnerIdIn(String type, java.util.Collection<String> ids) { return members.findByOwnerTypeAndOwnerIdIn(type, ids); }
    @Override public java.util.List<ActivityMember> findAll() { return members.findAll(); }
    @Override public List<ActivityMember> findAcceptedByOwnerTypeOwnerIdInAndUserId(String type, java.util.Collection<String> ids, String userId, String status) { return members.findAcceptedByOwnerTypeOwnerIdInAndUserId(type, ids, userId, status); }
    @Override public com.raxim.myscoutee.common.dto.SharedDtos.PricingConfigDto vipPricingOffer(String sourceId, String userId) {
        return members.findByOwnerTypeAndOwnerIdAndUserId("event", sourceId, userId)
                .filter(EventVipInvitation::eligible).map(ActivityMember::getEventVipOfferedPricing)
                .filter(pricing -> !Boolean.FALSE.equals(pricing.enabled()) && pricing.audience() != null
                        && Boolean.TRUE.equals(pricing.audience().enabled()) && pricing.audience().vipPrice() != null).orElse(null);
    }
}

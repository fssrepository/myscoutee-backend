package com.raxim.myscoutee.domain.events.service;
import java.util.*;
import org.springframework.stereotype.Service;
import com.raxim.myscoutee.domain.events.api.CommunityMemberships;
import com.raxim.myscoutee.domain.events.dto.CommunityMember;
import com.raxim.myscoutee.domain.events.document.ActivityMember;
import com.raxim.myscoutee.domain.events.repository.ActivityMembersRepository;
@Service
public class CommunityMembershipService implements CommunityMemberships {
    private final ActivityMembersRepository members;
    public CommunityMembershipService(ActivityMembersRepository members) { this.members = members; }
    @Override public List<CommunityMember> forAccount(String id) { return members.findByOwnerTypeAndUserId("community", id).stream().map(this::view).toList(); }
    @Override public List<CommunityMember> forGroup(String id) { return members.findByOwnerTypeAndOwnerId("community", id).stream().map(this::view).toList(); }
    @Override public List<CommunityMember> forGroups(Collection<String> ids) { return members.findByOwnerTypeAndOwnerIdIn("community", ids).stream().map(this::view).toList(); }
    @Override public List<CommunityMember> accepted(String id) { return members.findByOwnerTypeAndOwnerIdAndStatus("community", id, "accepted").stream().map(this::view).toList(); }
    @Override public Optional<CommunityMember> member(String group, String account) { return members.findByOwnerTypeAndOwnerIdAndUserId("community", group, account).map(this::view); }
    @Override public CommunityMember register(CommunityMember member) { return view(members.save(registration(member))); }
    @Override public List<CommunityMember> registerAll(List<CommunityMember> values) { return members.saveAll(values.stream().map(this::registration).toList()).stream().map(this::view).toList(); }
    @Override public long transition(String id, String expectedStatus, String expectedRole, String expectedActionAtIso,
            String status, String role, String requestKind, String pendingSource, boolean organizerOnly,
            String actionAtIso, String action, String actor, String managerGrantedByUserId, boolean votingEligible) {
        return members.updateCommunityState(id, expectedStatus, expectedRole, expectedActionAtIso, status, role, requestKind,
                pendingSource, organizerOnly, actionAtIso, action, actor, managerGrantedByUserId, votingEligible);
    }
    private CommunityMember view(ActivityMember source) {
        if (source == null) return null;
        var result = new CommunityMember();
        result.setId(source.getId());
        result.setOwnerType(source.getOwnerType());
        result.setOwnerId(source.getOwnerId());
        result.setUserId(source.getUserId());
        result.setRole(source.getRole());
        result.setStatus(source.getStatus());
        result.setRequestKind(source.getRequestKind());
        result.setPendingSource(source.getPendingSource());
        result.setInvitedByUserId(source.getInvitedByUserId());
        result.setMetWhere(source.getMetWhere());
        result.setMetAtIso(source.getMetAtIso());
        result.setActionAtIso(source.getActionAtIso());
        result.setUpdatedDate(source.getUpdatedDate());
        result.setCreatedDate(source.getCreatedDate());
        result.setCommunityAction(source.getCommunityAction());
        result.setCommunityActor(source.getCommunityActor());
        result.setOrganizerOnly(source.getOrganizerOnly());
        result.setManagerGrantedByUserId(source.getManagerGrantedByUserId());
        result.setVotingEligible(source.getVotingEligible());
        result.setCommunityUpdates(source.getCommunityUpdates());
        return result;
    }
    private ActivityMember registration(CommunityMember source) {
        var result = new ActivityMember();
        result.setId(source.getId());
        result.setOwnerType(source.getOwnerType());
        result.setOwnerId(source.getOwnerId());
        result.setUserId(source.getUserId());
        result.setRole(source.getRole());
        result.setStatus(source.getStatus());
        result.setRequestKind(source.getRequestKind());
        result.setPendingSource(source.getPendingSource());
        result.setInvitedByUserId(source.getInvitedByUserId());
        result.setMetWhere(source.getMetWhere());
        result.setMetAtIso(source.getMetAtIso());
        result.setActionAtIso(source.getActionAtIso());
        result.setUpdatedDate(source.getUpdatedDate());
        result.setCreatedDate(source.getCreatedDate());
        result.setCommunityAction(source.getCommunityAction());
        result.setCommunityActor(source.getCommunityActor());
        result.setOrganizerOnly(source.getOrganizerOnly());
        result.setManagerGrantedByUserId(source.getManagerGrantedByUserId());
        result.setVotingEligible(source.getVotingEligible());
        result.setCommunityUpdates(source.getCommunityUpdates());
        if (!"community".equals(result.getOwnerType())) throw new IllegalArgumentException("Community membership requires community ownership.");
        return result;
    }
}

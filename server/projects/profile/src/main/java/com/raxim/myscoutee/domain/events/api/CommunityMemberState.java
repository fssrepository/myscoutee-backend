package com.raxim.myscoutee.domain.events.api;

/** The exact detached community transition fields, excluding persistence-only counters. */
public interface CommunityMemberState {
    String getId();
    String getOwnerType();
    String getOwnerId();
    String getUserId();
    String getRole();
    String getStatus();
    String getRequestKind();
    String getPendingSource();
    String getInvitedByUserId();
    String getMetWhere();
    String getMetAtIso();
    String getActionAtIso();
    String getUpdatedDate();
    String getCreatedDate();
    String getCommunityAction();
    String getCommunityActor();
    Boolean getOrganizerOnly();
    String getManagerGrantedByUserId();
    Boolean getVotingEligible();
    Long getCommunityUpdates();

    interface Mutable extends CommunityMemberState {
        void setId(String value);
        void setOwnerType(String value);
        void setOwnerId(String value);
        void setUserId(String value);
        void setRole(String value);
        void setStatus(String value);
        void setRequestKind(String value);
        void setPendingSource(String value);
        void setInvitedByUserId(String value);
        void setMetWhere(String value);
        void setMetAtIso(String value);
        void setActionAtIso(String value);
        void setUpdatedDate(String value);
        void setCreatedDate(String value);
        void setCommunityAction(String value);
        void setCommunityActor(String value);
        void setOrganizerOnly(Boolean value);
        void setManagerGrantedByUserId(String value);
        void setVotingEligible(Boolean value);
        void setCommunityUpdates(Long value);
    }

    static void copy(CommunityMemberState source, Mutable target) {
        target.setId(source.getId());
        target.setOwnerType(source.getOwnerType());
        target.setOwnerId(source.getOwnerId());
        target.setUserId(source.getUserId());
        target.setRole(source.getRole());
        target.setStatus(source.getStatus());
        target.setRequestKind(source.getRequestKind());
        target.setPendingSource(source.getPendingSource());
        target.setInvitedByUserId(source.getInvitedByUserId());
        target.setMetWhere(source.getMetWhere());
        target.setMetAtIso(source.getMetAtIso());
        target.setActionAtIso(source.getActionAtIso());
        target.setUpdatedDate(source.getUpdatedDate());
        target.setCreatedDate(source.getCreatedDate());
        target.setCommunityAction(source.getCommunityAction());
        target.setCommunityActor(source.getCommunityActor());
        target.setOrganizerOnly(source.getOrganizerOnly());
        target.setManagerGrantedByUserId(source.getManagerGrantedByUserId());
        target.setVotingEligible(source.getVotingEligible());
        target.setCommunityUpdates(source.getCommunityUpdates());
    }
}

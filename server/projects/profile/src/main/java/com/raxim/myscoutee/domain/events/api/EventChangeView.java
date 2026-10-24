package com.raxim.myscoutee.domain.events.api;

/** Existing integration change payload fields; no owner persistence handle. */
public interface EventChangeView {
    String getId();
    String getSourceId();
    String getOwnerUserId();
    Boolean getIsAdmin();
    String getTitle();
    String getStatus();
    String getStartAtIso();
    String getEndAtIso();
    String getSourceLink();
    String getMode();
    com.raxim.myscoutee.common.dto.SharedDtos.MingleConfigurationDto getMingleConfiguration();
    Integer getAcceptedMembers();
    Integer getPendingMembers();

    /** Record-backed integration snapshots share the same bean bridge. */
    interface RecordFields extends EventChangeView {
        String id();
        @Override default String getId() { return id(); }
        String sourceId();
        @Override default String getSourceId() { return sourceId(); }
        String ownerUserId();
        @Override default String getOwnerUserId() { return ownerUserId(); }
        Boolean isAdmin();
        @Override default Boolean getIsAdmin() { return isAdmin(); }
        String title();
        @Override default String getTitle() { return title(); }
        String status();
        @Override default String getStatus() { return status(); }
        String startAtIso();
        @Override default String getStartAtIso() { return startAtIso(); }
        String endAtIso();
        @Override default String getEndAtIso() { return endAtIso(); }
        String sourceLink();
        @Override default String getSourceLink() { return sourceLink(); }
        String mode();
        @Override default String getMode() { return mode(); }
        com.raxim.myscoutee.common.dto.SharedDtos.MingleConfigurationDto mingleConfiguration();
        @Override default com.raxim.myscoutee.common.dto.SharedDtos.MingleConfigurationDto getMingleConfiguration() { return mingleConfiguration(); }
        Integer acceptedMembers();
        @Override default Integer getAcceptedMembers() { return acceptedMembers(); }
        Integer pendingMembers();
        @Override default Integer getPendingMembers() { return pendingMembers(); }
    }
}

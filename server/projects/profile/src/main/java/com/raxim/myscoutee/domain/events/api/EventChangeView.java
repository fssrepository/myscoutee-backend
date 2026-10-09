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
}

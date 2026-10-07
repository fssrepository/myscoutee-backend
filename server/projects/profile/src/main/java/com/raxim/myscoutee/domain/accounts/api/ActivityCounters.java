package com.raxim.myscoutee.domain.accounts.api;
public interface ActivityCounters {
    boolean hasSupportCaseCounters(WorkspaceProfile profile);
    void refreshSupportCaseCountersForAdmins();
    void refreshFeedCountersForUser(String userId);
    void refreshEventCountersForSourceIds(java.util.Collection<String> sourceIds);
    void refreshAssetCountersForUser(String userId);
}

package com.raxim.myscoutee.domain.groups.api;

import com.raxim.myscoutee.domain.accounts.api.DiscoveryProfile;

public interface WorkspaceMembership { DiscoveryProfile select(String accountId, String groupId); }

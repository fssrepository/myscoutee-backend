package com.raxim.myscoutee.domain.affinity.api;

/** Signals emitted by the accounts owner after its existing profile mutations. */
public interface UserAffinityChanges {
    AffinityStatusChanges.Task enqueueUserChanged(String userId);
    AffinityStatusChanges.Task enqueueAdminStatusChanged(String userId);
}

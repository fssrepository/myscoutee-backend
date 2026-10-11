package com.raxim.myscoutee.domain.affinity.api;

/** Signals emitted by the accounts owner after its existing profile mutations. */
public interface UserAffinityChanges extends com.raxim.myscoutee.domain.accounts.api.ProfileStatusObserver {
    @Override
    default void onProfileStatusChanged(String userId) {
        enqueueAdminStatusChanged(userId);
    }

    AffinityStatusChanges.Task enqueueUserChanged(String userId);
    AffinityStatusChanges.Task enqueueAdminStatusChanged(String userId);
}

package com.raxim.myscoutee.domain.accounts.api;

/** Resolves an actor through the existing authenticated profile-selection rules. */
public interface SelectedProfile {
    String resolveSelectedUserId(String requestedUserId);
}

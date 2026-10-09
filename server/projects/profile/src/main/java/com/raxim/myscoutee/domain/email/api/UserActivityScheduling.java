package com.raxim.myscoutee.domain.email.api;

/** The existing activity signal used to reschedule the user's inactivity task. */
public interface UserActivityScheduling {
    void touchUserActivity(String userId);
}

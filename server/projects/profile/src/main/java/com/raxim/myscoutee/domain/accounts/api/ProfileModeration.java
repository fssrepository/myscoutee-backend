package com.raxim.myscoutee.domain.accounts.api;
public interface ProfileModeration {
    boolean block(WorkspaceProfile profile);
    void unblock(WorkspaceProfile profile);
}

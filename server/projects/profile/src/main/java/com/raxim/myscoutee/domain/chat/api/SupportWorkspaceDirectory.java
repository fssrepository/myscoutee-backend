package com.raxim.myscoutee.domain.chat.api;

/** Workspace facts needed by the existing support-chat scope and title rules. */
public interface SupportWorkspaceDirectory {
    Workspace supportWorkspace(String workspaceId);
    record Workspace(String baseId, String name, boolean present) {}
}

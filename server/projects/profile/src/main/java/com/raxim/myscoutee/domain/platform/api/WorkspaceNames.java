package com.raxim.myscoutee.domain.platform.api;

import java.util.function.Consumer;

/** Display name lookup supplied by an installed workspace owner. */
public interface WorkspaceNames {
    void withWorkspaceName(String workspaceId, Consumer<String> consumer);
}

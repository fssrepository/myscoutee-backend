package com.raxim.myscoutee.domain.groups.api;

import java.util.Objects;
import com.raxim.myscoutee.domain.accounts.api.AuthenticatedActor;
import com.raxim.myscoutee.domain.accounts.api.WorkspaceIdentity;
import org.springframework.security.core.context.SecurityContextHolder;

public final class WorkspaceContext {
    private WorkspaceContext() {}
    public static String currentGroupId() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof AuthenticatedActor principal)
            return principal.getProfileIdentity() == null ? null : principal.getProfileIdentity().workspaceGroupId();
        return null;
    }
    public static boolean allows(String groupId) { return Objects.equals(currentGroupId(), groupId); }
    public static boolean sameWorkspace(WorkspaceIdentity left, WorkspaceIdentity right) {
        return left != null && right != null && Objects.equals(left.getWorkspaceGroupId(), right.getWorkspaceGroupId());
    }
}

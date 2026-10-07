package com.raxim.myscoutee.domain.groups.api;

import java.util.Objects;
import com.raxim.myscoutee.domain.accounts.api.AccountIdentity;
import com.raxim.myscoutee.domain.accounts.api.WorkspaceProfile;
import org.springframework.security.core.context.SecurityContextHolder;

public final class WorkspaceContext {
    private WorkspaceContext() {}
    public static String currentGroupId() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof AccountIdentity principal)
            return principal.getUser() == null ? null : principal.getUser().getWorkspaceGroupId();
        return null;
    }
    public static boolean allows(String groupId) { return Objects.equals(currentGroupId(), groupId); }
    public static boolean sameWorkspace(WorkspaceProfile left, WorkspaceProfile right) {
        return left != null && right != null && Objects.equals(left.getWorkspaceGroupId(), right.getWorkspaceGroupId());
    }
}

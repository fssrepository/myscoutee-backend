package com.raxim.myscoutee.domain.groups.api;

import java.util.Objects;
import com.raxim.myscoutee.domain.accounts.security.firebase.dto.FirebasePrincipal;
import com.raxim.myscoutee.domain.accounts.api.WorkspaceProfile;
import org.springframework.security.core.context.SecurityContextHolder;

public final class WorkspaceContext {
    private WorkspaceContext() {}
    public static String currentGroupId() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof FirebasePrincipal principal)
            return principal.profileView() == null ? null : principal.profileView().getWorkspaceGroupId();
        return null;
    }
    public static boolean allows(String groupId) { return Objects.equals(currentGroupId(), groupId); }
    public static boolean sameWorkspace(WorkspaceProfile left, WorkspaceProfile right) {
        return left != null && right != null && Objects.equals(left.getWorkspaceGroupId(), right.getWorkspaceGroupId());
    }
}

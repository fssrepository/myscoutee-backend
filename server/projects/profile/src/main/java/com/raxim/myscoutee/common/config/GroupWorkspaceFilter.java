package com.raxim.myscoutee.common.config;

import java.io.IOException;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.server.ResponseStatusException;
import com.raxim.myscoutee.common.config.firebase.FirebaseAuthenticationToken;
import com.raxim.myscoutee.common.config.firebase.dto.FirebasePrincipal;
import com.raxim.myscoutee.profile.service.CommunityGroupProfilesService;
import jakarta.servlet.*;
import jakarta.servlet.http.*;

public class GroupWorkspaceFilter extends OncePerRequestFilter {
    private final ObjectProvider<CommunityGroupProfilesService> profiles;
    public GroupWorkspaceFilter(ObjectProvider<CommunityGroupProfilesService> profiles) { this.profiles = profiles; }
    @Override protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {
        String path = request.getServletPath();
        if (path.matches("/(?:api/)?(?:groups|notifications|i18n|admin|operator|integrations|privacy|help|terms|explanations)(?:/.*)?")
                || path.matches("/(?:api/)?auth/me/(?:partner-invite/claim|logout|delete|feedback)")
                || path.matches("/(?:api/)?auth/(?!me(?:/|$)).*")) { chain.doFilter(request, response); return; }
        var original = SecurityContextHolder.getContext().getAuthentication();
        if (original == null || !(original.getPrincipal() instanceof FirebasePrincipal account)) {
            chain.doFilter(request, response); return;
        }
        try {
            if (account.getUser() == null) { chain.doFilter(request, response); return; }
            // Only the full profile load may change the saved selection. Absence is read-only;
            // an explicitly empty parameter returns to the account's base profile.
            boolean selecting = "GET".equals(request.getMethod())
                    && path.matches("/(?:api/)?auth/me/profile-ext")
                    && request.getParameterMap().containsKey("groupId");
            String requestedGroup = selecting ? request.getParameter("groupId") : null;
            var profile = selecting
                    ? (requestedGroup == null || requestedGroup.isBlank() ? account.getUser()
                        : profiles.getObject().select(account.getUserId(), requestedGroup))
                    : profiles.getObject().current(account.getUser());
            if (profile == account.getUser()) { chain.doFilter(request, response); return; }
            var principal = new FirebasePrincipal(profile.getUserId(), account.getEmail(),
                    original.getAuthorities().stream().map(a -> a.getAuthority()).toList(), profile, account.isEmailVerified());
            SecurityContextHolder.getContext().setAuthentication(new FirebaseAuthenticationToken(principal,
                    original.getCredentials(), principal.getAuthorities()));
            chain.doFilter(request, response);
        } catch (ResponseStatusException error) { response.sendError(error.getStatusCode().value()); }
        finally { SecurityContextHolder.getContext().setAuthentication(original); }
    }
}

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
    public static final String HEADER = "X-MyScoutee-Group-Id";
    private final ObjectProvider<CommunityGroupProfilesService> profiles;
    public GroupWorkspaceFilter(ObjectProvider<CommunityGroupProfilesService> profiles) { this.profiles = profiles; }
    @Override protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {
        String path = request.getServletPath();
        if (path.matches("/(?:api/)?(?:groups|notifications|i18n|admin|operator|integrations|privacy|help|terms|explanations)(?:/.*)?")
                || path.matches("/(?:api/)?auth/me/(?:partner-invite/claim|logout|delete|feedback)")) { chain.doFilter(request, response); return; }
        String groupId = request.getHeader(HEADER);
        if (groupId == null || groupId.isBlank()) { chain.doFilter(request, response); return; }
        var original = SecurityContextHolder.getContext().getAuthentication();
        if (original == null || !(original.getPrincipal() instanceof FirebasePrincipal account)) {
            response.sendError(401); return;
        }
        try {
            var profile = profiles.getObject().select(account.getUserId(), groupId);
            var principal = new FirebasePrincipal(profile.getUserId(), account.getEmail(),
                    original.getAuthorities().stream().map(a -> a.getAuthority()).toList(), profile, account.isEmailVerified());
            SecurityContextHolder.getContext().setAuthentication(new FirebaseAuthenticationToken(principal,
                    original.getCredentials(), principal.getAuthorities()));
            chain.doFilter(request, response);
        } catch (ResponseStatusException error) { response.sendError(error.getStatusCode().value()); }
        finally { SecurityContextHolder.getContext().setAuthentication(original); }
    }
}

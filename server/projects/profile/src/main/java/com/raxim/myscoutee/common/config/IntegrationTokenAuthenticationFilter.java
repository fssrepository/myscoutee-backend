package com.raxim.myscoutee.common.config;

import java.io.IOException;
import java.net.InetAddress;
import java.util.List;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import com.raxim.myscoutee.profile.service.IntegrationTokenService;
import com.raxim.myscoutee.profile.service.CommunityGroupProfilesService;
import com.raxim.myscoutee.profile.repository.UsersRepository;
import com.raxim.myscoutee.common.config.firebase.dto.FirebasePrincipal;
import org.springframework.web.server.ResponseStatusException;
import com.raxim.myscoutee.profile.service.IntegrationTokenService.AuthenticatedIntegrationClient;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class IntegrationTokenAuthenticationFilter extends OncePerRequestFilter {
    private static final String BEARER_PREFIX = "Bearer ";
    public static final String CLIENT_ID_HEADER = "X-MyScoutee-Client-Id";

    private final IntegrationTokenService tokenService;
    @org.springframework.beans.factory.annotation.Autowired
    private org.springframework.beans.factory.ObjectProvider<com.raxim.myscoutee.profile.service.McpAuthorizationService> mcp;

    private final UsersRepository users;
    private final CommunityGroupProfilesService profiles;

    public IntegrationTokenAuthenticationFilter(IntegrationTokenService tokenService,
            UsersRepository users, CommunityGroupProfilesService profiles) {
        this.tokenService = tokenService;
        this.users = users;
        this.profiles = profiles;
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request == null ? "" : request.getRequestURI();
        return !(path.startsWith("/integrations/v1/") || path.startsWith("/api/integrations/v1/"));
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws ServletException, IOException {
        String authorization = request.getHeader("Authorization");
        String rawToken = StringUtils.hasText(authorization) && authorization.startsWith(BEARER_PREFIX)
                ? authorization.substring(BEARER_PREFIX.length()).trim()
                : null;
        AuthenticatedIntegrationClient client = rawToken != null && rawToken.startsWith("mca_")
                ? mcp.getObject().authenticate(rawToken) : tokenService.authenticateClient(
                rawToken,
                request.getHeader(CLIENT_ID_HEADER),
                resolveClientAddress(request));
        if (client == null || !StringUtils.hasText(client.ownerUserId())) {
            SecurityContextHolder.clearContext();
            response.setHeader("Cache-Control", "no-store");
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "A valid integration token is required.");
            return;
        }

        // A key belongs to the profile that issued it; changing the interactive
        // session's active group must never retarget a running integration.
        SecurityContextHolder.clearContext();
        var owner = users.findByUserId(client.ownerUserId()).orElse(null);
        if (owner == null) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }
        try {
            if (StringUtils.hasText(owner.getWorkspaceGroupId())) {
                owner = profiles.select(owner.getAccountUserId(), owner.getWorkspaceGroupId());
                if (!client.ownerUserId().equals(owner.getUserId())) {
                    response.sendError(HttpServletResponse.SC_FORBIDDEN);
                    return;
                }
            }
        } catch (ResponseStatusException error) {
            response.sendError(error.getStatusCode().value());
            return;
        }
        if (request.getRequestURI().matches("/(?:api/)?integrations/v1/assets(?:/.*)?")
                && StringUtils.hasText(owner.getWorkspaceGroupId())) {
            response.sendError(HttpServletResponse.SC_FORBIDDEN,
                    "Asset creation requires an integration key issued by the base profile.");
            return;
        }
        var principal = new FirebasePrincipal(owner.getUserId(), null, "INTEGRATION", owner);
        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                principal,
                null,
                List.of(new SimpleGrantedAuthority("INTEGRATION")));
        authentication.setDetails(client);
        SecurityContextHolder.getContext().setAuthentication(authentication);
        filterChain.doFilter(request, response);
    }

    private String resolveClientAddress(HttpServletRequest request) {
        String directAddress = request == null ? null : request.getRemoteAddr();
        if (!isTrustedProxyAddress(directAddress)) {
            return directAddress;
        }
        String forwardedFor = request.getHeader("X-Forwarded-For");
        if (StringUtils.hasText(forwardedFor)) {
            String firstAddress = forwardedFor.split(",", 2)[0].trim();
            if (isNumericAddress(firstAddress)) {
                return firstAddress;
            }
        }
        String realIp = request.getHeader("X-Real-IP");
        return isNumericAddress(realIp) ? realIp.trim() : directAddress;
    }

    private boolean isTrustedProxyAddress(String value) {
        try {
            InetAddress address = InetAddress.getByName(value);
            return address.isAnyLocalAddress()
                    || address.isLoopbackAddress()
                    || address.isSiteLocalAddress();
        } catch (RuntimeException | IOException ignored) {
            return false;
        }
    }

    private boolean isNumericAddress(String value) {
        if (!StringUtils.hasText(value) || !value.trim().matches("[0-9a-fA-F:.]+")) {
            return false;
        }
        try {
            InetAddress.getByName(value.trim());
            return true;
        } catch (RuntimeException | IOException ignored) {
            return false;
        }
    }
}

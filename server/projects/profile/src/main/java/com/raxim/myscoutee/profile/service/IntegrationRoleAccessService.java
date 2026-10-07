package com.raxim.myscoutee.profile.service;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.server.ResponseStatusException;
import com.raxim.myscoutee.common.config.properties.ConfigProperties;
import com.raxim.myscoutee.profile.data.document.Users;

/** Integration role checks use the same current role sources as interactive authentication. */
@Service
public class IntegrationRoleAccessService {
    private final AppSettingsService settings;
    private final ConfigProperties config;

    public IntegrationRoleAccessService(AppSettingsService settings, ConfigProperties config) {
        this.settings = settings;
        this.config = config;
    }

    public void requireActive(Users user) {
        if (user == null || StringUtils.hasText(user.getDeletedAtIso())
                || java.util.Set.of("B", "D", "I").contains(String.valueOf(user.getStatus()))
                || java.util.Set.of("blocked", "deleted", "inactive").contains(
                    String.valueOf(user.getProfileStatus()).toLowerCase(java.util.Locale.ROOT)))
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
    }

    public boolean admin(Users user) {
        return base(user) && settings.isAdminEmail(user.getEmail());
    }

    public boolean operator(Users user) {
        return base(user) && (user.isOperator() || config.isOperatorUser(user.getEmail()));
    }

    public boolean privileged(Users user) { return admin(user) || operator(user); }

    private boolean base(Users user) {
        return user != null && !StringUtils.hasText(user.getWorkspaceGroupId())
                && !StringUtils.hasText(user.getAccountUserId());
    }
}

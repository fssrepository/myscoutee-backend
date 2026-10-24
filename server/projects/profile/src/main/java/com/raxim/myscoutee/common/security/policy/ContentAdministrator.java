package com.raxim.myscoutee.common.security.policy;

import org.springframework.util.StringUtils;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import com.raxim.myscoutee.domain.accounts.api.AuthenticatedActor;
import com.raxim.myscoutee.common.config.mongo.MongoSessionMode;
import com.raxim.myscoutee.common.config.mongo.MongoSessionModeContext;

/** The existing header-authenticated content administrator/DEMO rule, shared by content editors. */
public final class ContentAdministrator {
    private ContentAdministrator() {}
    public static String require(String adminUserId, boolean firebaseEnabled,
            com.raxim.myscoutee.domain.platform.api.AdministratorSettings settings) {
        String normalized = trim(adminUserId);
        if (firebaseEnabled) {
            String email = resolveFirebaseEmail();
            if (!settings.isAdminEmail(email)) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Admin access is restricted.");
            }
            return StringUtils.hasText(normalized) ? normalized : email;
        }
        if (MongoSessionModeContext.currentMode() != MongoSessionMode.DEMO) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Admin demo access is restricted to demo data.");
        }
        return StringUtils.hasText(normalized) ? normalized : "admin";
    }
    private static String resolveFirebaseEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Object principal = authentication == null ? null : authentication.getPrincipal();
        if (principal instanceof AuthenticatedActor firebasePrincipal) {
            return trim(firebasePrincipal.getEmail());
        }
        return trim(authentication == null ? null : authentication.getName());
    }
    private static String trim(String value) { return value == null ? "" : value.trim(); }
}

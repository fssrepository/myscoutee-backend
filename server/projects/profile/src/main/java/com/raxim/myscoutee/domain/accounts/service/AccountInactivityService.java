package com.raxim.myscoutee.domain.accounts.service;
import java.time.*;
import java.time.format.DateTimeParseException;
import java.time.temporal.ChronoUnit;
import java.util.*;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import com.raxim.myscoutee.domain.accounts.api.AccountInactivity;
import com.raxim.myscoutee.domain.accounts.document.Users;
import com.raxim.myscoutee.domain.accounts.document.UserSessionAction;
import com.raxim.myscoutee.domain.accounts.repository.UsersRepository;
import com.raxim.myscoutee.domain.accounts.repository.UserSessionActionsRepository;
@Service
public class AccountInactivityService implements AccountInactivity {
    private final UsersRepository usersRepository;
    private final UserSessionActionsRepository userSessionActionsRepository;
    private final ProfileStatusWork statusWork;
    public AccountInactivityService(UsersRepository usersRepository, UserSessionActionsRepository userSessionActionsRepository, ProfileStatusWork statusWork) {
        this.usersRepository = usersRepository; this.userSessionActionsRepository = userSessionActionsRepository; this.statusWork = statusWork;
    }
    @Override public Outcome inactivate(String userId, int inactiveDays, Instant now) {
        Users user = StringUtils.hasText(userId) ? usersRepository.findByUserId(userId).orElse(null) : null;
        if (user == null || "D".equals(safeText(user.getStatus())) || "deleted".equals(safeText(user.getProfileStatus())))
            return new Outcome("skipped", 0, "User not found or deleted.", null, null);
        Instant threshold = now.minus(inactiveDays, ChronoUnit.DAYS);
        Instant lastActivity = latestActivityAt(user);
        if (lastActivity != null && lastActivity.isAfter(threshold))
            return new Outcome("scheduled", 0, "User active; rescheduled.", user, lastActivity.plus(inactiveDays, ChronoUnit.DAYS));
        if ("inactive".equals(safeText(user.getProfileStatus())) || "I".equals(safeText(user.getStatus())))
            return new Outcome("skipped", 0, "Profile already inactive.", user, null);
        user.setStatus("I");
        user.setProfileStatus("inactive");
        statusWork.save(user);
        return new Outcome("completed", 1, "Profile set to inactive.", user, null);
    }
    private Instant latestActivityAt(Users user) {
        String userId = normalizeId(user == null ? null : user.getId());
        Instant latest = null;
        for (Users.UserDeviceRecord device : user == null || user.getDevices() == null ? List.<Users.UserDeviceRecord>of() : user.getDevices()) {
            latest = max(latest, parseInstant(device == null ? null : device.getLastSeenAtIso()));
            latest = max(latest, parseInstant(device == null ? null : device.getLastRegisteredAtIso()));
        }
        if (StringUtils.hasText(userId)) {
            latest = max(latest, userSessionActionsRepository.findByUserIdOrderByCreatedDateDesc(userId).stream()
                    .map(UserSessionAction::getCreatedDate)
                    .map(this::parseInstant)
                    .filter(item -> item != null)
                    .max(Comparator.naturalOrder())
                    .orElse(null));
        }
        return latest;
    }
    private Instant max(Instant left, Instant right) {
        return com.raxim.myscoutee.common.util.TimeValues.max(left, right);
    }
    private Instant parseInstant(String value) {
        return com.raxim.myscoutee.common.util.TimeValues.parseInstant(value);
    }
    private String normalizeId(String value) {
        return safeText(value);
    }
    private String safeText(String value) {
        return value == null ? "" : value.trim();
    }
}

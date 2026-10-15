package com.raxim.myscoutee.domain.accounts.service;

import static com.raxim.myscoutee.domain.accounts.service.AccountCounterMapper.*;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import com.raxim.myscoutee.domain.accounts.document.Users;
import com.raxim.myscoutee.domain.accounts.dto.AuthDtos.UserMenuCountersDto;
import com.raxim.myscoutee.domain.accounts.repository.UsersRepository;

/** The existing selected-profile/account counter read, independent of profile discovery. */
@Service
public class ProfileMenuCountersService {
    private final UsersRepository usersRepository;
    private final SelectedProfileService selectedProfile;


    public ProfileMenuCountersService(UsersRepository usersRepository, SelectedProfileService selectedProfile) {
        this.usersRepository = usersRepository;
        this.selectedProfile = selectedProfile;
    }

    public UserMenuCountersDto queryMenuCounters(String requestedUserId) {
        String resolvedUserId = selectedProfile.resolveSelectedUserId(requestedUserId);
        Users user = findUser(resolvedUserId);
        return user == null ? emptyMenuCounters() : buildMenuCounters(user);
    }

    UserMenuCountersDto buildMenuCounters(Users user) {
        Users account = StringUtils.hasText(user.getAccountUserId()) ? findUser(user.getAccountUserId()) : user;
        return buildMenuCounters(user, account);
    }

    UserMenuCountersDto buildMenuCounters(Users user, Users account) {
        Users.UserActivitiesRecord activities = user.getActivities();
        Users.UserActivitiesRecord accountActivities = account == null ? null : account.getActivities();
        return new UserMenuCountersDto(
                activities == null ? 0 : normalizeCount(activities.game()),
                activities == null ? 0 : normalizeCount(activities.chats()),
                activities == null ? 0 : normalizeCount(activities.invitations()),
                activities == null ? 0 : normalizeCount(activities.events()),
                activities == null ? 0 : normalizeCount(activities.hosting()),
                accountActivities == null ? 0 : normalizeCount(accountActivities.cars()),
                accountActivities == null ? 0 : normalizeCount(accountActivities.accommodation()),
                accountActivities == null ? 0 : normalizeCount(accountActivities.supplies()),
                accountActivities == null ? 0 : normalizeCount(accountActivities.tickets()),
                accountActivities == null ? 0 : normalizeCount(accountActivities.contacts()),
                activities == null ? 0 : normalizeCount(activities.feedback()),
                toUserChatCountersDto(activities == null ? null : activities.chat()),
                toUserEventCountersDto(activities == null ? null : activities.event()),
                toUserAssetCountersDto(accountActivities == null ? null : accountActivities.asset()),
                toUserFeedbackCountersDto(activities == null ? null : activities.feedbackCounts()),
                activities == null ? 0 : normalizeCount(activities.adminJobs()),
                activities == null ? 0 : normalizeCount(activities.adminMetrics()),
                normalizeCount(user.getPaymentRefundsPending()),
                normalizeCount(account == null ? null : account.getContactRequestsPending()),
                accountActivities == null ? 0 : normalizeCount(accountActivities.notifications()),
                moduleCounters(user, account));
    }

    private java.util.Map<String, Integer> moduleCounters(Users user, Users account) {
        var values = new java.util.LinkedHashMap<String, Integer>();
        if (account != null) values.putAll(account.getMenuCounters());
        values.putAll(user.getMenuCounters());
        return java.util.Map.copyOf(values);
    }

    private Users findUser(String userId) {
        if (!StringUtils.hasText(userId)) return null;
        Users user = usersRepository.findByUserId(userId).orElse(null);
        return SelectedProfileService.isUsableUserDocument(user) ? user : null;
    }

    private int normalizeCount(Integer value) {
        return value == null ? 0 : Math.max(0, value);
    }
}

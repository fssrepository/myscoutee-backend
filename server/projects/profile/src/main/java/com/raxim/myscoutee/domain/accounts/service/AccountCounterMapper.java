package com.raxim.myscoutee.domain.accounts.service;

import com.raxim.myscoutee.domain.accounts.document.Users;
import com.raxim.myscoutee.domain.accounts.dto.AuthDtos.*;

/** Maps existing account counter snapshots without querying their product owners. */
final class AccountCounterMapper {
    private AccountCounterMapper() {}

    static UserEventCountersDto toUserEventCountersDto(Users.UserEventCountersRecord event) {
        return new UserEventCountersDto(
                event == null ? 0 : normalizeCount(event.all()),
                event == null ? 0 : normalizeCount(event.active()),
                event == null ? 0 : normalizeCount(event.pending()),
                event == null ? 0 : normalizeCount(event.invitations()),
                event == null ? 0 : normalizeCount(event.hosting()),
                event == null ? 0 : normalizeCount(event.drafts()),
                event == null ? 0 : normalizeCount(event.trash()),
                event == null ? 0 : normalizeCount(event.watchlist()));
    }

    static UserChatCountersDto toUserChatCountersDto(Users.UserChatCountersRecord chat) {
        return new UserChatCountersDto(
                chat == null ? 0 : normalizeCount(chat.all()),
                chat == null ? 0 : normalizeCount(chat.event()),
                chat == null ? 0 : normalizeCount(chat.subEvent()),
                chat == null ? 0 : normalizeCount(chat.group()),
                chat == null ? 0 : normalizeCount(chat.service()),
                chat == null ? 0 : normalizeCount(chat.appSupport()),
                toUserSupportCaseCountersDto(chat == null ? null : chat.supportCases()),
                chat == null ? 0 : normalizeCount(chat.groupSupport()),
                chat == null ? 0 : normalizeCount(chat.contacts()),
                chat == null ? 0 : normalizeCount(chat.campaign()),
                chat == null ? 0 : normalizeCount(chat.cases()));
    }

    static UserSupportCaseCountersDto toUserSupportCaseCountersDto(
            Users.UserSupportCaseCountersRecord supportCases) {
        return new UserSupportCaseCountersDto(
                supportCases == null ? 0 : normalizeCount(supportCases.pending()),
                supportCases == null ? 0 : normalizeCount(supportCases.warned()),
                supportCases == null ? 0 : normalizeCount(supportCases.picked()),
                supportCases == null ? 0 : normalizeCount(supportCases.solved()),
                supportCases == null ? 0 : normalizeCount(supportCases.blocked()),
                supportCases == null ? 0 : normalizeCount(supportCases.all()));
    }

    static UserAssetCountersDto toUserAssetCountersDto(Users.UserAssetCountersRecord asset) {
        return new UserAssetCountersDto(
                asset == null ? 0 : normalizeCount(asset.cars()),
                asset == null ? 0 : normalizeCount(asset.accommodation()),
                asset == null ? 0 : normalizeCount(asset.supplies()),
                asset == null ? 0 : normalizeCount(asset.tickets()),
                asset == null ? 0 : normalizeCount(asset.carsPending()),
                asset == null ? 0 : normalizeCount(asset.accommodationPending()),
                asset == null ? 0 : normalizeCount(asset.suppliesPending()));
    }

    static UserFeedbackCountersDto toUserFeedbackCountersDto(Users.UserFeedbackCountersRecord feedback) {
        return new UserFeedbackCountersDto(
                feedback == null ? 0 : normalizeCount(feedback.ownEvents()),
                feedback == null ? 0 : normalizeCount(feedback.pending()),
                feedback == null ? 0 : normalizeCount(feedback.feedbacked()),
                feedback == null ? 0 : normalizeCount(feedback.removed()));
    }

    static UserMenuCountersDto emptyMenuCounters() {
        return new UserMenuCountersDto(
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                new UserChatCountersDto(0, 0, 0, 0, 0, 0),
                new UserEventCountersDto(0, 0, 0, 0, 0, 0, 0),
                new UserAssetCountersDto(0, 0, 0, 0),
                new UserFeedbackCountersDto(0, 0, 0, 0),
                0, 0, 0, 0);
    }

    private static int normalizeCount(Integer value) {
        return value == null ? 0 : Math.max(0, value);
    }
}

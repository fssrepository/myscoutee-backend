package com.raxim.myscoutee.domain.accounts.dto;

import com.raxim.myscoutee.domain.accounts.api.WorkspaceProfile;
import com.raxim.myscoutee.domain.accounts.dto.AuthDtos.UserFeedbackCountersDto;

/** Feedback display facts and four stored counts; no devices, finances or integration state. */
public record FeedbackSessionDto(ProfileSummaryDto profile, UserFeedbackCountersDto feedback) {
    public ProfileIdentityDto identity() {
        return new ProfileIdentityDto(profile.userId(), profile.accountUserId(), profile.workspaceGroupId());
    }
    public static FeedbackSessionDto from(WorkspaceProfile profile) {
        if (profile == null) return null;
        var counts = profile.getActivities() == null ? null : profile.getActivities().feedbackCounts();
        return new FeedbackSessionDto(ProfileSummaryDto.from(profile), counts == null ? null :
                new UserFeedbackCountersDto(counts.ownEvents(), counts.pending(), counts.feedbacked(), counts.removed()));
    }
}

package com.raxim.myscoutee.domain.accounts.api;

import com.raxim.myscoutee.domain.accounts.dto.FeedbackSessionDto;

/** Account-owned authenticated selection and stored feedback counters, read together. */
public interface FeedbackSession {
    FeedbackSessionDto resolveFeedbackSession(String requestedUserId);
}

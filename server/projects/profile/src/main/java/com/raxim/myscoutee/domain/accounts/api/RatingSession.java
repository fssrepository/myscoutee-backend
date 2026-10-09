package com.raxim.myscoutee.domain.accounts.api;

import com.raxim.myscoutee.domain.accounts.dto.RatingSessionDto;

/** Account-owned selection and facts used by the current actor's rating list. */
public interface RatingSession {
    RatingSessionDto resolveRatingSession(String requestedUserId);
}

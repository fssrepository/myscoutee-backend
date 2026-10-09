package com.raxim.myscoutee.domain.accounts.api;

import java.util.Collection;
import java.util.List;
import com.raxim.myscoutee.domain.accounts.dto.RatingProfileDto;

/** Account-owned facts used by rating ingestion and activity lists. */
public interface RatingProfiles {
    List<RatingProfileDto> queryRatingProfiles(Collection<String> userIds);
}

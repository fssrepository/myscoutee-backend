package com.raxim.myscoutee.domain.affinity.api;
public interface RatingPageReads {
    com.raxim.myscoutee.domain.affinity.dto.RatesDtos.ActivityRatePageResponseDto queryActivityRatePage(
            String requestedUserId, String modeValue, String directionValue, String sortValue, String sortDirectionValue,
            String secondaryFilterValue, boolean socialBadgeEnabled, String cursor, Integer limitValue,
            String rangeStartIso, String rangeEndIso, String campaignId);
}

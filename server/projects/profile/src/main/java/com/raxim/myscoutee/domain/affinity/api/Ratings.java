package com.raxim.myscoutee.domain.affinity.api;
import java.util.Collection;
import java.util.List;
import com.raxim.myscoutee.domain.affinity.dto.RatesDtos.ActivityRatePageResponseDto;
import com.raxim.myscoutee.domain.affinity.dto.RatesDtos.RateMenuItemDto;
import com.raxim.myscoutee.domain.affinity.dto.RatesDtos.UserRatesSyncRequestDto;
import com.raxim.myscoutee.domain.affinity.dto.RatesDtos.UserRatesSyncResponseDto;
public interface Ratings extends RatingPageReads, MeetingProjections {
    List<RateMenuItemDto> queryRateItemsByUser(String requestedUserId);
    List<RateMenuItemDto> queryRateItemsByUser(String requestedUserId, String campaignId);
    ActivityRatePageResponseDto queryActivityRatePage(
            String requestedUserId,
            String modeValue,
            String directionValue,
            String sortValue,
            String sortDirectionValue,
            String secondaryFilterValue,
            boolean socialBadgeEnabled,
            String cursor,
            Integer limitValue,
            String rangeStartIso,
            String rangeEndIso);
    ActivityRatePageResponseDto queryActivityRatePage(
            String requestedUserId,
            String modeValue,
            String directionValue,
            String sortValue,
            String sortDirectionValue,
            String secondaryFilterValue,
            boolean socialBadgeEnabled,
            String cursor,
            Integer limitValue,
            String rangeStartIso,
            String rangeEndIso, String campaignId);
    UserRatesSyncResponseDto sync(UserRatesSyncRequestDto request);
    void projectRecordedMeetings(Collection<String> participantIds);
}

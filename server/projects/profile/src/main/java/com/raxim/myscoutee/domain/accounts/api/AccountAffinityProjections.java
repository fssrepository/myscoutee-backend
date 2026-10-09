package com.raxim.myscoutee.domain.accounts.api;
import java.util.*;
public interface AccountAffinityProjections {
    int RATING_VERSION = 1;
    boolean updateAffinity(String userId, double affinity);
    List<? extends ScoringProfile> profilesForCurrentJob();
    boolean publicRandomRoomCandidate(String userId);
    List<String> staleRatingProfileIds();
    void backfillRatings(List<RatingProjection> projections, String changedAt);
    void refreshRating(RatingProjection projection, String changedAt);
    void touchRatingActivity(String userId, long activityMs);
    record RatingProjection(String userId, List<String> ratedUserIds, List<String> ratedPairKeys, Long latestActivityMs) {}
}

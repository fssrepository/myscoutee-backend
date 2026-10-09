package com.raxim.myscoutee.domain.accounts.service;
import java.util.*;
import org.springframework.stereotype.Service;
import org.springframework.data.mongodb.core.*;
import org.springframework.data.mongodb.core.query.*;
import com.raxim.myscoutee.domain.accounts.api.*;
import com.raxim.myscoutee.domain.accounts.document.Users;
import com.raxim.myscoutee.domain.accounts.repository.UsersRepository;
import com.raxim.myscoutee.domain.platform.api.JobAudience;
import com.raxim.myscoutee.domain.platform.api.JobGroupContext;
@Service
public class AccountAffinityProjectionService implements AccountAffinityProjections {
    private final MongoTemplate mongo;
    private final UsersRepository users;
    @org.springframework.beans.factory.annotation.Autowired private JobAudience audience;
    public AccountAffinityProjectionService(MongoTemplate mongo, UsersRepository users) { this.mongo = mongo; this.users = users; }
    @Override public boolean updateAffinity(String userId, double affinity) {
        if (userId == null || userId.trim().isEmpty()) return false;
        var result = mongo.updateFirst(Query.query(Criteria.where("userId").is(userId.trim())), new Update().set("affinity", affinity), Users.class);
        return result.getMatchedCount() > 0;
    }
    public boolean updateAffinity(WorkspaceProfile profile, double affinity) {
        if (profile == null || !updateAffinity(profile.getId(), affinity)) return false;
        ((Users) profile).setAffinity(affinity);
        return true;
    }
    @Override public List<Users> profilesForCurrentJob() {
        if (!JobGroupContext.isActive()) return users.findAll();
        var scope = audience.workspaceScope();
        Criteria criteria = scope.included() ? Criteria.where("workspaceGroupId").in(scope.ids()) : Criteria.where("workspaceGroupId").nin(scope.ids());
        return mongo.find(Query.query(criteria), Users.class);
    }
    @Override public boolean publicRandomRoomCandidate(String userId) {
        return mongo.exists(Query.query(Criteria.where("userId").is(userId).and("profileStatus").is("public")), Users.class);
    }
    @Override public List<String> staleRatingProfileIds() {
        var query = Query.query(Criteria.where("homeGameRateProjectionVersion").ne(RATING_VERSION)); query.fields().include("userId");
        var profiles = mongo.find(query, Users.class);
        if (profiles == null) return List.of();
        return profiles.stream().map(profile -> profile == null || profile.getId() == null ? "" : profile.getId().trim())
                .filter(id -> !id.isBlank()).distinct().toList();
    }
    @Override public void backfillRatings(List<RatingProjection> projections, String changedAt) {
        if (projections.isEmpty()) return;
        var updates = mongo.bulkOps(BulkOperations.BulkMode.UNORDERED, Users.class);
        for (var projection : projections) {
            var update = ratingUpdate(projection, changedAt);
            if (projection.latestActivityMs() != null && projection.latestActivityMs() > 0) update.max("homeGameLastRateActivityMs", projection.latestActivityMs());
            updates.updateOne(Query.query(Criteria.where("userId").is(projection.userId())), update);
        }
        updates.execute();
    }
    @Override public void refreshRating(RatingProjection projection, String changedAt) {
        mongo.updateFirst(Query.query(Criteria.where("userId").is(projection.userId())), ratingUpdate(projection, changedAt), Users.class);
    }
    @Override public void touchRatingActivity(String userId, long activityMs) {
        mongo.updateFirst(Query.query(Criteria.where("userId").is(userId)), new Update().max("homeGameLastRateActivityMs", activityMs), Users.class);
    }
    private Update ratingUpdate(RatingProjection projection, String changedAt) {
        return new Update().set("homeGameRatedUserIds", projection.ratedUserIds()).set("homeGameRatedPairKeys", projection.ratedPairKeys())
                .set("homeGameRateProjectionVersion", RATING_VERSION).set("homeGameRateProjectionUpdatedAtIso", changedAt);
    }
}

package com.raxim.myscoutee.domain.accounts.service;

import java.time.Instant;
import java.util.List;

import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.server.ResponseStatusException;

import com.raxim.myscoutee.domain.accounts.document.UserPageFilterPreferences;
import com.raxim.myscoutee.domain.accounts.document.UserPageFilterPreferences.EventExploreFilters;

@Service
public class UserPageFilterPreferencesService {
    private final MongoTemplate mongoTemplate;
    private final HomeUserProfileService profiles;

    public UserPageFilterPreferencesService(MongoTemplate mongoTemplate, HomeUserProfileService profiles) {
        this.mongoTemplate = mongoTemplate;
        this.profiles = profiles;
    }

    public EventExploreFilters load(String requestedUserId, String pageKey) {
        UserPageFilterPreferences stored = mongoTemplate.findOne(query(requestedUserId, pageKey), UserPageFilterPreferences.class);
        return stored == null ? new EventExploreFilters(false, false, "", "") : stored.filters();
    }

    public void save(String requestedUserId, String pageKey, EventExploreFilters filters) {
        Query query = query(requestedUserId, pageKey);
        if (filters == null) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Filters are required.");
        String mode = filters.mode() == null ? "" : filters.mode().trim();
        String topic = filters.topic() == null ? "" : filters.topic().trim();
        if (!List.of("", "Casual", "Tournament", "Mingle").contains(mode) || topic.length() > 200) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid event filters.");
        }
        mongoTemplate.upsert(query, new Update()
                .set("filters", new EventExploreFilters(filters.friendsOnly(), filters.openSpotsOnly(), topic, mode, filters.followedOnly()))
                .set("updatedAt", Instant.now().toString()), UserPageFilterPreferences.class);
    }

    private Query query(String requestedUserId, String pageKey) {
        if (!"event-explore".equals(pageKey)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unsupported filter page.");
        }
        String userId = profiles.resolveSelectedUserId(requestedUserId);
        if (!StringUtils.hasText(userId)) throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        return Query.query(Criteria.where("_id").is(userId + ":" + pageKey).and("userId").is(userId).and("pageKey").is(pageKey));
    }
}

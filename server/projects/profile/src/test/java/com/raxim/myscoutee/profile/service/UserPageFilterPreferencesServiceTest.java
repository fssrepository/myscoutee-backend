package com.raxim.myscoutee.profile.service;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.web.server.ResponseStatusException;

import com.raxim.myscoutee.profile.data.document.UserPageFilterPreferences;
import com.raxim.myscoutee.profile.data.document.UserPageFilterPreferences.EventExploreFilters;

@ExtendWith(MockitoExtension.class)
class UserPageFilterPreferencesServiceTest {
    @Mock MongoTemplate mongo;
    @Mock HomeUserProfileService profiles;
    UserPageFilterPreferencesService service;

    @BeforeEach void setup() { service = new UserPageFilterPreferencesService(mongo, profiles); }

    @Test void savesOnlyTheResolvedActorsPageAndClearsFiltersExplicitly() {
        when(profiles.resolveSelectedUserId("spoofed")).thenReturn("actual-user");
        service.save("spoofed", "event-explore", new EventExploreFilters(false, false, "", ""));
        verify(mongo).upsert(argThat((Query query) ->
                query.getQueryObject().getString("userId").equals("actual-user")
                && query.getQueryObject().getString("pageKey").equals("event-explore")),
                argThat((Update update) -> update.getUpdateObject().get("$set", org.bson.Document.class)
                        .get("filters").equals(new EventExploreFilters(false, false, "", ""))),
                eq(UserPageFilterPreferences.class));
    }

    @Test void loadsTheStoredFiltersAndUsesNoFiltersForANewUser() {
        when(profiles.resolveSelectedUserId("viewer")).thenReturn("viewer");
        var filters = new EventExploreFilters(true, true, "Music", "Mingle");
        when(mongo.findOne(any(Query.class), eq(UserPageFilterPreferences.class)))
                .thenReturn(new UserPageFilterPreferences("id", "viewer", "event-explore", filters, "now"))
                .thenReturn(null);
        assertThat(service.load("viewer", "event-explore")).isEqualTo(filters);
        assertThat(service.load("viewer", "event-explore")).isEqualTo(new EventExploreFilters(false, false, "", ""));
    }

    @Test void readsPreferencesSavedBeforeFollowingAndPreservesExplicitFollowing() throws Exception {
        var context = new org.springframework.data.mongodb.core.mapping.MongoMappingContext();
        context.afterPropertiesSet();
        var converter = new org.springframework.data.mongodb.core.convert.MappingMongoConverter(
                org.springframework.data.mongodb.core.convert.NoOpDbRefResolver.INSTANCE, context);
        converter.afterPropertiesSet();
        var filters = new org.bson.Document("friendsOnly", true).append("openSpotsOnly", true)
                .append("topic", "Music").append("mode", "Mingle");
        var document = new org.bson.Document("_id", "viewer:event-explore")
                .append("userId", "viewer").append("pageKey", "event-explore").append("filters", filters);
        for (Boolean followed : new Boolean[] { null, false, true }) {
            if (followed != null) filters.put("followedOnly", followed);
            var restored = converter.read(UserPageFilterPreferences.class, document);
            assertThat(restored.filters().followedOnly()).isEqualTo(Boolean.TRUE.equals(followed));
            assertThat(restored.filters().topic()).isEqualTo("Music");
            assertThat(restored.filters().friendsOnly()).isTrue();
            var written = new org.bson.Document();
            converter.write(restored, written);
            assertThat(written.get("filters", org.bson.Document.class).getBoolean("followedOnly"))
                    .isEqualTo(Boolean.TRUE.equals(followed));
        }
    }

    @Test void rejectsUnknownPageAndModeAndUnauthenticatedAccess() {
        assertThatThrownBy(() -> service.load("viewer", "$bad.key"))
                .isInstanceOf(ResponseStatusException.class);
        assertThatThrownBy(() -> service.load("viewer", "event-explore"))
                .isInstanceOf(ResponseStatusException.class);
        when(profiles.resolveSelectedUserId("viewer")).thenReturn("viewer");
        assertThatThrownBy(() -> service.save("viewer", "event-explore", new EventExploreFilters(false, false, "", "invented")))
                .isInstanceOf(ResponseStatusException.class);
        verifyNoInteractions(mongo);
    }
}

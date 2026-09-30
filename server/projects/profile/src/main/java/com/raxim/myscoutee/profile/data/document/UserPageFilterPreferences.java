package com.raxim.myscoutee.profile.data.document;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.CompoundIndex;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "userPageFilterPreferences")
@CompoundIndex(name = "user_page_filter", def = "{'userId': 1, 'pageKey': 1}", unique = true)
public record UserPageFilterPreferences(
        @Id String id, String userId, String pageKey, EventExploreFilters filters, String updatedAt) {
    public record EventExploreFilters(boolean friendsOnly, boolean openSpotsOnly, String topic, String mode, Boolean followedOnly) {
        public EventExploreFilters {
            // Preferences saved before organizer following have no followedOnly field.
            followedOnly = Boolean.TRUE.equals(followedOnly);
        }

        public EventExploreFilters(boolean friendsOnly, boolean openSpotsOnly, String topic, String mode) {
            this(friendsOnly, openSpotsOnly, topic, mode, false);
        }
    }
}

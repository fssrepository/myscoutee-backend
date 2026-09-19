package com.raxim.myscoutee.profile.security;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import org.bson.Document;
import org.junit.jupiter.api.Test;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Query;

class MediaPolicyFactsTest {
    @Test
    void profileStatusControlsImageAccessRegardlessOfProtectedStoragePath() {
        MongoTemplate mongo = mock(MongoTemplate.class);
        FriendshipFacts friendships = mock(FriendshipFacts.class);
        MediaPolicyFacts policy = new MediaPolicyFacts(mongo, friendships, mock(ChatPolicyFacts.class));
        String key = "private/images/owner/owner/upload/large.webp";
        Document profile = new Document("profileStatus", "public");
        when(mongo.findOne(any(Query.class), eq(Document.class), eq("users"))).thenReturn(profile);
        assertThat(policy.canRead("viewer", key)).isTrue();
        profile.put("profileStatus", "private");
        assertThat(policy.canRead("viewer", key)).isFalse();
        assertThat(policy.canRead("owner", key)).isTrue();
        profile.put("profileStatus", "friends only");
        assertThat(policy.canRead("viewer", key)).isFalse();
        when(friendships.pairExists("owner", "viewer")).thenReturn(true);
        assertThat(policy.canRead("viewer", key)).isTrue();
    }

    @Test
    void activePublicEventImageDoesNotRequireLegacyPublishedField() {
        MongoTemplate mongo = mock(MongoTemplate.class);
        MediaPolicyFacts policy = new MediaPolicyFacts(
                mongo,
                mock(FriendshipFacts.class),
                mock(ChatPolicyFacts.class));
        String key = "private/images/owner/event-event-id/upload/large.webp";
        Document event = new Document("creatorUserId", "owner")
                .append("visibility", "Public")
                .append("status", "A")
                .append("imageUrl", "/api/media/private?key=" + key);
        when(mongo.findOne(any(Query.class), eq(Document.class), eq("events"))).thenReturn(event);

        assertThat(policy.canRead("viewer", key)).isTrue();
    }
}

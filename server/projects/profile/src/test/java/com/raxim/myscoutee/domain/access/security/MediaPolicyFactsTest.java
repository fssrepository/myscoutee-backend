package com.raxim.myscoutee.domain.access.security;

import com.raxim.myscoutee.domain.accounts.service.FriendshipFacts;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import org.bson.Document;
import org.junit.jupiter.api.Test;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Query;

@org.junit.jupiter.api.Tag("standard")
class MediaPolicyFactsTest {
    @Test void editorCannotRepublishAnotherAuthorsPrivateImageOrACommunityDocument() {
        var prefix = "/api/media/private?key=";
        assertThat(com.raxim.myscoutee.domain.media.api.MediaAccessPaths.ownedImageReference(prefix + "private%2Fimages%2Fgroup-work-author%2Fdraft%2Fx.webp", "group:work:author")).isTrue();
        assertThat(com.raxim.myscoutee.domain.media.api.MediaAccessPaths.ownedImageReference(prefix + "private/images/other/draft/x.webp", "author")).isFalse();
        assertThat(com.raxim.myscoutee.domain.media.api.MediaAccessPaths.ownedImageReference(prefix + "private/documents/author/draft/x.pdf", "author")).isFalse();
    }
    @Test void serviceImagesRequirePublishedOfferingAndCommunityMembership() {
        var mongo = mock(MongoTemplate.class);
        var policy = campaignAware(new MediaPolicyFacts(new com.raxim.myscoutee.domain.accounts.service.AccountMediaVisibilityService(mongo),
                new com.raxim.myscoutee.domain.groups.service.GroupMediaVisibilityService(mongo),
                new com.raxim.myscoutee.domain.community.service.CommunityMediaVisibilityService(mongo),
                new com.raxim.myscoutee.domain.assets.service.AssetMediaVisibilityService(mongo),
                new com.raxim.myscoutee.domain.events.service.EventMediaVisibilityService(mongo),
                new com.raxim.myscoutee.domain.content.service.ContentMediaVisibilityService(mongo),
                new com.raxim.myscoutee.domain.chat.service.ChatMediaVisibilityService(mongo), mock(FriendshipFacts.class), mock(ChatPolicyFacts.class)), mongo);
        var service = new Document("baseGroupId", "myscoutee-community").append("status", "published");
        when(mongo.findOne(any(Query.class), eq(Document.class), eq("serviceOfferings"))).thenReturn(service);
        when(mongo.findOne(any(Query.class), eq(Document.class), eq("users"))).thenReturn(new Document("accountUserId", "viewer"));
        String key = "private/images/provider/service/upload/large.webp";
        assertThat(policy.canRead("viewer", key)).isFalse();
        when(mongo.findOne(any(Query.class), eq(Document.class), eq("activityMembers"))).thenReturn(new Document("userId", "viewer"));
        assertThat(policy.canRead("viewer", key)).isTrue();
        service.put("status", "draft"); assertThat(policy.canRead("viewer", key)).isFalse();
    }
    @Test void workspaceAuthorCanPreviewAnUnsavedDocumentUsingTheCanonicalStorageOwner() {
        MongoTemplate mongo = mock(MongoTemplate.class);
        var policy = campaignAware(new MediaPolicyFacts(new com.raxim.myscoutee.domain.accounts.service.AccountMediaVisibilityService(mongo),
                new com.raxim.myscoutee.domain.groups.service.GroupMediaVisibilityService(mongo),
                new com.raxim.myscoutee.domain.community.service.CommunityMediaVisibilityService(mongo),
                new com.raxim.myscoutee.domain.assets.service.AssetMediaVisibilityService(mongo),
                new com.raxim.myscoutee.domain.events.service.EventMediaVisibilityService(mongo),
                new com.raxim.myscoutee.domain.content.service.ContentMediaVisibilityService(mongo),
                new com.raxim.myscoutee.domain.chat.service.ChatMediaVisibilityService(mongo), mock(FriendshipFacts.class), mock(ChatPolicyFacts.class)), mongo);
        assertThat(policy.canRead("group:homes:author", "private/documents/group-homes-author/draft/file.pdf")).isTrue();
        verifyNoInteractions(mongo);
    }
    @Test void announcementDocumentsRequireCurrentMembershipAndPublishedOrAdminAccess() {
        MongoTemplate mongo = mock(MongoTemplate.class);
        var policy = campaignAware(new MediaPolicyFacts(new com.raxim.myscoutee.domain.accounts.service.AccountMediaVisibilityService(mongo),
                new com.raxim.myscoutee.domain.groups.service.GroupMediaVisibilityService(mongo),
                new com.raxim.myscoutee.domain.community.service.CommunityMediaVisibilityService(mongo),
                new com.raxim.myscoutee.domain.assets.service.AssetMediaVisibilityService(mongo),
                new com.raxim.myscoutee.domain.events.service.EventMediaVisibilityService(mongo),
                new com.raxim.myscoutee.domain.content.service.ContentMediaVisibilityService(mongo),
                new com.raxim.myscoutee.domain.chat.service.ChatMediaVisibilityService(mongo), mock(FriendshipFacts.class), mock(ChatPolicyFacts.class)), mongo);
        var announcement = new Document("communityId", "homes").append("status", "published");
        when(mongo.findOne(any(Query.class), eq(Document.class), eq("communityAnnouncements"))).thenReturn(announcement);
        var group = new Document("lifecycleStatus", "active");
        when(mongo.findOne(any(Query.class), eq(Document.class), eq("communityGroups"))).thenReturn(group);
        when(mongo.findOne(any(Query.class), eq(Document.class), eq("users"))).thenReturn(new Document("accountUserId", "member"));
        var membership = new Document("role", "Member");
        when(mongo.findOne(any(Query.class), eq(Document.class), eq("activityMembers"))).thenReturn(membership);
        String key = "private/documents/author/vote/file.pdf";
        assertThat(policy.canRead("group:homes:member", key)).isTrue();
        announcement.put("status", "draft");assertThat(policy.canRead("group:homes:member", key)).isFalse();
        membership.put("role", "Admin");assertThat(policy.canRead("group:homes:member", key)).isTrue();
        group.put("lifecycleStatus", "deleted");assertThat(policy.canRead("group:homes:member", key)).isFalse();
    }
    @Test
    void profileStatusControlsImageAccessRegardlessOfProtectedStoragePath() {
        MongoTemplate mongo = mock(MongoTemplate.class);
        FriendshipFacts friendships = mock(FriendshipFacts.class);
        MediaPolicyFacts policy = campaignAware(new MediaPolicyFacts(new com.raxim.myscoutee.domain.accounts.service.AccountMediaVisibilityService(mongo),
                new com.raxim.myscoutee.domain.groups.service.GroupMediaVisibilityService(mongo),
                new com.raxim.myscoutee.domain.community.service.CommunityMediaVisibilityService(mongo),
                new com.raxim.myscoutee.domain.assets.service.AssetMediaVisibilityService(mongo),
                new com.raxim.myscoutee.domain.events.service.EventMediaVisibilityService(mongo),
                new com.raxim.myscoutee.domain.content.service.ContentMediaVisibilityService(mongo),
                new com.raxim.myscoutee.domain.chat.service.ChatMediaVisibilityService(mongo), friendships, mock(ChatPolicyFacts.class)), mongo);
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
        MediaPolicyFacts policy = campaignAware(new MediaPolicyFacts(new com.raxim.myscoutee.domain.accounts.service.AccountMediaVisibilityService(mongo),
                new com.raxim.myscoutee.domain.groups.service.GroupMediaVisibilityService(mongo),
                new com.raxim.myscoutee.domain.community.service.CommunityMediaVisibilityService(mongo),
                new com.raxim.myscoutee.domain.assets.service.AssetMediaVisibilityService(mongo),
                new com.raxim.myscoutee.domain.events.service.EventMediaVisibilityService(mongo),
                new com.raxim.myscoutee.domain.content.service.ContentMediaVisibilityService(mongo),
                new com.raxim.myscoutee.domain.chat.service.ChatMediaVisibilityService(mongo),
                mock(FriendshipFacts.class),
                mock(ChatPolicyFacts.class)), mongo);
        String key = "private/images/owner/event-event-id/upload/large.webp";
        Document event = new Document("creatorUserId", "owner")
                .append("visibility", "Public")
                .append("status", "A")
                .append("imageUrl", "/api/media/private?key=" + key);
        when(mongo.findOne(any(Query.class), eq(Document.class), eq("events"))).thenReturn(event);

        assertThat(policy.canRead("viewer", key)).isTrue();
    }
    @Test void galleryImagesUseTheSameVisibilityRulesAsTheCover() {
        MongoTemplate mongo = mock(MongoTemplate.class);
        MediaPolicyFacts policy = campaignAware(new MediaPolicyFacts(new com.raxim.myscoutee.domain.accounts.service.AccountMediaVisibilityService(mongo),
                new com.raxim.myscoutee.domain.groups.service.GroupMediaVisibilityService(mongo),
                new com.raxim.myscoutee.domain.community.service.CommunityMediaVisibilityService(mongo),
                new com.raxim.myscoutee.domain.assets.service.AssetMediaVisibilityService(mongo),
                new com.raxim.myscoutee.domain.events.service.EventMediaVisibilityService(mongo),
                new com.raxim.myscoutee.domain.content.service.ContentMediaVisibilityService(mongo),
                new com.raxim.myscoutee.domain.chat.service.ChatMediaVisibilityService(mongo), mock(FriendshipFacts.class), mock(ChatPolicyFacts.class)), mongo);
        Document event = new Document("creatorUserId", "owner").append("visibility", "Public").append("status", "A");
        when(mongo.findOne(any(Query.class), eq(Document.class), eq("events"))).thenReturn(event);
        assertThat(policy.canRead("viewer", "private/images/owner/event/second/large.webp")).isTrue();
        var query = org.mockito.ArgumentCaptor.forClass(Query.class);
        verify(mongo).findOne(query.capture(), eq(Document.class), eq("events"));
        assertThat(query.getValue().getQueryObject().toJson()).contains("imageUrls");
        event.put("visibility", "Invitation only");
        assertThat(policy.canRead("viewer", "private/images/owner/event/second/large.webp")).isFalse();
        event.put("invitedMemberUserIds", java.util.List.of("viewer"));
        assertThat(policy.canRead("viewer", "private/images/owner/event/second/large.webp")).isTrue();
    }


    private static MediaPolicyFacts campaignAware(MediaPolicyFacts service, org.springframework.data.mongodb.core.MongoTemplate mongo) {
        org.springframework.test.util.ReflectionTestUtils.setField(service, "campaignCatalog",
                new com.raxim.myscoutee.domain.campaigns.service.CampaignCatalogService(mongo));
        return service;
    }
}

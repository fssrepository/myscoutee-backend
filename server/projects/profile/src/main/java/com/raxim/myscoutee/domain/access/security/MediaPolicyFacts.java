package com.raxim.myscoutee.domain.access.security;

import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import org.bson.Document;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriUtils;
import com.raxim.myscoutee.domain.media.service.MediaAccessPaths;

/** Current resource visibility; only small indexed metadata reads, never event graph reconstruction. */
@Component
public class MediaPolicyFacts {
    @org.springframework.beans.factory.annotation.Autowired
    @org.springframework.context.annotation.Lazy
    private com.raxim.myscoutee.domain.administration.service.AdminMenuCounterService adminCounters;
    private final MongoTemplate mongo;
    private final FriendshipFacts friendships;
    private final ChatPolicyFacts chats;

    public MediaPolicyFacts(MongoTemplate mongo, FriendshipFacts friendships, ChatPolicyFacts chats) {
        this.mongo = mongo;
        this.friendships = friendships;
        this.chats = chats;
    }

    public boolean canRead(String viewer, String key) {
        if (viewer == null || viewer.isBlank() || !MediaAccessPaths.validKey(key)) return false;
        if (MediaAccessPaths.isPublicKey(key)) return true;
        String[] parts = key.split("/");
        int offset = "private".equals(parts[0]) ? 1 : 0;
        if (parts.length < offset + 4 || !List.of("images", "audio", "documents").contains(parts[offset])) return false;
        String owner = parts[offset + 1];
        String entity = parts[offset + 2];
        if (MediaAccessPaths.storageSegment(viewer).equals(owner)) return true; // Upload preview, including unsaved own drafts.
        List<String> urls = variantUrls(key, "images".equals(parts[offset]));
        if ("images".equals(parts[offset]) && (owner.equals(entity) || "profile-onboarding".equals(entity))) {
            Document profile = find("users", Criteria.where("userId").is(owner), "profileStatus", "images");
            return profile != null && profile.getString("profileStatus") != null
                    && !profile.getString("profileStatus").isBlank() && visible(profile.getString("profileStatus"), owner, viewer);
        }
        Document announcement = find("communityAnnouncements", Criteria.where("attachments.url").in(urls), "communityId", "status");
        if (announcement != null) {
            var group = find("communityGroups", Criteria.where("_id").is(announcement.getString("communityId")), "lifecycleStatus");
            if (group == null || List.of("deleted", "under-review").contains(group.getString("lifecycleStatus") == null ? "" : group.getString("lifecycleStatus"))) return false;
            var profile = find("users", Criteria.where("userId").is(viewer), "accountUserId");
            String account = profile == null || profile.getString("accountUserId") == null ? viewer : profile.getString("accountUserId");
            var membership = find("activityMembers", Criteria.where("ownerType").is("community").and("ownerId").is(announcement.getString("communityId"))
                    .and("userId").is(account).and("status").is("accepted"), "role");
            return membership != null && ("published".equals(announcement.getString("status")) || "Admin".equals(membership.getString("role")));
        }
        Document campaign = find("campaigns", new Criteria().orOperator(Criteria.where("imageUrls").in(urls), Criteria.where("attachments.url").in(urls)), "workspaceGroupId", "status");
        if (campaign != null) {
            var profile = find("users", Criteria.where("userId").is(viewer), "workspaceGroupId");
            return "published".equals(campaign.getString("status")) && profile != null
                    && java.util.Objects.equals(profile.getString("workspaceGroupId"), campaign.getString("workspaceGroupId"));
        }
        Document service = find("serviceOfferings", Criteria.where("imageUrls").in(urls), "baseGroupId", "status");
        if (service != null) {
            var profile = find("users", Criteria.where("userId").is(viewer), "workspaceGroupId", "accountUserId");
            if (!"published".equals(service.getString("status")) || profile == null) return false;
            String account = profile.getString("accountUserId") == null ? viewer : profile.getString("accountUserId");
            return find("activityMembers", Criteria.where("ownerType").is("community").and("ownerId").is(service.getString("baseGroupId"))
                    .and("userId").is(account).and("status").is("accepted"), "userId") != null;
        }
        Document asset = find("assets", Criteria.where("imageUrl").in(urls), "ownerUserId", "visibility", "status", "moderationStatus");
        if (asset != null) return canModerate(viewer, asset) || active(asset) && visible(asset.getString("visibility"), asset.getString("ownerUserId"), viewer);
        Document event = find("events", new Criteria().orOperator(Criteria.where("imageUrl").in(urls), Criteria.where("imageUrls").in(urls)), "creatorUserId", "organizerUserId", "admins",
                "moderationStatus", "visibility", "status", "published", "acceptedMemberUserIds", "invitedMemberUserIds", "pendingRequestMemberUserIds");
        if (event != null) {
            if (canModerate(viewer, event)) return true;
            if (viewer.equals(event.getString("creatorUserId")) || viewer.equals(event.getString("organizerUserId"))
                    || contains(event, "admins", viewer) || contains(event, "acceptedMemberUserIds", viewer)
                    || contains(event, "invitedMemberUserIds", viewer) || contains(event, "pendingRequestMemberUserIds", viewer)) return true;
            // Event publication is represented by the canonical lifecycle status. The
            // legacy `published` field is no longer stored on newly created events.
            return active(event)
                    && visible(event.getString("visibility"), event.getString("creatorUserId"), viewer);
        }
        Document feed = find("photoFeedPosts", Criteria.where("imageUrls").in(urls).and("deleted").ne(true), "moderationStatus");
        if (feed != null && ("accepted".equals(feed.getString("moderationStatus")) || canModerate(viewer, feed))) return true;
        Query messageQuery = Query.query(new Criteria().orOperator(
                Criteria.where("attachments.url").in(urls), Criteria.where("attachments.previewUrl").in(urls)));
        messageQuery.fields().include("chatId").include("deletedAtIso");
        // The same attachment can be forwarded to several chats; any currently accessible chat suffices.
        for (Document message : mongo.find(messageQuery, Document.class, "chatMessages")) {
            if ((message.getString("deletedAtIso") == null || message.getString("deletedAtIso").isBlank())
                    && chats.canAccessChat(message.getString("chatId"), viewer)) return true;
        }
        return false;
    }

    private boolean canModerate(String viewer, Document resource) {
        if (adminCounters == null || resource.getString("moderationStatus") == null) return false;
        var user = mongo.findOne(Query.query(Criteria.where("userId").is(viewer)), com.raxim.myscoutee.domain.accounts.document.Users.class);
        return adminCounters.isAdminUser(user);
    }

    private Document find(String collection, Criteria criteria, String... fields) {
        Query query = Query.query(criteria);
        for (String field : fields) query.fields().include(field);
        return mongo.findOne(query, Document.class, collection);
    }

    private boolean visible(String visibility, String owner, String viewer) {
        if (viewer.equals(owner)) return true;
        String value = visibility == null ? "" : visibility.trim().toLowerCase(Locale.ROOT);
        return switch (value) {
            case "", "public" -> true;
            case "friends only" -> friendships.pairExists(owner, viewer);
            default -> false;
        };
    }

    private boolean active(Document record) {
        return "A".equals(record.getString("status")) || "active".equals(record.getString("status"));
    }

    private boolean contains(Document record, String field, String viewer) {
        return record.get(field) instanceof List<?> values && values.contains(viewer);
    }

    private List<String> variantUrls(String key, boolean image) {
        List<String> keys = new ArrayList<>(List.of(key));
        if (image) {
            String group = key.substring(0, key.lastIndexOf('/') + 1);
            for (String name : List.of("original", "small.webp", "medium.webp", "large.webp")) keys.add(group + name);
        }
        List<String> urls = new ArrayList<>();
        for (String value : keys) {
            String encoded = UriUtils.encodeQueryParam(value, StandardCharsets.UTF_8);
            for (String prefix : List.of("/api/media/private?key=", "/media/private?key=", "/media/public?key=", "/api/media/public?key=")) {
                urls.add(prefix + encoded);
            }
        }
        return urls;
    }
}

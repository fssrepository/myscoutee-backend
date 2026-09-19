package com.raxim.myscoutee.profile.security;

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
import com.raxim.myscoutee.profile.service.media.MediaAccessPaths;

/** Current resource visibility; only small indexed metadata reads, never event graph reconstruction. */
@Component
public class MediaPolicyFacts {
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
        if (parts.length < offset + 4 || !List.of("images", "audio").contains(parts[offset])) return false;
        String owner = parts[offset + 1];
        String entity = parts[offset + 2];
        if (viewer.equals(owner)) return true; // Upload preview, including unsaved own drafts.
        List<String> urls = variantUrls(key, "images".equals(parts[offset]));
        if ("images".equals(parts[offset]) && (owner.equals(entity) || "profile-onboarding".equals(entity))) {
            Document profile = find("users", Criteria.where("userId").is(owner), "profileStatus", "images");
            return profile != null && profile.getString("profileStatus") != null
                    && !profile.getString("profileStatus").isBlank() && visible(profile.getString("profileStatus"), owner, viewer);
        }
        Document asset = find("assets", Criteria.where("imageUrl").in(urls), "ownerUserId", "visibility", "status");
        if (asset != null) return active(asset) && visible(asset.getString("visibility"), asset.getString("ownerUserId"), viewer);
        Document event = find("events", Criteria.where("imageUrl").in(urls), "creatorUserId", "organizerUserId", "admins",
                "visibility", "status", "published", "acceptedMemberUserIds", "invitedMemberUserIds", "pendingRequestMemberUserIds");
        if (event != null) {
            if (viewer.equals(event.getString("creatorUserId")) || viewer.equals(event.getString("organizerUserId"))
                    || contains(event, "admins", viewer) || contains(event, "acceptedMemberUserIds", viewer)
                    || contains(event, "invitedMemberUserIds", viewer) || contains(event, "pendingRequestMemberUserIds", viewer)) return true;
            // Event publication is represented by the canonical lifecycle status. The
            // legacy `published` field is no longer stored on newly created events.
            return active(event)
                    && visible(event.getString("visibility"), event.getString("creatorUserId"), viewer);
        }
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

package com.raxim.myscoutee.domain.access.security;

import com.raxim.myscoutee.domain.accounts.api.FriendshipReads;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriUtils;
import com.raxim.myscoutee.domain.media.api.MediaAccessPaths;

/** Current resource visibility; only small indexed metadata reads, never event graph reconstruction. */
@Component
public class MediaPolicyFacts {
    @org.springframework.beans.factory.annotation.Autowired
    private com.raxim.myscoutee.domain.campaigns.api.CampaignMediaVisibility campaignCatalog;
    @org.springframework.beans.factory.annotation.Autowired
    @org.springframework.context.annotation.Lazy
    private com.raxim.myscoutee.domain.administration.api.AdministratorClassification adminCounters;
    private final com.raxim.myscoutee.domain.accounts.api.AccountMediaVisibility accounts;
    private final com.raxim.myscoutee.domain.groups.api.GroupMediaVisibility groups;
    private final com.raxim.myscoutee.domain.community.api.CommunityMediaVisibility community;
    private final com.raxim.myscoutee.domain.assets.api.AssetMediaVisibility assets;
    private final com.raxim.myscoutee.domain.events.api.EventMediaVisibility events;
    private final com.raxim.myscoutee.domain.content.api.ContentMediaVisibility content;
    private final com.raxim.myscoutee.domain.chat.api.ChatMediaVisibility chat;
    private final FriendshipReads friendships;
    private final ChatPolicyFacts chats;

    public MediaPolicyFacts(
            com.raxim.myscoutee.domain.accounts.api.AccountMediaVisibility accounts,
            com.raxim.myscoutee.domain.groups.api.GroupMediaVisibility groups,
            com.raxim.myscoutee.domain.community.api.CommunityMediaVisibility community,
            com.raxim.myscoutee.domain.assets.api.AssetMediaVisibility assets,
            com.raxim.myscoutee.domain.events.api.EventMediaVisibility events,
            com.raxim.myscoutee.domain.content.api.ContentMediaVisibility content,
            com.raxim.myscoutee.domain.chat.api.ChatMediaVisibility chat,
            FriendshipReads friendships, ChatPolicyFacts chats) {
        this.accounts = accounts;
        this.groups = groups;
        this.community = community;
        this.assets = assets;
        this.events = events;
        this.content = content;
        this.chat = chat;
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
            var profile = accounts.profile(owner);
            return profile != null && profile.profileStatus() != null
                    && !profile.profileStatus().isBlank() && visible(profile.profileStatus(), owner, viewer);
        }
        var announcement = community.announcement(urls);
        if (announcement != null) {
            var group = groups.group(announcement.communityId());
            if (group == null || List.of("deleted", "under-review").contains(group.lifecycleStatus() == null ? "" : group.lifecycleStatus())) return false;
            var profile = accounts.profile(viewer);
            String account = profile == null || profile.accountUserId() == null ? viewer : profile.accountUserId();
            var membership = events.acceptedCommunityMember(announcement.communityId(), account);
            return membership != null && ("published".equals(announcement.status()) || "Admin".equals(membership.role()));
        }
        var campaign = campaignCatalog.mediaReference(urls);
        if (campaign != null) {
            var profile = accounts.profile(viewer);
            return "published".equals(campaign.status()) && profile != null
                    && java.util.Objects.equals(profile.workspaceGroupId(), campaign.workspaceGroupId());
        }
        var service = community.offering(urls);
        if (service != null) {
            var profile = accounts.profile(viewer);
            if (!"published".equals(service.status()) || profile == null) return false;
            String account = profile.accountUserId() == null ? viewer : profile.accountUserId();
            return events.acceptedCommunityMember(service.baseGroupId(), account) != null;
        }
        var asset = assets.asset(urls);
        if (asset != null) return canModerate(viewer, asset.moderationStatus()) || active(asset.status()) && visible(asset.visibility(), asset.ownerUserId(), viewer);
        var event = events.event(urls);
        if (event != null) {
            if (canModerate(viewer, event.moderationStatus())) return true;
            if (viewer.equals(event.creatorUserId()) || viewer.equals(event.organizerUserId())
                    || contains(event.admins(), viewer) || contains(event.acceptedMemberUserIds(), viewer)
                    || contains(event.invitedMemberUserIds(), viewer) || contains(event.pendingRequestMemberUserIds(), viewer)) return true;
            // Event publication is represented by the canonical lifecycle status. The
            // legacy `published` field is no longer stored on newly created events.
            return active(event.status())
                    && visible(event.visibility(), event.creatorUserId(), viewer);
        }
        var feed = content.feedPost(urls);
        if (feed != null && ("accepted".equals(feed.moderationStatus()) || canModerate(viewer, feed.moderationStatus()))) return true;
        // A forwarded attachment is readable when any current chat grants access.
        for (var message : chat.messages(urls)) {
            if ((message.deletedAtIso() == null || message.deletedAtIso().isBlank())
                    && chats.canAccessChat(message.chatId(), viewer)) return true;
        }
        return false;
    }

    private boolean canModerate(String viewer, String moderationStatus) {
        if (adminCounters == null || moderationStatus == null) return false;
        return adminCounters.isAdminUser(accounts.administratorCandidate(viewer));
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

    private boolean active(String status) {
        return "A".equals(status) || "active".equals(status);
    }

    private boolean contains(List<?> values, String viewer) {
        return values != null && values.contains(viewer);
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

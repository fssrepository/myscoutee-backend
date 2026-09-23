package com.raxim.myscoutee.profile.service.mapper;

import com.raxim.myscoutee.profile.data.document.PhotoFeedPost;
import com.raxim.myscoutee.profile.data.dto.feed.PhotoFeedDtos.Post;

public final class PhotoFeedMapper {
    private PhotoFeedMapper() {}
    public static Post toDto(PhotoFeedPost post, double distanceKm) {
        return toDto(post, distanceKm, post.moderationStatus());
    }
    public static Post toDto(PhotoFeedPost post, double distanceKm, String moderationStatus) {
        return toDto(post, distanceKm, moderationStatus, null);
    }
    public static Post toDto(PhotoFeedPost post, double distanceKm, String moderationStatus,
            com.raxim.myscoutee.profile.data.document.Users.FeedCountersRecord counters) {
        return new Post(post.id(), post.creatorUserId(), post.creatorName(), post.creatorAvatarUrl(),
                post.createdAtIso(), post.imageUrls(), post.imageDetails(), distanceKm, moderationStatus, counters);
    }
}

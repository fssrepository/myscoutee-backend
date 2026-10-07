package com.raxim.myscoutee.domain.content.mapper;

import com.raxim.myscoutee.domain.content.document.PhotoFeedPost;
import com.raxim.myscoutee.domain.content.dto.PhotoFeedDtos.Post;

public final class PhotoFeedMapper {
    private PhotoFeedMapper() {}
    public static Post toDto(PhotoFeedPost post, double distanceKm) {
        return toDto(post, distanceKm, post.moderationStatus());
    }
    public static Post toDto(PhotoFeedPost post, double distanceKm, String moderationStatus) {
        return toDto(post, distanceKm, moderationStatus, null);
    }
    public static Post toDto(PhotoFeedPost post, double distanceKm, String moderationStatus,
            com.raxim.myscoutee.domain.accounts.document.Users.FeedCountersRecord counters) {
        return new Post(post.id(), post.creatorUserId(), post.creatorName(), post.creatorAvatarUrl(),
                post.createdAtIso(), post.imageUrls(), post.imageDetails(), distanceKm, moderationStatus, counters);
    }
}

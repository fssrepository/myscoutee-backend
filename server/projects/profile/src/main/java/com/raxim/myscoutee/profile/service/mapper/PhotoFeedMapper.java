package com.raxim.myscoutee.profile.service.mapper;

import com.raxim.myscoutee.profile.data.document.PhotoFeedPost;
import com.raxim.myscoutee.profile.data.dto.feed.PhotoFeedDtos.Post;

public final class PhotoFeedMapper {
    private PhotoFeedMapper() {}
    public static Post toDto(PhotoFeedPost post, double distanceKm) {
        return new Post(post.id(), post.creatorUserId(), post.creatorName(), post.creatorAvatarUrl(),
                post.createdAtIso(), post.imageUrls(), post.imageDetails(), distanceKm, post.moderationStatus());
    }
}

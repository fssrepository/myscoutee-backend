package com.raxim.myscoutee.profile.data.dto.feed;

import java.util.List;
import java.util.Map;
import com.raxim.myscoutee.profile.data.dto.media.MediaDtos.ImageDetailsDto;

public final class PhotoFeedDtos {
    private PhotoFeedDtos() {}
    public record Create(String userId, String id, List<String> imageUrls, Map<String, ImageDetailsDto> imageDetails) {}
    public record Post(String id, String creatorUserId, String creatorName, String creatorAvatarUrl,
            String createdAtIso, List<String> imageUrls, Map<String, ImageDetailsDto> imageDetails, double distanceKm, String moderationStatus) {}
    public record Page(List<Post> items, long total, String nextCursor) {}
    public record Cursor(int bucket, String createdAtIso, String id) {}
}

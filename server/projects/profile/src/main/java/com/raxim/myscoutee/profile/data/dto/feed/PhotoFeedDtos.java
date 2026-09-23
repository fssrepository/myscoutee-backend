package com.raxim.myscoutee.profile.data.dto.feed;

import java.util.List;
import java.util.Map;
import com.raxim.myscoutee.profile.data.dto.media.MediaDtos.ImageDetailsDto;
import com.raxim.myscoutee.profile.data.dto.media.MediaDtos.ImageEventReference;
import com.raxim.myscoutee.profile.data.document.Users.FeedCountersRecord;

public final class PhotoFeedDtos {
    private PhotoFeedDtos() {}
    public record Create(String userId, String id, List<String> imageUrls, Map<String, ImageDetailsDto> imageDetails) {}
    public record Post(String id, String creatorUserId, String creatorName, String creatorAvatarUrl,
            String createdAtIso, List<String> imageUrls, Map<String, ImageDetailsDto> imageDetails, double distanceKm,
            String moderationStatus, FeedCountersRecord feedCounters) {}
    public record Page(List<Post> items, long total, String nextCursor, FeedCountersRecord context) {}
    public record PageSync(String userId, int pageSize, String cursor, String status, List<String> seenPostIds) {}
    public record Cursor(int bucket, String createdAtIso, String id) {}
    public record EventOption(ImageEventReference event, String imageUrl, String startAtIso) {}
    public record EventPage(List<EventOption> items, long total, String nextCursor) {}
}

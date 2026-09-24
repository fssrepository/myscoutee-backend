package com.raxim.myscoutee.profile.data.document;

import java.util.List;
import java.util.Map;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.geo.GeoJsonPoint;
import com.raxim.myscoutee.profile.data.dto.media.MediaDtos.ImageDetailsDto;

@Document("photoFeedPosts")
public record PhotoFeedPost(@Id String id, String creatorUserId, String creatorName,
        String creatorAvatarUrl, String createdAtIso, List<String> imageUrls,
        Map<String, ImageDetailsDto> imageDetails, GeoJsonPoint locationGeo, String moderationStatus, String workspaceGroupId) {
    public PhotoFeedPost(String id, String creatorUserId, String creatorName, String creatorAvatarUrl, String createdAtIso,
            List<String> imageUrls, Map<String, ImageDetailsDto> imageDetails, GeoJsonPoint locationGeo, String moderationStatus) {
        this(id, creatorUserId, creatorName, creatorAvatarUrl, createdAtIso, imageUrls, imageDetails, locationGeo, moderationStatus, null);
    }
    public PhotoFeedPost(String id, String creatorUserId, String creatorName, String creatorAvatarUrl, String createdAtIso,
            List<String> imageUrls, Map<String, ImageDetailsDto> imageDetails, GeoJsonPoint locationGeo) {
        this(id, creatorUserId, creatorName, creatorAvatarUrl, createdAtIso, imageUrls, imageDetails, locationGeo, "under-review", null);
    }
}

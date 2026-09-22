package com.raxim.myscoutee.profile.service;

import java.net.URI;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.data.mongodb.core.geo.GeoJsonPoint;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import com.raxim.myscoutee.profile.data.document.PhotoFeedPost;
import com.raxim.myscoutee.profile.data.document.Users;
import com.raxim.myscoutee.profile.data.dto.feed.PhotoFeedDtos.*;
import com.raxim.myscoutee.profile.repository.PhotoFeedRepository;
import com.raxim.myscoutee.profile.service.mapper.PhotoFeedMapper;
import com.raxim.myscoutee.profile.service.media.MediaAccessPaths;
import static com.raxim.myscoutee.profile.data.dto.media.MediaDtos.normalizeImageDetails;

@Service
public class PhotoFeedService {
    @org.springframework.beans.factory.annotation.Autowired
    @org.springframework.context.annotation.Lazy
    private ContentModerationService contentModeration;
    private final PhotoFeedRepository posts;
    public PhotoFeedService(PhotoFeedRepository posts) { this.posts = posts; }
    public Post create(Users actor, Create request) {
        try { UUID.fromString(request.id()); } catch (RuntimeException ex) { throw badRequest(); }
        var coordinates = coordinates(actor);
        var existing = posts.find(request.id());
        if (existing != null) {
            Post result = ownExisting(actor, existing);
            register(existing); return result;
        }
        List<String> images = request.imageUrls();
        if (images == null || images.isEmpty() || images.size() > 5 || images.stream().distinct().count() != images.size()) throw badRequest();
        for (String image : images) validateImage(image, actor.getUserId());
        var details = normalizeImageDetails(request.imageDetails(), images);
        var avatar = actor.getImages() == null || actor.getImages().isEmpty() ? "" : actor.getImages().getFirst();
        var post = new PhotoFeedPost(request.id(), actor.getUserId(), actor.getName(), avatar, Instant.now().toString(),
                List.copyOf(images), details, new GeoJsonPoint(coordinates.longitude(), coordinates.latitude()));
        try { var saved = posts.insert(post); register(saved); return PhotoFeedMapper.toDto(saved, 0); }
        catch (DuplicateKeyException ex) { return ownExisting(actor, posts.find(request.id())); }
    }
    private void register(PhotoFeedPost post) {
        if (contentModeration != null) contentModeration.register("feed", post.id(), post.creatorUserId(),
                post.imageDetails().getOrDefault(post.imageUrls().getFirst(), new com.raxim.myscoutee.profile.data.dto.media.MediaDtos.ImageDetailsDto("", "")).caption(), post.imageUrls().getFirst());
    }
    private Post ownExisting(Users actor, PhotoFeedPost post) {
        if (post == null || !actor.getUserId().equals(post.creatorUserId())) throw new ResponseStatusException(HttpStatus.CONFLICT);
        return PhotoFeedMapper.toDto(post, 0);
    }
    public Page page(Users actor, int pageSize, String cursorValue) {
        var coordinates = coordinates(actor);
        int limit = Math.max(1, Math.min(50, pageSize));
        Cursor cursor = parseCursor(cursorValue);
        var located = posts.page(actor.getUserId(), coordinates.latitude(), coordinates.longitude(), cursor, limit + 1);
        var page = located.stream().limit(limit).map(p -> PhotoFeedMapper.toDto(p.post(), p.distanceKm())).toList();
        String next = null;
        if (located.size() > limit && !page.isEmpty()) {
            var last = page.getLast();
            next = ((int) Math.floor(last.distanceKm() / 5)) + "|" + last.createdAtIso() + "|" + last.id();
        }
        return new Page(page, posts.count(actor.getUserId()), next);
    }
    static Cursor parseCursor(String value) {
        if (value == null || value.isBlank()) return null;
        try {
            String[] parts = value.split("\\|", -1);
            if (parts.length != 3) throw badRequest();
            int bucket = Integer.parseInt(parts[0]);
            if (bucket < 0 || bucket > 5000) throw badRequest();
            Instant.parse(parts[1]); UUID.fromString(parts[2]);
            return new Cursor(bucket, parts[1], parts[2]);
        } catch (RuntimeException ex) { throw badRequest(); }
    }
    static Users.LocationCoordinatesRecord coordinates(Users actor) {
        var point = actor.getLocationCoordinates();
        if (point == null || point.latitude() == null || point.longitude() == null
                || !Double.isFinite(point.latitude()) || !Double.isFinite(point.longitude())
                || Math.abs(point.latitude()) > 90 || Math.abs(point.longitude()) > 180)
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "feed.locationRequired");
        return point;
    }
    static void validateImage(String value, String owner) {
        // Publishing must not expose another user's private upload through the public feed.
        try {
            URI uri = URI.create(value);
            if (uri.isAbsolute() || !List.of("/api/media/private", "/media/private", "/api/media/public", "/media/public").contains(uri.getPath())) throw badRequest();
            String query = uri.getRawQuery();
            if (query == null || !query.startsWith("key=")) throw badRequest();
            String key = URLDecoder.decode(query.substring(4), StandardCharsets.UTF_8);
            if (!MediaAccessPaths.validKey(key) || (!MediaAccessPaths.isPublicKey(key)
                    && !key.startsWith("images/" + owner + "/") && !key.startsWith("private/images/" + owner + "/"))) throw badRequest();
        } catch (RuntimeException ex) { throw badRequest(); }
    }
    private static ResponseStatusException badRequest() { return new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid photo feed request."); }
}

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
    @org.springframework.beans.factory.annotation.Autowired
    @org.springframework.context.annotation.Lazy
    private ActivitiesEventsService events;
    private final PhotoFeedRepository posts;
    public PhotoFeedService(PhotoFeedRepository posts) { this.posts = posts; }
    public Post create(Users actor, Create request) {
        try { UUID.fromString(request.id()); } catch (RuntimeException ex) { throw badRequest(); }
        var coordinates = coordinates(actor);
        var existing = posts.find(request.id());
        if (existing != null) {
            return ownExisting(actor, existing);
        }
        List<String> images = request.imageUrls();
        if (images == null || images.isEmpty() || images.size() > 5 || images.stream().distinct().count() != images.size()) throw badRequest();
        for (String image : images) validateImage(image, actor.getUserId());
        var details = normalizeImageDetails(request.imageDetails(), images);
        var options = events.queryFeedEventOptions(actor.getUserId()).stream()
                .collect(java.util.stream.Collectors.toMap(option -> option.event().id(), EventOption::event));
        for (String image : images) {
            var detail = details.get(image);
            var linked = detail == null || detail.event() == null ? null : options.get(detail.event().id());
            if (linked == null) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "feed.eventRequired");
            // Never trust a supplied organizer or location: the event is authoritative.
            details.put(image, new com.raxim.myscoutee.profile.data.dto.media.MediaDtos.ImageDetailsDto(
                    linked.location(), detail.caption(), linked));
        }
        var avatar = actor.getImages() == null || actor.getImages().isEmpty() ? "" : actor.getImages().getFirst();
        var post = new PhotoFeedPost(request.id(), actor.getUserId(), actor.getName(), avatar, Instant.now().toString(),
                List.copyOf(images), details, new GeoJsonPoint(coordinates.longitude(), coordinates.latitude()), "under-review", actor.getWorkspaceGroupId());
        try { return ownExisting(actor, posts.insert(post)); }
        catch (DuplicateKeyException ex) { return ownExisting(actor, posts.find(request.id())); }
    }
    private String register(PhotoFeedPost post) {
        if (contentModeration != null) return contentModeration.register("feed", post.id(), post.creatorUserId(),
                post.imageDetails().getOrDefault(post.imageUrls().getFirst(), new com.raxim.myscoutee.profile.data.dto.media.MediaDtos.ImageDetailsDto("", "")).caption(), post.imageUrls().getFirst()).status();
        return post.moderationStatus();
    }
    private Post ownExisting(Users actor, PhotoFeedPost post) {
        if (post == null || !actor.getUserId().equals(post.creatorUserId())) throw new ResponseStatusException(HttpStatus.CONFLICT);
        String status = register(post);
        return PhotoFeedMapper.toDto(post, 0, status, posts.counters(actor.getUserId()));
    }
    public Users.FeedCountersRecord remove(Users actor, String id) {
        var post = posts.find(id);
        if (post == null) throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        if (!actor.getUserId().equals(post.creatorUserId())) throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        contentModeration.removeFeed(id, actor.getUserId());
        return posts.counters(actor.getUserId());
    }
    public Page page(Users actor, int pageSize, String cursorValue) {
        return page(actor, pageSize, cursorValue, "public");
    }
    public Page page(Users actor, int pageSize, String cursorValue, String status) {
        if (!List.of("public", "seen", "accepted", "under-review", "rejected", "blocked").contains(status)) throw badRequest();
        var coordinates = coordinates(actor);
        int limit = Math.max(1, Math.min(50, pageSize));
        Cursor cursor = parseCursor(cursorValue);
        var located = posts.page(actor.getUserId(), status, coordinates.latitude(), coordinates.longitude(), cursor, limit + 1);
        var page = located.stream().limit(limit).map(p -> PhotoFeedMapper.toDto(p.post(), p.distanceKm())).toList();
        String next = null;
        if (located.size() > limit && !page.isEmpty()) {
            var last = page.getLast();
            next = ((int) Math.floor(last.distanceKm() / 5)) + "|" + last.createdAtIso() + "|" + last.id();
        }
        var counts = posts.counters(actor.getUserId());
        long total = List.of("public", "seen").contains(status) ? posts.count(actor.getUserId(), status) : counts.counts().getOrDefault(status, 0L);
        return new Page(page, total, next, counts);
    }
    public List<String> seen(Users actor, List<String> ids) {
        return saveSeen(actor, ids, 50);
    }
    public Page syncPage(Users actor, PageSync request) {
        // Validate the read before writing. Opening Public feed can acknowledge
        // its retained outbox and obtain the already-filtered first page at once.
        if (!"public".equals(request.status())) throw badRequest();
        coordinates(actor);
        parseCursor(request.cursor());
        saveSeen(actor, request.seenPostIds(), 5000);
        return page(actor, request.pageSize(), request.cursor(), request.status());
    }
    private List<String> saveSeen(Users actor, List<String> ids, int limit) {
        if (ids == null || ids.isEmpty() || ids.size() > limit) throw badRequest();
        for (String id : ids) try { UUID.fromString(id); } catch (RuntimeException ex) { throw badRequest(); }
        var unique = ids.stream().distinct().toList();
        posts.markSeen(actor.getUserId(), unique);
        // Inaccessible/removed posts are terminal too; do not retain an impossible outbox retry.
        return unique;
    }
    public EventPage eventPage(Users actor, int pageSize, String cursor) {
        var options = events.queryFeedEventOptions(actor.getUserId());
        int start = 0;
        if (cursor != null && !cursor.isBlank()) {
            start = java.util.stream.IntStream.range(0, options.size())
                    .filter(index -> options.get(index).event().id().equals(cursor)).findFirst()
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid event cursor.")) + 1;
        }
        int end = Math.min(options.size(), start + Math.max(1, Math.min(50, pageSize)));
        var page = options.subList(start, end);
        return new EventPage(page, options.size(), end < options.size() ? page.getLast().event().id() : null);
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

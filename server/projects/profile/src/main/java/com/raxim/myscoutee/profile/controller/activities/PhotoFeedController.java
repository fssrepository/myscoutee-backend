package com.raxim.myscoutee.profile.controller.activities;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import com.raxim.myscoutee.profile.data.document.Users;
import com.raxim.myscoutee.profile.data.dto.feed.PhotoFeedDtos.*;
import com.raxim.myscoutee.profile.service.HomeUserProfileService;
import com.raxim.myscoutee.profile.service.PhotoFeedService;

@RestController
@RequestMapping("/activities/feed")
public class PhotoFeedController {
    private final HomeUserProfileService profiles;
    private final PhotoFeedService feed;
    public PhotoFeedController(HomeUserProfileService profiles, PhotoFeedService feed) { this.profiles = profiles; this.feed = feed; }
    private Users actor(String id) {
        var user = profiles.resolveCurrentUser(id);
        if (user == null) throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        return user;
    }
    @GetMapping
    public Page page(@RequestParam String userId, @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(required = false) String cursor, @RequestParam(defaultValue = "public") String status) {
        return feed.page(actor(userId), pageSize, cursor, status);
    }
    @PostMapping
    public Post create(@RequestBody Create request) { return feed.create(actor(request.userId()), request); }
    @DeleteMapping("/{id}")
    public Users.FeedCountersRecord remove(@PathVariable String id, @RequestParam String userId) {
        return feed.remove(actor(userId), id);
    }
    public record SeenRequest(String userId, java.util.List<String> postIds) {}
    @PostMapping("/seen")
    public java.util.List<String> seen(@RequestBody SeenRequest request) {
        return feed.seen(actor(request.userId()), request.postIds());
    }
    @GetMapping("/events")
    public EventPage events(@RequestParam String userId, @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(required = false) String cursor) { return feed.eventPage(actor(userId), pageSize, cursor); }
}

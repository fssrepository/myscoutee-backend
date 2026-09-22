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
            @RequestParam(required = false) String cursor) { return feed.page(actor(userId), pageSize, cursor); }
    @PostMapping
    public Post create(@RequestBody Create request) { return feed.create(actor(request.userId()), request); }
}

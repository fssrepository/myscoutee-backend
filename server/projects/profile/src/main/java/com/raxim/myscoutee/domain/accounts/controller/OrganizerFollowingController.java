package com.raxim.myscoutee.domain.accounts.controller;

import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import com.raxim.myscoutee.domain.accounts.document.Users;
import com.raxim.myscoutee.domain.accounts.service.HomeUserProfileService;
import com.raxim.myscoutee.domain.accounts.service.OrganizerFollowingService;

@RestController
@RequestMapping("/activities/events/following")
public class OrganizerFollowingController {
    private final HomeUserProfileService profiles;
    private final OrganizerFollowingService following;
    public OrganizerFollowingController(HomeUserProfileService profiles, OrganizerFollowingService following) {
        this.profiles = profiles;
        this.following = following;
    }
    private Users actor(String requestedId) {
        Users user = profiles.resolveCurrentUser(requestedId);
        if (user == null) throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        return user;
    }
    @PostMapping
    public OrganizerFollowingService.FollowingChangeResult change(@RequestBody FollowRequest request) {
        return following.change(actor(request.userId()).getUserId(), request.organizerId(), request.followed());
    }
    @GetMapping("/members")
    public List<OrganizerFollowingService.FollowedMember> members(@RequestParam String userId) {
        return following.members(actor(userId));
    }
    public record FollowRequest(String userId, String organizerId, boolean followed) {}
}

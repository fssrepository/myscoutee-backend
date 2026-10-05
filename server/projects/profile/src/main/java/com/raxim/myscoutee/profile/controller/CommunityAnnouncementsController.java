package com.raxim.myscoutee.profile.controller;

import org.springframework.web.bind.annotation.*;
import com.raxim.myscoutee.profile.service.CommunityAnnouncementsService;
import com.raxim.myscoutee.profile.data.dto.community.CommunityAnnouncementDtos.*;

@RestController
@RequestMapping("/community-announcements")
public class CommunityAnnouncementsController {
    private final CommunityAnnouncementsService service;
    public CommunityAnnouncementsController(CommunityAnnouncementsService service) { this.service = service; }
    @GetMapping public Page<Item> page(@RequestParam String userId, @RequestParam String communityId,
            @RequestParam(defaultValue="published") String status, @RequestParam(defaultValue="20") int pageSize, @RequestParam(required=false) String cursor,
            @RequestParam(required=false) Boolean voting) {
        return service.page(service.actor(userId), communityId, status, pageSize, cursor, voting);
    }
    @GetMapping("/{id}") public Item detail(@RequestParam String userId, @PathVariable String id) { return service.detail(service.actor(userId), id); }
    @PostMapping public Item save(@RequestBody Save r) { return service.save(service.actor(r.userId()), r); }
    @PostMapping("/{id}/action") public Item action(@PathVariable String id, @RequestBody Command r) { return service.action(service.actor(r.userId()), id, r); }
}

package com.raxim.myscoutee.domain.campaigns.controller;

import org.springframework.web.bind.annotation.*;
import com.raxim.myscoutee.domain.campaigns.service.CampaignsService;
import com.raxim.myscoutee.domain.campaigns.dto.CampaignDtos.*;

@RestController
@RequestMapping("/campaigns")
public class CampaignsController {
    private final CampaignsService campaigns;
    public CampaignsController(CampaignsService campaigns) { this.campaigns = campaigns; }
    @GetMapping
    public Page page(@RequestParam String userId, @RequestParam(defaultValue="own") String scope,
            @RequestParam(defaultValue="published") String status, @RequestParam(required=false) String search,
            @RequestParam(required=false) String kind, @RequestParam(required=false) String category,
            @RequestParam(defaultValue="updated") String sort,
            @RequestParam(defaultValue="20") int pageSize, @RequestParam(required=false) String cursor) {
        return campaigns.page(campaigns.actor(userId), scope, status, search, kind, category, sort, pageSize, cursor);
    }
    @GetMapping("/history")
    public HistoryPage history(@RequestParam String userId, @RequestParam String targetUserId,
            @RequestParam(defaultValue="5") int pageSize, @RequestParam(required=false) String cursor) {
        return campaigns.history(campaigns.actor(userId), targetUserId, pageSize, cursor);
    }
    @GetMapping("/{id}")
    public Item detail(@RequestParam String userId, @PathVariable String id) { return campaigns.detail(campaigns.actor(userId), id); }
    @PostMapping
    public Item save(@RequestBody Save request) { return campaigns.save(campaigns.actor(request.userId()), request); }
    @PostMapping("/{id}/action")
    public Item action(@PathVariable String id, @RequestBody Command request) { return campaigns.action(campaigns.actor(request.userId()), id, request); }
}

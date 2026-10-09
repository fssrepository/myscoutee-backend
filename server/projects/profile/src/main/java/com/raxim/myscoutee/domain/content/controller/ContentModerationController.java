package com.raxim.myscoutee.domain.content.controller;

import com.raxim.myscoutee.domain.groups.api.BaseGroups;

import com.raxim.myscoutee.domain.assets.api.AssetModerationDetails;
import com.raxim.myscoutee.domain.content.service.AdminModerationService;
import com.raxim.myscoutee.domain.content.service.ContentModerationService;
import com.raxim.myscoutee.domain.groups.api.Groups;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.data.mongodb.core.MongoTemplate;
import com.raxim.myscoutee.domain.content.document.PhotoFeedPost;
import com.raxim.myscoutee.domain.content.dto.ContentModerationDtos.*;

import com.raxim.myscoutee.domain.events.api.EventModeration;
import com.raxim.myscoutee.domain.content.mapper.PhotoFeedMapper;

@RestController
@RequestMapping({"/admin/content-moderation", "/groups/{groupId}/content-moderation"})
public class ContentModerationController {
    private final AdminModerationService admins;
    private final ContentModerationService moderation;
    private final MongoTemplate mongo;
    private final AssetModerationDetails assets;
    private final EventModeration events;
    private final Groups groups;
    public ContentModerationController(AdminModerationService admins, ContentModerationService moderation,
            MongoTemplate mongo, AssetModerationDetails assets, EventModeration events, Groups groups) {
        this.admins = admins; this.moderation = moderation; this.mongo = mongo; this.assets = assets; this.events = events;
        this.groups = groups;
    }
    @GetMapping public Page page(@PathVariable(required=false) String groupId, @RequestParam String adminUserId, @RequestParam(defaultValue="all") String category,
            @RequestParam(defaultValue="under-review") String status, @RequestParam(required=false) String cursor,
            @RequestParam(defaultValue="10") int pageSize) {
        actor(adminUserId, groupId); return moderation.page(category, status, cursor, pageSize, groupId);
    }
    @GetMapping("/state") public Snapshot state(@PathVariable(required=false) String groupId, @RequestParam String adminUserId) {
        actor(adminUserId, groupId); return moderation.snapshot(groupId);
    }
    @PostMapping("/settings") public Snapshot settings(@PathVariable(required=false) String groupId, @RequestBody SaveSettings request) {
        actor(request.adminUserId(), groupId); return moderation.settings(request, groupId);
    }
    @PostMapping("/{id}/decision") public DecisionResult decision(@PathVariable(required=false) String groupId, @PathVariable String id, @RequestBody Decision request) {
        var actor = actor(request.adminUserId(), groupId);
        moderation.scopedItem(id, groupId);
        Item item = moderation.decide(id, request, actor);
        return new DecisionResult(moderation.snapshot(groupId), item);
    }
    @GetMapping("/{id}/detail") public Object detail(@PathVariable(required=false) String groupId, @PathVariable String id, @RequestParam String adminUserId) {
        actor(adminUserId, groupId);
        if (groupId == null && id.startsWith("group:")) return groups.moderationDetail(id.substring(6));
        Item item = moderation.scopedItem(id, groupId);
        return switch (item.category()) {
            case "group" -> groups.moderationDetail(item.sourceId());
            case "asset" -> assets.queryModerationAssetDetail(item.sourceId());
            case "event" -> events.detail(item.sourceId(), item.ownerUserId());
            default -> {
                var record = mongo.findById(item.sourceId(), PhotoFeedPost.class);
                if (record == null) throw new ResponseStatusException(HttpStatus.NOT_FOUND);
                yield PhotoFeedMapper.toDto(record, 0);
            }
        };
    }
    private com.raxim.myscoutee.domain.administration.dto.AdminDtos.AdminUserDto actor(String requestedId, String groupId) {
        if (groupId == null) return admins.resolveAdminActor(requestedId);
        if (com.raxim.myscoutee.domain.groups.api.BaseGroups.isBaseId(groupId)
                && admins.isBaseAdminProfile(requestedId)) return admins.resolveAdminActor(requestedId);
        var account = groups.actor(requestedId);
        groups.requireAdmin(account, groupId);
        var profile = groups.select(account, groupId).profile();
        return new com.raxim.myscoutee.domain.administration.dto.AdminDtos.AdminUserDto(
                profile.id(), profile.name(), profile.initials(), "", "", "", profile.images());
    }

}

package com.raxim.myscoutee.profile.controller.admin;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Criteria;
import com.raxim.myscoutee.profile.data.document.ActivityEvent;
import com.raxim.myscoutee.profile.data.document.PhotoFeedPost;
import com.raxim.myscoutee.profile.data.dto.admin.ContentModerationDtos.*;
import com.raxim.myscoutee.profile.service.*;
import com.raxim.myscoutee.profile.service.mapper.ActivityEventDetailMapper;
import com.raxim.myscoutee.profile.service.mapper.PhotoFeedMapper;

@RestController
@RequestMapping("/admin/content-moderation")
public class ContentModerationController {
    private final AdminModerationService admins;
    private final ContentModerationService moderation;
    private final MongoTemplate mongo;
    private final AssetsService assets;
    private final ActivityEventDetailMapper events;
    public ContentModerationController(AdminModerationService admins, ContentModerationService moderation,
            MongoTemplate mongo, AssetsService assets, ActivityEventDetailMapper events) {
        this.admins = admins; this.moderation = moderation; this.mongo = mongo; this.assets = assets; this.events = events;
    }
    @GetMapping public Page page(@RequestParam String adminUserId, @RequestParam(defaultValue="asset") String category,
            @RequestParam(defaultValue="under-review") String status, @RequestParam(required=false) String cursor,
            @RequestParam(defaultValue="10") int pageSize) {
        admins.resolveAdminActor(adminUserId); return moderation.page(category, status, cursor, pageSize);
    }
    @GetMapping("/state") public Snapshot state(@RequestParam String adminUserId) {
        admins.resolveAdminActor(adminUserId); return moderation.snapshot();
    }
    @PostMapping("/settings") public Snapshot settings(@RequestBody SaveSettings request) {
        admins.resolveAdminActor(request.adminUserId()); return moderation.settings(request);
    }
    @PostMapping("/{id}/decision") public Snapshot decision(@PathVariable String id, @RequestBody Decision request) {
        var actor = admins.resolveAdminActor(request.adminUserId()); moderation.decide(id, request, actor); return moderation.snapshot();
    }
    @GetMapping("/{id}/detail") public Object detail(@PathVariable String id, @RequestParam String adminUserId) {
        admins.resolveAdminActor(adminUserId);
        Item item = mongo.findById(id, Item.class);
        if (item == null) throw new ResponseStatusException(HttpStatus.NOT_FOUND);
        return switch (item.category()) {
            case "asset" -> assets.queryModerationAssetDetail(item.sourceId());
            case "event" -> {
                var record = mongo.findOne(Query.query(Criteria.where("sourceId").is(item.sourceId())
                        .and("ownerUserId").is(item.ownerUserId())), ActivityEvent.class);
                if (record == null) throw new ResponseStatusException(HttpStatus.NOT_FOUND);
                yield events.toDto(record, null);
            }
            default -> {
                var record = mongo.findById(item.sourceId(), PhotoFeedPost.class);
                if (record == null) throw new ResponseStatusException(HttpStatus.NOT_FOUND);
                yield PhotoFeedMapper.toDto(record, 0);
            }
        };
    }
}

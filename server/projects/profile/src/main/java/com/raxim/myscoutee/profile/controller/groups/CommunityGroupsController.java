package com.raxim.myscoutee.profile.controller.groups;

import org.springframework.web.bind.annotation.*;
import com.raxim.myscoutee.profile.service.CommunityGroupsService;
import com.raxim.myscoutee.profile.data.dto.groups.CommunityGroupDtos.*;

@RestController
@RequestMapping("/groups")
public class CommunityGroupsController {
    private final CommunityGroupsService groups;
    public CommunityGroupsController(CommunityGroupsService groups) { this.groups = groups; }
    @GetMapping
    public Page page(@RequestParam String userId, @RequestParam(defaultValue="explore") String bucket,
            @RequestParam(required=false) String category, @RequestParam(defaultValue="20") int pageSize,
            @RequestParam(required=false) String cursor, @RequestParam(required=false) String sort) {
        return groups.page(groups.actor(userId), bucket, category, pageSize, cursor, sort);
    }
    @PostMapping("/sync")
    public SyncResponse sync(@RequestBody SyncRequest request) { return groups.sync(groups.actor(request.userId()), request); }
    @GetMapping("/workspaces")
    public java.util.List<Workspace> workspaces(@RequestParam String userId) { return groups.workspaces(groups.actor(userId)); }
    @GetMapping("/{id}")
    public Group detail(@RequestParam String userId, @PathVariable String id) { return groups.detail(groups.actor(userId), id); }
    @PostMapping
    public Group save(@RequestBody Save request) { return groups.save(groups.actor(request.userId()), request); }
    @PostMapping("/join")
    public Group join(@RequestBody Command request) { return groups.join(groups.actor(request.userId()), request.groupId()); }
    @PostMapping("/report")
    public void report(@RequestBody Report request) { groups.report(groups.actor(request.userId()), request); }
}

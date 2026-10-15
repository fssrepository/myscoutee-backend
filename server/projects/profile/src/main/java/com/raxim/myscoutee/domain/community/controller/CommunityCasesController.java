package com.raxim.myscoutee.domain.community.controller;

import org.springframework.web.bind.annotation.*;
import com.raxim.myscoutee.domain.community.service.CommunityCasesService;
import com.raxim.myscoutee.domain.community.service.CommunityScheduledTasksService;
import com.raxim.myscoutee.domain.community.dto.CommunityCaseDtos.*;

@RestController
@RequestMapping("/community-cases")
public class CommunityCasesController {
    private final CommunityCasesService cases;
    private final CommunityScheduledTasksService tasks;
    public CommunityCasesController(CommunityCasesService cases, CommunityScheduledTasksService tasks) { this.cases = cases; this.tasks = tasks; }
    @GetMapping public Page<CaseItem> page(@RequestParam String userId, @RequestParam(defaultValue="active") String status,
            @RequestParam(required=false) String caseType, @RequestParam(defaultValue="20") int pageSize, @RequestParam(required=false) String cursor,
            @RequestParam(required=false) String rangeStart, @RequestParam(required=false) String rangeEnd) {
        return cases.page(cases.actor(userId), status, caseType, pageSize, cursor, rangeStart, rangeEnd);
    }
    @GetMapping("/{id}") public CaseItem detail(@RequestParam String userId, @PathVariable String id) { return cases.detail(cases.actor(userId), id); }
    @PostMapping public CaseItem save(@RequestBody SaveCase request) { return cases.save(cases.actor(request.userId()), request); }
    @PostMapping("/{id}/action") public CaseItem action(@PathVariable String id, @RequestBody Command request) { return cases.action(cases.actor(request.userId()), id, request); }
    @PostMapping("/{id}/read") public CaseItem read(@PathVariable String id, @RequestBody Command request) { return cases.read(cases.actor(request.userId()), id); }
    @GetMapping("/tasks") public Page<TaskItem> tasks(@RequestParam String userId, @RequestParam(defaultValue="20") int pageSize, @RequestParam(required=false) String cursor, @RequestParam(defaultValue="active") String status) {
        return tasks.page(tasks.actor(userId), pageSize, cursor, status);
    }
    @PostMapping("/tasks") public TaskItem saveTask(@RequestBody SaveTask request) { return tasks.save(tasks.actor(request.userId()), request); }
    @PostMapping("/tasks/{id}/action") public TaskItem taskAction(@PathVariable String id, @RequestBody TaskCommand request) { return tasks.action(tasks.actor(request.userId()), id, request); }
}

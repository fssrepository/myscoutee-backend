package com.raxim.myscoutee.microservices.transport.groups;

import java.io.IOException;
import java.util.List;
import java.util.function.Function;
import java.util.function.Supplier;
import com.raxim.myscoutee.domain.groups.api.GroupDirectory;
import com.raxim.myscoutee.domain.groups.api.GroupView;
import com.raxim.myscoutee.domain.groups.dto.GroupDirectoryEntryDto;
import com.raxim.myscoutee.microservices.transport.common.ReadQueryBodies.RejectedQuery;
import com.raxim.myscoutee.microservices.transport.groups.GroupDirectoryProtocol.Error;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.CacheControl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tools.jackson.databind.ObjectMapper;

@RestController
public final class GroupDirectoryEndpoint {
    private final GroupDirectory groups;
    private final ObjectMapper mapper;
    public GroupDirectoryEndpoint(GroupDirectory groups,ObjectMapper mapper) { this.groups=groups;this.mapper=mapper; }
    @GetMapping(value=GroupDirectoryProtocol.ENTRY,produces="application/json")
    public ResponseEntity<?> entry(@RequestParam(required=false) String id) { return read(() -> groups.findById(id).map(GroupDirectoryEntryDto::from).orElse(null), id); }
    @GetMapping(value=GroupDirectoryProtocol.NAME,produces="application/json")
    public ResponseEntity<?> name(@RequestParam(required=false) String id) { return read(() -> groups.name(id).orElse(null), id); }
    @GetMapping(value=GroupDirectoryProtocol.TYPE,produces="application/json")
    public ResponseEntity<?> type(@RequestParam(required=false) String id) { return read(() -> groups.type(id).orElse(null), id); }
    @GetMapping(value=GroupDirectoryProtocol.BASES,produces="application/json")
    public ResponseEntity<?> bases() { return read(groups::workspaceBaseIds, null); }
    @PostMapping(value=GroupDirectoryProtocol.ENTRIES,produces="application/json")
    public ResponseEntity<?> entries(HttpServletRequest request) throws IOException { return batch(request, ids -> mapped(groups.findByIdIn(ids))); }
    @PostMapping(value=GroupDirectoryProtocol.ALL_IDS,produces="application/json")
    public ResponseEntity<?> allIds(HttpServletRequest request) throws IOException { return batch(request, ids -> mapped(groups.findAllById(ids))); }
    @PostMapping(value=GroupDirectoryProtocol.ACTIVE,produces="application/json")
    public ResponseEntity<?> active(HttpServletRequest request) throws IOException { return batch(request, groups::activeCommunityIds); }
    @PostMapping(value=GroupDirectoryProtocol.BASE_IDS,produces="application/json")
    public ResponseEntity<?> baseIds(HttpServletRequest request) throws IOException { return batch(request, groups::baseGroupIds); }
    @PostMapping(value=GroupDirectoryProtocol.WORK_IDS,produces="application/json")
    public ResponseEntity<?> workIds(HttpServletRequest request) throws IOException { return batch(request, groups::workGroupIds); }
    private static List<GroupDirectoryEntryDto> mapped(List<? extends GroupView> groups) { return groups.stream().map(GroupDirectoryEntryDto::from).toList(); }
    private ResponseEntity<?> batch(HttpServletRequest request, Function<List<String>,Object> action) throws IOException {
        try { var ids=GroupDirectoryProtocol.readIds(request,mapper);return read(() -> action.apply(ids),null); }
        catch (RejectedQuery invalid) { return response(invalid.status(),new Error(invalid.code())); }
    }
    private ResponseEntity<?> read(Supplier<?> action,String id) {
        if (!GroupDirectoryProtocol.validId(id)) return response(400,new Error("INVALID_REQUEST"));
        try {
            var result=action.get();
            return result==null?response(404,new Error("NOT_FOUND")):response(200,result);
        } catch (RuntimeException unavailable) { return response(503,new Error("GROUP_DIRECTORY_UNAVAILABLE")); }
    }
    private ResponseEntity<?> response(int status,Object body) { return ResponseEntity.status(status).cacheControl(CacheControl.noStore()).body(body); }
}

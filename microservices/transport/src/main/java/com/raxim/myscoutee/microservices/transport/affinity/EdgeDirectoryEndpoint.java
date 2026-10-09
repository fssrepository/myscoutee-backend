package com.raxim.myscoutee.microservices.transport.affinity;

import java.io.IOException;
import java.util.List;
import java.util.function.Supplier;
import com.raxim.myscoutee.domain.affinity.api.EdgeDirectory;
import com.raxim.myscoutee.domain.affinity.api.EdgeView;
import com.raxim.myscoutee.domain.affinity.dto.AffinityEdgeDto;
import com.raxim.myscoutee.microservices.transport.common.ReadQueryBodies.RejectedQuery;
import com.raxim.myscoutee.microservices.transport.affinity.EdgeDirectoryProtocol.Error;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.CacheControl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tools.jackson.databind.ObjectMapper;

@RestController
public final class EdgeDirectoryEndpoint {
    private final EdgeDirectory edges;
    private final ObjectMapper mapper;
    public EdgeDirectoryEndpoint(EdgeDirectory edges, ObjectMapper mapper) { this.edges=edges; this.mapper=mapper; }
    @GetMapping(value=EdgeDirectoryProtocol.ALL, produces="application/json")
    public ResponseEntity<?> all() { return read(edges::findAll); }
    @PostMapping(value=EdgeDirectoryProtocol.RELEVANT, produces="application/json")
    public ResponseEntity<?> relevant(HttpServletRequest request) throws IOException {
        try {
            var ids=EdgeDirectoryProtocol.readIds(request,mapper);
            return read(()->edges.findRelevantByUserIds(ids));
        } catch (RejectedQuery invalid) { return response(invalid.status(),new Error(invalid.code())); }
    }
    private ResponseEntity<?> read(Supplier<? extends List<? extends EdgeView>> action) {
        try { return response(200,action.get().stream().map(AffinityEdgeDto::from).toList()); }
        catch (RuntimeException unavailable) { return response(503,new Error("EDGE_DIRECTORY_UNAVAILABLE")); }
    }
    private ResponseEntity<?> response(int status,Object body) { return ResponseEntity.status(status).cacheControl(CacheControl.noStore()).body(body); }
}

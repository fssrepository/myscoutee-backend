package com.raxim.myscoutee.microservices.transport.community;

import java.io.IOException;
import java.util.List;
import com.raxim.myscoutee.domain.community.api.CommunityMediaVisibility;
import com.raxim.myscoutee.microservices.transport.common.ReadQueryBodies;
import com.raxim.myscoutee.microservices.transport.common.MediaReferenceQueries;
import com.raxim.myscoutee.microservices.transport.community.CommunityMediaVisibilityProtocol.Error;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.CacheControl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;
import tools.jackson.databind.ObjectMapper;

@RestController
public final class CommunityMediaVisibilityEndpoint {
    private final CommunityMediaVisibility community;
    private final ObjectMapper mapper;
    public CommunityMediaVisibilityEndpoint(CommunityMediaVisibility community, ObjectMapper mapper) {
        this.community = community;
        this.mapper = mapper;
    }

    @PostMapping(value = {CommunityMediaVisibilityProtocol.ANNOUNCEMENT_PATH, CommunityMediaVisibilityProtocol.OFFERING_PATH},
            produces = "application/json")
    public ResponseEntity<?> read(HttpServletRequest request) throws IOException {
        List<String> urls;
        try {
            urls = MediaReferenceQueries.read(request, mapper);
        } catch (ReadQueryBodies.RejectedQuery invalid) {
            return response(invalid.status(), new Error(invalid.code()));
        }
        try {
            Object result = request.getRequestURI().equals(CommunityMediaVisibilityProtocol.ANNOUNCEMENT_PATH)
                    ? community.announcement(urls) : community.offering(urls);
            return result == null ? response(404, new Error("NOT_FOUND")) : response(200, result);
        } catch (RuntimeException unavailable) {
            return response(503, new Error("COMMUNITY_VISIBILITY_UNAVAILABLE"));
        }
    }

    @PostMapping(value = CommunityMediaVisibilityProtocol.DOCUMENTS_PATH, produces = "application/json")
    public ResponseEntity<?> documents(HttpServletRequest request) throws IOException {
        List<String> urls;
        try { urls = MediaReferenceQueries.read(request, mapper); }
        catch (ReadQueryBodies.RejectedQuery invalid) { return response(invalid.status(), new Error(invalid.code())); }
        try { return response(200, community.referencedDocuments(urls)); }
        catch (RuntimeException unavailable) { return response(503, new Error("DOCUMENT_REFERENCES_UNAVAILABLE")); }
    }

    private ResponseEntity<?> response(int status, Object body) {
        return ResponseEntity.status(status).cacheControl(CacheControl.noStore()).body(body);
    }
}

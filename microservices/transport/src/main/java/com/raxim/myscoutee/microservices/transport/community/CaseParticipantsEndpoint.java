package com.raxim.myscoutee.microservices.transport.community;

import java.io.IOException;
import java.util.function.Supplier;
import com.raxim.myscoutee.domain.community.api.CaseParticipants;
import com.raxim.myscoutee.microservices.transport.common.ReadQueryBodies.RejectedQuery;
import com.raxim.myscoutee.microservices.transport.community.CaseParticipantsProtocol.Error;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.CacheControl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import tools.jackson.databind.ObjectMapper;

@RestController
public final class CaseParticipantsEndpoint {
    private final CaseParticipants cases;
    private final ObjectMapper mapper;
    public CaseParticipantsEndpoint(CaseParticipants cases, ObjectMapper mapper) { this.cases = cases; this.mapper = mapper; }
    @GetMapping(value = CaseParticipantsProtocol.CONVERSATION, produces = "application/json")
    public ResponseEntity<?> conversation(@RequestParam(required = false) String caseId) {
        if (!CaseParticipantsProtocol.validId(caseId)) return response(400, new Error("INVALID_REQUEST"));
        return read(() -> cases.conversation(caseId).orElse(null));
    }
    @GetMapping(value = CaseParticipantsProtocol.ACTIVE, produces = "application/json")
    public ResponseEntity<?> active(@RequestParam(required = false) String caseId) {
        if (!CaseParticipantsProtocol.validId(caseId)) return response(400, new Error("INVALID_REQUEST"));
        return read(() -> cases.activeAccounts(caseId).orElse(null));
    }
    @PostMapping(value = CaseParticipantsProtocol.ADMINS_CHANGED, produces = "application/json")
    public ResponseEntity<?> adminsChanged(HttpServletRequest request) throws IOException {
        try {
            var query = CaseParticipantsProtocol.read(request, mapper);
            return read(() -> { cases.groupAdminsChanged(query.groupId(), query.adminAccountIds()); return true; });
        } catch (RejectedQuery invalid) { return response(invalid.status(), new Error(invalid.code())); }
    }
    private ResponseEntity<?> read(Supplier<?> read) {
        try {
            var result = read.get();
            return result == null ? response(404, new Error("NOT_FOUND")) : response(200, result);
        } catch (RuntimeException unavailable) { return response(503, new Error("CASE_PARTICIPANTS_UNAVAILABLE")); }
    }
    private ResponseEntity<?> response(int status, Object body) {
        return ResponseEntity.status(status).cacheControl(CacheControl.noStore()).body(body);
    }
}

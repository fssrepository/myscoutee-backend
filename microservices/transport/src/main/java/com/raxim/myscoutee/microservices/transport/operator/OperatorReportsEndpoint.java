package com.raxim.myscoutee.microservices.transport.operator;

import com.raxim.myscoutee.domain.operator.api.MeasurementReports;
import com.raxim.myscoutee.domain.operator.api.RevenueReports;
import com.raxim.myscoutee.microservices.transport.common.ReadQueryBodies;
import com.raxim.myscoutee.microservices.transport.security.*;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.*;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import tools.jackson.databind.ObjectMapper;

@RestController
public final class OperatorReportsEndpoint {
    private final MeasurementReports measurements;
    private final RevenueReports revenue;
    private final ObjectMapper mapper;
    private final ActorDelegation.Verifier verifier;
    public OperatorReportsEndpoint(MeasurementReports measurements, RevenueReports revenue, ObjectMapper mapper, ActorDelegation.Verifier verifier) {
        this.measurements = measurements; this.revenue = revenue; this.mapper = mapper; this.verifier = verifier;
    }
    @PostMapping(value = {OperatorReportsProtocol.MEASUREMENTS, OperatorReportsProtocol.REVENUE}, produces = "application/json")
    public ResponseEntity<?> read(HttpServletRequest request) throws java.io.IOException {
        try {
            var verified = DelegatedRequestBodies.read(request, mapper, verifier, OperatorReportsProtocol.AUDIENCE,
                    request.getRequestURI(), OperatorReportsProtocol.Query.class, OperatorReportsProtocol.MAX_REQUEST_BYTES);
            var identity = verified.principal().getProfileIdentity();
            if (org.springframework.util.StringUtils.hasText(identity.accountUserId())
                    || org.springframework.util.StringUtils.hasText(identity.workspaceGroupId())
                    || verified.principal().getAuthorities().stream().noneMatch(a -> MeasurementReports.INTEGRATION_READ_AUTHORITY.equals(a.getAuthority())))
                throw new AccessDeniedException("Checked operator integration read required");
            var q = verified.value();
            if (!OperatorReportsProtocol.valid(q)) throw new ReadQueryBodies.RejectedQuery(400, "INVALID_REQUEST");
            return verified.call(() -> response(200, OperatorReportsProtocol.MEASUREMENTS.equals(request.getRequestURI())
                    ? measurements.reports(q.status(), q.page(), q.size()) : revenue.reports(q.status(), q.page(), q.size())));
        } catch (AccessDeniedException denied) { return response(403, new OperatorReportsProtocol.Error("INVALID_DELEGATION")); }
        catch (ReadQueryBodies.RejectedQuery invalid) { return response(invalid.status(), new OperatorReportsProtocol.Error(invalid.code())); }
        catch (ResponseStatusException rejected) { return response(rejected.getStatusCode().value(), new OperatorReportsProtocol.Error("OWNER_REJECTED")); }
        catch (RuntimeException unavailable) { return response(503, new OperatorReportsProtocol.Error("OPERATOR_REPORTS_UNAVAILABLE")); }
    }
    private ResponseEntity<?> response(int status, Object body) { return ResponseEntity.status(status).cacheControl(CacheControl.noStore()).body(body); }
}

package com.raxim.myscoutee.microservices.transport.operator;

import java.net.URI;
import java.time.Duration;
import com.raxim.myscoutee.domain.operator.dto.OperatorMeasurementDtos.OperatorMeasurementReportPageDto;
import com.raxim.myscoutee.domain.operator.dto.OperatorRevenueDtos.OperatorRevenueReportPageDto;
import com.raxim.myscoutee.microservices.transport.common.RemoteReadTransport;
import com.raxim.myscoutee.microservices.transport.security.ActorDelegation;
import io.micrometer.core.instrument.MeterRegistry;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

/** One bounded client supplies both existing report interfaces; their owner rules remain canonical. */
public final class RemoteOperatorReports extends RemoteReadTransport {
    private final ObjectMapper mapper;
    private final ActorDelegation.Signer signer;
    public RemoteOperatorReports(URI origin, String token, boolean allowHttp, Duration connectTimeout,
            Duration requestTimeout, ObjectMapper mapper, MeterRegistry metrics, ActorDelegation.Signer signer) {
        super(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics); this.mapper = mapper; this.signer = signer;
    }
    public OperatorMeasurementReportPageDto measurements(String status, int page, int size) {
        return read(OperatorReportsProtocol.MEASUREMENTS, new OperatorReportsProtocol.Query(status, page, size),
                new TypeReference<OperatorMeasurementReportPageDto>() {}, v -> v.items() != null && v.page() == page && v.size() == size);
    }
    public OperatorRevenueReportPageDto revenue(String status, int page, int size) {
        return read(OperatorReportsProtocol.REVENUE, new OperatorReportsProtocol.Query(status, page, size),
                new TypeReference<OperatorRevenueReportPageDto>() {}, v -> v.items() != null && v.page() == page && v.size() == size);
    }
    private <T> T read(String path, OperatorReportsProtocol.Query query, TypeReference<T> type, java.util.function.Predicate<T> valid) {
        if (!OperatorReportsProtocol.valid(query)) throw new IllegalArgumentException("Invalid operator report query");
        byte[] bytes = mapper.writeValueAsBytes(query);
        if (bytes.length > OperatorReportsProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("Report query exceeds limit");
        String delegation = signer.issueForCurrent(OperatorReportsProtocol.AUDIENCE, "POST", path, bytes);
        try {
            return exchangeAuthorized(path, bytes, type, "operator.reports", OperatorReportsProtocol.MAX_RESPONSE_BYTES,
                    valid, java.util.Map.of(ActorDelegation.HEADER, delegation));
        } catch (RemoteReadException failure) {
            if ("OWNER_REJECTED".equals(failure.remoteCode()))
                throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatusCode.valueOf(failure.status()));
            throw failure;
        }
    }
}

package com.raxim.myscoutee.microservices.transport.content;

import java.net.URI;
import java.time.Duration;
import java.util.Map;
import java.util.Set;
import com.raxim.myscoutee.domain.content.api.ContentStatistics;
import com.raxim.myscoutee.microservices.transport.common.RemoteReadTransport;
import io.micrometer.core.instrument.MeterRegistry;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

public final class RemoteContentStatistics extends RemoteReadTransport implements ContentStatistics {
    private final ObjectMapper mapper;
    public RemoteContentStatistics(URI origin, String token, boolean allowHttp, Duration connectTimeout,
            Duration requestTimeout, ObjectMapper mapper, MeterRegistry metrics) {
        super(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics); this.mapper = mapper;
    }
    @Override public long unresolvedReports() { return count(ContentStatisticsProtocol.REPORTS, "content.unresolved-reports"); }
    @Override public long unresolvedFeedback() { return count(ContentStatisticsProtocol.FEEDBACK, "content.unresolved-feedback"); }
    private long count(String path, String operation) {
        return exchange(path, new TypeReference<Long>() {}, operation, 4096, value -> value >= 0);
    }
    @Override public Map<String, Long> feedCounts(String userId) {
        var query = new ContentStatisticsProtocol.Query(userId);
        if (!ContentStatisticsProtocol.valid(query)) throw new IllegalArgumentException("Invalid feed count query");
        byte[] bytes = mapper.writeValueAsBytes(query);
        return exchange(ContentStatisticsProtocol.FEED, bytes, new TypeReference<Map<String, Long>>() {},
                "content.feed-counts", 16384, counts -> counts.keySet().equals(Set.of("accepted", "under-review", "rejected", "blocked"))
                        && counts.values().stream().allMatch(value -> value != null && value >= 0));
    }
}

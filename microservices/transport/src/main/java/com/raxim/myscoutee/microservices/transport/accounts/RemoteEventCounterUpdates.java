package com.raxim.myscoutee.microservices.transport.accounts;

import java.net.URI;
import java.time.Duration;
import java.util.*;
import com.raxim.myscoutee.domain.accounts.api.EventCounterUpdates;
import com.raxim.myscoutee.microservices.transport.common.RemoteReadTransport;
import io.micrometer.core.instrument.MeterRegistry;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

/** Bounded absolute replacements; failed/unknown outcomes are propagated without retry. */
public final class RemoteEventCounterUpdates extends RemoteReadTransport implements EventCounterUpdates {
    private final ObjectMapper mapper;
    public RemoteEventCounterUpdates(URI origin, String token, boolean allowHttp, Duration connectTimeout,
            Duration requestTimeout, ObjectMapper mapper, MeterRegistry metrics) {
        super(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics); this.mapper = mapper;
    }
    @Override public int replaceExpired(Collection<Change> changes) {
        Objects.requireNonNull(changes);
        // Validate the whole command before sending its first batch.
        var unique = new LinkedHashMap<String, Change>();
        for (var change : changes) {
            if (!EventCounterUpdatesProtocol.valid(new EventCounterUpdatesProtocol.Command(Collections.singletonList(change))))
                throw new IllegalArgumentException("Invalid event counter change");
            unique.put(change.userId(), change);
        }
        var values = new ArrayList<>(unique.values());
        int changed = 0;
        for (int start = 0; start < values.size(); start += EventCounterUpdatesProtocol.BATCH_SIZE) {
            var batch = values.subList(start, Math.min(values.size(), start + EventCounterUpdatesProtocol.BATCH_SIZE));
            byte[] bytes = mapper.writeValueAsBytes(new EventCounterUpdatesProtocol.Command(batch));
            if (bytes.length > EventCounterUpdatesProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("Event counter batch exceeds limit");
            var result = exchange(EventCounterUpdatesProtocol.PATH, bytes, new TypeReference<EventCounterUpdatesProtocol.Result>() {},
                    "event-counter-updates.replace", 16384, value -> value.changed() != null && value.changed() >= 0 && value.changed() <= batch.size());
            changed = Math.addExact(changed, result.changed());
        }
        return changed;
    }
}

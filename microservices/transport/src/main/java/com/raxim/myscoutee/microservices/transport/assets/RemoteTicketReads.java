package com.raxim.myscoutee.microservices.transport.assets;

import java.net.URI;
import java.time.Duration;
import java.util.Map;
import com.raxim.myscoutee.domain.assets.api.TicketReads;
import com.raxim.myscoutee.domain.assets.dto.AssetsDtos.AssetTicketsPageDto;
import com.raxim.myscoutee.microservices.transport.common.RemoteReadTransport;
import com.raxim.myscoutee.microservices.transport.security.ActorDelegation;
import io.micrometer.core.instrument.MeterRegistry;
import tools.jackson.databind.ObjectMapper;
import tools.jackson.core.type.TypeReference;

public final class RemoteTicketReads extends RemoteReadTransport implements TicketReads {
    private final ObjectMapper mapper;
    private final ActorDelegation.Signer issuer;
    public RemoteTicketReads(URI origin, String token, boolean allowHttp, Duration connectTimeout,
            Duration requestTimeout, ObjectMapper mapper, MeterRegistry metrics, ActorDelegation.Signer issuer) {
        super(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics);
        this.mapper = mapper; this.issuer = issuer;
    }
    @Override public AssetTicketsPageDto queryTicketPage(String userId, Integer page, Integer pageSize, String order) {
        var query = new TicketReadsProtocol.Query(userId, page, pageSize, order);
        if (!TicketReadsProtocol.valid(query)) throw new IllegalArgumentException("Ticket page query exceeds wire limits");
        var body = mapper.writeValueAsBytes(query);
        var token = issuer.issue(userId, TicketReadsProtocol.AUDIENCE, "POST", TicketReadsProtocol.PATH, body);
        return exchangeAuthorized(TicketReadsProtocol.PATH, body, new TypeReference<AssetTicketsPageDto>() {},
                "assets.tickets.read", 2 * 1024 * 1024,
                result -> result.items() != null && result.total() != null && result.total() >= 0,
                Map.of(ActorDelegation.HEADER, token));
    }
}

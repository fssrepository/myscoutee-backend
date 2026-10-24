package com.raxim.myscoutee.microservices.transport.community;

import com.raxim.myscoutee.domain.community.api.ServiceOfferings;
import java.net.URI;
import java.time.Duration;
import com.raxim.myscoutee.microservices.transport.common.RemoteReadTransport;
import io.micrometer.core.instrument.MeterRegistry;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

/** Bounded scoped call to the existing owner; no automatic retries. */
public final class RemoteServiceOfferings extends RemoteReadTransport implements ServiceOfferings {
    private final ObjectMapper mapper;
    private final com.raxim.myscoutee.microservices.transport.security.ActorDelegation.Signer signer;
    public RemoteServiceOfferings(URI origin, String token, boolean allowHttp, Duration connectTimeout,
            Duration requestTimeout, ObjectMapper mapper, MeterRegistry metrics, com.raxim.myscoutee.microservices.transport.security.ActorDelegation.Signer signer) {
        super(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics); this.mapper = mapper; this.signer = signer;
    }
    @Override public String actor(String userId) {
        var command = new ServiceOfferingsProtocol.Actor1(ServiceOfferingsProtocol.Scope.current(), userId);
        if (!ServiceOfferingsProtocol.valid(command)) throw new IllegalArgumentException("Invalid service-offerings request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > ServiceOfferingsProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("service-offerings request exceeds byte limit");
        var result = ownerExchange(ServiceOfferingsProtocol.ACTOR_1, bytes, new TypeReference<ServiceOfferingsProtocol.Actor1Result>() {},
                "service-offerings.actor_1", ServiceOfferingsProtocol.MAX_RESPONSE_BYTES, v -> Boolean.TRUE.equals(v.resolved()));
        return result.value();
    }
    @Override public com.raxim.myscoutee.domain.community.dto.ServiceOfferingDtos.Item detail(String actor, String id) {
        var command = new ServiceOfferingsProtocol.Detail1(ServiceOfferingsProtocol.Scope.current(), actor, id);
        if (!ServiceOfferingsProtocol.valid(command)) throw new IllegalArgumentException("Invalid service-offerings request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > ServiceOfferingsProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("service-offerings request exceeds byte limit");
        var result = ownerExchange(ServiceOfferingsProtocol.DETAIL_1, bytes, new TypeReference<ServiceOfferingsProtocol.Detail1Result>() {},
                "service-offerings.detail_1", ServiceOfferingsProtocol.MAX_RESPONSE_BYTES, v -> Boolean.TRUE.equals(v.resolved()));
        return result.value();
    }
    @Override public com.raxim.myscoutee.domain.community.dto.CommunityAnnouncementDtos.Page<com.raxim.myscoutee.domain.community.dto.ServiceOfferingDtos.Item> page(String actor, String scope, String status, String category, String search, Double distance, int pageSize, String cursor) {
        var command = new ServiceOfferingsProtocol.Page1(ServiceOfferingsProtocol.Scope.current(), actor, scope, status, category, search, distance, pageSize, cursor);
        if (!ServiceOfferingsProtocol.valid(command)) throw new IllegalArgumentException("Invalid service-offerings request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > ServiceOfferingsProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("service-offerings request exceeds byte limit");
        var result = ownerExchange(ServiceOfferingsProtocol.PAGE_1, bytes, new TypeReference<ServiceOfferingsProtocol.Page1Result>() {},
                "service-offerings.page_1", ServiceOfferingsProtocol.MAX_RESPONSE_BYTES, v -> Boolean.TRUE.equals(v.resolved()));
        return result.value();
    }
    @Override public com.raxim.myscoutee.domain.community.dto.CommunityAnnouncementDtos.Page<com.raxim.myscoutee.domain.community.dto.ServiceOfferingDtos.Item> page(String actor, String scope, String status, String category, String search, Double distance, int pageSize, String cursor, java.util.List<String> serviceIds) {
        var command = new ServiceOfferingsProtocol.Page2(ServiceOfferingsProtocol.Scope.current(), actor, scope, status, category, search, distance, pageSize, cursor, serviceIds);
        if (!ServiceOfferingsProtocol.valid(command)) throw new IllegalArgumentException("Invalid service-offerings request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > ServiceOfferingsProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("service-offerings request exceeds byte limit");
        var result = ownerExchange(ServiceOfferingsProtocol.PAGE_2, bytes, new TypeReference<ServiceOfferingsProtocol.Page2Result>() {},
                "service-offerings.page_2", ServiceOfferingsProtocol.MAX_RESPONSE_BYTES, v -> Boolean.TRUE.equals(v.resolved()));
        return result.value();
    }
    @Override public com.raxim.myscoutee.domain.community.dto.ServiceOfferingDtos.Item save(String actor, com.raxim.myscoutee.domain.community.dto.ServiceOfferingDtos.Save r) {
        var command = new ServiceOfferingsProtocol.Save1(ServiceOfferingsProtocol.Scope.current(), actor, r);
        if (!ServiceOfferingsProtocol.valid(command)) throw new IllegalArgumentException("Invalid service-offerings request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > ServiceOfferingsProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("service-offerings request exceeds byte limit");
        var result = ownerExchange(ServiceOfferingsProtocol.SAVE_1, bytes, new TypeReference<ServiceOfferingsProtocol.Save1Result>() {},
                "service-offerings.save_1", ServiceOfferingsProtocol.MAX_RESPONSE_BYTES, v -> Boolean.TRUE.equals(v.resolved()));
        return result.value();
    }
    @Override public com.raxim.myscoutee.domain.community.dto.ServiceOfferingDtos.Item action(String actor, String id, com.raxim.myscoutee.domain.community.dto.ServiceOfferingDtos.Command r) {
        var command = new ServiceOfferingsProtocol.Action1(ServiceOfferingsProtocol.Scope.current(), actor, id, r);
        if (!ServiceOfferingsProtocol.valid(command)) throw new IllegalArgumentException("Invalid service-offerings request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > ServiceOfferingsProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("service-offerings request exceeds byte limit");
        var result = ownerExchange(ServiceOfferingsProtocol.ACTION_1, bytes, new TypeReference<ServiceOfferingsProtocol.Action1Result>() {},
                "service-offerings.action_1", ServiceOfferingsProtocol.MAX_RESPONSE_BYTES, v -> Boolean.TRUE.equals(v.resolved()));
        return result.value();
    }
    private <T> T ownerExchange(String path, byte[] bytes, TypeReference<T> type, String operation, int limit,
            java.util.function.Predicate<T> valid) {
        try {
            if (ServiceOfferingsProtocol.delegated(path)) return exchangeAuthorized(path, bytes, type, operation, limit, valid,
                    java.util.Map.of(com.raxim.myscoutee.microservices.transport.security.ActorDelegation.HEADER,
                            signer.issueForCurrent(ServiceOfferingsProtocol.AUDIENCE, "POST", path, bytes)));
            return exchange(path, bytes, type, operation, limit, valid);
        }
        catch (RemoteReadException failure) {
            if (failure.status() >= 400 && failure.status() < 500 && "OWNER_REJECTED".equals(failure.remoteCode()))
                throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatusCode.valueOf(failure.status()));
            throw failure;
        }
    }

    @Override public java.util.List<com.raxim.myscoutee.domain.community.dto.ServiceOfferingDto> visibleMetadata(String actor, java.util.Collection<String> ids) {
        var command = new ServiceOfferingsProtocol.VisibleMetadata(ServiceOfferingsProtocol.Scope.current(), actor, ids);
        if (!ServiceOfferingsProtocol.valid(command)) throw new IllegalArgumentException("Invalid visibleMetadata request");
        byte[] bytes = mapper.writeValueAsBytes(command);
        if (bytes.length > ServiceOfferingsProtocol.MAX_REQUEST_BYTES) throw new IllegalArgumentException("Request exceeds byte limit");
        return ownerExchange(ServiceOfferingsProtocol.VISIBLE_METADATA, bytes, new TypeReference<ServiceOfferingsProtocol.VisibleMetadataResult>() {},
            "serviceofferings.visibleMetadata", ServiceOfferingsProtocol.MAX_RESPONSE_BYTES, value -> Boolean.TRUE.equals(value.resolved())).value();
    }
}

package com.raxim.myscoutee.microservices.transport.payments;

import java.net.URI;
import java.time.Duration;
import com.raxim.myscoutee.domain.payments.api.AffiliateRegistrations;
import com.raxim.myscoutee.domain.payments.dto.AffiliateRegistration;
import com.raxim.myscoutee.microservices.transport.common.RemoteCommandTransport;
import io.micrometer.core.instrument.MeterRegistry;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

public final class RemoteAffiliateRegistrations extends RemoteCommandTransport implements AffiliateRegistrations {
    private final ObjectMapper mapper;
    public RemoteAffiliateRegistrations(URI origin,String token,boolean allowHttp,Duration connectTimeout,
            Duration requestTimeout,ObjectMapper mapper,MeterRegistry metrics) {
        super(origin,token,allowHttp,connectTimeout,requestTimeout,mapper,metrics);this.mapper=mapper;
    }
    @Override public AffiliateRegistration resolveRegistration(String code,String userId) {
        if (!AffiliateRegistrationsProtocol.bounded(code) || !AffiliateRegistrationsProtocol.bounded(userId))
            throw new IllegalArgumentException("Affiliate query exceeds wire limits");
        return exchange(AffiliateRegistrationsProtocol.RESOLVE,
                mapper.writeValueAsBytes(new AffiliateRegistrationsProtocol.Query(code,userId)),
                new TypeReference<AffiliateRegistrationsProtocol.Resolution>() {},"payments.affiliate-registration-resolve",8192,
                value -> AffiliateRegistrationsProtocol.valid(value.registration())).registration();
    }
    @Override public void recordRegistration(AffiliateRegistration registration) {
        if (registration == null) return;
        if (!AffiliateRegistrationsProtocol.valid(registration)) throw new IllegalArgumentException("Affiliate registration exceeds wire limits");
        producerCommand(AffiliateRegistrationsProtocol.RECORD,
                mapper.writeValueAsBytes(new AffiliateRegistrationsProtocol.Command(registration)),
                new TypeReference<AffiliateRegistrationsProtocol.Receipt>() {},"payments.affiliate-registration-record",4096,
                value -> Boolean.TRUE.equals(value.completed()),registration.userId());
    }
}

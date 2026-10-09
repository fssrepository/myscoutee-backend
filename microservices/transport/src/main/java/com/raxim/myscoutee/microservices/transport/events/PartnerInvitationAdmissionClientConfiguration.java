package com.raxim.myscoutee.microservices.transport.events;

import java.net.URI;
import java.time.Duration;
import io.micrometer.core.instrument.MeterRegistry;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import tools.jackson.databind.ObjectMapper;

/** Imported only where the manifest assigns events to a different owner. */
@Configuration(proxyBeanMethods = false)
@org.springframework.context.annotation.Import(com.raxim.myscoutee.microservices.transport.security.ActorDelegationSignerConfiguration.class)
public class PartnerInvitationAdmissionClientConfiguration {
    @Bean(destroyMethod = "close")
    RemotePartnerInvitationAdmission remotePartnerInvitationAdmission(
            @Value("${myscoutee.remote.partner-invitation-admission.url}") URI origin,
            @Value("${myscoutee.remote.partner-invitation-admission.command-token}") String token,
            @Value("${myscoutee.remote.partner-invitation-admission.allow-insecure-http:false}") boolean allowHttp,
            @Value("${myscoutee.remote.partner-invitation-admission.connect-timeout:PT1S}") Duration connectTimeout,
            @Value("${myscoutee.remote.partner-invitation-admission.request-timeout:PT3S}") Duration requestTimeout,
            ObjectMapper mapper, MeterRegistry metrics, com.raxim.myscoutee.microservices.transport.security.ActorDelegation.Signer signer) {
        return new RemotePartnerInvitationAdmission(origin, token, allowHttp, connectTimeout, requestTimeout, mapper, metrics, signer);
    }
}

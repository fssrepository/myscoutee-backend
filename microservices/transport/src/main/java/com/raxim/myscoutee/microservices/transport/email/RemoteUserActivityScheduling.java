package com.raxim.myscoutee.microservices.transport.email;

import java.net.URI;
import java.time.Duration;
import com.raxim.myscoutee.domain.email.api.UserActivityScheduling;
import com.raxim.myscoutee.microservices.transport.common.RemoteCommandTransport;
import com.raxim.myscoutee.microservices.transport.security.ActorDelegation;
import io.micrometer.core.instrument.MeterRegistry;
import tools.jackson.databind.ObjectMapper;
import tools.jackson.core.type.TypeReference;

public final class RemoteUserActivityScheduling extends RemoteCommandTransport implements UserActivityScheduling {
    private final ObjectMapper mapper;
    private final ActorDelegation.Signer issuer;
    public RemoteUserActivityScheduling(URI origin,String token,boolean allowHttp,Duration connectTimeout,
            Duration requestTimeout,ObjectMapper mapper,MeterRegistry metrics,ActorDelegation.Signer issuer) {
        super(origin,token,allowHttp,connectTimeout,requestTimeout,mapper,metrics);this.mapper=mapper;this.issuer=issuer;
    }
    @Override public void touchUserActivity(String userId) {
        if(userId==null || userId.isBlank())return;
        userId=userId.trim();
        if(userId.length()>512)throw new IllegalArgumentException("Selected profile ID exceeds limit");
        var body=mapper.writeValueAsBytes(new UserActivitySchedulingProtocol.Command(userId));
        var delegation=issuer.issue(userId,UserActivitySchedulingProtocol.AUDIENCE,"POST",UserActivitySchedulingProtocol.PATH,body);
        command(UserActivitySchedulingProtocol.PATH,body,new TypeReference<UserActivitySchedulingProtocol.Receipt>() {},
                "email.user-activity.touch",4096,UserActivitySchedulingProtocol.Receipt::completed,delegation,
                java.util.UUID.randomUUID().toString());
    }
}

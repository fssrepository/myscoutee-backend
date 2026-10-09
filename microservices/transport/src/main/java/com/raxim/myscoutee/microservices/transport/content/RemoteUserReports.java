package com.raxim.myscoutee.microservices.transport.content;

import java.net.URI;
import java.time.Duration;
import java.util.Map;
import com.raxim.myscoutee.domain.content.api.UserReports;
import com.raxim.myscoutee.microservices.transport.common.RemoteCommandTransport;
import com.raxim.myscoutee.microservices.transport.security.ActorDelegation;
import io.micrometer.core.instrument.MeterRegistry;
import tools.jackson.databind.ObjectMapper;
import tools.jackson.core.type.TypeReference;

public final class RemoteUserReports extends RemoteCommandTransport implements UserReports {
    private final ObjectMapper mapper;
    private final ActorDelegation.Signer issuer;
    public RemoteUserReports(URI origin,String token,boolean allowHttp,Duration connectTimeout,Duration requestTimeout,
            ObjectMapper mapper,MeterRegistry metrics,ActorDelegation.Signer issuer) {
        super(origin,token,allowHttp,connectTimeout,requestTimeout,mapper,metrics);this.mapper=mapper;this.issuer=issuer;
    }
    @Override public boolean exists(String syncKey) {
        var body=body(new UserReportsProtocol.ExistsQuery(syncKey));
        var delegation=issuer.issueForCurrent(UserReportsProtocol.EXISTS_AUDIENCE,"POST",UserReportsProtocol.EXISTS,body);
        return exchangeAuthorized(UserReportsProtocol.EXISTS,body,new TypeReference<UserReportsProtocol.ExistsResult>() {},
                "content.reports.exists",4096,value->true,Map.of(ActorDelegation.HEADER,delegation)).exists();
    }
    @Override public Receipt submit(ReportDraft request) {
        var body=body(request);
        var delegation=issuer.issue(request.userId(),UserReportsProtocol.SUBMIT_AUDIENCE,"POST",UserReportsProtocol.SUBMIT,body);
        return command(UserReportsProtocol.SUBMIT,body,new TypeReference<Receipt>() {},"content.reports.submit",4096,
                value->value.duplicate() || value.id()!=null,delegation,request.syncKey());
    }
    private byte[] body(Object value) {
        var body=mapper.writeValueAsBytes(value);
        if(body.length>UserReportsProtocol.MAX_REQUEST_BYTES)throw new IllegalArgumentException("Report request too large");
        return body;
    }
}

package com.raxim.myscoutee.microservices.transport.content;

import java.net.URI;
import java.time.Duration;
import com.raxim.myscoutee.domain.content.api.UserFeedback;
import com.raxim.myscoutee.microservices.transport.common.RemoteCommandTransport;
import com.raxim.myscoutee.microservices.transport.security.ActorDelegation;
import io.micrometer.core.instrument.MeterRegistry;
import tools.jackson.databind.ObjectMapper;
import tools.jackson.core.type.TypeReference;

/** One signed command attempt; a timeout is an unknown outcome, never a safe retry signal. */
public final class RemoteUserFeedback extends RemoteCommandTransport implements UserFeedback {
    private final ObjectMapper mapper;
    private final ActorDelegation.Signer issuer;
    public RemoteUserFeedback(URI origin,String token,boolean allowHttp,Duration connectTimeout,
            Duration requestTimeout,ObjectMapper mapper,MeterRegistry metrics,ActorDelegation.Signer issuer) {
        super(origin,token,allowHttp,connectTimeout,requestTimeout,mapper,metrics);
        this.mapper=mapper;this.issuer=issuer;
    }
    @Override public String submit(String userId,String category,String subject,String details) {
        return submitOnce(new org.bson.types.ObjectId().toHexString(),userId,category,subject,details);
    }
    @Override public String submitOnce(String requestId,String userId,String category,String subject,String details) {
        if(requestId==null || !requestId.matches("[a-f0-9]{24}"))throw new IllegalArgumentException("Invalid feedback request ID");
        var bytes=mapper.writeValueAsBytes(new UserFeedbackProtocol.Command(requestId,userId,category,subject,details));
        if(bytes.length>UserFeedbackProtocol.MAX_REQUEST_BYTES)throw new IllegalArgumentException("Feedback request too large");
        var delegation=issuer.issue(userId,UserFeedbackProtocol.AUDIENCE,"POST",UserFeedbackProtocol.PATH,bytes);
        return command(UserFeedbackProtocol.PATH,bytes,new TypeReference<UserFeedbackProtocol.Receipt>() {},
                "content.feedback.submit",4096,receipt->requestId.equals(receipt.id()),delegation,requestId).id();
    }
}

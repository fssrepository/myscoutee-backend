package com.raxim.myscoutee.microservices.transport.chat;

import java.net.URI;
import java.time.Duration;
import com.raxim.myscoutee.domain.chat.api.ChatReview;
import com.raxim.myscoutee.microservices.transport.common.RemoteReadTransport;
import io.micrometer.core.instrument.MeterRegistry;
import tools.jackson.core.type.TypeReference;
import tools.jackson.databind.ObjectMapper;

public final class RemoteChatReview extends RemoteReadTransport implements ChatReview {
    public RemoteChatReview(URI origin,String token,boolean allowHttp,Duration connectTimeout,
            Duration requestTimeout,ObjectMapper mapper,MeterRegistry metrics) {
        super(origin,token,allowHttp,connectTimeout,requestTimeout,mapper,metrics);
    }
    @Override public ReportedChat reported(String chatId,String messageId,String reporterId,String targetId) {
        return read(ChatReviewProtocol.REPORTED,chatId,messageId,reporterId,targetId,new TypeReference<ReportedChat>() {},"chat.review-reported");
    }
    @Override public ReportEvidence reportEvidence(String reporter,String target,String chatId,String messageId) {
        return read(ChatReviewProtocol.EVIDENCE,chatId,messageId,reporter,target,new TypeReference<ReportEvidence>() {},"chat.review-evidence");
    }
    private <T> T read(String path,String chat,String message,String reporter,String target,TypeReference<T> type,String operation) {
        try { return exchange(queryPath(path,"chatId",chat,"messageId",message,"reporterId",reporter,"targetId",target),
                type,operation,ChatReviewProtocol.MAX_RESPONSE_BYTES,value->true); }
        catch(RemoteReadException failure) {
            if(failure.status()==404 && "NOT_FOUND".equals(failure.remoteCode()))return null;
            throw failure;
        }
    }
}

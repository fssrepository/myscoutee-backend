package com.raxim.myscoutee.microservices.transport.chat;

import java.util.function.Supplier;
import com.raxim.myscoutee.domain.chat.api.ChatReview;
import com.raxim.myscoutee.microservices.transport.chat.ChatReviewProtocol.Error;
import org.springframework.http.CacheControl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/** Owner-side reportability and projection rules stay in the canonical service. */
@RestController
public final class ChatReviewEndpoint {
    private final ChatReview review;
    public ChatReviewEndpoint(ChatReview review) { this.review=review; }
    @GetMapping(value=ChatReviewProtocol.REPORTED,produces="application/json")
    public ResponseEntity<?> reported(@RequestParam(required=false) String chatId,@RequestParam(required=false) String messageId,
            @RequestParam(required=false) String reporterId,@RequestParam(required=false) String targetId) {
        return read(()->review.reported(chatId,messageId,reporterId,targetId),chatId,messageId,reporterId,targetId);
    }
    @GetMapping(value=ChatReviewProtocol.EVIDENCE,produces="application/json")
    public ResponseEntity<?> evidence(@RequestParam(required=false) String chatId,@RequestParam(required=false) String messageId,
            @RequestParam(required=false) String reporterId,@RequestParam(required=false) String targetId) {
        return read(()->review.reportEvidence(reporterId,targetId,chatId,messageId),chatId,messageId,reporterId,targetId);
    }
    private ResponseEntity<?> read(Supplier<?> action,String... ids) {
        for(var id:ids) if(!ChatReviewProtocol.validId(id))return response(400,new Error("INVALID_REQUEST"));
        try { var value=action.get();return value==null?response(404,new Error("NOT_FOUND")):response(200,value); }
        catch(RuntimeException unavailable) { return response(503,new Error("CHAT_REVIEW_UNAVAILABLE")); }
    }
    private ResponseEntity<?> response(int status,Object body) {return ResponseEntity.status(status).cacheControl(CacheControl.noStore()).body(body);}
}

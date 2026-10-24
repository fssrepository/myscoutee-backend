package com.raxim.myscoutee.microservices.transport.chat;

import com.raxim.myscoutee.common.config.mongo.MongoSessionMode;
import com.raxim.myscoutee.common.config.mongo.MongoSessionModeContext;
import com.raxim.myscoutee.microservices.bootstrap.ServiceSecurityConfiguration;
import com.raxim.myscoutee.microservices.transport.common.InternalReadCredentialFilter;
import com.raxim.myscoutee.microservices.transport.common.RemoteReadTransport.RemoteReadException;
import io.micrometer.core.instrument.simple.SimpleMeterRegistry;
import java.io.ByteArrayInputStream;
import java.net.URI;
import java.net.http.*;
import java.nio.charset.StandardCharsets;
import java.nio.file.*;
import java.time.Duration;
import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;
import org.junit.jupiter.api.*;
import org.springframework.boot.SpringBootConfiguration;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import tools.jackson.databind.json.JsonMapper;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import com.raxim.myscoutee.domain.chat.service.ChatReviewService;
import com.raxim.myscoutee.domain.chat.repository.ChatsRepository;
import com.raxim.myscoutee.domain.chat.repository.ChatMessagesRepository;
import com.raxim.myscoutee.domain.chat.document.Chat;
import com.raxim.myscoutee.domain.chat.document.ChatMessage;
import org.springframework.data.domain.Pageable;
class ChatReviewHttpTest {
    static final String TOKEN = "test-only-chat-review-token-00000000000000000";
    static ConfigurableApplicationContext server;
    static RemoteChatReview remote;
    static HttpClient http;
    static URI origin;
    static SimpleMeterRegistry meters;
    static Path evidence;
    static final AtomicInteger sequence = new AtomicInteger();
    @BeforeAll static void start() throws Exception {
        evidence = Path.of(System.getProperty("wireEvidenceDirectory"), "chat-review");
        Files.createDirectories(evidence);
        try (var files = Files.list(evidence)) {
            for (var file : files.filter(p -> p.getFileName().toString().matches("response-[0-9]+\\.json")).toList()) Files.delete(file);
        }
        server = new SpringApplicationBuilder(Fixture.class).properties(
                "server.address=127.0.0.1", "server.port=0", "management.server.port=0",
                "myscoutee.remote.chat-review.read-token=" + TOKEN,
                "spring.main.allow-bean-definition-overriding=false",
                "spring.main.banner-mode=off", "logging.level.root=WARN").run();
        origin = URI.create("http://127.0.0.1:" + server.getEnvironment().getProperty("local.server.port"));
        http = HttpClient.newBuilder().followRedirects(HttpClient.Redirect.NEVER).build();
        meters = new SimpleMeterRegistry();
        remote = new RemoteChatReview(origin, TOKEN, true, Duration.ofSeconds(1), Duration.ofSeconds(3), new JsonMapper(), meters);
    }
    @AfterEach void clear() { MongoSessionModeContext.clear(); }
    @AfterAll static void stop() {
        if (remote != null) remote.close();
        if (http != null) http.shutdownNow();
        if (server != null) server.close();
        if (meters != null) meters.close();
    }
    @Test void canonicalReviewAndEvidencePreserveContentOrderAndDatabaseMode() throws Exception {
        var local=server.getBean(ChatReviewService.class);
        for(var mode:List.of(MongoSessionMode.REAL,MongoSessionMode.DEMO,MongoSessionMode.REAL)) {
            MongoSessionModeContext.set(mode);
            assertEquals(local.reported("chat&é/?","message","reporter","target"),remote.reported("chat&é/?","message","reporter","target"));
            assertEquals(local.reportEvidence("reporter","target","chat&é/?","message"),remote.reportEvidence("reporter","target","chat&é/?","message"));
            var review=remote.reported("chat&é/?","message","reporter","target");
            assertEquals(mode.name(),review.title());assertEquals(List.of("older","newer"),review.messages().stream().map(m->m.id()).toList());
            assertNull(review.messages().getFirst().senderGender());
            for(var path:ChatReviewProtocol.paths()) {
                var response=request(path,"?chatId=chat&messageId=message&reporterId=reporter&targetId=target",TOKEN,mode.name(),"GET");
                assertEquals(200,response.statusCode());assertFalse(response.body().contains("private-attachment"));
            }
        }
    }
    @Test void canonicalReportabilityGuardsAndMissingInputsRemainAbsent() throws Exception {
        for(var query:List.of(
                new String[]{"chat","message","wrong-reporter","target"},
                new String[]{"chat","message","reporter","outside"},
                new String[]{"chat","missing","reporter","target"},
                new String[]{"chat","wrong-author","reporter","target"},
                new String[]{null,"message","reporter","target"},
                new String[]{"chat"," ","reporter","target"})) {
            assertNull(remote.reported(query[0],query[1],query[2],query[3]));
            assertNull(remote.reportEvidence(query[2],query[3],query[0],query[1]));
        }
        for(var path:ChatReviewProtocol.paths())
            assertEquals(404,request(path,"",TOKEN,"REAL","GET").statusCode());
        var trimmed=remote.reportEvidence(" reporter "," target "," chat "," message ");
        assertEquals("chat",trimmed.chatId());assertEquals("message",trimmed.messageId());
    }
    @Test void everyReadRequiresDedicatedCredentialModeMethodAndBoundedIds() throws Exception {
        for(var path:ChatReviewProtocol.paths()) {
            for(var token:new String[]{null,"test-only-chat-directory-token-00000000000000000"})
                assertEquals(401,request(path,"",token,"REAL","GET").statusCode());
            for(var mode:new String[]{null,"demo","ANY"})assertEquals(400,request(path,"",TOKEN,mode,"GET").statusCode());
            assertEquals(403,request(path,"",TOKEN,"REAL","POST").statusCode());
            for(var id:List.of("chatId","messageId","reporterId","targetId"))
                assertEquals(400,request(path,"?"+id+"="+"x".repeat(513),TOKEN,"REAL","GET").statusCode());
        }
    }
    @Test void ownerFailureDoesNotBecomeAbsentEvidence() throws Exception {
        for(var path:ChatReviewProtocol.paths())
            assertEquals(503,request(path,"?chatId=fail&messageId=message&reporterId=reporter&targetId=target",TOKEN,"REAL","GET").statusCode());
        assertEquals(503,assertThrows(RemoteReadException.class,()->remote.reportEvidence("reporter","target","fail","message")).status());
        assertEquals(503,assertThrows(RemoteReadException.class,()->remote.reported("fail","message","reporter","target")).status());
    }
    static HttpResponse<String> request(String path,String suffix,String token,String mode,String method) throws Exception {
        var builder=HttpRequest.newBuilder(origin.resolve(path+suffix)).timeout(Duration.ofSeconds(3));
        if(token!=null)builder.header("Authorization","Bearer "+token);
        if(mode!=null)builder.header(InternalReadCredentialFilter.MODE_HEADER,mode);
        var response=http.send(builder.method(method,HttpRequest.BodyPublishers.noBody()).build(),HttpResponse.BodyHandlers.ofString());
        assertEquals("no-store",response.headers().firstValue("Cache-Control").orElseThrow());
        Files.writeString(evidence.resolve("response-"+sequence.incrementAndGet()+".json"),new JsonMapper().writeValueAsString(
                Map.of("path",path,"method","get","status",response.statusCode(),"body",new JsonMapper().readTree(response.body()))));
        return response;
    }
    @SpringBootConfiguration
    @EnableAutoConfiguration(excludeName={
            "org.springframework.boot.mongodb.autoconfigure.MongoAutoConfiguration",
            "org.springframework.boot.data.mongodb.autoconfigure.DataMongoAutoConfiguration",
            "org.springframework.boot.data.mongodb.autoconfigure.DataMongoRepositoriesAutoConfiguration",
            "org.springframework.boot.security.autoconfigure.UserDetailsServiceAutoConfiguration"})
    @Import({ChatReviewServerConfiguration.class,ServiceSecurityConfiguration.class})
    static class Fixture {
        @Bean ChatsRepository chats() {
            var chats=mock(ChatsRepository.class);
            when(chats.findByOwnerUserIdAndChatId(anyString(),anyString())).thenAnswer(c->{
                if("fail".equals(c.getArgument(1)))throw new IllegalStateException("private db details");
                if(!"reporter".equals(c.getArgument(0)))return Optional.empty();
                var chat=new Chat();chat.setChatId(c.getArgument(1));chat.setTitle(MongoSessionModeContext.currentMode().name());
                chat.setMemberIds(List.of("reporter","target"));return Optional.of(chat);
            });return chats;
        }
        @Bean ChatMessagesRepository messages() {
            var messages=mock(ChatMessagesRepository.class);
            when(messages.findByChatIdAndMessageId(anyString(),anyString())).thenAnswer(c->
                "missing".equals(c.getArgument(1))?Optional.empty():Optional.of(message(c.getArgument(1),"wrong-author".equals(c.getArgument(1))?"another":"target")));
            when(messages.findByChatIdOrderBySentAtIsoDesc(anyString(),any(Pageable.class))).thenAnswer(c->{
                Pageable page=c.getArgument(1);assertEquals(0,page.getPageNumber());assertEquals(50,page.getPageSize());
                return List.of(message("newer","target"),message("older","target"));
            });return messages;
        }
        @Bean ChatReviewService review(ChatsRepository chats,ChatMessagesRepository messages) {return new ChatReviewService(chats,messages);}
    }
    static ChatMessage message(String id,String sender) {
        var row=new ChatMessage();row.setId(id);row.setSender("Sender");row.setText("message é & content");row.setTime("");row.setSentAtIso(null);
        var avatar=new ChatMessage.ChatAvatarRecord();avatar.setId(sender);avatar.setInitials("S");avatar.setGender(null);row.setSenderAvatar(avatar);
        var attachment=new ChatMessage.ChatMessageAttachmentRecord();attachment.setId("private-attachment");
        attachment.setUrl("private-attachment-url");row.setAttachments(List.of(attachment));
        return row;
    }
}

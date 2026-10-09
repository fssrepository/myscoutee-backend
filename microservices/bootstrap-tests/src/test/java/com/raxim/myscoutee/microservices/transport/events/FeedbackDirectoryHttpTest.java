package com.raxim.myscoutee.microservices.transport.events;

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

import com.raxim.myscoutee.domain.events.api.FeedbackDirectory;
import com.raxim.myscoutee.domain.events.document.EventFeedbackAnswer;
import com.raxim.myscoutee.domain.events.dto.FeedbackAnswerDto;
import com.raxim.myscoutee.domain.events.repository.EventFeedbackAnswersRepository;
import com.raxim.myscoutee.domain.events.service.FeedbackDirectoryService;
class FeedbackDirectoryHttpTest {
    static final String TOKEN = "test-only-feedback-directory-token-00000000000000000";
    static ConfigurableApplicationContext server;
    static RemoteFeedbackDirectory remote;
    static HttpClient http;
    static URI origin;
    static SimpleMeterRegistry meters;
    static Path evidence;
    static final AtomicInteger sequence = new AtomicInteger();
    @BeforeAll static void start() throws Exception {
        evidence = Path.of(System.getProperty("wireEvidenceDirectory"), "feedback-directory");
        Files.createDirectories(evidence);
        try (var files = Files.list(evidence)) {
            for (var file : files.filter(p -> p.getFileName().toString().matches("response-[0-9]+\\.json")).toList()) Files.delete(file);
        }
        server = new SpringApplicationBuilder(Fixture.class).properties(
                "server.address=127.0.0.1", "server.port=0", "management.server.port=0",
                "myscoutee.remote.feedback-directory.read-token=" + TOKEN,
                "spring.main.allow-bean-definition-overriding=false",
                "spring.main.banner-mode=off", "logging.level.root=WARN").run();
        origin = URI.create("http://127.0.0.1:" + server.getEnvironment().getProperty("local.server.port"));
        http = HttpClient.newBuilder().followRedirects(HttpClient.Redirect.NEVER).build();
        meters = new SimpleMeterRegistry();
        remote = new RemoteFeedbackDirectory(origin, TOKEN, true, Duration.ofSeconds(1), Duration.ofSeconds(3), new JsonMapper(), meters);
    }
    @AfterEach void clear() { MongoSessionModeContext.clear(); }
    @AfterAll static void stop() {
        if (remote != null) remote.close();
        if (http != null) http.shutdownNow();
        if (server != null) server.close();
        if (meters != null) meters.close();
    }
    @Test void focusedFieldsOrderNullsAndSessionModesSurviveHttp() throws Exception {
        var local=server.getBean(FeedbackDirectory.class);
        for (var mode:List.of(MongoSessionMode.REAL,MongoSessionMode.DEMO,MongoSessionMode.REAL)) {
            MongoSessionModeContext.set(mode);
            var expected=local.findByTargetUserIdOrderBySubmittedAtIsoDesc("known").stream().map(v->v==null?null:FeedbackAnswerDto.from(v)).toList();
            assertEquals(expected,remote.findByTargetUserIdOrderBySubmittedAtIsoDesc("known"));
            
            assertEquals(mode.name(),remote.findByTargetUserIdOrderBySubmittedAtIsoDesc("known").getFirst().viewerUserId());
            for(var path:List.of(FeedbackDirectoryProtocol.PATH)) {
                var response=request(path,"?id=known",TOKEN,mode.name(),"GET");
                assertEquals(200,response.statusCode());
                assertFalse(response.body().contains("private-subtitle"));
                assertFalse(response.body().contains("pricing"));
            }
        }
    }
    @Test void emptyAndEncodedIdentifiersRetainMeaning() throws Exception {
        assertEquals(List.of(),remote.findByTargetUserIdOrderBySubmittedAtIsoDesc("empty"));
        assertEquals(200,request(FeedbackDirectoryProtocol.PATH,"?id=empty",TOKEN,"REAL","GET").statusCode());
        var local=server.getBean(EventFeedbackAnswersRepository.class);
        for(var id:Arrays.asList(null,"","event&é/?")) {remote.findByTargetUserIdOrderBySubmittedAtIsoDesc(id);verify(local).findByTargetUserIdOrderBySubmittedAtIsoDesc(id);}
    }
    @Test void everyReadRequiresCredentialModeAndGetAndEnforcesIdLimit() throws Exception {
        for(var path:List.of(FeedbackDirectoryProtocol.PATH)) {
            for(var token:new String[]{null,"test-only-other-port-token-00000000000000000"})
                assertEquals(401,request(path,"",token,"REAL","GET").statusCode());
            for(var mode:new String[]{null,"demo","ANY"}) assertEquals(400,request(path,"",TOKEN,mode,"GET").statusCode());
            assertEquals(403,request(path,"",TOKEN,"REAL","POST").statusCode());
        }
        assertEquals(400,request(FeedbackDirectoryProtocol.PATH,"?id="+"x".repeat(513),TOKEN,"REAL","GET").statusCode());
    }
    @Test void ownerFailureIsNotAnEmptyProjection() throws Exception {
        assertEquals(503,request(FeedbackDirectoryProtocol.PATH,"?id=fail",TOKEN,"REAL","GET").statusCode());
        assertEquals(503,assertThrows(RemoteReadException.class,()->remote.findByTargetUserIdOrderBySubmittedAtIsoDesc("fail")).status());
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
    @Import({FeedbackDirectoryServerConfiguration.class,ServiceSecurityConfiguration.class})
    static class Fixture {
        @Bean EventFeedbackAnswersRepository repository() {
            var repository=mock(EventFeedbackAnswersRepository.class);
            when(repository.findByTargetUserIdOrderBySubmittedAtIsoDesc(nullable(String.class))).thenAnswer(c->{
                if("fail".equals(c.getArgument(0)))throw new IllegalStateException("private db detail");
                return "empty".equals(c.getArgument(0))?List.of():rows();
            });
            return repository;
        }
        @Bean FeedbackDirectory owner(EventFeedbackAnswersRepository repository) {return new FeedbackDirectoryService(repository);}
    }
    static List<EventFeedbackAnswer> rows() {
        var answer=new EventFeedbackAnswer();
        answer.setId("id");
        answer.setSyncKey("syncKey");
        answer.setViewerUserId(MongoSessionModeContext.currentMode().name());
        answer.setEventId("eventId");
        answer.setCardId("cardId");
        answer.setKind("kind");
        answer.setTargetUserId("targetUserId");
        answer.setTargetRole("targetRole");
        answer.setPrimaryValue("primaryValue");
        answer.setSecondaryValue("secondaryValue");
        answer.setEventComment("eventComment");
        answer.setPersonalityTraitIds(Arrays.asList("one",null,"two"));
        answer.setTags(Arrays.asList("one",null,"two"));
        answer.setSubmittedAtIso("submittedAtIso");
        answer.setCreatedDate("createdDate");
        answer.setCreatedUser("createdUser");
        answer.setUpdatedDate("updatedDate");
        answer.setUpdatedUser(null);
        var second=new EventFeedbackAnswer();second.setId("second");
        return Arrays.asList(answer,null,second);
    }
}

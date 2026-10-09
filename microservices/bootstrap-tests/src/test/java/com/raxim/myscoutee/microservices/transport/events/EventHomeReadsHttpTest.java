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

import com.raxim.myscoutee.domain.events.api.EventHomeReads;
import com.raxim.myscoutee.domain.events.api.EventOwnership;
import com.raxim.myscoutee.domain.events.dto.EventHomeDto;
class EventHomeReadsHttpTest {
    static final String TOKEN = "test-only-home-reads-token-00000000000000000";
    static ConfigurableApplicationContext server;
    static RemoteEventHomeReads remote;
    static HttpClient http;
    static URI origin;
    static SimpleMeterRegistry meters;
    static Path evidence;
    static final AtomicInteger sequence = new AtomicInteger();
    @BeforeAll static void start() throws Exception {
        evidence = Path.of(System.getProperty("wireEvidenceDirectory"), "home-reads");
        Files.createDirectories(evidence);
        try (var files = Files.list(evidence)) {
            for (var file : files.filter(p -> p.getFileName().toString().matches("response-[0-9]+\\.json")).toList()) Files.delete(file);
        }
        server = new SpringApplicationBuilder(Fixture.class).properties(
                "server.address=127.0.0.1", "server.port=0", "management.server.port=0",
                "myscoutee.remote.home-reads.read-token=" + TOKEN,
                "spring.main.allow-bean-definition-overriding=false",
                "spring.main.banner-mode=off", "logging.level.root=WARN").run();
        origin = URI.create("http://127.0.0.1:" + server.getEnvironment().getProperty("local.server.port"));
        http = HttpClient.newBuilder().followRedirects(HttpClient.Redirect.NEVER).build();
        meters = new SimpleMeterRegistry();
        remote = new RemoteEventHomeReads(origin, TOKEN, true, Duration.ofSeconds(1), Duration.ofSeconds(3), new JsonMapper(), meters);
    }
    @AfterEach void clear() { MongoSessionModeContext.clear(); }
    @AfterAll static void stop() {
        if (remote != null) remote.close();
        if (http != null) http.shutdownNow();
        if (server != null) server.close();
        if (meters != null) meters.close();
    }
    @Test void focusedFieldsOrderNullsAndSessionModesSurviveHttp() throws Exception {
        var local=server.getBean(EventHomeReads.class);
        for (var mode:List.of(MongoSessionMode.REAL,MongoSessionMode.DEMO,MongoSessionMode.REAL)) {
            MongoSessionModeContext.set(mode);
            var expected=local.findBySourceId("known").stream().map(v->v==null?null:EventHomeDto.from(v)).toList();
            assertEquals(expected,remote.findBySourceId("known"));
            assertEquals(expected,remote.findHomeGameMemberProjections());
            assertEquals(mode.name(),remote.findBySourceId("known").getFirst().ownerUserId());
            for(var path:EventHomeReadsProtocol.paths()) {
                var response=request(path,"?sourceId=known",TOKEN,mode.name(),"GET");
                assertEquals(200,response.statusCode());
                assertFalse(response.body().contains("private-subtitle"));
                assertFalse(response.body().contains("pricing"));
            }
        }
    }
    @Test void emptyAndEncodedIdentifiersRetainMeaning() throws Exception {
        assertEquals(List.of(),remote.findBySourceId("empty"));
        assertEquals(200,request(EventHomeReadsProtocol.SOURCE,"?sourceId=empty",TOKEN,"REAL","GET").statusCode());
        var local=server.getBean(EventHomeReads.class);
        for(var id:Arrays.asList(null,"","event&é/?")) {remote.findBySourceId(id);verify(local).findBySourceId(id);}
    }
    @Test void everyReadRequiresCredentialModeAndGetAndEnforcesIdLimit() throws Exception {
        for(var path:EventHomeReadsProtocol.paths()) {
            for(var token:new String[]{null,"test-only-other-port-token-00000000000000000"})
                assertEquals(401,request(path,"",token,"REAL","GET").statusCode());
            for(var mode:new String[]{null,"demo","ANY"}) assertEquals(400,request(path,"",TOKEN,mode,"GET").statusCode());
            assertEquals(403,request(path,"",TOKEN,"REAL","POST").statusCode());
        }
        assertEquals(400,request(EventHomeReadsProtocol.SOURCE,"?sourceId="+"x".repeat(513),TOKEN,"REAL","GET").statusCode());
    }
    @Test void ownerFailureIsNotAnEmptyProjection() throws Exception {
        assertEquals(503,request(EventHomeReadsProtocol.SOURCE,"?sourceId=fail",TOKEN,"REAL","GET").statusCode());
        assertEquals(503,assertThrows(RemoteReadException.class,()->remote.findBySourceId("fail")).status());
        var owner=server.getBean(EventHomeReads.class);
        when(owner.findHomeGameMemberProjections()).thenThrow(new IllegalStateException("private db detail"));
        try {
            assertEquals(503,request(EventHomeReadsProtocol.HOME,"",TOKEN,"REAL","GET").statusCode());
            assertEquals(503,assertThrows(RemoteReadException.class,remote::findHomeGameMemberProjections).status());
        } finally { doAnswer(c->rows()).when(owner).findHomeGameMemberProjections(); }
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
    @Import({EventHomeReadsServerConfiguration.class,ServiceSecurityConfiguration.class})
    static class Fixture {
        @Bean EventHomeReads owner() {
            var owner=mock(EventHomeReads.class);
            doAnswer(c->{
                if("fail".equals(c.getArgument(0)))throw new IllegalStateException("private db detail");
                return "empty".equals(c.getArgument(0))?List.of():rows();
            }).when(owner).findBySourceId(nullable(String.class));
            doAnswer(c->rows()).when(owner).findHomeGameMemberProjections();
            return owner;
        }
    }
    static List<EventOwnership.Event> rows() {
        var event=mock(EventOwnership.Event.class);
        when(event.getSourceId()).thenReturn("source");when(event.getTitle()).thenReturn("Event title");when(event.getOwnerUserId()).thenReturn(MongoSessionModeContext.currentMode().name());
        when(event.getCreatorUserId()).thenReturn("creator");when(event.getAdmins()).thenReturn(Arrays.asList("admin",null));
        when(event.getAcceptedMemberUserIds()).thenReturn(List.of("one","two"));when(event.getAcceptedMembers()).thenReturn(2);
        when(event.getStatus()).thenReturn("A");when(event.getIsTrashed()).thenReturn(false);
        when(event.getCreatedDate()).thenReturn("created");when(event.getUpdatedDate()).thenReturn("updated");
        when(event.getStartAtIso()).thenReturn("start");when(event.getEndAtIso()).thenReturn(null);
        when(event.getSubtitle()).thenReturn("private-subtitle");
        return Arrays.asList(event,null);
    }
}

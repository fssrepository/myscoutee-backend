package com.raxim.myscoutee.microservices.transport.affinity;

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

import com.raxim.myscoutee.domain.affinity.document.UserAffinityEdge;
import com.raxim.myscoutee.domain.affinity.repository.UserAffinityEdgesRepository;
import com.raxim.myscoutee.domain.affinity.service.EdgeDirectoryService;
import com.raxim.myscoutee.domain.affinity.dto.AffinityEdgeDto;
class EdgeDirectoryHttpTest {
    static final String TOKEN = "test-only-edge-directory-token-00000000000000000";
    static ConfigurableApplicationContext server;
    static RemoteEdgeDirectory remote;
    static HttpClient http;
    static URI origin;
    static SimpleMeterRegistry meters;
    static Path evidence;
    static final AtomicInteger sequence = new AtomicInteger();
    @BeforeAll static void start() throws Exception {
        evidence = Path.of(System.getProperty("wireEvidenceDirectory"), "edge-directory");
        Files.createDirectories(evidence);
        try (var files = Files.list(evidence)) {
            for (var file : files.filter(p -> p.getFileName().toString().matches("response-[0-9]+\\.json")).toList()) Files.delete(file);
        }
        server = new SpringApplicationBuilder(Fixture.class).properties(
                "server.address=127.0.0.1", "server.port=0", "management.server.port=0",
                "myscoutee.remote.edge-directory.read-token=" + TOKEN,
                "spring.main.allow-bean-definition-overriding=false",
                "spring.main.banner-mode=off", "logging.level.root=WARN").run();
        origin = URI.create("http://127.0.0.1:" + server.getEnvironment().getProperty("local.server.port"));
        http = HttpClient.newBuilder().followRedirects(HttpClient.Redirect.NEVER).build();
        meters = new SimpleMeterRegistry();
        remote = new RemoteEdgeDirectory(origin, TOKEN, true, Duration.ofSeconds(1), Duration.ofSeconds(3), new JsonMapper(), meters);
    }
    @AfterEach void clear() { MongoSessionModeContext.clear(); }
    @AfterAll static void stop() {
        if (remote != null) remote.close();
        if (http != null) http.shutdownNow();
        if (server != null) server.close();
        if (meters != null) meters.close();
    }
    @Test void canonicalViewSurvivesBothModesWithoutPrivateEvidence() throws Exception {
        var local=server.getBean(EdgeDirectoryService.class);
        var mapper=new JsonMapper();
        for(var mode:List.of(MongoSessionMode.REAL,MongoSessionMode.DEMO,MongoSessionMode.REAL)) {
            MongoSessionModeContext.set(mode);
            assertEquals(local.findAll().stream().map(AffinityEdgeDto::from).toList(),remote.findAll());
            assertEquals(local.findRelevantByUserIds(List.of("known")).stream().map(AffinityEdgeDto::from).toList(),remote.findRelevantByUserIds(List.of("known")));
            assertEquals(mode.name(),remote.findAll().getFirst().leftUserId());
            assertEquals(8.125,remote.findAll().getFirst().affinityScore());
            assertNull(remote.findAll().getFirst().updatedDate());
            for(var path:EdgeDirectoryProtocol.paths()) {
                var response=request(path,TOKEN,mode.name(),method(path),path.equals(EdgeDirectoryProtocol.ALL)?null:"{\"ids\":[\"known\"]}","application/json");
                assertEquals(200,response.statusCode());assertFalse(response.body().contains("evidence"));
                assertEquals(7,mapper.readTree(response.body()).get(0).size());
            }
        }
    }
    @Test void nullEmptyAndOrderedIdentifiersKeepCanonicalMeaning() throws Exception {
        var repository=server.getBean(UserAffinityEdgesRepository.class);
        for(var ids:Arrays.asList(null,List.<String>of(),Arrays.asList(null,"","id&é/?","id&é/?"))) {
            remote.findRelevantByUserIds(ids);verify(repository).findRelevantByUserIds(ids);
        }
        assertTrue(remote.findRelevantByUserIds(List.of("empty")).isEmpty());
        assertEquals(200,request(EdgeDirectoryProtocol.RELEVANT,TOKEN,"REAL","POST","{\"ids\":[\"empty\"]}","application/json").statusCode());
        assertThrows(IllegalArgumentException.class,()->remote.findRelevantByUserIds(Collections.nCopies(4097,"id")));
    }
    @Test void credentialModeMethodAndStrictQueryBoundsAreEnforced() throws Exception {
        for(var path:EdgeDirectoryProtocol.paths()) {
            for(var token:new String[]{null,"test-only-queue-token-0000000000000000000000000000"})
                assertEquals(401,request(path,token,"REAL",method(path),"{\"ids\":[]}","application/json").statusCode());
            for(var mode:new String[]{null,"demo","ANY"})
                assertEquals(400,request(path,TOKEN,mode,method(path),"{\"ids\":[]}","application/json").statusCode());
            assertEquals(403,request(path,TOKEN,"REAL","DELETE",null,null).statusCode());
        }
        for(var body:List.of("{}","{\"ids\":[1]}","{\"ids\":[],\"extra\":true}","{\"ids\":[\""+"x".repeat(513)+"\"]}",new JsonMapper().writeValueAsString(Map.of("ids",Collections.nCopies(4097,"id")))))
            assertEquals(400,request(EdgeDirectoryProtocol.RELEVANT,TOKEN,"REAL","POST",body,"application/json").statusCode());
        assertEquals(415,request(EdgeDirectoryProtocol.RELEVANT,TOKEN,"REAL","POST","{\"ids\":[]}","text/plain").statusCode());
        assertEquals(413,request(EdgeDirectoryProtocol.RELEVANT,TOKEN,"REAL","POST"," ".repeat(EdgeDirectoryProtocol.MAX_QUERY_BYTES+1),"application/json").statusCode());
    }
    @Test void ownerFailureDoesNotBecomeAnEmptyNetwork() throws Exception {
        assertEquals(503,request(EdgeDirectoryProtocol.RELEVANT,TOKEN,"REAL","POST","{\"ids\":[\"fail\"]}","application/json").statusCode());
        assertEquals(503,assertThrows(RemoteReadException.class,()->remote.findRelevantByUserIds(List.of("fail"))).status());
    }
    static String method(String path) {return path.equals(EdgeDirectoryProtocol.ALL)?"GET":"POST";}
    static HttpResponse<String> request(String path,String token,String mode,String method,String body,String contentType) throws Exception {
        var builder=HttpRequest.newBuilder(origin.resolve(path)).timeout(Duration.ofSeconds(3));
        if(token!=null)builder.header("Authorization","Bearer "+token);
        if(mode!=null)builder.header(InternalReadCredentialFilter.MODE_HEADER,mode);
        if(contentType!=null)builder.header("Content-Type",contentType);
        var response=http.send(builder.method(method,body==null?HttpRequest.BodyPublishers.noBody():HttpRequest.BodyPublishers.ofString(body)).build(),HttpResponse.BodyHandlers.ofString());
        assertEquals("no-store",response.headers().firstValue("Cache-Control").orElseThrow());
        Files.writeString(evidence.resolve("response-"+sequence.incrementAndGet()+".json"),new JsonMapper().writeValueAsString(
                Map.of("path",path,"method",method(path).toLowerCase(Locale.ROOT),"status",response.statusCode(),"body",new JsonMapper().readTree(response.body()))));
        return response;
    }
    @SpringBootConfiguration
    @EnableAutoConfiguration(excludeName={
            "org.springframework.boot.mongodb.autoconfigure.MongoAutoConfiguration",
            "org.springframework.boot.data.mongodb.autoconfigure.DataMongoAutoConfiguration",
            "org.springframework.boot.data.mongodb.autoconfigure.DataMongoRepositoriesAutoConfiguration",
            "org.springframework.boot.security.autoconfigure.UserDetailsServiceAutoConfiguration"})
    @Import({EdgeDirectoryServerConfiguration.class,ServiceSecurityConfiguration.class})
    static class Fixture {
        @Bean UserAffinityEdgesRepository repository() {
            var repository=mock(UserAffinityEdgesRepository.class);
            when(repository.findAll()).thenAnswer(c->List.of(edge()));
            when(repository.findRelevantByUserIds(nullable(List.class))).thenAnswer(c->{
                var ids=c.getArgument(0);
                if(List.of("fail").equals(ids))throw new IllegalStateException("private db details");
                return List.of("empty").equals(ids)?List.of():List.of(edge());
            });
            return repository;
        }
        @Bean EdgeDirectoryService edges(UserAffinityEdgesRepository repository) {return new EdgeDirectoryService(repository);}
    }
    static UserAffinityEdge edge() {
        var edge=new UserAffinityEdge();edge.setId("edge");edge.setPairKey("pair");
        edge.setLeftUserId(MongoSessionModeContext.currentMode().name());edge.setRightUserId("peer");
        edge.setAffinityScore(8.125);edge.setEdgeWeight(1.875);edge.setUpdatedDate(null);
        edge.setEvidence(new UserAffinityEdge.EvidenceSummary());return edge;
    }
}

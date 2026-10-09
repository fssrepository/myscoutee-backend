package com.raxim.myscoutee.microservices.transport.accounts;

import com.raxim.myscoutee.common.config.mongo.*;
import com.raxim.myscoutee.microservices.bootstrap.ServiceSecurityConfiguration;
import com.raxim.myscoutee.microservices.transport.common.InternalReadCredentialFilter;
import com.raxim.myscoutee.microservices.transport.common.RemoteReadTransport.RemoteReadException;
import io.micrometer.core.instrument.simple.SimpleMeterRegistry;
import java.net.URI;
import java.net.http.*;
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

class RatingProfilesHttpTest {
    static final String TOKEN="test-only-rating-profiles-token-00000000000000000000";
    static final JsonMapper mapper=new JsonMapper();
    static ConfigurableApplicationContext server;
    static RemoteRatingProfiles remote;
    static HttpClient http;
    static URI origin;
    static SimpleMeterRegistry meters;
    static Path evidence;
    static final AtomicInteger sequence=new AtomicInteger();
    @BeforeAll static void start() throws Exception {
        evidence=Path.of(System.getProperty("wireEvidenceDirectory"),"rating-profiles");Files.createDirectories(evidence);
        try(var files=Files.list(evidence)) {
            for(var file:files.filter(p->p.getFileName().toString().matches("response-[0-9]+\\.json")).toList())Files.delete(file);
        }
        server=new SpringApplicationBuilder(Fixture.class).properties("server.address=127.0.0.1","server.port=0","management.server.port=0",
                "myscoutee.remote.rating-profiles.read-token="+TOKEN,"spring.main.banner-mode=off","logging.level.root=WARN").run();
        origin=URI.create("http://127.0.0.1:"+server.getEnvironment().getProperty("local.server.port"));
        http=HttpClient.newBuilder().followRedirects(HttpClient.Redirect.NEVER).build();meters=new SimpleMeterRegistry();
        remote=new RemoteRatingProfiles(origin,TOKEN,true,Duration.ofSeconds(1),Duration.ofSeconds(3),mapper,meters);
    }
    @AfterEach void clear(){MongoSessionModeContext.clear();}
    @AfterAll static void stop(){if(remote!=null)remote.close();if(http!=null)http.shutdownNow();if(server!=null)server.close();if(meters!=null)meters.close();}
    @Test void factsModesNullCoordinatesAndBatchOrderSurviveHttp() throws Exception {
        var local=server.getBean(com.raxim.myscoutee.domain.accounts.api.RatingProfiles.class);
        var ids=Arrays.asList("visible", "hidden", null, "absent", "visible");
        for(var mode:List.of(MongoSessionMode.REAL,MongoSessionMode.DEMO,MongoSessionMode.REAL)) {
            MongoSessionModeContext.set(mode);
            assertEquals(local.queryRatingProfiles(ids),remote.queryRatingProfiles(ids));
            var result=request(mapper.writeValueAsString(Map.of("ids",ids)),TOKEN,mode.name(),"POST","application/json");
            assertEquals(200,result.statusCode());
            assertEquals(mode,MongoSessionModeContext.currentMode());
        }
        assertEquals(List.of(),remote.queryRatingProfiles(List.of()));
        assertEquals(List.of(),remote.queryRatingProfiles(null));
        assertEquals(200,request("{\"ids\":null}",TOKEN,"REAL","POST","application/json").statusCode());
    }
    @Test void oneBatchRetainsDuplicatesNullsAndEncodedIds() {
        var owner=server.getBean(com.raxim.myscoutee.domain.accounts.api.RatingProfiles.class);clearInvocations(owner);
        var ids=Arrays.asList("id&é/?",null,"", "id&é/?");remote.queryRatingProfiles(ids);
        verify(owner).queryRatingProfiles(ids);verifyNoMoreInteractions(owner);
    }
    @Test void credentialsModeMethodsJsonAndBoundsAreEnforced() throws Exception {
        for(var token:new String[]{null,"wrong-capability-000000000000000000000000"})
            assertEquals(401,request("{\"ids\":[]}",token,"REAL","POST","application/json").statusCode());
        for(var mode:new String[]{null,"demo","ANY"})
            assertEquals(400,request("{\"ids\":[]}",TOKEN,mode,"POST","application/json").statusCode());
        assertEquals(403,request("",TOKEN,"REAL","GET","application/json").statusCode());
        for(var invalid:List.of("null","[]","{}","{} {}","{\"ids\":{},\"extra\":true}","{\"ids\":[3]}","{\"ids\":[\""+"x".repeat(513)+"\"]}",mapper.writeValueAsString(Map.of("ids",Collections.nCopies(4097,"x")))))
            assertEquals(400,request(invalid,TOKEN,"REAL","POST","application/json").statusCode());
        assertEquals(415,request("{}",TOKEN,"REAL","POST","text/plain").statusCode());
        assertEquals(413,request("x".repeat(1024*1024+1),TOKEN,"REAL","POST","application/json").statusCode());
        assertThrows(IllegalArgumentException.class,()->remote.queryRatingProfiles(Collections.nCopies(4097,"x")));
    }
    @Test void ownerFailureIsNotAnEmptyResult() throws Exception {
        assertEquals(503,request("{\"ids\":[\"fail\"]}",TOKEN,"REAL","POST","application/json").statusCode());
        assertEquals(503,assertThrows(RemoteReadException.class,()->remote.queryRatingProfiles(List.of("fail"))).status());
    }
    static HttpResponse<String> request(String body,String token,String mode,String method,String media) throws Exception {
        var builder=HttpRequest.newBuilder(origin.resolve(RatingProfilesProtocol.PATH)).timeout(Duration.ofSeconds(3)).header("Content-Type",media);
        if(token!=null)builder.header("Authorization","Bearer "+token);
        if(mode!=null)builder.header(InternalReadCredentialFilter.MODE_HEADER,mode);
        var response=http.send(builder.method(method,HttpRequest.BodyPublishers.ofString(body)).build(),HttpResponse.BodyHandlers.ofString());
        assertEquals("no-store",response.headers().firstValue("Cache-Control").orElseThrow());
        Files.writeString(evidence.resolve("response-"+sequence.incrementAndGet()+".json"),mapper.writeValueAsString(Map.of(
                "path",RatingProfilesProtocol.PATH,"method","post","status",response.statusCode(),"body",mapper.readTree(response.body()))));
        return response;
    }
    @SpringBootConfiguration
    @EnableAutoConfiguration(excludeName={"org.springframework.boot.mongodb.autoconfigure.MongoAutoConfiguration",
            "org.springframework.boot.data.mongodb.autoconfigure.DataMongoAutoConfiguration",
            "org.springframework.boot.data.mongodb.autoconfigure.DataMongoRepositoriesAutoConfiguration",
            "org.springframework.boot.security.autoconfigure.UserDetailsServiceAutoConfiguration"})
    @Import({RatingProfilesServerConfiguration.class,ServiceSecurityConfiguration.class})
    static class Fixture {
        @Bean com.raxim.myscoutee.domain.accounts.api.RatingProfiles owner() {
            var owner=mock(com.raxim.myscoutee.domain.accounts.api.RatingProfiles.class);
            when(owner.queryRatingProfiles(nullable(Collection.class))).thenAnswer(call->{
                Collection<String> ids=call.getArgument(0);if(ids==null)return List.of();
                if(ids.contains("fail"))throw new IllegalStateException("private owner failure");
                return ids.stream().filter(id->!"absent".equals(id)).map(id->id==null?null:
                        new com.raxim.myscoutee.domain.accounts.dto.RatingProfileDto(id,id,MongoSessionModeContext.currentMode().name(),
                            "hidden".equals(id)?null:new com.raxim.myscoutee.common.dto.SharedDtos.LocationCoordinatesDto(47.5d,19d),!"hidden".equals(id))).toList();
            });return owner;
        }
    }
}

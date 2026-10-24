package com.raxim.myscoutee.microservices.transport.assets;

import java.net.*;
import java.net.http.*;
import java.nio.file.*;
import java.time.Duration;
import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;
import com.raxim.myscoutee.common.config.mongo.*;
import com.raxim.myscoutee.domain.assets.api.AssetJobScopes;
import com.raxim.myscoutee.domain.assets.dto.AssetJobScopeDto;
import com.raxim.myscoutee.domain.events.api.EventJobScopes;
import com.raxim.myscoutee.domain.events.dto.EventJobScopeDto;
import com.raxim.myscoutee.microservices.transport.events.*;
import com.raxim.myscoutee.microservices.bootstrap.ServiceSecurityConfiguration;
import com.raxim.myscoutee.microservices.transport.common.RemoteReadTransport.RemoteReadException;
import io.micrometer.core.instrument.simple.SimpleMeterRegistry;
import org.junit.jupiter.api.*;
import org.springframework.boot.*;
import org.springframework.boot.autoconfigure.*;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.context.*;
import org.springframework.context.annotation.*;
import static org.junit.jupiter.api.Assertions.*;

class JobScopesHttpTest {
    static final String TOKEN="test-only-job-scope-read-token-000000000000000000000";
    static final AtomicInteger sequence=new AtomicInteger();
    static final tools.jackson.databind.ObjectMapper mapper=new com.raxim.myscoutee.common.config.JsonConfig().objectMapper();
    static ConfigurableApplicationContext server;
    static RemoteAssetJobScopes assets;
    static RemoteEventJobScopes events;
    static SimpleMeterRegistry meters;
    static HttpClient http;
    static URI origin;
    static Path evidence;
    @BeforeAll static void start() throws Exception {
        evidence=Path.of(System.getProperty("wireEvidenceDirectory"));
        for(var directory:List.of("assets-job-scopes","events-job-scopes")) {
            var folder=evidence.resolve(directory);Files.createDirectories(folder);
            try(var files=Files.list(folder)){for(var file:files.filter(p->p.getFileName().toString().startsWith("response-")).toList())Files.delete(file);}
        }
        server=new SpringApplicationBuilder(Fixture.class).properties("server.address=127.0.0.1","server.port=0","management.server.port=0",
                "myscoutee.remote.assets-job-scopes.read-token="+TOKEN,"myscoutee.remote.events-job-scopes.read-token="+TOKEN,
                "spring.main.banner-mode=off","logging.level.root=WARN").run();
        origin=URI.create("http://127.0.0.1:"+server.getEnvironment().getProperty("local.server.port"));
        http=HttpClient.newBuilder().followRedirects(HttpClient.Redirect.NEVER).build();meters=new SimpleMeterRegistry();
        assets=new RemoteAssetJobScopes(origin,TOKEN,true,Duration.ofSeconds(1),Duration.ofSeconds(3),mapper,meters);
        events=new RemoteEventJobScopes(origin,TOKEN,true,Duration.ofSeconds(1),Duration.ofSeconds(3),mapper,meters);
    }
    @AfterEach void clear(){MongoSessionModeContext.clear();}
    @AfterAll static void stop(){if(assets!=null)assets.close();if(events!=null)events.close();if(http!=null)http.shutdownNow();if(server!=null)server.close();if(meters!=null)meters.close();}
    @Test void storedOwnershipNullsAndAbsenceRemainDistinctInBothModes() throws Exception {
        for(var mode:List.of(MongoSessionMode.REAL,MongoSessionMode.DEMO)) {
            MongoSessionModeContext.set(mode);
            assertEquals(new AssetJobScopeDto(mode.name(),"owner","creator"),assets.findJobScope("known"));
            assertEquals(new EventJobScopeDto(mode.name(),"owner","creator"),events.findJobScope("known"));
            assertEquals(new AssetJobScopeDto(null,null,null),assets.findJobScope("unset"));
            assertEquals(new EventJobScopeDto(null,null,null),events.findJobScope("unset"));
            assertNull(assets.findJobScope("missing"));assertNull(events.findJobScope("missing"));
            for(var path:List.of(AssetJobScopesProtocol.PATH,EventJobScopesProtocol.PATH))
                for(var id:List.of("known","unset","missing"))
                    assertEquals(id.equals("missing")?404:200,request(path,"?id="+id,TOKEN,mode.name(),"GET").statusCode());
        }
        assertEquals("owner",assets.findJobScope("encoded&é/?").ownerUserId());
        assertEquals("owner",events.findJobScope("encoded&é/?").ownerUserId());
    }
    @Test void credentialsModesMethodsAndBoundsAreEnforcedBeforeTheRead() throws Exception {
        for(var path:List.of(AssetJobScopesProtocol.PATH,EventJobScopesProtocol.PATH)) {
            assertEquals(401,request(path,"",null,"REAL","GET").statusCode());
            assertEquals(400,request(path,"",TOKEN,"unknown","GET").statusCode());
            assertEquals(403,request(path,"",TOKEN,"REAL","POST").statusCode());
            assertEquals(400,request(path,"?id="+"a".repeat(513),TOKEN,"REAL","GET").statusCode());
        }
        assertThrows(IllegalArgumentException.class,()->assets.findJobScope("a".repeat(513)));
        assertThrows(IllegalArgumentException.class,()->events.findJobScope("a".repeat(513)));
    }
    @Test void ownerFailureNeverBecomesAnUnscopedMissingResource() throws Exception {
        for(var path:List.of(AssetJobScopesProtocol.PATH,EventJobScopesProtocol.PATH)) {
            var response=request(path,"?id=fail",TOKEN,"REAL","GET");assertEquals(503,response.statusCode());
            assertFalse(response.body().contains("private"));
        }
        assertEquals(503,assertThrows(RemoteReadException.class,()->assets.findJobScope("fail")).status());
        assertEquals(503,assertThrows(RemoteReadException.class,()->events.findJobScope("fail")).status());
    }
    static HttpResponse<String> request(String path,String query,String credential,String mode,String method) throws Exception {
        var builder=HttpRequest.newBuilder(origin.resolve(path+query)).timeout(Duration.ofSeconds(5));
        if(credential!=null)builder.header("Authorization","Bearer "+credential);
        if(mode!=null)builder.header("X-MyScoutee-Session-Mode",mode);
        var result=http.send(builder.method(method,HttpRequest.BodyPublishers.noBody()).build(),HttpResponse.BodyHandlers.ofString());
        assertEquals("no-store",result.headers().firstValue("Cache-Control").orElseThrow());
        var directory=evidence.resolve(path.equals(AssetJobScopesProtocol.PATH)?"assets-job-scopes":"events-job-scopes");
        Files.writeString(directory.resolve("response-"+sequence.incrementAndGet()+".json"),mapper.writeValueAsString(Map.of("path",path,"method","get","status",result.statusCode(),"body",mapper.readTree(result.body()))));
        return result;
    }
    @SpringBootConfiguration
    @EnableAutoConfiguration(excludeName={"org.springframework.boot.mongodb.autoconfigure.MongoAutoConfiguration","org.springframework.boot.data.mongodb.autoconfigure.DataMongoAutoConfiguration","org.springframework.boot.data.mongodb.autoconfigure.DataMongoRepositoriesAutoConfiguration","org.springframework.boot.security.autoconfigure.UserDetailsServiceAutoConfiguration"})
    @Import({com.raxim.myscoutee.common.config.JsonConfig.class,AssetJobScopesServerConfiguration.class,EventJobScopesServerConfiguration.class,ServiceSecurityConfiguration.class})
    static class Fixture {
        @Bean AssetJobScopes assets(){return id->{
            if("fail".equals(id))throw new IllegalStateException("private owner detail");
            return "missing".equals(id)?null:"unset".equals(id)?new AssetJobScopeDto(null,null,null):new AssetJobScopeDto(MongoSessionModeContext.currentMode().name(),"owner","creator");
        };}
        @Bean EventJobScopes events(){return id->{
            if("fail".equals(id))throw new IllegalStateException("private owner detail");
            return "missing".equals(id)?null:"unset".equals(id)?new EventJobScopeDto(null,null,null):new EventJobScopeDto(MongoSessionModeContext.currentMode().name(),"owner","creator");
        };}
    }
}

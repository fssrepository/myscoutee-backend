package com.raxim.myscoutee.microservices.transport.affinity;

import java.net.*;
import java.net.http.*;
import java.nio.file.*;
import java.time.Duration;
import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;
import com.raxim.myscoutee.common.config.mongo.*;
import com.raxim.myscoutee.domain.affinity.document.AffinityConfig;
import com.raxim.myscoutee.domain.affinity.dto.ConfigurationSettingsDto;
import com.raxim.myscoutee.domain.affinity.repository.AffinityConfigsRepository;
import com.raxim.myscoutee.domain.affinity.service.ConfigurationCatalogService;
import com.raxim.myscoutee.microservices.bootstrap.ServiceSecurityConfiguration;
import com.raxim.myscoutee.microservices.transport.common.RemoteReadTransport.RemoteReadException;
import io.micrometer.core.instrument.simple.SimpleMeterRegistry;
import org.junit.jupiter.api.*;
import org.springframework.boot.*;
import org.springframework.boot.autoconfigure.*;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.context.*;
import org.springframework.context.annotation.*;
import org.springframework.data.mongodb.core.MongoTemplate;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import static org.mockito.ArgumentMatchers.*;

class ConfigurationCatalogHttpTest {
    static final String TOKEN="test-only-configuration-read-token-000000000000000000000";
    static final tools.jackson.databind.ObjectMapper mapper=new com.raxim.myscoutee.common.config.JsonConfig().objectMapper();
    static final AtomicInteger sequence=new AtomicInteger();
    static ConfigurableApplicationContext server;
    static RemoteConfigurationCatalog remote;
    static SimpleMeterRegistry meters;
    static HttpClient http;
    static URI origin;
    static Path evidence;
    @BeforeAll static void start() throws Exception {
        evidence=Path.of(System.getProperty("wireEvidenceDirectory"),"configuration-catalog");Files.createDirectories(evidence);
        try(var files=Files.list(evidence)){for(var file:files.filter(p->p.getFileName().toString().startsWith("response-")).toList())Files.delete(file);}
        server=new SpringApplicationBuilder(Fixture.class).properties("server.address=127.0.0.1","server.port=0","management.server.port=0",
                "myscoutee.remote.configuration-catalog.read-token="+TOKEN,"spring.main.banner-mode=off","logging.level.root=WARN").run();
        origin=URI.create("http://127.0.0.1:"+server.getEnvironment().getProperty("local.server.port"));
        meters=new SimpleMeterRegistry();http=HttpClient.newBuilder().followRedirects(HttpClient.Redirect.NEVER).build();
        remote=new RemoteConfigurationCatalog(origin,TOKEN,true,Duration.ofSeconds(1),Duration.ofSeconds(3),mapper,meters);
    }
    @AfterEach void clear(){MongoSessionModeContext.clear();}
    @AfterAll static void stop(){if(remote!=null)remote.close();if(http!=null)http.shutdownNow();if(server!=null)server.close();if(meters!=null)meters.close();}
    @Test void canonicalActiveLatestAndDefaultSelectionSurviveBothModes() throws Exception {
        var owner=server.getBean(ConfigurationCatalogService.class);
        for(var mode:List.of(MongoSessionMode.REAL,MongoSessionMode.DEMO)) {
            MongoSessionModeContext.set(mode);
            for(var key:Arrays.asList("active","inactive","missing",null,"")) {
                assertEquals(ConfigurationSettingsDto.from(owner.active(key)),remote.active(key));
                assertEquals(200,request(ConfigurationCatalogProtocol.ACTIVE,key==null?"":"?key="+key,TOKEN,mode.name(),"GET").statusCode());
            }
            assertEquals(mode.name()+"-active",remote.active("active").key());
            assertEquals(mode.name()+"-inactive",remote.active("inactive").key());
            assertEquals(ConfigurationSettingsDto.from(AffinityConfig.defaults()),remote.active("missing"));
        }
    }
    @Test void idReadsKeepDefaultsNullsAndAbsenceWithoutExposingPersistence() throws Exception {
        var owner=server.getBean(ConfigurationCatalogService.class);
        for(var mode:List.of(MongoSessionMode.REAL,MongoSessionMode.DEMO)) {
            MongoSessionModeContext.set(mode);
            for(var id:List.of("known","unset","missing")) {
                assertEquals(ConfigurationSettingsDto.from(owner.find(id)),remote.find(id));
                var response=request(ConfigurationCatalogProtocol.FIND,"?id="+id,TOKEN,mode.name(),"GET");
                assertEquals(id.equals("missing")?404:200,response.statusCode());
                assertFalse(response.body().contains("private-audit-metadata"));assertFalse(response.body().contains("userWeights"));
                assertFalse(response.body().contains("mongo-id"));
            }
        }
        var known=remote.find("known");assertEquals(23,known.jobs().getBatchSize());assertEquals(7,known.notifications().getMaxWorkers());
        assertNull(remote.find("unset").key());
    }
    @Test void credentialsModesMethodsAndBoundsAreEnforced() throws Exception {
        for(var path:ConfigurationCatalogProtocol.paths()) {
            assertEquals(401,request(path,"",null,"REAL","GET").statusCode());
            assertEquals(400,request(path,"",TOKEN,"invalid","GET").statusCode());
            assertEquals(403,request(path,"",TOKEN,"REAL","POST").statusCode());
            String parameter=path.equals(ConfigurationCatalogProtocol.ACTIVE)?"key":"id";
            assertEquals(400,request(path,"?"+parameter+"="+"a".repeat(513),TOKEN,"REAL","GET").statusCode());
        }
        assertThrows(IllegalArgumentException.class,()->remote.find("a".repeat(513)));
    }
    @Test void unavailableOwnerDoesNotBecomeDefaultsOrMissing() throws Exception {
        for(var path:ConfigurationCatalogProtocol.paths()) {
            String parameter=path.equals(ConfigurationCatalogProtocol.ACTIVE)?"key":"id";
            var response=request(path,"?"+parameter+"=fail",TOKEN,"REAL","GET");
            assertEquals(503,response.statusCode());assertFalse(response.body().contains("private"));
        }
        assertEquals(503,assertThrows(RemoteReadException.class,()->remote.find("fail")).status());
        assertEquals(503,assertThrows(RemoteReadException.class,()->remote.active("fail")).status());
    }
    static AffinityConfig config(String id) {
        if("missing".equals(id))return null;
        if("fail".equals(id))throw new IllegalStateException("private database details");
        var value=new AffinityConfig();value.setId("mongo-id");value.setChangedDate("private-audit-metadata");
        value.setKey("unset".equals(id)?null:MongoSessionModeContext.currentMode().name()+"-"+id);
        if(!"unset".equals(id)) {
            var notifications=new AffinityConfig.NotificationParameters();notifications.setMaxWorkers(7);value.setNotifications(notifications);
            var jobs=new AffinityConfig.JobParameters();jobs.setBatchSize(23);value.setJobs(jobs);
        }
        return value;
    }
    static HttpResponse<String> request(String path,String query,String credential,String mode,String method) throws Exception {
        var builder=HttpRequest.newBuilder(origin.resolve(path+query)).timeout(Duration.ofSeconds(5));
        if(credential!=null)builder.header("Authorization","Bearer "+credential);
        if(mode!=null)builder.header("X-MyScoutee-Session-Mode",mode);
        var result=http.send(builder.method(method,HttpRequest.BodyPublishers.noBody()).build(),HttpResponse.BodyHandlers.ofString());
        assertEquals("no-store",result.headers().firstValue("Cache-Control").orElseThrow());
        Files.writeString(evidence.resolve("response-"+sequence.incrementAndGet()+".json"),mapper.writeValueAsString(Map.of("path",path,"method","get","status",result.statusCode(),"body",mapper.readTree(result.body()))));
        return result;
    }
    @SpringBootConfiguration
    @EnableAutoConfiguration(excludeName={"org.springframework.boot.mongodb.autoconfigure.MongoAutoConfiguration","org.springframework.boot.data.mongodb.autoconfigure.DataMongoAutoConfiguration","org.springframework.boot.data.mongodb.autoconfigure.DataMongoRepositoriesAutoConfiguration","org.springframework.boot.security.autoconfigure.UserDetailsServiceAutoConfiguration"})
    @Import({com.raxim.myscoutee.common.config.JsonConfig.class,ConfigurationCatalogServerConfiguration.class,ConfigurationCatalogService.class,ServiceSecurityConfiguration.class})
    static class Fixture {
        @Bean AffinityConfigsRepository configurations() {
            var repository=mock(AffinityConfigsRepository.class);
            when(repository.findFirstByKeyAndActiveTrueOrderByVersionDesc(nullable(String.class))).thenAnswer(c->{
                String key=c.getArgument(0);return "active".equals(key)?Optional.of(config("active")):Optional.empty();
            });
            when(repository.findFirstByKeyOrderByVersionDesc(nullable(String.class))).thenAnswer(c->{
                String key=c.getArgument(0);return "inactive".equals(key)?Optional.of(config("inactive")):"fail".equals(key)?Optional.ofNullable(config("fail")):Optional.empty();
            });
            return repository;
        }
        @Bean MongoTemplate mongo(){var mongo=mock(MongoTemplate.class);when(mongo.findById(nullable(String.class),eq(AffinityConfig.class))).thenAnswer(c->config(c.getArgument(0)));return mongo;}
    }
}

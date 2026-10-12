package com.raxim.myscoutee.microservices.transport.affinity;

import com.raxim.myscoutee.common.config.mongo.*;
import com.raxim.myscoutee.domain.affinity.api.UserAffinityChanges;
import com.raxim.myscoutee.domain.affinity.config.AffinityRecomputeProperties;
import com.raxim.myscoutee.domain.affinity.document.AffinityRecomputeTask;
import com.raxim.myscoutee.domain.affinity.repository.AffinityRecomputeTasksRepository;
import com.raxim.myscoutee.domain.affinity.service.AffinityRecomputeTaskService;
import com.raxim.myscoutee.domain.platform.api.JobAudience;
import com.raxim.myscoutee.microservices.bootstrap.ServiceSecurityConfiguration;
import com.raxim.myscoutee.microservices.transport.common.InternalReadCredentialFilter;
import com.raxim.myscoutee.microservices.transport.common.RemoteCommandTransport.OutcomeUnknownException;
import io.micrometer.core.instrument.simple.SimpleMeterRegistry;
import java.net.*;
import java.net.http.*;
import java.nio.file.*;
import java.time.Duration;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;
import org.junit.jupiter.api.*;
import org.springframework.boot.SpringBootConfiguration;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.index.IndexOperations;
import tools.jackson.databind.json.JsonMapper;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

class UserAffinityChangesHttpTest {
    static final String TOKEN="test-only-accounts-change-signal-token-000000000000000000";
    static final JsonMapper mapper=new JsonMapper();
    static final Map<String,AffinityRecomputeTask> stored=new ConcurrentHashMap<>();
    static ConfigurableApplicationContext server;
    static RemoteUserAffinityChanges remote;
    static HttpClient http;
    static URI origin;
    static SimpleMeterRegistry meters;
    static Path evidence;
    static final AtomicInteger sequence=new AtomicInteger();
    @BeforeAll static void start() throws Exception {
        evidence=Path.of(System.getProperty("wireEvidenceDirectory"),"user-affinity-changes");Files.createDirectories(evidence);
        try(var files=Files.list(evidence)) {
            for(var file:files.filter(p->p.getFileName().toString().matches("response-[0-9]+\\.json")).toList())Files.delete(file);
        }
        server=new SpringApplicationBuilder(Fixture.class).properties("server.address=127.0.0.1","server.port=0","management.server.port=0",
                "myscoutee.remote.user-affinity-changes.command-token="+TOKEN,"spring.main.banner-mode=off","logging.level.root=WARN").run();
        origin=URI.create("http://127.0.0.1:"+server.getEnvironment().getProperty("local.server.port"));
        http=HttpClient.newBuilder().followRedirects(HttpClient.Redirect.NEVER).build();meters=new SimpleMeterRegistry();
        remote=new RemoteUserAffinityChanges(origin,TOKEN,true,Duration.ofSeconds(1),Duration.ofSeconds(3),mapper,meters);
    }
    @AfterEach void clear(){MongoSessionModeContext.clear();stored.clear();}
    @AfterAll static void stop(){if(remote!=null)remote.close();if(http!=null)http.shutdownNow();if(server!=null)server.close();if(meters!=null)meters.close();}
    @Test void producerSignalUsesNativeCollapsedQueueWithoutAnEndUserPrincipal() throws Exception {
        for(var mode:List.of(MongoSessionMode.REAL,MongoSessionMode.DEMO)) {
            MongoSessionModeContext.set(mode);
            var first=remote.enqueueUserChanged(" user&é/? ");
            var original=stored.get(mode.name()+":USER:user&é/?");
            String id=original.getId(),created=original.getCreatedDate();
            var second=remote.enqueueAdminStatusChanged("user&é/?");
            assertEquals(first.taskKey(),second.taskKey());assertEquals("pending",second.status());
            var merged=stored.get(mode.name()+":USER:user&é/?");
            assertEquals(id,merged.getId());assertEquals(created,merged.getCreatedDate());
            assertEquals("workspace-"+mode.name(),merged.getBaseGroupId());
            assertEquals(List.of("USER_CHANGED","ADMIN_STATUS_CHANGED"),merged.getReasons());
            assertEquals(mode,MongoSessionModeContext.currentMode());
            for(var path:UserAffinityChangesProtocol.paths())assertEquals(200,request(path,body("user&é/?"),TOKEN,mode.name(),"POST","application/json").statusCode());
        }
        assertEquals(2,stored.size());
        assertNull(remote.enqueueUserChanged(null));assertNull(remote.enqueueAdminStatusChanged(" "));
        assertEquals(200,request(UserAffinityChangesProtocol.PROFILE,body(null),TOKEN,"REAL","POST","application/json").statusCode());
    }
    @Test void accountStatusObserverUsesTheSameRemoteQueueAndPropagatesUnknownOutcome() {
        com.raxim.myscoutee.domain.accounts.api.ProfileStatusObserver observer = remote;
        for (var mode : List.of(MongoSessionMode.REAL, MongoSessionMode.DEMO)) {
            MongoSessionModeContext.set(mode);
            observer.onProfileStatusChanged("status-profile");
            var task = stored.get(mode.name() + ":USER:status-profile");
            assertEquals(List.of("ADMIN_STATUS_CHANGED"), task.getReasons());
            assertEquals("workspace-" + mode.name(), task.getBaseGroupId());
            assertEquals(mode, MongoSessionModeContext.currentMode());
        }
        assertEquals(2, stored.size());
        assertThrows(OutcomeUnknownException.class, () -> observer.onProfileStatusChanged("fail"));
    }
    @Test void producerCapabilityModeMethodsAndInputBoundsAreRequired() throws Exception {
        for(var path:UserAffinityChangesProtocol.paths()) {
            for(var token:new String[]{null,"unrelated-service-token-000000000000000000000000"})
                assertEquals(401,request(path,body("user"),token,"REAL","POST","application/json").statusCode());
            for(var mode:new String[]{null,"demo","ANY"})assertEquals(400,request(path,body("user"),TOKEN,mode,"POST","application/json").statusCode());
            assertEquals(403,request(path,"",TOKEN,"REAL","GET","application/json").statusCode());
            for(var invalid:List.of("null","[]","{","{} {}","{\"extra\":true}",body("x".repeat(513))))
                assertEquals(400,request(path,invalid,TOKEN,"REAL","POST","application/json").statusCode());
            assertEquals(415,request(path,"{}",TOKEN,"REAL","POST","text/plain").statusCode());
            assertEquals(413,request(path,"x".repeat(4097),TOKEN,"REAL","POST","application/json").statusCode());
        }
        assertTrue(stored.isEmpty());
    }
    @Test void ownerFailureHasUnknownOutcomeAndNeverLooksLikeNoTask() throws Exception {
        for(var path:UserAffinityChangesProtocol.paths())assertEquals(503,request(path,body("fail"),TOKEN,"REAL","POST","application/json").statusCode());
        assertThrows(OutcomeUnknownException.class,()->remote.enqueueUserChanged("fail"));
    }
    @Test void lostHttpReplyDoesNotRetryAndExplicitSignalReusesTheNativeTask() throws Exception {
        var calls=new AtomicInteger();
        var proxy=com.sun.net.httpserver.HttpServer.create(new InetSocketAddress("127.0.0.1",0),0);
        proxy.createContext(UserAffinityChangesProtocol.PROFILE,exchange->{
            calls.incrementAndGet();
            try {
                var forwarded=HttpRequest.newBuilder(origin.resolve(UserAffinityChangesProtocol.PROFILE)).header("Authorization","Bearer "+TOKEN)
                        .header(InternalReadCredentialFilter.MODE_HEADER,"REAL").header("Content-Type","application/json")
                        .POST(HttpRequest.BodyPublishers.ofByteArray(exchange.getRequestBody().readAllBytes())).build();
                http.send(forwarded,HttpResponse.BodyHandlers.discarding());
                exchange.sendResponseHeaders(200,100); // Close before the promised response body.
            } catch(InterruptedException interrupted){Thread.currentThread().interrupt();}
            finally{exchange.close();}
        });proxy.start();
        try(var lossy=new RemoteUserAffinityChanges(URI.create("http://127.0.0.1:"+proxy.getAddress().getPort()),TOKEN,true,
                Duration.ofSeconds(1),Duration.ofSeconds(2),mapper,meters)) {
            assertThrows(OutcomeUnknownException.class,()->lossy.enqueueUserChanged("lost"));
            assertEquals(1,calls.get());assertEquals(1,stored.size());
            String id=stored.get("REAL:USER:lost").getId();
            assertEquals("USER:lost",remote.enqueueUserChanged("lost").taskKey());
            assertEquals(1,stored.size());assertEquals(id,stored.get("REAL:USER:lost").getId());
        } finally {proxy.stop(0);}
    }
    static String body(String id){return mapper.writeValueAsString(new UserAffinityChangesProtocol.Signal(id));}
    static HttpResponse<String> request(String path,String body,String token,String mode,String method,String media) throws Exception {
        var builder=HttpRequest.newBuilder(origin.resolve(path)).timeout(Duration.ofSeconds(3)).header("Content-Type",media);
        if(token!=null)builder.header("Authorization","Bearer "+token);
        if(mode!=null)builder.header(InternalReadCredentialFilter.MODE_HEADER,mode);
        var response=http.send(builder.method(method,HttpRequest.BodyPublishers.ofString(body)).build(),HttpResponse.BodyHandlers.ofString());
        assertEquals("no-store",response.headers().firstValue("Cache-Control").orElseThrow());
        Files.writeString(evidence.resolve("response-"+sequence.incrementAndGet()+".json"),mapper.writeValueAsString(Map.of(
                "path",path,"method","post","status",response.statusCode(),"body",mapper.readTree(response.body()))));return response;
    }
    @SpringBootConfiguration
    @EnableAutoConfiguration(excludeName={"org.springframework.boot.mongodb.autoconfigure.MongoAutoConfiguration",
            "org.springframework.boot.data.mongodb.autoconfigure.DataMongoAutoConfiguration",
            "org.springframework.boot.data.mongodb.autoconfigure.DataMongoRepositoriesAutoConfiguration",
            "org.springframework.boot.security.autoconfigure.UserDetailsServiceAutoConfiguration"})
    @Import({UserAffinityChangesServerConfiguration.class,ServiceSecurityConfiguration.class})
    static class Fixture {
        @Bean ScheduledMongoSessionRunner databases() {
            return new ScheduledMongoSessionRunner("real", "demo");
        }
        @Bean MongoTemplate mongo(){
            var mongo=mock(MongoTemplate.class);when(mongo.indexOps(AffinityRecomputeTask.class)).thenReturn(mock(IndexOperations.class));return mongo;
        }
        @Bean JobAudience scope(){var scope=mock(JobAudience.class);when(scope.forTarget(anyString(),nullable(String.class)))
                .thenAnswer(call->"workspace-"+MongoSessionModeContext.currentMode().name());return scope;}
        @Bean com.raxim.myscoutee.domain.accounts.api.AccountAffinityProjections projections(){return mock(com.raxim.myscoutee.domain.accounts.api.AccountAffinityProjections.class);}
        @Bean AffinityRecomputeTasksRepository repository(){
            var repo=mock(AffinityRecomputeTasksRepository.class);
            when(repo.findByTaskKey(anyString())).thenAnswer(call->{
                String key=call.getArgument(0);if(key.endsWith(":fail"))throw new IllegalStateException("private db detail");
                return Optional.ofNullable(stored.get(MongoSessionModeContext.currentMode().name()+":"+key));
            });
            when(repo.save(any(AffinityRecomputeTask.class))).thenAnswer(call->{var task=(AffinityRecomputeTask)call.getArgument(0);
                stored.put(MongoSessionModeContext.currentMode().name()+":"+task.getTaskKey(),task);return task;});return repo;
        }
        @Bean com.raxim.myscoutee.domain.affinity.api.AffinityStatusChanges owner(AffinityRecomputeTasksRepository repo,MongoTemplate mongo){return new AffinityRecomputeTaskService(repo,new AffinityRecomputeProperties(),mongo,null);}
    }
}

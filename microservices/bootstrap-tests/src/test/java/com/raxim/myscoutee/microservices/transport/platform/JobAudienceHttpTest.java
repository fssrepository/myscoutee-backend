package com.raxim.myscoutee.microservices.transport.platform;

import java.net.*;
import java.net.http.*;
import java.nio.file.*;
import java.time.Duration;
import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;
import com.raxim.myscoutee.common.config.mongo.*;
import com.raxim.myscoutee.domain.platform.api.*;
import com.raxim.myscoutee.domain.platform.service.JobGroupScopeService;
import com.raxim.myscoutee.domain.accounts.api.*;
import com.raxim.myscoutee.domain.groups.api.*;
import com.raxim.myscoutee.domain.affinity.api.ConfigurationCatalog;
import com.raxim.myscoutee.domain.assets.api.AssetJobScopes;
import com.raxim.myscoutee.domain.assets.dto.AssetJobScopeDto;
import com.raxim.myscoutee.domain.events.api.EventJobScopes;
import com.raxim.myscoutee.domain.events.dto.EventJobScopeDto;
import com.raxim.myscoutee.microservices.bootstrap.ServiceSecurityConfiguration;
import com.raxim.myscoutee.microservices.transport.common.RemoteReadTransport.RemoteReadException;
import io.micrometer.core.instrument.simple.SimpleMeterRegistry;
import org.junit.jupiter.api.*;
import org.springframework.boot.*;
import org.springframework.boot.autoconfigure.*;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.context.*;
import org.springframework.context.annotation.*;
import org.springframework.mock.web.MockHttpServletRequest;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import static org.mockito.ArgumentMatchers.*;

class JobAudienceHttpTest {
    static final String TOKEN="test-only-job-audience-token-000000000000000000000000";
    static final tools.jackson.databind.ObjectMapper mapper=new com.raxim.myscoutee.common.config.JsonConfig().objectMapper();
    static final AtomicInteger sequence=new AtomicInteger(),workspaceReads=new AtomicInteger(),profileBatches=new AtomicInteger();
    static ConfigurableApplicationContext server;
    static RemoteJobAudience remote;
    static SimpleMeterRegistry meters;
    static HttpClient http;
    static URI origin;
    static Path evidence;
    @BeforeAll static void start() throws Exception {
        evidence=Path.of(System.getProperty("wireEvidenceDirectory"),"job-audience");Files.createDirectories(evidence);
        try(var files=Files.list(evidence)){for(var file:files.filter(p->p.getFileName().toString().startsWith("response-")).toList())Files.delete(file);}
        server=new SpringApplicationBuilder(Fixture.class).properties("server.address=127.0.0.1","server.port=0","management.server.port=0",
                "myscoutee.remote.job-audience.read-token="+TOKEN,"spring.main.banner-mode=off","logging.level.root=WARN").run();
        origin=URI.create("http://127.0.0.1:"+server.getEnvironment().getProperty("local.server.port"));
        http=HttpClient.newBuilder().followRedirects(HttpClient.Redirect.NEVER).build();meters=new SimpleMeterRegistry();
        remote=new RemoteJobAudience(origin,TOKEN,true,Duration.ofSeconds(1),Duration.ofSeconds(3),mapper,meters);
    }
    @AfterEach void clear(){MongoSessionModeContext.clear();assertFalse(JobGroupContext.isActive());}
    @AfterAll static void stop(){if(remote!=null)remote.close();if(http!=null)http.shutdownNow();if(server!=null)server.close();if(meters!=null)meters.close();}
    static JobAudienceProtocol.Context context(){return new JobAudienceProtocol.Context(JobGroupContext.isActive(),JobGroupContext.groupId());}
    static byte[] bytes(Object query){return mapper.writeValueAsBytes(query);}
    @Test void canonicalScopeAndTargetResolutionSurviveModeAndNestedJobBoundaries() throws Exception {
        var local=server.getBean(JobGroupScopeService.class);
        for(var mode:List.of(MongoSessionMode.REAL,MongoSessionMode.DEMO)) {
            MongoSessionModeContext.set(mode);
            for(String group:Arrays.asList(null,BaseGroups.WORK_BASE_ID,BaseGroups.COMMUNITY_BASE_ID)) {
                JobGroupContext.run(group,()->{
                    assertEquals(local.workspaceScope(),remote.workspaceScope());
                    for(String id:Arrays.asList(null,"missing","dating","worker"))assertEquals(local.forUser(id),remote.forUser(id));
                    for(var kind:List.of("asset","event","user","config","unknown"))
                        for(var id:List.of("known","missing","default"))assertEquals(local.forTarget(kind,id),remote.forTarget(kind,id));
                    assertEquals(group,JobGroupContext.groupId());assertTrue(JobGroupContext.isActive());
                });
                var ctx=new JobAudienceProtocol.Context(true,group);
                assertEquals(200,request(JobAudienceProtocol.SCOPE,bytes(new JobAudienceProtocol.ScopeQuery(ctx)),TOKEN,mode.name(),"POST","application/json").statusCode());
                assertEquals(200,request(JobAudienceProtocol.USER,bytes(new JobAudienceProtocol.UserQuery(ctx,"worker")),TOKEN,mode.name(),"POST","application/json").statusCode());
                assertEquals(200,request(JobAudienceProtocol.TARGET,bytes(new JobAudienceProtocol.TargetQuery(ctx,"event","known")),TOKEN,mode.name(),"POST","application/json").statusCode());
            }
            assertNull(remote.forUser("missing"));
        }
    }
    @Test void nullableDatingBucketAndOneCanonicalBatchArePreserved() throws Exception {
        var ids=Arrays.asList("worker","dating","missing",null,"worker");
        for(var mode:List.of(MongoSessionMode.REAL,MongoSessionMode.DEMO)) {
            MongoSessionModeContext.set(mode);profileBatches.set(0);
            var grouped=remote.usersByGroup(ids);assertEquals(1,profileBatches.get());
            assertEquals(List.of("worker","worker"),grouped.get(BaseGroups.WORK_BASE_ID));
            assertEquals(Arrays.asList("dating","missing",null),grouped.get(null));
            assertEquals(200,request(JobAudienceProtocol.USERS,bytes(new JobAudienceProtocol.UsersQuery(context(),ids)),TOKEN,mode.name(),"POST","application/json").statusCode());
            assertTrue(remote.usersByGroup(List.of()).isEmpty());
        }
    }
    @Test void rowFilteringUsesOneReadPerJobAndDoesNotShareCachedScopeAcrossModes() {
        workspaceReads.set(0);
        assertTrue(remote.matchesWorkspace("anything"));assertEquals(0,workspaceReads.get());
        JobGroupContext.run(BaseGroups.WORK_BASE_ID,()->{
            for(int i=0;i<50;i++) {
                assertTrue(remote.matchesWorkspace("private-REAL"));assertFalse(remote.matchesWorkspace(null));
                assertFalse(remote.matchesWorkspace(BaseGroups.COMMUNITY_BASE_ID));
            }
            assertEquals(1,workspaceReads.get());
            assertThrows(UnsupportedOperationException.class,()->remote.workspaceScope().ids().add("forged"));
            MongoSessionModeContext.set(MongoSessionMode.DEMO);
            assertTrue(remote.matchesWorkspace("private-DEMO"));assertFalse(remote.matchesWorkspace("private-REAL"));
            assertEquals(2,workspaceReads.get());
        });
        JobGroupContext.run(null,()->{assertTrue(remote.matchesWorkspace(null));assertFalse(remote.matchesWorkspace("private-DEMO"));});
        assertEquals(3,workspaceReads.get());
    }
    @Test void invalidRequestsAndOwnerFailureNeverBecomeUnrestrictedScope() throws Exception {
        for(var path:JobAudienceProtocol.paths()) {
            byte[] query=bytes(new JobAudienceProtocol.ScopeQuery(new JobAudienceProtocol.Context(false,null)));
            assertEquals(401,request(path,query,null,"REAL","POST","application/json").statusCode());
            assertEquals(400,request(path,query,TOKEN,"invalid","POST","application/json").statusCode());
            assertEquals(403,request(path,query,TOKEN,"REAL","GET","application/json").statusCode());
            assertEquals(415,request(path,query,TOKEN,"REAL","POST","text/plain").statusCode());
            assertEquals(413,request(path,new byte[JobAudienceProtocol.MAX_REQUEST_BYTES+1],TOKEN,"REAL","POST","application/json").statusCode());
            assertEquals(400,request(path,"{}".getBytes(),TOKEN,"REAL","POST","application/json").statusCode());
        }
        var fail=bytes(new JobAudienceProtocol.UserQuery(context(),"fail"));
        assertEquals(503,request(JobAudienceProtocol.USER,fail,TOKEN,"REAL","POST","application/json").statusCode());
        assertEquals(503,assertThrows(RemoteReadException.class,()->remote.forUser("fail")).status());
        var invalid=bytes(new JobAudienceProtocol.ScopeQuery(new JobAudienceProtocol.Context(false,"forged")));
        assertEquals(400,request(JobAudienceProtocol.SCOPE,invalid,TOKEN,"REAL","POST","application/json").statusCode());
        assertThrows(IllegalArgumentException.class,()->remote.usersByGroup(Collections.nCopies(4097,"x")));
    }
    @Test void endpointRestoresPreviousContextAfterSuccessAndFailureIncludingInactiveCalls() {
        var endpoint=server.getBean(JobAudienceEndpoint.class);
        JobGroupContext.run(BaseGroups.COMMUNITY_BASE_ID,()->{
            for(boolean active:List.of(false,true)) {
                for(String id:List.of("missing","fail")) {
                    var request=new MockHttpServletRequest();request.setContentType("application/json");
                    request.setContent(bytes(new JobAudienceProtocol.UserQuery(new JobAudienceProtocol.Context(active,null),id)));
                    try {
                        var response=endpoint.user(request);assertEquals(id.equals("fail")?503:200,response.getStatusCode().value());
                        if(!id.equals("fail"))assertNull(((JobAudienceProtocol.Group)response.getBody()).groupId());
                    } catch(java.io.IOException failure){throw new RuntimeException(failure);}
                    assertEquals(BaseGroups.COMMUNITY_BASE_ID,JobGroupContext.groupId());assertTrue(JobGroupContext.isActive());
                }
            }
        });
    }
    @Test void incompleteSuccessBodiesCannotSelectTheDefaultOrAnUnrestrictedScope() throws Exception {
        var proxy=com.sun.net.httpserver.HttpServer.create(new InetSocketAddress("127.0.0.1",0),0);
        proxy.createContext("/",exchange->{
            byte[] body=(exchange.getRequestURI().getPath().equals(JobAudienceProtocol.SCOPE)?"{\"ids\":[]}":"{}").getBytes();
            exchange.getResponseHeaders().set("Content-Type","application/json");exchange.sendResponseHeaders(200,body.length);
            exchange.getResponseBody().write(body);exchange.close();
        });proxy.start();
        try(var invalid=new RemoteJobAudience(URI.create("http://127.0.0.1:"+proxy.getAddress().getPort()),TOKEN,true,
                Duration.ofSeconds(1),Duration.ofSeconds(1),mapper,meters)) {
            assertEquals("INVALID_RESPONSE",assertThrows(RemoteReadException.class,invalid::workspaceScope).code());
            assertEquals("INVALID_RESPONSE",assertThrows(RemoteReadException.class,()->invalid.forUser("worker")).code());
            assertEquals("INVALID_RESPONSE",assertThrows(RemoteReadException.class,()->invalid.forTarget("asset","known")).code());
        } finally {proxy.stop(0);}
    }
    static HttpResponse<String> request(String path,byte[] body,String credential,String mode,String method,String contentType) throws Exception {
        var builder=HttpRequest.newBuilder(origin.resolve(path)).timeout(Duration.ofSeconds(5)).header("Content-Type",contentType);
        if(credential!=null)builder.header("Authorization","Bearer "+credential);
        if(mode!=null)builder.header("X-MyScoutee-Session-Mode",mode);
        var result=http.send(builder.method(method,HttpRequest.BodyPublishers.ofByteArray(body)).build(),HttpResponse.BodyHandlers.ofString());
        assertEquals("no-store",result.headers().firstValue("Cache-Control").orElseThrow());
        Files.writeString(evidence.resolve("response-"+sequence.incrementAndGet()+".json"),mapper.writeValueAsString(Map.of("path",path,"method","post","status",result.statusCode(),"body",mapper.readTree(result.body()))));
        return result;
    }
    static WorkspaceProfile profile(String id) {
        if(id==null || "missing".equals(id))return null;
        if("fail".equals(id))throw new IllegalStateException("private owner detail");
        var p=mock(WorkspaceProfile.class);when(p.getUserId()).thenReturn(id);
        when(p.getWorkspaceGroupId()).thenReturn("dating".equals(id)?null:"private-"+MongoSessionModeContext.currentMode());return p;
    }
    @SpringBootConfiguration
    @EnableAutoConfiguration(excludeName={"org.springframework.boot.mongodb.autoconfigure.MongoAutoConfiguration","org.springframework.boot.data.mongodb.autoconfigure.DataMongoAutoConfiguration","org.springframework.boot.data.mongodb.autoconfigure.DataMongoRepositoriesAutoConfiguration","org.springframework.boot.security.autoconfigure.UserDetailsServiceAutoConfiguration"})
    @Import({com.raxim.myscoutee.common.config.JsonConfig.class,JobAudienceServerConfiguration.class,JobGroupScopeService.class,ServiceSecurityConfiguration.class})
    static class Fixture {
        @Bean ProfileDirectory profiles(){
            var p=mock(ProfileDirectory.class);when(p.findFirstByUserId(nullable(String.class))).thenAnswer(c->profile(c.getArgument(0)));
            doAnswer(c->{profileBatches.incrementAndGet();Collection<String> ids=c.getArgument(0);return ids.stream().map(JobAudienceHttpTest::profile).filter(Objects::nonNull).toList();}).when(p).findByUserIdIn(anyCollection());return p;
        }
        @Bean GroupDirectory groups(){
            var groups=mock(GroupDirectory.class);
            when(groups.workspaceBaseIds()).thenAnswer(c->{workspaceReads.incrementAndGet();return new HashMap<>(Map.of(BaseGroups.WORK_BASE_ID,BaseGroups.WORK_BASE_ID,BaseGroups.COMMUNITY_BASE_ID,BaseGroups.COMMUNITY_BASE_ID,"private-"+MongoSessionModeContext.currentMode(),BaseGroups.WORK_BASE_ID));});
            doAnswer(c->{var group=mock(GroupView.class);when(group.baseId()).thenReturn(BaseGroups.WORK_BASE_ID);return Optional.of(group);}).when(groups).findById(anyString());return groups;
        }
        @Bean ConfigurationCatalog configurations(){var configs=mock(ConfigurationCatalog.class);when(configs.find(anyString())).thenAnswer(c->{String id=c.getArgument(0);if("missing".equals(id))return null;var result=mock(ConfigurationCatalog.Settings.class);when(result.getKey()).thenReturn(id);return result;});return configs;}
        @Bean AssetJobScopes assets(){return id->"missing".equals(id)?null:new AssetJobScopeDto(BaseGroups.COMMUNITY_BASE_ID,"worker",null);}
        @Bean EventJobScopes events(){return id->"missing".equals(id)?null:new EventJobScopeDto(null,null,"worker");}
    }
}

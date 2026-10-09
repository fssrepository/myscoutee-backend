package com.raxim.myscoutee.microservices.transport.groups;

import java.net.*;
import java.net.http.*;
import java.nio.file.*;
import java.time.Duration;
import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;
import com.raxim.myscoutee.common.config.mongo.*;
import com.raxim.myscoutee.common.config.JsonConfig;
import com.raxim.myscoutee.domain.groups.document.CommunityGroup;
import com.raxim.myscoutee.domain.groups.repository.CommunityGroupsRepository;
import com.raxim.myscoutee.domain.groups.service.GroupAdministrationService;
import com.raxim.myscoutee.domain.events.api.CommunityMemberships;
import com.raxim.myscoutee.domain.events.dto.CommunityMember;
import com.raxim.myscoutee.microservices.bootstrap.ServiceSecurityConfiguration;
import com.raxim.myscoutee.microservices.transport.common.RemoteReadTransport.RemoteReadException;
import io.micrometer.core.instrument.simple.SimpleMeterRegistry;
import org.junit.jupiter.api.*;
import org.springframework.boot.*;
import org.springframework.boot.autoconfigure.*;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.context.*;
import org.springframework.context.annotation.*;
import tools.jackson.databind.ObjectMapper;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import static org.mockito.ArgumentMatchers.*;

class GroupAdministrationHttpTest {
    static final String TOKEN="test-only-group-administration-token-000000000000000000000";
    static final ObjectMapper mapper=new JsonConfig().objectMapper();
    static final AtomicInteger sequence=new AtomicInteger(),groupQueries=new AtomicInteger();
    static ConfigurableApplicationContext server;
    static RemoteGroupAdministration remote;
    static SimpleMeterRegistry meters;
    static HttpClient http;
    static URI origin;
    static Path evidence;
    @BeforeAll static void start() throws Exception {
        evidence=Path.of(System.getProperty("wireEvidenceDirectory"),"group-administration");Files.createDirectories(evidence);
        try(var files=Files.list(evidence)){for(var file:files.filter(p->p.getFileName().toString().startsWith("response-")).toList())Files.delete(file);}
        server=new SpringApplicationBuilder(Fixture.class).properties("server.address=127.0.0.1","server.port=0","management.server.port=0",
                "myscoutee.remote.group-administration.read-token="+TOKEN,"spring.main.banner-mode=off","logging.level.root=WARN").run();
        origin=URI.create("http://127.0.0.1:"+server.getEnvironment().getProperty("local.server.port"));
        http=HttpClient.newBuilder().followRedirects(HttpClient.Redirect.NEVER).build();meters=new SimpleMeterRegistry();
        remote=new RemoteGroupAdministration(origin,TOKEN,true,Duration.ofSeconds(1),Duration.ofSeconds(3),mapper,meters);
    }
    @AfterEach void clear(){MongoSessionModeContext.clear();}
    @AfterAll static void stop(){if(remote!=null)remote.close();if(http!=null)http.shutdownNow();if(server!=null)server.close();if(meters!=null)meters.close();}
    @Test void onlyCanonicalAcceptedCommunityAdminsManageLiveOwnedGroups() throws Exception {
        for(var mode:List.of(MongoSessionMode.REAL,MongoSessionMode.DEMO)) {
            MongoSessionModeContext.set(mode);groupQueries.set(0);
            assertEquals(Set.of("managed-"+mode.name()),remote.managedGroups("account&é/?"));
            assertEquals(1,groupQueries.get());
            var response=request("?accountId=account",TOKEN,mode.name(),"GET");assertEquals(200,response.statusCode());
            assertFalse(response.body().contains("pending"));assertFalse(response.body().contains("deleted"));
            assertFalse(response.body().contains("under-review"));assertFalse(response.body().contains("private-group-description"));
            assertEquals(server.getBean(GroupAdministrationService.class).managedGroups("account"),remote.managedGroups("account"));
        }
    }
    @Test void noMembershipReturnsAnEmptySetWithoutQueryingGroups() throws Exception {
        groupQueries.set(0);assertTrue(remote.managedGroups("none").isEmpty());assertEquals(0,groupQueries.get());
        assertEquals(200,request("?accountId=none",TOKEN,"REAL","GET").statusCode());
    }
    @Test void credentialsModesBoundsAndOwnerFailureDoNotBecomeAnEmptySet() throws Exception {
        assertEquals(401,request("",null,"REAL","GET").statusCode());
        assertEquals(400,request("",TOKEN,"unknown","GET").statusCode());
        assertEquals(403,request("",TOKEN,"REAL","POST").statusCode());
        assertEquals(400,request("?accountId="+"a".repeat(513),TOKEN,"REAL","GET").statusCode());
        var response=request("?accountId=fail",TOKEN,"REAL","GET");assertEquals(503,response.statusCode());assertFalse(response.body().contains("private"));
        assertEquals(503,assertThrows(RemoteReadException.class,()->remote.managedGroups("fail")).status());
        assertThrows(IllegalArgumentException.class,()->remote.managedGroups("a".repeat(513)));
    }
    static CommunityMember member(String id,String status,String role) {
        var member=new CommunityMember();member.setOwnerId(id);member.setStatus(status);member.setRole(role);return member;
    }
    static CommunityGroup group(String id) {
        String type=id.equals("work")?"work":"community";
        String lifecycle=id.equals("deleted")?"deleted":id.equals("under-review")?"under-review":null;
        return new CommunityGroup(id,"owner","Group","private-group-description",null,null,"private",false,null,null,null,1L,null,null,null,null,null,lifecycle,null,null,type);
    }
    static HttpResponse<String> request(String query,String credential,String mode,String method) throws Exception {
        var builder=HttpRequest.newBuilder(origin.resolve(GroupAdministrationProtocol.PATH+query)).timeout(Duration.ofSeconds(5));
        if(credential!=null)builder.header("Authorization","Bearer "+credential);
        if(mode!=null)builder.header("X-MyScoutee-Session-Mode",mode);
        var result=http.send(builder.method(method,HttpRequest.BodyPublishers.noBody()).build(),HttpResponse.BodyHandlers.ofString());
        assertEquals("no-store",result.headers().firstValue("Cache-Control").orElseThrow());
        Files.writeString(evidence.resolve("response-"+sequence.incrementAndGet()+".json"),mapper.writeValueAsString(Map.of("path",GroupAdministrationProtocol.PATH,"method","get","status",result.statusCode(),"body",mapper.readTree(result.body()))));
        return result;
    }
    @SpringBootConfiguration
    @EnableAutoConfiguration(excludeName={"org.springframework.boot.mongodb.autoconfigure.MongoAutoConfiguration","org.springframework.boot.data.mongodb.autoconfigure.DataMongoAutoConfiguration","org.springframework.boot.data.mongodb.autoconfigure.DataMongoRepositoriesAutoConfiguration","org.springframework.boot.security.autoconfigure.UserDetailsServiceAutoConfiguration"})
    @Import({JsonConfig.class,GroupAdministrationServerConfiguration.class,GroupAdministrationService.class,ServiceSecurityConfiguration.class})
    static class Fixture {
        @Bean CommunityMemberships members(){
            var members=mock(CommunityMemberships.class);
            when(members.forAccount(nullable(String.class))).thenAnswer(c->{
                String account=c.getArgument(0);if("fail".equals(account))throw new IllegalStateException("private database detail");
                if("none".equals(account))return List.of();
                return List.of(member("managed-"+MongoSessionModeContext.currentMode(),"accepted","Admin"),
                        member("pending","pending","Admin"),member("regular","accepted","Member"),
                        member("deleted","accepted","Admin"),member("under-review","accepted","Admin"),
                        member("work","accepted","Admin"),member(CommunityGroup.COMMUNITY_BASE_ID,"accepted","Admin"));
            });return members;
        }
        @Bean CommunityGroupsRepository groups(){
            var groups=mock(CommunityGroupsRepository.class);when(groups.findByIdIn(anyCollection())).thenAnswer(c->{
                groupQueries.incrementAndGet();Collection<String> ids=c.getArgument(0);
                assertFalse(ids.contains("pending"));assertFalse(ids.contains("regular"));return ids.stream().map(GroupAdministrationHttpTest::group).toList();
            });return groups;
        }
    }
}

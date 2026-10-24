package com.raxim.myscoutee.microservices.transport.notifications;

import java.net.*;
import java.net.http.*;
import java.nio.file.*;
import java.time.Duration;
import java.util.*;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.atomic.AtomicInteger;
import com.raxim.myscoutee.common.config.JsonConfig;
import com.raxim.myscoutee.common.config.mongo.*;
import com.raxim.myscoutee.domain.notifications.api.*;
import com.raxim.myscoutee.domain.notifications.api.RoleNotifications.MemberRegistration;
import com.raxim.myscoutee.domain.notifications.service.RoleNotificationService;
import com.raxim.myscoutee.domain.accounts.api.AccountNotifications;
import com.raxim.myscoutee.domain.platform.api.*;
import com.raxim.myscoutee.microservices.bootstrap.ServiceSecurityConfiguration;
import com.raxim.myscoutee.microservices.transport.common.RemoteCommandTransport.OutcomeUnknownException;
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

class RoleNotificationsHttpTest {
    static final String TOKEN="test-only-role-notifications-token-000000000000000000000";
    static final ObjectMapper mapper=new JsonConfig().objectMapper();
    static final AtomicInteger sequence=new AtomicInteger();
    record Published(MongoSessionMode mode,String operationId,NotificationDelivery.NotificationIntent intent) {}
    static final List<Published> published=new CopyOnWriteArrayList<>();
    static ConfigurableApplicationContext server;
    static RemoteRoleNotifications remote;
    static SimpleMeterRegistry meters;
    static HttpClient http;
    static URI origin;
    static Path evidence;
    @BeforeAll static void start() throws Exception {
        evidence=Path.of(System.getProperty("wireEvidenceDirectory"),"role-notifications");Files.createDirectories(evidence);
        try(var files=Files.list(evidence)){for(var file:files.filter(p->p.getFileName().toString().startsWith("response-")).toList())Files.delete(file);}
        server=new SpringApplicationBuilder(Fixture.class).properties("server.address=127.0.0.1","server.port=0","management.server.port=0",
                "myscoutee.remote.role-notifications.command-token="+TOKEN,"spring.main.banner-mode=off","logging.level.root=WARN").run();
        origin=URI.create("http://127.0.0.1:"+server.getEnvironment().getProperty("local.server.port"));
        http=HttpClient.newBuilder().followRedirects(HttpClient.Redirect.NEVER).build();meters=new SimpleMeterRegistry();
        remote=new RemoteRoleNotifications(origin,TOKEN,true,Duration.ofSeconds(1),Duration.ofSeconds(3),mapper,meters);
    }
    @BeforeEach void reset(){published.clear();}
    @AfterEach void clear(){MongoSessionModeContext.clear();}
    @AfterAll static void stop(){if(remote!=null)remote.close();if(http!=null)http.shutdownNow();if(server!=null)server.close();if(meters!=null)meters.close();}
    static byte[] body(String path,String id) {
        return mapper.writeValueAsBytes(path.equals(RoleNotificationsProtocol.RELEASE)?new RoleNotificationsProtocol.Release(id):
                path.equals(RoleNotificationsProtocol.MEMBER)?new RoleNotificationsProtocol.Member(new MemberRegistration(id,"member@test",false,false)):
                new RoleNotificationsProtocol.Moderation("report-submitted",id));
    }
    @Test void canonicalAudiencePayloadPrivacyAndDurableIdsSurviveBothModes() throws Exception {
        for(var mode:List.of(MongoSessionMode.REAL,MongoSessionMode.DEMO)) {
            MongoSessionModeContext.set(mode);published.clear();
            remote.releaseAvailable("v-next");
            assertEquals(1,published.size());assertEquals("role:release-available:v-next:operator",published.getFirst().operationId());
            assertEquals("/operator?notificationTarget=updates",published.getFirst().intent().clickUrl());
            remote.moderationSubmitted("report-submitted","report-id");
            assertEquals("role:report-submitted:report-id:admin",published.getLast().operationId());
            assertEquals("/admin?notificationTarget=reports",published.getLast().intent().clickUrl());
            remote.memberJoined(new MemberRegistration("member-id","member@test",false,false));
            assertEquals(4,published.size());
            for(var item:published) {
                assertEquals(mode,item.mode());assertFalse(item.intent().payload().containsKey("email"));
                assertFalse(item.intent().payload().containsKey("name"));assertFalse(item.intent().payload().containsKey("userId"));
            }
            for(var path:RoleNotificationsProtocol.paths())assertEquals(200,request(path,body(path,"event"),TOKEN,mode.name(),"POST","application/json").statusCode());
        }
    }
    @Test void privilegedAndWorkspaceRegistrationsKeepTheirExistingNoOpPolicy() {
        remote.memberJoined(null);
        remote.memberJoined(new MemberRegistration("operator","operator@test",true,false));
        remote.memberJoined(new MemberRegistration("admin","admin@test",false,false));
        remote.memberJoined(new MemberRegistration("workspace","member@test",false,true));
        remote.releaseAvailable("");remote.moderationSubmitted("feedback-submitted",null);
        assertTrue(published.isEmpty());
    }
    @Test void boundedExplicitCommandsRequireProducerCapabilityAndMode() throws Exception {
        for(var path:RoleNotificationsProtocol.paths()) {
            var body=body(path,"event");
            assertEquals(401,request(path,body,null,"REAL","POST","application/json").statusCode());
            assertEquals(400,request(path,body,TOKEN,"invalid","POST","application/json").statusCode());
            assertEquals(403,request(path,body,TOKEN,"REAL","GET","application/json").statusCode());
            assertEquals(415,request(path,body,TOKEN,"REAL","POST","text/plain").statusCode());
            assertEquals(413,request(path,new byte[8193],TOKEN,"REAL","POST","application/json").statusCode());
            assertEquals(400,request(path,"{\"unexpected\":true}".getBytes(),TOKEN,"REAL","POST","application/json").statusCode());
        }
        assertTrue(published.isEmpty());
        assertThrows(IllegalArgumentException.class,()->remote.moderationSubmitted("unknown","id"));
        var failure=assertThrows(OutcomeUnknownException.class,()->remote.releaseAvailable("fail"));
        assertEquals("release-available:fail",failure.requestId());assertEquals(1,published.size());
        var response=request(RoleNotificationsProtocol.RELEASE,body(RoleNotificationsProtocol.RELEASE,"fail"),TOKEN,"REAL","POST","application/json");
        assertEquals(503,response.statusCode());assertFalse(response.body().contains("private"));
    }
    @Test void lostReplyHasNoAutomaticRetryAndExplicitRepeatUsesCanonicalOutboxIdentity() throws Exception {
        var proxy=com.sun.net.httpserver.HttpServer.create(new InetSocketAddress("127.0.0.1",0),0);var forwarded=new AtomicInteger();
        proxy.createContext(RoleNotificationsProtocol.RELEASE,exchange->{
            try {
                assertEquals(200,request(RoleNotificationsProtocol.RELEASE,exchange.getRequestBody().readAllBytes(),TOKEN,"REAL","POST","application/json").statusCode());
                forwarded.incrementAndGet();exchange.getResponseHeaders().set("Content-Type","application/json");exchange.sendResponseHeaders(200,100);
            } catch(Exception failure){throw new RuntimeException(failure);} finally {exchange.close();}
        });proxy.start();
        try(var broken=new RemoteRoleNotifications(URI.create("http://127.0.0.1:"+proxy.getAddress().getPort()),TOKEN,true,
                Duration.ofSeconds(1),Duration.ofSeconds(1),mapper,meters)) {
            assertThrows(OutcomeUnknownException.class,()->broken.releaseAvailable("lost"));
            assertEquals(1,forwarded.get());assertEquals(1,published.size());
            remote.releaseAvailable("lost");assertEquals(2,published.size());assertEquals(published.getFirst(),published.getLast());
        } finally {proxy.stop(0);}
    }
    static HttpResponse<String> request(String path,byte[] body,String credential,String mode,String method,String contentType) throws Exception {
        var builder=HttpRequest.newBuilder(origin.resolve(path)).timeout(Duration.ofSeconds(5)).header("Content-Type",contentType);
        if(credential!=null)builder.header("Authorization","Bearer "+credential);
        if(mode!=null)builder.header("X-MyScoutee-Session-Mode",mode);
        var result=http.send(builder.method(method,HttpRequest.BodyPublishers.ofByteArray(body)).build(),HttpResponse.BodyHandlers.ofString());
        assertEquals("no-store",result.headers().firstValue("Cache-Control").orElseThrow());
        Files.writeString(evidence.resolve("response-"+sequence.incrementAndGet()+".json"),mapper.writeValueAsString(Map.of("path",path,"method","post","status",result.statusCode(),"body",mapper.readTree(result.body()))));return result;
    }
    @SpringBootConfiguration
    @EnableAutoConfiguration(excludeName={"org.springframework.boot.mongodb.autoconfigure.MongoAutoConfiguration","org.springframework.boot.data.mongodb.autoconfigure.DataMongoAutoConfiguration","org.springframework.boot.data.mongodb.autoconfigure.DataMongoRepositoriesAutoConfiguration","org.springframework.boot.security.autoconfigure.UserDetailsServiceAutoConfiguration"})
    @Import({JsonConfig.class,RoleNotificationsServerConfiguration.class,RoleNotificationService.class,ServiceSecurityConfiguration.class})
    static class Fixture {
        @Bean AccountNotifications accounts(){
            var accounts=mock(AccountNotifications.class);when(accounts.roleRecipients(anyCollection())).thenReturn(List.of(
                    new AccountNotifications.RoleRecipient("operator","operator@test",true),new AccountNotifications.RoleRecipient("admin","admin@test",false),
                    new AccountNotifications.RoleRecipient("ordinary","ordinary@test",false)));return accounts;
        }
        @Bean RuntimeConfiguration config(){var config=mock(RuntimeConfiguration.class);when(config.operatorNotificationRecipients()).thenReturn(new com.raxim.myscoutee.domain.platform.dto.OperatorNotificationRecipientsDto(List.of(" Operator@Test "), null));return config;}
        @Bean AdministratorSettings settings(){var settings=mock(AdministratorSettings.class);doCallRealMethod().when(settings).adminEmailsAmong(anyCollection());when(settings.adminEmails()).thenReturn(List.of("admin@test"));when(settings.isAdminEmail("admin@test")).thenReturn(true);return settings;}
        @Bean NotificationDelivery outbox(){
            var outbox=mock(NotificationDelivery.class);doAnswer(c->{
                String operation=c.getArgument(0);NotificationDelivery.NotificationIntent intent=c.getArgument(1);
                published.add(new Published(MongoSessionModeContext.currentMode(),operation,intent));
                if(operation.contains(":fail:"))throw new IllegalStateException("private outbox write failure");return Optional.empty();
            }).when(outbox).enqueueOnce(anyString(),any());return outbox;
        }
    }
}

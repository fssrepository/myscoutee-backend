package com.raxim.myscoutee.microservices.transport.groups;

import java.net.*;
import java.net.http.*;
import java.nio.file.*;
import java.security.*;
import java.time.*;
import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;
import com.raxim.myscoutee.common.config.mongo.*;
import com.raxim.myscoutee.domain.accounts.api.*;
import com.raxim.myscoutee.domain.groups.api.ProfileWorkspaceLoads;
import com.raxim.myscoutee.domain.groups.dto.*;
import com.raxim.myscoutee.microservices.bootstrap.ServiceSecurityConfiguration;
import com.raxim.myscoutee.microservices.transport.common.RemoteReadTransport.RemoteReadException;
import com.raxim.myscoutee.microservices.transport.security.ActorDelegation;
import io.micrometer.core.instrument.simple.SimpleMeterRegistry;
import org.junit.jupiter.api.*;
import org.springframework.boot.*;
import org.springframework.boot.autoconfigure.*;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.context.*;
import org.springframework.context.annotation.*;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.mock.web.MockHttpServletRequest;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ProfileWorkspaceLoadsHttpTest {
    static final String TOKEN = "test-only-profile-workspace-token-000000000000000000000000";
    static final tools.jackson.databind.ObjectMapper mapper = new com.raxim.myscoutee.common.config.JsonConfig().objectMapper();
    static final AtomicInteger calls = new AtomicInteger(), sequence = new AtomicInteger();
    static ConfigurableApplicationContext server;
    static URI origin;
    static HttpClient http;
    static RemoteProfileWorkspaceLoads remote;
    static SimpleMeterRegistry meters;
    static ActorDelegation.Issuer issuer;
    static ActorDelegation.Verifier verifier;
    static Path evidence;
    @BeforeAll static void start() throws Exception {
        var generator = KeyPairGenerator.getInstance("RSA"); generator.initialize(2048);
        var pair = generator.generateKeyPair();
        var publicKey = Base64.getEncoder().encodeToString(pair.getPublic().getEncoded());
        issuer = new ActorDelegation.Issuer(Base64.getEncoder().encodeToString(pair.getPrivate().getEncoded()), publicKey, Clock.systemUTC());
        verifier = new ActorDelegation.Verifier(publicKey, Clock.systemUTC());
        evidence = Path.of(System.getProperty("wireEvidenceDirectory"), "profile-workspace");
        Files.createDirectories(evidence);
        try (var files = Files.list(evidence)) { for (var file : files.filter(p -> p.getFileName().toString().startsWith("response-")).toList()) Files.delete(file); }
        server = new SpringApplicationBuilder(Fixture.class).properties("server.address=127.0.0.1", "server.port=0", "management.server.port=0",
                "myscoutee.remote.profile-workspace.command-token=" + TOKEN, "myscoutee.delegation.public-key=" + publicKey,
                "spring.main.banner-mode=off", "logging.level.root=WARN").run();
        origin = URI.create("http://127.0.0.1:" + server.getEnvironment().getProperty("local.server.port"));
        http = HttpClient.newBuilder().followRedirects(HttpClient.Redirect.NEVER).build(); meters = new SimpleMeterRegistry();
        remote = new RemoteProfileWorkspaceLoads(origin,TOKEN,true,Duration.ofSeconds(1),Duration.ofSeconds(3),mapper,meters,issuer);
    }
    static void authenticate(String id) {
        var profile=mock(WorkspaceProfile.class); when(profile.getUserId()).thenReturn(id);
        when(profile.getAccountUserId()).thenReturn("account"); when(profile.getWorkspaceGroupId()).thenReturn("group");
        var actor=mock(AccountIdentity.class); when(actor.getUserId()).thenReturn(id); when(actor.getUser()).thenReturn(profile);
        SecurityContextHolder.getContext().setAuthentication(new UsernamePasswordAuthenticationToken(actor,null,List.of()));
    }
    @BeforeEach void prepare() { calls.set(0); authenticate("actor"); }
    @AfterEach void clear() { SecurityContextHolder.clearContext(); MongoSessionModeContext.clear(); }
    @AfterAll static void stop() { if(remote!=null)remote.close(); if(http!=null)http.shutdownNow(); if(server!=null)server.close(); if(meters!=null)meters.close(); }
    static byte[] body(String account,String current,String requested) {
        return mapper.writeValueAsBytes(new ProfileWorkspaceLoadsProtocol.Command(account,current,requested));
    }
    static String sign(byte[] body) { return issuer.issueForCurrent(ProfileWorkspaceLoadsProtocol.AUDIENCE,"POST",ProfileWorkspaceLoadsProtocol.PATH,body); }
    @Test void existingWorkspaceAndAccountDtoSurviveTheAuthorizedBoundaryInBothModes() throws Exception {
        for(var mode:List.of(MongoSessionMode.REAL,MongoSessionMode.DEMO)) {
            MongoSessionModeContext.set(mode);
            var result=remote.loadProfileWorkspace("account","group","next");
            assertEquals("group",result.workspace().groupId());assertEquals("next",result.workspace().requestKind());
            assertEquals("account",result.accountProfile().id());assertEquals(mode.name(),result.accountProfile().name());
            assertEquals(3,result.accountProfile().activities().game());
            var command=body("account","group","next");
            assertEquals(200,request(command,TOKEN,mode.name(),sign(command),"POST","application/json").statusCode());
        }
        assertEquals(4,calls.get());
        authenticateBase();
        var result=remote.loadProfileWorkspace("account",null,"");assertNull(result.workspace());assertNull(result.accountProfile());
        var command=body("account",null,"");assertEquals(200,request(command,TOKEN,"DEMO",signInDemo(command),"POST","application/json").statusCode());
    }
    static String signInDemo(byte[] body) { MongoSessionModeContext.set(MongoSessionMode.DEMO);return sign(body); }
    static void authenticateBase() {
        var profile=mock(WorkspaceProfile.class);when(profile.getUserId()).thenReturn("account");
        var actor=mock(AccountIdentity.class);when(actor.getUserId()).thenReturn("account");when(actor.getUser()).thenReturn(profile);
        SecurityContextHolder.getContext().setAuthentication(new UsernamePasswordAuthenticationToken(actor,null,List.of()));
    }
    @Test void anotherAccountOrWorkspaceCannotBeSelectedUsingOnlyTheServiceCredential() throws Exception {
        var command=body("account","group",null);var signature=sign(command);
        assertEquals(401,request(command,null,"REAL",signature,"POST","application/json").statusCode());
        assertEquals(403,request(command,TOKEN,"REAL",null,"POST","application/json").statusCode());
        assertEquals(403,request(command,TOKEN,"DEMO",signature,"POST","application/json").statusCode());
        assertEquals(403,request(command,TOKEN,"REAL",signature,"GET","application/json").statusCode());
        for(var wrong:List.of(body("other","group",null),body("account","other",null),body("account",null,null))) {
            assertEquals(403,request(wrong,TOKEN,"REAL",signature,"POST","application/json").statusCode());
            assertEquals(403,request(wrong,TOKEN,"REAL",sign(wrong),"POST","application/json").statusCode());
        }
        SecurityContextHolder.clearContext();assertThrows(AccessDeniedException.class,()->remote.loadProfileWorkspace("account","group",null));
        assertEquals(0,calls.get());
    }
    @Test void invalidRequestsNeverReachTheOwnerAndOwnerDenialsStayFailures() throws Exception {
        var command=body("account","group",null);
        assertEquals(400,request(command,TOKEN,"invalid",sign(command),"POST","application/json").statusCode());
        for(var invalid:List.of("{}".getBytes(),body("account","group","x".repeat(513))))
            assertEquals(400,request(invalid,TOKEN,"REAL",sign(invalid),"POST","application/json").statusCode());
        assertEquals(415,request(command,TOKEN,"REAL",sign(command),"POST","text/plain").statusCode());
        var huge=new byte[4097];assertEquals(413,request(huge,TOKEN,"REAL",sign(huge),"POST","application/json").statusCode());
        assertEquals(0,calls.get());
        for(var value:Map.of("deny",403,"missing",404,"conflict",409,"fail",503).entrySet()) {
            command=body("account","group",value.getKey());
            var response=request(command,TOKEN,"REAL",sign(command),"POST","application/json");
            assertEquals(value.getValue(),response.statusCode());assertFalse(response.body().contains("private"));
        }
        assertThrows(com.raxim.myscoutee.microservices.transport.common.RemoteCommandTransport.OutcomeUnknownException.class,
                ()->remote.loadProfileWorkspace("account","group","fail"));
    }
    @Test void lostReplyDoesNotRepeatWorkspaceActivation() throws Exception {
        var proxy=com.sun.net.httpserver.HttpServer.create(new InetSocketAddress("127.0.0.1",0),0);var forwarded=new AtomicInteger();
        proxy.createContext(ProfileWorkspaceLoadsProtocol.PATH,exchange->{
            try {
                byte[] command=exchange.getRequestBody().readAllBytes();
                assertEquals(200,request(command,TOKEN,"REAL",exchange.getRequestHeaders().getFirst(ActorDelegation.HEADER),"POST","application/json").statusCode());
                forwarded.incrementAndGet();exchange.getResponseHeaders().set("Content-Type","application/json");exchange.sendResponseHeaders(200,100);
            } catch(Exception failure){throw new RuntimeException(failure);} finally {exchange.close();}
        });proxy.start();
        try(var broken=new RemoteProfileWorkspaceLoads(URI.create("http://127.0.0.1:"+proxy.getAddress().getPort()),TOKEN,true,
                Duration.ofSeconds(1),Duration.ofSeconds(1),mapper,meters,issuer)) {
            assertThrows(com.raxim.myscoutee.microservices.transport.common.RemoteCommandTransport.OutcomeUnknownException.class,
                    ()->broken.loadProfileWorkspace("account","group","next"));
            assertEquals(1,forwarded.get());assertEquals(1,calls.get());
        } finally {proxy.stop(0);}
    }
    static HttpResponse<String> request(byte[] body,String credential,String mode,String delegation,String method,String contentType) throws Exception {
        var builder=HttpRequest.newBuilder(origin.resolve(ProfileWorkspaceLoadsProtocol.PATH)).timeout(Duration.ofSeconds(5)).header("Content-Type",contentType);
        if(credential!=null)builder.header("Authorization","Bearer "+credential);
        if(mode!=null)builder.header("X-MyScoutee-Session-Mode",mode);
        if(delegation!=null)builder.header(ActorDelegation.HEADER,delegation);
        var result=http.send(builder.method(method,HttpRequest.BodyPublishers.ofByteArray(body)).build(),HttpResponse.BodyHandlers.ofString());
        assertEquals("no-store",result.headers().firstValue("Cache-Control").orElseThrow());
        Files.writeString(evidence.resolve("response-"+sequence.incrementAndGet()+".json"),mapper.writeValueAsString(Map.of("path",ProfileWorkspaceLoadsProtocol.PATH,"method","post","status",result.statusCode(),"body",mapper.readTree(result.body()))));return result;
    }
    @SpringBootConfiguration
    @EnableAutoConfiguration(excludeName={"org.springframework.boot.mongodb.autoconfigure.MongoAutoConfiguration","org.springframework.boot.data.mongodb.autoconfigure.DataMongoAutoConfiguration","org.springframework.boot.data.mongodb.autoconfigure.DataMongoRepositoriesAutoConfiguration","org.springframework.boot.security.autoconfigure.UserDetailsServiceAutoConfiguration"})
    @Import({com.raxim.myscoutee.common.config.JsonConfig.class,ProfileWorkspaceLoadsServerConfiguration.class,ServiceSecurityConfiguration.class})
    static class Fixture {
        @Bean ProfileWorkspaceLoads owner(){return (account,current,requested)->{
            calls.incrementAndGet();
            if("fail".equals(requested))throw new IllegalStateException("private owner detail");
            var status=Map.of("deny",403,"missing",404,"conflict",409).get(requested==null?"":requested);
            if(status!=null)throw new org.springframework.web.server.ResponseStatusException(org.springframework.http.HttpStatus.valueOf(status),"private owner detail");
            if(current==null)return new ProfileWorkspaceDto(null,null);
            var profile=mapper.convertValue(Map.of("id",account,"name",MongoSessionModeContext.currentMode().name(),"activities",Map.of("game",3)),
                    com.raxim.myscoutee.domain.accounts.dto.AuthDtos.UserDto.class);
            var workspace=new CommunityGroupDtos.Workspace(current,"selected-profile","Workspace","Member",4,
                    new GroupPolicy(true,true,List.of("name")),0,0,"community","accepted",4,requested,"work");
            return new ProfileWorkspaceDto(workspace,profile);
        };}
    }
}

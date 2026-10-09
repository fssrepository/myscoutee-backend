package com.raxim.myscoutee.microservices.transport.assets;

import java.net.*;
import java.net.http.*;
import java.nio.file.*;
import java.security.*;
import java.time.*;
import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;
import com.raxim.myscoutee.common.config.mongo.*;
import com.raxim.myscoutee.domain.accounts.api.*;
import com.raxim.myscoutee.domain.assets.api.TicketReads;
import com.raxim.myscoutee.domain.assets.dto.AssetsDtos.*;
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

class TicketReadsHttpTest {
    static final String TOKEN = "test-only-ticket-read-token-000000000000000000000000";
    static final tools.jackson.databind.ObjectMapper mapper = new com.raxim.myscoutee.common.config.JsonConfig().objectMapper();
    static final AtomicInteger calls = new AtomicInteger(), sequence = new AtomicInteger();
    static ConfigurableApplicationContext server;
    static URI origin;
    static HttpClient http;
    static RemoteTicketReads remote;
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
        evidence = Path.of(System.getProperty("wireEvidenceDirectory"), "ticket-reads");
        Files.createDirectories(evidence);
        try (var files = Files.list(evidence)) { for (var file : files.filter(p -> p.getFileName().toString().startsWith("response-")).toList()) Files.delete(file); }
        server = new SpringApplicationBuilder(Fixture.class).properties("server.address=127.0.0.1", "server.port=0", "management.server.port=0",
                "myscoutee.remote.ticket-reads.read-token=" + TOKEN, "myscoutee.delegation.public-key=" + publicKey,
                "spring.main.banner-mode=off", "logging.level.root=WARN").run();
        origin = URI.create("http://127.0.0.1:" + server.getEnvironment().getProperty("local.server.port"));
        http = HttpClient.newBuilder().followRedirects(HttpClient.Redirect.NEVER).build(); meters = new SimpleMeterRegistry();
        remote = new RemoteTicketReads(origin,TOKEN,true,Duration.ofSeconds(1),Duration.ofSeconds(3),mapper,meters,issuer);
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
    static byte[] body(String userId,Integer page,Integer pageSize,String order) {
        return mapper.writeValueAsBytes(new TicketReadsProtocol.Query(userId,page,pageSize,order));
    }
    static String sign(byte[] body) { return issuer.issueForCurrent(TicketReadsProtocol.AUDIENCE,"POST",TicketReadsProtocol.PATH,body); }
    @Test void existingTicketDtoAndVerifiedActorCrossHttpInBothModes() throws Exception {
        var caller=SecurityContextHolder.getContext();
        for(var mode : List.of(MongoSessionMode.REAL,MongoSessionMode.DEMO)) {
            MongoSessionModeContext.set(mode);
            var result=remote.queryTicketPage("actor",2,18,"past");
            assertEquals(41,result.total()); assertEquals("actor",result.items().getFirst().holderUserId());
            assertEquals(mode.name(),result.items().getFirst().title()); assertEquals("group",result.items().getFirst().workspaceGroupId());
            assertEquals("https://media.test/image.webp",result.items().getFirst().creatorAvatarUrl());
            assertEquals("2:18:past",result.items().getFirst().revision());
            assertSame(caller,SecurityContextHolder.getContext()); assertEquals(mode,MongoSessionModeContext.currentMode());
            var query=body("actor",null,null,null);
            assertEquals(200,request(query,TOKEN,mode.name(),sign(query),"POST","application/json").statusCode());
        }
        assertEquals(4,calls.get());
        var empty=remote.queryTicketPage("actor",5,18,"empty"); assertEquals(0,empty.total()); assertTrue(empty.items().isEmpty());
    }
    @Test void serviceCredentialCannotReadAnotherActorsTickets() throws Exception {
        var query=body("actor",0,18,"upcoming"); var proof=sign(query);
        assertEquals(401,request(query,null,"REAL",proof,"POST","application/json").statusCode());
        assertEquals(400,request(query,TOKEN,"invalid",proof,"POST","application/json").statusCode());
        assertEquals(403,request(query,TOKEN,"REAL",null,"POST","application/json").statusCode());
        assertEquals(403,request(query,TOKEN,"DEMO",proof,"POST","application/json").statusCode());
        assertEquals(403,request(query,TOKEN,"REAL",proof,"GET","application/json").statusCode());
        var other=body("other",0,18,"upcoming");
        assertEquals(403,request(other,TOKEN,"REAL",proof,"POST","application/json").statusCode());
        assertEquals(403,request(other,TOKEN,"REAL",sign(other),"POST","application/json").statusCode());
        assertThrows(AccessDeniedException.class,()->remote.queryTicketPage("other",0,18,"upcoming"));
        SecurityContextHolder.clearContext();
        assertThrows(AccessDeniedException.class,()->remote.queryTicketPage("actor",0,18,"upcoming"));
        assertEquals(0,calls.get());
    }
    @Test void inputBoundsAndOwnerFailuresRemainDistinctFromAnEmptyPage() throws Exception {
        for(var query : List.of("{}".getBytes(),"{\"unexpected\":true}".getBytes(),body("actor",0,1001,null)))
            assertEquals(400,request(query,TOKEN,"REAL",sign(query),"POST","application/json").statusCode());
        var query=body("actor",0,18,"upcoming");
        assertEquals(415,request(query,TOKEN,"REAL",sign(query),"POST","text/plain").statusCode());
        var huge=new byte[4097];
        assertEquals(413,request(huge,TOKEN,"REAL",sign(huge),"POST","application/json").statusCode());
        assertEquals(0,calls.get());
        var failure=assertThrows(RemoteReadException.class,()->remote.queryTicketPage("actor",0,18,"fail"));
        assertEquals(503,failure.status()); assertEquals(1,calls.get());
        query=body("actor",0,18,"fail");
        var result=request(query,TOKEN,"REAL",sign(query),"POST","application/json");
        assertEquals(503,result.statusCode()); assertFalse(result.body().contains("private"));
    }
    @Test void ownerFailureRestoresTheServiceSecurityContext() throws Exception {
        var query=body("actor",0,18,"upcoming"); var signature=sign(query);
        var original=SecurityContextHolder.createEmptyContext();
        original.setAuthentication(new UsernamePasswordAuthenticationToken("internal-reader",null,List.of()));
        SecurityContextHolder.setContext(original);
        var endpoint=new TicketReadsEndpoint((id,page,size,order)->{
            assertEquals("actor",assertInstanceOf(ActorDelegation.VerifiedPrincipal.class, SecurityContextHolder.getContext().getAuthentication().getPrincipal()).getUserId());
            assertTrue(SecurityContextHolder.getContext().getAuthentication().getAuthorities().isEmpty());
            throw new IllegalStateException("private failure");
        },verifier,mapper);
        var request=new MockHttpServletRequest();request.setMethod("POST");request.setContentType("application/json");
        request.setContent(query);request.addHeader(ActorDelegation.HEADER,signature);
        assertEquals(503,endpoint.query(request).getStatusCode().value());
        assertSame(original,SecurityContextHolder.getContext());
    }
    static HttpResponse<String> request(byte[] body,String credential,String mode,String delegation,String method,String contentType) throws Exception {
        var builder=HttpRequest.newBuilder(origin.resolve(TicketReadsProtocol.PATH)).timeout(Duration.ofSeconds(5)).header("Content-Type",contentType);
        if(credential!=null)builder.header("Authorization","Bearer "+credential);
        if(mode!=null)builder.header("X-MyScoutee-Session-Mode",mode);
        if(delegation!=null)builder.header(ActorDelegation.HEADER,delegation);
        var result=http.send(builder.method(method,HttpRequest.BodyPublishers.ofByteArray(body)).build(),HttpResponse.BodyHandlers.ofString());
        assertEquals("no-store",result.headers().firstValue("Cache-Control").orElseThrow());
        Files.writeString(evidence.resolve("response-"+sequence.incrementAndGet()+".json"),mapper.writeValueAsString(Map.of(
                "path",TicketReadsProtocol.PATH,"method","post","status",result.statusCode(),"body",mapper.readTree(result.body()))));
        return result;
    }
    @SpringBootConfiguration
    @EnableAutoConfiguration(excludeName={"org.springframework.boot.mongodb.autoconfigure.MongoAutoConfiguration","org.springframework.boot.data.mongodb.autoconfigure.DataMongoAutoConfiguration","org.springframework.boot.data.mongodb.autoconfigure.DataMongoRepositoriesAutoConfiguration","org.springframework.boot.security.autoconfigure.UserDetailsServiceAutoConfiguration"})
    @Import({com.raxim.myscoutee.common.config.JsonConfig.class,TicketReadsServerConfiguration.class,ServiceSecurityConfiguration.class})
    static class Fixture {
        @Bean TicketReads ticketOwner() { return (id,page,size,order)->{
            calls.incrementAndGet();
            var principal = assertInstanceOf(ActorDelegation.VerifiedPrincipal.class, SecurityContextHolder.getContext().getAuthentication().getPrincipal());
            assertEquals(id, principal.getUserId());
            assertEquals("account", principal.getProfileIdentity().accountUserId());
            assertEquals("group", principal.getProfileIdentity().workspaceGroupId());
            assertTrue(SecurityContextHolder.getContext().getAuthentication().getAuthorities().isEmpty());
            if("fail".equals(order))throw new IllegalStateException("private owner details");
            if("empty".equals(order))return new AssetTicketsPageDto(List.of(),0);
            return new AssetTicketsPageDto(List.of(new AssetTicketDto("ticket",id,"scan",null,"event","active",
                    MongoSessionModeContext.currentMode().name(),"subtitle","detail","2030-01-01T00:00:00Z",12,false,
                    "start","end","https://media.test/ticket.webp","private","AB","CD","Creator",
                    "https://media.test/image.webp",page+":"+size+":"+order,"group","Group")),41);
        }; }
    }
}

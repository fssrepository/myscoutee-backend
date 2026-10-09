package com.raxim.myscoutee.microservices.transport.chat;

import java.net.*;
import java.net.http.*;
import java.nio.file.*;
import java.security.*;
import java.time.*;
import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;
import com.raxim.myscoutee.common.config.mongo.*;
import com.raxim.myscoutee.domain.accounts.api.*;
import com.raxim.myscoutee.domain.chat.api.ContactPermissions;
import com.raxim.myscoutee.domain.chat.dto.*;
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

class ContactPermissionsHttpTest {
    static final String TOKEN = "test-only-contact-permission-token-000000000000000000000000";
    static final tools.jackson.databind.ObjectMapper mapper = new com.raxim.myscoutee.common.config.JsonConfig().objectMapper();
    static final AtomicInteger calls = new AtomicInteger(), sequence = new AtomicInteger();
    static final java.util.concurrent.ConcurrentHashMap<String, com.raxim.myscoutee.domain.chat.document.ContactChatAccess> store=new java.util.concurrent.ConcurrentHashMap<>();
    static final AtomicInteger persisted=new AtomicInteger();
    static ConfigurableApplicationContext server;
    static URI origin;
    static HttpClient http;
    static RemoteContactPermissions remote;
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
        evidence = Path.of(System.getProperty("wireEvidenceDirectory"), "contact-permissions");
        Files.createDirectories(evidence);
        try (var files = Files.list(evidence)) { for (var file : files.filter(p -> p.getFileName().toString().startsWith("response-")).toList()) Files.delete(file); }
        server = new SpringApplicationBuilder(Fixture.class).properties("server.address=127.0.0.1", "server.port=0", "management.server.port=0",
                "myscoutee.remote.contact-permissions.command-token=" + TOKEN, "myscoutee.delegation.public-key=" + publicKey,
                "spring.main.banner-mode=off", "logging.level.root=WARN").run();
        origin = URI.create("http://127.0.0.1:" + server.getEnvironment().getProperty("local.server.port"));
        http = HttpClient.newBuilder().followRedirects(HttpClient.Redirect.NEVER).build(); meters = new SimpleMeterRegistry();
        remote = new RemoteContactPermissions(origin,TOKEN,true,Duration.ofSeconds(1),Duration.ofSeconds(3),mapper,meters,issuer);
    }
    static void authenticate(String id) {
        var profile=mock(WorkspaceProfile.class); when(profile.getUserId()).thenReturn(id);
        when(profile.getAccountUserId()).thenReturn("account"); when(profile.getWorkspaceGroupId()).thenReturn("group");
        var actor=mock(AccountIdentity.class); when(actor.getUserId()).thenReturn(id); when(actor.getUser()).thenReturn(profile);
        SecurityContextHolder.getContext().setAuthentication(new UsernamePasswordAuthenticationToken(actor,null,List.of()));
    }
    @BeforeEach void prepare() { calls.set(0); persisted.set(0); store.clear(); authenticate("a"); }
    @AfterEach void clear() { SecurityContextHolder.clearContext(); MongoSessionModeContext.clear(); }
    @AfterAll static void stop() { if(remote!=null)remote.close(); if(http!=null)http.shutdownNow(); if(server!=null)server.close(); if(meters!=null)meters.close(); }
    static byte[] body(Object value) {return mapper.writeValueAsBytes(value);}
    static String sign(String path,byte[] body){return issuer.issueForCurrent(ContactPermissionsProtocol.AUDIENCE,"POST",path,body);}
    static ContactPermissions.Change change(String peer,String status,Long version){return new ContactPermissions.Change(
            ContactPermissions.canonicalPairId("a",peer),"a",peer,"a",status,"2026-10-08T00:00:00Z","pending".equals(status)?null:"2026-10-08T01:00:00Z",version);}
    @Test void canonicalPairIdentityVersionedOwnerAndTenantIsolationSurviveHttp() throws Exception {
        assertEquals("1:ab",remote.pairId("b","a"));assertNotEquals(remote.pairId("a","bc"),remote.pairId("ab","c"));
        for(var mode:List.of(MongoSessionMode.REAL,MongoSessionMode.DEMO)) {
            MongoSessionModeContext.set(mode);authenticate("a");
            var pending=remote.save(change("b","pending",null));assertEquals(0,pending.version());
            assertEquals("a",pending.requestedBy());assertEquals("pending",pending.status());
            assertEquals(pending,remote.findById("1:ab").orElseThrow());assertEquals(List.of(pending),remote.findForUser("a"));
            authenticate("b");var approved=remote.save(change("b","approved",0L));assertEquals(1,approved.version());
            assertEquals("approved",approved.status());assertEquals(List.of(approved),remote.findForUser("b"));
            for(var path:List.of(ContactPermissionsProtocol.USER,ContactPermissionsProtocol.ENTRY)) {
                byte[] query=body(path.equals(ContactPermissionsProtocol.USER)?new ContactPermissionsProtocol.UserQuery("b"):new ContactPermissionsProtocol.EntryQuery("1:ab"));
                assertEquals(200,request(path,query,TOKEN,mode.name(),sign(path,query),"POST","application/json").statusCode());
            }
            var save=body(new ContactPermissionsProtocol.Save(change("b","rejected",1L)));
            assertEquals(200,request(ContactPermissionsProtocol.SAVE,save,TOKEN,mode.name(),sign(ContactPermissionsProtocol.SAVE,save),"POST","application/json").statusCode());
        }
        assertEquals(2,store.size());
    }
    @Test void staleVersionAndDuplicateAreKnownConflictsButUnavailableOwnerIsUnknown() throws Exception {
        var receipt = remote.save(change("b","pending",null));
        assertEquals(receipt, remote.save(change("b","pending",null)));
        var changedTimestamp = new ContactPermissions.Change("1:ab", "a", "b", "a", "pending", "2026-10-09T00:00:00Z", null, null);
        assertThrows(org.springframework.dao.DuplicateKeyException.class, () -> remote.save(changedTimestamp));
        var pending=body(new ContactPermissionsProtocol.Save(change("b","pending",null)));
        assertEquals(200,request(ContactPermissionsProtocol.SAVE,pending,TOKEN,"REAL",sign(ContactPermissionsProtocol.SAVE,pending),"POST","application/json").statusCode());
        authenticate("b");var approval = remote.save(change("b","approved",0L));
        assertEquals(approval, remote.save(change("b","approved",0L)));
        assertThrows(org.springframework.dao.OptimisticLockingFailureException.class,()->remote.save(change("b","rejected",0L)));
        var old=body(new ContactPermissionsProtocol.Save(change("b","rejected",0L)));
        assertEquals(409,request(ContactPermissionsProtocol.SAVE,old,TOKEN,"REAL",sign(ContactPermissionsProtocol.SAVE,old),"POST","application/json").statusCode());
        authenticate("a");
        assertThrows(com.raxim.myscoutee.microservices.transport.common.RemoteCommandTransport.OutcomeUnknownException.class,
                ()->remote.save(change("fail","pending",null)));
        var failure=body(new ContactPermissionsProtocol.Save(change("fail","pending",null)));
        var response=request(ContactPermissionsProtocol.SAVE,failure,TOKEN,"REAL",sign(ContactPermissionsProtocol.SAVE,failure),"POST","application/json");
        assertEquals(503,response.statusCode());assertFalse(response.body().contains("private"));
        assertTrue(remote.findById("missing").isEmpty());var missing=body(new ContactPermissionsProtocol.EntryQuery("missing"));
        assertEquals(404,request(ContactPermissionsProtocol.ENTRY,missing,TOKEN,"REAL",sign(ContactPermissionsProtocol.ENTRY,missing),"POST","application/json").statusCode());
    }
    @Test void actorProofProtectsBothReadersAndRequesterRecipientDecisions() throws Exception {
        var query=body(new ContactPermissionsProtocol.UserQuery("a"));var path=ContactPermissionsProtocol.USER;var proof=sign(path,query);
        assertEquals(401,request(path,query,null,"REAL",proof,"POST","application/json").statusCode());
        assertEquals(400,request(path,query,TOKEN,"invalid",proof,"POST","application/json").statusCode());
        assertEquals(403,request(path,query,TOKEN,"REAL",null,"POST","application/json").statusCode());
        assertEquals(403,request(path,query,TOKEN,"DEMO",proof,"POST","application/json").statusCode());
        assertEquals(403,request(path,query,TOKEN,"REAL",proof,"GET","application/json").statusCode());
        var other=body(new ContactPermissionsProtocol.UserQuery("b"));
        assertEquals(403,request(path,other,TOKEN,"REAL",proof,"POST","application/json").statusCode());
        assertEquals(403,request(path,other,TOKEN,"REAL",sign(path,other),"POST","application/json").statusCode());
        assertEquals(0,calls.get());
        remote.save(change("b","pending",null));
        var decision=body(new ContactPermissionsProtocol.Save(change("b","approved",0L)));
        assertEquals(403,request(ContactPermissionsProtocol.SAVE,decision,TOKEN,"REAL",sign(ContactPermissionsProtocol.SAVE,decision),"POST","application/json").statusCode());
        authenticate("c");
        var entry=body(new ContactPermissionsProtocol.EntryQuery("1:ab"));
        assertEquals(403,request(ContactPermissionsProtocol.ENTRY,entry,TOKEN,"REAL",sign(ContactPermissionsProtocol.ENTRY,entry),"POST","application/json").statusCode());
        assertEquals(1,persisted.get());
    }
    @Test void boundedStrictRequestsAreRejectedBeforePersistence() throws Exception {
        for(var path:ContactPermissionsProtocol.paths()) {
            var invalid="{}".getBytes();assertEquals(400,request(path,invalid,TOKEN,"REAL",sign(path,invalid),"POST","application/json").statusCode());
            assertEquals(415,request(path,invalid,TOKEN,"REAL",sign(path,invalid),"POST","text/plain").statusCode());
            var huge=new byte[ContactPermissionsProtocol.MAX_REQUEST_BYTES+1];
            assertEquals(413,request(path,huge,TOKEN,"REAL",sign(path,huge),"POST","application/json").statusCode());
        }
        assertEquals(0,calls.get());assertEquals(0,persisted.get());
    }
    @Test void lostSaveReplyDoesNotRetryAndPersistedVersionCanBeReadForReconciliation() throws Exception {
        var proxy=com.sun.net.httpserver.HttpServer.create(new InetSocketAddress("127.0.0.1",0),0);var forwarded=new AtomicInteger();
        proxy.createContext(ContactPermissionsProtocol.SAVE,exchange->{
            try {byte[] command=exchange.getRequestBody().readAllBytes();
                assertEquals(200,request(ContactPermissionsProtocol.SAVE,command,TOKEN,"REAL",exchange.getRequestHeaders().getFirst(ActorDelegation.HEADER),"POST","application/json").statusCode());
                forwarded.incrementAndGet();exchange.getResponseHeaders().set("Content-Type","application/json");exchange.sendResponseHeaders(200,100);
            } catch(Exception failed){throw new RuntimeException(failed);} finally {exchange.close();}
        });proxy.start();
        try(var broken=new RemoteContactPermissions(URI.create("http://127.0.0.1:"+proxy.getAddress().getPort()),TOKEN,true,
                Duration.ofSeconds(1),Duration.ofSeconds(1),mapper,meters,issuer)) {
            var failure=assertThrows(com.raxim.myscoutee.microservices.transport.common.RemoteCommandTransport.OutcomeUnknownException.class,
                    ()->broken.save(change("b","pending",null)));
            assertEquals("1:ab@null:pending",failure.requestId());assertEquals(1,forwarded.get());assertEquals(1,persisted.get());
            var saved=remote.findById("1:ab").orElseThrow();assertEquals("pending",saved.status());assertEquals(0,saved.version());
            assertEquals(saved, remote.save(change("b","pending",null)));
            assertEquals(1,persisted.get());
        } finally {proxy.stop(0);}
    }
    static HttpResponse<String> request(String path,byte[] body,String credential,String mode,String delegation,String method,String contentType) throws Exception {
        var builder=HttpRequest.newBuilder(origin.resolve(path)).timeout(Duration.ofSeconds(5)).header("Content-Type",contentType);
        if(credential!=null)builder.header("Authorization","Bearer "+credential);if(mode!=null)builder.header("X-MyScoutee-Session-Mode",mode);
        if(delegation!=null)builder.header(ActorDelegation.HEADER,delegation);
        var result=http.send(builder.method(method,HttpRequest.BodyPublishers.ofByteArray(body)).build(),HttpResponse.BodyHandlers.ofString());
        assertEquals("no-store",result.headers().firstValue("Cache-Control").orElseThrow());
        Files.writeString(evidence.resolve("response-"+sequence.incrementAndGet()+".json"),mapper.writeValueAsString(Map.of("path",path,"method","post","status",result.statusCode(),"body",mapper.readTree(result.body()))));return result;
    }
    @SpringBootConfiguration
    @EnableAutoConfiguration(excludeName={"org.springframework.boot.mongodb.autoconfigure.MongoAutoConfiguration","org.springframework.boot.data.mongodb.autoconfigure.DataMongoAutoConfiguration","org.springframework.boot.data.mongodb.autoconfigure.DataMongoRepositoriesAutoConfiguration","org.springframework.boot.security.autoconfigure.UserDetailsServiceAutoConfiguration"})
    @Import({com.raxim.myscoutee.common.config.JsonConfig.class,ContactPermissionsServerConfiguration.class,
            com.raxim.myscoutee.domain.chat.service.ContactPermissionService.class,ServiceSecurityConfiguration.class})
    static class Fixture {
        @Bean com.raxim.myscoutee.domain.chat.repository.ContactChatAccessRepository permissions(){
            var repository=mock(com.raxim.myscoutee.domain.chat.repository.ContactChatAccessRepository.class);
            when(repository.findById(org.mockito.ArgumentMatchers.anyString())).thenAnswer(call->{calls.incrementAndGet();return Optional.ofNullable(store.get(MongoSessionModeContext.currentMode()+":"+call.getArgument(0)));});
            when(repository.findForUser(org.mockito.ArgumentMatchers.anyString())).thenAnswer(call->{calls.incrementAndGet();String id=call.getArgument(0);return store.entrySet().stream().filter(e->e.getKey().startsWith(MongoSessionModeContext.currentMode()+":"))
                    .map(Map.Entry::getValue).filter(value->id.equals(value.leftUserId())||id.equals(value.rightUserId())).toList();});
            when(repository.save(org.mockito.ArgumentMatchers.any())).thenAnswer(call->{
                calls.incrementAndGet();com.raxim.myscoutee.domain.chat.document.ContactChatAccess value=call.getArgument(0);
                if("fail".equals(value.rightUserId()))throw new IllegalStateException("private write failure");
                String key=MongoSessionModeContext.currentMode()+":"+value.id();
                synchronized(store){var previous=store.get(key);
                    if(previous!=null && value.version()==null)throw new org.springframework.dao.DuplicateKeyException("duplicate");
                    if(previous!=null && !Objects.equals(previous.version(),value.version()))throw new org.springframework.dao.OptimisticLockingFailureException("stale");
                    var saved=new com.raxim.myscoutee.domain.chat.document.ContactChatAccess(value.id(),value.leftUserId(),value.rightUserId(),value.requestedBy(),value.status(),value.requestedAtIso(),value.decidedAtIso(),previous==null?0L:previous.version()+1);
                    store.put(key,saved);persisted.incrementAndGet();return saved;}
            });return repository;
        }
    }
}

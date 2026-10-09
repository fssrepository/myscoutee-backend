package com.raxim.myscoutee.microservices.transport.payments;

import java.net.*;
import java.net.http.*;
import java.nio.file.*;
import java.time.Duration;
import java.util.*;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.atomic.AtomicInteger;
import com.raxim.myscoutee.common.config.mongo.*;
import com.raxim.myscoutee.domain.payments.api.AffiliateRegistrations;
import com.raxim.myscoutee.domain.payments.dto.AffiliateRegistration;
import com.raxim.myscoutee.microservices.bootstrap.ServiceSecurityConfiguration;
import com.raxim.myscoutee.microservices.transport.common.RemoteReadTransport.RemoteReadException;
import com.raxim.myscoutee.microservices.transport.common.RemoteCommandTransport.OutcomeUnknownException;
import io.micrometer.core.instrument.simple.SimpleMeterRegistry;
import org.junit.jupiter.api.*;
import org.springframework.boot.*;
import org.springframework.boot.autoconfigure.*;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.context.*;
import org.springframework.context.annotation.*;
import static org.junit.jupiter.api.Assertions.*;

class AffiliateRegistrationsHttpTest {
    static final String TOKEN="test-only-affiliate-registration-token-000000000000000000";
    static final tools.jackson.databind.ObjectMapper mapper=new com.raxim.myscoutee.common.config.JsonConfig().objectMapper();
    static final AtomicInteger sequence=new AtomicInteger();
    static final List<Recorded> recorded=new CopyOnWriteArrayList<>();
    record Recorded(MongoSessionMode mode,AffiliateRegistration registration) {}
    static ConfigurableApplicationContext server;
    static RemoteAffiliateRegistrations remote;
    static SimpleMeterRegistry meters;
    static HttpClient http;
    static URI origin;
    static Path evidence;
    @BeforeAll static void start() throws Exception {
        evidence=Path.of(System.getProperty("wireEvidenceDirectory"),"affiliate-registrations");Files.createDirectories(evidence);
        try(var files=Files.list(evidence)){for(var file:files.filter(p->p.getFileName().toString().startsWith("response-")).toList())Files.delete(file);}
        server=new SpringApplicationBuilder(Fixture.class).properties("server.address=127.0.0.1","server.port=0","management.server.port=0",
                "myscoutee.remote.affiliate-registrations.command-token="+TOKEN,"spring.main.banner-mode=off","logging.level.root=WARN").run();
        origin=URI.create("http://127.0.0.1:"+server.getEnvironment().getProperty("local.server.port"));
        http=HttpClient.newBuilder().followRedirects(HttpClient.Redirect.NEVER).build();meters=new SimpleMeterRegistry();
        remote=new RemoteAffiliateRegistrations(origin,TOKEN,true,Duration.ofSeconds(1),Duration.ofSeconds(3),mapper,meters);
    }
    @BeforeEach void prepare(){recorded.clear();}
    @AfterEach void clear(){MongoSessionModeContext.clear();}
    @AfterAll static void stop(){if(remote!=null)remote.close();if(http!=null)http.shutdownNow();if(server!=null)server.close();if(meters!=null)meters.close();}
    static AffiliateRegistration registration(String user) { return new AffiliateRegistration(user,"referrer","00000000-0000-4000-8000-000000000001","2026-10-08T00:00:00Z"); }
    static byte[] query(String code,String user){return mapper.writeValueAsBytes(new AffiliateRegistrationsProtocol.Query(code,user));}
    static byte[] command(AffiliateRegistration registration){return mapper.writeValueAsBytes(new AffiliateRegistrationsProtocol.Command(registration));}
    @Test void accountsProducerRetainsRegistrationFieldsAndNativeNullsInBothModes() throws Exception {
        for(var mode:List.of(MongoSessionMode.REAL,MongoSessionMode.DEMO)) {
            MongoSessionModeContext.set(mode);
            var expected=registration("member");assertEquals(expected,remote.resolveRegistration(expected.code(),"member"));
            assertNull(remote.resolveRegistration(null,"member"));assertNull(remote.resolveRegistration("invalid","member"));
            remote.recordRegistration(expected);
            assertEquals(new Recorded(mode,expected),recorded.getLast());
            for(var code:Arrays.asList(expected.code(),null,"invalid"))
                assertEquals(200,request(AffiliateRegistrationsProtocol.RESOLVE,query(code,"member"),TOKEN,mode.name(),"POST","application/json").statusCode());
            assertEquals(200,request(AffiliateRegistrationsProtocol.RECORD,command(expected),TOKEN,mode.name(),"POST","application/json").statusCode());
            assertEquals(200,request(AffiliateRegistrationsProtocol.RECORD,command(null),TOKEN,mode.name(),"POST","application/json").statusCode());
        }
        assertEquals(4,recorded.size());
        remote.recordRegistration(null);assertEquals(4,recorded.size());
    }
    @Test void explicitOperationsRequireCapabilityModeAndBoundedStrictBodies() throws Exception {
        for(var path:AffiliateRegistrationsProtocol.paths()) {
            byte[] body=path.equals(AffiliateRegistrationsProtocol.RESOLVE)?query(null,"member"):command(registration("member"));
            assertEquals(401,request(path,body,null,"REAL","POST","application/json").statusCode());
            assertEquals(400,request(path,body,TOKEN,"invalid","POST","application/json").statusCode());
            assertEquals(403,request(path,body,TOKEN,"REAL","GET","application/json").statusCode());
            assertEquals(415,request(path,body,TOKEN,"REAL","POST","text/plain").statusCode());
            assertEquals(413,request(path,new byte[8193],TOKEN,"REAL","POST","application/json").statusCode());
            for(var invalid:List.of("{","{\"unexpected\":true}","{} {}"))
                assertEquals(400,request(path,invalid.getBytes(),TOKEN,"REAL","POST","application/json").statusCode());
        }
        assertTrue(recorded.isEmpty());
    }
    @Test void failureDoesNotBecomeMissingAttributionOrAnAutomaticWriteRetry() throws Exception {
        var response=request(AffiliateRegistrationsProtocol.RESOLVE,query("fail","member"),TOKEN,"REAL","POST","application/json");
        assertEquals(503,response.statusCode());assertFalse(response.body().contains("private"));
        assertEquals(503,assertThrows(RemoteReadException.class,()->remote.resolveRegistration("fail","member")).status());
        var value=registration("fail");
        var failure=assertThrows(OutcomeUnknownException.class,()->remote.recordRegistration(value));
        assertEquals("fail",failure.requestId());assertEquals(1,recorded.size());assertEquals(value,recorded.getFirst().registration());
        response=request(AffiliateRegistrationsProtocol.RECORD,command(value),TOKEN,"REAL","POST","application/json");
        assertEquals(503,response.statusCode());assertFalse(response.body().contains("private"));
    }
    @Test void lostHttpReplyRetainsOriginalAttributionForExplicitReconciliation() throws Exception {
        var proxy=com.sun.net.httpserver.HttpServer.create(new InetSocketAddress("127.0.0.1",0),0);
        var forwarded=new AtomicInteger();
        proxy.createContext(AffiliateRegistrationsProtocol.RECORD,exchange->{
            try {
                var response=request(AffiliateRegistrationsProtocol.RECORD,exchange.getRequestBody().readAllBytes(),TOKEN,"REAL","POST","application/json");
                assertEquals(200,response.statusCode());forwarded.incrementAndGet();
                exchange.getResponseHeaders().set("Content-Type","application/json");exchange.sendResponseHeaders(200,100);
            } catch(Exception failure){throw new RuntimeException(failure);} finally {exchange.close();}
        });proxy.start();
        try(var broken=new RemoteAffiliateRegistrations(URI.create("http://127.0.0.1:"+proxy.getAddress().getPort()),TOKEN,true,
                Duration.ofSeconds(1),Duration.ofSeconds(1),mapper,meters)) {
            var value=registration("lost-reply");
            assertEquals(value.userId(),assertThrows(OutcomeUnknownException.class,()->broken.recordRegistration(value)).requestId());
            assertEquals(1,forwarded.get());assertEquals(1,recorded.size());
            remote.recordRegistration(value);assertEquals(2,recorded.size());
            assertEquals(recorded.getFirst(),recorded.getLast());
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
    @SpringBootConfiguration
    @EnableAutoConfiguration(excludeName={"org.springframework.boot.mongodb.autoconfigure.MongoAutoConfiguration","org.springframework.boot.data.mongodb.autoconfigure.DataMongoAutoConfiguration","org.springframework.boot.data.mongodb.autoconfigure.DataMongoRepositoriesAutoConfiguration","org.springframework.boot.security.autoconfigure.UserDetailsServiceAutoConfiguration"})
    @Import({com.raxim.myscoutee.common.config.JsonConfig.class,AffiliateRegistrationsServerConfiguration.class,ServiceSecurityConfiguration.class})
    static class Fixture {
        @Bean AffiliateRegistrations owner(){return new AffiliateRegistrations(){
            public AffiliateRegistration resolveRegistration(String code,String user){
                if("fail".equals(code))throw new IllegalStateException("private database detail");
                return registration("member").code().equals(code)?registration(user):null;
            }
            public void recordRegistration(AffiliateRegistration value){
                if(value==null)return;recorded.add(new Recorded(MongoSessionModeContext.currentMode(),value));
                if("fail".equals(value.userId()))throw new IllegalStateException("private post-write failure");
            }
        };}
    }
}

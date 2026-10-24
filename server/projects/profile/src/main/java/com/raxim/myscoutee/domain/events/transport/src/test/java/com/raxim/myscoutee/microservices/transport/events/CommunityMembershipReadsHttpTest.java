package com.raxim.myscoutee.microservices.transport.events;

import com.raxim.myscoutee.common.config.mongo.MongoSessionMode;
import com.raxim.myscoutee.common.config.mongo.MongoSessionModeContext;
import com.raxim.myscoutee.microservices.bootstrap.ServiceSecurityConfiguration;
import com.raxim.myscoutee.microservices.transport.common.InternalReadCredentialFilter;
import com.raxim.myscoutee.microservices.transport.common.RemoteReadTransport.RemoteReadException;
import io.micrometer.core.instrument.simple.SimpleMeterRegistry;
import java.io.ByteArrayInputStream;
import java.net.URI;
import java.net.http.*;
import java.nio.charset.StandardCharsets;
import java.nio.file.*;
import java.time.Duration;
import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;
import org.junit.jupiter.api.*;
import org.springframework.boot.SpringBootConfiguration;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Import;
import tools.jackson.databind.json.JsonMapper;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import com.raxim.myscoutee.domain.events.document.ActivityMember;
import com.raxim.myscoutee.domain.events.repository.ActivityMembersRepository;
import com.raxim.myscoutee.domain.events.service.CommunityMembershipService;
class CommunityMembershipReadsHttpTest {
    static final String TOKEN = "test-only-community-memberships-token-00000000000000000";
    static ConfigurableApplicationContext server;
    static RemoteCommunityMembershipReads remote;
    static HttpClient http;
    static URI origin;
    static SimpleMeterRegistry meters;
    static Path evidence;
    static final AtomicInteger sequence = new AtomicInteger();
    @BeforeAll static void start() throws Exception {
        evidence = Path.of(System.getProperty("wireEvidenceDirectory"), "community-memberships");
        Files.createDirectories(evidence);
        try (var files = Files.list(evidence)) {
            for (var file : files.filter(p -> p.getFileName().toString().matches("response-[0-9]+\\.json")).toList()) Files.delete(file);
        }
        server = new SpringApplicationBuilder(Fixture.class).properties(
                "server.address=127.0.0.1", "server.port=0", "management.server.port=0",
                "myscoutee.remote.community-memberships.read-token=" + TOKEN,
                "spring.main.allow-bean-definition-overriding=false",
                "spring.main.banner-mode=off", "logging.level.root=WARN").run();
        origin = URI.create("http://127.0.0.1:" + server.getEnvironment().getProperty("local.server.port"));
        http = HttpClient.newBuilder().followRedirects(HttpClient.Redirect.NEVER).build();
        meters = new SimpleMeterRegistry();
        remote = new RemoteCommunityMembershipReads(origin, TOKEN, true, Duration.ofSeconds(1), Duration.ofSeconds(3), new JsonMapper(), meters);
    }
    @AfterEach void clear() { MongoSessionModeContext.clear(); }
    @AfterAll static void stop() {
        if (remote != null) remote.close();
        if (http != null) http.shutdownNow();
        if (server != null) server.close();
        if (meters != null) meters.close();
    }
    @Test void canonicalDetachedMembershipFieldsAndSessionModesSurviveHttp() throws Exception {
        var local=server.getBean(CommunityMembershipService.class);
        var mapper=new JsonMapper();
        for (var mode:List.of(MongoSessionMode.REAL,MongoSessionMode.DEMO,MongoSessionMode.REAL)) {
            MongoSessionModeContext.set(mode);
            assertEquals(mapper.valueToTree(local.forGroup("known")),mapper.valueToTree(remote.forGroup("known")));
            assertEquals(mapper.valueToTree(local.member("known","actor").orElseThrow()),mapper.valueToTree(remote.member("known","actor").orElseThrow()));
            assertEquals(mode.name(),remote.member("known","actor").orElseThrow().getUserId());
            assertEquals(3000000000L,remote.member("known","actor").orElseThrow().getCommunityUpdates());
            for (var path:CommunityMembershipReadsProtocol.paths()) {
                var response=request(path,"?groupId=known&accountId=actor",TOKEN,mode.name(),"GET");
                assertEquals(200,response.statusCode());assertFalse(response.body().contains("private-attendance"));
                assertFalse(response.body().contains("eventVipPriceAudit"));
            }
        }
    }
    @Test void absenceEmptyListsNullAndEncodedIdentifiersRetainMeaning() throws Exception {
        assertEquals(List.of(),remote.forGroup("empty"));assertTrue(remote.member("missing","actor").isEmpty());
        assertEquals(200,request(CommunityMembershipReadsProtocol.GROUP,"?groupId=empty",TOKEN,"REAL","GET").statusCode());
        assertEquals(404,request(CommunityMembershipReadsProtocol.MEMBER,"?groupId=missing",TOKEN,"REAL","GET").statusCode());
        var repository=server.getBean(ActivityMembersRepository.class);
        for (var group:Arrays.asList(null,"","group&é/?")) {
            remote.forGroup(group);remote.member(group,"");
            verify(repository).findByOwnerTypeAndOwnerId("community",group);
            verify(repository).findByOwnerTypeAndOwnerIdAndUserId("community",group,"");
        }
    }
    @Test void everyReadRequiresCredentialModeAndGetAndEnforcesIdLimits() throws Exception {
        for (var path:CommunityMembershipReadsProtocol.paths()) {
            for (var token:new String[]{null,"test-only-member-directory-token-00000000000000000"})
                assertEquals(401,request(path,"",token,"REAL","GET").statusCode());
            for (var mode:new String[]{null,"demo","ANY"}) assertEquals(400,request(path,"",TOKEN,mode,"GET").statusCode());
            assertEquals(403,request(path,"",TOKEN,"REAL","POST").statusCode());
            assertEquals(400,request(path,"?groupId="+"x".repeat(513),TOKEN,"REAL","GET").statusCode());
        }
        assertEquals(400,request(CommunityMembershipReadsProtocol.MEMBER,"?accountId="+"x".repeat(513),TOKEN,"REAL","GET").statusCode());
    }
    @Test void ownerFailureIsNotMissingOrEmptyMembership() throws Exception {
        for (var path:CommunityMembershipReadsProtocol.paths()) assertEquals(503,request(path,"?groupId=fail",TOKEN,"REAL","GET").statusCode());
        assertEquals(503,assertThrows(RemoteReadException.class,()->remote.forGroup("fail")).status());
        assertEquals(503,assertThrows(RemoteReadException.class,()->remote.member("fail","actor")).status());
    }
    static HttpResponse<String> request(String path,String suffix,String token,String mode,String method) throws Exception {
        var builder=HttpRequest.newBuilder(origin.resolve(path+suffix)).timeout(Duration.ofSeconds(3));
        if(token!=null)builder.header("Authorization","Bearer "+token);
        if(mode!=null)builder.header(InternalReadCredentialFilter.MODE_HEADER,mode);
        var response=http.send(builder.method(method,HttpRequest.BodyPublishers.noBody()).build(),HttpResponse.BodyHandlers.ofString());
        assertEquals("no-store",response.headers().firstValue("Cache-Control").orElseThrow());
        Files.writeString(evidence.resolve("response-"+sequence.incrementAndGet()+".json"),new JsonMapper().writeValueAsString(
                Map.of("path",path,"method","get","status",response.statusCode(),"body",new JsonMapper().readTree(response.body()))));
        return response;
    }
    @SpringBootConfiguration
    @EnableAutoConfiguration(excludeName={
            "org.springframework.boot.mongodb.autoconfigure.MongoAutoConfiguration",
            "org.springframework.boot.data.mongodb.autoconfigure.DataMongoAutoConfiguration",
            "org.springframework.boot.data.mongodb.autoconfigure.DataMongoRepositoriesAutoConfiguration",
            "org.springframework.boot.security.autoconfigure.UserDetailsServiceAutoConfiguration"})
    @Import({CommunityMembershipReadsServerConfiguration.class,ServiceSecurityConfiguration.class})
    static class Fixture {
        @Bean ActivityMembersRepository repository() {
            var repository=mock(ActivityMembersRepository.class);
            when(repository.findByOwnerTypeAndOwnerId(eq("community"),nullable(String.class))).thenAnswer(c->"empty".equals(c.getArgument(1))?List.of():List.of(member(c.getArgument(1))));
            when(repository.findByOwnerTypeAndOwnerIdAndUserId(eq("community"),nullable(String.class),nullable(String.class))).thenAnswer(c->"missing".equals(c.getArgument(1))?Optional.empty():Optional.of(member(c.getArgument(1))));
            return repository;
        }
        @Bean CommunityMembershipService members(ActivityMembersRepository repository,
                com.raxim.myscoutee.domain.accounts.api.MenuCounterUpdates counters,
                org.springframework.data.mongodb.core.MongoTemplate mongo) {
            return new CommunityMembershipService(repository, counters, mongo);
        }
        @Bean com.raxim.myscoutee.domain.accounts.api.MenuCounterUpdates counters() {
            return mock(com.raxim.myscoutee.domain.accounts.api.MenuCounterUpdates.class);
        }
        @Bean org.springframework.data.mongodb.core.MongoTemplate mongo() {
            return mock(org.springframework.data.mongodb.core.MongoTemplate.class);
        }
        @Bean com.raxim.myscoutee.common.config.mongo.MongoChangeStreamService changes() {
            return mock(com.raxim.myscoutee.common.config.mongo.MongoChangeStreamService.class);
        }
    }
    static ActivityMember member(String groupId) {
        if("fail".equals(groupId))throw new IllegalStateException("private db details");
        var row=new ActivityMember();row.setId("id");row.setOwnerType("community");row.setOwnerId(groupId);
        row.setUserId(MongoSessionModeContext.currentMode().name());row.setRole("Manager");row.setStatus("accepted");
        row.setRequestKind("invite");row.setPendingSource("source");row.setInvitedByUserId("inviter");row.setMetWhere("");row.setMetAtIso(null);
        row.setActionAtIso("action");row.setCreatedDate("created");row.setUpdatedDate("updated");
        row.setCommunityAction("join");row.setCommunityActor("actor");row.setOrganizerOnly(null);row.setVotingEligible(true);
        row.setManagerGrantedByUserId("manager");row.setCommunityUpdates(3000000000L);row.setAttendanceStatus("private-attendance");
        return row;
    }
}

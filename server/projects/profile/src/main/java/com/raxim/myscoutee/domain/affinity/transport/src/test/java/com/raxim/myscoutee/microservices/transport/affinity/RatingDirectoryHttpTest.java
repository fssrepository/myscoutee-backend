package com.raxim.myscoutee.microservices.transport.affinity;

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

import com.raxim.myscoutee.domain.affinity.document.UserRate;
import com.raxim.myscoutee.domain.affinity.repository.UserRatesRepository;
import com.raxim.myscoutee.domain.affinity.service.RatingDirectoryService;
import com.raxim.myscoutee.domain.affinity.dto.RatingDirectoryEntryDto;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.test.util.ReflectionTestUtils;
import org.bson.Document;
class RatingDirectoryHttpTest {
    static final String TOKEN = "test-only-rating-directory-token-00000000000000000";
    static ConfigurableApplicationContext server;
    static RemoteRatingDirectory remote;
    static HttpClient http;
    static URI origin;
    static SimpleMeterRegistry meters;
    static Path evidence;
    static final AtomicInteger sequence = new AtomicInteger();
    @BeforeAll static void start() throws Exception {
        evidence = Path.of(System.getProperty("wireEvidenceDirectory"), "rating-directory");
        Files.createDirectories(evidence);
        try (var files = Files.list(evidence)) {
            for (var file : files.filter(p -> p.getFileName().toString().matches("response-[0-9]+\\.json")).toList()) Files.delete(file);
        }
        server = new SpringApplicationBuilder(Fixture.class).properties(
                "server.address=127.0.0.1", "server.port=0", "management.server.port=0",
                "myscoutee.remote.rating-directory.read-token=" + TOKEN,
                "spring.main.allow-bean-definition-overriding=false",
                "spring.main.banner-mode=off", "logging.level.root=WARN").run();
        origin = URI.create("http://127.0.0.1:" + server.getEnvironment().getProperty("local.server.port"));
        http = HttpClient.newBuilder().followRedirects(HttpClient.Redirect.NEVER).build();
        meters = new SimpleMeterRegistry();
        remote = new RemoteRatingDirectory(origin, TOKEN, true, Duration.ofSeconds(1), Duration.ofSeconds(3), new JsonMapper(), meters);
    }
    @AfterEach void clear() { MongoSessionModeContext.clear(); }
    @AfterAll static void stop() {
        if (remote != null) remote.close();
        if (http != null) http.shutdownNow();
        if (server != null) server.close();
        if (meters != null) meters.close();
    }
    @Test void canonicalViewSurvivesBothModesWithoutPrivateEvidence() throws Exception {
        var local=server.getBean(RatingDirectoryService.class);
        var mapper=new JsonMapper();
        for(var mode:List.of(MongoSessionMode.REAL,MongoSessionMode.DEMO,MongoSessionMode.REAL)) {
            MongoSessionModeContext.set(mode);
            assertEquals(local.findAll().stream().map(RatingDirectoryEntryDto::from).toList(),remote.findAll());
            assertEquals(local.findRelevantByUserIds(List.of("known")).stream().map(RatingDirectoryEntryDto::from).toList(),remote.findRelevantByUserIds(List.of("known")));
            assertEquals(mode.name(),remote.findAll().getFirst().ownerUserId());
            assertEquals(8.125,remote.findAll().getFirst().affinityScore());
            assertNull(remote.findAll().getFirst().updatedDate());
            for(var path:new String[]{RatingDirectoryProtocol.ALL,RatingDirectoryProtocol.RELEVANT}) {
                var response=request(path,TOKEN,mode.name(),method(path),path.equals(RatingDirectoryProtocol.ALL)?null:"{\"ids\":[\"known\"]}","application/json");
                assertEquals(200,response.statusCode());assertFalse(response.body().contains("ratingSnapshots"));
                assertEquals(23,mapper.readTree(response.body()).get(0).size());
            }
        }
    }
    @Test void nullEmptyAndOrderedIdentifiersKeepCanonicalMeaning() throws Exception {
        var repository=server.getBean(UserRatesRepository.class);
        for(var ids:Arrays.asList(null,List.<String>of(),Arrays.asList(null,"","id&é/?","id&é/?"))) {
            remote.findRelevantByUserIds(ids);verify(repository).findRelevantByUserIds(ids);
        }
        assertTrue(remote.findRelevantByUserIds(List.of("empty")).isEmpty());
        assertEquals(200,request(RatingDirectoryProtocol.RELEVANT,TOKEN,"REAL","POST","{\"ids\":[\"empty\"]}","application/json").statusCode());
        assertThrows(IllegalArgumentException.class,()->remote.findRelevantByUserIds(Collections.nCopies(4097,"id")));
    }
    @Test void credentialModeMethodAndStrictQueryBoundsAreEnforced() throws Exception {
        for(var path:RatingDirectoryProtocol.paths()) {
            for(var token:new String[]{null,"test-only-queue-token-0000000000000000000000000000"})
                assertEquals(401,request(path,token,"REAL",method(path),"{\"ids\":[]}","application/json").statusCode());
            for(var mode:new String[]{null,"demo","ANY"})
                assertEquals(400,request(path,TOKEN,mode,method(path),"{\"ids\":[]}","application/json").statusCode());
            assertEquals(403,request(path,TOKEN,"REAL","DELETE",null,null).statusCode());
        }
        for(var body:List.of("{}","{\"ids\":[1]}","{\"ids\":[],\"extra\":true}","{\"ids\":[\""+"x".repeat(513)+"\"]}",new JsonMapper().writeValueAsString(Map.of("ids",Collections.nCopies(4097,"id")))))
            assertEquals(400,request(RatingDirectoryProtocol.RELEVANT,TOKEN,"REAL","POST",body,"application/json").statusCode());
        assertEquals(415,request(RatingDirectoryProtocol.RELEVANT,TOKEN,"REAL","POST","{\"ids\":[]}","text/plain").statusCode());
        assertEquals(413,request(RatingDirectoryProtocol.RELEVANT,TOKEN,"REAL","POST"," ".repeat(RatingDirectoryProtocol.MAX_QUERY_BYTES+1),"application/json").statusCode());
    }
    @Test void ownerFailureDoesNotBecomeAnEmptyNetwork() throws Exception {
        assertEquals(503,request(RatingDirectoryProtocol.RELEVANT,TOKEN,"REAL","POST","{\"ids\":[\"fail\"]}","application/json").statusCode());
        assertEquals(503,assertThrows(RemoteReadException.class,()->remote.findRelevantByUserIds(List.of("fail"))).status());
    }
    static String method(String path) {return path.equals(RatingDirectoryProtocol.RELEVANT)?"POST":"GET";}
    static HttpResponse<String> request(String path,String token,String mode,String method,String body,String contentType) throws Exception {
        var builder=HttpRequest.newBuilder(origin.resolve(path)).timeout(Duration.ofSeconds(3));
        if(token!=null)builder.header("Authorization","Bearer "+token);
        if(mode!=null)builder.header(InternalReadCredentialFilter.MODE_HEADER,mode);
        if(contentType!=null)builder.header("Content-Type",contentType);
        var response=http.send(builder.method(method,body==null?HttpRequest.BodyPublishers.noBody():HttpRequest.BodyPublishers.ofString(body)).build(),HttpResponse.BodyHandlers.ofString());
        assertEquals("no-store",response.headers().firstValue("Cache-Control").orElseThrow());
        Files.writeString(evidence.resolve("response-"+sequence.incrementAndGet()+".json"),new JsonMapper().writeValueAsString(
                Map.of("path",path.split("\\?",2)[0],"method",method(path.split("\\?",2)[0]).toLowerCase(Locale.ROOT),"status",response.statusCode(),"body",new JsonMapper().readTree(response.body()))));
        return response;
    }
    @Test void homeExclusionsAndPositiveCampaignQueryKeepOwnerSemantics() throws Exception {
        var local=server.getBean(RatingDirectoryService.class);
        var repository=server.getBean(UserRatesRepository.class);
        var mapper=new JsonMapper();
        for(var mode:List.of(MongoSessionMode.REAL,MongoSessionMode.DEMO)) {
            MongoSessionModeContext.set(mode);
            assertEquals(local.findHomeGameExclusionProjections("actor").stream().map(RatingDirectoryEntryDto::from).toList(),remote.findHomeGameExclusionProjections("actor"));
            assertNull(remote.findHomeGameExclusionProjections("actor").getFirst().affinityScore());
            assertEquals(mode.name(),remote.findHomeGameExclusionProjections("actor").getFirst().ownerUserId());
            assertTrue(remote.hasPositiveCampaignRating("campaign&é/?","viewer","organizer"));
            assertFalse(remote.hasPositiveCampaignRating(null,"",null));
            assertEquals(200,request(RatingDirectoryProtocol.EXCLUSIONS,TOKEN,mode.name(),"GET",null,null).statusCode());
            assertEquals(200,request(RatingDirectoryProtocol.POSITIVE,TOKEN,mode.name(),"GET",null,null).statusCode());
        }
        remote.findHomeGameExclusionProjections(null);verify(repository,atLeastOnce()).findHomeGameExclusionProjections(null);
        for(var path:List.of(RatingDirectoryProtocol.EXCLUSIONS+"?userId=fail",RatingDirectoryProtocol.POSITIVE+"?campaignId=fail")) {
            var response=request(path,TOKEN,"REAL","GET",null,null);assertEquals(503,response.statusCode());
        }
        for(var name:List.of("campaignId","viewerId","organizerId"))
            assertEquals(400,request(RatingDirectoryProtocol.POSITIVE+"?"+name+"="+"x".repeat(513),TOKEN,"REAL","GET",null,null).statusCode());
        assertEquals(400,request(RatingDirectoryProtocol.EXCLUSIONS+"?userId="+"x".repeat(513),TOKEN,"REAL","GET",null,null).statusCode());
        assertEquals(503,assertThrows(RemoteReadException.class,()->remote.hasPositiveCampaignRating("fail",null,null)).status());
    }
    @SpringBootConfiguration
    @EnableAutoConfiguration(excludeName={
            "org.springframework.boot.mongodb.autoconfigure.MongoAutoConfiguration",
            "org.springframework.boot.data.mongodb.autoconfigure.DataMongoAutoConfiguration",
            "org.springframework.boot.data.mongodb.autoconfigure.DataMongoRepositoriesAutoConfiguration",
            "org.springframework.boot.security.autoconfigure.UserDetailsServiceAutoConfiguration"})
    @Import({RatingDirectoryServerConfiguration.class,ServiceSecurityConfiguration.class})
    static class Fixture {
        @Bean UserRatesRepository repository() {
            var repository=mock(UserRatesRepository.class);
            when(repository.findAll()).thenAnswer(c->List.of(edge()));
            when(repository.findRelevantByUserIds(nullable(List.class))).thenAnswer(c->{
                var ids=c.getArgument(0);
                if(List.of("fail").equals(ids))throw new IllegalStateException("private db details");
                return List.of("empty").equals(ids)?List.of():List.of(edge());
            });
            when(repository.findHomeGameExclusionProjections(nullable(String.class))).thenAnswer(c->{
                if("fail".equals(c.getArgument(0)))throw new IllegalStateException("private details");
                var row=new UserRate();row.setOwnerUserId(MongoSessionModeContext.currentMode().name());
                row.setMode("single");row.setRelatedUserId("peer");row.setScoreGiven(8.125);row.setMet(true);return List.of(row);
            });
            return repository;
        }
        @Bean MongoTemplate mongo() {
            var mongo=mock(MongoTemplate.class);
            when(mongo.exists(any(Query.class),eq(UserRate.class))).thenAnswer(c->{
                var query=((Query)c.getArgument(0)).getQueryObject();
                assertEquals(new Document("$gt",0),query.get("scoreGiven"));
                assertEquals(Set.of("campaignId","ownerUserId","relatedUserId","scoreGiven"),query.keySet());
                if("fail".equals(query.get("campaignId")))throw new IllegalStateException("private db details");
                return "campaign&é/?".equals(query.get("campaignId")) && "viewer".equals(query.get("ownerUserId")) && "organizer".equals(query.get("relatedUserId"));
            });return mongo;
        }
        @Bean RatingDirectoryService ratings(UserRatesRepository repository,MongoTemplate mongo) {
            var service=new RatingDirectoryService(repository, mongo);return service;
        }
    }
    static UserRate edge() {
        var row=new UserRate();row.setId("rating");row.setCampaignId("campaign");row.setSyncKey("sync");
        row.setMode("pair");row.setCreatedDate("created");row.setCreatedUser("creator");row.setUpdatedDate(null);row.setUpdatedUser("");
        row.setOwnerUserId(MongoSessionModeContext.currentMode().name());row.setRelatedUserId("peer");row.setSecondaryRelatedUserId(null);
        row.setScoreGiven(8.125);row.setScoreReceived(7.25);row.setAffinityScore(8.125);row.setEvidenceConfidence(.75);
        row.setMutuallyRated(true);row.setSocialContext("context");row.setBridgeUserId(null);row.setBridgeCount(2);
        row.setMet(false);row.setMetEventId(null);row.setEventName("");row.setDistanceMetersExact(100);
        row.setRatingSnapshots(Map.of());return row;
    }
}

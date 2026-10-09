package com.raxim.myscoutee.microservices.transport.accounts;

import com.raxim.myscoutee.common.config.mongo.*;
import com.raxim.myscoutee.domain.accounts.api.Experiences;
import com.raxim.myscoutee.domain.accounts.document.UserExperienceProfile;
import com.raxim.myscoutee.domain.accounts.dto.ExperienceDtos.*;
import com.raxim.myscoutee.domain.accounts.repository.UserExperienceProfilesRepository;
import com.raxim.myscoutee.domain.accounts.service.ExperienceDirectoryService;
import com.raxim.myscoutee.microservices.bootstrap.ServiceSecurityConfiguration;
import com.raxim.myscoutee.microservices.transport.common.InternalReadCredentialFilter;
import com.raxim.myscoutee.microservices.transport.common.RemoteReadTransport.RemoteReadException;
import io.micrometer.core.instrument.simple.SimpleMeterRegistry;
import java.net.URI;
import java.net.http.*;
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

class ExperiencesHttpTest {
    static final String TOKEN="test-only-experiences-token-00000000000000000000";
    static final JsonMapper mapper=new JsonMapper();
    static ConfigurableApplicationContext server;
    static RemoteExperiences remote;
    static HttpClient http;
    static URI origin;
    static SimpleMeterRegistry meters;
    static Path evidence;
    static final AtomicInteger sequence=new AtomicInteger();
    @BeforeAll static void start() throws Exception {
        evidence=Path.of(System.getProperty("wireEvidenceDirectory"),"experiences");Files.createDirectories(evidence);
        try(var files=Files.list(evidence)) {
            for(var file:files.filter(p->p.getFileName().toString().matches("response-[0-9]+\\.json")).toList())Files.delete(file);
        }
        server=new SpringApplicationBuilder(Fixture.class).properties("server.address=127.0.0.1","server.port=0","management.server.port=0",
                "myscoutee.remote.experiences.read-token="+TOKEN,"spring.main.banner-mode=off","logging.level.root=WARN").run();
        origin=URI.create("http://127.0.0.1:"+server.getEnvironment().getProperty("local.server.port"));
        http=HttpClient.newBuilder().followRedirects(HttpClient.Redirect.NEVER).build();meters=new SimpleMeterRegistry();
        remote=new RemoteExperiences(origin,TOKEN,true,Duration.ofSeconds(1),Duration.ofSeconds(3),mapper,meters);
    }
    @AfterEach void clear(){MongoSessionModeContext.clear();}
    @AfterAll static void stop(){if(remote!=null)remote.close();if(http!=null)http.shutdownNow();if(server!=null)server.close();if(meters!=null)meters.close();}
    @Test void existingDtoFieldsNullsOrderAndModesSurviveHttpWithoutPersistenceMetadata() throws Exception {
        var local=server.getBean(Experiences.class);
        for(var mode:List.of(MongoSessionMode.REAL,MongoSessionMode.DEMO,MongoSessionMode.REAL)) {
            MongoSessionModeContext.set(mode);
            assertEquals(local.findByUserId("known").map(UserExperiencesResponseDto::from),remote.findByUserId("known"));
            var ids=Arrays.asList("known",null,"absent","empty","known");
            assertEquals(local.findByUserIdIn(ids).stream().map(UserExperiencesResponseDto::from).toList(),remote.findByUserIdIn(ids));
            var one=request(ExperiencesProtocol.ONE,"?id=known","",TOKEN,mode.name(),"GET","application/json");
            assertEquals(200,one.statusCode());assertFalse(one.body().contains("private-storage"));
            assertEquals(200,request(ExperiencesProtocol.BATCH,"",mapper.writeValueAsString(Map.of("ids",ids)),TOKEN,mode.name(),"POST","application/json").statusCode());
            assertEquals(mode,MongoSessionModeContext.currentMode());
        }
    }
    @Test void absenceEmptyListsNullsAndEncodedIdentifiersRetainMeaning() throws Exception {
        assertTrue(remote.findByUserId("absent").isEmpty());
        assertEquals(404,request(ExperiencesProtocol.ONE,"?id=absent","",TOKEN,"REAL","GET","application/json").statusCode());
        for(var id:Arrays.asList(null,"","id&é/?")) {
            remote.findByUserId(id);verify(server.getBean(UserExperienceProfilesRepository.class)).findByUserId(id);
        }
        assertEquals(List.of(),remote.findByUserIdIn(List.of()));assertEquals(List.of(),remote.findByUserIdIn(null));
        assertNull(remote.findByUserId("empty").orElseThrow().entries());
        assertEquals(200,request(ExperiencesProtocol.BATCH,"","{\"ids\":null}",TOKEN,"REAL","POST","application/json").statusCode());
    }
    @Test void batchIsOneOwnerCallAndRetainsAllIdentifiers() {
        var repo=server.getBean(UserExperienceProfilesRepository.class);clearInvocations(repo);
        var ids=Arrays.asList("known",null,"", "id&é/?","known");
        remote.findByUserIdIn(ids);verify(repo,times(1)).findByUserIdIn(ids);verifyNoMoreInteractions(repo);
    }
    @Test void credentialsModeMethodsAndRequestBoundsAreEnforced() throws Exception {
        for(var path:ExperiencesProtocol.paths()) {
            String method=path.equals(ExperiencesProtocol.ONE)?"GET":"POST";
            for(var token:new String[]{null,"wrong-capability-000000000000000000000000"})
                assertEquals(401,request(path,"","{\"ids\":[]}",token,"REAL",method,"application/json").statusCode());
            for(var mode:new String[]{null,"demo","ANY"})
                assertEquals(400,request(path,"","{\"ids\":[]}",TOKEN,mode,method,"application/json").statusCode());
            assertEquals(403,request(path,"","",TOKEN,"REAL",method.equals("GET")?"POST":"GET","application/json").statusCode());
        }
        assertEquals(400,request(ExperiencesProtocol.ONE,"?id="+"x".repeat(513),"",TOKEN,"REAL","GET","application/json").statusCode());
        for(var invalid:List.of("null","[]","{}","{} {}","{\"ids\":{},\"extra\":true}","{\"ids\":[3]}","{\"ids\":[\""+"x".repeat(513)+"\"]}",mapper.writeValueAsString(Map.of("ids",Collections.nCopies(4097,"x")))))
            assertEquals(400,request(ExperiencesProtocol.BATCH,"",invalid,TOKEN,"REAL","POST","application/json").statusCode());
        assertEquals(415,request(ExperiencesProtocol.BATCH,"","{}",TOKEN,"REAL","POST","text/plain").statusCode());
        assertEquals(413,request(ExperiencesProtocol.BATCH,"","x".repeat(1024*1024+1),TOKEN,"REAL","POST","application/json").statusCode());
        assertThrows(IllegalArgumentException.class,()->remote.findByUserIdIn(Collections.nCopies(4097,"x")));
    }
    @Test void ownerFailureIsDistinctFromAbsence() throws Exception {
        for(var path:ExperiencesProtocol.paths())
            assertEquals(503,request(path,path.equals(ExperiencesProtocol.ONE)?"?id=fail":"","{\"ids\":[\"fail\"]}",TOKEN,"REAL",path.equals(ExperiencesProtocol.ONE)?"GET":"POST","application/json").statusCode());
        assertEquals(503,assertThrows(RemoteReadException.class,()->remote.findByUserId("fail")).status());
        assertEquals(503,assertThrows(RemoteReadException.class,()->remote.findByUserIdIn(List.of("fail"))).status());
    }
    static HttpResponse<String> request(String path,String suffix,String body,String token,String mode,String method,String media) throws Exception {
        var builder=HttpRequest.newBuilder(origin.resolve(path+suffix)).timeout(Duration.ofSeconds(3)).header("Content-Type",media);
        if(token!=null)builder.header("Authorization","Bearer "+token);
        if(mode!=null)builder.header(InternalReadCredentialFilter.MODE_HEADER,mode);
        var response=http.send(builder.method(method,HttpRequest.BodyPublishers.ofString(body)).build(),HttpResponse.BodyHandlers.ofString());
        assertEquals("no-store",response.headers().firstValue("Cache-Control").orElseThrow());
        Files.writeString(evidence.resolve("response-"+sequence.incrementAndGet()+".json"),mapper.writeValueAsString(Map.of(
                "path",path,"method",path.equals(ExperiencesProtocol.ONE)?"get":"post","status",response.statusCode(),"body",mapper.readTree(response.body()))));
        return response;
    }
    static UserExperienceProfile row(String id) {
        var profile=new UserExperienceProfile();profile.setMongoId("private-storage");profile.setUpdatedAtIso("private-storage");profile.setUserId(id);
        if("empty".equals(id)){profile.setEntries(null);return profile;}
        var entry=new UserExperienceProfile.ExperienceItemRecord();entry.setId("entry");entry.setType("work");entry.setTitle("Title");
        entry.setOrg(MongoSessionModeContext.currentMode().name());entry.setCity("Budapest");entry.setDateFrom("2020-01");entry.setDateTo(null);entry.setDescription("Description");
        profile.setEntries(Arrays.asList(entry,null));return profile;
    }
    @SpringBootConfiguration
    @EnableAutoConfiguration(excludeName={"org.springframework.boot.mongodb.autoconfigure.MongoAutoConfiguration",
            "org.springframework.boot.data.mongodb.autoconfigure.DataMongoAutoConfiguration",
            "org.springframework.boot.data.mongodb.autoconfigure.DataMongoRepositoriesAutoConfiguration",
            "org.springframework.boot.security.autoconfigure.UserDetailsServiceAutoConfiguration"})
    @Import({ExperiencesServerConfiguration.class,ServiceSecurityConfiguration.class})
    static class Fixture {
        @Bean UserExperienceProfilesRepository repository(){
            var repo=mock(UserExperienceProfilesRepository.class);
            when(repo.findByUserId(nullable(String.class))).thenAnswer(call->{
                String id=call.getArgument(0);if("fail".equals(id))throw new IllegalStateException("private db detail");
                return "absent".equals(id)?Optional.empty():Optional.of(row(id));
            });
            when(repo.findByUserIdIn(nullable(Collection.class))).thenAnswer(call->{
                Collection<String> ids=call.getArgument(0);if(ids==null)return List.of();
                if(ids.contains("fail"))throw new IllegalStateException("private db detail");
                return ids.stream().filter(id->!"absent".equals(id)).map(ExperiencesHttpTest::row).toList();
            });return repo;
        }
        @Bean Experiences owner(UserExperienceProfilesRepository repo){return new ExperienceDirectoryService(repo);}
    }
}

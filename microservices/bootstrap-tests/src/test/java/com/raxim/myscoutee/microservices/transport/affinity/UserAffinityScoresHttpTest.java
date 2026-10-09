package com.raxim.myscoutee.microservices.transport.affinity;

import com.raxim.myscoutee.common.config.mongo.*;
import com.raxim.myscoutee.domain.accounts.api.*;
import com.raxim.myscoutee.domain.accounts.dto.AuthDtos.*;
import com.raxim.myscoutee.domain.affinity.api.UserAffinityScores;
import com.raxim.myscoutee.domain.affinity.dto.UserAffinityInputDto;
import com.raxim.myscoutee.domain.affinity.document.AffinityConfig;
import com.raxim.myscoutee.domain.affinity.repository.AffinityConfigsRepository;
import com.raxim.myscoutee.domain.affinity.service.AbsoluteAffinityService;
import com.raxim.myscoutee.domain.groups.api.GroupDirectory;
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
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import tools.jackson.databind.json.JsonMapper;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

class UserAffinityScoresHttpTest {
    static final String TOKEN="test-only-user-affinity-token-000000000000000000";
    static final JsonMapper mapper=new JsonMapper();
    static ConfigurableApplicationContext server;
    static RemoteUserAffinityScores remote;
    static HttpClient http;
    static URI origin;
    static SimpleMeterRegistry meters;
    static Path evidence;
    static final AtomicInteger sequence=new AtomicInteger();
    @BeforeAll static void start() throws Exception {
        evidence=Path.of(System.getProperty("wireEvidenceDirectory"),"user-affinity");Files.createDirectories(evidence);
        try(var files=Files.list(evidence)) {
            for(var file:files.filter(p->p.getFileName().toString().matches("response-[0-9]+\\.json")).toList()) Files.delete(file);
        }
        server=new SpringApplicationBuilder(Fixture.class).properties(
                "server.address=127.0.0.1","server.port=0","management.server.port=0",
                "myscoutee.remote.user-affinity.read-token="+TOKEN,"spring.main.banner-mode=off","logging.level.root=WARN").run();
        origin=URI.create("http://127.0.0.1:"+server.getEnvironment().getProperty("local.server.port"));
        http=HttpClient.newBuilder().followRedirects(HttpClient.Redirect.NEVER).build();meters=new SimpleMeterRegistry();
        remote=new RemoteUserAffinityScores(origin,TOKEN,true,Duration.ofSeconds(1),Duration.ofSeconds(3),mapper,meters);
    }
    @AfterEach void clear(){MongoSessionModeContext.clear();SecurityContextHolder.clearContext();}
    @AfterAll static void stop(){if(remote!=null)remote.close();if(http!=null)http.shutdownNow();if(server!=null)server.close();if(meters!=null)meters.close();}
    @Test void canonicalCalculationRetainsProfileFieldsWorkspaceAndMode() throws Exception {
        var local=server.getBean(UserAffinityScores.class);
        var values=new HashSet<Double>();
        for(var mode:List.of(MongoSessionMode.REAL,MongoSessionMode.DEMO,MongoSessionMode.REAL)) {
            MongoSessionModeContext.set(mode);
            for(var workspace:Arrays.asList(null,"","workspace&é/?")) {
                double expected=local.calculateUserAffinity(input(),workspace);
                assertEquals(expected,remote.calculateUserAffinity(input(),workspace));values.add(expected);
                var response=request(body(input(),workspace),TOKEN,mode.name(),"POST","application/json");
                assertEquals(200,response.statusCode());assertEquals(expected,mapper.readTree(response.body()).get("affinity").asDouble());
            }
            assertEquals(mode,MongoSessionModeContext.currentMode());
        }
        assertTrue(values.size()>=4,"Workspace and REAL/DEMO configurations must affect the actual result");
    }
    @Test void userDtoEntryPointPreservesCurrentWorkspaceAndDoesNotShipUnrelatedFields() {
        var input=input();
        var dto=new UserDto(input.id(),"not-sent",input.age(),"not-sent",input.city(),input.height(),input.physique(),input.languages(),
                input.horoscope(),"not-sent",input.gender(),"not-sent",input.hostTier(),input.traitLabel(),input.completion(),999,
                input.headline(),input.about(),999999d,null,"not-sent",List.of("not-sent"),input.profileDetails(),input.impressions(),
                "not-sent","not-sent","not-sent",true,true,null,null);
        var profile=mock(WorkspaceProfile.class);when(profile.getWorkspaceGroupId()).thenReturn("workspace&é/?");
        var principal=mock(AccountIdentity.class);when(principal.getUser()).thenReturn(profile);
        when(principal.getProfileIdentity()).thenCallRealMethod();
        SecurityContextHolder.getContext().setAuthentication(new UsernamePasswordAuthenticationToken(principal,null,List.of()));
        assertEquals(server.getBean(UserAffinityScores.class).resolveUserAffinity(dto),remote.resolveUserAffinity(dto));
        assertEquals(input,UserAffinityInputDto.from(dto));
        assertFalse(mapper.writeValueAsString(new UserAffinityScoresProtocol.Query(UserAffinityInputDto.from(dto),null)).contains("not-sent"));
    }
    @Test void nullInputAndMissingOptionalFieldsRetainCanonicalSemantics() throws Exception {
        assertEquals(0d,remote.calculateUserAffinity(null,null));
        assertEquals(200,request(body(null,null),TOKEN,"REAL","POST","application/json").statusCode());
        var minimum=new UserAffinityInputDto(null,null,null,null,null,null,null,null,null,null,null,null,null,null,null);
        assertEquals(server.getBean(UserAffinityScores.class).calculateUserAffinity(minimum,null),remote.calculateUserAffinity(minimum,null));
    }
    @Test void requestsRequireCapabilityModeMethodStrictJsonAndBoundedBody() throws Exception {
        for(var token:new String[]{null,"wrong-capability-000000000000000000000000"})
            assertEquals(401,request(body(input(),null),token,"REAL","POST","application/json").statusCode());
        for(var mode:new String[]{null,"demo","ANY"})
            assertEquals(400,request(body(input(),null),TOKEN,mode,"POST","application/json").statusCode());
        assertEquals(403,request("",TOKEN,"REAL","GET","application/json").statusCode());
        for(var body:List.of("null","[]","{","{} {}","{\"unknown\":true}","{\"user\":{\"admin\":true}}",body(input(),"x".repeat(513))))
            assertEquals(400,request(body,TOKEN,"REAL","POST","application/json").statusCode());
        assertEquals(415,request("{}",TOKEN,"REAL","POST","text/plain").statusCode());
        assertEquals(413,request("x".repeat(65537),TOKEN,"REAL","POST","application/json").statusCode());
        assertThrows(IllegalArgumentException.class,()->remote.calculateUserAffinity(input(),"x".repeat(513)));
    }
    @Test void failedOwnerRemainsUnavailableNotZero() throws Exception {
        var response=request(body(input(),"fail"),TOKEN,"DEMO","POST","application/json");
        assertEquals(503,response.statusCode());assertFalse(response.body().contains("private"));
        assertEquals(503,assertThrows(RemoteReadException.class,()->remote.calculateUserAffinity(input(),"fail")).status());
        assertEquals(200,request(body(input(),null),TOKEN,"REAL","POST","application/json").statusCode());
    }
    static String body(UserAffinityInputDto user,String workspace){return mapper.writeValueAsString(new UserAffinityScoresProtocol.Query(user,workspace));}
    static HttpResponse<String> request(String body,String token,String mode,String method,String media) throws Exception {
        var builder=HttpRequest.newBuilder(origin.resolve(UserAffinityScoresProtocol.PATH)).timeout(Duration.ofSeconds(3)).header("Content-Type",media);
        if(token!=null)builder.header("Authorization","Bearer "+token);
        if(mode!=null)builder.header(InternalReadCredentialFilter.MODE_HEADER,mode);
        var response=http.send(builder.method(method,HttpRequest.BodyPublishers.ofString(body)).build(),HttpResponse.BodyHandlers.ofString());
        assertEquals("no-store",response.headers().firstValue("Cache-Control").orElseThrow());
        Files.writeString(evidence.resolve("response-"+sequence.incrementAndGet()+".json"),mapper.writeValueAsString(
                Map.of("path",UserAffinityScoresProtocol.PATH,"method","post","status",response.statusCode(),"body",mapper.readTree(response.body()))));
        return response;
    }
    static UserAffinityInputDto input(){
        return new UserAffinityInputDto("user&é/?",32,"Budapest","175 cm","active",Arrays.asList("English",null,"Hungarian"),
                "Gemini","woman","local host","planner",80,"Weekends","Games & hikes",
                Arrays.asList(null,new ProfileDetailGroupDto("Interests",Arrays.asList(null,new ProfileDetailRowDto("hobby","music","public",List.of("music"))))),
                new UserImpressionsDto(new UserImpressionsSectionDto(1,8.5d,12,7,3,0,List.of("warm"),List.of("planner"),
                        List.of(new UserPersonalityTraitDto("reliable","Reliable",90,7,"2026-05-01T10:00:00Z")),List.of("host")),null));
    }
    @SpringBootConfiguration
    @EnableAutoConfiguration(excludeName={"org.springframework.boot.mongodb.autoconfigure.MongoAutoConfiguration",
            "org.springframework.boot.data.mongodb.autoconfigure.DataMongoAutoConfiguration",
            "org.springframework.boot.data.mongodb.autoconfigure.DataMongoRepositoriesAutoConfiguration",
            "org.springframework.boot.security.autoconfigure.UserDetailsServiceAutoConfiguration"})
    @Import({UserAffinityScoresServerConfiguration.class,ServiceSecurityConfiguration.class})
    static class Fixture {
        @Bean AffinityConfigsRepository configs(){
            var repository=mock(AffinityConfigsRepository.class);
            when(repository.findFirstByKeyAndActiveTrueOrderByVersionDesc(anyString())).thenAnswer(call->{
                var config=AffinityConfig.defaults();
                config.getAbsolute().getUser().getAge().setMultiplier((MongoSessionModeContext.currentMode()==MongoSessionMode.DEMO?40d:20d)
                        +("default".equals(call.getArgument(0))?0:5));
                return Optional.of(config);
            });return repository;
        }
        @Bean GroupDirectory groups(){
            var owner=mock(GroupDirectory.class);
            when(owner.baseGroupIds(anyCollection())).thenAnswer(call->{
                Collection<String> ids=call.getArgument(0);
                if(ids.contains("fail"))throw new IllegalStateException("private owner failure");
                var result=new HashMap<String,String>();for(var id:ids)result.put(id,"base:"+id);return result;
            });return owner;
        }
        @Bean Experiences experiences(){
            var owner=mock(Experiences.class);
            var entry=mock(Experiences.Entry.class);when(entry.getTitle()).thenReturn("Experience used by canonical calculator");
            var profile=mock(Experiences.Profile.class);doReturn(List.of(entry)).when(profile).getEntries();
            doReturn(Optional.of(profile)).when(owner).findByUserId(anyString());return owner;
        }
        @Bean UserAffinityScores owner(AffinityConfigsRepository configs,Experiences experiences,GroupDirectory groups){
            return new AbsoluteAffinityService(configs,experiences,groups);
        }
    }
}

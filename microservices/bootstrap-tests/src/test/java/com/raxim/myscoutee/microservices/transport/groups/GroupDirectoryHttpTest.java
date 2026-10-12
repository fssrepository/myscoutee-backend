package com.raxim.myscoutee.microservices.transport.groups;

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

import com.raxim.myscoutee.domain.groups.api.BaseGroups;
import com.raxim.myscoutee.domain.groups.dto.GroupDirectoryEntryDto;
import com.raxim.myscoutee.domain.groups.dto.GroupPolicy;
import com.raxim.myscoutee.domain.groups.document.CommunityGroup;
import com.raxim.myscoutee.domain.groups.repository.CommunityGroupsRepository;
import com.raxim.myscoutee.domain.groups.service.GroupDirectoryService;
import org.bson.Document;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.test.util.ReflectionTestUtils;
class GroupDirectoryHttpTest {
    static final String TOKEN = "test-only-group-directory-token-00000000000000000";
    static ConfigurableApplicationContext server;
    static RemoteGroupDirectory remote;
    static HttpClient http;
    static URI origin;
    static SimpleMeterRegistry meters;
    static Path evidence;
    static final AtomicInteger sequence = new AtomicInteger();
    @BeforeAll static void start() throws Exception {
        evidence = Path.of(System.getProperty("wireEvidenceDirectory"), "group-directory");
        Files.createDirectories(evidence);
        try (var files = Files.list(evidence)) {
            for (var file : files.filter(p -> p.getFileName().toString().matches("response-[0-9]+\\.json")).toList()) Files.delete(file);
        }
        server = new SpringApplicationBuilder(Fixture.class).properties(
                "server.address=127.0.0.1", "server.port=0", "management.server.port=0",
                "myscoutee.remote.group-directory.read-token=" + TOKEN,
                "spring.main.allow-bean-definition-overriding=false",
                "spring.main.banner-mode=off", "logging.level.root=WARN").run();
        origin = URI.create("http://127.0.0.1:" + server.getEnvironment().getProperty("local.server.port"));
        http = HttpClient.newBuilder().followRedirects(HttpClient.Redirect.NEVER).build();
        meters = new SimpleMeterRegistry();
        remote = new RemoteGroupDirectory(origin, TOKEN, true, Duration.ofSeconds(1), Duration.ofSeconds(3), new JsonMapper(), meters);
    }
    @AfterEach void clear() { MongoSessionModeContext.clear(); }
    @AfterAll static void stop() {
        if (remote != null) remote.close();
        if (http != null) http.shutdownNow();
        if (server != null) server.close();
        if (meters != null) meters.close();
    }
    static final List<String> IDS=List.of("community-active","community-deleted","community-review","work", "unknown", BaseGroups.COMMUNITY_BASE_ID, BaseGroups.WORK_BASE_ID);
    @Test void workspaceNameUsesTheExistingSingleOwnerLookup() {
        var repository = server.getBean(CommunityGroupsRepository.class);
        org.mockito.Mockito.clearInvocations(repository);
        var names = new java.util.ArrayList<String>();
        remote.withWorkspaceName("work", names::add);
        assertEquals(1, names.size());
        verify(repository).findById("work");
        org.mockito.Mockito.verifyNoMoreInteractions(repository);
    }

    @Test void supportWorkspaceRetainsTheExistingSingleLookupAndAbsentGroupDistinction() {
        var repository = server.getBean(CommunityGroupsRepository.class);
        for (String id : List.of("work", "missing", BaseGroups.WORK_BASE_ID)) {
            var expected = server.getBean(GroupDirectoryService.class).supportWorkspace(id);
            clearInvocations(repository);
            assertEquals(expected, remote.supportWorkspace(id));
            verify(repository).findById(id);
            verifyNoMoreInteractions(repository);
        }
        assertFalse(remote.supportWorkspace("missing").present());
        assertEquals(BaseGroups.WORK_BASE_ID, remote.supportWorkspace(BaseGroups.WORK_BASE_ID).baseId());
        assertEquals(503, assertThrows(RemoteReadException.class, () -> remote.supportWorkspace("fail")).status());
    }

    @Test void allCanonicalDirectoryOperationsPreserveDerivedPolicyAndModes() throws Exception {
        var local=server.getBean(GroupDirectoryService.class);
        for (var mode:List.of(MongoSessionMode.REAL,MongoSessionMode.DEMO,MongoSessionMode.REAL)) {
            MongoSessionModeContext.set(mode);
            for (var id:IDS) {
                assertEquals(local.findById(id).map(GroupDirectoryEntryDto::from),remote.findById(id));
                assertEquals(local.name(id),remote.name(id)); assertEquals(local.type(id),remote.type(id));
            }
            assertEquals(local.findByIdIn(IDS).stream().map(GroupDirectoryEntryDto::from).toList(),remote.findByIdIn(IDS));
            assertEquals(local.findAllById(IDS).stream().map(GroupDirectoryEntryDto::from).toList(),remote.findAllById(IDS));
            assertEquals(local.activeCommunityIds(IDS),remote.activeCommunityIds(IDS));
            assertEquals(local.workGroupIds(IDS),remote.workGroupIds(IDS));
            assertEquals(local.baseGroupIds(IDS),remote.baseGroupIds(IDS));
            assertEquals(local.workspaceBaseIds(),remote.workspaceBaseIds());
            assertEquals(Set.of("community-active"),remote.activeCommunityIds(IDS));
            assertEquals(mode.name(),remote.findById("work").orElseThrow().ownerUserId());
            for (var path:GroupDirectoryProtocol.paths()) assertEquals(200,request(path,"?id=work",query(IDS),TOKEN,mode.name(),method(path),"application/json",false).statusCode());
        }
        assertTrue(remote.findById("community-deleted").orElseThrow().deleted());
        assertTrue(remote.findById("community-review").orElseThrow().awaitingOwner());
        assertEquals(0,remote.findById("community-review").orElseThrow().pendingModerationCount());
        assertEquals(3000000000L,remote.findById("work").orElseThrow().pendingMemberCount());
    }
    @Test void absenceEmptyBatchesAndNullableEncodedIdsRemainDistinct() throws Exception {
        for (var path:List.of(GroupDirectoryProtocol.ENTRY,GroupDirectoryProtocol.NAME,GroupDirectoryProtocol.TYPE))
            assertEquals(404,request(path,"?id=missing","",TOKEN,"REAL","GET","application/json",false).statusCode());
        assertTrue(remote.findById("missing").isEmpty());assertTrue(remote.name("missing").isEmpty());assertTrue(remote.type("missing").isEmpty());
        assertEquals(List.of(),remote.findByIdIn(List.of()));assertEquals(List.of(),remote.findAllById(List.of()));
        assertEquals(Set.of(),remote.activeCommunityIds(List.of()));assertEquals(Map.of(),remote.baseGroupIds(List.of()));
        assertEquals(Set.of(),remote.workGroupIds(List.of()));
        var repository=server.getBean(CommunityGroupsRepository.class);
        for (var id:Arrays.asList(null,"","id&é/?")) { remote.findById(id);verify(repository).findById(id); }
        assertEquals(200,request(GroupDirectoryProtocol.ENTRIES,"",query(List.of()),TOKEN,"REAL","POST","application/json",false).statusCode());
    }
    @Test void everyOperationUsesDedicatedReadCredentialAndSessionMode() throws Exception {
        for (var path:GroupDirectoryProtocol.paths()) {
            for (var token:new String[]{null,"test-only-groups-media-token-0000000000000000000000"})
                assertEquals(401,request(path,"?id=work",query(IDS),token,"REAL",method(path),"application/json",false).statusCode());
            for (var mode:new String[]{null,"demo","ANY"})
                assertEquals(400,request(path,"?id=work",query(IDS),TOKEN,mode,method(path),"application/json",false).statusCode());
            assertEquals(403,request(path,"",query(IDS),TOKEN,"REAL",method(path).equals("GET")?"POST":"GET","application/json",false).statusCode());
        }
    }
    @Test void batchesEnforceStrictTypesAndSizeIncludingChunkedRequests() throws Exception {
        for (var path:GroupDirectoryProtocol.paths()) {
            if (!method(path).equals("POST")) continue;
            for (var body:List.of("null","{}","{","{\"ids\":[7]}","{\"ids\":[],\"extra\":1}",query(IDS)+" {}",query(Collections.nCopies(4097,"x")),query(List.of("x".repeat(513)))))
                assertEquals(400,request(path,"",body,TOKEN,"REAL","POST","application/json",false).statusCode());
            assertEquals(415,request(path,"","{}",TOKEN,"REAL","POST","text/plain",false).statusCode());
            for (boolean chunked:List.of(false,true)) assertEquals(413,request(path,""," ".repeat(GroupDirectoryProtocol.MAX_QUERY_BYTES+1),TOKEN,"REAL","POST","application/json",chunked).statusCode());
        }
        assertEquals(400,request(GroupDirectoryProtocol.ENTRY,"?id="+"x".repeat(513),"",TOKEN,"REAL","GET","application/json",false).statusCode());
        assertThrows(IllegalArgumentException.class,()->remote.findByIdIn(Collections.nCopies(4097,"x")));
        var ids=Collections.nCopies(100,"x".repeat(500));
        assertEquals(100,remote.findByIdIn(ids).size());
    }
    @Test void canonicalFailuresStayUnavailableAndNeverBecomeNoMembership() throws Exception {
        for (var path:GroupDirectoryProtocol.paths()) {
            if (path.equals(GroupDirectoryProtocol.BASES)) continue;
            assertEquals(503,request(path,"?id=fail",query(List.of("fail")),TOKEN,"REAL",method(path),"application/json",false).statusCode());
        }
        assertEquals(503,assertThrows(RemoteReadException.class,()->remote.findById("fail")).status());
        assertEquals(503,assertThrows(RemoteReadException.class,()->remote.activeCommunityIds(null)).status());
        assertEquals(503,request(GroupDirectoryProtocol.ACTIVE,"","{\"ids\":null}",TOKEN,"REAL","POST","application/json",false).statusCode());
    }
    static String method(String path) { return Set.of(GroupDirectoryProtocol.ENTRY,GroupDirectoryProtocol.NAME,GroupDirectoryProtocol.TYPE,GroupDirectoryProtocol.BASES).contains(path)?"GET":"POST"; }
    static String query(List<String> ids) { return new JsonMapper().writeValueAsString(new GroupDirectoryProtocol.IdsQuery(ids)); }
    static HttpResponse<String> request(String path,String suffix,String body,String token,String mode,String method,String contentType,boolean chunked) throws Exception {
        var builder=HttpRequest.newBuilder(origin.resolve(path+suffix)).timeout(Duration.ofSeconds(3)).header("Content-Type",contentType);
        if (token!=null) builder.header("Authorization","Bearer "+token);
        if (mode!=null) builder.header(InternalReadCredentialFilter.MODE_HEADER,mode);
        var publisher=chunked?HttpRequest.BodyPublishers.ofInputStream(()->new ByteArrayInputStream(body.getBytes(StandardCharsets.UTF_8))):HttpRequest.BodyPublishers.ofString(body);
        var response=http.send(builder.method(method,publisher).build(),HttpResponse.BodyHandlers.ofString());
        assertEquals("no-store",response.headers().firstValue("Cache-Control").orElseThrow());
        Files.writeString(evidence.resolve("response-"+sequence.incrementAndGet()+".json"),new JsonMapper().writeValueAsString(
                Map.of("path",path,"method",method(path).toLowerCase(Locale.ROOT),"status",response.statusCode(),"body",new JsonMapper().readTree(response.body()))));
        return response;
    }
    @SpringBootConfiguration
    @EnableAutoConfiguration(excludeName={
            "org.springframework.boot.mongodb.autoconfigure.MongoAutoConfiguration",
            "org.springframework.boot.data.mongodb.autoconfigure.DataMongoAutoConfiguration",
            "org.springframework.boot.data.mongodb.autoconfigure.DataMongoRepositoriesAutoConfiguration",
            "org.springframework.boot.security.autoconfigure.UserDetailsServiceAutoConfiguration"})
    @Import({GroupDirectoryServerConfiguration.class,ServiceSecurityConfiguration.class})
    static class Fixture {
        @Bean CommunityGroupsRepository repository() {
            var repository=mock(CommunityGroupsRepository.class,CALLS_REAL_METHODS);
            when(repository.findById(nullable(String.class))).thenAnswer(c->"missing".equals(c.getArgument(0))?Optional.empty():Optional.of(group(c.getArgument(0))));
            when(repository.findByIdIn(nullable(Collection.class))).thenAnswer(c->{ Collection<String> ids=c.getArgument(0);return ids==null?List.of():ids.stream().map(GroupDirectoryHttpTest::group).toList(); });
            when(repository.findAllById(nullable(Iterable.class))).thenAnswer(c->{var ids=new ArrayList<String>();((Iterable<String>)c.getArgument(0)).forEach(ids::add);return ids.stream().map(GroupDirectoryHttpTest::group).toList();});
            return repository;
        }
        @Bean MongoTemplate mongo() {
            var mongo=mock(MongoTemplate.class);
            when(mongo.find(any(Query.class),eq(Document.class),eq("communityGroups"))).thenAnswer(c->{
                Query query=c.getArgument(0);
                assertEquals(List.of("work","community"),((Document)query.getQueryObject().get("groupType")).get("$in"));
                assertEquals(1,query.getFieldsObject().getInteger("_id"));
                return List.of(new Document("_id","work").append("groupType","work"),new Document("_id","community-active").append("groupType","community"));
            });
            return mongo;
        }
        @Bean GroupDirectoryService groups(CommunityGroupsRepository repository,MongoTemplate mongo) {
            var service=new GroupDirectoryService(repository);ReflectionTestUtils.setField(service,"mongo",mongo);return service;
        }
    }
    static CommunityGroup group(String id) {
        if ("fail".equals(id)) throw new IllegalStateException("private db details");
        String type="work".equals(id)||BaseGroups.WORK_BASE_ID.equals(id)?"work":id!=null&&(id.startsWith("community-")||BaseGroups.COMMUNITY_BASE_ID.equals(id))?"community":null;
        String lifecycle="community-deleted".equals(id)?"deleted":"community-review".equals(id)?"under-review":"active";
        return new CommunityGroup(id,MongoSessionModeContext.currentMode().name(),"Group",null,"image","category","private",true,
                new GroupPolicy(true,true,List.of("name")),"created","updated",3L,null,4L,-5L,6L,3000000000L,lifecycle,"released",Arrays.asList("candidate",null),type);
    }
}

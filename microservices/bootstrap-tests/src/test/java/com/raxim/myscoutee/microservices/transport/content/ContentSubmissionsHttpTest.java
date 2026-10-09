package com.raxim.myscoutee.microservices.transport.content;

import com.raxim.myscoutee.microservices.transport.email.*;
import java.net.*;
import java.net.http.*;
import java.nio.file.*;
import java.security.*;
import java.time.*;
import java.util.*;
import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicInteger;
import com.raxim.myscoutee.common.config.mongo.*;
import com.raxim.myscoutee.domain.accounts.api.*;
import com.raxim.myscoutee.domain.content.document.UserFeedbackSubmission;
import com.raxim.myscoutee.domain.content.repository.UserFeedbackSubmissionsRepository;
import com.raxim.myscoutee.domain.content.service.UserFeedbackService;
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
import org.springframework.dao.DuplicateKeyException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import tools.jackson.databind.json.JsonMapper;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import static org.mockito.ArgumentMatchers.*;

class ContentSubmissionsHttpTest {
    static final String TOKEN="test-only-feedback-command-token-000000000000000000";
    static final Map<String,UserFeedbackSubmission> stored=new ConcurrentHashMap<>();
    static ConfigurableApplicationContext server;
    static RemoteUserFeedback remote;
    static RemoteUserReports reportsRemote;
    static RemoteUserActivityScheduling activityRemote;
    static final List<String> activitySignals=new CopyOnWriteArrayList<>();
    static final Map<String,com.raxim.myscoutee.domain.content.document.UserReportSubmission> reports=new ConcurrentHashMap<>();
    static HttpClient http;
    static URI origin;
    static SimpleMeterRegistry meters;
    static ActorDelegation.Issuer issuer;
    static String privateKey,publicKey;
    static Path evidence;
    static final AtomicInteger sequence=new AtomicInteger();
    static final JsonMapper mapper=new JsonMapper();
    @BeforeAll static void start() throws Exception {
        var generator=KeyPairGenerator.getInstance("RSA");generator.initialize(2048);var pair=generator.generateKeyPair();
        privateKey=Base64.getEncoder().encodeToString(pair.getPrivate().getEncoded());
        publicKey=Base64.getEncoder().encodeToString(pair.getPublic().getEncoded());
        issuer=new ActorDelegation.Issuer(privateKey,publicKey,Clock.systemUTC());
        evidence=Path.of(System.getProperty("wireEvidenceDirectory"),"user-feedback");
        for(var directory:List.of(evidence,evidence.resolveSibling("user-reports"),evidence.resolveSibling("user-activity"))) {
            Files.createDirectories(directory);
            try(var files=Files.list(directory)){for(var file:files.filter(p->p.getFileName().toString().startsWith("response-")).toList())Files.delete(file);}
        }
        server=new SpringApplicationBuilder(Fixture.class).properties("server.address=127.0.0.1","server.port=0","management.server.port=0",
                "myscoutee.remote.user-activity.command-token="+TOKEN,"myscoutee.remote.user-feedback.command-token="+TOKEN,"myscoutee.remote.user-reports.command-token="+TOKEN,"myscoutee.delegation.public-key="+publicKey,
                "spring.main.banner-mode=off","logging.level.root=WARN").run();
        origin=URI.create("http://127.0.0.1:"+server.getEnvironment().getProperty("local.server.port"));
        http=HttpClient.newBuilder().followRedirects(HttpClient.Redirect.NEVER).build();meters=new SimpleMeterRegistry();
        remote=new RemoteUserFeedback(origin,TOKEN,true,Duration.ofSeconds(1),Duration.ofSeconds(3),mapper,meters,issuer);
        reportsRemote=new RemoteUserReports(origin,TOKEN,true,Duration.ofSeconds(1),Duration.ofSeconds(3),mapper,meters,issuer);
        activityRemote=new RemoteUserActivityScheduling(origin,TOKEN,true,Duration.ofSeconds(1),Duration.ofSeconds(3),mapper,meters,issuer);
    }
    @BeforeEach void actor(){authenticate("actor");}
    @AfterEach void clear(){SecurityContextHolder.clearContext();MongoSessionModeContext.clear();stored.clear();reports.clear();activitySignals.clear();}
    @AfterAll static void stop(){if(remote!=null)remote.close();if(reportsRemote!=null)reportsRemote.close();if(activityRemote!=null)activityRemote.close();if(http!=null)http.shutdownNow();if(server!=null)server.close();if(meters!=null)meters.close();}
    static void authenticate(String id){
        var profile=mock(WorkspaceProfile.class);when(profile.getUserId()).thenReturn(id);when(profile.getAccountUserId()).thenReturn("account");when(profile.getWorkspaceGroupId()).thenReturn("group");
        var actor=mock(AccountIdentity.class);when(actor.getUserId()).thenReturn(id);when(actor.getUser()).thenReturn(profile);
        SecurityContextHolder.getContext().setAuthentication(new UsernamePasswordAuthenticationToken(actor,null,List.of()));
    }
    static UserFeedbackProtocol.Command command(String details){return new UserFeedbackProtocol.Command(new org.bson.types.ObjectId().toHexString(),"actor","category","subject",details);}
    static byte[] bytes(UserFeedbackProtocol.Command c){return mapper.writeValueAsBytes(c);}
    static String sign(byte[] body){return issuer.issue("actor",UserFeedbackProtocol.AUDIENCE,"POST",UserFeedbackProtocol.PATH,body);}
    @Test void canonicalSubmissionAndExactReplayPreserveOneDocumentPerMode() throws Exception {
        var command=command("details é");var body=bytes(command);
        for(var mode:List.of(MongoSessionMode.REAL,MongoSessionMode.DEMO)) {
            MongoSessionModeContext.set(mode);
            assertEquals(command.requestId(),remote.submitOnce(command.requestId(),command.userId(),command.category(),command.subject(),command.details()));
            var original=stored.get(mode.name()+command.requestId());
            assertEquals("actor",original.getUserId());assertEquals("details é",original.getDetails());assertEquals("actor",original.getCreatedUser());
            assertEquals(200,request(body,TOKEN,mode.name(),sign(body),"POST","application/json").statusCode());
            assertSame(original,stored.get(mode.name()+command.requestId()));
            assertEquals(mode,MongoSessionModeContext.currentMode());
        }
        assertEquals(2,stored.size());
    }
    @Test void changedSubmissionCannotReuseAnExistingId() throws Exception {
        var command=command("first");remote.submitOnce(command.requestId(),"actor","category","subject","first");
        var changed=bytes(new UserFeedbackProtocol.Command(command.requestId(),"actor","category","subject","changed"));
        assertEquals(409,request(changed,TOKEN,"REAL",sign(changed),"POST","application/json").statusCode());
        assertEquals("first",stored.get("REAL"+command.requestId()).getDetails());
    }
    @Test void committedButLostReplyIsUnknownAndExplicitSameIdRetryDoesNotDuplicate() throws Exception {
        var command=command("commit-then-fail");
        var failure=assertThrows(RemoteUserFeedback.OutcomeUnknownException.class,()->remote.submitOnce(command.requestId(),"actor","category","subject",command.details()));
        assertEquals(command.requestId(),failure.requestId());assertEquals(1,stored.size());
        assertEquals(command.requestId(),remote.submitOnce(command.requestId(),"actor","category","subject",command.details()));
        assertEquals(1,stored.size());
        var other=bytes(command("fail-before-commit"));
        var response=request(other,TOKEN,"REAL",sign(other),"POST","application/json");assertEquals(503,response.statusCode());
        assertFalse(response.body().contains("private db"));
    }
    @Test void onlyAnAuthenticatedSelectedProfileMayIssueACommand() {
        assertThrows(AccessDeniedException.class,()->remote.submit("other","category","subject","details"));
        SecurityContextHolder.clearContext();assertThrows(AccessDeniedException.class,()->remote.submit("actor","category","subject","details"));
        assertTrue(stored.isEmpty());
    }
    @Test void serviceCredentialAloneAndChangedBodyModeAudiencePathOrExpiredActorAreRejected() throws Exception {
        var body=bytes(command("details"));var token=sign(body);
        for(var credential:new String[]{null,"wrong-command-credential-000000000000000000000000"})
            assertEquals(401,request(body,credential,"REAL",token,"POST","application/json").statusCode());
        for(var mode:new String[]{null,"unknown"})assertEquals(400,request(body,TOKEN,mode,token,"POST","application/json").statusCode());
        for(var delegation:new String[]{null,"invalid",token.substring(0,token.length()-8)+"aaaaaaaa"})
            assertEquals(403,request(body,TOKEN,"REAL",delegation,"POST","application/json").statusCode());
        assertEquals(403,request(bytes(command("changed")),TOKEN,"REAL",token,"POST","application/json").statusCode());
        assertEquals(403,request(body,TOKEN,"DEMO",token,"POST","application/json").statusCode());
        assertEquals(403,request(body,TOKEN,"REAL",token,"GET","application/json").statusCode());
        for(var bad:new String[]{issuer.issue("actor","other","POST",UserFeedbackProtocol.PATH,body),issuer.issue("actor",UserFeedbackProtocol.AUDIENCE,"POST","/other",body),
                new ActorDelegation.Issuer(privateKey,publicKey,Clock.offset(Clock.systemUTC(),Duration.ofSeconds(-60))).issue("actor",UserFeedbackProtocol.AUDIENCE,"POST",UserFeedbackProtocol.PATH,body)})
            assertEquals(403,request(body,TOKEN,"REAL",bad,"POST","application/json").statusCode());
        var mismatch=bytes(new UserFeedbackProtocol.Command(command("x").requestId(),"other","category","subject","details"));
        assertEquals(403,request(mismatch,TOKEN,"REAL",sign(mismatch),"POST","application/json").statusCode());
        assertTrue(stored.isEmpty());
    }
    @Test void boundedStrictJsonAndMediaTypeAreEnforcedBeforeWriting() throws Exception {
        for(var body:new byte[][]{"{".getBytes(),"{\"requestId\":\"invalid\"}".getBytes(),"{\"unexpected\":true}".getBytes()})
            assertEquals(400,request(body,TOKEN,"REAL",sign(body),"POST","application/json").statusCode());
        var body=bytes(command("details"));
        assertEquals(415,request(body,TOKEN,"REAL",sign(body),"POST","text/plain").statusCode());
        var huge=new byte[UserFeedbackProtocol.MAX_REQUEST_BYTES+1];
        assertEquals(413,request(huge,TOKEN,"REAL",sign(huge),"POST","application/json").statusCode());
        assertTrue(stored.isEmpty());
    }

    @Test void validSignaturesStillRequireTheExpectedIssuerTimeWindowAndTrustedKey() throws Exception {
        var body=bytes(command("details"));
        var original=com.nimbusds.jwt.SignedJWT.parse(sign(body));
        var privateRsa=(java.security.interfaces.RSAPrivateKey)KeyFactory.getInstance("RSA").generatePrivate(
                new java.security.spec.PKCS8EncodedKeySpec(Base64.getDecoder().decode(privateKey)));
        var wrongIssuer=new com.nimbusds.jwt.SignedJWT(original.getHeader(),
                new com.nimbusds.jwt.JWTClaimsSet.Builder(original.getJWTClaimsSet()).issuer("untrusted-issuer").build());
        wrongIssuer.sign(new com.nimbusds.jose.crypto.RSASSASigner(privateRsa));
        var future=new ActorDelegation.Issuer(privateKey,publicKey,Clock.offset(Clock.systemUTC(),Duration.ofSeconds(60)))
                .issue("actor",UserFeedbackProtocol.AUDIENCE,"POST",UserFeedbackProtocol.PATH,body);
        var generator=KeyPairGenerator.getInstance("RSA");generator.initialize(2048);var other=generator.generateKeyPair();
        var wrongKey=new ActorDelegation.Issuer(Base64.getEncoder().encodeToString(other.getPrivate().getEncoded()),
                Base64.getEncoder().encodeToString(other.getPublic().getEncoded()),Clock.systemUTC())
                .issue("actor",UserFeedbackProtocol.AUDIENCE,"POST",UserFeedbackProtocol.PATH,body);
        for(var token:List.of(wrongIssuer.serialize(),future,wrongKey))
            assertEquals(403,request(body,TOKEN,"REAL",token,"POST","application/json").statusCode());
        assertTrue(stored.isEmpty());
    }
    static com.raxim.myscoutee.domain.content.api.UserReports.ReportDraft report(String key) {
        return new com.raxim.myscoutee.domain.content.api.UserReports.ReportDraft(key,"actor","handle","reason","details é","target","member","event","Event",null,"chat","source","text","chat","message",null,null);
    }
    static String reportSignature(String path,byte[] body) {
        return issuer.issue("actor",path.equals(UserReportsProtocol.SUBMIT)?UserReportsProtocol.SUBMIT_AUDIENCE:UserReportsProtocol.EXISTS_AUDIENCE,"POST",path,body);
    }
    @Test void reportSubmissionExistenceAndNativeDuplicateReceiptPreserveModesAndFields() throws Exception {
        for(var mode:List.of(MongoSessionMode.REAL,MongoSessionMode.DEMO)) {
            MongoSessionModeContext.set(mode);
            assertFalse(reportsRemote.exists("report-key"));
            var receipt=reportsRemote.submit(report("report-key"));assertNotNull(receipt.id());assertFalse(receipt.duplicate());
            assertTrue(reportsRemote.exists("report-key"));assertTrue(reportsRemote.submit(report("report-key")).duplicate());
            var saved=reports.get(mode.name()+"report-key");assertEquals("actor",saved.getUserId());assertEquals("details é",saved.getDetails());
            assertEquals("member",saved.getMemberEntryId());assertEquals("message",saved.getMessageId());assertNull(saved.getAssetId());
            for(var path:UserReportsProtocol.paths()) {
                var body=mapper.writeValueAsBytes(path.equals(UserReportsProtocol.SUBMIT)?report("report-key"):new UserReportsProtocol.ExistsQuery("report-key"));
                assertEquals(200,request(path,body,TOKEN,mode.name(),reportSignature(path,body),"POST","application/json").statusCode());
            }
        }
        assertEquals(2,reports.size());
    }
    @Test void bothReportOperationsEnforceDelegationAndInputBounds() throws Exception {
        for(var path:UserReportsProtocol.paths()) {
            var body=mapper.writeValueAsBytes(path.equals(UserReportsProtocol.SUBMIT)?report("report-key"):new UserReportsProtocol.ExistsQuery("report-key"));
            assertEquals(401,request(path,body,null,"REAL",reportSignature(path,body),"POST","application/json").statusCode());
            assertEquals(400,request(path,body,TOKEN,"wrong",reportSignature(path,body),"POST","application/json").statusCode());
            assertEquals(403,request(path,body,TOKEN,"REAL",null,"POST","application/json").statusCode());
            assertEquals(403,request(path,body,TOKEN,"REAL",reportSignature(path,body),"GET","application/json").statusCode());
            assertEquals(415,request(path,body,TOKEN,"REAL",reportSignature(path,body),"POST","text/plain").statusCode());
            var huge=new byte[UserReportsProtocol.MAX_REQUEST_BYTES+1];
            assertEquals(413,request(path,huge,TOKEN,"REAL",reportSignature(path,huge),"POST","application/json").statusCode());
            var invalid="{}".getBytes();assertEquals(400,request(path,invalid,TOKEN,"REAL",reportSignature(path,invalid),"POST","application/json").statusCode());
        }
        assertTrue(reports.isEmpty());
    }
    @Test void lostReportReplyUsesNativeSyncKeyForReconciliation() throws Exception {
        var draft=report("commit-then-fail");
        var failure=assertThrows(com.raxim.myscoutee.microservices.transport.common.RemoteCommandTransport.OutcomeUnknownException.class,()->reportsRemote.submit(draft));
        assertEquals(draft.syncKey(),failure.requestId());assertTrue(reportsRemote.exists(draft.syncKey()));assertEquals(1,reports.size());
        assertTrue(reportsRemote.submit(draft).duplicate());assertEquals(1,reports.size());
        for(var path:UserReportsProtocol.paths()) {
            var body=mapper.writeValueAsBytes(path.equals(UserReportsProtocol.SUBMIT)?report("fail-before-commit"):new UserReportsProtocol.ExistsQuery("fail-before-commit"));
            var response=request(path,body,TOKEN,"REAL",reportSignature(path,body),"POST","application/json");
            assertEquals(503,response.statusCode());assertFalse(response.body().contains("private db"));
        }
    }
    @Test void activitySignalKeepsSelectedActorModeAndOwnerFailures() throws Exception {
        activityRemote.touchUserActivity(null);activityRemote.touchUserActivity(" ");assertTrue(activitySignals.isEmpty());
        for(var mode:List.of(MongoSessionMode.REAL,MongoSessionMode.DEMO)) {
            MongoSessionModeContext.set(mode);activityRemote.touchUserActivity(" actor ");
            assertTrue(activitySignals.contains(mode.name()+":actor"));
            var body=mapper.writeValueAsBytes(new UserActivitySchedulingProtocol.Command("actor"));
            var delegation=issuer.issue("actor",UserActivitySchedulingProtocol.AUDIENCE,"POST",UserActivitySchedulingProtocol.PATH,body);
            assertEquals(200,request(UserActivitySchedulingProtocol.PATH,body,TOKEN,mode.name(),delegation,"POST","application/json").statusCode());
        }
        MongoSessionModeContext.clear();authenticate("fail");
        var body=mapper.writeValueAsBytes(new UserActivitySchedulingProtocol.Command("fail"));
        var delegation=issuer.issue("fail",UserActivitySchedulingProtocol.AUDIENCE,"POST",UserActivitySchedulingProtocol.PATH,body);
        assertEquals(503,request(UserActivitySchedulingProtocol.PATH,body,TOKEN,"REAL",delegation,"POST","application/json").statusCode());
        assertThrows(com.raxim.myscoutee.microservices.transport.common.RemoteCommandTransport.OutcomeUnknownException.class,()->activityRemote.touchUserActivity("fail"));
    }
    @Test void activitySignalRejectsUnsignedAlteredAndOversizedCommands() throws Exception {
        var path=UserActivitySchedulingProtocol.PATH;var body=mapper.writeValueAsBytes(new UserActivitySchedulingProtocol.Command("actor"));
        var delegation=issuer.issue("actor",UserActivitySchedulingProtocol.AUDIENCE,"POST",path,body);
        assertEquals(401,request(path,body,null,"REAL",delegation,"POST","application/json").statusCode());
        assertEquals(403,request(path,body,TOKEN,"REAL",null,"POST","application/json").statusCode());
        assertEquals(400,request(path,body,TOKEN,"wrong",delegation,"POST","application/json").statusCode());
        assertEquals(403,request(path,body,TOKEN,"REAL",delegation,"GET","application/json").statusCode());
        assertEquals(415,request(path,body,TOKEN,"REAL",delegation,"POST","text/plain").statusCode());
        var huge=new byte[UserActivitySchedulingProtocol.MAX_REQUEST_BYTES+1];
        assertEquals(413,request(path,huge,TOKEN,"REAL",issuer.issue("actor",UserActivitySchedulingProtocol.AUDIENCE,"POST",path,huge),"POST","application/json").statusCode());
        var empty="{}".getBytes();
        assertEquals(400,request(path,empty,TOKEN,"REAL",issuer.issue("actor",UserActivitySchedulingProtocol.AUDIENCE,"POST",path,empty),"POST","application/json").statusCode());
        assertTrue(activitySignals.isEmpty());
    }
    static HttpResponse<String> request(byte[] body,String credential,String mode,String delegation,String method,String contentType) throws Exception {
        return request(UserFeedbackProtocol.PATH,body,credential,mode,delegation,method,contentType);
    }
    static HttpResponse<String> request(String path,byte[] body,String credential,String mode,String delegation,String method,String contentType) throws Exception {
        var builder=HttpRequest.newBuilder(origin.resolve(path)).timeout(Duration.ofSeconds(5)).header("Content-Type",contentType);
        if(credential!=null)builder.header("Authorization","Bearer "+credential);
        if(mode!=null)builder.header("X-MyScoutee-Session-Mode",mode);
        if(delegation!=null)builder.header(ActorDelegation.HEADER,delegation);
        var result=http.send(builder.method(method,HttpRequest.BodyPublishers.ofByteArray(body)).build(),HttpResponse.BodyHandlers.ofString());
        assertEquals("no-store",result.headers().firstValue("Cache-Control").orElseThrow());
        Files.writeString((path.equals(UserFeedbackProtocol.PATH)?evidence:evidence.resolveSibling(path.equals(UserActivitySchedulingProtocol.PATH)?"user-activity":"user-reports")).resolve("response-"+sequence.incrementAndGet()+".json"),mapper.writeValueAsString(Map.of("path",path,"method","post","status",result.statusCode(),"body",mapper.readTree(result.body()))));
        return result;
    }
    @SpringBootConfiguration
    @EnableAutoConfiguration(excludeName={"org.springframework.boot.mongodb.autoconfigure.MongoAutoConfiguration","org.springframework.boot.data.mongodb.autoconfigure.DataMongoAutoConfiguration","org.springframework.boot.data.mongodb.autoconfigure.DataMongoRepositoriesAutoConfiguration","org.springframework.boot.security.autoconfigure.UserDetailsServiceAutoConfiguration"})
    @Import({UserFeedbackServerConfiguration.class,UserReportsServerConfiguration.class,UserActivitySchedulingServerConfiguration.class,ServiceSecurityConfiguration.class})
    static class Fixture {
        @Bean com.raxim.myscoutee.domain.email.api.UserActivityScheduling activityOwner(){
            return userId->{if("fail".equals(userId))throw new IllegalStateException("private db detail");activitySignals.add(MongoSessionModeContext.currentMode().name()+":"+userId);};
        }
        @Bean UserFeedbackSubmissionsRepository repository(){
            var repository=mock(UserFeedbackSubmissionsRepository.class);
            when(repository.insert(any(UserFeedbackSubmission.class))).thenAnswer(c->{
                UserFeedbackSubmission value=c.getArgument(0);var key=MongoSessionModeContext.currentMode().name()+value.getId();
                if("fail-before-commit".equals(value.getDetails()))throw new IllegalStateException("private db details");
                if(stored.putIfAbsent(key,value)!=null)throw new DuplicateKeyException("duplicate");
                if("commit-then-fail".equals(value.getDetails()))throw new IllegalStateException("private db details");
                return value;
            });
            when(repository.findById(anyString())).thenAnswer(c->Optional.ofNullable(stored.get(MongoSessionModeContext.currentMode().name()+c.getArgument(0))));
            return repository;
        }
        @Bean com.raxim.myscoutee.domain.content.repository.UserReportSubmissionsRepository reportsRepository(){
            var repository=mock(com.raxim.myscoutee.domain.content.repository.UserReportSubmissionsRepository.class);
            when(repository.save(any(com.raxim.myscoutee.domain.content.document.UserReportSubmission.class))).thenAnswer(c->{
                com.raxim.myscoutee.domain.content.document.UserReportSubmission value=c.getArgument(0);
                if("fail-before-commit".equals(value.getSyncKey()))throw new IllegalStateException("private db detail");
                if(reports.putIfAbsent(MongoSessionModeContext.currentMode().name()+value.getSyncKey(),value)!=null)throw new DuplicateKeyException("duplicate");
                if("commit-then-fail".equals(value.getSyncKey()))throw new IllegalStateException("private db detail");
                return value;
            });
            when(repository.findBySyncKey(anyString())).thenAnswer(c->{
                if("fail-before-commit".equals(c.getArgument(0)))throw new IllegalStateException("private db detail");
                return Optional.ofNullable(reports.get(MongoSessionModeContext.currentMode().name()+c.getArgument(0)));
            });
            return repository;
        }
        @Bean com.raxim.myscoutee.domain.content.service.CommunityReportService reportOwner(com.raxim.myscoutee.domain.content.repository.UserReportSubmissionsRepository repository){
            return new com.raxim.myscoutee.domain.content.service.CommunityReportService(repository,mock(com.raxim.myscoutee.domain.administration.api.OperationalTelemetry.class));
        }
        @Bean UserFeedbackService owner(UserFeedbackSubmissionsRepository repository){return new UserFeedbackService(repository);}
    }
}

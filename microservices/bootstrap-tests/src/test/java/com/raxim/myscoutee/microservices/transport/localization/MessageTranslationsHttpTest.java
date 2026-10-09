package com.raxim.myscoutee.microservices.transport.localization;

import java.net.*;
import java.net.http.*;
import java.nio.file.*;
import java.time.Duration;
import java.util.*;
import java.util.concurrent.atomic.AtomicInteger;
import com.raxim.myscoutee.common.config.JsonConfig;
import com.raxim.myscoutee.common.config.mongo.*;
import com.raxim.myscoutee.domain.localization.api.TranslationBundles;
import com.raxim.myscoutee.domain.localization.dto.I18nBundleResponseDto;
import com.raxim.myscoutee.domain.localization.document.I18nMessage;
import com.raxim.myscoutee.domain.localization.repository.I18nMessageRepository;
import com.raxim.myscoutee.domain.localization.service.*;
import com.raxim.myscoutee.microservices.bootstrap.ServiceSecurityConfiguration;
import com.raxim.myscoutee.microservices.transport.common.RemoteReadTransport.RemoteReadException;
import io.micrometer.core.instrument.simple.SimpleMeterRegistry;
import org.junit.jupiter.api.*;
import org.springframework.boot.*;
import org.springframework.boot.autoconfigure.*;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.context.*;
import org.springframework.context.annotation.*;
import org.springframework.context.i18n.LocaleContextHolder;
import tools.jackson.databind.ObjectMapper;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import static org.mockito.ArgumentMatchers.*;

class MessageTranslationsHttpTest {
    static final String TOKEN="test-only-message-translations-token-00000000000000000000";
    static final String BUNDLE_TOKEN="test-only-separate-bundle-token-000000000000000000000000";
    static final ObjectMapper mapper=new JsonConfig().objectMapper();
    static final AtomicInteger sequence=new AtomicInteger();
    static ConfigurableApplicationContext server;
    static RemoteMessageTranslations remote;
    static SimpleMeterRegistry meters;
    static HttpClient http;
    static URI origin;
    static Path evidence;
    @BeforeAll static void start() throws Exception {
        evidence=Path.of(System.getProperty("wireEvidenceDirectory"),"message-translations");Files.createDirectories(evidence);
        try(var files=Files.list(evidence)){for(var file:files.filter(p->p.getFileName().toString().startsWith("response-")).toList())Files.delete(file);}
        server=new SpringApplicationBuilder(Fixture.class).properties("server.address=127.0.0.1","server.port=0","management.server.port=0",
                "myscoutee.remote.message-translations.read-token="+TOKEN,"myscoutee.remote.localization.read-token="+BUNDLE_TOKEN,
                "spring.main.banner-mode=off","logging.level.root=WARN").run();
        origin=URI.create("http://127.0.0.1:"+server.getEnvironment().getProperty("local.server.port"));
        http=HttpClient.newBuilder().followRedirects(HttpClient.Redirect.NEVER).build();meters=new SimpleMeterRegistry();
        remote=new RemoteMessageTranslations(origin,TOKEN,true,Duration.ofSeconds(1),Duration.ofSeconds(3),mapper,meters);
    }
    @BeforeEach void reset(){server.getBean(DBMessageSource.class).refreshCache();clearInvocations(server.getBean(I18nMessageRepository.class));}
    @AfterEach void clear(){MongoSessionModeContext.clear();LocaleContextHolder.resetLocaleContext();}
    @AfterAll static void stop(){if(remote!=null)remote.close();if(http!=null)http.shutdownNow();if(server!=null)server.close();if(meters!=null)meters.close();}
    @Test void canonicalLocaleEnglishFallbackModeAndLiteralPlaceholdersSurviveHttp() throws Exception {
        for(var mode:List.of(MongoSessionMode.REAL,MongoSessionMode.DEMO)) {
            MongoSessionModeContext.set(mode);
            for(var locale:List.of(Locale.ENGLISH,Locale.forLanguageTag("hu-HU"),Locale.FRENCH)) {
                LocaleContextHolder.setLocale(locale);
                String expected=mode.name()+":"+(locale.getLanguage().equals("hu")?"hu":"en");
                assertEquals(expected,remote.t("hello"));
                assertEquals(server.getBean(TranslationService.class).t("hello"),remote.t("hello"));
                assertEquals(mode,MongoSessionModeContext.currentMode());assertEquals(locale,LocaleContextHolder.getLocale());
                assertEquals(200,request("hello",TOKEN,mode.name(),locale.toLanguageTag(),"GET").statusCode());
                assertEquals("Keep {name} literally",remote.t("literal"));
            }
        }
        // Real canonical message source caches by mode and language.
        verify(server.getBean(I18nMessageRepository.class),times(2)).findByLang("hu");
        verify(server.getBean(I18nMessageRepository.class),times(2)).findByLang("en");
    }
    @Test void missingTranslationKeepsNativeExceptionAndOwnerFailureIsNotAnEnglishFallback() throws Exception {
        LocaleContextHolder.setLocale(Locale.FRENCH);
        assertThrows(NoSuchMessageException.class,()->remote.t("missing"));
        assertEquals(404,request("missing",TOKEN,"REAL","fr","GET").statusCode());
        LocaleContextHolder.setLocale(Locale.forLanguageTag("zz"));
        assertEquals(503,assertThrows(RemoteReadException.class,()->remote.t("hello")).status());
        var response=request("hello",TOKEN,"REAL","zz","GET");assertEquals(503,response.statusCode());assertFalse(response.body().contains("private"));
    }
    @Test void messageAndBundleCapabilitiesRemainSeparateAndInputsAreBounded() throws Exception {
        assertEquals(401,request("hello",null,"REAL","en","GET").statusCode());
        assertEquals(401,request("hello",BUNDLE_TOKEN,"REAL","en","GET").statusCode());
        assertEquals(400,request("hello",TOKEN,"other","en","GET").statusCode());
        assertEquals(403,request("hello",TOKEN,"REAL","en","POST").statusCode());
        assertEquals(400,request(null,TOKEN,"REAL","en","GET").statusCode());
        assertEquals(400,request("x".repeat(513),TOKEN,"REAL","en","GET").statusCode());
        verifyNoInteractions(server.getBean(I18nMessageRepository.class));
        var bundle=http.send(HttpRequest.newBuilder(origin.resolve(LocalizationProtocol.PATH)).header("Authorization","Bearer "+TOKEN)
                .header("X-MyScoutee-Session-Mode","REAL").GET().build(),HttpResponse.BodyHandlers.ofString());
        assertEquals(401,bundle.statusCode());
        bundle=http.send(HttpRequest.newBuilder(origin.resolve(LocalizationProtocol.PATH)).header("Authorization","Bearer "+BUNDLE_TOKEN)
                .header("X-MyScoutee-Session-Mode","REAL").GET().build(),HttpResponse.BodyHandlers.ofString());
        assertEquals(200,bundle.statusCode());
    }
    @Test void gateway404DoesNotBecomeANativeMissingMessage() throws Exception {
        var proxy=com.sun.net.httpserver.HttpServer.create(new InetSocketAddress("127.0.0.1",0),0);
        proxy.createContext(MessageTranslationsProtocol.PATH,exchange->{byte[] body="{\"message\":\"route unavailable\"}".getBytes();
            exchange.getResponseHeaders().set("Content-Type","application/json");exchange.sendResponseHeaders(404,body.length);
            exchange.getResponseBody().write(body);exchange.close();});proxy.start();
        try(var unavailable=new RemoteMessageTranslations(URI.create("http://127.0.0.1:"+proxy.getAddress().getPort()),TOKEN,true,
                Duration.ofSeconds(1),Duration.ofSeconds(1),mapper,meters)) {
            assertEquals(404,assertThrows(RemoteReadException.class,()->unavailable.t("hello")).status());
        } finally {proxy.stop(0);}
    }
    static HttpResponse<String> request(String key,String token,String mode,String locale,String method) throws Exception {
        String path=MessageTranslationsProtocol.PATH+(key==null?"":"?key="+URLEncoder.encode(key,java.nio.charset.StandardCharsets.UTF_8));
        var builder=HttpRequest.newBuilder(origin.resolve(path)).timeout(Duration.ofSeconds(5)).header("Accept-Language",locale);
        if(token!=null)builder.header("Authorization","Bearer "+token);
        if(mode!=null)builder.header("X-MyScoutee-Session-Mode",mode);
        var response=http.send(builder.method(method,HttpRequest.BodyPublishers.noBody()).build(),HttpResponse.BodyHandlers.ofString());
        assertEquals("no-store",response.headers().firstValue("Cache-Control").orElseThrow());
        Files.writeString(evidence.resolve("response-"+sequence.incrementAndGet()+".json"),mapper.writeValueAsString(Map.of("path",MessageTranslationsProtocol.PATH,"method","get","status",response.statusCode(),"body",mapper.readTree(response.body()))));return response;
    }
    static I18nMessage message(String key,String lang,String value){var m=new I18nMessage();m.setKey(key);m.setLang(lang);m.setValue(value);return m;}
    @SpringBootConfiguration
    @EnableAutoConfiguration(excludeName={"org.springframework.boot.mongodb.autoconfigure.MongoAutoConfiguration","org.springframework.boot.data.mongodb.autoconfigure.DataMongoAutoConfiguration","org.springframework.boot.data.mongodb.autoconfigure.DataMongoRepositoriesAutoConfiguration","org.springframework.boot.security.autoconfigure.UserDetailsServiceAutoConfiguration"})
    @Import({JsonConfig.class,MessageTranslationsServerConfiguration.class,LocalizationServerConfiguration.class,TranslationService.class,ServiceSecurityConfiguration.class})
    static class Fixture {
        @Bean(name="messageSource") DBMessageSource messages(I18nMessageRepository repository){return new DBMessageSource(repository);}
        @Bean I18nMessageRepository repository(){
            var repository=mock(I18nMessageRepository.class);when(repository.findByLang(anyString())).thenAnswer(call->{
                String lang=call.getArgument(0);if(lang.equals("zz"))throw new IllegalStateException("private database failure");
                if(!Set.of("hu","en").contains(lang))return List.of();
                return List.of(message("hello",lang,MongoSessionModeContext.currentMode().name()+":"+lang),message("literal",lang,"Keep {name} literally"));
            });return repository;
        }
        @Bean TranslationBundles bundles(){return (lang,accept,version)->new I18nBundleResponseDto("en","fixture",Map.of());}
    }
}

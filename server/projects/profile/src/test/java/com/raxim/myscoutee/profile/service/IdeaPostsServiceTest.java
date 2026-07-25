package com.raxim.myscoutee.profile.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import com.raxim.myscoutee.common.config.mongo.MongoSessionMode;
import com.raxim.myscoutee.common.config.mongo.MongoSessionModeContext;
import com.raxim.myscoutee.common.config.properties.ConfigProperties;
import com.raxim.myscoutee.profile.data.document.IdeaPost;
import com.raxim.myscoutee.profile.data.dto.idea.IdeaPostDtos.IdeaPostAdminActionRequestDto;
import com.raxim.myscoutee.profile.data.dto.idea.IdeaPostDtos.IdeaPostAdminPageDto;
import com.raxim.myscoutee.profile.data.dto.idea.IdeaPostDtos.IdeaPostPublicPageDto;
import com.raxim.myscoutee.profile.repository.IdeaPostsRepository;
import com.raxim.myscoutee.profile.repository.LandingArticlesRepository;
import com.raxim.myscoutee.profile.repository.LandingArticlesRepository.LandingArticleCursor;
import com.raxim.myscoutee.profile.repository.LandingArticlesRepository.LandingArticleSlice;
import com.raxim.myscoutee.profile.service.mapper.IdeaPostMapper;

@ExtendWith(MockitoExtension.class)
class IdeaPostsServiceTest {
    @Mock
    private ConfigProperties configProperties;
    @Mock
    private IdeaPostsRepository ideaPostsRepository;
    @Mock
    private MongoTemplate mongoTemplate;
    @Mock
    private AdminTelemetryService adminTelemetryService;
    @Mock
    private AppSettingsService appSettingsService;
    @Mock
    private LandingArticlesRepository landingArticlesRepository;

    private IdeaPostsService service;

    @BeforeEach
    void setUp() {
        MongoSessionModeContext.set(MongoSessionMode.DEMO);
        service = new IdeaPostsService(
                configProperties,
                ideaPostsRepository,
                mongoTemplate,
                adminTelemetryService,
                appSettingsService,
                landingArticlesRepository,
                new IdeaPostMapper());
    }

    @AfterEach
    void tearDown() {
        MongoSessionModeContext.clear();
    }

    @Test
    void publicPostsPageUsesAcceptLanguageThenFallsBackToEnglishAndBoundsPaging() {
        IdeaPost english = post("article-en", "en", "2026-07-20T10:00:00Z");
        when(landingArticlesRepository.findPage("hu", 0, 50, null))
                .thenReturn(new LandingArticleSlice(List.of(), 0L, false));
        when(landingArticlesRepository.findPage("en", 0, 50, null))
                .thenReturn(new LandingArticleSlice(List.of(english), 1L, false));

        IdeaPostPublicPageDto result = service.publicPostsPage(
                null,
                "de-DE;q=0.9, hu-HU;q=0.8, en;q=0.7",
                -5,
                500,
                null);

        assertThat(result.records()).extracting(record -> record.id()).containsExactly("article-en");
        assertThat(result.total()).isEqualTo(1);
        assertThat(result.nextCursor()).isNull();
        verify(landingArticlesRepository).findPage("hu", 0, 50, null);
        verify(landingArticlesRepository).findPage("en", 0, 50, null);
    }

    @Test
    void publicPostsPageReturnsAndConsumesStableOpaqueCursor() {
        IdeaPost first = post("article-c", "en", "2026-07-20T10:00:00Z");
        IdeaPost second = post("article-b", "en", "2026-07-20T10:00:00Z");
        when(landingArticlesRepository.findPage("en", 0, 2, null))
                .thenReturn(new LandingArticleSlice(List.of(first, second), 3L, true));

        IdeaPostPublicPageDto firstPage = service.publicPostsPage("en", "hu", 0, 2, null);

        assertThat(firstPage.records()).extracting(record -> record.id())
                .containsExactly("article-c", "article-b");
        assertThat(firstPage.total()).isEqualTo(3);
        assertThat(firstPage.nextCursor()).isNotBlank();

        LandingArticleCursor expectedCursor = new LandingArticleCursor(
                "en",
                "2026-07-20T10:00:00Z",
                "article-b");
        when(landingArticlesRepository.findPage("en", 0, 2, expectedCursor))
                .thenReturn(new LandingArticleSlice(List.of(), 3L, false));

        IdeaPostPublicPageDto lastPage = service.publicPostsPage(
                "en",
                "hu",
                0,
                2,
                firstPage.nextCursor());

        assertThat(lastPage.records()).isEmpty();
        assertThat(lastPage.nextCursor()).isNull();
        verify(landingArticlesRepository).findPage("en", 0, 2, expectedCursor);
    }

    @Test
    void publicFeaturedPostsKeepsRequestedLanguageWhenOnlyRegularPostsExist() {
        when(landingArticlesRepository.findFeaturedPreview("hu", 8))
                .thenReturn(new LandingArticleSlice(List.of(), 3L, false));

        IdeaPostPublicPageDto result = service.publicFeaturedPosts("hu-HU", "en");

        assertThat(result.records()).isEmpty();
        assertThat(result.total()).isEqualTo(3);
        assertThat(result.nextCursor()).isNull();
        verify(landingArticlesRepository).findFeaturedPreview("hu", 8);
    }

    @Test
    void publicPostsPageCursorLocksAnEnglishFallbackAcrossLaterPages() {
        IdeaPost english = post("article-en", "en", "2026-07-20T10:00:00Z");
        when(landingArticlesRepository.findPage("hu", 0, 1, null))
                .thenReturn(new LandingArticleSlice(List.of(), 0L, false));
        when(landingArticlesRepository.findPage("en", 0, 1, null))
                .thenReturn(new LandingArticleSlice(List.of(english), 2L, true));

        IdeaPostPublicPageDto firstPage = service.publicPostsPage("hu", "en", 0, 1, null);
        LandingArticleCursor englishCursor = new LandingArticleCursor(
                "en",
                "2026-07-20T10:00:00Z",
                "article-en");
        when(landingArticlesRepository.findPage("en", 0, 1, englishCursor))
                .thenReturn(new LandingArticleSlice(List.of(), 2L, false));

        IdeaPostPublicPageDto secondPage = service.publicPostsPage(
                "hu",
                "en",
                0,
                1,
                firstPage.nextCursor());

        assertThat(secondPage.records()).isEmpty();
        verify(landingArticlesRepository).findPage("en", 0, 1, englishCursor);
    }

    @Test
    void publicPostsPageRejectsMalformedCursorBeforeQueryingRepository() {
        assertThatThrownBy(() -> service.publicPostsPage("en", "en", 0, 10, "not-a-cursor"))
                .isInstanceOfSatisfying(ResponseStatusException.class, exception ->
                        assertThat(exception.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST));

        verifyNoInteractions(landingArticlesRepository);
    }

    @Test
    void adminPostsPageUsesAStableSortKeyCursorWithoutOffsetPaging() {
        IdeaPost first = post("article-c", "en", "2026-07-20T10:00:00Z");
        IdeaPost second = post("article-b", "en", "2026-07-20T10:00:00Z");
        IdeaPost lookahead = post("article-a", "en", "2026-07-19T10:00:00Z");
        when(mongoTemplate.count(any(Query.class), eq(IdeaPost.class))).thenReturn(3L);
        when(mongoTemplate.find(any(Query.class), eq(IdeaPost.class)))
                .thenReturn(List.of(first, second, lookahead));

        IdeaPostAdminPageDto result = service.adminPostsPage("admin", "en", "all", 2, null);

        assertThat(result.records()).extracting(record -> record.id())
                .containsExactly("article-c", "article-b");
        assertThat(result.nextCursor())
                .contains("\"submittedAtIso\":\"2026-07-20T10:00:00Z\"")
                .contains("\"id\":\"article-b\"");

        ArgumentCaptor<Query> pageQuery = ArgumentCaptor.forClass(Query.class);
        verify(mongoTemplate).find(pageQuery.capture(), eq(IdeaPost.class));
        assertThat(pageQuery.getValue().getSkip()).isZero();
        assertThat(pageQuery.getValue().getLimit()).isEqualTo(3);
        assertThat(pageQuery.getValue().getSortObject().toJson())
                .isEqualTo("{\"submittedAtIso\": -1, \"_id\": -1}");
    }

    @Test
    void adminPostsPageContinuesAfterTheCursorTuple() {
        when(mongoTemplate.find(any(Query.class), eq(IdeaPost.class)))
                .thenReturn(List.of(post("article-a", "en", "2026-07-19T10:00:00Z")));

        service.adminPostsPage(
                "admin",
                "en",
                "all",
                10,
                "{\"lang\":\"en\",\"status\":\"all\",\"submittedAtIso\":\"2026-07-20T10:00:00Z\",\"id\":\"article-b\"}");

        ArgumentCaptor<Query> pageQuery = ArgumentCaptor.forClass(Query.class);
        verify(mongoTemplate).find(pageQuery.capture(), eq(IdeaPost.class));
        assertThat(pageQuery.getValue().getSkip()).isZero();
        assertThat(pageQuery.getValue().getQueryObject().toJson())
                .contains("\"submittedAtIso\": {\"$lt\": \"2026-07-20T10:00:00Z\"}")
                .contains("\"submittedAtIso\": \"2026-07-20T10:00:00Z\"")
                .contains("\"_id\": {\"$lt\": \"article-b\"}");
    }

    @Test
    void deletePostReturnsTheSavedMutationWithoutReloadingTheCollection() {
        IdeaPost existing = post("article-a", "en", "2026-07-20T10:00:00Z");
        when(ideaPostsRepository.findById("article-a")).thenReturn(Optional.of(existing));
        when(ideaPostsRepository.save(existing)).thenReturn(existing);

        var result = service.deletePost("article-a", new IdeaPostAdminActionRequestDto("admin"));

        assertThat(result.id()).isEqualTo("article-a");
        assertThat(result.trashed()).isTrue();
        verify(ideaPostsRepository).save(existing);
        verify(ideaPostsRepository, never()).findAllByOrderBySubmittedAtIsoDesc();
    }

    private IdeaPost post(String id, String lang, String submittedAtIso) {
        IdeaPost post = new IdeaPost();
        post.setId(id);
        post.setContentKey(id);
        post.setLang(lang);
        post.setTitle(id);
        post.setExcerpt("Excerpt");
        post.setContentHtml("<p>Article</p>");
        post.setPublished(true);
        post.setTrashed(false);
        post.setSubmittedAtIso(submittedAtIso);
        return post;
    }
}

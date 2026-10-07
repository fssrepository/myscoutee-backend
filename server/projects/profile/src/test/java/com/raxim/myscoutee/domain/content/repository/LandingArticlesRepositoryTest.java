package com.raxim.myscoutee.domain.content.repository;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Query;

import com.raxim.myscoutee.domain.content.document.IdeaPost;
import com.raxim.myscoutee.domain.content.repository.LandingArticlesRepository.LandingArticleCursor;
import com.raxim.myscoutee.domain.content.repository.LandingArticlesRepository.LandingArticleSlice;

@ExtendWith(MockitoExtension.class)
@org.junit.jupiter.api.Tag("standard")
class LandingArticlesRepositoryTest {
    @Mock
    private MongoTemplate mongoTemplate;

    private LandingArticlesRepository repository;

    @BeforeEach
    void setUp() {
        repository = new LandingArticlesRepository(mongoTemplate);
    }

    @Test
    void findPageFiltersPublicArticlesAndUsesStableDatabaseOrdering() {
        IdeaPost first = post("article-c", "2026-07-20T10:00:00Z");
        IdeaPost second = post("article-b", "2026-07-20T10:00:00Z");
        IdeaPost lookahead = post("article-a", "2026-07-19T10:00:00Z");
        when(mongoTemplate.count(any(Query.class), eq(IdeaPost.class))).thenReturn(8L);
        when(mongoTemplate.find(any(Query.class), eq(IdeaPost.class)))
                .thenReturn(List.of(first, second, lookahead));

        LandingArticleSlice result = repository.findPage("hu", 2, 2, null);

        assertThat(result.records()).containsExactly(first, second);
        assertThat(result.total()).isEqualTo(8L);
        assertThat(result.hasNext()).isTrue();

        ArgumentCaptor<Query> countQuery = ArgumentCaptor.forClass(Query.class);
        verify(mongoTemplate).count(countQuery.capture(), eq(IdeaPost.class));
        assertThat(countQuery.getValue().getQueryObject().toJson())
                .contains("\"lang\": \"hu\"")
                .contains("\"published\": true")
                .contains("\"trashed\": {\"$ne\": true}");

        ArgumentCaptor<Query> pageQuery = ArgumentCaptor.forClass(Query.class);
        verify(mongoTemplate).find(pageQuery.capture(), eq(IdeaPost.class));
        assertThat(pageQuery.getValue().getSkip()).isEqualTo(4L);
        assertThat(pageQuery.getValue().getLimit()).isEqualTo(3);
        assertThat(pageQuery.getValue().getSortObject().toJson())
                .isEqualTo("{\"submittedAtIso\": -1, \"_id\": -1}");
    }

    @Test
    void findPageUsesSubmittedTimestampAndIdAsKeysetCursor() {
        when(mongoTemplate.count(any(Query.class), eq(IdeaPost.class))).thenReturn(4L);
        when(mongoTemplate.find(any(Query.class), eq(IdeaPost.class)))
                .thenReturn(List.of(post("article-a", "2026-07-19T10:00:00Z")));

        LandingArticleSlice result = repository.findPage(
                "en",
                99,
                10,
                new LandingArticleCursor("en", "2026-07-20T10:00:00Z", "article-b"));

        assertThat(result.hasNext()).isFalse();
        ArgumentCaptor<Query> pageQuery = ArgumentCaptor.forClass(Query.class);
        verify(mongoTemplate).find(pageQuery.capture(), eq(IdeaPost.class));
        Query query = pageQuery.getValue();
        assertThat(query.getSkip()).isZero();
        assertThat(query.getQueryObject().toJson())
                .contains("\"submittedAtIso\": {\"$lt\": \"2026-07-20T10:00:00Z\"}")
                .contains("\"submittedAtIso\": \"2026-07-20T10:00:00Z\"")
                .contains("\"_id\": {\"$lt\": \"article-b\"}");
    }

    @Test
    void findFeaturedPreviewFiltersBeforeApplyingItsLimitAndKeepsThePublicTotal() {
        IdeaPost featured = post("featured", "2026-07-20T10:00:00Z");
        featured.setFeatured(true);
        when(mongoTemplate.count(any(Query.class), eq(IdeaPost.class))).thenReturn(12L);
        when(mongoTemplate.find(any(Query.class), eq(IdeaPost.class))).thenReturn(List.of(featured));

        LandingArticleSlice result = repository.findFeaturedPreview("en", 8);

        assertThat(result.records()).containsExactly(featured);
        assertThat(result.total()).isEqualTo(12L);
        ArgumentCaptor<Query> pageQuery = ArgumentCaptor.forClass(Query.class);
        verify(mongoTemplate).find(pageQuery.capture(), eq(IdeaPost.class));
        assertThat(pageQuery.getValue().getLimit()).isEqualTo(8);
        assertThat(pageQuery.getValue().getQueryObject().toJson())
                .contains("\"lang\": \"en\"")
                .contains("\"published\": true")
                .contains("\"trashed\": {\"$ne\": true}")
                .contains("\"featured\": true");
    }

    private IdeaPost post(String id, String submittedAtIso) {
        IdeaPost post = new IdeaPost();
        post.setId(id);
        post.setLang("en");
        post.setPublished(true);
        post.setTrashed(false);
        post.setSubmittedAtIso(submittedAtIso);
        return post;
    }
}

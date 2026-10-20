package com.raxim.myscoutee.domain.content.mapper;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

import com.raxim.myscoutee.domain.content.document.IdeaPost;

@org.junit.jupiter.api.Tag("standard")
class IdeaPostMapperTest {
    private final IdeaPostMapper mapper = new IdeaPostMapper();

    @Test
    void preservesRegionalAndQualityWeightedHungarianLanguageValues() {
        IdeaPost regional = post("hu-HU");
        IdeaPost weighted = post("hu;q=0.9");

        assertThat(mapper.toDto(regional).lang()).isEqualTo("hu");
        assertThat(mapper.toDto(regional).languageLabel()).isEqualTo("Magyar");
        assertThat(mapper.toDto(weighted).lang()).isEqualTo("hu");
        assertThat(mapper.toDto(weighted).languageLabel()).isEqualTo("Magyar");
    }

    @Test
    void preservesGermanAndSpanishLanguageAndSharedContentIdentity() {
        for (String lang : new String[] {"de", "es"}) {
            IdeaPost post = post(lang + "-" + lang.toUpperCase());
            post.setId("article-" + lang);
            post.setContentKey(null);
            var dto = mapper.toDto(post);
            assertThat(dto.lang()).isEqualTo(lang);
            assertThat(dto.contentKey()).isEqualTo("article");
            assertThat(dto.languageLabel()).isEqualTo("de".equals(lang) ? "Deutsch" : "Español");
        }
    }

    private IdeaPost post(String lang) {
        IdeaPost post = new IdeaPost();
        post.setId("article-hu");
        post.setContentKey("article-hu");
        post.setLang(lang);
        post.setTitle("Cikk");
        post.setContentHtml("<p>Cikk</p>");
        post.setSubmittedAtIso("2026-07-20T10:00:00Z");
        return post;
    }
}

package com.raxim.myscoutee.profile.repository;

import java.util.List;
import java.util.regex.Pattern;

import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Repository;

import com.raxim.myscoutee.profile.data.document.IdeaPost;

@Repository
public class LandingArticlesRepository {
    private static final Pattern NON_BLANK_TEXT = Pattern.compile("\\S");
    private static final Sort PUBLIC_ARTICLE_SORT = Sort.by(
            Sort.Order.desc("submittedAtIso"),
            Sort.Order.desc("_id"));

    private final MongoTemplate mongoTemplate;

    public LandingArticlesRepository(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }

    public LandingArticleSlice findPage(
            String lang,
            int page,
            int pageSize,
            LandingArticleCursor cursor) {
        return findPage(lang, page, pageSize, cursor, null);
    }

    public LandingArticleSlice findPage(String lang, int page, int pageSize, LandingArticleCursor cursor, String groupId) {
        Criteria publicCriteria = publicArticleCriteria(lang, groupId);
        long total = mongoTemplate.count(Query.query(publicCriteria), IdeaPost.class);
        if (total == 0L) {
            return new LandingArticleSlice(List.of(), 0L, false);
        }

        Query pageQuery = Query.query(pageCriteria(lang, cursor, groupId))
                .with(PUBLIC_ARTICLE_SORT)
                .limit(pageSize + 1);
        if (cursor == null) {
            pageQuery.skip(Math.max(0L, (long) page) * pageSize);
        }

        List<IdeaPost> matches = mongoTemplate.find(pageQuery, IdeaPost.class);
        boolean hasNext = matches.size() > pageSize;
        List<IdeaPost> records = hasNext
                ? List.copyOf(matches.subList(0, pageSize))
                : List.copyOf(matches);
        return new LandingArticleSlice(records, total, hasNext);
    }

    public LandingArticleSlice findFeaturedPreview(String lang, int limit) {
        return findFeaturedPreview(lang, limit, null);
    }

    public LandingArticleSlice findFeaturedPreview(String lang, int limit, String groupId) {
        Criteria publicCriteria = publicArticleCriteria(lang, groupId);
        long total = mongoTemplate.count(Query.query(publicCriteria), IdeaPost.class);
        if (total == 0L) {
            return new LandingArticleSlice(List.of(), 0L, false);
        }
        Criteria featuredCriteria = new Criteria().andOperator(
                publicArticleCriteria(lang, groupId),
                Criteria.where("featured").is(true));
        List<IdeaPost> records = mongoTemplate.find(
                Query.query(featuredCriteria)
                        .with(PUBLIC_ARTICLE_SORT)
                        .limit(Math.max(1, limit)),
                IdeaPost.class);
        return new LandingArticleSlice(List.copyOf(records), total, false);
    }

    private Criteria publicArticleCriteria(String lang, String groupId) {
        return new Criteria().andOperator(
                Criteria.where("lang").is(lang),
                Criteria.where("workspaceGroupId").is(groupId),
                Criteria.where("published").is(true),
                Criteria.where("trashed").ne(true),
                Criteria.where("title").regex(NON_BLANK_TEXT),
                Criteria.where("contentHtml").regex(NON_BLANK_TEXT),
                Criteria.where("submittedAtIso").regex(NON_BLANK_TEXT));
    }

    private Criteria pageCriteria(String lang, LandingArticleCursor cursor, String groupId) {
        Criteria publicCriteria = publicArticleCriteria(lang, groupId);
        if (cursor == null) {
            return publicCriteria;
        }
        Criteria afterCursor = new Criteria().orOperator(
                Criteria.where("submittedAtIso").lt(cursor.submittedAtIso()),
                new Criteria().andOperator(
                        Criteria.where("submittedAtIso").is(cursor.submittedAtIso()),
                        Criteria.where("_id").lt(cursor.id())));
        return new Criteria().andOperator(publicCriteria, afterCursor);
    }

    public List<com.raxim.myscoutee.profile.data.dto.landing.LandingContentDtos.LandingSlideDto> findSlides(String groupId) {
        return mongoTemplate.find(Query.query(Criteria.where("workspaceGroupId").is(groupId))
                .with(Sort.by(Sort.Direction.ASC, "index")),
                com.raxim.myscoutee.profile.data.dto.landing.LandingContentDtos.LandingSlideDto.class, "landingSlides");
    }

    public record LandingArticleCursor(String lang, String submittedAtIso, String id) {
    }

    public record LandingArticleSlice(List<IdeaPost> records, long total, boolean hasNext) {
    }
}

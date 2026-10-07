package com.raxim.myscoutee.domain.content.service;
import java.util.List;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.*;
import org.springframework.util.StringUtils;
import com.raxim.myscoutee.domain.content.document.IdeaPost;
import com.raxim.myscoutee.domain.media.api.MediaStorage;
@org.springframework.stereotype.Service
public class ContentPrivacyService implements com.raxim.myscoutee.domain.content.api.ContentPrivacy {
    private final MongoTemplate mongoTemplate;
    private final MediaStorage media;
    public ContentPrivacyService(MongoTemplate mongo, MediaStorage media) { mongoTemplate = mongo; this.media = media; }
    public void purgeIdeaPosts(String userId) {
        List<IdeaPost> posts = mongoTemplate.find(
                Query.query(new Criteria().orOperator(
                        Criteria.where("createdUser").is(userId),
                        Criteria.where("updatedUser").is(userId),
                        Criteria.where("trashedByUserId").is(userId))),
                IdeaPost.class);
        for (IdeaPost post : posts == null ? List.<IdeaPost>of() : posts) {
            if (post == null) {
                continue;
            }
            media.deletePublicObjectOrThrow(post.getImageUrl());
            for (String imageUrl : post.getImageUrls() == null ? List.<String>of() : post.getImageUrls()) {
                media.deletePublicObjectOrThrow(imageUrl);
            }
        }
        if (posts != null && !posts.isEmpty()) {
            mongoTemplate.remove(Query.query(Criteria.where("_id").in(posts.stream().map(IdeaPost::getId).toList())), IdeaPost.class);
        }
    }

    public void purgeFeedback(String userId) {
        deleteDocumentsByAnyField("userFeedback", List.of("userId", "createdUser", "updatedUser"), userId);
    }
    public void purgeReports(String userId) {
        deleteDocumentsByAnyField("userReports", List.of("userId", "targetUserId", "createdUser", "updatedUser"), userId);
    }
    public void purgeFeedViews(String userId) {
        deleteDocumentsByAnyField("photoFeedViews", List.of("userId"), userId);
    }
    public void purgeShareTokens(String userId) {
        deleteDocumentsByAnyField("shareTokens", List.of("ownerUserId"), userId);
    }
    private void deleteDocumentsByAnyField(String collectionName, List<String> fields, String userId) {
        if (!StringUtils.hasText(collectionName) || fields == null || fields.isEmpty() || !StringUtils.hasText(userId)) {
            return;
        }
        List<Criteria> criteria = fields.stream()
                .filter(StringUtils::hasText)
                .map(field -> Criteria.where(field).is(userId))
                .toList();
        if (criteria.isEmpty()) {
            return;
        }
        mongoTemplate.remove(Query.query(new Criteria().orOperator(criteria.toArray(Criteria[]::new))), collectionName);
    }

}

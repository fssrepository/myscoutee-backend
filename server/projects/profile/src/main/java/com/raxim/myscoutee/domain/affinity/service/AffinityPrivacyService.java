package com.raxim.myscoutee.domain.affinity.service;
import java.util.List;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.*;
import org.springframework.util.StringUtils;
import com.raxim.myscoutee.domain.affinity.api.AffinityPrivacy;
@org.springframework.stereotype.Service
public class AffinityPrivacyService implements AffinityPrivacy {
    private final MongoTemplate mongoTemplate;
    public AffinityPrivacyService(MongoTemplate mongo) { mongoTemplate = mongo; }
    public void purgeRatings(String userId) {
        deleteDocumentsByAnyField("userRates", List.of("ownerUserId", "relatedUserId", "secondaryRelatedUserId", "bridgeUserId", "createdUser", "updatedUser"), userId);
    }
    public void purgeEdges(String userId) {
        deleteDocumentsByAnyField("userAffinityEdges", List.of("leftUserId", "rightUserId"), userId);
    }
    public void purgeTasks(String userId) {
        deleteDocumentsByAnyField("affinityRecomputeTasks", List.of("targetId", "createdUser", "updatedUser"), userId);
        deleteDocumentsByAnyField("affinityRecomputeTasks", List.of("targetId"), "USER:" + userId);
    }
    public void anonymizeAuthors(String userId) {
        anonymizeUserFieldsByAnyField("affinityConfigs", List.of("changedUser"), userId);
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

    private void anonymizeUserFieldsByAnyField(String collectionName, List<String> fields, String userId) {
        if (!StringUtils.hasText(collectionName) || fields == null || fields.isEmpty() || !StringUtils.hasText(userId)) {
            return;
        }
        List<String> fieldNames = fields.stream()
                .filter(StringUtils::hasText)
                .toList();
        if (fieldNames.isEmpty()) {
            return;
        }
        for (String field : fieldNames) {
            Update update = new Update();
            update.set(field, "deleted-user");
            mongoTemplate.updateMulti(Query.query(Criteria.where(field).is(userId)), update, collectionName);
        }
    }

}

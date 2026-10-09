package com.raxim.myscoutee.domain.email.service;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.*;
import com.raxim.myscoutee.domain.email.api.EmailPrivacy;
@Service
public class EmailPrivacyService implements EmailPrivacy {
    private final MongoTemplate mongo;
    public EmailPrivacyService(MongoTemplate mongo) { this.mongo = mongo; }
    @Override public void purgeDeliveryData(String userId) {
        if (!StringUtils.hasText(userId)) return;
        remove("scheduledMessageTasks", List.of("userId", "createdUser", "updatedUser"), userId);
        remove("scheduledMessageDeliveries", List.of("userId", "createdUser"), userId);
        remove("scheduledMessageRuns", List.of("createdUser", "updatedUser"), userId);
        remove("emailOutbox", List.of("userId", "createdUser", "updatedUser"), userId);
    }
    private void remove(String collection, List<String> fields, String userId) {
        var criteria = fields.stream().map(field -> Criteria.where(field).is(userId)).toArray(Criteria[]::new);
        mongo.remove(Query.query(new Criteria().orOperator(criteria)), collection);
    }
    @Override public void anonymizeAuthors(String userId) {
        if (!StringUtils.hasText(userId)) return;
        for (String collection : List.of("emailTemplates", "emailCampaignRules")) {
            for (String field : List.of("createdUser", "updatedUser")) {
                mongo.updateMulti(Query.query(Criteria.where(field).is(userId)), new Update().set(field, "deleted-user"), collection);
            }
        }
    }
}

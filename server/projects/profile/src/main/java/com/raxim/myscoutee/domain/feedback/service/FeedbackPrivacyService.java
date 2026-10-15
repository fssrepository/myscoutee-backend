package com.raxim.myscoutee.domain.feedback.service;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.*;
import com.raxim.myscoutee.domain.feedback.api.FeedbackPrivacy;
import com.raxim.myscoutee.domain.feedback.document.*;
@Service
public class FeedbackPrivacyService implements FeedbackPrivacy {
    private final MongoTemplate mongo;
    public FeedbackPrivacyService(MongoTemplate mongo) { this.mongo = mongo; }
    public void purgeFeedback(String userId) {
        if (userId == null || userId.isBlank()) return;
        remove(FeedbackAnswer.class, List.of("viewerUserId", "targetUserId", "createdUser", "updatedUser"), userId);
        remove(FeedbackState.class, List.of("viewerUserId", "createdUser", "updatedUser"), userId);
    }
    private void remove(Class<?> type, List<String> fields, String userId) {
        mongo.remove(Query.query(new Criteria().orOperator(fields.stream()
            .map(field -> Criteria.where(field).is(userId)).toArray(Criteria[]::new))), type);
    }
}

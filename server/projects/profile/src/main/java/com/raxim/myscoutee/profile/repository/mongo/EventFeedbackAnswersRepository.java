package com.raxim.myscoutee.profile.repository.mongo;

import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.raxim.myscoutee.profile.data.document.mongo.EventFeedbackAnswer;

public interface EventFeedbackAnswersRepository extends MongoRepository<EventFeedbackAnswer, String> {
    List<EventFeedbackAnswer> findByViewerUserIdAndEventId(String viewerUserId, String eventId);

    Optional<EventFeedbackAnswer> findByViewerUserIdAndEventIdAndCardId(String viewerUserId, String eventId, String cardId);
}

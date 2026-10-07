package com.raxim.myscoutee.domain.events.repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.raxim.myscoutee.domain.events.document.EventFeedbackAnswer;

public interface EventFeedbackAnswersRepository extends MongoRepository<EventFeedbackAnswer, String> {
    List<EventFeedbackAnswer> findByViewerUserIdAndEventId(String viewerUserId, String eventId);

    List<EventFeedbackAnswer> findByViewerUserIdOrderByEventIdAscSubmittedAtIsoDesc(String viewerUserId);

    List<EventFeedbackAnswer> findByEventIdInOrderByEventIdAscSubmittedAtIsoDesc(Collection<String> eventIds);

    Optional<EventFeedbackAnswer> findByViewerUserIdAndEventIdAndCardId(String viewerUserId, String eventId, String cardId);

    List<EventFeedbackAnswer> findByTargetUserIdOrderBySubmittedAtIsoDesc(String targetUserId);
}

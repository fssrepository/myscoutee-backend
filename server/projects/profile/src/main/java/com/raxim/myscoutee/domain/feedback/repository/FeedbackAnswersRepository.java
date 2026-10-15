package com.raxim.myscoutee.domain.feedback.repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.raxim.myscoutee.domain.feedback.document.FeedbackAnswer;

public interface FeedbackAnswersRepository extends MongoRepository<FeedbackAnswer, String> {
    List<FeedbackAnswer> findByViewerUserIdAndEventId(String viewerUserId, String eventId);

    List<FeedbackAnswer> findByViewerUserIdOrderByEventIdAscSubmittedAtIsoDesc(String viewerUserId);

    List<FeedbackAnswer> findByEventIdInOrderByEventIdAscSubmittedAtIsoDesc(Collection<String> eventIds);

    Optional<FeedbackAnswer> findByViewerUserIdAndEventIdAndCardId(String viewerUserId, String eventId, String cardId);

    List<FeedbackAnswer> findByTargetUserIdOrderBySubmittedAtIsoDesc(String targetUserId);
}

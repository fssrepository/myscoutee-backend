package com.raxim.myscoutee.domain.feedback.repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.raxim.myscoutee.domain.feedback.document.FeedbackState;

public interface FeedbackStatesRepository extends MongoRepository<FeedbackState, String> {
    List<FeedbackState> findByViewerUserIdOrderByUpdatedDateDesc(String viewerUserId);

    List<FeedbackState> findByEventIdInOrderByEventIdAscUpdatedDateDesc(Collection<String> eventIds);

    Optional<FeedbackState> findByViewerUserIdAndEventId(String viewerUserId, String eventId);

}

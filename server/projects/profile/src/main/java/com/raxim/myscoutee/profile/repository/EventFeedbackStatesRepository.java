package com.raxim.myscoutee.profile.repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.raxim.myscoutee.profile.data.document.EventFeedbackState;

public interface EventFeedbackStatesRepository extends MongoRepository<EventFeedbackState, String> {
    List<EventFeedbackState> findByViewerUserIdOrderByUpdatedDateDesc(String viewerUserId);

    List<EventFeedbackState> findByEventIdInOrderByEventIdAscUpdatedDateDesc(Collection<String> eventIds);

    Optional<EventFeedbackState> findByViewerUserIdAndEventId(String viewerUserId, String eventId);
}

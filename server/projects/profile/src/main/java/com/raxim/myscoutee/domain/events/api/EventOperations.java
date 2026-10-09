package com.raxim.myscoutee.domain.events.api;
import java.util.*;
import com.raxim.myscoutee.domain.events.dto.EventsDtos.*;
import com.raxim.myscoutee.domain.media.dto.MediaDtos.*;

public interface EventOperations {
    EventsExplorePageDto queryItemsByUserPage(String requestedUserId, Integer requestedLimit, String cursor);
    EventsExplorePageDto queryInvitationsPage(String requestedUserId, Integer requestedLimit, String cursor);
    EventsExplorePageDto queryAttendingPage(String requestedUserId, Integer requestedLimit, String cursor);
    EventsExplorePageDto queryHostingPage(String requestedUserId, Integer requestedLimit, String cursor);
    EventsExplorePageDto queryTrashPage(String requestedUserId, Integer requestedLimit, String cursor);
    EventDetailDto loadEventDetailById(String requestedUserId, String eventId);
    EventParticipationActionResultDto requestJoin(EventActionRequestDto request);
    EventDto sync(EventDetailDto request);
}

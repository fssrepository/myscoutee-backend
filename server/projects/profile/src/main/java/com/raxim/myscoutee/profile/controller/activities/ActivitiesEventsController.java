package com.raxim.myscoutee.profile.controller.activities;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.raxim.myscoutee.profile.service.ActivitiesEventsService;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.ActivitiesEventSyncPayloadDto;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventActionRequestDto;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventFeedbackReceivedEventDto;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventFeedbackNoteRequestDto;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventFeedbackStateDto;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventFeedbackSubmitRequestDto;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventFeedbackToggleRequestDto;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventRecordDto;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventsExploreQueryDto;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventsFilterRequestDto;
import com.raxim.myscoutee.profile.service.ActivitiesEventFeedbackService;

@RestController
@RequestMapping("/activities/events")
public class ActivitiesEventsController {
    private final ActivitiesEventsService activitiesEventsService;
    private final ActivitiesEventFeedbackService activitiesEventFeedbackService;

    public ActivitiesEventsController(
            ActivitiesEventsService activitiesEventsService,
            ActivitiesEventFeedbackService activitiesEventFeedbackService) {
        this.activitiesEventsService = activitiesEventsService;
        this.activitiesEventFeedbackService = activitiesEventFeedbackService;
    }

    @GetMapping
    public List<EventRecordDto> queryItems(@RequestParam("userId") String userId) {
        return activitiesEventsService.queryItemsByUser(userId);
    }

    @GetMapping("/invitations")
    public List<EventRecordDto> queryInvitations(@RequestParam("userId") String userId) {
        return activitiesEventsService.queryInvitations(userId);
    }

    @GetMapping("/attending")
    public List<EventRecordDto> queryAttending(@RequestParam("userId") String userId) {
        return activitiesEventsService.queryAttending(userId);
    }

    @GetMapping("/hosting")
    public List<EventRecordDto> queryHosting(@RequestParam("userId") String userId) {
        return activitiesEventsService.queryHosting(userId);
    }

    @GetMapping("/trash")
    public List<EventRecordDto> queryTrash(@RequestParam("userId") String userId) {
        return activitiesEventsService.queryTrash(userId);
    }

    @PostMapping("/filter")
    public Object filter(@RequestBody EventsFilterRequestDto request) {
        if (activitiesEventsService.isPagedFilterRequest(request)) {
            return activitiesEventsService.queryActivitiesEventPage(request);
        }
        return activitiesEventsService.queryItemsByFilter(request);
    }

    @PostMapping("/explore")
    public Object explore(@RequestBody EventsExploreQueryDto request) {
        if (activitiesEventsService.isPagedExploreRequest(request)) {
            return activitiesEventsService.queryEventExplorePage(request);
        }
        return activitiesEventsService.queryExploreItems(request == null ? null : request.userId());
    }

    @PostMapping("/trash")
    public void trash(@RequestBody EventActionRequestDto request) {
        activitiesEventsService.trash(request);
    }

    @PostMapping("/publish")
    public void publish(@RequestBody EventActionRequestDto request) {
        activitiesEventsService.publish(request);
    }

    @PostMapping("/restore")
    public void restore(@RequestBody EventActionRequestDto request) {
        activitiesEventsService.restore(request);
    }

    @PostMapping("/take-over")
    public void takeOver(@RequestBody EventActionRequestDto request) {
        activitiesEventsService.takeOver(request);
    }

    @PostMapping("/join")
    public EventRecordDto requestJoin(@RequestBody EventActionRequestDto request) {
        return activitiesEventsService.requestJoin(request);
    }

    @GetMapping("/feedback")
    public List<EventFeedbackStateDto> queryFeedback(@RequestParam("userId") String userId) {
        return activitiesEventFeedbackService.queryStates(userId);
    }

    @GetMapping("/feedback/received")
    public List<EventFeedbackReceivedEventDto> queryReceivedFeedback(@RequestParam("userId") String userId) {
        return activitiesEventFeedbackService.queryReceivedEvents(userId);
    }

    @PostMapping("/feedback/submit")
    public void submitFeedback(@RequestBody EventFeedbackSubmitRequestDto request) {
        activitiesEventFeedbackService.submit(request);
    }

    @PostMapping("/feedback/note")
    public void saveFeedbackNote(@RequestBody EventFeedbackNoteRequestDto request) {
        activitiesEventFeedbackService.saveNote(request);
    }

    @PostMapping("/feedback/remove")
    public void removeFeedbackEvent(@RequestBody EventFeedbackToggleRequestDto request) {
        activitiesEventFeedbackService.markRemoved(request, true);
    }

    @PostMapping("/feedback/restore")
    public void restoreFeedbackEvent(@RequestBody EventFeedbackToggleRequestDto request) {
        activitiesEventFeedbackService.markRemoved(request, false);
    }

    @PostMapping("/sync")
    public void sync(@RequestBody ActivitiesEventSyncPayloadDto request) {
        activitiesEventsService.sync(request);
    }
}

package com.raxim.myscoutee.profile.controller.activities;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.util.StringUtils;

import com.raxim.myscoutee.profile.service.ActivitiesEventsService;
import com.raxim.myscoutee.profile.service.CurrentPaymentProviderService;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventDetailDto;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventInvitationContextDto;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventActionRequestDto;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventParticipationActionResultDto;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventFeedbackQueryDto;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventFeedbackDetailDto;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventFeedbackReceivedEventDto;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventFeedbackNoteRequestDto;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventFeedbackPageQueryDto;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventFeedbackPageResultDto;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventFeedbackStateDto;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventFeedbackStatDto;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventFeedbackStatQueryDto;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventFeedbackSubmitRequestDto;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventFeedbackToggleRequestDto;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventDto;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventCheckoutSlotsQueryDto;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventCheckoutSlotsResultDto;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventSubEventsQueryDto;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventSubEventsResultDto;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventStageActionRequestDto;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventStageActionResultDto;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventsExploreQueryDto;
import com.raxim.myscoutee.profile.data.dto.events.EventsDtos.EventsFilterRequestDto;
import com.raxim.myscoutee.profile.security.AccessPolicyKeys;
import com.raxim.myscoutee.profile.security.RequiresPolicy;
import com.raxim.myscoutee.profile.service.ActivitiesEventFeedbackService;

@RestController
@RequestMapping("/activities/events")
public class ActivitiesEventsController {
    private final ActivitiesEventsService activitiesEventsService;
    private final ActivitiesEventFeedbackService activitiesEventFeedbackService;
    private final CurrentPaymentProviderService currentPaymentProviderService;

    public ActivitiesEventsController(
            ActivitiesEventsService activitiesEventsService,
            ActivitiesEventFeedbackService activitiesEventFeedbackService,
            CurrentPaymentProviderService currentPaymentProviderService) {
        this.activitiesEventsService = activitiesEventsService;
        this.activitiesEventFeedbackService = activitiesEventFeedbackService;
        this.currentPaymentProviderService = currentPaymentProviderService;
    }

    @GetMapping
    public Object queryItems(
            @RequestParam("userId") String userId,
            @RequestParam(value = "limit", required = false) Integer limit,
            @RequestParam(value = "cursor", required = false) String cursor) {
        if (limit != null || StringUtils.hasText(cursor)) {
            return activitiesEventsService.queryItemsByUserPage(userId, limit, cursor);
        }
        return activitiesEventsService.queryItemsByUser(userId);
    }

    @GetMapping("/invitations")
    public Object queryInvitations(
            @RequestParam("userId") String userId,
            @RequestParam(value = "limit", required = false) Integer limit,
            @RequestParam(value = "cursor", required = false) String cursor) {
        if (limit != null || StringUtils.hasText(cursor)) {
            return activitiesEventsService.queryInvitationsPage(userId, limit, cursor);
        }
        return activitiesEventsService.queryInvitations(userId);
    }

    @GetMapping("/attending")
    public Object queryAttending(
            @RequestParam("userId") String userId,
            @RequestParam(value = "limit", required = false) Integer limit,
            @RequestParam(value = "cursor", required = false) String cursor) {
        if (limit != null || StringUtils.hasText(cursor)) {
            return activitiesEventsService.queryAttendingPage(userId, limit, cursor);
        }
        return activitiesEventsService.queryAttending(userId);
    }

    @GetMapping("/hosting")
    public Object queryHosting(
            @RequestParam("userId") String userId,
            @RequestParam(value = "limit", required = false) Integer limit,
            @RequestParam(value = "cursor", required = false) String cursor) {
        if (limit != null || StringUtils.hasText(cursor)) {
            return activitiesEventsService.queryHostingPage(userId, limit, cursor);
        }
        return activitiesEventsService.queryHosting(userId);
    }

    @GetMapping("/trash")
    public Object queryTrash(
            @RequestParam("userId") String userId,
            @RequestParam(value = "limit", required = false) Integer limit,
            @RequestParam(value = "cursor", required = false) String cursor) {
        if (limit != null || StringUtils.hasText(cursor)) {
            return activitiesEventsService.queryTrashPage(userId, limit, cursor);
        }
        return activitiesEventsService.queryTrash(userId);
    }

    @PostMapping("/filter")
    public Object filter(@RequestBody EventsFilterRequestDto request) {
        return activitiesEventsService.queryActivitiesEventListPage(request);
    }

    @GetMapping("/detail")
    public EventDetailDto detail(
            @RequestParam("userId") String userId,
            @RequestParam("eventId") String eventId) {
        return activitiesEventsService.loadEventDetailById(userId, eventId);
    }

    @GetMapping("/invitation-context")
    public EventInvitationContextDto invitationContext(
            @RequestParam("userId") String userId,
            @RequestParam("eventId") String eventId) {
        return activitiesEventsService.loadInvitationContext(userId, eventId);
    }

    @PostMapping("/sub-events")
    public EventSubEventsResultDto subEvents(@RequestBody EventSubEventsQueryDto request) {
        return activitiesEventsService.loadSubEventsById(request);
    }

    @PostMapping("/checkout/slots")
    public EventCheckoutSlotsResultDto checkoutSlots(@RequestBody EventCheckoutSlotsQueryDto request) {
        return activitiesEventsService.loadCheckoutSlots(request);
    }

    @PostMapping("/explore")
    public Object explore(@RequestBody EventsExploreQueryDto request) {
        if (activitiesEventsService.isPagedExploreRequest(request)) {
            return activitiesEventsService.queryEventExplorePage(request);
        }
        return activitiesEventsService.queryExploreItems(request == null ? null : request.userId());
    }

    @PostMapping("/trash")
    public EventParticipationActionResultDto trash(@RequestBody EventActionRequestDto request) {
        return activitiesEventsService.trash(request);
    }

    @PostMapping("/publish")
    @RequiresPolicy(
            key = AccessPolicyKeys.EVENT_PUBLISH,
            subject = "#actorUserId",
            resourceId = "#request?.sourceId()",
            skipWhenAuthenticationOptional = true)
    public EventParticipationActionResultDto publish(@RequestBody EventActionRequestDto request) {
        return activitiesEventsService.publish(request);
    }

    @PostMapping("/unpublish")
    @RequiresPolicy(
            key = AccessPolicyKeys.EVENT_UNPUBLISH,
            subject = "#actorUserId",
            resourceId = "#request?.sourceId()",
            skipWhenAuthenticationOptional = true)
    public EventParticipationActionResultDto unpublish(@RequestBody EventActionRequestDto request) {
        return activitiesEventsService.unpublish(request);
    }

    @PostMapping("/restore")
    public EventParticipationActionResultDto restore(@RequestBody EventActionRequestDto request) {
        return activitiesEventsService.restore(request);
    }

    @PostMapping("/take-over")
    @RequiresPolicy(
            key = AccessPolicyKeys.EVENT_TAKEOVER,
            subject = "#actorUserId",
            resourceId = "#request?.sourceId()",
            skipWhenAuthenticationOptional = true)
    public void takeOver(@RequestBody EventActionRequestDto request) {
        activitiesEventsService.takeOver(request);
    }

    @PostMapping("/join")
    @RequiresPolicy(
            key = AccessPolicyKeys.EVENT_JOIN,
            subject = "#request?.userId() ?: #actorUserId",
            resourceId = "#request?.sourceId()",
            skipWhenAuthenticationOptional = true)
    public EventParticipationActionResultDto requestJoin(@RequestBody EventActionRequestDto request) {
        if (isCashPaymentConfirmation(request)) {
            currentPaymentProviderService.requireCashOnly();
        }
        return activitiesEventsService.requestJoin(request);
    }

    private boolean isCashPaymentConfirmation(EventActionRequestDto request) {
        return request != null
                && Boolean.TRUE.equals(request.bookingConfirmed())
                && request.totalAmount() != null
                && request.totalAmount() > 0D
                && "confirmed".equalsIgnoreCase(request.checkoutState())
                && !StringUtils.hasText(request.paymentSessionId());
    }

    @PostMapping("/stage-action")
    @RequiresPolicy(
            key = AccessPolicyKeys.EVENT_STAGE_ACTION,
            subject = "#actorUserId",
            resourceId = "#request?.sourceId()",
            skipWhenAuthenticationOptional = true)
    public EventStageActionResultDto applyStageAction(@RequestBody EventStageActionRequestDto request) {
        return activitiesEventsService.applyStageAction(request);
    }

    @GetMapping("/feedback")
    public List<EventFeedbackStateDto> queryFeedback(@RequestParam("userId") String userId) {
        return activitiesEventFeedbackService.queryStates(userId);
    }

    @GetMapping("/feedback/received")
    public List<EventFeedbackReceivedEventDto> queryReceivedFeedback(@RequestParam("userId") String userId) {
        return activitiesEventFeedbackService.queryReceivedEvents(userId);
    }

    @PostMapping("/feedback/page")
    public EventFeedbackPageResultDto loadFeedbackPage(@RequestBody EventFeedbackPageQueryDto request) {
        return activitiesEventFeedbackService.loadPage(request);
    }

    @PostMapping("/feedback/stat")
    public EventFeedbackStatDto loadFeedbackStat(@RequestBody EventFeedbackStatQueryDto request) {
        return activitiesEventFeedbackService.loadStatById(request);
    }

    @PostMapping("/feedback/detail")
    public EventFeedbackDetailDto loadFeedbackDetail(@RequestBody EventFeedbackQueryDto request) {
        return activitiesEventFeedbackService.loadDetail(request);
    }

    @PostMapping("/feedback/submit")
    @RequiresPolicy(
            key = AccessPolicyKeys.EVENT_FEEDBACK_SUBMIT,
            subject = "#request?.userId() ?: #actorUserId",
            resourceId = "#request?.feedback()?.eventId()",
            skipWhenAuthenticationOptional = true)
    public EventFeedbackDetailDto submitFeedback(@RequestBody EventFeedbackSubmitRequestDto request) {
        return activitiesEventFeedbackService.submit(request);
    }

    @PostMapping("/feedback/note")
    @RequiresPolicy(
            key = AccessPolicyKeys.EVENT_FEEDBACK_NOTE,
            subject = "#request?.userId() ?: #actorUserId",
            resourceId = "#request?.eventId()",
            skipWhenAuthenticationOptional = true)
    public void saveFeedbackNote(@RequestBody EventFeedbackNoteRequestDto request) {
        activitiesEventFeedbackService.saveNote(request);
    }

    @PostMapping("/feedback/remove")
    @RequiresPolicy(
            key = AccessPolicyKeys.EVENT_FEEDBACK_REMOVE,
            subject = "#request?.userId() ?: #actorUserId",
            resourceId = "#request?.eventId()",
            skipWhenAuthenticationOptional = true)
    public void removeFeedbackEvent(@RequestBody EventFeedbackToggleRequestDto request) {
        activitiesEventFeedbackService.markRemoved(request, true);
    }

    @PostMapping("/feedback/restore")
    @RequiresPolicy(
            key = AccessPolicyKeys.EVENT_FEEDBACK_RESTORE,
            subject = "#request?.userId() ?: #actorUserId",
            resourceId = "#request?.eventId()",
            skipWhenAuthenticationOptional = true)
    public void restoreFeedbackEvent(@RequestBody EventFeedbackToggleRequestDto request) {
        activitiesEventFeedbackService.markRemoved(request, false);
    }

    @PostMapping("/sync")
    public EventDto sync(@RequestBody EventDetailDto request) {
        return activitiesEventsService.sync(request);
    }
}

package com.raxim.myscoutee.domain.feedback.controller;
import java.util.List;
import org.springframework.web.bind.annotation.*;
import com.raxim.myscoutee.domain.access.api.RequiresPolicy;
import com.raxim.myscoutee.domain.access.api.AccessPolicyKeys;
import com.raxim.myscoutee.domain.feedback.dto.FeedbackDtos.*;
import com.raxim.myscoutee.domain.feedback.service.FeedbackService;
@RestController
@RequestMapping("/feedback")
public class FeedbackController {
    @org.springframework.beans.factory.annotation.Autowired
    private com.raxim.myscoutee.domain.feedback.service.FeedbackEvaluationService evaluations;
    @org.springframework.beans.factory.annotation.Autowired
    private com.raxim.myscoutee.domain.groups.api.CommunityAuthority authority;
    private final FeedbackService feedback;
    public FeedbackController(FeedbackService feedback) { this.feedback=feedback; }
    @GetMapping("")
    public List<FeedbackStateDto> queryFeedback(@RequestParam("userId") String userId) {
        return feedback.queryStates(userId);
    }

    @GetMapping("/received")
    public List<FeedbackReceivedEventDto> queryReceivedFeedback(@RequestParam("userId") String userId) {
        return feedback.queryReceivedEvents(userId);
    }

    @PostMapping("/page")
    public FeedbackPageResultDto loadFeedbackPage(@RequestBody FeedbackPageQueryDto request) {
        return feedback.loadPage(request);
    }

    @PostMapping("/stat")
    public FeedbackStatDto loadFeedbackStat(@RequestBody FeedbackStatQueryDto request) {
        return feedback.loadStatById(request);
    }

    @PostMapping("/detail")
    public FeedbackDetailDto loadFeedbackDetail(@RequestBody FeedbackQueryDto request) {
        return feedback.loadDetail(request);
    }

    @PostMapping("/submit")
    @RequiresPolicy(
            key = AccessPolicyKeys.FEEDBACK_SUBMIT,
            subject = "#request?.userId() ?: #actorUserId",
            resourceId = "#request?.feedback()?.eventId()",
            skipWhenAuthenticationOptional = true)
    public FeedbackDetailDto submitFeedback(@RequestBody FeedbackSubmitRequestDto request) {
        return feedback.submit(request);
    }

    @PostMapping("/note")
    @RequiresPolicy(
            key = AccessPolicyKeys.FEEDBACK_NOTE,
            subject = "#request?.userId() ?: #actorUserId",
            resourceId = "#request?.eventId()",
            skipWhenAuthenticationOptional = true)
    public void saveFeedbackNote(@RequestBody FeedbackNoteRequestDto request) {
        feedback.saveNote(request);
    }

    @PostMapping("/remove")
    @RequiresPolicy(
            key = AccessPolicyKeys.FEEDBACK_REMOVE,
            subject = "#request?.userId() ?: #actorUserId",
            resourceId = "#request?.eventId()",
            skipWhenAuthenticationOptional = true)
    public void removeFeedbackEvent(@RequestBody FeedbackToggleRequestDto request) {
        feedback.markRemoved(request, true);
    }

    @PostMapping("/restore")
    @RequiresPolicy(
            key = AccessPolicyKeys.FEEDBACK_RESTORE,
            subject = "#request?.userId() ?: #actorUserId",
            resourceId = "#request?.eventId()",
            skipWhenAuthenticationOptional = true)
    public void restoreFeedbackEvent(@RequestBody FeedbackToggleRequestDto request) {
        feedback.markRemoved(request, false);
    }

    @PostMapping("/evaluations/{id}") public void feedbackAction(@PathVariable String id, @RequestBody com.raxim.myscoutee.domain.feedback.service.FeedbackEvaluationService.Command command) {
        evaluations.action(authority.actor(command.userId()),id,command);
    }
    @GetMapping("/evaluations/stats/{provider}") public com.raxim.myscoutee.domain.feedback.service.FeedbackEvaluationService.Stats feedbackStats(@RequestParam String userId,@PathVariable String provider) {
        authority.actor(userId); return evaluations.stats(provider);
    }
}

package com.raxim.myscoutee.domain.accounts.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.raxim.myscoutee.domain.accounts.dto.AuthDtos.UserFeedbackSubmitRequestDto;
import com.raxim.myscoutee.domain.accounts.dto.AuthDtos.UserReportUserSubmitRequestDto;
import com.raxim.myscoutee.domain.accounts.dto.AuthDtos.UserSubmitActionResponseDto;
import com.raxim.myscoutee.domain.accounts.service.ModerationSubmissionService;

/** Native submission routes selected with the moderation feature. */
@RestController
@RequestMapping("/auth")
public class ModerationSubmissionController {
    private final ModerationSubmissionService submissions;

    public ModerationSubmissionController(ModerationSubmissionService submissions) {
        this.submissions = submissions;
    }

    @PostMapping("/me/feedback")
    public UserSubmitActionResponseDto submitFeedback(@RequestBody UserFeedbackSubmitRequestDto request) {
        return submissions.submitFeedback(request);
    }

    @PostMapping("/me/report-user")
    public UserSubmitActionResponseDto submitReport(@RequestBody UserReportUserSubmitRequestDto request) {
        return submissions.submitReport(request);
    }
}

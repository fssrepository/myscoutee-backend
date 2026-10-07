package com.raxim.myscoutee.profile.controller.integration;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;

import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.NullAndEmptySource;
import org.junit.jupiter.params.provider.ValueSource;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.server.ResponseStatusException;

import com.raxim.myscoutee.profile.service.*;

class IntegrationDomainControllerTest {
    @ParameterizedTest
    @NullAndEmptySource
    @ValueSource(strings = {"vote", "rate", "feedback", "set-interest", "join", "leave", "decline", "recommend",
            "take-over", "accept-invite", "decline-invite", "offer", "edit-offer", "accept-offer", "reject-offer", "pending-offer"})
    void integrationCannotDelegatePersonalDecisions(String action) {
        var access = mock(IntegrationCapabilitiesService.class);
        var authentication = mock(Authentication.class);
        var campaigns = mock(CampaignsService.class);
        var cases = mock(CommunityCasesService.class);
        var announcements = mock(CommunityAnnouncementsService.class);
        var tasks = mock(CommunityScheduledTasksService.class);
        var services = mock(ServiceOfferingsService.class);
        when(access.requireWrite(authentication, "community")).thenReturn("owner");
        when(access.requireWrite(authentication, "work")).thenReturn("owner");
        var controller = new IntegrationDomainController(access, campaigns, cases, announcements, tasks, services);
        var request = new IntegrationDomainController.Action(action, 1L);
        var caseRequest = new com.raxim.myscoutee.profile.data.dto.community.CommunityCaseDtos.Command(
                "spoofed-actor", action, 1L, null, null, null, null, null, null, null, null, null, null, null, null, null);
        for (Runnable attempt : java.util.List.<Runnable>of(
                () -> controller.caseAction(authentication, "case", caseRequest),
                () -> controller.announcementAction(authentication, "announcement", request),
                () -> controller.campaignAction(authentication, "campaign", request),
                () -> controller.serviceAction(authentication, "service", request),
                () -> controller.scheduledTaskAction(authentication, "task", request))) {
            assertThatThrownBy(attempt::run).isInstanceOfSatisfying(ResponseStatusException.class,
                    error -> org.assertj.core.api.Assertions.assertThat(error.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST));
        }
        verifyNoInteractions(campaigns, cases, announcements, tasks, services);
    }
}

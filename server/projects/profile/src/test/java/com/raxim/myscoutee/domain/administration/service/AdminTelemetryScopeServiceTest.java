package com.raxim.myscoutee.domain.administration.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import com.raxim.myscoutee.domain.accounts.api.ProfileSummaries;
import com.raxim.myscoutee.domain.accounts.document.Users;
import com.raxim.myscoutee.domain.administration.api.AdminTelemetryEvent;

@Tag("standard")
class AdminTelemetryScopeServiceTest {
    @Test
    void baseStatisticsExcludeIndependentWorkspaceActivityEvenWhenTaggedByAJob() {
        var profiles = mock(ProfileSummaries.class);
        var member = profile("private-member", "private-workspace");
        doReturn(List.of(member)).when(profiles).findByUserIdIn(List.of("private-member", "worker"));
        var tags = Map.of("baseGroupId", "myscoutee-work");
        var activity = event("events", member.getUserId(), tags);
        var job = event("jobs", "worker", tags);
        assertThat(new AdminTelemetryScopeService(profiles).baseProfileEvents(List.of(activity, job)))
                .containsOnlyKeys("myscoutee-work").containsEntry("myscoutee-work", List.of(job));
        verify(profiles).findByUserIdIn(List.of("private-member", "worker"));
        verifyNoMoreInteractions(profiles);
    }

    @Test
    void repeatedActorsAreReadOnceForTheWholeBatchAndUnknownActorsStayGlobal() {
        var profiles = mock(ProfileSummaries.class);
        doReturn(List.of(profile("base-member", "myscoutee-work"))).when(profiles)
                .findByUserIdIn(List.of("base-member", "unknown"));
        var memberEvent = event("accounts", "base-member", Map.of());
        var unknownEvent = event("accounts", "unknown", Map.of());
        var emptyActorEvent = event("jobs", "", Map.of());
        var batch = new ArrayList<>(List.of(memberEvent, memberEvent, unknownEvent, emptyActorEvent));
        batch.add(null);
        assertThat(new AdminTelemetryScopeService(profiles).baseProfileEvents(batch))
                .containsOnlyKeys("myscoutee-work", "global")
                .containsEntry("myscoutee-work", List.of(memberEvent, memberEvent))
                .containsEntry("global", List.of(unknownEvent, emptyActorEvent));
        verify(profiles).findByUserIdIn(List.of("base-member", "unknown"));
        verifyNoMoreInteractions(profiles);
    }

    private Users profile(String id, String groupId) {
        var profile = new Users();
        profile.setUserId(id);
        profile.setWorkspaceGroupId(groupId);
        return profile;
    }

    private AdminTelemetryEvent event(String domain, String actor, Map<String, String> tags) {
        return new AdminTelemetryEvent("fixture.event", domain, "entity", actor, 1L,
                "2026-10-05T00:00:00Z", tags);
    }
}

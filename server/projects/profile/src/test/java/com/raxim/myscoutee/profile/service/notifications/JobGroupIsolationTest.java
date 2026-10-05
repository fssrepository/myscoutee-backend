package com.raxim.myscoutee.profile.service.notifications;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;
import static org.mockito.ArgumentMatchers.*;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.FindAndModifyOptions;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.web.server.ResponseStatusException;
import com.raxim.myscoutee.profile.data.document.NotificationRuleConfig;
import com.raxim.myscoutee.profile.repository.NotificationRuleConfigsRepository;
import com.raxim.myscoutee.profile.service.AdminTelemetryService;
import com.raxim.myscoutee.profile.service.JobGroupContext;

class JobGroupIsolationTest {
    private static final String WORK = "myscoutee-work";
    private final NotificationRuleConfigsRepository repository = mock(NotificationRuleConfigsRepository.class);
    private final MongoTemplate mongo = mock(MongoTemplate.class);
    private final NotificationRuleRegistryService service = new NotificationRuleRegistryService(repository,
            mock(AdminNotificationSocketSessionRegistry.class), mongo, mock(AdminTelemetryService.class));

    @Test void workReadsOnlyItsOwnSeedAndCannotCreateTheOmittedRandomJob() {
        var dating = rule(null, "event-random-groups");
        when(repository.findByBaseGroupIdAndRuleKey(null, dating.getRuleKey())).thenReturn(Optional.of(dating));
        when(repository.findByBaseGroupId(WORK)).thenReturn(List.of());
        JobGroupContext.run(WORK, () -> {
            assertThat(service.findRule(dating.getRuleKey())).isEmpty();
            assertThat(service.shouldRunScheduledRule(dating.getRuleKey(), Instant.now())).isFalse();
            assertThatThrownBy(() -> service.saveRules(List.of(dating), "work-admin"))
                    .isInstanceOf(ResponseStatusException.class);
        });
        assertThat(service.findRule(dating.getRuleKey())).contains(dating);
        verify(repository, never()).save(any());
        verifyNoInteractions(mongo);
    }

    @Test void executionClaimsIncludeGroupSoARunningDatingInstanceCannotClaimWork() {
        JobGroupContext.run(WORK, () -> service.beginRun("affinity-recompute", "start", "work-admin"));
        var query = ArgumentCaptor.forClass(Query.class);
        verify(mongo).findAndModify(query.capture(), any(Update.class), any(FindAndModifyOptions.class), eq(NotificationRuleConfig.class));
        String filter = query.getValue().getQueryObject().toJson();
        assertThat(filter).contains("\"baseGroupId\": \"myscoutee-work\"", "\"ruleKey\": \"affinity-recompute\"", "runState.currentStatus");
        assertThat(JobGroupContext.isActive()).isFalse();
    }

    @Test void failureInOneSeededGroupDoesNotSkipTheOtherOrLeakThreadScope() {
        when(repository.findByRuleKeyIn(any())).thenReturn(List.of(rule(WORK, "affinity-recompute"), rule(null, "affinity-recompute")));
        List<String> visited = new ArrayList<>();
        assertThatThrownBy(() -> service.forEachGroup("affinity-recompute", () -> {
            visited.add(JobGroupContext.groupId());
            if (WORK.equals(JobGroupContext.groupId())) throw new IllegalStateException("Work unavailable");
        })).isInstanceOf(IllegalStateException.class);
        assertThat(visited).isEqualTo(Arrays.asList(WORK, null));
        assertThat(JobGroupContext.isActive()).isFalse();
    }

    private NotificationRuleConfig rule(String group, String key) {
        var rule = new NotificationRuleConfig(); rule.setBaseGroupId(group); rule.setRuleKey(key);
        rule.setEnabled(true); rule.setTriggerKind("scheduled_process");
        return rule;
    }
}

package com.raxim.myscoutee.domain.administration.service;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import com.raxim.myscoutee.domain.accounts.api.ProfileSummaries;
import com.raxim.myscoutee.domain.accounts.api.ProfileSummary;
import com.raxim.myscoutee.domain.administration.api.AdminTelemetryEvent;

/** One batched profile read scopes telemetry to base workspaces. */
@Service
public class AdminTelemetryScopeService {
    private final ProfileSummaries usersRepository;
    public AdminTelemetryScopeService(ProfileSummaries usersRepository) {
        this.usersRepository = usersRepository;
    }

    public Map<String, List<AdminTelemetryEvent>> baseProfileEvents(List<AdminTelemetryEvent> batch) {
        var actors = new java.util.HashMap<String, ProfileSummary>();
        usersRepository.findByUserIdIn(batch.stream().filter(java.util.Objects::nonNull)
                .map(AdminTelemetryEvent::actorUserId).filter(StringUtils::hasText).distinct().toList())
                .forEach(user -> actors.put(user.getUserId(), user));
        Map<String, List<AdminTelemetryEvent>> scoped = new LinkedHashMap<>();
        for (var event : batch) {
            if (event == null) continue;
            var actor = actors.get(event.actorUserId());
            String groupId = actor == null ? null : actor.getWorkspaceGroupId();
            // Job summaries belong to their base-group instance. Member activity from an
            // independent workspace remains outside the base-profile statistics.
            if (groupId != null && !com.raxim.myscoutee.domain.groups.api.BaseGroups.isBaseId(groupId)
                    && !"jobs".equals(event.domain())) continue;
            String jobGroup = event.tags() == null ? null : event.tags().get("baseGroupId");
            if (jobGroup != null) {
                scoped.computeIfAbsent(jobGroup, ignored -> new ArrayList<>()).add(event);
                continue;
            }
            scoped.computeIfAbsent(groupId == null ? "global" : groupId, ignored -> new ArrayList<>()).add(event);
        }
        return scoped;
    }
}

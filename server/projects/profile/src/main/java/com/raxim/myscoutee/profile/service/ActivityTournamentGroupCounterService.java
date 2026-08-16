package com.raxim.myscoutee.profile.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.regex.Pattern;

import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.raxim.myscoutee.profile.data.document.ActivityEvent;
import com.raxim.myscoutee.profile.data.document.ActivitySubEventStageRuntime;
import com.raxim.myscoutee.profile.data.document.ActivitySubEventStageRuntime.GroupResourceMetricRecord;
import com.raxim.myscoutee.profile.data.document.SubEventItem;
import com.raxim.myscoutee.profile.repository.ActivityEventsRepository;
import com.raxim.myscoutee.profile.repository.ActivityMembersRepository;
import com.raxim.myscoutee.profile.repository.ActivitySubEventStageRuntimeRepository;

@Service
public class ActivityTournamentGroupCounterService {
    private static final String OWNER_TYPE_GROUP = "group";
    private static final String MEMBER_STATUS_PENDING = "pending";
    private static final String STATUS_DELETED = "D";

    private final ActivityMembersRepository activityMembersRepository;
    private final ActivitySubEventStageRuntimeRepository activitySubEventStageRuntimeRepository;
    private final ActivityEventsRepository activityEventsRepository;

    public ActivityTournamentGroupCounterService(
            ActivityMembersRepository activityMembersRepository,
            ActivitySubEventStageRuntimeRepository activitySubEventStageRuntimeRepository,
            ActivityEventsRepository activityEventsRepository) {
        this.activityMembersRepository = activityMembersRepository;
        this.activitySubEventStageRuntimeRepository = activitySubEventStageRuntimeRepository;
        this.activityEventsRepository = activityEventsRepository;
    }

    public synchronized void syncParent(String eventId, String subEventId) {
        String normalizedEventId = normalizeId(eventId);
        String normalizedSubEventId = normalizeId(subEventId);
        if (!StringUtils.hasText(normalizedEventId) || !StringUtils.hasText(normalizedSubEventId)) {
            return;
        }

        String parentEventId = parentEventId(normalizedEventId);
        String quotedParentEventId = Pattern.quote(parentEventId);
        String quotedSubEventId = Pattern.quote(normalizedSubEventId);
        String groupOwnerPattern = "^" + quotedParentEventId
                + ":(?:" + quotedSubEventId + ":|slot:.*:" + quotedSubEventId + ":)";
        int membersPending = Math.toIntExact(activityMembersRepository
                .countByOwnerPatternAndStatus(
                        OWNER_TYPE_GROUP,
                        groupOwnerPattern,
                        MEMBER_STATUS_PENDING));
        String runtimeOwnerPattern = "^" + quotedParentEventId + "(?:$|:slot:)";
        int resourcesPending = activitySubEventStageRuntimeRepository
                .findByOwnerPatternAndSubEventIdAndStatusNot(
                        runtimeOwnerPattern,
                        normalizedSubEventId,
                        STATUS_DELETED)
                .stream()
                .mapToInt(this::resourcePending)
                .sum();
        int stagePending = Math.addExact(membersPending, resourcesPending);

        List<ActivityEvent> changed = new ArrayList<>();
        for (ActivityEvent event : activityEventsRepository.findBySourceId(parentEventId)) {
            if (event == null || event.getSubEvents() == null) {
                continue;
            }
            boolean stageFound = false;
            List<SubEventItem> subEvents = new ArrayList<>(event.getSubEvents().size());
            for (SubEventItem item : event.getSubEvents()) {
                if (item != null && normalizedSubEventId.equals(normalizeId(item.id()))) {
                    subEvents.add(item.withGroupsPending(stagePending));
                    stageFound = true;
                } else {
                    subEvents.add(item);
                }
            }
            if (!stageFound) {
                continue;
            }
            event.setSubEvents(subEvents);
            event.setActivity(subEvents.stream()
                    .filter(Objects::nonNull)
                    .map(SubEventItem::groupsPending)
                    .mapToInt(this::normalizeCount)
                    .sum());
            changed.add(event);
        }
        if (!changed.isEmpty()) {
            activityEventsRepository.saveAll(changed);
        }
    }

    private int resourcePending(ActivitySubEventStageRuntime runtime) {
        int pending = 0;
        Map<String, Map<String, Map<String, GroupResourceMetricRecord>>> byGroup =
                runtime == null || runtime.getGroupResourceMetricsByAssetOwnerId() == null
                        ? Map.of()
                        : runtime.getGroupResourceMetricsByAssetOwnerId();
        for (Map<String, Map<String, GroupResourceMetricRecord>> byAssetOwner : byGroup.values()) {
            for (Map<String, GroupResourceMetricRecord> metricsByType :
                    byAssetOwner == null ? List.<Map<String, GroupResourceMetricRecord>>of() : byAssetOwner.values()) {
                for (GroupResourceMetricRecord metric :
                        metricsByType == null ? List.<GroupResourceMetricRecord>of() : metricsByType.values()) {
                    pending = Math.addExact(pending, normalizeCount(metric == null ? null : metric.pending()));
                }
            }
        }
        return pending;
    }

    private int normalizeCount(Integer value) {
        return Math.max(0, value == null ? 0 : value);
    }

    private String parentEventId(String eventId) {
        int slotMarker = eventId.indexOf(":slot:");
        return slotMarker > 0 ? eventId.substring(0, slotMarker) : eventId;
    }

    private String normalizeId(String value) {
        return value == null ? "" : value.trim();
    }
}

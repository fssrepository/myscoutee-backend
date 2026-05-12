package com.raxim.myscoutee.profile.service;

import java.util.List;

import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Service;

import com.raxim.myscoutee.common.config.mongo.MongoSessionMode;
import com.raxim.myscoutee.common.config.mongo.MongoSessionModeContext;
import com.raxim.myscoutee.profile.data.document.ActivityEvent;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.SubEventFormItemDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.SubEventGroupItemDto;
import com.raxim.myscoutee.profile.repository.ActivityEventsRepository;

@Service
public class DemoTournamentSeedService implements ApplicationRunner {
    private static final String REVIEW_EVENT_ID = "demo-tournament-start-review";
    private static final String RESULTS_EVENT_ID = "demo-tournament-results";
    private static final String ADMIN_USER_ID = "admin-demo-ava";

    private final ActivityEventsRepository activityEventsRepository;

    public DemoTournamentSeedService(ActivityEventsRepository activityEventsRepository) {
        this.activityEventsRepository = activityEventsRepository;
    }

    @Override
    public void run(ApplicationArguments args) {
        MongoSessionMode previousMode = MongoSessionModeContext.currentMode();
        try {
            MongoSessionModeContext.set(MongoSessionMode.DEMO);
            seedDemoTournament(REVIEW_EVENT_ID, "Demo Tournament Start Gate", true);
            seedDemoTournament(RESULTS_EVENT_ID, "Demo Tournament Results", false);
        } finally {
            MongoSessionModeContext.set(previousMode);
        }
    }

    private void seedDemoTournament(String sourceId, String title, boolean startReview) {
        if (!activityEventsRepository.findBySourceId(sourceId).isEmpty()) {
            return;
        }
        ActivityEvent event = new ActivityEvent();
        String nowIso = "2026-05-12T10:00:00.000Z";
        event.setSourceId(sourceId);
        event.setOwnerUserId(ADMIN_USER_ID);
        event.setCreatorUserId(ADMIN_USER_ID);
        event.setCreatorName("Ava");
        event.setCreatorInitials("AV");
        event.setType("hosting");
        event.setStatus("H");
        event.setPublished(true);
        event.setAutoInviter(startReview);
        event.setTitle(title);
        event.setLocation("Demo Hall");
        event.setStartAtIso("2026-06-05T16:00:00.000Z");
        event.setEndAtIso("2026-06-05T22:00:00.000Z");
        event.setCapacityMin(8);
        event.setCapacityMax(16);
        event.setCapacityTotal(16);
        event.setAcceptedMembers(startReview ? 10 : 16);
        event.setPendingMembers(startReview ? 6 : 0);
        event.setAdmins(List.of(ADMIN_USER_ID, "admin-demo-noel"));
        event.setSubEventsDisplayMode("Tournament");
        event.setSubEvents(startReview ? startReviewStages() : finalizedStages());
        event.setCreatedDate(nowIso);
        event.setCreatedUser("demo-seed");
        event.setUpdatedDate(nowIso);
        event.setUpdatedUser("demo-seed");
        event.normalizeLifecycleState();
        activityEventsRepository.save(event);
    }

    private List<SubEventFormItemDto> startReviewStages() {
        return List.of(
                stage("demo-review-stage-1", "Qualifiers", "RS", "awaiting-tournament-start", null, null, 2, "Score", 2),
                stage("demo-review-stage-2", "Finals", "A", null, null, null, 1, "Score", 0));
    }

    private List<SubEventFormItemDto> finalizedStages() {
        return List.of(
                stage("demo-results-stage-1", "Qualifiers", "F", "stage-finalized", "2026-06-05T18:00:00.000Z", ADMIN_USER_ID, 2, "Fifa", 2),
                stage("demo-results-stage-2", "Finals", "F", "stage-finalized", "2026-06-05T21:30:00.000Z", ADMIN_USER_ID, 1, "Fifa", 0));
    }

    private SubEventFormItemDto stage(
            String id,
            String name,
            String status,
            String reason,
            String finalizedAt,
            String finalizedBy,
            int groupCount,
            String leaderboardType,
            int advancePerGroup) {
        List<SubEventGroupItemDto> groups = groups(id, groupCount);
        return new SubEventFormItemDto(
                id,
                name,
                name + " stage",
                "2026-06-05T16:00:00",
                "2026-06-05T18:00:00",
                "Demo Hall",
                ADMIN_USER_ID,
                groups,
                groups.size(),
                4,
                8,
                leaderboardType,
                advancePerGroup,
                false,
                null,
                4,
                8,
                8,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                null,
                null,
                status,
                reason,
                "2026-06-05T18:00:00.000Z",
                finalizedAt,
                finalizedBy);
    }

    private List<SubEventGroupItemDto> groups(String stageId, int count) {
        return java.util.stream.IntStream.range(0, Math.max(1, count))
                .mapToObj(index -> {
                    String letter = Character.toString((char) ('A' + index));
                    return new SubEventGroupItemDto(stageId + "-group-" + (index + 1), "Group " + letter, 4, 8, "generated");
                })
                .toList();
    }
}

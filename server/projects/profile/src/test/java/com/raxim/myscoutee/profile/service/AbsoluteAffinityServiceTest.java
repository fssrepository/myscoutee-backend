package com.raxim.myscoutee.profile.service;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;

import org.junit.jupiter.api.Test;

import com.raxim.myscoutee.profile.data.document.ActivityEvent;
import com.raxim.myscoutee.profile.data.document.Users;

class AbsoluteAffinityServiceTest {
    private final AbsoluteAffinityService service = new AbsoluteAffinityService(null, null);

    @Test
    void userAffinityChangesWhenProfileImpressionsChange() {
        Users user = user("u1", "Budapest", "runner", 80);

        double baseline = service.resolveUserAffinity(user);

        user.setImpressions(new Users.UserImpressionsRecord(
                new Users.UserImpressionsSectionRecord(
                        0,
                        9.4d,
                        12,
                        8,
                        4,
                        0,
                        List.of("warm host"),
                        List.of("planner"),
                        List.of(new Users.UserPersonalityTraitRecord("reliable", "Reliable", 90, 7, "2026-05-01T10:00:00Z")),
                        List.of("hosting")),
                null));

        assertThat(service.resolveUserAffinity(user)).isGreaterThan(baseline);
    }

    @Test
    void eventAffinityChangesWhenContentOrParticipantAffinityChanges() {
        ActivityEvent event = event("event-1", "Board Games", List.of("games"));
        Users host = user("host", "Budapest", "planner", 80);

        double baseline = service.resolveEventAffinity(event, List.of(host));

        event.setTopics(List.of("games", "hiking", "music"));
        host.setImpressions(new Users.UserImpressionsRecord(
                new Users.UserImpressionsSectionRecord(
                        0,
                        9d,
                        20,
                        12,
                        5,
                        0,
                        List.of("great organizer"),
                        List.of("connector"),
                        List.of(),
                        List.of("host")),
                null));

        assertThat(service.resolveEventAffinity(event, List.of(host))).isGreaterThan(baseline);
    }

    private Users user(String userId, String city, String traitLabel, int completion) {
        Users user = new Users();
        user.setId(userId);
        user.setName(userId);
        user.setAge(30);
        user.setCity(city);
        user.setHeight("175 cm");
        user.setPhysique("active");
        user.setLanguages(List.of("English", "Hungarian"));
        user.setHoroscope("Gemini");
        user.setGender("woman");
        user.setHostTier("local host");
        user.setTraitLabel(traitLabel);
        user.setCompletion(completion);
        return user;
    }

    private ActivityEvent event(String sourceId, String title, List<String> topics) {
        ActivityEvent event = new ActivityEvent();
        event.setSourceId(sourceId);
        event.setTitle(title);
        event.setSubtitle("Evening meetup");
        event.setTopics(topics);
        event.setVisibility("Public");
        event.setBlindMode("Open Event");
        event.setLocation("Budapest");
        event.setCreatorCity("Budapest");
        event.setCreatorGender("woman");
        event.setRating(7.5d);
        event.setAcceptedMembers(4);
        event.setPendingMembers(1);
        event.setCapacityTotal(10);
        return event;
    }
}

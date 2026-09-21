package com.raxim.myscoutee.profile.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyCollection;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.atLeastOnce;
import static org.mockito.Mockito.inOrder;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.bson.Document;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InOrder;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.mongodb.core.MongoTemplate;

import com.mongodb.client.MongoCollection;
import com.mongodb.client.model.BulkWriteOptions;
import com.mongodb.client.model.UpdateOneModel;
import com.mongodb.client.model.WriteModel;
import com.raxim.myscoutee.profile.data.document.AffinityConfig;
import com.raxim.myscoutee.profile.data.document.UserRate;
import com.raxim.myscoutee.profile.data.document.Users;
import com.raxim.myscoutee.profile.data.dto.rates.RatesDtos.ActivityRatePageResponseDto;
import com.raxim.myscoutee.profile.data.dto.rates.RatesDtos.UserRateRecordDto;
import com.raxim.myscoutee.profile.data.dto.rates.RatesDtos.UserRatesSyncRequestDto;
import com.raxim.myscoutee.profile.data.dto.rates.RatesDtos.UserRatesSyncResponseDto;
import com.raxim.myscoutee.profile.repository.AffinityConfigsRepository;
import com.raxim.myscoutee.profile.repository.UserExperienceProfilesRepository;
import com.raxim.myscoutee.profile.repository.UserRatesRepository;
import com.raxim.myscoutee.profile.repository.UsersRepository;
import com.raxim.myscoutee.profile.service.notifications.NotificationOutboxService;
import com.raxim.myscoutee.profile.service.notifications.NotificationOutboxService.NotificationIntent;

@ExtendWith(MockitoExtension.class)
class UserRatesServiceTest {
    @Mock
    private UserRatesRepository userRatesRepository;
    @Mock
    private UsersRepository usersRepository;
    @Mock
    private HomeUserProfileService homeUserProfileService;
    @Mock
    private AffinityConfigsRepository affinityConfigsRepository;
    @Mock
    private UserExperienceProfilesRepository userExperienceProfilesRepository;
    @Mock
    private UserAffinityEdgeService userAffinityEdgeService;
    @Mock
    private MongoTemplate mongoTemplate;
    @Mock
    private AdminTelemetryService adminTelemetryService;
    @Mock
    private NotificationOutboxService notificationOutboxService;
    @Mock
    private MongoCollection<Document> friendshipCollection;

    @Test
    void syncEnqueuesSingleRatingForRelatedUserAfterPersistence() {
        Users owner = user("u1", "Owner", List.of("music"));
        Users related = user("u2", "Related", List.of("music"));
        UserRatesService service = syncService(Map.of("u1", owner, "u2", related), List.of());
        when(userRatesRepository.findBySyncKey("sync-notification-single")).thenReturn(Optional.empty());

        service.sync(new UserRatesSyncRequestDto(List.of(new UserRateRecordDto(
                "sync-notification-single",
                "u1",
                "u2",
                8,
                "single",
                "2026-05-08T10:00:00Z",
                "2026-05-08T10:01:00Z",
                "u1",
                null,
                "given",
                null,
                null,
                null,
                null,
                null,
                null,
                "2026-05-08T10:00:00Z",
                null))));

        UserRate saved = singleSavedRate();
        ArgumentCaptor<NotificationIntent> intentCaptor = ArgumentCaptor.forClass(NotificationIntent.class);
        verify(notificationOutboxService).enqueue(intentCaptor.capture());
        NotificationIntent intent = intentCaptor.getValue();
        assertThat(intent.type()).isEqualTo("user-rated");
        assertThat(intent.entityType()).isEqualTo("user-rate");
        assertThat(intent.entityId()).isEqualTo(saved.getId());
        assertThat(intent.recipientScope()).isEqualTo("rated-users");
        assertThat(intent.recipientUserIds()).containsExactly("u2");
        assertThat(intent.clickUrl()).isEqualTo("/game");
        assertThat(intent.createdUser()).isEqualTo("u1");
        assertThat(intent.payload())
                .containsEntry("rateId", saved.getId())
                .containsEntry("mode", "single")
                .containsEntry("senderUserId", "u1");

        InOrder persistenceOrder = inOrder(userRatesRepository, notificationOutboxService);
        persistenceOrder.verify(userRatesRepository).saveAll(anyList());
        persistenceOrder.verify(notificationOutboxService).enqueue(any(NotificationIntent.class));
    }

    @Test
    void syncEnqueuesPairRatingForBothRatedUsersButNotOwner() {
        Users owner = user("owner", "Owner", List.of("music"));
        Users first = user("u1", "First", List.of("music"));
        Users second = user("u2", "Second", List.of("music"));
        UserRatesService service = syncService(
                Map.of("owner", owner, "u1", first, "u2", second),
                List.of());
        when(userRatesRepository.findBySyncKey("sync-notification-pair")).thenReturn(Optional.empty());

        service.sync(new UserRatesSyncRequestDto(List.of(new UserRateRecordDto(
                "sync-notification-pair",
                "u1",
                "u2",
                7,
                "pair",
                "2026-05-08T10:00:00Z",
                "2026-05-08T10:01:00Z",
                "owner",
                null,
                "given",
                null,
                null,
                null,
                null,
                null,
                null,
                "2026-05-08T10:00:00Z",
                null))));

        ArgumentCaptor<NotificationIntent> intentCaptor = ArgumentCaptor.forClass(NotificationIntent.class);
        verify(notificationOutboxService).enqueue(intentCaptor.capture());
        assertThat(intentCaptor.getValue().recipientUserIds()).containsExactly("u1", "u2");
        assertThat(intentCaptor.getValue().recipientUserIds()).doesNotContain("owner");
    }

    @Test
    void syncDoesNotEnqueueRatingForUnchangedOfflineRetry() {
        Users owner = user("u1", "Owner", List.of("music"));
        Users related = user("u2", "Related", List.of("music"));
        UserRate existing = singleRate("stored-rate-id", "u1", "u2", 8);
        existing.setSyncKey("sync-notification-retry");
        UserRatesService service = syncService(Map.of("u1", owner, "u2", related), List.of());
        when(userRatesRepository.findBySyncKey("sync-notification-retry")).thenReturn(Optional.of(existing));
        when(userRatesRepository.findByOwnerUserIdAndMode("u1", "single")).thenReturn(List.of(existing));

        service.sync(new UserRatesSyncRequestDto(List.of(new UserRateRecordDto(
                "sync-notification-retry",
                "u1",
                "u2",
                8,
                "single",
                "2026-05-08T10:00:00Z",
                "2026-05-08T10:01:00Z",
                "u1",
                null,
                "given",
                null,
                null,
                null,
                null,
                null,
                null,
                "2026-05-08T10:00:00Z",
                null))));

        verify(notificationOutboxService, never()).enqueue(any(NotificationIntent.class));
    }

    @Test
    void sharedSingleRatingShowsBothScoresFromEachViewersPerspective() {
        UserRate record = singleRate("shared-rating", "u2", "u1", 3);
        record.setScoreReceived(4);
        record.setMet(true);
        UserRatesService service = queryService(Map.of(
                "u1", user("u1", "First", List.of("music")),
                "u2", user("u2", "Second", List.of("music"))), List.of(record));

        assertThat(service.queryActivityRatePage("u1", "single", "met", "date", "desc",
                null, false, null, 10, null, null).items()).singleElement().satisfies(item -> {
            assertThat(item.scoreGiven()).isEqualTo(4);
            assertThat(item.scoreReceived()).isEqualTo(3);
            assertThat(item.direction()).isEqualTo("met");
        });
        assertThat(service.queryRateItemsByUser("u2")).singleElement().satisfies(item -> {
            assertThat(item.scoreGiven()).isEqualTo(3);
            assertThat(item.scoreReceived()).isEqualTo(4);
        });
        record.setMet(false);
        assertThat(service.queryRateItemsByUser("u1")).singleElement()
                .satisfies(item -> assertThat(item.direction()).isEqualTo("mutual"));
        record.setScoreReceived(0);
        assertThat(service.queryRateItemsByUser("u1")).singleElement().satisfies(item -> {
            assertThat(item.scoreGiven()).isZero();
            assertThat(item.scoreReceived()).isEqualTo(3);
            assertThat(item.direction()).isEqualTo("received");
        });
    }

    @Test
    void metEvidenceUsesMetOnlyWhileEmptyOrMutuallyRated() {
        UserRate record = singleRate("met-rating", "u2", "u1", 0);
        record.setScoreReceived(0);
        record.setMet(true);
        UserRatesService service = queryService(Map.of(
                "u1", user("u1", "First", List.of("music")),
                "u2", user("u2", "Second", List.of("music"))), List.of(record));

        assertThat(service.queryRateItemsByUser("u1")).singleElement()
                .satisfies(item -> assertThat(item.direction()).isEqualTo("met"));
        assertThat(service.queryRateItemsByUser("u2")).singleElement()
                .satisfies(item -> assertThat(item.direction()).isEqualTo("met"));

        record.setScoreGiven(7);
        assertThat(service.queryRateItemsByUser("u2")).singleElement()
                .satisfies(item -> assertThat(item.direction()).isEqualTo("given"));
        assertThat(service.queryRateItemsByUser("u1")).singleElement()
                .satisfies(item -> assertThat(item.direction()).isEqualTo("received"));

        record.setScoreReceived(8);
        assertThat(service.queryRateItemsByUser("u1")).singleElement()
                .satisfies(item -> assertThat(item.direction()).isEqualTo("met"));
        assertThat(service.queryRateItemsByUser("u2")).singleElement()
                .satisfies(item -> assertThat(item.direction()).isEqualTo("met"));
    }

    @Test
    void syncProjectsConnectionOnlyForMutualMetRate() {
        Users first = user("u1", "First", List.of("music"));
        Users second = user("u2", "Second", List.of("music"));
        UserRate existing = singleRate("event-met-rate", "u1", "u2", 8);
        existing.setScoreReceived(0);
        existing.setMet(true);
        existing.setMetEventId("event-1");
        existing.setEventName("Mingle");
        UserRatesService service = syncService(Map.of("u1", first, "u2", second), List.of(existing));
        when(userRatesRepository.findBySyncKey("event-met-rate")).thenReturn(Optional.of(existing));
        when(mongoTemplate.getCollection("userFriendships")).thenReturn(friendshipCollection);
        List<WriteModel<Document>> writes = new ArrayList<>();
        when(friendshipCollection.bulkWrite(anyList(), any(BulkWriteOptions.class))).thenAnswer(invocation -> {
            writes.addAll(invocation.getArgument(0));
            return null;
        });

        service.sync(new UserRatesSyncRequestDto(List.of(new UserRateRecordDto(
                "event-met-rate",
                "u1",
                "u2",
                7,
                "single",
                "2026-05-08T10:00:00Z",
                "2026-05-08T10:01:00Z",
                "u2",
                null,
                "met",
                null,
                null,
                null,
                7,
                8,
                "Mingle",
                "2026-05-08T10:00:00Z",
                null))));

        assertThat(writes).hasSize(1);
        UpdateOneModel<Document> connection = (UpdateOneModel<Document>) writes.get(0);
        assertThat(connection.getFilter()).isEqualTo(new Document("_id", "2:u1u2"));
        assertThat(connection.getOptions().isUpsert()).isTrue();
        UserRate saved = singleSavedRate();
        assertThat(saved.getMet()).isTrue();
        assertThat(saved.getMutuallyRated()).isTrue();
        assertThat(saved.getMetEventId()).isEqualTo("event-1");
    }

    @Test
    void syncCalculatesBackendOwnedAffinityBeforeSaveAndRecomputesEdges() {
        Users owner = user("u1", "Owner", List.of("music"));
        Users related = user("u2", "Related", List.of("music"));
        Map<String, Users> usersById = Map.of(
                "u1", owner,
                "u2", related);
        UserRate reciprocal = singleRate("reciprocal", "u2", "u1", 1);

        UserRatesService service = syncService(usersById, List.of(reciprocal));
        when(userRatesRepository.findBySyncKey("sync-single")).thenReturn(Optional.empty());

        UserRatesSyncResponseDto response = service.sync(new UserRatesSyncRequestDto(List.of(new UserRateRecordDto(
                "sync-single",
                "u1",
                "u2",
                9,
                "single",
                "2026-05-08T10:00:00Z",
                "2026-05-08T10:01:00Z",
                "u1",
                null,
                "given",
                null,
                null,
                null,
                null,
                10,
                null,
                "2026-05-08T10:00:00Z",
                1200))));

        UserRate saved = singleSavedRate();
        assertThat(response.syncedRateIds()).containsExactly("sync-single");
        assertThat(response.failedRateIds()).isEmpty();
        assertThat(saved.getOwnerUserId()).isEqualTo("u1");
        assertThat(saved.getRelatedUserId()).isEqualTo("u2");
        assertThat(saved.getScoreGiven()).isEqualTo(9);
        assertThat(saved.getScoreReceived()).isEqualTo(1);
        assertThat(saved.getDistanceMetersExact()).isEqualTo(1200);
        assertThat(saved.getMutuallyRated()).isTrue();
        assertThat(saved.getAffinityScore()).isCloseTo(0.18d, org.assertj.core.data.Offset.offset(0.000001d));
        assertThat(saved.getEvidenceConfidence()).isEqualTo(1d);
        verify(userAffinityEdgeService).recomputeForRates(anyList());
    }

    @Test
    void syncReusesNaturalKeyRecordWhenClientSyncKeyChanges() {
        Users owner = user("u1", "Owner", List.of("music"));
        Users related = user("u2", "Related", List.of("music"));
        UserRate existing = singleRate("stored-rate-id", "u1", "u2", 4);
        existing.setSyncKey("old-client-sync-key");
        existing.setCreatedDate("2026-05-01T09:00:00Z");
        existing.setCreatedUser("u1");

        UserRatesService service = syncService(Map.of("u1", owner, "u2", related), List.of());
        when(userRatesRepository.findBySyncKey("new-client-sync-key")).thenReturn(Optional.empty());
        when(userRatesRepository.findByOwnerUserIdAndMode("u1", "single")).thenReturn(List.of(existing));

        service.sync(new UserRatesSyncRequestDto(List.of(new UserRateRecordDto(
                "new-client-sync-key",
                "u1",
                "u2",
                8,
                "single",
                "2026-05-08T10:00:00Z",
                "2026-05-08T10:01:00Z",
                "u1",
                null,
                "given",
                null,
                null,
                null,
                null,
                null,
                null,
                "2026-05-08T10:00:00Z",
                null))));

        UserRate saved = singleSavedRate();
        assertThat(saved.getId()).isEqualTo("stored-rate-id");
        assertThat(saved.getSyncKey()).isEqualTo("new-client-sync-key");
        assertThat(saved.getCreatedDate()).isEqualTo("2026-05-01T09:00:00Z");
        assertThat(saved.getCreatedUser()).isEqualTo("u1");
        assertThat(saved.getScoreGiven()).isEqualTo(8);
    }

    @Test
    void syncPrefersNaturalKeyWhenClientSyncKeyBelongsToAnotherRate() {
        Users owner = user("u1", "Owner", List.of("music"));
        Users related = user("u2", "Related", List.of("music"));
        Users staleTarget = user("u3", "Stale target", List.of("music"));
        UserRate natural = singleRate("natural-rate-id", "u1", "u2", 4);
        natural.setSyncKey("natural-client-key");
        UserRate staleSyncKey = singleRate("stale-sync-rate-id", "u1", "u3", 2);
        staleSyncKey.setSyncKey("reused-client-key");

        UserRatesService service = syncService(
                Map.of("u1", owner, "u2", related, "u3", staleTarget),
                List.of());
        when(userRatesRepository.findBySyncKey("reused-client-key")).thenReturn(Optional.of(staleSyncKey));
        when(userRatesRepository.findByOwnerUserIdAndMode("u1", "single")).thenReturn(List.of(natural, staleSyncKey));

        service.sync(new UserRatesSyncRequestDto(List.of(new UserRateRecordDto(
                "reused-client-key",
                "u1",
                "u2",
                9,
                "single",
                "2026-05-08T10:00:00Z",
                "2026-05-08T10:01:00Z",
                "u1",
                null,
                "given",
                null,
                null,
                null,
                null,
                null,
                null,
                "2026-05-08T10:00:00Z",
                null))));

        UserRate saved = singleSavedRate();
        assertThat(saved.getId()).isEqualTo("natural-rate-id");
        assertThat(saved.getSyncKey()).isEqualTo("natural-client-key");
        assertThat(saved.getRelatedUserId()).isEqualTo("u2");
        assertThat(saved.getScoreGiven()).isEqualTo(9);
    }

    @Test
    void syncKeepsFriendsInCommonOnSingleRatesOnlyAndInsideNetworkOnPairRatesOnly() {
        Users owner = user("owner", "Owner", List.of("music"));
        Users friend = user("friend", "Friend", List.of("music"));
        Users first = user("u1", "First", List.of("music"));
        Users second = user("u2", "Second", List.of("music"));
        Users third = user("u3", "Third", List.of("music"));
        Map<String, Users> usersById = Map.of(
                "owner", owner,
                "friend", friend,
                "u1", first,
                "u2", second,
                "u3", third);

        UserRatesService service = syncService(usersById, List.of());
        when(userRatesRepository.findBySyncKey(anyString())).thenReturn(Optional.empty());

        service.sync(new UserRatesSyncRequestDto(List.of(
                new UserRateRecordDto(
                        "sync-friends-single",
                        "owner",
                        "u1",
                        7,
                        "single",
                        "2026-05-08T10:00:00Z",
                        "2026-05-08T10:01:00Z",
                        "owner",
                        null,
                        "given",
                        "friends-in-common",
                        "friend",
                        2,
                        null,
                        null,
                        null,
                        "2026-05-08T10:00:00Z",
                        null),
                new UserRateRecordDto(
                        "sync-inside-pair",
                        "u1",
                        "u2",
                        8,
                        "pair",
                        "2026-05-08T10:00:00Z",
                        "2026-05-08T10:01:00Z",
                        "owner",
                        null,
                        "given",
                        "separated-friends",
                        "friend",
                        2,
                        null,
                        null,
                        null,
                        "2026-05-08T10:00:00Z",
                        null),
                new UserRateRecordDto(
                        "sync-wrong-pair-social",
                        "u1",
                        "u3",
                        8,
                        "pair",
                        "2026-05-08T10:00:00Z",
                        "2026-05-08T10:01:00Z",
                        "owner",
                        null,
                        "given",
                        "friends-in-common",
                        "friend",
                        2,
                        null,
                        null,
                        null,
                        "2026-05-08T10:00:00Z",
                        null))));

        List<UserRate> savedRates = savedRates();
        UserRate friendsSingle = bySyncKey(savedRates, "sync-friends-single");
        UserRate insidePair = bySyncKey(savedRates, "sync-inside-pair");
        UserRate wrongPairSocial = bySyncKey(savedRates, "sync-wrong-pair-social");

        assertThat(friendsSingle.getMode()).isEqualTo("single");
        assertThat(friendsSingle.getSocialContext()).isEqualTo("friends-in-common");
        assertThat(friendsSingle.getBridgeUserId()).isEqualTo("friend");
        assertThat(friendsSingle.getBridgeCount()).isEqualTo(2);
        assertThat(insidePair.getMode()).isEqualTo("pair");
        assertThat(insidePair.getSocialContext()).isEqualTo("separated-friends");
        assertThat(insidePair.getBridgeUserId()).isNull();
        assertThat(insidePair.getMutuallyRated()).isFalse();
        assertThat(insidePair.getAffinityScore()).isNotNull();
        assertThat(insidePair.getEvidenceConfidence()).isEqualTo(1d);
        assertThat(wrongPairSocial.getSocialContext()).isNull();
        assertThat(wrongPairSocial.getMutuallyRated()).isFalse();
        assertThat(wrongPairSocial.getAffinityScore()).isNotNull();
    }

    @Test
    void syncWritesViewerPairExclusionsToParentProjection() {
        Users owner = user("owner", "Owner", List.of("music"));
        Users first = user("u1", "First", List.of("music"));
        Users second = user("u2", "Second", List.of("music"));
        UserRate projectedRate = pairRate("projected", "owner", "u1", "u2", 8, "separated-friends");
        UserRatesService service = syncService(
                Map.of("owner", owner, "u1", first, "u2", second),
                List.of());
        when(userRatesRepository.findBySyncKey("sync-pair")).thenReturn(Optional.empty());
        when(userRatesRepository.findHomeGameRateProjectionsByOwnerUserIdIn(anyCollection()))
                .thenReturn(List.of(projectedRate));

        service.sync(new UserRatesSyncRequestDto(List.of(new UserRateRecordDto(
                "sync-pair",
                "u1",
                "u2",
                8,
                "pair",
                "2026-05-08T10:00:00Z",
                "2026-05-08T10:01:00Z",
                "owner",
                null,
                "given",
                "separated-friends",
                null,
                2,
                null,
                null,
                null,
                "2026-05-08T10:00:00Z",
                null))));

        ArgumentCaptor<org.springframework.data.mongodb.core.query.Query> queryCaptor =
                ArgumentCaptor.forClass(org.springframework.data.mongodb.core.query.Query.class);
        ArgumentCaptor<org.springframework.data.mongodb.core.query.Update> updateCaptor =
                ArgumentCaptor.forClass(org.springframework.data.mongodb.core.query.Update.class);
        verify(mongoTemplate, atLeastOnce()).updateFirst(
                queryCaptor.capture(),
                updateCaptor.capture(),
                eq(Users.class));

        int projectionUpdateIndex = -1;
        for (int index = 0; index < updateCaptor.getAllValues().size(); index += 1) {
            org.bson.Document setFields = (org.bson.Document) updateCaptor.getAllValues()
                    .get(index)
                    .getUpdateObject()
                    .get("$set");
            if (setFields != null && setFields.containsKey("homeGameRatedPairKeys")) {
                projectionUpdateIndex = index;
                assertThat(setFields.getList("homeGameRatedUserIds", String.class))
                        .containsExactly("u1", "u2");
                assertThat(setFields.getList("homeGameRatedPairKeys", String.class))
                        .containsExactly("u1:u2");
                assertThat(setFields.getInteger("homeGameRateProjectionVersion"))
                        .isEqualTo(HomeUserProfileService.HOME_GAME_RATE_PROJECTION_VERSION);
            }
        }
        assertThat(projectionUpdateIndex).isNotNegative();
        assertThat(queryCaptor.getAllValues().get(projectionUpdateIndex).getQueryObject().getString("userId"))
                .isEqualTo("owner");
        @SuppressWarnings("unchecked")
        ArgumentCaptor<Collection<String>> evictedUserIdsCaptor =
                ArgumentCaptor.forClass(Collection.class);
        verify(homeUserProfileService).evictUserReadCaches(evictedUserIdsCaptor.capture());
        assertThat(evictedUserIdsCaptor.getValue()).contains("owner", "u1", "u2");
    }

    @Test
    void activityRatePageHidesPairWhenAnyParticipantIsBlockedOrInactive() {
        Users owner = user("owner", "Owner", List.of("music"));
        Users visibleUser = user("u1", "Visible", List.of("music"));
        Users hiddenUser = user("u2", "Hidden", List.of("music"));
        hiddenUser.setProfileStatus("blocked");
        Map<String, Users> usersById = Map.of(
                "owner", owner,
                "u1", visibleUser,
                "u2", hiddenUser);

        UserRate pair = pairRate("pair", "owner", "u1", "u2", 8, null);
        UserRatesService service = queryService(usersById, List.of(pair));

        ActivityRatePageResponseDto page = service.queryActivityRatePage(
                "owner",
                "pair",
                "given",
                "happenedAt",
                "desc",
                null,
                false,
                null,
                20,
                null,
                null);

        assertThat(page.items()).isEmpty();
        assertThat(page.total()).isZero();
    }

    @Test
    void activityRateRelevanceSortUsesHarmonicMutualScore() {
        Users owner = user("owner", "Owner", List.of("music"));
        Users balancedUser = user("balanced", "Balanced", List.of("music"));
        Users imbalancedUser = user("imbalanced", "Imbalanced", List.of("music"));
        Map<String, Users> usersById = Map.of(
                "owner", owner,
                "balanced", balancedUser,
                "imbalanced", imbalancedUser);

        UserRate balanced = singleStoredRate("balanced-rate", "owner", "balanced", 5, 5, "2026-05-08T10:00:00Z");
        UserRate imbalanced = singleStoredRate("imbalanced-rate", "owner", "imbalanced", 9, 1, "2026-05-08T11:00:00Z");
        UserRatesService service = queryService(usersById, List.of(imbalanced, balanced));

        ActivityRatePageResponseDto page = service.queryActivityRatePage(
                "owner",
                "single",
                "mutual",
                "relevance",
                null,
                "relevant",
                false,
                null,
                20,
                null,
                null);

        assertThat(page.items()).extracting(item -> item.id())
                .containsExactly("balanced-rate", "imbalanced-rate");
    }

    @Test
    void activityRateDistanceViewOrdersBucketsThenRelevanceThenExactDistance() {
        Users owner = user("owner", "Owner", List.of("music"));
        Users nearLowUser = user("near-low-user", "Near Low", List.of("music"));
        Users nearHighUser = user("near-high-user", "Near High", List.of("music"));
        Users farHighUser = user("far-high-user", "Far High", List.of("music"));
        Map<String, Users> usersById = Map.of(
                "owner", owner,
                "near-low-user", nearLowUser,
                "near-high-user", nearHighUser,
                "far-high-user", farHighUser);

        UserRate nearLow = singleStoredRate("z-near-low", "owner", "near-low-user", 4, 0, "2026-05-08T10:00:00Z");
        nearLow.setDistanceMetersExact(2_000);
        UserRate nearHigh = singleStoredRate("a-near-high", "owner", "near-high-user", 9, 0, "2026-05-08T09:00:00Z");
        nearHigh.setDistanceMetersExact(4_000);
        UserRate farHigh = singleStoredRate("far-high", "owner", "far-high-user", 10, 0, "2026-05-08T11:00:00Z");
        farHigh.setDistanceMetersExact(6_000);
        UserRatesService service = queryService(usersById, List.of(nearLow, farHigh, nearHigh));

        ActivityRatePageResponseDto page = service.queryActivityRatePage(
                "owner",
                "single",
                "given",
                "distance",
                null,
                "relevant",
                false,
                null,
                20,
                null,
                null);

        assertThat(page.items()).extracting(item -> item.id())
                .containsExactly("a-near-high", "z-near-low", "far-high");
        assertThat(page.items()).extracting(item -> item.distanceMetersExact())
                .containsExactly(4_000, 2_000, 6_000);
    }

    private UserRatesService syncService(Map<String, Users> usersById, List<UserRate> contextRates) {
        AffinityConfig config = AffinityConfig.defaults();
        config.setProfileRules(List.of());
        config.setImpressionRules(List.of());
        when(affinityConfigsRepository.findFirstByActiveTrueOrderByVersionDesc()).thenReturn(Optional.of(config));
        when(userRatesRepository.findRelevantByUserIds(anyList())).thenReturn(contextRates);
        when(userExperienceProfilesRepository.findByUserIdIn(anyCollection())).thenReturn(List.of());
        when(userRatesRepository.saveAll(anyList())).thenAnswer(invocation -> List.copyOf(invocation.getArgument(0)));
        stubUsers(usersById);
        AffinityCalculationService affinityCalculationService = new AffinityCalculationService(
                affinityConfigsRepository,
                usersRepository,
                userRatesRepository,
                userExperienceProfilesRepository);
        return new UserRatesService(
                userRatesRepository,
                usersRepository,
                homeUserProfileService,
                affinityCalculationService,
                userAffinityEdgeService,
                mongoTemplate,
                adminTelemetryService,
                null,
                notificationOutboxService);
    }

    private UserRatesService queryService(Map<String, Users> usersById, List<UserRate> records) {
        when(userRatesRepository.findRelevantByUserIds(anyList())).thenReturn(records);
        when(homeUserProfileService.queryUsersByIds(anyCollection())).thenReturn(List.of());
        when(homeUserProfileService.isActivityRateVisibleUser(any(Users.class))).thenAnswer(invocation -> {
            Users user = invocation.getArgument(0);
            return user != null && !"blocked".equals(user.getProfileStatus()) && !"inactive".equals(user.getProfileStatus());
        });
        stubUsers(usersById);
        return new UserRatesService(
                userRatesRepository,
                usersRepository,
                homeUserProfileService,
                new AffinityCalculationService(
                        affinityConfigsRepository,
                        usersRepository,
                        userRatesRepository,
                userExperienceProfilesRepository),
                userAffinityEdgeService,
                mongoTemplate,
                adminTelemetryService);
    }

    private void stubUsers(Map<String, Users> usersById) {
        when(homeUserProfileService.resolveCurrentUser(anyString())).thenAnswer(invocation ->
                usersById.get(invocation.getArgument(0)));
        lenient().when(usersRepository.findByUserId(anyString())).thenAnswer(invocation ->
                Optional.ofNullable(usersById.get(invocation.getArgument(0))));
        when(usersRepository.findByUserIdIn(anyCollection())).thenAnswer(invocation -> {
            Collection<String> requestedIds = invocation.getArgument(0);
            return requestedIds.stream()
                    .map(usersById::get)
                    .filter(java.util.Objects::nonNull)
                    .toList();
        });
    }

    private UserRate singleSavedRate() {
        return savedRates().get(0);
    }

    @SuppressWarnings("unchecked")
    private List<UserRate> savedRates() {
        ArgumentCaptor<List<UserRate>> ratesCaptor = ArgumentCaptor.forClass(List.class);
        verify(userRatesRepository).saveAll(ratesCaptor.capture());
        return new ArrayList<>(ratesCaptor.getValue());
    }

    private UserRate bySyncKey(List<UserRate> rates, String syncKey) {
        return rates.stream()
                .filter(rate -> syncKey.equals(rate.getSyncKey()))
                .findFirst()
                .orElseThrow();
    }

    private UserRate singleRate(String id, String ownerUserId, String relatedUserId, int scoreGiven) {
        UserRate rate = new UserRate();
        rate.setId(id);
        rate.setSyncKey(id);
        rate.setMode("single");
        rate.setOwnerUserId(ownerUserId);
        rate.setRelatedUserId(relatedUserId);
        rate.setScoreGiven(scoreGiven);
        rate.setUpdatedDate("2026-05-08T09:00:00Z");
        return rate;
    }

    private UserRate singleStoredRate(
            String id,
            String ownerUserId,
            String relatedUserId,
            int scoreGiven,
            int scoreReceived,
            String happenedAt) {
        UserRate rate = singleRate(id, ownerUserId, relatedUserId, scoreGiven);
        rate.setScoreReceived(scoreReceived);
        rate.setCreatedDate(happenedAt);
        rate.setUpdatedDate(happenedAt);
        return rate;
    }

    private UserRate pairRate(
            String id,
            String ownerUserId,
            String relatedUserId,
            String secondaryRelatedUserId,
            int scoreGiven,
            String socialContext) {
        UserRate rate = new UserRate();
        rate.setId(id);
        rate.setSyncKey(id);
        rate.setMode("pair");
        rate.setOwnerUserId(ownerUserId);
        rate.setRelatedUserId(relatedUserId);
        rate.setSecondaryRelatedUserId(secondaryRelatedUserId);
        rate.setScoreGiven(scoreGiven);
        rate.setSocialContext(socialContext);
        rate.setCreatedDate("2026-05-08T10:00:00Z");
        rate.setUpdatedDate("2026-05-08T10:01:00Z");
        return rate;
    }

    private Users user(String userId, String name, List<String> languages) {
        Users user = new Users();
        user.setId(userId);
        user.setName(name);
        user.setLanguages(languages);
        return user;
    }
}

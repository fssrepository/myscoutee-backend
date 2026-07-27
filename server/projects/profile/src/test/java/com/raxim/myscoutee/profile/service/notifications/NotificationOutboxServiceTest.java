package com.raxim.myscoutee.profile.service.notifications;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyCollection;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.beans.factory.ObjectProvider;

import com.raxim.myscoutee.profile.data.document.NotificationOutboxItem;
import com.raxim.myscoutee.profile.repository.NotificationOutboxRepository;
import com.raxim.myscoutee.profile.service.PlatformParametersService;
import com.raxim.myscoutee.profile.service.notifications.NotificationOutboxService.NotificationIntent;

class NotificationOutboxServiceTest {
    @Test
    void enqueueCollapsesPendingMessagesAndMergesRecipients() {
        NotificationOutboxRepository repository = org.mockito.Mockito.mock(NotificationOutboxRepository.class);
        NotificationOutboxItem existing = new NotificationOutboxItem();
        existing.setId("n-1");
        existing.setStatus(NotificationOutboxItem.STATUS_PENDING);
        existing.setRecipientUserIds(List.of("u1"));
        existing.setNextRetryAt("2026-05-11T12:00:00Z");
        when(repository.findFirstByCollapseKeyAndStatusInAndCreatedDateGreaterThanEqualOrderByCreatedDateAsc(anyString(), anyCollection(), anyString()))
                .thenReturn(Optional.of(existing));
        when(repository.save(any(NotificationOutboxItem.class))).thenAnswer(invocation -> invocation.getArgument(0));

        NotificationOutboxService service = new NotificationOutboxService(repository);

        service.enqueue(new NotificationIntent(
                "asset-review",
                "asset",
                "asset-1",
                "asset-active-managers",
                List.of("u1", "u2", "u2"),
                "Asset needs review",
                "Asset needs review.",
                "/game",
                "/asset.webp",
                "/badge.webp",
                "asset-review-asset-1",
                Map.of("assetId", "asset-1"),
                "worker"));

        ArgumentCaptor<NotificationOutboxItem> savedItem = ArgumentCaptor.forClass(NotificationOutboxItem.class);
        verify(repository).save(savedItem.capture());
        assertThat(savedItem.getValue().getRecipientUserIds()).containsExactly("u1", "u2");
        assertThat(savedItem.getValue().getStatus()).isEqualTo(NotificationOutboxItem.STATUS_PENDING);
    }

    @Test
    void enqueueSkipsEmptyRecipients() {
        NotificationOutboxRepository repository = org.mockito.Mockito.mock(NotificationOutboxRepository.class);
        NotificationOutboxService service = new NotificationOutboxService(repository);

        Optional<NotificationOutboxItem> result = service.enqueue(new NotificationIntent(
                "asset-review",
                "asset",
                "asset-1",
                "asset-active-managers",
                List.of(" "),
                "Asset needs review",
                "Asset needs review.",
                "/game",
                null,
                null,
                null,
                Map.of(),
                "worker"));

        assertThat(result).isEmpty();
        verify(repository, never()).save(any(NotificationOutboxItem.class));
    }

    @Test
    void enqueueUsesDirectDeliveryBelowMulticastThreshold() {
        NotificationOutboxRepository repository = org.mockito.Mockito.mock(NotificationOutboxRepository.class);
        when(repository.findFirstByCollapseKeyAndStatusInAndCreatedDateGreaterThanEqualOrderByCreatedDateAsc(anyString(), anyCollection(), anyString()))
                .thenReturn(Optional.empty());
        when(repository.save(any(NotificationOutboxItem.class))).thenAnswer(invocation -> invocation.getArgument(0));
        PlatformParametersService parameters = org.mockito.Mockito.mock(PlatformParametersService.class);
        when(parameters.notificationMulticastThreshold(3)).thenReturn(3);
        NotificationOutboxService service = new NotificationOutboxService(repository, null, parameters);

        service.enqueue(intent(List.of("u1", "u2"), Map.of()));

        ArgumentCaptor<NotificationOutboxItem> savedItem = ArgumentCaptor.forClass(NotificationOutboxItem.class);
        verify(repository).save(savedItem.capture());
        assertThat(savedItem.getValue().getDeliveryStrategy()).isEqualTo("direct");
    }

    @Test
    void enqueueUsesMulticastDeliveryAtMulticastThreshold() {
        NotificationOutboxRepository repository = org.mockito.Mockito.mock(NotificationOutboxRepository.class);
        when(repository.findFirstByCollapseKeyAndStatusInAndCreatedDateGreaterThanEqualOrderByCreatedDateAsc(anyString(), anyCollection(), anyString()))
                .thenReturn(Optional.empty());
        when(repository.save(any(NotificationOutboxItem.class))).thenAnswer(invocation -> invocation.getArgument(0));
        PlatformParametersService parameters = org.mockito.Mockito.mock(PlatformParametersService.class);
        when(parameters.notificationMulticastThreshold(3)).thenReturn(3);
        NotificationOutboxService service = new NotificationOutboxService(repository, null, parameters);

        service.enqueue(intent(List.of("u1", "u2", "u3"), Map.of()));

        ArgumentCaptor<NotificationOutboxItem> savedItem = ArgumentCaptor.forClass(NotificationOutboxItem.class);
        verify(repository).save(savedItem.capture());
        assertThat(savedItem.getValue().getDeliveryStrategy()).isEqualTo("multicast");
    }

    @Test
    void enqueuePayloadMulticastThresholdOverridesConfig() {
        NotificationOutboxRepository repository = org.mockito.Mockito.mock(NotificationOutboxRepository.class);
        when(repository.findFirstByCollapseKeyAndStatusInAndCreatedDateGreaterThanEqualOrderByCreatedDateAsc(anyString(), anyCollection(), anyString()))
                .thenReturn(Optional.empty());
        when(repository.save(any(NotificationOutboxItem.class))).thenAnswer(invocation -> invocation.getArgument(0));
        PlatformParametersService parameters = org.mockito.Mockito.mock(PlatformParametersService.class);
        when(parameters.notificationMulticastThreshold(3)).thenReturn(10);
        NotificationOutboxService service = new NotificationOutboxService(repository, null, parameters);

        service.enqueue(intent(List.of("u1", "u2"), Map.of("multicastThreshold", "2")));

        ArgumentCaptor<NotificationOutboxItem> savedItem = ArgumentCaptor.forClass(NotificationOutboxItem.class);
        verify(repository).save(savedItem.capture());
        assertThat(savedItem.getValue().getDeliveryStrategy()).isEqualTo("multicast");
    }

    @Test
    void enqueueUpgradesCollapsedDirectItemToMulticastAfterRecipientMerge() {
        NotificationOutboxRepository repository = org.mockito.Mockito.mock(NotificationOutboxRepository.class);
        NotificationOutboxItem existing = new NotificationOutboxItem();
        existing.setId("n-1");
        existing.setStatus(NotificationOutboxItem.STATUS_PENDING);
        existing.setDeliveryStrategy("direct");
        existing.setRecipientUserIds(List.of("u1", "u2"));
        existing.setPayload(Map.of());
        when(repository.findFirstByCollapseKeyAndStatusInAndCreatedDateGreaterThanEqualOrderByCreatedDateAsc(anyString(), anyCollection(), anyString()))
                .thenReturn(Optional.of(existing));
        when(repository.save(any(NotificationOutboxItem.class))).thenAnswer(invocation -> invocation.getArgument(0));
        PlatformParametersService parameters = org.mockito.Mockito.mock(PlatformParametersService.class);
        when(parameters.notificationMulticastThreshold(3)).thenReturn(3);
        NotificationOutboxService service = new NotificationOutboxService(repository, null, parameters);

        service.enqueue(intent(List.of("u3"), Map.of()));

        ArgumentCaptor<NotificationOutboxItem> savedItem = ArgumentCaptor.forClass(NotificationOutboxItem.class);
        verify(repository).save(savedItem.capture());
        assertThat(savedItem.getValue().getRecipientUserIds()).containsExactly("u1", "u2", "u3");
        assertThat(savedItem.getValue().getDeliveryStrategy()).isEqualTo("multicast");
    }

    @Test
    void enqueueMaterializesTheSavedOutboxItemIntoTheUserInbox() {
        NotificationOutboxRepository repository = org.mockito.Mockito.mock(NotificationOutboxRepository.class);
        when(repository.findFirstByCollapseKeyAndStatusInAndCreatedDateGreaterThanEqualOrderByCreatedDateAsc(
                anyString(),
                anyCollection(),
                anyString())).thenReturn(Optional.empty());
        when(repository.save(any(NotificationOutboxItem.class))).thenAnswer(invocation -> invocation.getArgument(0));
        UserNotificationService userNotificationService = org.mockito.Mockito.mock(UserNotificationService.class);
        @SuppressWarnings("unchecked")
        ObjectProvider<UserNotificationService> provider = org.mockito.Mockito.mock(ObjectProvider.class);
        when(provider.getIfAvailable()).thenReturn(userNotificationService);
        NotificationOutboxService service = new NotificationOutboxService(
                repository,
                null,
                null,
                null,
                provider);

        NotificationOutboxItem saved = service.enqueue(intent(List.of("u1"), Map.of())).orElseThrow();

        verify(userNotificationService).materialize(saved);
    }

    private NotificationIntent intent(List<String> recipientUserIds, Map<String, String> payload) {
        return new NotificationIntent(
                "asset-review",
                "asset",
                "asset-1",
                "asset-active-managers",
                recipientUserIds,
                "Asset needs review",
                "Asset needs review.",
                "/game",
                "/asset.webp",
                "/badge.webp",
                "asset-review-asset-1",
                payload,
                "worker");
    }
}

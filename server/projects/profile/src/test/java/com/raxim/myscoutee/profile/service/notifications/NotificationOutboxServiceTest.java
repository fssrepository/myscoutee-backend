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

import com.raxim.myscoutee.profile.data.document.NotificationOutboxItem;
import com.raxim.myscoutee.profile.repository.NotificationOutboxRepository;
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
}

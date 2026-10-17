package com.raxim.myscoutee.domain.community.service;

import com.raxim.myscoutee.domain.accounts.api.*;
import com.raxim.myscoutee.domain.community.document.ServiceOffering;
import com.raxim.myscoutee.domain.community.dto.ServiceOfferingDtos.Command;
import com.raxim.myscoutee.domain.community.repository.ServiceOfferingsRepository;
import com.raxim.myscoutee.domain.events.api.CommunityMemberships;
import com.raxim.myscoutee.domain.groups.api.*;
import java.util.*;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;
import static org.mockito.ArgumentMatchers.*;

@org.junit.jupiter.api.Tag("standard")
class ServiceOfferingsServiceTest {
    @org.junit.jupiter.api.Test
    void emptyDiscoveryUsesPersistedCommunityProfileAndItsRatingIdentity() {
        var records = mock(ServiceOfferingsRepository.class);
        var profiles = mock(DiscoveryProfiles.class);
        var ratings = mock(com.raxim.myscoutee.domain.affinity.api.AccountRatings.class);
        var service = new ServiceOfferingsService(records, mock(CommunityAuthority.class), profiles,
                ratings, mock(CommunityMemberships.class));
        var profile = mock(DiscoveryProfile.class);
        when(profile.getUserId()).thenReturn("group-persisted-profile-uuid");
        doReturn(List.of(profile)).when(profiles).findByWorkspaceGroupIdAndAccountUserIdIn(
                eq(BaseGroups.COMMUNITY_BASE_ID), eq(List.of("account")));
        when(records.findByBaseGroupIdAndStatus(BaseGroups.COMMUNITY_BASE_ID, "published")).thenReturn(List.of());

        var page = service.page("account", "discover", "published", null, null, null, 10, null);

        assertThat(page.items()).isEmpty();
        assertThat(page.total()).isZero();
        verify(ratings).scoresGiven("group-persisted-profile-uuid");
        verify(profiles, never()).findByUserId(anyString());
    }

    @ParameterizedTest
    @CsvSource({"publish,draft,published", "unpublish,published,draft", "trash,published,trash", "restore,trash,draft"})
    void lifecycleUsesCurrentRecordAndRetainsPersistenceAndOwnershipGuards(String action, String status, String expected) {
        var records = mock(ServiceOfferingsRepository.class);
        var profiles = mock(DiscoveryProfiles.class);
        var service = new ServiceOfferingsService(records, mock(CommunityAuthority.class), profiles,
                mock(com.raxim.myscoutee.domain.affinity.api.AccountRatings.class), mock(CommunityMemberships.class));
        var current = new ServiceOffering("service", BaseGroups.COMMUNITY_BASE_ID, "owner", "Current title", "Current description", "maintenance", List.of(),
                null, List.of(), List.of("owner"), false, null, null, "One-time", 60, List.of(), null, status, "created", "updated", 6L, "");
        when(records.findById("service")).thenReturn(Optional.of(current));
        when(records.save(any())).thenAnswer(call -> call.getArgument(0));
        var profile = mock(DiscoveryProfile.class);
        when(profile.getUserId()).thenReturn("group:owner");
        doReturn(List.of(profile)).when(profiles).findByWorkspaceGroupIdAndAccountUserIdIn(
                eq(BaseGroups.COMMUNITY_BASE_ID), eq(List.of("owner")));
        var command = new Command("owner", action, 0L);
        var result = service.action("owner", "service", command);
        assertThat(result.service().status()).isEqualTo(expected);
        assertThat(result.service().title()).isEqualTo(current.title());
        verify(records).save(argThat(s -> s.version().equals(6L)));
        assertThatThrownBy(() -> service.action("outsider", "service", command)).isInstanceOf(org.springframework.web.server.ResponseStatusException.class);
        var invalid = new Command("owner", "draft".equals(status) ? "restore" : "publish", 0L);
        assertThatThrownBy(() -> service.action("owner", "service", invalid)).isInstanceOf(org.springframework.web.server.ResponseStatusException.class);
        when(records.save(any())).thenThrow(new org.springframework.dao.OptimisticLockingFailureException("concurrent writer"));
        assertThatThrownBy(() -> service.action("owner", "service", command))
                .isInstanceOfSatisfying(org.springframework.web.server.ResponseStatusException.class, e -> assertThat(e.getStatusCode().value()).isEqualTo(409));
    }
}

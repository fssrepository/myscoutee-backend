package com.raxim.myscoutee.domain.assets.document;

import com.raxim.myscoutee.domain.assets.service.AssetsService;
import com.raxim.myscoutee.domain.events.service.ActivitiesMembersService;
import com.raxim.myscoutee.domain.events.service.ActivitiesResourcesService;
import com.raxim.myscoutee.domain.events.service.ActivityTournamentGroupCounterService;
import com.raxim.myscoutee.domain.events.service.EventSlotReadModelService;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import java.util.List;
import java.util.Map;
import java.util.Set;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.web.server.ResponseStatusException;

import com.raxim.myscoutee.domain.events.document.ActivitySubEventResource;
import com.raxim.myscoutee.domain.events.document.ActivitySubEventResource.SubEventAssignedAssetSettingsRecord;
import com.raxim.myscoutee.domain.assets.dto.AssetsDtos.AssetDetailDto;
import com.raxim.myscoutee.common.dto.SharedDtos.ActivitySubEventResourceStateDto;
import com.raxim.myscoutee.common.dto.SharedDtos.SubEventAssignedAssetSettingsDto;
import com.raxim.myscoutee.domain.events.repository.ActivitySubEventResourcesRepository;
import com.raxim.myscoutee.domain.events.repository.ActivitySubEventStageRuntimeRepository;
import com.raxim.myscoutee.domain.events.repository.ActivityEventsRepository;
import com.raxim.myscoutee.domain.accounts.repository.UsersRepository;
import com.raxim.myscoutee.domain.access.security.AccessControlService;
import com.raxim.myscoutee.domain.events.mapper.ActivitySubEventResourceMapper;

@org.junit.jupiter.api.Tag("standard")
class AssetBorrowAssignmentRegressionTest {
    private ActivitiesResourcesService service;
    private AssetsService assets;
    private AccessControlService access;
    private ActivitySubEventResourcesRepository repository;

    @BeforeEach
    @SuppressWarnings("unchecked")
    void setUp() {
        assets = mock(AssetsService.class);
        access = mock(AccessControlService.class);
        repository = mock(ActivitySubEventResourcesRepository.class);
        ObjectProvider<ActivitiesMembersService> members = mock(ObjectProvider.class);
        when(members.getIfAvailable()).thenReturn(mock(ActivitiesMembersService.class));
        when(access.canCurrentActorAssignEventResources(any())).thenReturn(true);
        when(access.canAssignEventResourcesForSubject(anyString(), anyString())).thenReturn(true);
        when(access.hasAcceptedParticipation(anyString(), anyString(), anyString())).thenReturn(true);
        when(repository.save(any(ActivitySubEventResource.class))).thenAnswer(call -> call.getArgument(0));
        service = new ActivitiesResourcesService(repository, mock(ActivitySubEventStageRuntimeRepository.class),
                mock(ActivityEventsRepository.class), new com.raxim.myscoutee.domain.accounts.service.ProfileDirectoryService(mock(UsersRepository.class), null), assets, members, access,
                new ActivitySubEventResourceMapper(), mock(EventSlotReadModelService.class),
                mock(ActivityTournamentGroupCounterService.class), mock(ObjectProvider.class), mock(MongoTemplate.class));
    }

    @Test
    void groupBorrowAssignmentPersistsExactBookingScope() {
        checkAssignment("event:stage:stage:group:1");
    }

    @Test
    void slotGroupBorrowAssignmentKeepsSlotInstance() {
        checkAssignment("event:slot:one:stage:stage:group:1");
    }

    @Test
    void ordinaryEventAssignmentStillPersists() {
        checkAssignment("event");
    }

    @Test
    void missingGroupMembershipStillRejectsAssignment() {
        when(access.hasAcceptedParticipation(anyString(), anyString(), anyString())).thenReturn(false);
        ActivitySubEventResourceStateDto request = new ActivitySubEventResourceStateDto(
                "event:stage:stage:group:1", "stage", "nova", Map.of(), Map.of(), Map.of(), Map.of());
        assertThatThrownBy(() -> service.replace(request)).isInstanceOf(ResponseStatusException.class);
        verify(repository, never()).save(any());
        verifyNoInteractions(assets);
    }

    @Test
    void missingEventMembershipStillRejectsAssignment() {
        when(access.canAssignEventResourcesForSubject("event", "nova")).thenReturn(false);
        ActivitySubEventResourceStateDto request = new ActivitySubEventResourceStateDto(
                "event:stage:stage:group:1", "stage", "nova", Map.of(), Map.of(), Map.of(), Map.of());
        assertThatThrownBy(() -> service.replace(request)).isInstanceOf(ResponseStatusException.class);
        verify(repository, never()).save(any());
        verifyNoInteractions(assets);
    }

    @Test
    void cancellationRemovesOnlyTheBorrowersAssignmentAndPersistsDeletion() {
        checkRemoval(false);
    }

    @Test
    void cancellationPreservesOtherAssetsInTheSameResource() {
        checkRemoval(true);
    }

    private void checkRemoval(boolean keepOtherAsset) {
        String scope = "event:stage:stage:group:1";
        ActivitySubEventResource own = resource(scope, "nova", keepOtherAsset);
        ActivitySubEventResource other = resource(scope, "lina", false);
        when(repository.findByOwnerIdAndSubEventIdAndStatusNot(scope, "stage", "D"))
                .thenReturn(List.of(other, own));
        if (keepOtherAsset) {
            AssetDetailDto retained = mock(AssetDetailDto.class);
            when(retained.id()).thenReturn("other");
            when(retained.type()).thenReturn("Transport");
            when(assets.queryReferencedAssetDetails("casey", Set.of("other")))
                    .thenReturn(Map.of("other", retained));
        }

        service.removeCancelledBorrowAssignment(scope, "stage", "asset", "nova", "casey");

        ArgumentCaptor<ActivitySubEventResource> saved = ArgumentCaptor.forClass(ActivitySubEventResource.class);
        verify(repository).save(saved.capture());
        assertThat(saved.getValue().getAssetOwnerUserId()).isEqualTo("nova");
        assertThat(saved.getValue().getStatus()).isEqualTo(keepOtherAsset ? "A" : "D");
        assertThat(saved.getValue().getAssetAssignmentIds().getOrDefault("Transport", List.of()))
                .isEqualTo(keepOtherAsset ? List.of("other") : List.of());
        assertThat(other.getAssetAssignmentIds()).containsEntry("Transport", List.of("asset"));
    }

    private ActivitySubEventResource resource(String scope, String user, boolean keepOtherAsset) {
        ActivitySubEventResource resource = new ActivitySubEventResource();
        resource.setOwnerId(scope);
        resource.setSubEventId("stage");
        resource.setAssetOwnerUserId(user);
        resource.setStatus("A");
        resource.setAssetAssignmentIds(Map.of("Transport", keepOtherAsset ? List.of("asset", "other") : List.of("asset")));
        var settings = new SubEventAssignedAssetSettingsRecord(0, 4, 1, user, false, List.of());
        resource.setAssetSettingsByType(Map.of("Transport", keepOtherAsset
                ? Map.of("asset", settings, "other", settings) : Map.of("asset", settings)));
        return resource;
    }

    private void checkAssignment(String scope) {
        AssetDetailDto borrowed = mock(AssetDetailDto.class);
        when(borrowed.id()).thenReturn("asset");
        when(borrowed.type()).thenReturn("Transport");
        when(assets.queryAssignableAssetDetails("nova", scope, "stage", Set.of("asset")))
                .thenReturn(Map.of("asset", borrowed));
        ActivitySubEventResourceStateDto request = new ActivitySubEventResourceStateDto(
                scope, "stage", "nova", Map.of("Transport", List.of("asset")),
                Map.of("Transport", Map.of("asset", new SubEventAssignedAssetSettingsDto(
                        0, 4, 1, "nova", false, List.of()))), Map.of(), Map.of());

        ActivitySubEventResourceStateDto result = service.replace(request);

        assertThat(result.assetAssignmentIds()).containsEntry("Transport", List.of("asset"));
        ArgumentCaptor<ActivitySubEventResource> saved = ArgumentCaptor.forClass(ActivitySubEventResource.class);
        verify(repository).save(saved.capture());
        assertThat(saved.getValue().getAssetAssignmentIds()).containsEntry("Transport", List.of("asset"));
        assertThat(saved.getValue().getOwnerId()).isEqualTo(scope);
        verify(access).canAssignEventResourcesForSubject("event", "nova");
    }
}

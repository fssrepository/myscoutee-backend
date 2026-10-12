package com.raxim.myscoutee.domain.platform.service;

import com.raxim.myscoutee.domain.platform.api.JobGroupContext;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;
import static org.mockito.ArgumentMatchers.*;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Query;
import com.raxim.myscoutee.domain.groups.document.CommunityGroup;

@org.junit.jupiter.api.Tag("standard")
class JobGroupScopeServiceTest {
    @Test void personalJobsStartWithoutGroupEventAssetOrAffinityOwners() {
        var profiles = mock(com.raxim.myscoutee.domain.accounts.api.ProfileDirectory.class);
        var user = new com.raxim.myscoutee.domain.accounts.document.Users(); user.setId("personal");
        doReturn(user).when(profiles).findFirstByUserId("personal");
        doReturn(List.of(user)).when(profiles).findByUserIdIn(List.of("personal"));
        try (var context = new org.springframework.context.annotation.AnnotationConfigApplicationContext()) {
            context.registerBean(com.raxim.myscoutee.domain.accounts.api.ProfileDirectory.class, () -> profiles);
            context.register(JobGroupScopeService.class);
            context.refresh();
            var service = context.getBean(JobGroupScopeService.class);
            JobGroupContext.run(null, () -> {
                assertThat(service.forUser("personal")).isNull();
                assertThat(service.forTarget("user", "personal")).isNull();
                assertThat(service.matchesWorkspace(null)).isTrue();
                assertThat(service.workspaceScope().ids()).isEmpty();
                assertThat(service.usersByGroup(List.of("personal")))
                        .containsEntry(null, List.of("personal"));
            });
        }
        assertThat(JobGroupContext.isActive()).isFalse();
        verify(profiles).findByUserIdIn(List.of("personal"));
    }

    @Test void configuredWorkspaceFailureCannotBecomeAnEmptyPersonalScope() {
        var workspace = mock(com.raxim.myscoutee.domain.platform.api.JobWorkspaceDirectory.class);
        when(workspace.workspaceBaseIds()).thenThrow(new IllegalStateException("owner unavailable"));
        var service = new JobGroupScopeService(mock(com.raxim.myscoutee.domain.accounts.api.ProfileDirectory.class),
                java.util.Optional.of(workspace), List.of());
        assertThatThrownBy(() -> JobGroupContext.run(null, service::workspaceScope))
                .isInstanceOf(IllegalStateException.class).hasMessage("owner unavailable");
        assertThat(JobGroupContext.isActive()).isFalse();
    }

    @Test void narrowResourceScopeReadsKeepCanonicalWorkspaceOwnerAndCreatorResolution() {
        var mongo = mock(MongoTemplate.class);
        var asset = new org.bson.Document("workspaceGroupId", CommunityGroup.COMMUNITY_BASE_ID)
                .append("ownerUserId", "owner").append("creatorUserId", "creator").append("privateField", "excluded");
        var event = new org.bson.Document("ownerUserId", "owner").append("creatorUserId", "creator");
        when(mongo.findOne(any(Query.class), eq(org.bson.Document.class), eq("assets"))).thenReturn(asset);
        when(mongo.findOne(any(Query.class), eq(org.bson.Document.class), eq("events"))).thenReturn(event);
        var assets = new com.raxim.myscoutee.domain.assets.service.AssetOwnershipService(
                mock(com.raxim.myscoutee.domain.assets.repository.AssetsRepository.class));
        var events = new com.raxim.myscoutee.domain.events.service.EventOwnershipService(
                mock(com.raxim.myscoutee.domain.events.repository.ActivityEventsRepository.class));
        org.springframework.test.util.ReflectionTestUtils.setField(assets, "mongo", mongo);
        org.springframework.test.util.ReflectionTestUtils.setField(events, "mongo", mongo);
        assertThat(assets.findJobScope("asset-id")).isEqualTo(new com.raxim.myscoutee.domain.assets.dto.AssetJobScopeDto(
                CommunityGroup.COMMUNITY_BASE_ID, "owner", "creator"));
        assertThat(events.findJobScope("event-id")).isEqualTo(new com.raxim.myscoutee.domain.events.dto.EventJobScopeDto(null, "owner", "creator"));
        verify(mongo).findOne(argThat(q -> "asset-id".equals(q.getQueryObject().getString("assetId"))), eq(org.bson.Document.class), eq("assets"));
        verify(mongo).findOne(argThat(q -> "event-id".equals(q.getQueryObject().getString("sourceId"))), eq(org.bson.Document.class), eq("events"));
        var profiles = mock(com.raxim.myscoutee.domain.accounts.api.ProfileDirectory.class);
        var owner = mock(com.raxim.myscoutee.domain.accounts.document.Users.class);
        when(owner.getWorkspaceGroupId()).thenReturn(CommunityGroup.WORK_BASE_ID);
        org.mockito.Mockito.doReturn(owner).when(profiles).findFirstByUserId("owner");
        org.mockito.Mockito.doReturn(owner).when(profiles).findFirstByUserId("creator");
        var service = new JobGroupScopeService(profiles,
                java.util.Optional.of(com.raxim.myscoutee.domain.groups.service.GroupTestSupport.directory(mongo)),
                List.of(assets, events));
        assertThat(service.forTarget("asset", "asset-id")).isEqualTo(CommunityGroup.COMMUNITY_BASE_ID);
        assertThat(service.forTarget("event", "event-id")).isEqualTo(CommunityGroup.WORK_BASE_ID);
        event.remove("ownerUserId");
        assertThat(service.forTarget("event", "event-id")).isEqualTo(CommunityGroup.WORK_BASE_ID);
        verify(profiles).findFirstByUserId("creator");
        when(mongo.findOne(any(Query.class), eq(org.bson.Document.class), eq("assets"))).thenReturn(null);
        JobGroupContext.run(CommunityGroup.COMMUNITY_BASE_ID,
                () -> assertThat(service.forTarget("asset", "missing")).isEqualTo(CommunityGroup.COMMUNITY_BASE_ID));
    }

    @Test void communityNeverFallsIntoDatingAndWorkspaceMapIsReadOncePerJob() {
        var mongo = mock(MongoTemplate.class);
        var community = new org.bson.Document("_id", "private-homes").append("groupType", "community");
        when(mongo.find(any(Query.class), eq(org.bson.Document.class), eq("communityGroups"))).thenReturn(List.of(community));
        var directory = new com.raxim.myscoutee.domain.groups.service.GroupDirectoryService(org.mockito.Mockito.mock(com.raxim.myscoutee.domain.groups.repository.CommunityGroupsRepository.class));
        org.springframework.test.util.ReflectionTestUtils.setField(directory, "mongo", mongo);
        var service = new JobGroupScopeService(mock(com.raxim.myscoutee.domain.accounts.api.ProfileDirectory.class),
                java.util.Optional.of(directory), List.of());
        JobGroupContext.run(CommunityGroup.COMMUNITY_BASE_ID, () -> {
            assertThat(service.matchesWorkspace("private-homes")).isTrue();
            assertThat(service.matchesWorkspace(CommunityGroup.COMMUNITY_BASE_ID)).isTrue();
            assertThat(service.matchesWorkspace(CommunityGroup.WORK_BASE_ID)).isFalse();
            assertThat(service.matchesWorkspace(null)).isFalse();
            assertThat(service.workspaceScope().included()).isTrue();
            assertThat(service.workspaceScope().ids())
                    .contains("private-homes", CommunityGroup.COMMUNITY_BASE_ID).doesNotContain(CommunityGroup.WORK_BASE_ID);
        });
        verify(mongo, times(1)).find(argThat(query -> query.getFieldsObject().keySet().equals(java.util.Set.of("_id", "groupType"))),
                eq(org.bson.Document.class), eq("communityGroups"));
        JobGroupContext.run(null, () -> {
            assertThat(service.matchesWorkspace(null)).isTrue();
            assertThat(service.matchesWorkspace("private-homes")).isFalse();
            assertThat(service.workspaceScope().included()).isFalse();
            assertThat(service.workspaceScope().ids())
                    .contains("private-homes", CommunityGroup.COMMUNITY_BASE_ID, CommunityGroup.WORK_BASE_ID);
        });
        assertThat(JobGroupContext.isActive()).isFalse();
    }
}

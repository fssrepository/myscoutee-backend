package com.raxim.myscoutee.domain.platform.service;

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
    @Test void communityNeverFallsIntoDatingAndWorkspaceMapIsReadOncePerJob() {
        var mongo = mock(MongoTemplate.class);
        var community = new org.bson.Document("_id", "private-homes").append("groupType", "community");
        when(mongo.find(any(Query.class), eq(org.bson.Document.class), eq("communityGroups"))).thenReturn(List.of(community));
        var service = new JobGroupScopeService(mongo);
        JobGroupContext.run(CommunityGroup.COMMUNITY_BASE_ID, () -> {
            assertThat(service.matchesWorkspace("private-homes")).isTrue();
            assertThat(service.matchesWorkspace(CommunityGroup.COMMUNITY_BASE_ID)).isTrue();
            assertThat(service.matchesWorkspace(CommunityGroup.WORK_BASE_ID)).isFalse();
            assertThat(service.matchesWorkspace(null)).isFalse();
            assertThat(service.workspaceCriteria("workspaceGroupId").getCriteriaObject().toJson())
                    .contains("private-homes", CommunityGroup.COMMUNITY_BASE_ID).doesNotContain(CommunityGroup.WORK_BASE_ID);
        });
        verify(mongo, times(1)).find(argThat(query -> query.getFieldsObject().keySet().equals(java.util.Set.of("_id", "groupType"))),
                eq(org.bson.Document.class), eq("communityGroups"));
        JobGroupContext.run(null, () -> {
            assertThat(service.matchesWorkspace(null)).isTrue();
            assertThat(service.matchesWorkspace("private-homes")).isFalse();
            assertThat(service.workspaceCriteria("workspaceGroupId").getCriteriaObject().toJson())
                    .contains("$nin", "private-homes", CommunityGroup.COMMUNITY_BASE_ID, CommunityGroup.WORK_BASE_ID);
        });
        assertThat(JobGroupContext.isActive()).isFalse();
    }
}

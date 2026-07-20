package com.raxim.myscoutee.profile.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.atLeastOnce;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.PageRequest;

import com.raxim.myscoutee.profile.data.document.AdminAffinityGraphEdge;
import com.raxim.myscoutee.profile.data.document.AdminAffinityGraphForest;
import com.raxim.myscoutee.profile.data.document.AdminAffinityGraphLayout;
import com.raxim.myscoutee.profile.data.document.AdminAffinityGraphNode;
import com.raxim.myscoutee.profile.data.document.UserAffinityEdge;
import com.raxim.myscoutee.profile.data.document.Users;
import com.raxim.myscoutee.profile.data.dto.admin.AdminDtos.AdminAffinityGraphDto;
import com.raxim.myscoutee.profile.data.dto.admin.AdminDtos.AdminAffinityGraphForestsDto;
import com.raxim.myscoutee.profile.data.dto.admin.AdminDtos.AdminAffinityGraphMetaDto;
import com.raxim.myscoutee.profile.data.dto.admin.AdminDtos.AdminAffinityGraphNeighborhoodDto;
import com.raxim.myscoutee.profile.data.dto.admin.AdminDtos.AdminAffinityGraphTileDto;
import com.raxim.myscoutee.profile.data.dto.admin.AdminDtos.AdminUserDto;
import com.raxim.myscoutee.profile.repository.AdminAffinityGraphEdgesRepository;
import com.raxim.myscoutee.profile.repository.AdminAffinityGraphForestsRepository;
import com.raxim.myscoutee.profile.repository.AdminAffinityGraphLayoutsRepository;
import com.raxim.myscoutee.profile.repository.AdminAffinityGraphNodesRepository;
import com.raxim.myscoutee.profile.repository.UserAffinityEdgesRepository;
import com.raxim.myscoutee.profile.repository.UsersRepository;

@ExtendWith(MockitoExtension.class)
class AdminAffinityGraphServiceTest {
    @Mock
    private AdminModerationService adminModerationService;
    @Mock
    private UsersRepository usersRepository;
    @Mock
    private UserAffinityEdgesRepository userAffinityEdgesRepository;
    @Mock
    private AdminAffinityGraphLayoutsRepository layoutsRepository;
    @Mock
    private AdminAffinityGraphNodesRepository graphNodesRepository;
    @Mock
    private AdminAffinityGraphEdgesRepository graphEdgesRepository;
    @Mock
    private AdminAffinityGraphForestsRepository graphForestsRepository;

    private AdminAffinityGraphService service;

    @BeforeEach
    void setUp() {
        when(adminModerationService.resolveAdminActor("admin-1"))
                .thenReturn(new AdminUserDto("admin-1", "Admin", "A", "admin@example.test", "", "", List.of()));
        service = new AdminAffinityGraphService(
                adminModerationService,
                usersRepository,
                userAffinityEdgesRepository,
                layoutsRepository,
                graphNodesRepository,
                graphEdgesRepository,
                graphForestsRepository);
    }

    @Test
    void fullGraphIncludesIsolatedMembersAndFiltersLinksByWeight() {
        when(usersRepository.findAll()).thenReturn(List.of(
                user("u1", "Ava", "woman", "public"),
                user("u2", "Ben", "man", "public"),
                user("u3", "Chloe", "woman", "public"),
                user("u-deleted", "Deleted", "man", "deleted"),
                user("u-onboarding", "Onboarding", "woman", "onboarding")));
        when(userAffinityEdgesRepository.findAll()).thenReturn(List.of(
                edge("u1", "u2", 0.82d),
                edge("u2", "u3", 0.12d),
                edge("u1", "u-deleted", 0.99d)));

        AdminAffinityGraphDto graph = service.full("admin-1", 0.2d, 1d);
        AdminAffinityGraphMetaDto meta = service.meta("admin-1", 0.2d, 1d);

        assertThat(graph.nodes()).extracting("id").containsExactlyInAnyOrder("u1", "u2", "u3");
        assertThat(graph.edges()).hasSize(1);
        assertThat(graph.edges().get(0).source()).isEqualTo("u1");
        assertThat(graph.edges().get(0).target()).isEqualTo("u2");
        assertThat(meta.memberCount()).isEqualTo(3);
        assertThat(meta.linkCount()).isEqualTo(1);
        assertThat(meta.componentCount()).isEqualTo(2);
        assertThat(meta.isolatedCount()).isEqualTo(1);
        verify(adminModerationService, atLeastOnce()).resolveAdminActor("admin-1");
    }

    @Test
    void neighborhoodUsesHopDepthAndCurrentWeightRange() {
        when(usersRepository.findAll()).thenReturn(List.of(
                user("u1", "Ava", "woman", "public"),
                user("u2", "Ben", "man", "public"),
                user("u3", "Chloe", "woman", "public"),
                user("u4", "Drew", "man", "public")));
        when(userAffinityEdgesRepository.findAll()).thenReturn(List.of(
                edge("u1", "u2", 0.82d),
                edge("u2", "u3", 0.72d),
                edge("u1", "u4", 0.08d)));

        AdminAffinityGraphNeighborhoodDto graph = service.neighborhood("admin-1", "u1", 2, 0.2d, 1d);

        assertThat(graph.centerUserId()).isEqualTo("u1");
        assertThat(graph.depth()).isEqualTo(2);
        assertThat(graph.nodes()).extracting("id").containsExactlyInAnyOrder("u1", "u2", "u3");
        assertThat(graph.edges()).extracting("id").containsExactlyInAnyOrder("u1:u2", "u2:u3");
    }

    @Test
    void tileReturnsOnlyViewportNodesWithLayoutCoordinates() {
        when(layoutsRepository.findFirstByOrderByGeneratedAtIsoDesc()).thenReturn(Optional.empty());
        when(usersRepository.findAll()).thenReturn(List.of(
                user("u1", "Ava", "woman", "public"),
                user("u2", "Ben", "man", "public"),
                user("u3", "Chloe", "woman", "public")));
        when(userAffinityEdgesRepository.findAll()).thenReturn(List.of(
                edge("u1", "u2", 0.82d),
                edge("u2", "u3", 0.72d)));

        var tile = service.tile("admin-1", null, 0, 0, 0, 0.2d, 1d, null);

        assertThat(tile.nodes()).hasSize(3);
        assertThat(tile.nodes()).allSatisfy(node -> {
            assertThat(node.componentId()).isNotBlank();
            assertThat(node.x()).isNotNull();
            assertThat(node.y()).isNotNull();
            assertThat(node.z()).isNotNull();
        });
        assertThat(tile.edges()).hasSize(2);
    }

    @Test
    void forestsPageLiveComponentsWithoutDroppingIsolatedMembers() {
        when(usersRepository.findAll()).thenReturn(List.of(
                user("u1", "Ava", "woman", "public"),
                user("u2", "Ben", "man", "public"),
                user("u3", "Chloe", "woman", "public"),
                user("u4", "Drew", "man", "public"),
                user("u5", "Eli", "man", "public"),
                user("u6", "Finn", "man", "public")));
        when(userAffinityEdgesRepository.findAll()).thenReturn(List.of(
                edge("u1", "u2", 0.9d),
                edge("u1", "u3", 0.8d),
                edge("u4", "u5", 0.7d)));

        AdminAffinityGraphForestsDto forests = service.forests("admin-1", 0.2d, 1d, 0, 2, 0);

        assertThat(forests.forestCount()).isEqualTo(3);
        assertThat(forests.limit()).isEqualTo(2);
        assertThat(forests.offset()).isZero();
        assertThat(forests.forests()).hasSize(2);
        assertThat(forests.forests().get(0).representativeUserId()).isEqualTo("u1");
        assertThat(forests.forests().get(0).memberCount()).isEqualTo(3);
        assertThat(forests.forests().get(0).edgeCount()).isEqualTo(2);
        assertThat(forests.forests().get(1).memberCount()).isEqualTo(2);
    }

    @Test
    void forestsUseMaterializedPagedRepositoryForDefaultWeightRange() {
        AdminAffinityGraphLayout layout = layout("layout-1", 40, 39, 20, 3);
        when(layoutsRepository.findFirstByOrderByGeneratedAtIsoDesc()).thenReturn(Optional.of(layout));
        when(graphForestsRepository.countByLayoutVersion("layout-1")).thenReturn(40L);
        when(graphForestsRepository.findByLayoutVersionOrderByMemberCountDesc("layout-1", PageRequest.of(1, 20)))
                .thenReturn(List.of(forest("c20", "u20", "Uma", "woman", 7, 8, 30d)));

        AdminAffinityGraphForestsDto forests = service.forests("admin-1", 0d, 1d, 1, 20, 20);

        assertThat(forests.source()).isEqualTo("materialized");
        assertThat(forests.layoutVersion()).isEqualTo("layout-1");
        assertThat(forests.forestCount()).isEqualTo(40);
        assertThat(forests.forestLevel()).isEqualTo(1);
        assertThat(forests.maxForestLevel()).isEqualTo(2);
        assertThat(forests.limit()).isEqualTo(20);
        assertThat(forests.offset()).isEqualTo(20);
        assertThat(forests.forests()).extracting("componentId").containsExactly("c20");
    }

    @Test
    void materializedTileFiltersViewportByComponentAndWeightRange() {
        AdminAffinityGraphLayout layout = layout("layout-1", 2, 1, 1, 0);
        layout.setNodeRenderBudget(100);
        layout.setEdgeRenderBudget(100);
        when(layoutsRepository.findByLayoutVersion("layout-1")).thenReturn(Optional.of(layout));
        when(graphNodesRepository.findByLayoutVersionAndComponentIdAndViewport(
                "layout-1",
                "c0",
                -620d,
                620d,
                -620d,
                620d))
                        .thenReturn(List.of(
                                graphNode("u2", "Ben", "man", "c0", 4d, 0d, 0.4d),
                                graphNode("u1", "Ava", "woman", "c0", 0d, 0d, 0.9d)));
        when(graphEdgesRepository.findRelevantByLayoutVersionAndUserIds("layout-1", List.of("u1", "u2")))
                .thenReturn(List.of(
                        graphEdge("u1", "u2", "c0", 0.75d),
                        graphEdge("u1", "u3", "c0", 0.78d),
                        graphEdge("u1", "u2", "c1", 0.76d),
                        graphEdge("u1", "u2", "c0", 0.4d)));

        AdminAffinityGraphTileDto tile = service.tile("admin-1", "layout-1", 0, 0, 0, 0.7d, 0.8d, "c0");

        assertThat(tile.source()).isEqualTo("materialized");
        assertThat(tile.nodes()).extracting("id").containsExactly("u1", "u2");
        assertThat(tile.edges()).hasSize(1);
        assertThat(tile.edges().get(0).source()).isEqualTo("u1");
        assertThat(tile.edges().get(0).target()).isEqualTo("u2");
        assertThat(tile.edges().get(0).weight()).isEqualTo(0.75d);
        verify(graphEdgesRepository, times(1)).findRelevantByLayoutVersionAndUserIds("layout-1", List.of("u1", "u2"));
    }

    private Users user(String id, String name, String gender, String profileStatus) {
        Users user = new Users();
        user.setId(id);
        user.setName(name);
        user.setInitials(name.substring(0, 1));
        user.setGender(gender);
        user.setProfileStatus(profileStatus);
        return user;
    }

    private UserAffinityEdge edge(String left, String right, double weight) {
        UserAffinityEdge edge = new UserAffinityEdge();
        edge.setLeftUserId(left);
        edge.setRightUserId(right);
        edge.setPairKey(left.compareTo(right) <= 0 ? left + ":" + right : right + ":" + left);
        edge.setEdgeWeight(weight);
        edge.setAffinityScore(weight);
        return edge;
    }

    private AdminAffinityGraphLayout layout(String version, int memberCount, int linkCount, int componentCount, int isolatedCount) {
        AdminAffinityGraphLayout layout = new AdminAffinityGraphLayout();
        layout.setLayoutVersion(version);
        layout.setGeneratedAtIso("2026-05-26T00:00:00Z");
        layout.setSource("materialized");
        layout.setMemberCount(memberCount);
        layout.setLinkCount(linkCount);
        layout.setComponentCount(componentCount);
        layout.setIsolatedCount(isolatedCount);
        layout.setMaxZoom(6);
        layout.setTileSize(256);
        layout.setNodeRenderBudget(1000);
        layout.setEdgeRenderBudget(5000);
        return layout;
    }

    private AdminAffinityGraphForest forest(
            String componentId,
            String representativeUserId,
            String representativeName,
            String gender,
            int memberCount,
            int edgeCount,
            double weightedDegree) {
        AdminAffinityGraphForest forest = new AdminAffinityGraphForest();
        forest.setComponentId(componentId);
        forest.setRepresentativeUserId(representativeUserId);
        forest.setRepresentativeName(representativeName);
        forest.setRepresentativeInitials(representativeName.substring(0, 1));
        forest.setGender(gender);
        forest.setMemberCount(memberCount);
        forest.setEdgeCount(edgeCount);
        forest.setWeightedDegree(weightedDegree);
        forest.setX(10d);
        forest.setY(0d);
        forest.setZ(20d);
        forest.setRadius(12d);
        return forest;
    }

    private AdminAffinityGraphNode graphNode(
            String userId,
            String name,
            String gender,
            String componentId,
            double x,
            double z,
            double centrality) {
        AdminAffinityGraphNode node = new AdminAffinityGraphNode();
        node.setUserId(userId);
        node.setName(name);
        node.setInitials(name.substring(0, 1));
        node.setGender(gender);
        node.setComponentId(componentId);
        node.setX(x);
        node.setY(0d);
        node.setZ(z);
        node.setDegree(1);
        node.setWeightedDegree(centrality);
        node.setCentrality(centrality);
        return node;
    }

    private AdminAffinityGraphEdge graphEdge(String source, String target, String componentId, double weight) {
        AdminAffinityGraphEdge edge = new AdminAffinityGraphEdge();
        edge.setSourceUserId(source);
        edge.setTargetUserId(target);
        edge.setComponentId(componentId);
        edge.setWeight(weight);
        edge.setAffinityScore(weight);
        return edge;
    }
}

package com.raxim.myscoutee.profile.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.atLeastOnce;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.raxim.myscoutee.profile.data.document.UserAffinityEdge;
import com.raxim.myscoutee.profile.data.document.Users;
import com.raxim.myscoutee.profile.data.dto.admin.AdminDtos.AdminAffinityGraphDto;
import com.raxim.myscoutee.profile.data.dto.admin.AdminDtos.AdminAffinityGraphMetaDto;
import com.raxim.myscoutee.profile.data.dto.admin.AdminDtos.AdminAffinityGraphNeighborhoodDto;
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
                user("u-onboarding", "Onboarding", "woman", "public")));
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
}

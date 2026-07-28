package com.raxim.myscoutee.profile.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.raxim.myscoutee.profile.data.document.Users;
import com.raxim.myscoutee.profile.data.dto.auth.AuthDtos.UserDto;
import com.raxim.myscoutee.profile.data.dto.game.GameDtos.UserGameCardsQueryRequestDto;

@ExtendWith(MockitoExtension.class)
class HomeGameCardsServiceTest {
    @Mock
    private HomeUserProfileService homeUserProfileService;

    @Test
    void outsideNetworkModeUsesExplicitOutsideNetworkQuery() {
        HomeGameCardsService service = new HomeGameCardsService(homeUserProfileService);
        Users left = user("left");
        Users right = user("right");
        List<Users> users = List.of(left, right);
        HomeUserProfileService.ActivitySocialGraph graph = new HomeUserProfileService.ActivitySocialGraph(Map.of(), Map.of());
        HomeUserProfileService.GameSocialCardCandidate outsideNetworkCard =
                new HomeUserProfileService.GameSocialCardCandidate(
                        "outside-network:active:left:right",
                        "left",
                        "right",
                        null,
                        null,
                        null,
                        null,
                        10d);

        when(homeUserProfileService.resolveSelectedUserId("active")).thenReturn("active");
        when(homeUserProfileService.queryOrderedUserRecords()).thenReturn(users);
        when(homeUserProfileService.queryActivitySocialGraph()).thenReturn(graph);
        when(homeUserProfileService.queryOutsideNetworkCards("active", users, graph)).thenReturn(List.of(outsideNetworkCard));
        when(homeUserProfileService.toGameCardUserDto(left)).thenReturn(userDto("left"));
        when(homeUserProfileService.toGameCardUserDto(right)).thenReturn(userDto("right"));

        var response = service.queryPage(new UserGameCardsQueryRequestDto(
                "active",
                "outside-network",
                null,
                null,
                null,
                null,
                10));

        assertThat(response.cardUserIds()).isEmpty();
        assertThat(response.users()).extracting(UserDto::id).containsExactly("left", "right");
        assertThat(response.socialCards()).hasSize(1);
        assertThat(response.socialCards().get(0).userId()).isEqualTo("left");
        assertThat(response.socialCards().get(0).secondaryUserId()).isEqualTo("right");
        assertThat(response.socialCards().get(0).socialContext()).isNull();
        verify(homeUserProfileService).queryOutsideNetworkCards("active", users, graph);
        verify(homeUserProfileService, never()).querySeparatedFriendCards("active", users, graph);
        verify(homeUserProfileService, never()).queryFriendsInCommonCards("active", users, graph);
    }

    @Test
    void pairModeFallsBackToSingleCardQuery() {
        HomeGameCardsService service = new HomeGameCardsService(homeUserProfileService);
        Users candidate = user("candidate");

        when(homeUserProfileService.resolveSelectedUserId("active")).thenReturn("active");
        when(homeUserProfileService.queryGameStackUserRecords("active")).thenReturn(List.of(candidate));
        when(homeUserProfileService.toGameCardUserDto(candidate)).thenReturn(userDto("candidate"));

        var response = service.queryPage(new UserGameCardsQueryRequestDto(
                "active",
                "pair",
                null,
                null,
                null,
                null,
                10));

        assertThat(response.cardUserIds()).containsExactly("candidate");
        assertThat(response.socialCards()).isEmpty();
        verify(homeUserProfileService).queryGameStackUserRecords("active");
        verify(homeUserProfileService, never()).queryOutsideNetworkCards(anyString(), anyList(), any());
    }

    @Test
    void newlyEligibleUserChangesTotalWhilePageSizeRemainsTen() {
        HomeGameCardsService service = new HomeGameCardsService(homeUserProfileService);
        List<Users> firstTen = java.util.stream.IntStream.rangeClosed(1, 10)
                .mapToObj(index -> user("candidate-" + index))
                .toList();
        List<Users> afterRegistration = java.util.stream.Stream.concat(
                        firstTen.stream(),
                        java.util.stream.Stream.of(user("newly-registered")))
                .toList();
        when(homeUserProfileService.resolveSelectedUserId("active")).thenReturn("active");
        when(homeUserProfileService.queryGameStackUserRecords("active"))
                .thenReturn(firstTen, afterRegistration);
        when(homeUserProfileService.toGameCardUserDto(any(Users.class))).thenAnswer(invocation -> {
            Users candidate = invocation.getArgument(0);
            return userDto(candidate.getId());
        });

        var beforeRegistration = service.queryPage(new UserGameCardsQueryRequestDto(
                "active", "single", null, null, null, null, 10));
        var afterNewUser = service.queryPage(new UserGameCardsQueryRequestDto(
                "active", "single", null, null, null, null, 10));

        assertThat(beforeRegistration.filterCount()).isEqualTo(10);
        assertThat(beforeRegistration.cardUserIds()).hasSize(10);
        assertThat(beforeRegistration.nextCursor()).isNull();
        assertThat(afterNewUser.filterCount()).isEqualTo(11);
        assertThat(afterNewUser.cardUserIds()).hasSize(10);
        assertThat(afterNewUser.nextCursor()).isEqualTo("10");
    }

    private Users user(String id) {
        Users user = new Users();
        user.setId(id);
        user.setName(id);
        user.setProfileStatus("public");
        return user;
    }

    private UserDto userDto(String id) {
        return new UserDto(
                id,
                id,
                30,
                "",
                "",
                "",
                "",
                List.of(),
                "",
                id.substring(0, 1).toUpperCase(),
                "",
                "",
                "",
                "",
                0,
                0,
                "",
                "",
                0d,
                null,
                "",
                List.of(),
                List.of(),
                null,
                "public",
                "",
                "",
                false,
                false,
                null,
                null);
    }
}

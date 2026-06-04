package com.raxim.myscoutee.profile.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.raxim.myscoutee.profile.data.document.NavigatorContactsProfile;
import com.raxim.myscoutee.profile.data.document.UserRate;
import com.raxim.myscoutee.profile.data.document.Users;
import com.raxim.myscoutee.profile.data.dto.activities.ActivityInviteDtos.ActivityInviteCandidatesRequestDto;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.ActivityMemberEntryDto;
import com.raxim.myscoutee.profile.repository.NavigatorContactsProfilesRepository;
import com.raxim.myscoutee.profile.repository.UserRatesRepository;
import com.raxim.myscoutee.profile.repository.UsersRepository;

@ExtendWith(MockitoExtension.class)
class ActivitiesInviteCandidatesServiceTest {
    @Mock
    private UsersRepository usersRepository;
    @Mock
    private UserRatesRepository userRatesRepository;
    @Mock
    private ActivitiesMembersService activitiesMembersService;
    @Mock
    private HomeUserProfileService homeUserProfileService;
    @Mock
    private NavigatorContactsProfilesRepository navigatorContactsProfilesRepository;

    private ActivitiesInviteCandidatesService service;

    @BeforeEach
    void setUp() {
        service = new ActivitiesInviteCandidatesService(
                usersRepository,
                userRatesRepository,
                activitiesMembersService,
                homeUserProfileService,
                navigatorContactsProfilesRepository);
    }

    @Test
    void assetCandidatesExcludeAlreadySavedContacts() {
        Users activeUser = user("active", "Active User");
        Users otherUser = user("other", "Other User");
        when(homeUserProfileService.resolveCurrentUser("active")).thenReturn(activeUser);
        when(activitiesMembersService.queryOwnerSnapshot("asset", "asset-1"))
                .thenReturn(new ActivitiesMembersService.OwnerMembersSnapshot(
                        "asset",
                        "asset-1",
                        List.of(),
                        List.of(),
                        List.of(),
                        Set.of(),
                        10));
        when(navigatorContactsProfilesRepository.findByUserId("active")).thenReturn(Optional.of(contactProfile(
                "active",
                "saved-contact")));
        when(userRatesRepository.findRelevantByUserIds(List.of("active"))).thenReturn(List.of(
                singleMetRate("active", "saved-contact", 0.9d),
                singleMetRate("active", "other", 0.8d)));
        when(usersRepository.findByUserIdIn(Set.of("other"))).thenReturn(List.of(otherUser));
        when(homeUserProfileService.isActivityRateVisibleUser(otherUser)).thenReturn(true);
        when(homeUserProfileService.toGameCardUserDto(otherUser)).thenReturn(null);

        List<ActivityMemberEntryDto> response = service.queryCandidates(new ActivityInviteCandidatesRequestDto(
                "active",
                "asset-1",
                "asset",
                "recent"));

        assertThat(response).extracting(ActivityMemberEntryDto::userId)
                .containsExactly("other");
    }

    private NavigatorContactsProfile contactProfile(String userId, String contactUserId) {
        NavigatorContactsProfile profile = new NavigatorContactsProfile();
        profile.setUserId(userId);
        NavigatorContactsProfile.NavigatorContactRecord contact = new NavigatorContactsProfile.NavigatorContactRecord();
        contact.setId(contactUserId);
        contact.setUserId(contactUserId);
        profile.setContacts(List.of(contact));
        return profile;
    }

    private UserRate singleMetRate(String ownerUserId, String relatedUserId, double affinityScore) {
        UserRate rate = new UserRate();
        rate.setMode("single");
        rate.setMet(true);
        rate.setOwnerUserId(ownerUserId);
        rate.setRelatedUserId(relatedUserId);
        rate.setCreatedDate("2026-05-01T00:00:00Z");
        rate.setUpdatedDate("2026-05-02T00:00:00Z");
        rate.setEventName("E2E meetup");
        rate.setAffinityScore(affinityScore);
        return rate;
    }

    private Users user(String userId, String name) {
        Users user = new Users();
        user.setUserId(userId);
        user.setName(name);
        user.setInitials(name.substring(0, 1));
        user.setGender("man");
        user.setCity("Bratislava");
        user.setStatusText("Ready");
        user.setProfileStatus("public");
        return user;
    }
}

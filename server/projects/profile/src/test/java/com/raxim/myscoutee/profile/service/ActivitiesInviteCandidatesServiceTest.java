package com.raxim.myscoutee.profile.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import com.raxim.myscoutee.profile.data.document.ActivityMember;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.raxim.myscoutee.profile.data.document.NavigatorContactsProfile;
import com.raxim.myscoutee.profile.data.document.UserRate;
import com.raxim.myscoutee.profile.data.document.Users;
import com.raxim.myscoutee.profile.data.dto.activities.ActivityInviteDtos.ActivityInviteCandidatesRequestDto;
import com.raxim.myscoutee.profile.data.dto.activities.ActivityInviteDtos.ActivityInviteCandidatesPageDto;
import com.raxim.myscoutee.profile.repository.ActivityMembersRepository;
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
    private ActivityMembersRepository activityMembersRepository;
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
                activityMembersRepository,
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

        ActivityInviteCandidatesPageDto response = service.queryCandidates(new ActivityInviteCandidatesRequestDto(
                "active",
                "asset-1",
                "asset",
                "recent"));

        assertThat(response.items()).extracting(entry -> entry.userId())
                .containsExactly("other");
        assertThat(response.total()).isEqualTo(1);
    }

    @Test
    void childCandidatesArePagedAcceptedParentMembersExcludingAcceptedChildMembers() {
        Users activeUser = user("active", "Active User");
        Users pendingUser = user("pending-child", "Pending Child");
        Users parentMember = user("parent-member", "Parent Member");
        when(homeUserProfileService.resolveCurrentUser("active")).thenReturn(activeUser);
        when(activitiesMembersService.queryOwnerSnapshot("asset", "asset-1"))
                .thenReturn(new ActivitiesMembersService.OwnerMembersSnapshot(
                        "asset",
                        "asset-1",
                        List.of(),
                        List.of("already-assigned"),
                        List.of("pending-child"),
                        List.of(),
                        List.of(),
                        Set.of(),
                        10));
        ActivityMember member = new ActivityMember();
        member.setOwnerType("event");
        member.setOwnerId("slot-1");
        member.setUserId("parent-member");
        member.setStatus("accepted");
        member.setActionAtIso("2026-07-20T12:00:00Z");
        when(activityMembersRepository.findByOwnerTypeAndOwnerIdAndStatusAndUserIdNotIn(
                eq("event"),
                eq("slot-1"),
                eq("accepted"),
                eq(Set.of("active", "already-assigned", "pending-child")),
                any(Pageable.class)))
                .thenReturn(new PageImpl<>(List.of(member)));
        when(usersRepository.findByUserIdIn(Set.of("pending-child", "parent-member")))
                .thenReturn(List.of(pendingUser, parentMember));
        when(homeUserProfileService.toGameCardUserDto(pendingUser)).thenReturn(null);
        when(homeUserProfileService.toGameCardUserDto(parentMember)).thenReturn(null);

        ActivityInviteCandidatesPageDto response = service.queryCandidates(new ActivityInviteCandidatesRequestDto(
                "active",
                "asset-1",
                "asset",
                "slot-1",
                "event",
                "recent",
                0,
                16));

        assertThat(response.items()).extracting(entry -> entry.userId())
                .containsExactly("pending-child", "parent-member");
        assertThat(response.total()).isEqualTo(2);
    }

    @Test
    void assetCandidatesUseImmediateGroupParentAndScopedExistingMembers() {
        Users activeUser = user("active", "Active User");
        Users groupMember = user("group-member", "Group Member");
        when(homeUserProfileService.resolveCurrentUser("active")).thenReturn(activeUser);
        when(activitiesMembersService.queryOwnerSnapshot("asset", "asset-1"))
                .thenReturn(new ActivitiesMembersService.OwnerMembersSnapshot(
                        "asset",
                        "asset-1",
                        List.of(),
                        List.of("global-other-group-member"),
                        List.of(),
                        List.of(),
                        List.of(),
                        Set.of(),
                        10));
        ActivityMember member = new ActivityMember();
        member.setOwnerType("group");
        member.setOwnerId("group-a");
        member.setUserId("group-member");
        member.setStatus("accepted");
        member.setActionAtIso("2026-07-20T12:00:00Z");
        when(activityMembersRepository.findByOwnerTypeAndOwnerIdAndStatusAndUserIdNotIn(
                eq("group"),
                eq("group-a"),
                eq("accepted"),
                eq(Set.of("active", "already-on-resource")),
                any(Pageable.class)))
                .thenReturn(new PageImpl<>(List.of(member)));
        when(usersRepository.findByUserIdIn(Set.of("group-member"))).thenReturn(List.of(groupMember));
        when(homeUserProfileService.toGameCardUserDto(groupMember)).thenReturn(null);

        ActivityInviteCandidatesPageDto response = service.queryCandidates(new ActivityInviteCandidatesRequestDto(
                "active",
                "asset-1",
                "asset",
                "group-a",
                "group",
                "recent",
                0,
                16,
                List.of("already-on-resource")));

        assertThat(response.items()).extracting(entry -> entry.userId()).containsExactly("group-member");
        assertThat(response.total()).isEqualTo(1);
    }

    @Test
    void childCandidatesReturnPersistedPendingInvitesBeforeAvailableParentMembers() {
        Users activeUser = user("active", "Active User");
        Users pendingUser = user("pending-child", "Pending Child");
        Users parentMember = user("parent-member", "Parent Member");
        when(homeUserProfileService.resolveCurrentUser("active")).thenReturn(activeUser);
        ActivityMember pendingMember = new ActivityMember();
        pendingMember.setOwnerType("asset");
        pendingMember.setOwnerId("asset-1");
        pendingMember.setUserId("pending-child");
        pendingMember.setStatus("pending");
        pendingMember.setRequestKind("invite");
        pendingMember.setActionAtIso("2026-07-21T12:00:00Z");
        when(activitiesMembersService.queryOwnerSnapshot("asset", "asset-1"))
                .thenReturn(new ActivitiesMembersService.OwnerMembersSnapshot(
                        "asset",
                        "asset-1",
                        List.of(pendingMember),
                        List.of("already-assigned"),
                        List.of("pending-child"),
                        List.of("pending-child"),
                        List.of(),
                        Set.of(),
                        10));
        ActivityMember member = new ActivityMember();
        member.setOwnerType("group");
        member.setOwnerId("group-a");
        member.setUserId("parent-member");
        member.setStatus("accepted");
        member.setActionAtIso("2026-07-20T12:00:00Z");
        when(activityMembersRepository.findByOwnerTypeAndOwnerIdAndStatusAndUserIdNotIn(
                eq("group"),
                eq("group-a"),
                eq("accepted"),
                eq(Set.of("active", "already-assigned", "pending-child")),
                any(Pageable.class)))
                .thenReturn(new PageImpl<>(List.of(member)));
        when(usersRepository.findByUserIdIn(Set.of("pending-child", "parent-member")))
                .thenReturn(List.of(pendingUser, parentMember));
        when(homeUserProfileService.toGameCardUserDto(pendingUser)).thenReturn(null);
        when(homeUserProfileService.toGameCardUserDto(parentMember)).thenReturn(null);

        ActivityInviteCandidatesPageDto response = service.queryCandidates(new ActivityInviteCandidatesRequestDto(
                "active",
                "asset-1",
                "asset",
                "group-a",
                "group",
                "recent",
                0,
                16,
                List.of("already-assigned", "pending-child"),
                List.of("pending-child")));

        assertThat(response.items()).extracting(entry -> entry.userId())
                .containsExactly("pending-child", "parent-member");
        assertThat(response.total()).isEqualTo(2);
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

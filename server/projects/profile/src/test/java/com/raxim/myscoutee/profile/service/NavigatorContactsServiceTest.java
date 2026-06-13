package com.raxim.myscoutee.profile.service;

import static com.raxim.myscoutee.profile.data.dto.navigator.NavigatorContactsDtos.NavigatorContactDeleteRequestDto;
import static com.raxim.myscoutee.profile.data.dto.navigator.NavigatorContactsDtos.NavigatorContactDto;
import static com.raxim.myscoutee.profile.data.dto.navigator.NavigatorContactsDtos.NavigatorContactMethodDto;
import static com.raxim.myscoutee.profile.data.dto.navigator.NavigatorContactsDtos.NavigatorContactsSaveRequestDto;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.raxim.myscoutee.profile.data.document.NavigatorContactsProfile;
import com.raxim.myscoutee.profile.data.document.Users;
import com.raxim.myscoutee.profile.repository.NavigatorContactsProfilesRepository;
import com.raxim.myscoutee.profile.repository.UsersRepository;

@ExtendWith(MockitoExtension.class)
class NavigatorContactsServiceTest {
    @Mock
    private NavigatorContactsProfilesRepository navigatorContactsProfilesRepository;
    @Mock
    private HomeUserProfileService homeUserProfileService;
    @Mock
    private UserExperienceProfilesService userExperienceProfilesService;
    @Mock
    private UsersRepository usersRepository;

    private NavigatorContactsService service;

    @BeforeEach
    void setUp() {
        service = new NavigatorContactsService(
                navigatorContactsProfilesRepository,
                homeUserProfileService,
                userExperienceProfilesService,
                usersRepository);
    }

    @Test
    void saveContactsReplacesOwnerContactsAndUpdatesUserCounter() {
        when(homeUserProfileService.resolveSelectedUserId("owner")).thenReturn("owner");
        when(navigatorContactsProfilesRepository.findByUserId("owner")).thenReturn(Optional.empty());
        when(navigatorContactsProfilesRepository.save(any(NavigatorContactsProfile.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));
        Users user = new Users();
        user.setUserId("owner");
        user.setActivities(new Users.UserActivitiesRecord(
                2,
                4,
                6,
                8,
                10,
                1,
                1,
                1,
                1,
                0,
                3,
                new Users.UserEventCountersRecord(8, 4, 1, 1, 2, 0, 0),
                new Users.UserAssetCountersRecord(1, 1, 1, 1),
                new Users.UserEventFeedbackCountersRecord(1, 2, 3, 4),
                5,
                7));
        when(usersRepository.findByUserId("owner")).thenReturn(Optional.of(user));

        List<NavigatorContactDto> response = service.saveContacts(new NavigatorContactsSaveRequestDto(
                "owner",
                List.of(new NavigatorContactDto(
                        "contact-1",
                        "member-1",
                        "  Iris Bloom  ",
                        "IB",
                        "woman",
                        "Miami",
                        "https://example.test/iris.jpg",
                        "Adventurer",
                        "2026-04-01T00:00:00Z",
                        "2026-04-02T00:00:00Z",
                        List.of(
                                new NavigatorContactMethodDto("email-1", "email", " iris@example.test "),
                                new NavigatorContactMethodDto("bad-1", "unknown", "+1 555 0101"),
                                new NavigatorContactMethodDto("blank-1", "phone", "   "))))));

        assertThat(response).hasSize(1);
        NavigatorContactDto savedContact = response.get(0);
        assertThat(savedContact.id()).isEqualTo("contact-1");
        assertThat(savedContact.userId()).isEqualTo("member-1");
        assertThat(savedContact.name()).isEqualTo("Iris Bloom");
        assertThat(savedContact.gender()).isEqualTo("woman");
        assertThat(savedContact.methods()).extracting(NavigatorContactMethodDto::type)
                .containsExactly("email", "phone");
        assertThat(savedContact.methods()).extracting(NavigatorContactMethodDto::value)
                .containsExactly("iris@example.test", "+1 555 0101");

        ArgumentCaptor<NavigatorContactsProfile> contactsCaptor = ArgumentCaptor.forClass(NavigatorContactsProfile.class);
        verify(navigatorContactsProfilesRepository).save(contactsCaptor.capture());
        assertThat(contactsCaptor.getValue().getUserId()).isEqualTo("owner");
        assertThat(contactsCaptor.getValue().getContacts()).hasSize(1);

        ArgumentCaptor<Users> userCaptor = ArgumentCaptor.forClass(Users.class);
        verify(usersRepository).save(userCaptor.capture());
        assertThat(userCaptor.getValue().getActivities().contacts()).isEqualTo(1);
        assertThat(userCaptor.getValue().getActivities().events()).isEqualTo(8);
        assertThat(userCaptor.getValue().getActivities().feedback()).isEqualTo(3);
    }

    @Test
    void deleteContactRemovesOneStoredContactAndUpdatesUserCounter() {
        when(homeUserProfileService.resolveSelectedUserId("owner")).thenReturn("owner");
        NavigatorContactsProfile profile = new NavigatorContactsProfile();
        profile.setUserId("owner");
        profile.setContacts(List.of(
                contactRecord("contact-1", "member-1", "Iris Bloom"),
                contactRecord("contact-2", "member-2", "Noah Lane")));
        when(navigatorContactsProfilesRepository.findByUserId("owner")).thenReturn(Optional.of(profile));
        when(navigatorContactsProfilesRepository.save(any(NavigatorContactsProfile.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));
        Users user = new Users();
        user.setUserId("owner");
        user.setActivities(null);
        when(usersRepository.findByUserId("owner")).thenReturn(Optional.of(user));

        List<NavigatorContactDto> response = service.deleteContact(
                "contact-1",
                new NavigatorContactDeleteRequestDto("owner"));

        assertThat(response).extracting(NavigatorContactDto::id).containsExactly("contact-2");
        ArgumentCaptor<Users> userCaptor = ArgumentCaptor.forClass(Users.class);
        verify(usersRepository).save(userCaptor.capture());
        assertThat(userCaptor.getValue().getActivities().contacts()).isEqualTo(1);
        assertThat(userCaptor.getValue().getActivities().event().all()).isZero();
        assertThat(userCaptor.getValue().getActivities().asset().tickets()).isZero();
    }

    @Test
    void loadContactsReturnsStoredContactsForResolvedUser() {
        when(homeUserProfileService.resolveSelectedUserId("requested")).thenReturn("owner");
        NavigatorContactsProfile profile = new NavigatorContactsProfile();
        profile.setUserId("owner");
        profile.setContacts(List.of(contactRecord("contact-1", "member-1", "Iris Bloom")));
        when(navigatorContactsProfilesRepository.findByUserId("owner")).thenReturn(Optional.of(profile));

        List<NavigatorContactDto> response = service.loadContacts("requested");

        assertThat(response).hasSize(1);
        assertThat(response.get(0).id()).isEqualTo("contact-1");
        assertThat(response.get(0).userId()).isEqualTo("member-1");
        assertThat(response.get(0).methods()).extracting(NavigatorContactMethodDto::type)
                .containsExactly("email");
    }

    private NavigatorContactsProfile.NavigatorContactRecord contactRecord(String id, String userId, String name) {
        NavigatorContactsProfile.NavigatorContactRecord record = new NavigatorContactsProfile.NavigatorContactRecord();
        record.setId(id);
        record.setUserId(userId);
        record.setName(name);
        record.setInitials("IB");
        record.setGender("woman");
        record.setCity("Miami");
        record.setAvatarUrl("https://example.test/avatar.jpg");
        record.setHeadline("Adventurer");
        record.setCreatedAtIso("2026-04-01T00:00:00Z");
        record.setUpdatedAtIso("2026-04-02T00:00:00Z");
        NavigatorContactsProfile.NavigatorContactMethodRecord method = new NavigatorContactsProfile.NavigatorContactMethodRecord();
        method.setId("email");
        method.setType("email");
        method.setValue("iris@example.test");
        record.setMethods(List.of(method));
        return record;
    }
}

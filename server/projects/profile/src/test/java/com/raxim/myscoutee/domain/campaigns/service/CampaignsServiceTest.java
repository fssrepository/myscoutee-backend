package com.raxim.myscoutee.domain.campaigns.service;

import com.raxim.myscoutee.domain.accounts.repository.UsersRepository;
import com.raxim.myscoutee.domain.accounts.service.HomeUserProfileService;
import com.raxim.myscoutee.domain.affinity.repository.UserRatesRepository;
import com.raxim.myscoutee.domain.campaigns.repository.CampaignsRepository;
import com.raxim.myscoutee.domain.chat.repository.ChatsRepository;
import com.raxim.myscoutee.domain.groups.repository.CommunityGroupsRepository;
import com.raxim.myscoutee.domain.accounts.service.CommunityGroupProfilesService;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;
import java.util.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.web.server.ResponseStatusException;
import com.raxim.myscoutee.domain.campaigns.document.Campaign;
import com.raxim.myscoutee.domain.accounts.document.Users;
import com.raxim.myscoutee.domain.affinity.document.UserRate;
import com.raxim.myscoutee.domain.campaigns.dto.CampaignDtos.*;

@org.junit.jupiter.api.Tag("standard")
class CampaignsServiceTest {
    final CampaignsRepository repository = mock(CampaignsRepository.class);
    final UsersRepository users = mock(UsersRepository.class);
    final UserRatesRepository rates = mock(UserRatesRepository.class);
    final ChatsRepository chats = mock(ChatsRepository.class);
    final Map<String, Campaign> records = new LinkedHashMap<>();
    CampaignsService service;
    Users owner = user("owner", "work");
    Users member = user("member", "work");
    @BeforeEach void setup() {
        service = new CampaignsService(new com.raxim.myscoutee.domain.affinity.service.CampaignRatingEvidenceService(rates),
                new com.raxim.myscoutee.domain.chat.service.CampaignConversationService(chats), repository,
                new com.raxim.myscoutee.domain.accounts.service.ProfileDirectoryService(users),
                new com.raxim.myscoutee.domain.groups.service.GroupDirectoryService(mock(CommunityGroupsRepository.class)),
                mock(CommunityGroupProfilesService.class), mock(HomeUserProfileService.class));
        when(repository.findById(anyString())).thenAnswer(call -> Optional.ofNullable(records.get(call.getArgument(0))));
        when(repository.save(any())).thenAnswer(call -> {
            Campaign c = call.getArgument(0);
            Campaign saved = new Campaign(c.id(), c.workspaceGroupId(), c.ownerUserId(), c.title(), c.description(), c.kind(), c.category(),
                    c.imageUrls(), c.attachments(), c.status(), c.createdAtIso(), c.updatedAtIso(), c.version() == null ? 0L : c.version() + 1);
            records.put(c.id(), saved); return saved;
        });
        when(users.findByUserId("owner")).thenReturn(Optional.of(owner));
        when(users.findByUserId("member")).thenReturn(Optional.of(member));
    }
    @Test void ordinaryMemberCanOrganizeAndParticipateWithoutAppAdminPrivileges() {
        Item first = service.save(owner, draft("owner"));
        Item second = service.save(member, draft("member"));
        assertThat(second.ownerUserId()).isEqualTo("member");
        assertThat(member.getHostTier()).isNull();
        assertThatThrownBy(() -> service.detail(member, first.id())).isInstanceOf(ResponseStatusException.class);
        Item published = service.action(owner, first.id(), new Command("owner", "publish", first.version()));
        assertThat(service.detail(member, published.id()).title()).isEqualTo("A practical idea");
        assertThatThrownBy(() -> service.action(member, first.id(), new Command("member", "trash", published.version())))
                .isInstanceOf(ResponseStatusException.class);
        assertThat(member.getHostTier()).isNull();
    }
    @Test void campaignLifecycleAndVersionsAreIndependentOfEvents() {
        Item first = service.save(owner, draft("owner"));
        Item published = service.action(owner, first.id(), new Command("owner", "publish", first.version()));
        assertThatThrownBy(() -> service.action(owner, first.id(), new Command("owner", "trash", first.version())))
                .isInstanceOfSatisfying(ResponseStatusException.class, e -> assertThat(e.getStatusCode().value()).isEqualTo(409));
        Item trash = service.action(owner, first.id(), new Command("owner", "trash", published.version()));
        assertThatThrownBy(() -> service.detail(member, first.id())).isInstanceOf(ResponseStatusException.class);
        assertThat(service.action(owner, first.id(), new Command("owner", "restore", trash.version())).status()).isEqualTo("draft");
    }
    @Test void publishedCampaignDoesNotCrossWorkspaceBoundary() {
        Item first = service.save(owner, draft("owner"));
        service.action(owner, first.id(), new Command("owner", "publish", first.version()));
        assertThatThrownBy(() -> service.detail(user("outside", "dating"), first.id()))
                .isInstanceOfSatisfying(ResponseStatusException.class, e -> assertThat(e.getStatusCode().value()).isEqualTo(404));
    }
    @Test void detailAndHistoryExposeTheViewersCampaignRatingInsteadOfThePeersScore() {
        Item draft = service.save(owner, draft("owner"));
        Item published = service.action(owner, draft.id(), new Command("owner", "publish", draft.version()));
        UserRate given = rating("member", "owner", published.id(), 6, "2026-10-06T08:00:00Z");
        UserRate received = rating("owner", "member", published.id(), 9, "2026-10-06T09:00:00Z");
        when(rates.findRelevantInCampaign("member", published.id())).thenReturn(List.of(given, received));
        when(rates.findEvidenceForPair("member", "owner")).thenReturn(List.of(given, received));
        when(repository.findAllById(any())).thenReturn(List.of(records.get(published.id())));
        assertThat(service.detail(member, published.id()).viewerRating()).isEqualTo(6d);
        var history = service.history(member, "owner", 5, null);
        assertThat(history.items()).hasSize(1);
        assertThat(history.items().getFirst().campaign().viewerRating()).isEqualTo(6d);
        assertThat(history.items().getFirst().lastInteractionAtIso()).isEqualTo("2026-10-06T09:00:00Z");
        verify(rates, times(1)).findEvidenceForPair("member", "owner");
        verify(rates, never()).findByOwnerUserId(anyString());
    }
    @Test void actorResolutionKeepsWorkMembershipAndAccountChecks() {
        var profiles = mock(com.raxim.myscoutee.domain.accounts.api.CurrentProfile.class);
        var groups = mock(com.raxim.myscoutee.domain.groups.api.GroupDirectory.class);
        var workspaces = mock(com.raxim.myscoutee.domain.groups.api.WorkspaceMembership.class);
        var isolated = new CampaignsService(mock(com.raxim.myscoutee.domain.affinity.api.CampaignRatings.class),
                mock(com.raxim.myscoutee.domain.chat.api.CampaignConversations.class), repository,
                mock(com.raxim.myscoutee.domain.accounts.api.ProfileDirectory.class), groups, workspaces, profiles);
        when(profiles.resolveCurrentUser("owner")).thenReturn(owner);
        when(groups.type("work")).thenReturn(Optional.of(new com.raxim.myscoutee.domain.groups.api.GroupDirectory.GroupType("work", "community")));
        assertThatThrownBy(() -> isolated.actor("owner")).isInstanceOfSatisfying(ResponseStatusException.class,
                error -> assertThat(error.getStatusCode().value()).isEqualTo(403));
        verifyNoInteractions(workspaces);
        when(groups.type("work")).thenReturn(Optional.of(new com.raxim.myscoutee.domain.groups.api.GroupDirectory.GroupType("work", "work")));
        owner.setAccountUserId("account");
        when(workspaces.select("account", "work")).thenReturn(owner);
        assertThat(isolated.actor("owner")).isSameAs(owner);
        owner.setAccountUserId(null);
        assertThatThrownBy(() -> isolated.actor("owner")).isInstanceOfSatisfying(ResponseStatusException.class,
                error -> assertThat(error.getStatusCode().value()).isEqualTo(403));
        verify(workspaces, times(1)).select("account", "work");
    }

    private static UserRate rating(String actor, String target, String campaignId, int score, String date) {
        UserRate rate = new UserRate(); rate.setOwnerUserId(actor); rate.setRelatedUserId(target);
        rate.setMode("single"); rate.setCampaignId(campaignId); rate.setScoreGiven(score); rate.setUpdatedDate(date);
        return rate;
    }
    private static Save draft(String userId) {
        return new Save(userId, null, "A practical idea", "Build a team", "business", "technology", List.of(), List.of(), null);
    }
    private static Users user(String id, String groupId) {
        Users user = new Users(); user.setUserId(id); user.setWorkspaceGroupId(groupId); user.setName(id); return user;
    }
}

package com.raxim.myscoutee.domain.community.service;
import com.raxim.myscoutee.domain.community.dto.CaseDetails;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import com.raxim.myscoutee.domain.community.document.ServiceCase;
import com.raxim.myscoutee.domain.community.repository.ServiceCasesRepository;

@Tag("standard")
class CaseParticipantsServiceTest {
    @Test void conversationKeepsPrivateOfferMembershipSeparateFromTheMainCase() {
        var repository = mock(ServiceCasesRepository.class);
        var record = new ServiceCase("case", "myscoutee-community", "homes", "owner", "Title", "", "maintenance", "open", false,
                List.of("owner", "resident"), List.of("owner", "resident", "provider-a", "provider-b", "invited", "removed"), List.of(),
                List.of(new CaseDetails.Support("provider-a", "a", "accepted"), new CaseDetails.Support("provider-b", "b", "accepted")), List.of(),
                List.of(offer("offer-a", "provider-a"), offer("offer-b", "provider-b")), null, null, "now", "now", 1L,
                Map.of("invited", "invited", "removed", "removed"), List.of(), List.of("provider-b"));
        when(repository.findById("case")).thenReturn(Optional.of(record));
        var conversation = new CaseParticipantsService(repository, null, null).conversation("case").orElseThrow();
        assertThat(conversation.activeParticipantAccountIds()).containsExactly("owner", "resident", "provider-a", "provider-b");
        assertThat(conversation.chatParticipantAccountIds()).containsExactly("owner", "resident", "provider-b");
        assertThat(conversation.offerChatParticipantAccountIds("offer-a")).containsExactly("owner", "resident", "provider-a");
        assertThat(conversation.offerChatParticipantAccountIds("offer-b")).containsExactly("owner", "resident", "provider-b");
        assertThat(conversation.offerChatParticipantAccountIds("missing")).isEmpty();
        verify(repository).findById("case"); verifyNoMoreInteractions(repository);
    }
    @Test void administratorChangesUseTheExistingWriteOwner() {
        var repository = mock(ServiceCasesRepository.class);
        var writer = mock(CommunityCaseCounterWork.class);
        var service = new CaseParticipantsService(repository, null, null);
        org.springframework.test.util.ReflectionTestUtils.setField(service, "counterWork", writer);
        var votes = mock(CommunityVoteCounterWork.class);
        org.springframework.test.util.ReflectionTestUtils.setField(service, "votes", votes);
        service.groupAdminsChanged("homes", List.of("admin"));
        verify(votes).membersChanged("homes");
        verify(writer).groupAdminsChanged("homes", List.of("admin"));
        verifyNoInteractions(repository);
    }
    private CaseDetails.Offer offer(String id, String provider) {
        return new CaseDetails.Offer(id, provider, "service", 25, "EUR", "", "accepted", "now", null, null, List.of(), List.of());
    }
}

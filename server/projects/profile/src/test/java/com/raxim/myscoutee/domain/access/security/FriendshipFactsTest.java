package com.raxim.myscoutee.domain.access.security;

import com.raxim.myscoutee.domain.accounts.service.FriendshipFacts;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;
import java.util.List;
import java.util.stream.IntStream;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import com.raxim.myscoutee.domain.accounts.document.UserFriendship;
import com.raxim.myscoutee.domain.accounts.repository.UserFriendshipsRepository;

@org.junit.jupiter.api.Tag("standard")
class FriendshipFactsTest {
    private final UserFriendshipsRepository repository = mock(UserFriendshipsRepository.class);
    private final FriendshipFacts facts = new FriendshipFacts(repository, null);

    @AfterEach void clearRequest() { RequestContextHolder.resetRequestAttributes(); }

    @Test void scrollingPageChecksOneHundredCandidatesWithOneAdjacencyRead() {
        RequestContextHolder.setRequestAttributes(new ServletRequestAttributes(new MockHttpServletRequest()));
        when(repository.findRelevantByUserIds(List.of("viewer"))).thenReturn(IntStream.range(0, 100)
                .mapToObj(i -> new UserFriendship("pair" + i, "viewer", "candidate" + i, null, null, null, null, null)).toList());
        for (int i = 0; i < 100; i++) assertThat(facts.areFriends("candidate" + i, "viewer")).isTrue();
        assertThat(facts.areFriends("outsider", "viewer")).isFalse();
        verify(repository).findRelevantByUserIds(List.of("viewer"));
        verifyNoMoreInteractions(repository);
        // The following HTTP request must see revocations; no global authorization cache.
        RequestContextHolder.setRequestAttributes(new ServletRequestAttributes(new MockHttpServletRequest()));
        when(repository.findRelevantByUserIds(List.of("viewer"))).thenReturn(List.of());
        assertThat(facts.areFriends("candidate0", "viewer")).isFalse();
        verify(repository, times(2)).findRelevantByUserIds(List.of("viewer"));
    }

    @Test void directImageCheckUsesOneCanonicalPairLookupNotTheWholeNetwork() {
        when(repository.existsById("1:ab")).thenReturn(true);
        assertThat(facts.pairExists("b", "a")).isTrue();
        verify(repository).existsById("1:ab");
        verifyNoMoreInteractions(repository);
        assertThat(facts.pairExists("a", "a")).isFalse();
        assertThat(facts.pairExists("a", null)).isFalse();
    }
}

package com.raxim.myscoutee.profile.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.mongodb.core.FindAndModifyOptions;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.web.server.ResponseStatusException;

import com.raxim.myscoutee.profile.data.document.IntegrationToken;
import com.raxim.myscoutee.profile.data.dto.integration.IntegrationDtos.IntegrationTokenCreateRequestDto;
import com.raxim.myscoutee.profile.repository.IntegrationTokensRepository;

@ExtendWith(MockitoExtension.class)
class IntegrationTokenServiceTest {
    @Mock
    private IntegrationTokensRepository tokensRepository;
    @Mock
    private MongoTemplate mongoTemplate;

    private IntegrationTokenService service;

    @BeforeEach
    void setUp() {
        service = new IntegrationTokenService(tokensRepository, mongoTemplate);
    }

    @Test
    void createReturnsSecretOnceAndPersistsOnlyItsHash() {
        when(tokensRepository.findByOwnerUserIdOrderByCreatedAtIsoDesc("owner-1")).thenReturn(List.of());
        when(tokensRepository.save(any(IntegrationToken.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        var created = service.create("owner-1", new IntegrationTokenCreateRequestDto("Hotel PMS", 30));

        assertThat(created.value()).startsWith("msc_");
        assertThat(created.token().name()).isEqualTo("Hotel PMS");
        org.mockito.ArgumentCaptor<IntegrationToken> tokenCaptor =
                org.mockito.ArgumentCaptor.forClass(IntegrationToken.class);
        verify(tokensRepository).save(tokenCaptor.capture());
        assertThat(tokenCaptor.getValue().getTokenHash()).isNotEqualTo(created.value());
        assertThat(tokenCaptor.getValue().getTokenPrefix()).isEqualTo(created.value().substring(0, 12));
    }

    @Test
    void createRejectsFourthActiveClientSlot() {
        when(tokensRepository.findByOwnerUserIdOrderByCreatedAtIsoDesc("owner-1"))
                .thenReturn(List.of(activeToken("one"), activeToken("two"), activeToken("three")));

        assertThatThrownBy(() -> service.create(
                "owner-1",
                new IntegrationTokenCreateRequestDto("four", 90)))
                .isInstanceOf(ResponseStatusException.class)
                .hasMessageContaining("at most 3");
        verify(tokensRepository, never()).save(any());
    }

    @Test
    void authenticateRequiresUuidClientAndReturnsClaimedTokenOwner() {
        IntegrationToken claimed = activeToken("slot");
        claimed.setOwnerUserId("owner-1");
        claimed.setId("token-1");
        when(mongoTemplate.findAndModify(
                any(Query.class),
                any(Update.class),
                any(FindAndModifyOptions.class),
                eq(IntegrationToken.class)))
                .thenReturn(claimed);

        String owner = service.authenticate(
                "msc_abcdefghijklmnopqrstuvwxyz",
                "45a87d78-4fe4-4bbb-8cb4-5fb8d423f5e8",
                "203.0.113.8");

        assertThat(owner).isEqualTo("owner-1");
        verify(mongoTemplate).findAndModify(
                any(Query.class),
                any(Update.class),
                any(FindAndModifyOptions.class),
                eq(IntegrationToken.class));
    }

    @Test
    void authenticateRejectsMissingOrMalformedClientIdBeforeDatabaseLookup() {
        assertThat(service.authenticate("msc_abcdefghijklmnopqrstuvwxyz", "not-a-uuid", "203.0.113.8"))
                .isNull();
        verify(mongoTemplate, never()).findAndModify(
                any(Query.class),
                any(Update.class),
                any(FindAndModifyOptions.class),
                eq(IntegrationToken.class));
    }

    private IntegrationToken activeToken(String name) {
        IntegrationToken token = new IntegrationToken();
        token.setName(name);
        token.setExpiresAtIso(Instant.now().plus(30, ChronoUnit.DAYS).toString());
        return token;
    }
}

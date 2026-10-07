package com.raxim.myscoutee.domain.help.service;

import com.raxim.myscoutee.domain.administration.service.AdminTelemetryService;
import com.raxim.myscoutee.domain.content.service.AdminModerationService;
import com.raxim.myscoutee.domain.platform.service.AppSettingsService;
import com.raxim.myscoutee.domain.platform.service.JobGroupContext;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicInteger;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.dao.DuplicateKeyException;

import com.raxim.myscoutee.common.config.mongo.MongoSessionMode;
import com.raxim.myscoutee.common.config.mongo.MongoSessionModeContext;
import com.raxim.myscoutee.domain.platform.config.ConfigProperties;
import com.raxim.myscoutee.domain.help.document.HelpCenterAuditEntry;
import com.raxim.myscoutee.domain.help.document.HelpCenterRevision;
import com.raxim.myscoutee.domain.help.dto.HelpCenterDtos.HelpCenterRevisionSaveRequestDto;
import com.raxim.myscoutee.domain.help.dto.HelpCenterDtos.HelpCenterSectionDto;
import com.raxim.myscoutee.domain.help.dto.HelpCenterDtos.PrivacyConsentSaveRequestDto;
import com.raxim.myscoutee.domain.help.repository.HelpCenterAuditRepository;
import com.raxim.myscoutee.domain.help.repository.HelpCenterGuideFieldsRepository;
import com.raxim.myscoutee.domain.help.repository.HelpCenterRevisionsRepository;
import com.raxim.myscoutee.domain.accounts.repository.PrivacyConsentsRepository;
import com.raxim.myscoutee.domain.access.security.AccessControlService;

@ExtendWith(MockitoExtension.class)
@org.junit.jupiter.api.Tag("standard")
class HelpCenterServiceTest {
    @Mock
    private HelpCenterRevisionsRepository revisionsRepository;
    @Mock
    private HelpCenterAuditRepository auditRepository;
    @Mock
    private HelpCenterGuideFieldsRepository guideFieldsRepository;
    @Mock
    private PrivacyConsentsRepository privacyConsentsRepository;
    @Mock
    private AdminTelemetryService adminTelemetryService;
    @Mock
    private AppSettingsService appSettingsService;
    @Mock
    private AccessControlService accessControlService;

    private HelpCenterService service;

    @BeforeEach
    void setUp() {
        MongoSessionModeContext.set(MongoSessionMode.DEMO);
        service = new HelpCenterService(
                new ConfigProperties(),
                revisionsRepository,
                auditRepository,
                guideFieldsRepository,
                privacyConsentsRepository,
                adminTelemetryService,
                appSettingsService,
                accessControlService);
        org.springframework.test.util.ReflectionTestUtils.setField(service, "adminModerationService", org.mockito.Mockito.mock(AdminModerationService.class));
    }

    @AfterEach
    void tearDown() {
        MongoSessionModeContext.clear();
    }

    @Test
    void workAdminCannotActivateOrDeleteADatingRevision() {
        var moderation = org.mockito.Mockito.mock(AdminModerationService.class);
        org.springframework.test.util.ReflectionTestUtils.setField(service, "adminModerationService", moderation);
        when(moderation.baseGroupId("work-admin")).thenReturn("myscoutee-work");
        var dating = revision("dating", 1);
        when(revisionsRepository.findById("dating")).thenReturn(Optional.of(dating));
        var request = new com.raxim.myscoutee.domain.help.dto.HelpCenterDtos.HelpCenterAdminActionRequestDto("work-admin");
        assertThatThrownBy(() -> service.activateRevision("dating", request, "help")).isInstanceOf(org.springframework.web.server.ResponseStatusException.class);
        assertThatThrownBy(() -> service.deleteRevision("dating", request, "help")).isInstanceOf(org.springframework.web.server.ResponseStatusException.class);
        verify(revisionsRepository, never()).save(any());
        verify(revisionsRepository, never()).delete(any());
        assertThat(JobGroupContext.isActive()).isFalse();
    }

    @Test
    void saveRevisionRetriesVersionWhenConcurrentInsertWins() {
        HelpCenterRevision versionOne = revision("one", 1);
        HelpCenterRevision concurrentVersionTwo = revision("two", 2);
        versionOne.setContextKey("profile.impressions");
        concurrentVersionTwo.setContextKey("profile.impressions");
        AtomicInteger revisionReads = new AtomicInteger();
        when(guideFieldsRepository.existsByScreenKey("profile.impressions")).thenReturn(true);
        when(revisionsRepository.findByBaseGroupIdOrderByVersionDesc(null))
                .thenAnswer(invocation -> revisionReads.getAndIncrement() == 0
                        ? List.of(versionOne)
                        : List.of(concurrentVersionTwo, versionOne));
        when(revisionsRepository.save(any(HelpCenterRevision.class)))
                .thenThrow(new DuplicateKeyException("duplicate version"))
                .thenAnswer(invocation -> {
                    HelpCenterRevision revision = invocation.getArgument(0);
                    revision.setId("saved");
                    return revision;
                });
        when(auditRepository.save(any(HelpCenterAuditEntry.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));
        when(auditRepository.findByBaseGroupIdOrderByCreatedDateDesc(null)).thenReturn(List.of());

        service.saveRevision(new HelpCenterRevisionSaveRequestDto(
                "admin",
                null,
                "profile.impressions",
                "en",
                "Concurrent explanation",
                "summary",
                "description",
                "blue",
                "tour",
                List.of(new HelpCenterSectionDto(
                        "section",
                        "info",
                        "Section",
                        "blurb",
                        "<p>Body</p>",
                        List.of(),
                        "single",
                        false,
                        "rate-social"))),
                "explanation");

        ArgumentCaptor<HelpCenterRevision> revisionCaptor = ArgumentCaptor.forClass(HelpCenterRevision.class);
        verify(revisionsRepository, org.mockito.Mockito.times(2)).save(revisionCaptor.capture());
        assertThat(revisionCaptor.getAllValues())
                .extracting(HelpCenterRevision::getVersion)
                .containsExactly(2, 3);
    }

    @Test
    void savePrivacyConsentRejectsDeniedUserBeforeRevisionLookup() {
        when(accessControlService.canCurrentActorSubmitPrivacyConsent("user-1")).thenReturn(false);

        assertThatThrownBy(() -> service.savePrivacyConsent(new PrivacyConsentSaveRequestDto(
                "user-1",
                "revision-1",
                null,
                List.of(),
                "onboarding")))
                .hasMessageContaining("privacy consent");

        verify(revisionsRepository, never()).findById(anyString());
    }

    @Test
    void savePrivacyConsentAllowsOwnUserWhenPolicyAllows() {
        HelpCenterRevision privacy = revision("revision-1", 3);
        privacy.setDocumentType("privacy");
        when(accessControlService.canCurrentActorSubmitPrivacyConsent("user-1")).thenReturn(true);
        when(revisionsRepository.findById("revision-1")).thenReturn(Optional.of(privacy));
        when(privacyConsentsRepository.findByUserIdAndRevisionId("user-1", "revision-1")).thenReturn(Optional.empty());
        when(privacyConsentsRepository.save(any())).thenAnswer(invocation -> invocation.getArgument(0));

        var result = service.savePrivacyConsent(new PrivacyConsentSaveRequestDto(
                "user-1",
                "revision-1",
                null,
                List.of(),
                "onboarding"));

        assertThat(result.userId()).isEqualTo("user-1");
        assertThat(result.revisionVersion()).isEqualTo(3);
    }

    private HelpCenterRevision revision(String id, Integer version) {
        HelpCenterRevision revision = new HelpCenterRevision();
        revision.setId(id);
        revision.setDocumentType("explanation");
        revision.setLang("en");
        revision.setContextKey("home.game");
        revision.setVersion(version);
        revision.setTitle("v" + version);
        return revision;
    }
}

package com.raxim.myscoutee.profile.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
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
import com.raxim.myscoutee.common.config.properties.ConfigProperties;
import com.raxim.myscoutee.profile.data.document.HelpCenterAuditEntry;
import com.raxim.myscoutee.profile.data.document.HelpCenterRevision;
import com.raxim.myscoutee.profile.data.dto.help.HelpCenterDtos.HelpCenterRevisionSaveRequestDto;
import com.raxim.myscoutee.profile.data.dto.help.HelpCenterDtos.HelpCenterSectionDto;
import com.raxim.myscoutee.profile.repository.HelpCenterAuditRepository;
import com.raxim.myscoutee.profile.repository.HelpCenterRevisionsRepository;
import com.raxim.myscoutee.profile.repository.PrivacyConsentsRepository;

@ExtendWith(MockitoExtension.class)
class HelpCenterServiceTest {
    @Mock
    private HelpCenterRevisionsRepository revisionsRepository;
    @Mock
    private HelpCenterAuditRepository auditRepository;
    @Mock
    private PrivacyConsentsRepository privacyConsentsRepository;
    @Mock
    private AdminTelemetryService adminTelemetryService;
    @Mock
    private AppSettingsService appSettingsService;

    private HelpCenterService service;

    @BeforeEach
    void setUp() {
        MongoSessionModeContext.set(MongoSessionMode.DEMO);
        service = new HelpCenterService(
                new ConfigProperties(),
                revisionsRepository,
                auditRepository,
                privacyConsentsRepository,
                adminTelemetryService,
                appSettingsService);
    }

    @AfterEach
    void tearDown() {
        MongoSessionModeContext.clear();
    }

    @Test
    void saveRevisionRetriesVersionWhenConcurrentInsertWins() {
        HelpCenterRevision versionOne = revision("one", 1);
        HelpCenterRevision concurrentVersionTwo = revision("two", 2);
        AtomicInteger revisionReads = new AtomicInteger();
        when(revisionsRepository.findAllByOrderByVersionDesc())
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
        when(auditRepository.findAllByOrderByCreatedDateDesc()).thenReturn(List.of());

        service.saveRevision(new HelpCenterRevisionSaveRequestDto(
                "admin",
                null,
                "home.game",
                "en",
                "Concurrent explanation",
                "summary",
                "description",
                "blue",
                List.of(new HelpCenterSectionDto(
                        "section",
                        "info",
                        "Section",
                        "blurb",
                        "<p>Body</p>",
                        List.of(),
                        "single",
                        false))),
                "explanation");

        ArgumentCaptor<HelpCenterRevision> revisionCaptor = ArgumentCaptor.forClass(HelpCenterRevision.class);
        verify(revisionsRepository, org.mockito.Mockito.times(2)).save(revisionCaptor.capture());
        assertThat(revisionCaptor.getAllValues())
                .extracting(HelpCenterRevision::getVersion)
                .containsExactly(2, 3);
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

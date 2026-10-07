package com.raxim.myscoutee.domain.platform.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.time.Clock;
import java.time.Instant;
import java.time.ZoneOffset;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicReference;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.runner.ApplicationContextRunner;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import com.raxim.myscoutee.common.config.mongo.MongoSessionMode;
import com.raxim.myscoutee.common.config.mongo.MongoSessionModeContext;
import com.raxim.myscoutee.domain.platform.document.AppSettings;
import com.raxim.myscoutee.domain.platform.repository.AppSettingsRepository;

@org.junit.jupiter.api.Tag("standard")
class AppSettingsServiceTest {
    private static final Clock FIXED_CLOCK = Clock.fixed(
            Instant.parse("2026-07-29T08:30:00Z"),
            ZoneOffset.UTC);

    @AfterEach
    void clearMode() {
        MongoSessionModeContext.clear();
    }

    @Test
    void springCanInstantiateServiceWithRepositoryConstructor() {
        AppSettingsRepository repository = mock(AppSettingsRepository.class);
        when(repository.findBySettingsKey(AppSettingsService.GLOBAL_SETTINGS_KEY))
                .thenReturn(Optional.empty());

        new ApplicationContextRunner()
                .withBean(AppSettingsRepository.class, () -> repository)
                .withBean(AppSettingsService.class)
                .run(context -> assertThat(context)
                        .hasSingleBean(AppSettingsService.class));
    }

    @Test
    void cachesAndUpdatesAdminEmailsIndependentlyPerMongoSessionMode() {
        AtomicReference<AppSettings> real = new AtomicReference<>(
                settings("real", List.of("real-admin@example.test")));
        AtomicReference<AppSettings> demo = new AtomicReference<>(
                settings("demo", List.of("demo-admin@example.test")));
        AppSettingsRepository repository = routedRepository(real, demo);
        AppSettingsService service = new AppSettingsService(
                repository,
                FIXED_CLOCK);

        service.refreshCache();

        MongoSessionModeContext.set(MongoSessionMode.REAL);
        assertThat(service.adminEmails())
                .containsExactly("real-admin@example.test");
        assertThat(service.isAdminEmail("REAL-ADMIN@EXAMPLE.TEST")).isTrue();
        assertThat(service.isAdminEmail("demo-admin@example.test")).isFalse();

        MongoSessionModeContext.set(MongoSessionMode.DEMO);
        assertThat(service.adminEmails())
                .containsExactly("demo-admin@example.test");
        assertThat(service.isAdminEmail("real-admin@example.test")).isFalse();

        assertThat(service.updateAdminEmails(List.of(
                " New.Admin@Example.Test ",
                "new.admin@example.test")))
                .containsExactly("new.admin@example.test");
        assertThat(demo.get().getAdminEmails())
                .containsExactly("new.admin@example.test");
        assertThat(demo.get().getUpdatedDate())
                .isEqualTo("2026-07-29T08:30:00Z");

        MongoSessionModeContext.set(MongoSessionMode.REAL);
        assertThat(service.adminEmails())
                .containsExactly("real-admin@example.test");
        assertThat(real.get().getAdminEmails())
                .containsExactly("real-admin@example.test");
    }

    @Test
    void missingSettingsSeedFailsClosedAndIsNeverCreatedByJava() {
        AppSettingsRepository repository = mock(AppSettingsRepository.class);
        when(repository.findBySettingsKey(AppSettingsService.GLOBAL_SETTINGS_KEY))
                .thenReturn(Optional.empty());
        AppSettingsService service = new AppSettingsService(
                repository,
                FIXED_CLOCK);

        service.refreshCache();

        assertThat(service.adminEmails()).isEmpty();
        assertThat(service.isAdminEmail("admin@example.test")).isFalse();
        assertThatThrownBy(() -> service.updateAdminEmails(
                List.of("admin@example.test")))
                .isInstanceOfSatisfying(
                        ResponseStatusException.class,
                        exception -> {
                            assertThat(exception.getStatusCode())
                                    .isEqualTo(HttpStatus.SERVICE_UNAVAILABLE);
                            assertThat(exception.getReason())
                                    .isEqualTo(
                                            "Application settings seed is missing.");
                        });
    }

    private AppSettingsRepository routedRepository(
            AtomicReference<AppSettings> real,
            AtomicReference<AppSettings> demo) {
        AppSettingsRepository repository = mock(AppSettingsRepository.class);
        when(repository.findBySettingsKey(AppSettingsService.GLOBAL_SETTINGS_KEY))
                .thenAnswer(invocation -> Optional.ofNullable(
                        current(real, demo).get()));
        when(repository.save(any(AppSettings.class)))
                .thenAnswer(invocation -> {
                    AppSettings value = invocation.getArgument(0);
                    current(real, demo).set(value);
                    return value;
                });
        return repository;
    }

    private AtomicReference<AppSettings> current(
            AtomicReference<AppSettings> real,
            AtomicReference<AppSettings> demo) {
        return MongoSessionModeContext.currentMode() == MongoSessionMode.DEMO
                ? demo
                : real;
    }

    private AppSettings settings(String id, List<String> emails) {
        AppSettings settings = new AppSettings();
        settings.setId(id);
        settings.setSettingsKey(AppSettingsService.GLOBAL_SETTINGS_KEY);
        settings.setAdminAccessEnabled(true);
        settings.setAdminEmails(emails);
        settings.setCreatedDate("2026-07-29T00:00:00Z");
        settings.setUpdatedDate("2026-07-29T00:00:00Z");
        return settings;
    }
}

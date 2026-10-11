package com.raxim.myscoutee.common.config;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.*;
import java.time.Duration;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.Tag;
import org.springframework.context.annotation.AnnotationConfigApplicationContext;
import com.raxim.myscoutee.domain.platform.api.JobGroupContext;
import com.raxim.myscoutee.domain.platform.api.SchedulingParameters;
import com.raxim.myscoutee.domain.affinity.api.ConfigurationCatalog;
import com.raxim.myscoutee.domain.affinity.document.AffinityConfig;

@Tag("standard")
class PlatformParametersServiceTest {
    @Test void existingMyScouteeCatalogSuppliesTheSameBeanWithoutAnAdapterOrAnotherLookup() {
        var catalog = mock(ConfigurationCatalog.class);
        var config = AffinityConfig.defaults();
        when(catalog.active("default")).thenReturn(config);
        try (var context = new AnnotationConfigApplicationContext()) {
            context.registerBean(ConfigurationCatalog.class, () -> catalog);
            context.register(PlatformParametersService.class);
            context.refresh();
            assertThat(context.getBean(SchedulingParameters.class)).isSameAs(catalog);
            assertThat(context.getBean(PlatformParametersService.class).activeConfig()).isSameAs(config);
            verify(catalog).active("default");
            verifyNoMoreInteractions(catalog);
        }
    }

    @Test void aDeploymentCanSupplySchedulingValuesWithoutAffinityAndKeepsWorkspaceScope() {
        var source = mock(SchedulingParameters.class);
        var settings = mock(SchedulingParameters.Settings.class);
        var jobs = mock(SchedulingParameters.JobParameters.class);
        when(settings.getJobs()).thenReturn(jobs);
        when(source.active("work")).thenReturn(settings);
        when(jobs.getAccountPurgeWindowDays()).thenReturn(45);
        var reader = new PlatformParametersService(source);
        assertThat(JobGroupContext.call("work", () -> reader.accountPurgeWindowDays(30))).isEqualTo(45);
        verify(source).active("work");
        verifyNoMoreInteractions(source);
        assertThat(JobGroupContext.isActive()).isFalse();
    }

    @Test void invalidOrMissingValuesRetainNativeLimitsAndFallbacks() {
        var source = mock(SchedulingParameters.class);
        var settings = mock(SchedulingParameters.Settings.class);
        var jobs = mock(SchedulingParameters.JobParameters.class);
        var notifications = mock(SchedulingParameters.NotificationParameters.class);
        when(source.active("default")).thenReturn(settings);
        when(settings.getJobs()).thenReturn(jobs);
        when(settings.getNotifications()).thenReturn(notifications);
        var reader = new PlatformParametersService(source);
        assertThat(reader.accountPurgeWindowDays(30)).isEqualTo(30);
        assertThat(reader.notificationMaxWorkers(4)).isEqualTo(4);
        assertThat(reader.notificationInitialBackoff(Duration.ofSeconds(60))).isEqualTo(Duration.ofSeconds(60));
        when(jobs.getAccountPurgeWindowDays()).thenReturn(0);
        when(notifications.getMaxWorkers()).thenReturn(65);
        when(notifications.getInitialBackoffSeconds()).thenReturn(-1);
        assertThat(reader.accountPurgeWindowDays(30)).isEqualTo(30);
        assertThat(reader.notificationMaxWorkers(4)).isEqualTo(4);
        assertThat(reader.notificationInitialBackoff(Duration.ofSeconds(60))).isEqualTo(Duration.ofSeconds(60));
        when(jobs.getAccountPurgeWindowDays()).thenReturn(365);
        when(notifications.getMaxWorkers()).thenReturn(64);
        assertThat(reader.accountPurgeWindowDays(30)).isEqualTo(365);
        assertThat(reader.notificationMaxWorkers(4)).isEqualTo(64);
    }
}

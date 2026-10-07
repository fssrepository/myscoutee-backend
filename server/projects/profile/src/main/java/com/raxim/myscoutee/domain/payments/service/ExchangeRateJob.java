package com.raxim.myscoutee.domain.payments.service;

import java.time.Instant;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import com.raxim.myscoutee.common.config.mongo.ScheduledMongoSessionRunner;
import com.raxim.myscoutee.domain.platform.repository.DeploymentConfigurationRepository;
import com.raxim.myscoutee.domain.platform.document.DeploymentConfiguration;
import com.raxim.myscoutee.domain.notifications.service.NotificationRuleRegistryService;

@Service
public class ExchangeRateJob {
    public static final String KEY = "payment-exchange-rates";
    private final ExchangeRateStore store;
    private final ExchangeRateSource source;
    private final DeploymentConfigurationRepository configuration;
    private final NotificationRuleRegistryService rules;
    private final ScheduledMongoSessionRunner sessions;
    private final PaymentEuroService payments;
    public ExchangeRateJob(ExchangeRateStore store, ExchangeRateSource source, DeploymentConfigurationRepository configuration,
            NotificationRuleRegistryService rules, ScheduledMongoSessionRunner sessions, PaymentEuroService payments) {
        this.store = store; this.source = source; this.configuration = configuration;
        this.rules = rules; this.sessions = sessions; this.payments = payments;
    }
    @Scheduled(fixedDelay = 60_000L)
    public void scheduled() {
        sessions.runAcrossConfiguredDatabases(() -> rules.forEachGroup(KEY, () -> {
            Instant now = Instant.now();
            if (rules.shouldRunScheduledRule(KEY, now) && rules.beginScheduledRun(KEY, "admin.jobs.exchange.refreshing", "exchange-rate-job", now) != null)
                run("exchange-rate-job", now);
            else payments.fillMissing(false);
        }));
    }
    public void run(String actor, Instant startedAt) {
        try {
            var config = configuration.findById(DeploymentConfiguration.SINGLETON_ID).orElseThrow();
            String url = config.getPayment().getExchangeRateUrl();
            if (url == null || url.isBlank()) {
                rules.recordRun(KEY, 0, "skipped", "admin.jobs.exchange.unconfigured", actor, startedAt); return;
            }
            var observations = source.fetch(url);
            store.save(observations);
            payments.fillMissing(true);
            rules.recordRun(KEY, observations.size(), "completed", "admin.jobs.exchange.completed", actor, startedAt);
        } catch (Exception error) {
            rules.recordRun(KEY, 0, "failed", "admin.jobs.exchange.failed", actor, startedAt);
        }
    }
}

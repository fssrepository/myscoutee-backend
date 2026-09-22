package com.raxim.myscoutee.profile.service.email;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Map;
import org.bson.Document;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import com.raxim.myscoutee.common.config.mongo.ScheduledMongoSessionRunner;
import com.raxim.myscoutee.profile.data.document.Users;
import com.raxim.myscoutee.profile.service.I18nService;
import com.raxim.myscoutee.profile.service.PlatformParametersService;
import com.raxim.myscoutee.profile.service.notifications.NotificationRuleRegistryService;
import com.raxim.myscoutee.profile.service.operator.OperatorEmailConfigurationService;

/** A deletion episode has one durable delivery claim, independent of subsequent Job runs. */
@Service
public class DeletedAccountWarningWorker {
    public static final String RULE = "account-deletion-warning";
    public static final int WARNING_DAYS = 5;
    private static final String COLLECTION = "accountDeletionWarnings";
    private final MongoTemplate mongo;
    private final PlatformParametersService parameters;
    private final OperatorEmailConfigurationService email;
    private final NotificationRuleRegistryService jobs;
    private final ScheduledMongoSessionRunner databases;
    private final I18nService i18n;
    private final EmailTemplateRenderer templates;
    public DeletedAccountWarningWorker(MongoTemplate mongo, PlatformParametersService parameters,
            OperatorEmailConfigurationService email, NotificationRuleRegistryService jobs, ScheduledMongoSessionRunner databases,
            I18nService i18n, EmailTemplateRenderer templates) {
        this.mongo = mongo; this.parameters = parameters; this.email = email; this.jobs = jobs; this.databases = databases;
        this.i18n = i18n; this.templates = templates;
    }
    @Scheduled(fixedDelayString="${email.account-warning-check-delay-ms:60000}")
    public void tick() { databases.runAcrossConfiguredDatabases(this::run); }
    private void run() {
        Instant now = Instant.now();
        if (!jobs.shouldRunScheduledRule(RULE, now) || jobs.beginScheduledRun(RULE, "account.deletion.warning.started", RULE, now) == null) return;
        try {
            int sent = deliver(now);
            jobs.recordRun(RULE, sent, "completed", email.enabled() ? "account.deletion.warning.completed" : "operator.email.notConfigured", RULE, now);
        } catch (RuntimeException failure) {
            jobs.recordRun(RULE, 0, "failed", "account.deletion.warning.failed", RULE, now); throw failure;
        }
    }
    public int deliver(Instant now) {
        if (!email.enabled()) return 0;
        int graceDays = parameters.accountPurgeWindowDays(30);
        if (graceDays < WARNING_DAYS) return 0;
        // A timed-out/crashed request may already have been accepted by the provider. Never resend it blindly.
        mongo.updateMulti(Query.query(Criteria.where("status").is("sending").and("startedAtIso").lt(now.minusSeconds(120).toString())),
                new Update().set("status", "unknown").set("error", "Delivery outcome is unknown; automatic resend suppressed."), COLLECTION);
        Query candidates = Query.query(Criteria.where("profileStatus").is("deleted").and("deletedAtIso")
                .gt(now.minus(graceDays, ChronoUnit.DAYS).toString())
                .lte(now.minus(graceDays - WARNING_DAYS, ChronoUnit.DAYS).toString())
                .andOperator(Criteria.where("$expr").is(new Document("$ne", java.util.List.of("$deletedAtIso",
                        new Document("$ifNull", java.util.List.of("$deletionWarningFor", "")))))))
                .with(Sort.by("deletedAtIso", "userId")).limit(100);
        int sent = 0, failed = 0;
        var bundle = i18n.getBundle("en", "en", null).data();
        if (bundle == null || !bundle.containsKey("account.deletion.warning.subject") || !bundle.containsKey("account.deletion.warning.body"))
            throw new IllegalStateException("Account deletion email translations are missing.");
        for (Users user : mongo.find(candidates, Users.class)) {
            String episode = user.getDeletedAtIso(), id = user.getUserId() + ":" + episode;
            var existing = mongo.findById(id, Document.class, COLLECTION);
            if (existing != null) { if (!"sending".equals(existing.getString("status"))) markHandled(user); continue; }
            var claim = new Document("_id", id).append("userId", user.getUserId()).append("deletedAtIso", episode)
                    .append("status", "sending").append("startedAtIso", now.toString());
            try { mongo.insert(claim, COLLECTION); } catch (DuplicateKeyException duplicate) { continue; }
            var current = mongo.findOne(Query.query(Criteria.where("userId").is(user.getUserId()).and("profileStatus").is("deleted").and("deletedAtIso").is(episode)), Users.class);
            String status = "cancelled", providerId = null;
            if (current != null) {
                Instant purgeAt = Instant.parse(episode).plus(graceDays, ChronoUnit.DAYS);
                var variables = Map.of("name", current.getName() == null ? "" : current.getName(), "purgeAt", purgeAt.toString());
                EmailSendResult result;
                try {
                    result = email.send(new EmailSendRequest(current.getEmail(), current.getName(), bundle.get("account.deletion.warning.subject"), "",
                            templates.renderText(bundle.get("account.deletion.warning.body"), variables), "", "", "", RULE, Map.of("deletionEpisode", id)));
                } catch (RuntimeException error) { result = new EmailSendResult(false, null, "Email delivery failed."); }
                status = result.accepted() ? "sent" : "failed";
                providerId = result.providerMessageId();
                if (result.accepted()) sent++; else failed++;
            }
            mongo.updateFirst(Query.query(Criteria.where("_id").is(id)), new Update().set("status", status)
                    .set("providerMessageId", providerId).set("finishedAtIso", Instant.now().toString()), COLLECTION);
            markHandled(user);
        }
        if (failed > 0) throw new IllegalStateException("Some deletion warnings were not accepted by the email provider.");
        return sent;
    }
    private void markHandled(Users user) {
        mongo.updateFirst(Query.query(Criteria.where("userId").is(user.getUserId()).and("deletedAtIso").is(user.getDeletedAtIso())),
                new Update().set("deletionWarningFor", user.getDeletedAtIso()), Users.class);
    }
}

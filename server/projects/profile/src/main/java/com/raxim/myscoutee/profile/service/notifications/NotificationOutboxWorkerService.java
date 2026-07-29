package com.raxim.myscoutee.profile.service.notifications;

import java.time.Duration;
import java.time.Instant;
import java.time.LocalTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Collection;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.data.redis.connection.stream.MapRecord;
import org.springframework.data.redis.connection.stream.ReadOffset;
import org.springframework.data.redis.connection.stream.StreamOffset;
import org.springframework.data.redis.connection.stream.StreamReadOptions;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.google.firebase.messaging.FirebaseMessagingException;
import com.google.firebase.messaging.Message;
import com.google.firebase.messaging.MessagingErrorCode;
import com.google.firebase.messaging.MulticastMessage;
import com.google.firebase.messaging.WebpushConfig;
import com.google.firebase.messaging.WebpushFcmOptions;
import com.google.firebase.messaging.WebpushNotification;
import com.mongodb.client.result.UpdateResult;
import com.raxim.myscoutee.common.config.mongo.MongoSessionMode;
import com.raxim.myscoutee.common.config.mongo.MongoSessionModeContext;
import com.raxim.myscoutee.common.config.mongo.ScheduledMongoSessionRunner;
import com.raxim.myscoutee.common.config.properties.ConfigProperties;
import com.raxim.myscoutee.profile.data.document.NotificationOutboxItem;
import com.raxim.myscoutee.profile.data.document.Users;
import com.raxim.myscoutee.profile.repository.NotificationOutboxRepository;
import com.raxim.myscoutee.profile.repository.UsersRepository;
import com.raxim.myscoutee.profile.service.AdminTelemetryService;
import com.raxim.myscoutee.profile.service.ChatWebSocketSessionRegistry;
import com.raxim.myscoutee.profile.service.PlatformParametersService;
import com.raxim.myscoutee.profile.service.RedisStreamRetentionService;
import com.raxim.myscoutee.profile.service.notifications.FirebaseMessagingGateway.FirebaseBatchSendResult;
import com.raxim.myscoutee.profile.service.notifications.FirebaseMessagingGateway.FirebaseTokenSendResult;

@Service
public class NotificationOutboxWorkerService {
    private static final Logger LOGGER = LoggerFactory.getLogger(NotificationOutboxWorkerService.class);
    private static final String DELIVERY_STRATEGY_DIRECT = "direct";
    private static final String DELIVERY_STRATEGY_TOPIC = "topic";

    private final ConfigProperties configProperties;
    private final NotificationOutboxRepository notificationOutboxRepository;
    private final UsersRepository usersRepository;
    private final ChatWebSocketSessionRegistry chatWebSocketSessionRegistry;
    private final MongoTemplate mongoTemplate;
    private final StringRedisTemplate stringRedisTemplate;
    private final PlatformParametersService platformParametersService;
    private final RedisStreamRetentionService redisStreamRetentionService;
    private final AdminTelemetryService adminTelemetryService;
    private final FirebaseMessagingGateway firebaseMessagingGateway;
    private final int batchSize;
    private final int firebaseChunkSize;
    private final int maxRetries;
    private final Duration leaseDuration;
    private final Duration retryBaseDelay;
    private final int deliveryWindowStartHour;
    private final int deliveryWindowEndHour;
    private ObjectProvider<NotificationRuleRegistryService> notificationRuleRegistryServiceProvider;
    private ScheduledMongoSessionRunner scheduledMongoSessionRunner;
    private String lastWakeupStreamId = "0-0";
    private volatile Instant lastScheduledPollAt = Instant.EPOCH;

    public NotificationOutboxWorkerService(
            ConfigProperties configProperties,
            NotificationOutboxRepository notificationOutboxRepository,
            UsersRepository usersRepository,
            ChatWebSocketSessionRegistry chatWebSocketSessionRegistry,
            MongoTemplate mongoTemplate,
            ObjectProvider<StringRedisTemplate> stringRedisTemplateProvider,
            PlatformParametersService platformParametersService,
            AdminTelemetryService adminTelemetryService,
            FirebaseMessagingGateway firebaseMessagingGateway,
            @Value("${notifications.outbox.batch-size:50}") int batchSize,
            @Value("${notifications.outbox.firebase-chunk-size:500}") int firebaseChunkSize,
            @Value("${notifications.outbox.max-retries:5}") int maxRetries,
            @Value("${notifications.outbox.lease-ms:300000}") long leaseMs,
            @Value("${notifications.outbox.retry-base-ms:60000}") long retryBaseMs,
            @Value("${notifications.outbox.delivery-window-start-hour:0}") int deliveryWindowStartHour,
            @Value("${notifications.outbox.delivery-window-end-hour:24}") int deliveryWindowEndHour,
            RedisStreamRetentionService redisStreamRetentionService) {
        this.configProperties = configProperties;
        this.notificationOutboxRepository = notificationOutboxRepository;
        this.usersRepository = usersRepository;
        this.chatWebSocketSessionRegistry = chatWebSocketSessionRegistry;
        this.mongoTemplate = mongoTemplate;
        this.stringRedisTemplate = stringRedisTemplateProvider == null ? null : stringRedisTemplateProvider.getIfAvailable();
        this.platformParametersService = platformParametersService;
        this.redisStreamRetentionService = redisStreamRetentionService;
        this.adminTelemetryService = adminTelemetryService;
        this.firebaseMessagingGateway = firebaseMessagingGateway;
        this.batchSize = Math.max(1, Math.min(500, batchSize));
        this.firebaseChunkSize = Math.max(1, Math.min(500, firebaseChunkSize));
        this.maxRetries = Math.max(1, maxRetries);
        this.leaseDuration = Duration.ofMillis(Math.max(1000L, leaseMs));
        this.retryBaseDelay = Duration.ofMillis(Math.max(1000L, retryBaseMs));
        this.deliveryWindowStartHour = clampHour(deliveryWindowStartHour, 0);
        this.deliveryWindowEndHour = clampHour(deliveryWindowEndHour, 24);
    }

    @org.springframework.beans.factory.annotation.Autowired(required = false)
    void setNotificationRuleRegistryServiceProvider(
            ObjectProvider<NotificationRuleRegistryService> notificationRuleRegistryServiceProvider) {
        this.notificationRuleRegistryServiceProvider = notificationRuleRegistryServiceProvider;
    }

    @org.springframework.beans.factory.annotation.Autowired(required = false)
    void setScheduledMongoSessionRunner(ScheduledMongoSessionRunner scheduledMongoSessionRunner) {
        this.scheduledMongoSessionRunner = scheduledMongoSessionRunner;
    }

    @Scheduled(fixedDelayString = "${notifications.outbox.worker-check-delay-ms:5000}")
    public void processDueNotifications() {
        if (scheduledMongoSessionRunner == null) {
            processDueNotificationsForCurrentDatabase();
            return;
        }
        scheduledMongoSessionRunner.runAcrossConfiguredDatabases(this::processDueNotificationsForCurrentDatabase);
    }

    private void processDueNotificationsForCurrentDatabase() {
        if (!configProperties.isFirebaseEnabled()) {
            return;
        }
        Instant startedAt = Instant.now();
        NotificationRuleRegistryService registry = notificationRuleRegistry();
        boolean ruleConfigured = registry != null
                && registry.findRule(NotificationRuleRegistryService.RULE_NOTIFICATION_OUTBOX).isPresent();
        boolean due = ruleConfigured
                ? registry.shouldRunScheduledRule(NotificationRuleRegistryService.RULE_NOTIFICATION_OUTBOX, startedAt)
                : claimScheduledPoll(startedAt);
        if (!due) {
            return;
        }
        if (ruleConfigured && registry.beginScheduledRun(
                    NotificationRuleRegistryService.RULE_NOTIFICATION_OUTBOX,
                    "Scheduled notification outbox delivery started.",
                    "notification-outbox",
                    startedAt) == null) {
            return;
        }
        try {
            int processedCount = processDueNotificationsNow();
            if (ruleConfigured) {
                registry.recordRun(
                        NotificationRuleRegistryService.RULE_NOTIFICATION_OUTBOX,
                        processedCount,
                        "completed",
                        "Processed pending notification outbox work.",
                        "notification-outbox",
                        startedAt);
            }
        } catch (RuntimeException exception) {
            if (ruleConfigured) {
                registry.recordRun(
                        NotificationRuleRegistryService.RULE_NOTIFICATION_OUTBOX,
                        0,
                        "failed",
                        safeText(exception.getMessage()),
                        "notification-outbox",
                        startedAt);
            }
            throw exception;
        }
    }

    private int processDueNotificationsNow() {
        if (!configProperties.isFirebaseEnabled() || !isInsideDeliveryWindow()) {
            return 0;
        }
        String nowIso = Instant.now().toString();
        List<NotificationOutboxItem> leasedItems = new ArrayList<>();
        for (NotificationOutboxItem item : dueItems(nowIso, effectiveBatchSize())) {
            NotificationOutboxItem leased = lease(item, nowIso).orElse(null);
            if (leased == null) {
                continue;
            }
            leasedItems.add(leased);
        }
        processLeasedItems(leasedItems);
        return leasedItems.size();
    }

    private void processLeasedItems(List<NotificationOutboxItem> leasedItems) {
        if (leasedItems == null || leasedItems.isEmpty()) {
            return;
        }
        int workerCount = Math.min(effectiveMaxWorkers(), leasedItems.size());
        if (workerCount <= 1) {
            leasedItems.forEach(this::processLeasedItem);
            return;
        }

        ExecutorService executorService = Executors.newFixedThreadPool(workerCount);
        MongoSessionMode sessionMode = MongoSessionModeContext.currentMode();
        try {
            List<Future<?>> futures = new ArrayList<>();
            for (NotificationOutboxItem leased : leasedItems) {
                futures.add(executorService.submit(
                        () -> withMongoSessionMode(sessionMode, () -> processLeasedItem(leased))));
            }
            for (Future<?> future : futures) {
                try {
                    future.get();
                } catch (InterruptedException exception) {
                    Thread.currentThread().interrupt();
                    return;
                } catch (Exception exception) {
                    LOGGER.warn("Notification outbox worker task failed.", exception);
                }
            }
        } finally {
            executorService.shutdown();
        }
    }

    private void withMongoSessionMode(MongoSessionMode sessionMode, Runnable action) {
        MongoSessionMode previousMode = MongoSessionModeContext.currentMode();
        try {
            MongoSessionModeContext.set(sessionMode);
            action.run();
        } finally {
            MongoSessionModeContext.set(previousMode);
        }
    }

    private void processLeasedItem(NotificationOutboxItem leased) {
        if (leased == null) {
            return;
        }
        try {
            DeliveryResult result = deliver(leased);
            markSent(leased, result, Instant.now().toString());
        } catch (Exception exception) {
            markFailed(leased, exception, Instant.now());
        }
    }

    @Scheduled(fixedDelayString = "${notifications.outbox.wakeup-poll-delay-ms:5000}")
    @SuppressWarnings("unchecked")
    public void processRedisWakeups() {
        if (stringRedisTemplate == null) {
            return;
        }
        NotificationRuleRegistryService registry = notificationRuleRegistry();
        if (registry != null
                && registry.findRule(NotificationRuleRegistryService.RULE_NOTIFICATION_OUTBOX).isPresent()
                && !registry.findRule(NotificationRuleRegistryService.RULE_NOTIFICATION_OUTBOX)
                        .map(rule -> Boolean.TRUE.equals(rule.getEnabled()))
                        .orElse(false)) {
            return;
        }
        Instant startedAt = null;
        boolean runStarted = false;
        try {
            List<MapRecord<String, Object, Object>> records = stringRedisTemplate.opsForStream().read(
                    StreamReadOptions.empty().count(effectiveBatchSize()),
                    StreamOffset.create(NotificationOutboxService.WAKEUP_STREAM_KEY, ReadOffset.from(lastWakeupStreamId)));
            if (records == null || records.isEmpty()) {
                return;
            }
            List<String> recordIds = records.stream()
                    .map(record -> record.getId().getValue())
                    .filter(StringUtils::hasText)
                    .toList();
            lastWakeupStreamId = records.get(records.size() - 1).getId().getValue();
            startedAt = Instant.now();
            boolean ruleConfigured = registry != null
                    && registry.findRule(NotificationRuleRegistryService.RULE_NOTIFICATION_OUTBOX).isPresent();
            if (ruleConfigured && registry.beginRun(
                        NotificationRuleRegistryService.RULE_NOTIFICATION_OUTBOX,
                        "Notification outbox wake-up started.",
                        "notification-outbox",
                        startedAt) == null) {
                return;
            }
            runStarted = ruleConfigured;
            int processedCount = processDueNotificationsNow();
            if (ruleConfigured) {
                registry.recordRun(
                        NotificationRuleRegistryService.RULE_NOTIFICATION_OUTBOX,
                        processedCount,
                        "completed",
                        "Processed notification outbox wake-up work.",
                        "notification-outbox",
                        startedAt);
            }
            redisStreamRetentionService.deleteRecords(stringRedisTemplate, NotificationOutboxService.WAKEUP_STREAM_KEY, recordIds);
        } catch (RuntimeException exception) {
            if (runStarted && registry != null && startedAt != null) {
                registry.recordRun(
                        NotificationRuleRegistryService.RULE_NOTIFICATION_OUTBOX,
                        0,
                        "failed",
                        safeText(exception.getMessage()),
                        "notification-outbox",
                        startedAt);
            }
            LOGGER.debug("Notification outbox Redis wakeup read failed; scheduled polling remains active.", exception);
        }
    }

    private synchronized boolean claimScheduledPoll(Instant now) {
        Instant effectiveNow = now == null ? Instant.now() : now;
        long delayMs = platformParametersService == null
                ? 60_000L
                : platformParametersService.notificationOutboxPollDelayMs(60_000L);
        if (lastScheduledPollAt != Instant.EPOCH
                && effectiveNow.toEpochMilli() - lastScheduledPollAt.toEpochMilli() < delayMs) {
            return false;
        }
        lastScheduledPollAt = effectiveNow;
        return true;
    }

    private List<NotificationOutboxItem> dueItems(String nowIso, int limit) {
        Criteria statusCriteria = Criteria.where("status").is(NotificationOutboxItem.STATUS_PENDING);
        Criteria retryCriteria = new Criteria().orOperator(
                Criteria.where("nextRetryAt").exists(false),
                Criteria.where("nextRetryAt").is(null),
                Criteria.where("nextRetryAt").lte(nowIso));
        Query query = Query.query(new Criteria().andOperator(statusCriteria, retryCriteria))
                .with(Sort.by(Sort.Direction.ASC, "createdDate"))
                .limit(Math.max(1, limit));
        return mongoTemplate.find(query, NotificationOutboxItem.class);
    }

    private java.util.Optional<NotificationOutboxItem> lease(NotificationOutboxItem item, String nowIso) {
        if (item == null || !StringUtils.hasText(safeText(item.getId()))) {
            return java.util.Optional.empty();
        }
        String lockedUntil = Instant.now().plus(leaseDuration).toString();
        Criteria leaseCriteria = new Criteria().orOperator(
                Criteria.where("lockedUntil").exists(false),
                Criteria.where("lockedUntil").is(null),
                Criteria.where("lockedUntil").lte(nowIso));
        Criteria criteria = new Criteria().andOperator(
                Criteria.where("_id").is(item.getId()),
                Criteria.where("status").is(NotificationOutboxItem.STATUS_PENDING),
                leaseCriteria);
        Update update = new Update()
                .set("status", NotificationOutboxItem.STATUS_RUNNING)
                .set("startedDate", nowIso)
                .set("lockedUntil", lockedUntil)
                .set("updatedDate", nowIso);
        UpdateResult result = mongoTemplate.updateFirst(Query.query(criteria), update, NotificationOutboxItem.class);
        if (result.getMatchedCount() <= 0) {
            return java.util.Optional.empty();
        }
        return notificationOutboxRepository.findById(item.getId());
    }

    private DeliveryResult deliver(NotificationOutboxItem item) throws FirebaseMessagingException {
        if (DELIVERY_STRATEGY_TOPIC.equals(safeText(item.getDeliveryStrategy())) && StringUtils.hasText(safeText(item.getTopicName()))) {
            firebaseMessagingGateway.send(buildTopicMessage(item, safeText(item.getTopicName())));
            return new DeliveryResult(1, 0, Set.of());
        }
        List<String> recipientUserIds = deliveryRecipientUserIds(item);
        if (recipientUserIds.isEmpty()) {
            return new DeliveryResult(0, 0, Set.of());
        }
        List<Users> users = usersRepository.findByUserIdIn(recipientUserIds);
        List<TokenRegistration> registrations = tokenRegistrations(users);
        if (registrations.isEmpty()) {
            return new DeliveryResult(0, 0, Set.of());
        }
        DeliveryResult result = DELIVERY_STRATEGY_DIRECT.equals(safeText(item.getDeliveryStrategy()))
                ? deliverDirect(item, registrations)
                : deliverMulticast(item, registrations);
        removeInvalidTokens(users, result.invalidTokens());
        return result;
    }

    List<String> deliveryRecipientUserIds(NotificationOutboxItem item) {
        List<String> recipientUserIds = compactIds(item == null ? null : item.getRecipientUserIds());
        if (item == null
                || !"chat-message".equals(safeText(item.getNotificationType()))
                || chatWebSocketSessionRegistry == null) {
            return recipientUserIds;
        }
        String chatId = firstNonBlank(
                item.getEntityId(),
                item.getPayload() == null ? null : item.getPayload().get("chatId"));
        if (!StringUtils.hasText(chatId)) {
            return recipientUserIds;
        }
        return recipientUserIds.stream()
                .filter(userId -> !chatWebSocketSessionRegistry.isUserConnected(chatId, userId))
                .toList();
    }

    private DeliveryResult deliverDirect(NotificationOutboxItem item, List<TokenRegistration> registrations)
            throws FirebaseMessagingException {
        int success = 0;
        int failure = 0;
        LinkedHashSet<String> invalidTokens = new LinkedHashSet<>();
        for (int index = 0; index < registrations.size(); index += firebaseChunkSize) {
            List<TokenRegistration> chunk = registrations.subList(index, Math.min(index + firebaseChunkSize, registrations.size()));
            List<Message> messages = chunk.stream()
                    .map(registration -> buildTokenMessage(item, registration.token()))
                    .toList();
            FirebaseBatchSendResult response = firebaseMessagingGateway.sendAll(
                    messages,
                    chunk.stream().map(TokenRegistration::token).toList());
            success += response.successCount();
            failure += response.failureCount();
            collectInvalidTokens(chunk, response, invalidTokens);
        }
        return new DeliveryResult(success, failure, invalidTokens);
    }

    private DeliveryResult deliverMulticast(NotificationOutboxItem item, List<TokenRegistration> registrations)
            throws FirebaseMessagingException {
        int success = 0;
        int failure = 0;
        LinkedHashSet<String> invalidTokens = new LinkedHashSet<>();
        for (int index = 0; index < registrations.size(); index += firebaseChunkSize) {
            List<TokenRegistration> chunk = registrations.subList(index, Math.min(index + firebaseChunkSize, registrations.size()));
            List<String> tokens = chunk.stream().map(TokenRegistration::token).toList();
            FirebaseBatchSendResult response = firebaseMessagingGateway.sendMulticast(buildMessage(item, tokens), tokens);
            success += response.successCount();
            failure += response.failureCount();
            collectInvalidTokens(chunk, response, invalidTokens);
        }
        return new DeliveryResult(success, failure, invalidTokens);
    }

    private void collectInvalidTokens(
            List<TokenRegistration> chunk,
            FirebaseBatchSendResult response,
            LinkedHashSet<String> invalidTokens) {
        List<FirebaseTokenSendResult> responses = response == null ? List.of() : response.responses();
        for (int responseIndex = 0; responseIndex < responses.size() && responseIndex < chunk.size(); responseIndex += 1) {
            FirebaseTokenSendResult sendResponse = responses.get(responseIndex);
            if (sendResponse != null && !sendResponse.successful() && isInvalidToken(sendResponse.errorCode())) {
                invalidTokens.add(chunk.get(responseIndex).token());
            }
        }
    }

    private MulticastMessage buildMessage(NotificationOutboxItem item, List<String> tokens) {
        Map<String, String> payload = payloadFor(item);
        return MulticastMessage.builder()
                .addAllTokens(tokens)
                .putAllData(payload)
                .setWebpushConfig(webpushConfig(item, payload))
                .build();
    }

    private Message buildTokenMessage(NotificationOutboxItem item, String token) {
        Map<String, String> payload = payloadFor(item);
        return Message.builder()
                .setToken(token)
                .putAllData(payload)
                .setWebpushConfig(webpushConfig(item, payload))
                .build();
    }

    private Message buildTopicMessage(NotificationOutboxItem item, String topicName) {
        Map<String, String> payload = payloadFor(item);
        return Message.builder()
                .setTopic(topicName)
                .putAllData(payload)
                .setWebpushConfig(webpushConfig(item, payload))
                .build();
    }

    private Map<String, String> payloadFor(NotificationOutboxItem item) {
        Map<String, String> payload = new LinkedHashMap<>(item.getPayload() == null ? Map.of() : item.getPayload());
        putIfText(payload, "type", item.getNotificationType());
        putIfText(payload, "title", item.getTitle());
        putIfText(payload, "body", item.getBody());
        putIfText(payload, "url", firstNonBlank(item.getClickUrl(), payload.get("url"), "/game"));
        putIfText(payload, "icon", firstNonBlank(item.getIconUrl(), payload.get("icon"), "/assets/logo/heart.webp"));
        putIfText(payload, "badge", firstNonBlank(item.getBadgeUrl(), payload.get("badge"), "/assets/logo/heart.webp"));
        putIfText(payload, "tag", firstNonBlank(item.getTag(), payload.get("tag"), item.getNotificationType()));
        return payload;
    }

    private WebpushConfig webpushConfig(NotificationOutboxItem item, Map<String, String> payload) {
        WebpushNotification.Builder notificationBuilder = WebpushNotification.builder()
                .setTitle(firstNonBlank(item.getTitle(), payload.get("title"), "MyScoutee"))
                .setBody(firstNonBlank(item.getBody(), payload.get("body"), "You have a new notification."))
                .setIcon(payload.get("icon"))
                .setBadge(payload.get("badge"))
                .setTag(payload.get("tag"))
                .setTimestampMillis(Instant.now().toEpochMilli());

        return WebpushConfig.builder()
                .putHeader("Urgency", urgencyFor(item.getNotificationType()))
                .putAllData(payload)
                .setFcmOptions(WebpushFcmOptions.withLink(payload.get("url")))
                .setNotification(notificationBuilder.build())
                .build();
    }

    private List<TokenRegistration> tokenRegistrations(List<Users> users) {
        LinkedHashMap<String, TokenRegistration> byToken = new LinkedHashMap<>();
        for (Users user : users == null ? List.<Users>of() : users) {
            if (user == null) {
                continue;
            }
            String userId = normalizeId(user.getUserId());
            if (!StringUtils.hasText(userId) || user.getDevices() == null) {
                continue;
            }
            for (Users.UserDeviceRecord device : user.getDevices()) {
                if (device == null || !Boolean.TRUE.equals(device.getNotificationsEnabled())) {
                    continue;
                }
                String token = safeText(device.getFirebaseToken());
                if (StringUtils.hasText(token)) {
                    byToken.putIfAbsent(token, new TokenRegistration(userId, token));
                }
            }
        }
        return new ArrayList<>(byToken.values());
    }

    private void removeInvalidTokens(List<Users> users, Set<String> invalidTokens) {
        if (users == null || users.isEmpty() || invalidTokens == null || invalidTokens.isEmpty()) {
            return;
        }
        List<Users> changedUsers = new ArrayList<>();
        int removedTokenCount = 0;
        for (Users user : users) {
            if (user == null || user.getDevices() == null || user.getDevices().isEmpty()) {
                continue;
            }
            int originalSize = user.getDevices().size();
            List<Users.UserDeviceRecord> retained = user.getDevices().stream()
                    .filter(device -> device != null && !invalidTokens.contains(safeText(device.getFirebaseToken())))
                    .toList();
            if (retained.size() == originalSize) {
                continue;
            }
            removedTokenCount += originalSize - retained.size();
            user.setDevices(retained);
            changedUsers.add(user);
        }
        if (!changedUsers.isEmpty()) {
            usersRepository.saveAll(changedUsers);
            adminTelemetryService.record(
                    "notification.tokens.removed",
                    "notifications",
                    "",
                    "system",
                    removedTokenCount,
                    Map.of("users", Integer.toString(changedUsers.size())));
        }
    }

    private boolean isInvalidToken(MessagingErrorCode code) {
        if (code == null) {
            return false;
        }
        return MessagingErrorCode.UNREGISTERED.equals(code) || MessagingErrorCode.INVALID_ARGUMENT.equals(code);
    }

    private void markSent(NotificationOutboxItem item, DeliveryResult result, String nowIso) {
        Update update = new Update()
                .set("status", NotificationOutboxItem.STATUS_SENT)
                .set("pendingCounterTracked", false)
                .set("sentDate", nowIso)
                .set("updatedDate", nowIso)
                .set("tokenSuccessCount", result.successCount())
                .set("tokenFailureCount", result.failureCount())
                .unset("lockedUntil")
                .unset("lastError");
        UpdateResult updateResult = mongoTemplate.updateFirst(
                Query.query(new Criteria().andOperator(
                        Criteria.where("_id").is(item.getId()),
                        Criteria.where("status").is(NotificationOutboxItem.STATUS_RUNNING))),
                update,
                NotificationOutboxItem.class);
        if (updateResult.getModifiedCount() > 0 && Boolean.TRUE.equals(item.getPendingCounterTracked())) {
            adjustPendingCount(-1);
        }
    }

    private void markFailed(NotificationOutboxItem item, Exception exception, Instant now) {
        if (item == null) {
            LOGGER.warn("Notification outbox delivery failed before item could be loaded.", exception);
            return;
        }
        int retryCount = Math.max(0, item.getRetryCount() == null ? 0 : item.getRetryCount()) + 1;
        boolean exhausted = retryCount >= effectiveMaxRetries();
        String nowIso = now.toString();
        String nextRetryAt = now.plus(retryDelay(retryCount)).toString();
        Update update = new Update()
                .set("status", exhausted ? NotificationOutboxItem.STATUS_FAILED : NotificationOutboxItem.STATUS_PENDING)
                .set("pendingCounterTracked", exhausted ? false : Boolean.TRUE.equals(item.getPendingCounterTracked()))
                .set("retryCount", retryCount)
                .set("nextRetryAt", exhausted ? null : nextRetryAt)
                .set("lastError", truncateError(exception))
                .set("updatedDate", nowIso)
                .unset("lockedUntil");
        UpdateResult updateResult = mongoTemplate.updateFirst(
                Query.query(new Criteria().andOperator(
                        Criteria.where("_id").is(item.getId()),
                        Criteria.where("status").is(NotificationOutboxItem.STATUS_RUNNING))),
                update,
                NotificationOutboxItem.class);
        if (exhausted && updateResult.getModifiedCount() > 0 && Boolean.TRUE.equals(item.getPendingCounterTracked())) {
            adjustPendingCount(-1);
        }
        LOGGER.warn("Notification outbox item {} delivery failed.", item.getId(), exception);
    }

    private void adjustPendingCount(int delta) {
        NotificationRuleRegistryService registry = notificationRuleRegistry();
        if (registry == null || delta == 0) {
            return;
        }
        registry.adjustPendingCount(
                NotificationRuleRegistryService.RULE_NOTIFICATION_OUTBOX,
                delta,
                "admin.jobs.rule.notification.outbox");
    }

    private NotificationRuleRegistryService notificationRuleRegistry() {
        return notificationRuleRegistryServiceProvider == null
                ? null
                : notificationRuleRegistryServiceProvider.getIfAvailable();
    }

    private Duration retryDelay(int retryCount) {
        long multiplier = 1L << Math.min(8, Math.max(0, retryCount - 1));
        return effectiveRetryBaseDelay().multipliedBy(multiplier);
    }

    private boolean isInsideDeliveryWindow() {
        int startHour = effectiveDeliveryWindowStartHour();
        int endHour = effectiveDeliveryWindowEndHour();
        if (startHour == endHour) {
            return true;
        }
        int currentHour = LocalTime.now(ZoneId.systemDefault()).getHour();
        if (startHour < endHour) {
            return currentHour >= startHour && currentHour < endHour;
        }
        return currentHour >= startHour || currentHour < endHour;
    }

    private int effectiveBatchSize() {
        return batchSize;
    }

    private int effectiveMaxWorkers() {
        return platformParametersService == null
                ? 1
                : platformParametersService.notificationMaxWorkers(1);
    }

    private int effectiveMaxRetries() {
        return platformParametersService == null
                ? maxRetries
                : platformParametersService.notificationMaxRetries(maxRetries);
    }

    private Duration effectiveRetryBaseDelay() {
        return platformParametersService == null
                ? retryBaseDelay
                : platformParametersService.notificationInitialBackoff(retryBaseDelay);
    }

    private int effectiveDeliveryWindowStartHour() {
        return platformParametersService == null
                ? deliveryWindowStartHour
                : platformParametersService.notificationWindowStartHour(deliveryWindowStartHour);
    }

    private int effectiveDeliveryWindowEndHour() {
        return platformParametersService == null
                ? deliveryWindowEndHour
                : platformParametersService.notificationWindowEndHour(deliveryWindowEndHour);
    }

    private int clampHour(int value, int fallback) {
        if (value < 0 || value > 24) {
            return fallback;
        }
        return value;
    }

    private String urgencyFor(String type) {
        String normalized = safeText(type);
        return normalized.contains("chat") || normalized.contains("invite") || normalized.contains("asset-review")
                ? "high"
                : "normal";
    }

    private List<String> compactIds(Collection<String> values) {
        if (values == null || values.isEmpty()) {
            return List.of();
        }
        return values.stream()
                .map(this::normalizeId)
                .filter(StringUtils::hasText)
                .distinct()
                .toList();
    }

    private void putIfText(Map<String, String> payload, String key, String value) {
        String normalized = safeText(value);
        if (StringUtils.hasText(key) && StringUtils.hasText(normalized)) {
            payload.put(key, normalized);
        }
    }

    private String firstNonBlank(String... values) {
        for (String value : values == null ? new String[0] : values) {
            String normalized = safeText(value);
            if (StringUtils.hasText(normalized)) {
                return normalized;
            }
        }
        return "";
    }

    private String truncateError(Exception exception) {
        String message = exception == null ? "" : safeText(exception.getMessage());
        if (message.length() <= 1000) {
            return message;
        }
        return message.substring(0, 1000);
    }

    private String normalizeId(String value) {
        return value == null ? "" : value.trim();
    }

    private String safeText(String value) {
        return value == null ? "" : value.trim();
    }

    private record TokenRegistration(String userId, String token) {
    }

    private record DeliveryResult(int successCount, int failureCount, Set<String> invalidTokens) {
    }
}

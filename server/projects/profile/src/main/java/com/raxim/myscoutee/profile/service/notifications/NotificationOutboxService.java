package com.raxim.myscoutee.profile.service.notifications;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Duration;
import java.time.Instant;
import java.util.Collection;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

import org.bson.types.ObjectId;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.connection.stream.StreamRecords;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.raxim.myscoutee.profile.data.document.NotificationOutboxItem;
import com.raxim.myscoutee.profile.repository.NotificationOutboxRepository;
import com.raxim.myscoutee.profile.service.PlatformParametersService;
import com.raxim.myscoutee.profile.service.RedisStreamRetentionService;

@Service
public class NotificationOutboxService {
    public static final String WAKEUP_STREAM_KEY = "notification:outbox:wakeups";
    private static final Duration WAKEUP_STREAM_RETENTION = Duration.ofDays(30);
    private static final Logger LOGGER = LoggerFactory.getLogger(NotificationOutboxService.class);
    private static final String DEFAULT_BADGE_URL = "/assets/logo/heart.webp";
    private static final String DEFAULT_ICON_URL = "/assets/logo/heart.webp";
    private static final String DEFAULT_CLICK_URL = "/game";
    private static final String DELIVERY_STRATEGY_DIRECT = "direct";
    private static final String DELIVERY_STRATEGY_MULTICAST = "multicast";
    private static final String DELIVERY_STRATEGY_TOPIC = "topic";
    private static final int DEFAULT_MULTICAST_THRESHOLD = 3;
    private static final int DEFAULT_TOPIC_THRESHOLD = 1000;
    private static final int DEFAULT_COLLAPSE_WINDOW_SECONDS = 300;

    private final NotificationOutboxRepository notificationOutboxRepository;
    private final StringRedisTemplate stringRedisTemplate;
    private final PlatformParametersService platformParametersService;
    private final RedisStreamRetentionService redisStreamRetentionService;
    private final ObjectProvider<UserNotificationService> userNotificationServiceProvider;
    private ObjectProvider<NotificationRuleRegistryService> notificationRuleRegistryServiceProvider;

    @Autowired
    public NotificationOutboxService(
            NotificationOutboxRepository notificationOutboxRepository,
            ObjectProvider<StringRedisTemplate> stringRedisTemplateProvider,
            PlatformParametersService platformParametersService,
            RedisStreamRetentionService redisStreamRetentionService,
            ObjectProvider<UserNotificationService> userNotificationServiceProvider) {
        this.notificationOutboxRepository = notificationOutboxRepository;
        this.stringRedisTemplate = stringRedisTemplateProvider == null ? null : stringRedisTemplateProvider.getIfAvailable();
        this.platformParametersService = platformParametersService;
        this.redisStreamRetentionService = redisStreamRetentionService;
        this.userNotificationServiceProvider = userNotificationServiceProvider;
    }

    public NotificationOutboxService(
            NotificationOutboxRepository notificationOutboxRepository,
            ObjectProvider<StringRedisTemplate> stringRedisTemplateProvider,
            PlatformParametersService platformParametersService,
            RedisStreamRetentionService redisStreamRetentionService) {
        this(
                notificationOutboxRepository,
                stringRedisTemplateProvider,
                platformParametersService,
                redisStreamRetentionService,
                null);
    }

    NotificationOutboxService(
            NotificationOutboxRepository notificationOutboxRepository,
            ObjectProvider<StringRedisTemplate> stringRedisTemplateProvider,
            PlatformParametersService platformParametersService) {
        this(notificationOutboxRepository, stringRedisTemplateProvider, platformParametersService, null);
    }

    NotificationOutboxService(NotificationOutboxRepository notificationOutboxRepository) {
        this(notificationOutboxRepository, null, null, null);
    }

    @Autowired(required = false)
    void setNotificationRuleRegistryServiceProvider(
            ObjectProvider<NotificationRuleRegistryService> notificationRuleRegistryServiceProvider) {
        this.notificationRuleRegistryServiceProvider = notificationRuleRegistryServiceProvider;
    }

    public Optional<NotificationOutboxItem> enqueue(NotificationIntent intent) {
        if (intent == null) {
            return Optional.empty();
        }
        String type = safeText(intent.type());
        Map<String, String> payload = normalizedPayload(intent);
        List<String> recipientUserIds = compactIds(intent.recipientUserIds());
        String topicName = resolveStableTopicName(intent, payload, recipientUserIds.size());
        String deliveryStrategy = StringUtils.hasText(topicName)
                ? DELIVERY_STRATEGY_TOPIC
                : knownUserDeliveryStrategy(payload, recipientUserIds.size());
        if (!StringUtils.hasText(type) || (recipientUserIds.isEmpty() && !StringUtils.hasText(topicName))) {
            return Optional.empty();
        }

        String nowIso = Instant.now().toString();
        String payloadHash = sha256(canonicalPayload(payload));
        String entityType = safeText(intent.entityType());
        String entityId = safeText(intent.entityId());
        String recipientScope = firstNonBlank(intent.recipientScope(), "users");
        String collapseKey = String.join(":",
                type,
                StringUtils.hasText(entityType) ? entityType : "none",
                StringUtils.hasText(entityId) ? entityId : "none",
                recipientScope,
                payloadHash);

        NotificationOutboxItem item = notificationOutboxRepository
                .findFirstByCollapseKeyAndStatusInAndCreatedDateGreaterThanEqualOrderByCreatedDateAsc(
                        collapseKey,
                        List.of(NotificationOutboxItem.STATUS_PENDING),
                        collapseWindowStartIso(nowIso))
                .map(existing -> mergeRecipients(existing, recipientUserIds, payload, nowIso, intent.createdUser()))
                .orElseGet(() -> newItem(intent, recipientUserIds, payload, payloadHash, collapseKey, deliveryStrategy, topicName, nowIso));
        boolean newlyTracked = !Boolean.TRUE.equals(item.getPendingCounterTracked());
        item.setPendingCounterTracked(true);
        NotificationOutboxItem saved = notificationOutboxRepository.save(item);
        if (newlyTracked) {
            adjustPendingCount(1);
        }
        publishWakeup(saved);
        materializeInbox(saved);
        return Optional.of(saved);
    }

    private void adjustPendingCount(int delta) {
        if (notificationRuleRegistryServiceProvider == null || delta == 0) {
            return;
        }
        NotificationRuleRegistryService registry = notificationRuleRegistryServiceProvider.getIfAvailable();
        if (registry != null) {
            registry.adjustPendingCount(
                    NotificationRuleRegistryService.RULE_NOTIFICATION_OUTBOX,
                    delta,
                    "admin.jobs.rule.notification.outbox");
        }
    }

    private void materializeInbox(NotificationOutboxItem item) {
        if (userNotificationServiceProvider == null || item == null) {
            return;
        }
        UserNotificationService userNotificationService = userNotificationServiceProvider.getIfAvailable();
        if (userNotificationService != null) {
            userNotificationService.materialize(item);
        }
    }

    private NotificationOutboxItem newItem(
            NotificationIntent intent,
            List<String> recipientUserIds,
            Map<String, String> payload,
            String payloadHash,
            String collapseKey,
            String deliveryStrategy,
            String topicName,
            String nowIso) {
        NotificationOutboxItem item = new NotificationOutboxItem();
        item.setId(new ObjectId().toHexString());
        item.setSyncKey(UUID.randomUUID().toString());
        item.setNotificationType(safeText(intent.type()));
        item.setEntityType(safeNullableText(intent.entityType()));
        item.setEntityId(safeNullableText(intent.entityId()));
        item.setRecipientScope(firstNonBlank(intent.recipientScope(), "users"));
        item.setRecipientUserIds(recipientUserIds);
        item.setDeliveryStrategy(deliveryStrategy);
        item.setTopicName(safeNullableText(topicName));
        item.setTitle(firstNonBlank(intent.title(), payload.get("title")));
        item.setBody(firstNonBlank(intent.body(), payload.get("body")));
        item.setClickUrl(firstNonBlank(intent.clickUrl(), DEFAULT_CLICK_URL));
        item.setIconUrl(firstNonBlank(intent.iconUrl(), DEFAULT_ICON_URL));
        item.setBadgeUrl(firstNonBlank(intent.badgeUrl(), DEFAULT_BADGE_URL));
        item.setTag(firstNonBlank(intent.tag(), item.getNotificationType()));
        item.setPayload(payload);
        item.setPayloadHash(payloadHash);
        item.setCollapseKey(collapseKey);
        item.setStatus(NotificationOutboxItem.STATUS_PENDING);
        item.setRetryCount(0);
        item.setNextRetryAt(nowIso);
        item.setTokenSuccessCount(0);
        item.setTokenFailureCount(0);
        item.setCreatedDate(nowIso);
        item.setCreatedUser(safeNullableText(intent.createdUser()));
        item.setUpdatedDate(nowIso);
        item.setUpdatedUser(safeNullableText(intent.createdUser()));
        return item;
    }

    private NotificationOutboxItem mergeRecipients(
            NotificationOutboxItem item,
            List<String> recipientUserIds,
            Map<String, String> payload,
            String nowIso,
            String actorUserId) {
        LinkedHashSet<String> merged = new LinkedHashSet<>(compactIds(item.getRecipientUserIds()));
        merged.addAll(recipientUserIds);
        item.setRecipientUserIds(List.copyOf(merged));
        if (!DELIVERY_STRATEGY_TOPIC.equals(safeText(item.getDeliveryStrategy()))) {
            item.setDeliveryStrategy(knownUserDeliveryStrategy(firstNonEmptyMap(item.getPayload(), payload), merged.size()));
        }
        item.setNextRetryAt(firstNonBlank(item.getNextRetryAt(), nowIso));
        item.setUpdatedDate(nowIso);
        item.setUpdatedUser(safeNullableText(actorUserId));
        return item;
    }

    private String resolveStableTopicName(NotificationIntent intent, Map<String, String> payload, int recipientCount) {
        String recipientScope = safeText(intent == null ? null : intent.recipientScope());
        String topicName = safeText(payload == null ? null : payload.get("topicName"));
        if (recipientScope.startsWith("topic:")) {
            topicName = recipientScope.substring("topic:".length()).trim();
        }
        if (!StringUtils.hasText(topicName)) {
            return null;
        }
        boolean stableTopic = payload != null && "true".equalsIgnoreCase(safeText(payload.get("stableTopic")))
                || recipientScope.startsWith("topic:")
                || topicName.startsWith("platform-")
                || topicName.startsWith("admin-")
                || topicName.startsWith("global-");
        if (!stableTopic) {
            return null;
        }
        int threshold = readInt(payload == null ? null : payload.get("topicThreshold"), topicThreshold());
        return recipientCount == 0 || recipientCount >= Math.max(1, threshold) ? topicName : null;
    }

    private String knownUserDeliveryStrategy(Map<String, String> payload, int recipientCount) {
        int threshold = readInt(payload == null ? null : payload.get("multicastThreshold"), multicastThreshold());
        return recipientCount >= Math.max(1, threshold) ? DELIVERY_STRATEGY_MULTICAST : DELIVERY_STRATEGY_DIRECT;
    }

    private String collapseWindowStartIso(String nowIso) {
        int windowSeconds = platformParametersService == null
                ? DEFAULT_COLLAPSE_WINDOW_SECONDS
                : platformParametersService.notificationCollapseWindowSeconds(DEFAULT_COLLAPSE_WINDOW_SECONDS);
        if (windowSeconds <= 0) {
            return nowIso;
        }
        try {
            return Instant.parse(nowIso).minusSeconds(windowSeconds).toString();
        } catch (Exception ignored) {
            return Instant.now().minusSeconds(windowSeconds).toString();
        }
    }

    private int topicThreshold() {
        return platformParametersService == null
                ? DEFAULT_TOPIC_THRESHOLD
                : platformParametersService.notificationTopicThreshold(DEFAULT_TOPIC_THRESHOLD);
    }

    private int multicastThreshold() {
        return platformParametersService == null
                ? DEFAULT_MULTICAST_THRESHOLD
                : platformParametersService.notificationMulticastThreshold(DEFAULT_MULTICAST_THRESHOLD);
    }

    private Map<String, String> firstNonEmptyMap(Map<String, String> first, Map<String, String> second) {
        if (first != null && !first.isEmpty()) {
            return first;
        }
        return second == null ? Map.of() : second;
    }

    private void publishWakeup(NotificationOutboxItem item) {
        if (stringRedisTemplate == null || item == null || !StringUtils.hasText(safeText(item.getId()))) {
            return;
        }
        try {
            stringRedisTemplate.opsForStream().add(StreamRecords.mapBacked(Map.of(
                    "outboxId", safeText(item.getId()),
                    "collapseKey", safeText(item.getCollapseKey()),
                    "type", safeText(item.getNotificationType()),
                    "createdDate", firstNonBlank(item.getCreatedDate(), Instant.now().toString()))).withStreamKey(WAKEUP_STREAM_KEY));
            if (redisStreamRetentionService != null) {
                redisStreamRetentionService.trimByAge(stringRedisTemplate, WAKEUP_STREAM_KEY, WAKEUP_STREAM_RETENTION);
            }
        } catch (RuntimeException exception) {
            LOGGER.debug("Notification outbox Redis wakeup publish failed; scheduled polling remains active.", exception);
        }
    }

    private Map<String, String> normalizedPayload(NotificationIntent intent) {
        LinkedHashMap<String, String> payload = new LinkedHashMap<>();
        if (intent.payload() != null) {
            intent.payload().entrySet().stream()
                    .filter(entry -> StringUtils.hasText(safeText(entry.getKey())))
                    .sorted(Map.Entry.comparingByKey())
                    .forEach(entry -> payload.put(safeText(entry.getKey()), safeText(entry.getValue())));
        }
        putIfText(payload, "type", intent.type());
        putIfText(payload, "entityType", intent.entityType());
        putIfText(payload, "entityId", intent.entityId());
        putIfText(payload, "recipientScope", intent.recipientScope());
        putIfText(payload, "title", firstNonBlank(intent.title(), payload.get("title")));
        putIfText(payload, "body", firstNonBlank(intent.body(), payload.get("body")));
        putIfText(payload, "url", firstNonBlank(intent.clickUrl(), payload.get("url"), DEFAULT_CLICK_URL));
        putIfText(payload, "icon", firstNonBlank(intent.iconUrl(), payload.get("icon"), DEFAULT_ICON_URL));
        putIfText(payload, "badge", firstNonBlank(intent.badgeUrl(), payload.get("badge"), DEFAULT_BADGE_URL));
        putIfText(payload, "tag", firstNonBlank(intent.tag(), payload.get("tag"), intent.type()));
        return payload;
    }

    private void putIfText(Map<String, String> payload, String key, String value) {
        String normalized = safeText(value);
        if (StringUtils.hasText(key) && StringUtils.hasText(normalized)) {
            payload.put(key, normalized);
        }
    }

    private List<String> compactIds(Collection<String> values) {
        if (values == null || values.isEmpty()) {
            return List.of();
        }
        return values.stream()
                .map(this::safeText)
                .filter(StringUtils::hasText)
                .distinct()
                .toList();
    }

    private String canonicalPayload(Map<String, String> payload) {
        if (payload == null || payload.isEmpty()) {
            return "";
        }
        return payload.entrySet().stream()
                .sorted(Comparator.comparing(Map.Entry::getKey))
                .map(entry -> safeText(entry.getKey()) + "=" + safeText(entry.getValue()))
                .reduce((left, right) -> left + "\n" + right)
                .orElse("");
    }

    private String sha256(String value) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hashed = digest.digest(safeText(value).getBytes(StandardCharsets.UTF_8));
            StringBuilder builder = new StringBuilder();
            for (byte item : hashed) {
                builder.append(String.format("%02x", item));
            }
            return builder.toString();
        } catch (Exception ignored) {
            return Integer.toHexString(safeText(value).hashCode());
        }
    }

    private int readInt(String value, int fallback) {
        try {
            return Integer.parseInt(safeText(value));
        } catch (Exception ignored) {
            return fallback;
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

    private String safeNullableText(String value) {
        String normalized = safeText(value);
        return StringUtils.hasText(normalized) ? normalized : null;
    }

    private String safeText(String value) {
        return value == null ? "" : value.trim();
    }

    public record NotificationIntent(
            String type,
            String entityType,
            String entityId,
            String recipientScope,
            Collection<String> recipientUserIds,
            String title,
            String body,
            String clickUrl,
            String iconUrl,
            String badgeUrl,
            String tag,
            Map<String, String> payload,
            String createdUser) {
    }
}

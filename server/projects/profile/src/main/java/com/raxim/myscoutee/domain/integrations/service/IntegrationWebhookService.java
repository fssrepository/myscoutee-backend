package com.raxim.myscoutee.domain.integrations.service;

import com.raxim.myscoutee.domain.platform.service.JobGroupContext;
import com.raxim.myscoutee.domain.platform.service.JobGroupScopeService;

import java.net.InetAddress;
import java.net.URI;
import java.nio.charset.StandardCharsets;
import java.util.function.Supplier;
import org.springframework.dao.DuplicateKeyException;
import com.raxim.myscoutee.domain.integrations.dto.IntegrationDtos.IntegrationEncountersDto;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.net.http.HttpTimeoutException;
import java.time.Duration;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.LinkedHashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.RejectedExecutionException;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeoutException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Semaphore;
import java.util.concurrent.TimeUnit;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.FindAndModifyOptions;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.http.HttpStatus;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.server.ResponseStatusException;

import com.raxim.myscoutee.domain.events.document.ActivityEvent;
import com.raxim.myscoutee.domain.events.document.ActivityMember;
import com.raxim.myscoutee.domain.assets.document.Asset;
import com.raxim.myscoutee.domain.integrations.document.IntegrationExternalId;
import com.raxim.myscoutee.domain.integrations.document.IntegrationToken;
import com.raxim.myscoutee.domain.integrations.document.IntegrationWebhookDelivery;
import com.raxim.myscoutee.domain.integrations.document.IntegrationWebhookSubscription;
import com.raxim.myscoutee.domain.accounts.document.Users;
import com.raxim.myscoutee.domain.integrations.dto.IntegrationDtos.IntegrationWatchRequestDto;
import com.raxim.myscoutee.domain.integrations.dto.IntegrationDtos.IntegrationWatchResponseDto;
import com.raxim.myscoutee.domain.integrations.repository.IntegrationExternalIdsRepository;
import com.raxim.myscoutee.domain.integrations.repository.IntegrationTokensRepository;
import com.raxim.myscoutee.domain.integrations.repository.IntegrationWebhookDeliveriesRepository;
import com.raxim.myscoutee.domain.integrations.repository.IntegrationWebhookSubscriptionsRepository;
import com.raxim.myscoutee.domain.accounts.repository.UsersRepository;
import com.raxim.myscoutee.domain.integrations.service.IntegrationTokenService.AuthenticatedIntegrationClient;

import tools.jackson.core.JacksonException;
import tools.jackson.databind.ObjectMapper;

import jakarta.annotation.PostConstruct;
import jakarta.annotation.PreDestroy;

@Service
public class IntegrationWebhookService implements com.raxim.myscoutee.domain.integrations.api.RoleAttentionEvents {
    @org.springframework.beans.factory.annotation.Autowired
    private com.raxim.myscoutee.domain.notifications.api.NotificationJobs groupRules;
    @org.springframework.beans.factory.annotation.Autowired
    private com.raxim.myscoutee.domain.platform.service.JobGroupScopeService jobGroupScope;
    @org.springframework.beans.factory.annotation.Autowired
    private com.raxim.myscoutee.common.config.mongo.ScheduledMongoSessionRunner groupDatabases;

    @org.springframework.beans.factory.annotation.Autowired
    private McpEventsService mcpEvents;

    public static final String EVENT_CHANGED = "event.changed";
    public static final String EVENT_ENCOUNTERS = "event.encounters";
    public static final String ASSET_CHANGED = "asset.changed";

    private static final Set<String> SUPPORTED_EVENTS = Set.of(EVENT_CHANGED, ASSET_CHANGED, EVENT_ENCOUNTERS);
    private static final List<Long> RETRY_SECONDS = List.of(5L, 30L);
    private static final String STATUS_PENDING = "PENDING";
    private static final String STATUS_RETRY = "RETRY";
    private static final String STATUS_SENDING = "SENDING";
    private static final String STATUS_SENT = "SENT";
    private static final String STATUS_FAILED = "FAILED";

    private final IntegrationWebhookSubscriptionsRepository subscriptionsRepository;
    private final IntegrationWebhookDeliveriesRepository deliveriesRepository;
    private final IntegrationExternalIdsRepository externalIdsRepository;
    private final IntegrationTokensRepository tokensRepository;
    private final UsersRepository usersRepository;
    private final MongoTemplate mongoTemplate;
    private final ObjectMapper objectMapper;
    private final HttpClient httpClient;
    private final boolean allowHttp;
    private final boolean allowPrivateAddresses;
    private final ExecutorService deliveryExecutor;
    private final Semaphore deliverySlots;
    private final int deliveryBatchSize;

    public IntegrationWebhookService(
            IntegrationWebhookSubscriptionsRepository subscriptionsRepository,
            IntegrationWebhookDeliveriesRepository deliveriesRepository,
            IntegrationExternalIdsRepository externalIdsRepository,
            IntegrationTokensRepository tokensRepository,
            UsersRepository usersRepository,
            MongoTemplate mongoTemplate,
            ObjectMapper objectMapper,
            @Value("${integration.webhook.allow-http:false}") boolean allowHttp,
            @Value("${integration.webhook.allow-private-addresses:false}") boolean allowPrivateAddresses,
            @Value("${integration.webhook.max-worker-count:100}") int maxWorkerCount,
            @Value("${integration.webhook.delivery-batch-size:100}") int deliveryBatchSize) {
        this.subscriptionsRepository = subscriptionsRepository;
        this.deliveriesRepository = deliveriesRepository;
        this.externalIdsRepository = externalIdsRepository;
        this.tokensRepository = tokensRepository;
        this.usersRepository = usersRepository;
        this.mongoTemplate = mongoTemplate;
        this.objectMapper = objectMapper;
        this.allowHttp = allowHttp;
        this.allowPrivateAddresses = allowPrivateAddresses;
        int effectiveMaxWorkerCount = Math.max(1, Math.min(maxWorkerCount, 100));
        this.deliveryBatchSize = Math.max(1, Math.min(deliveryBatchSize, 1_000));
        this.deliverySlots = new Semaphore(effectiveMaxWorkerCount);
        this.deliveryExecutor = Executors.newThreadPerTaskExecutor(
                Thread.ofVirtual().name("integration-webhook-worker-", 0).factory());
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(5))
                .followRedirects(HttpClient.Redirect.NEVER)
                .build();
    }

    @PreDestroy
    void shutdownDeliveryWorkers() {
        deliveryExecutor.shutdownNow();
    }

    @PostConstruct
    void recoverInterruptedDeliveries() {
        mongoTemplate.updateMulti(
                Query.query(Criteria.where("status").is(STATUS_SENDING).and("nextAttemptAtIso").lte(Instant.now().toString())),
                new Update()
                        .set("status", STATUS_RETRY)
                        .set("nextAttemptAtIso", Instant.now().toString()),
                IntegrationWebhookDelivery.class);
    }

    public IntegrationWatchResponseDto configure(
            AuthenticatedIntegrationClient client,
            IntegrationWatchRequestDto request) {
        if (client == null || !StringUtils.hasText(client.ownerUserId())
                || !StringUtils.hasText(client.tokenId()) || !StringUtils.hasText(client.clientId())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "An authenticated integration client is required.");
        }
        boolean enabled = request == null || request.enabled() == null || request.enabled();
        IntegrationWebhookSubscription subscription = subscriptionsRepository
                .findByTokenIdAndClientId(client.tokenId(), client.clientId())
                .orElse(null);
        String now = Instant.now().toString();

        if (!enabled) {
            if (subscription != null) {
                subscription.setEnabled(false);
                subscription.setUpdatedAtIso(now);
                subscriptionsRepository.save(subscription);
            }
            return new IntegrationWatchResponseDto(false, null, List.of());
        }

        String callbackUrl = normalizeCallbackUrl(request == null ? null : request.callbackUrl());
        List<String> eventTypes = normalizeEventTypes(request == null ? null : request.events());
        if (subscription == null) {
            subscription = new IntegrationWebhookSubscription();
            subscription.setId(UUID.randomUUID().toString());
            subscription.setOwnerUserId(client.ownerUserId());
            subscription.setTokenId(client.tokenId());
            subscription.setClientId(client.clientId());
            subscription.setCreatedAtIso(now);
        }
        subscription.setCallbackUrl(callbackUrl);
        subscription.setEventTypes(eventTypes);
        subscription.setEnabled(true);
        subscription.setUpdatedAtIso(now);
        IntegrationWebhookSubscription saved = subscriptionsRepository.save(subscription);
        return new IntegrationWatchResponseDto(true, saved.getCallbackUrl(), List.copyOf(saved.getEventTypes()));
    }

    public void enqueue(ActivityEvent event) {
        if (event == null || !Boolean.TRUE.equals(event.getIsAdmin())) {
            return;
        }
        String ownerUserId = normalize(event.getOwnerUserId());
        String externalId = firstText(event.getSourceId(), event.getId());
        if (!StringUtils.hasText(ownerUserId) || !StringUtils.hasText(externalId)) {
            return;
        }
        LinkedHashMap<String, Object> resource = resourceIdentity(ownerUserId, "event", externalId);
        resource.put("title", nullable(event.getTitle()));
        resource.put("status", nullable(event.getStatus()));
        resource.put("startAt", nullable(event.getStartAtIso()));
        resource.put("endAt", nullable(event.getEndAtIso()));
        resource.put("sourceLink", nullable(event.getSourceLink()));
        resource.put("mode", event.getMode() == null ? "Casual" : event.getMode());
        resource.put("mingleConfiguration", event.getMingleConfiguration());
        resource.put("acceptedParticipants", safeNumber(event.getAcceptedMembers()));
        resource.put("pendingParticipants", safeNumber(event.getPendingMembers()));
        enqueue(ownerUserId, EVENT_CHANGED, "event", externalId, resource);
    }

    public void enqueue(Asset asset) {
        if (asset == null) {
            return;
        }
        String ownerUserId = normalize(asset.getOwnerUserId());
        String externalId = firstText(asset.getAssetId(), asset.getId());
        if (!StringUtils.hasText(ownerUserId) || !StringUtils.hasText(externalId)) {
            return;
        }
        LinkedHashMap<String, Object> resource = resourceIdentity(ownerUserId, "asset", externalId);
        resource.put("title", nullable(asset.getTitle()));
        resource.put("type", nullable(asset.getType()));
        resource.put("status", nullable(asset.getStatus()));
        resource.put("capacityTotal", safeNumber(asset.getCapacityTotal()));
        resource.put("quantity", safeNumber(asset.getQuantity()));
        enqueue(ownerUserId, ASSET_CHANGED, "asset", externalId, resource);
    }

    /**
     * Membership changes are event/asset changes as far as an integration is
     * concerned. Resolve the owning resource and emit the same compact webhook
     * shape, augmented only with the participant fields that are useful to the
     * resource owner. No email address or internal user id leaves the service.
     */
    public void enqueue(ActivityMember member) {
        if (member == null || !StringUtils.hasText(member.getOwnerId())) {
            return;
        }
        Map<String, Object> change = participantChange(member);
        if ("event".equals(member.getOwnerType())) {
            // `isAdmin` is a computed ActivityEvent property, not a stored Mongo
            // field. Load the event family by source id and apply the canonical
            // owner/admin check in enqueue(ActivityEvent, change).
            Query query = Query.query(Criteria.where("sourceId").is(member.getOwnerId()));
            LinkedHashSet<String> notifiedOwners = new LinkedHashSet<>();
            for (ActivityEvent event : mongoTemplate.find(query, ActivityEvent.class)) {
                if (notifiedOwners.add(normalize(event.getOwnerUserId()))) {
                    enqueue(event, change);
                }
            }
        } else if ("asset".equals(member.getOwnerType())) {
            Asset asset = mongoTemplate.findOne(
                    Query.query(Criteria.where("assetId").is(member.getOwnerId())),
                    Asset.class);
            if (asset != null) {
                enqueue(asset, change);
            }
        }
    }

    private void enqueue(ActivityEvent event, Map<String, Object> change) {
        if (event == null || !Boolean.TRUE.equals(event.getIsAdmin())) {
            return;
        }
        String ownerUserId = normalize(event.getOwnerUserId());
        String externalId = firstText(event.getSourceId(), event.getId());
        if (!StringUtils.hasText(ownerUserId) || !StringUtils.hasText(externalId)) {
            return;
        }
        LinkedHashMap<String, Object> resource = resourceIdentity(ownerUserId, "event", externalId);
        resource.put("title", nullable(event.getTitle()));
        resource.put("status", nullable(event.getStatus()));
        resource.put("startAt", nullable(event.getStartAtIso()));
        resource.put("endAt", nullable(event.getEndAtIso()));
        resource.put("sourceLink", nullable(event.getSourceLink()));
        resource.put("mode", event.getMode() == null ? "Casual" : event.getMode());
        resource.put("mingleConfiguration", event.getMingleConfiguration());
        resource.put("acceptedParticipants", safeNumber(event.getAcceptedMembers()));
        resource.put("pendingParticipants", safeNumber(event.getPendingMembers()));
        if (change != null && !change.isEmpty()) {
            resource.put("change", change);
        }
        enqueue(ownerUserId, EVENT_CHANGED, "event", externalId, resource);
    }

    private void enqueue(Asset asset, Map<String, Object> change) {
        if (asset == null) {
            return;
        }
        String ownerUserId = normalize(asset.getOwnerUserId());
        String externalId = firstText(asset.getAssetId(), asset.getId());
        if (!StringUtils.hasText(ownerUserId) || !StringUtils.hasText(externalId)) {
            return;
        }
        LinkedHashMap<String, Object> resource = resourceIdentity(ownerUserId, "asset", externalId);
        resource.put("title", nullable(asset.getTitle()));
        resource.put("type", nullable(asset.getType()));
        resource.put("status", nullable(asset.getStatus()));
        resource.put("capacityTotal", safeNumber(asset.getCapacityTotal()));
        resource.put("quantity", safeNumber(asset.getQuantity()));
        if (change != null && !change.isEmpty()) {
            resource.put("change", change);
        }
        enqueue(ownerUserId, ASSET_CHANGED, "asset", externalId, resource);
    }

    private Map<String, Object> participantChange(ActivityMember member) {
        LinkedHashMap<String, Object> change = new LinkedHashMap<>();
        change.put("kind", "participant");
        change.put("status", nullable(member.getStatus()));
        change.put("role", nullable(member.getRole()));
        change.put("actionAt", nullable(member.getActionAtIso()));
        Users participant = usersRepository.findByUserId(member.getUserId()).orElse(null);
        if (participant != null) {
            LinkedHashMap<String, Object> publicParticipant = new LinkedHashMap<>();
            publicParticipant.put("name", nullable(participant.getName()));
            publicParticipant.put("age", participant.getAge());
            publicParticipant.put("gender", nullable(participant.getGender()));
            publicParticipant.put("profileImage", participant.getImages() == null || participant.getImages().isEmpty()
                    ? null
                    : nullable(participant.getImages().get(0)));
            change.put("participant", publicParticipant);
        }
        return change;
    }

    @Scheduled(fixedDelayString = "${integration.webhook.delivery-interval-ms:1000}")
    public void deliverPending() {
        groupDatabases.runAcrossConfiguredDatabases(() -> groupRules.runScheduledGroups("integration-webhooks", this::deliverPendingInGroup));
    }

    private void deliverPendingInGroup() {
        int availableSlots = deliverySlots.availablePermits();
        if (availableSlots <= 0) {
            return;
        }
        String now = Instant.now().toString();
        // A lease recovers interrupted work in every configured database, not just the startup DB.
        mongoTemplate.updateMulti(Query.query(Criteria.where("status").is(STATUS_SENDING)
                        .and("nextAttemptAtIso").lte(now)),
                new Update().set("status", STATUS_RETRY), IntegrationWebhookDelivery.class);
        Query due = Query.query(new Criteria().andOperator(
                Criteria.where("status").in(STATUS_PENDING, STATUS_RETRY),
                Criteria.where("nextAttemptAtIso").lte(now)));
        due.with(Sort.by(Sort.Order.asc("createdAtIso")));
        due.limit(Math.min(deliveryBatchSize, availableSlots));
        for (IntegrationWebhookDelivery candidate : jobGroupScope.findOwned(due, IntegrationWebhookDelivery.class, "ownerUserId")) {
            var permit = McpEventsService.PROTOCOL.equals(candidate.getProtocol()) ? mcpEvents.reserveDelivery() : null;
            if (McpEventsService.PROTOCOL.equals(candidate.getProtocol()) && permit == null) continue;
            if (!deliverySlots.tryAcquire()) {
                if (permit != null) permit.close();
                break;
            }
            IntegrationWebhookDelivery claimed;
            try {
                claimed = mongoTemplate.findAndModify(
                    Query.query(new Criteria().andOperator(
                            Criteria.where("_id").is(candidate.getId()),
                            Criteria.where("status").in(STATUS_PENDING, STATUS_RETRY),
                            Criteria.where("nextAttemptAtIso").lte(now))),
                    new Update().set("status", STATUS_SENDING).set("nextAttemptAtIso", Instant.now().plusSeconds(60).toString()),
                    FindAndModifyOptions.options().returnNew(true),
                    IntegrationWebhookDelivery.class);
            } catch (RuntimeException error) {
                deliverySlots.release(); if (permit != null) permit.close(); throw error;
            }
            if (claimed == null) { deliverySlots.release(); if (permit != null) permit.close(); }
            if (claimed != null) {
                try {
                    var groupId = com.raxim.myscoutee.domain.platform.service.JobGroupContext.groupId();
                    var mode = com.raxim.myscoutee.common.config.mongo.MongoSessionModeContext.currentMode();
                    deliveryExecutor.execute(() -> {
                        var previousMode = com.raxim.myscoutee.common.config.mongo.MongoSessionModeContext.currentMode();
                        try {
                            com.raxim.myscoutee.common.config.mongo.MongoSessionModeContext.set(mode);
                            com.raxim.myscoutee.domain.platform.service.JobGroupContext.run(groupId, () -> deliver(claimed, permit));
                        } finally {
                            com.raxim.myscoutee.common.config.mongo.MongoSessionModeContext.set(previousMode);
                            deliverySlots.release();
                            if (permit != null) permit.close();
                        }
                    });
                } catch (RejectedExecutionException exception) {
                    deliverySlots.release();
                    if (permit != null) permit.close();
                    claimed.setStatus(STATUS_RETRY);
                    claimed.setNextAttemptAtIso(Instant.now().toString());
                    claimed.setLastError("worker_pool_busy");
                    deliveriesRepository.save(claimed);
                    break;
                }
            }
        }
    }

    /** MSC-118 role notifications feed the existing durable Events queue, without a polling worker. */
    public void enqueueRoleAttention(RoleAttention notification) {
        String name = switch (String.valueOf(notification.entityType())) {
            case "app-admin" -> McpEventsService.ADMIN_ATTENTION;
            case "operator" -> McpEventsService.OPERATOR_ATTENTION;
            default -> null;
        };
        if (name == null || !McpEventsService.roleKinds(name).contains(notification.notificationType())) return;
        for (String owner : notification.recipientUserIds()) {
            enqueue(owner, name, notification.entityType(), "node", Map.of("kind", notification.notificationType()),
                    notification.id(), List.of());
        }
    }

    private void enqueue(
            String ownerUserId,
            String eventType,
            String resourceType,
            String externalId,
            Map<String, Object> resource) {
        enqueue(ownerUserId, eventType, resourceType, externalId, resource, null,
                activeSubscriptions(ownerUserId, eventType));
    }

    private List<IntegrationWebhookSubscription> activeSubscriptions(String ownerUserId, String eventType) {
        var access = integrationAccess(ownerUserId);
        return subscriptionsRepository.findByOwnerUserIdAndEnabledTrue(ownerUserId).stream()
                .filter(subscription -> subscription.getEventTypes() != null && subscription.getEventTypes().contains(eventType))
                .filter(subscription -> tokenIsActive(subscription.getTokenId(), ownerUserId, access)).toList();
    }

    public void enqueueEncounters(String ownerUserId, Supplier<IntegrationEncountersDto> result) {
        List<IntegrationWebhookSubscription> subscriptions = activeSubscriptions(ownerUserId, EVENT_ENCOUNTERS);
        if (subscriptions.isEmpty() && (mcpEvents == null || !mcpEvents.hasSubscriptions(ownerUserId, EVENT_ENCOUNTERS))) return;
        IntegrationEncountersDto all = result.get();
        for (int offset = 0; offset < Math.max(1, all.total()); offset += 1000) {
            IntegrationEncountersDto page = IntegrationEventQueryService.page(all, offset, 1000);
            LinkedHashMap<String, Object> resource = new LinkedHashMap<>();
            resource.put("id", page.id());
            resource.put("externalId", page.externalId());
            resource.put("revision", page.revision());
            resource.put("pairs", page.pairs());
            resource.put("total", page.total());
            resource.put("offset", offset);
            resource.put("nextOffset", page.nextOffset());
            enqueue(ownerUserId, EVENT_ENCOUNTERS, "event", all.externalId(), resource,
                    all.externalId() + ":" + all.revision() + ":" + offset, subscriptions);
        }
    }

    private void enqueue(String ownerUserId, String eventType, String resourceType, String externalId,
            Map<String, Object> resource, String idempotencyKey, List<IntegrationWebhookSubscription> subscriptions) {
        // Encounter pages share one availability summary; the read tool owns pagination.
        if (mcpEvents != null && (!EVENT_ENCOUNTERS.equals(eventType) || Integer.valueOf(0).equals(resource.get("offset")))) {
            for (var delivery : mcpEvents.deliveries(ownerUserId, eventType, resourceType, externalId, resource, idempotencyKey)) {
                try { deliveriesRepository.insert(delivery); }
                catch (DuplicateKeyException alreadyQueued) { /* Preserve prior delivery and retry state. */ }
            }
        }
        for (IntegrationWebhookSubscription subscription : subscriptions) {
            String deliveryId = idempotencyKey == null ? UUID.randomUUID().toString()
                    : UUID.nameUUIDFromBytes((eventType + ":" + subscription.getId() + ":" + idempotencyKey)
                            .getBytes(StandardCharsets.UTF_8)).toString();
            String occurredAt = Instant.now().toString();
            LinkedHashMap<String, Object> payload = new LinkedHashMap<>();
            payload.put("deliveryId", deliveryId);
            payload.put("type", eventType);
            payload.put("occurredAt", occurredAt);
            payload.put("resource", resource);

            IntegrationWebhookDelivery delivery = new IntegrationWebhookDelivery();
            delivery.setId(deliveryId);
            delivery.setSubscriptionId(subscription.getId());
            delivery.setOwnerUserId(ownerUserId);
            delivery.setEventType(eventType);
            delivery.setResourceType(resourceType);
            delivery.setResourceExternalId(externalId);
            delivery.setPayloadJson(writePayload(payload));
            delivery.setStatus(STATUS_PENDING);
            delivery.setAttemptCount(0);
            delivery.setNextAttemptAtIso(occurredAt);
            delivery.setCreatedAtIso(occurredAt);
            if (idempotencyKey == null) {
                deliveriesRepository.save(delivery);
            } else {
                try {
                    deliveriesRepository.insert(delivery);
                } catch (DuplicateKeyException alreadyQueued) {
                    // A retry after a producer restart must not overwrite a sent or pending delivery.
                }
            }
        }
    }

    private LinkedHashMap<String, Object> resourceIdentity(
            String ownerUserId,
            String resourceType,
            String externalId) {
        LinkedHashMap<String, Object> resource = new LinkedHashMap<>();
        IntegrationExternalId mapping = externalIdsRepository
                .findByOwnerUserIdAndResourceTypeAndInternalId(ownerUserId, resourceType, externalId)
                .orElse(null);
        resource.put("id", mapping == null ? null : mapping.getExternalId());
        resource.put("externalId", externalId);
        return resource;
    }

    private void deliver(IntegrationWebhookDelivery delivery) { deliver(delivery, null); }
    private void deliver(IntegrationWebhookDelivery delivery, McpEventCallbackClient.DeliveryPermit permit) {
        if (McpEventsService.PROTOCOL.equals(delivery.getProtocol())) {
            try {
                int status = mcpEvents.deliver(delivery, permit);
                if (status >= 200 && status < 300) {
                    delivery.setStatus(STATUS_SENT); delivery.setSentAtIso(Instant.now().toString());
                    delivery.setLastError(null); deliveriesRepository.save(delivery);
                } else if (status == 410 || status == 413 || (status >= 400 && status < 500 && status != 429)) {
                    markFailed(delivery, "http_" + status);
                } else scheduleRetry(delivery, "http_" + status);
            } catch (McpEventCallbackClient.Throttled throttled) {
                // Local backpressure is scheduling, not a failed remote attempt.
                delivery.setStatus(STATUS_RETRY);
                delivery.setNextAttemptAtIso(Instant.now().plusSeconds(1).toString());
                delivery.setLastError("throttled"); deliveriesRepository.save(delivery);
            } catch (RuntimeException | java.io.IOException failure) {
                scheduleRetry(delivery, failure.getClass().getSimpleName());
            }
            return;
        }
        IntegrationWebhookSubscription subscription = subscriptionsRepository
                .findById(delivery.getSubscriptionId())
                .filter(value -> Boolean.TRUE.equals(value.getEnabled()))
                .filter(value -> tokenIsActive(value.getTokenId(), delivery.getOwnerUserId(), integrationAccess(delivery.getOwnerUserId())))
                .orElse(null);
        if (subscription == null) {
            markFailed(delivery, "subscription_inactive");
            return;
        }
        try {
            URI callback = validateCallbackUri(subscription.getCallbackUrl());
            HttpRequest request = HttpRequest.newBuilder(callback)
                    .timeout(Duration.ofSeconds(10))
                    .header("Content-Type", "application/json")
                    .header("Accept", "application/json")
                    .header("User-Agent", "MyScoutee-Webhook/1.0.1")
                    .header("X-MyScoutee-Webhook-Id", delivery.getId())
                    .POST(HttpRequest.BodyPublishers.ofString(delivery.getPayloadJson()))
                    .build();
            HttpResponse<Void> response = sendWithResponseDeadline(request);
            if (response.statusCode() >= 200 && response.statusCode() < 300) {
                delivery.setStatus(STATUS_SENT);
                delivery.setSentAtIso(Instant.now().toString());
                delivery.setLastError(null);
                deliveriesRepository.save(delivery);
                return;
            }
            scheduleRetry(delivery, "http_" + response.statusCode());
        } catch (InterruptedException exception) {
            Thread.currentThread().interrupt();
            scheduleRetry(delivery, "interrupted");
        } catch (RuntimeException | java.io.IOException exception) {
            scheduleRetry(delivery, exception.getClass().getSimpleName());
        }
    }

    private HttpResponse<Void> sendWithResponseDeadline(HttpRequest request)
            throws java.io.IOException, InterruptedException {
        var response = httpClient.sendAsync(request, HttpResponse.BodyHandlers.discarding());
        try {
            // HttpRequest.timeout alone does not bound a body that stalls after its headers.
            return response.get(10, TimeUnit.SECONDS);
        } catch (TimeoutException exception) {
            throw new HttpTimeoutException("Webhook response exceeded 10 seconds");
        } catch (ExecutionException exception) {
            if (exception.getCause() instanceof java.io.IOException cause) {
                throw cause;
            }
            if (exception.getCause() instanceof RuntimeException cause) {
                throw cause;
            }
            throw new java.io.IOException("Webhook delivery failed", exception.getCause());
        } finally {
            if (!response.isDone()) {
                response.cancel(true);
            }
        }
    }

    private void scheduleRetry(IntegrationWebhookDelivery delivery, String error) {
        int attempts = safeNumber(delivery.getAttemptCount()) + 1;
        delivery.setAttemptCount(attempts);
        delivery.setLastError(shortText(error));
        if (attempts > RETRY_SECONDS.size()) {
            delivery.setStatus(STATUS_FAILED);
            delivery.setNextAttemptAtIso(null);
        } else {
            delivery.setStatus(STATUS_RETRY);
            delivery.setNextAttemptAtIso(Instant.now()
                    .plus(RETRY_SECONDS.get(attempts - 1), ChronoUnit.SECONDS)
                    .toString());
        }
        deliveriesRepository.save(delivery);
    }

    private void markFailed(IntegrationWebhookDelivery delivery, String error) {
        delivery.setStatus(STATUS_FAILED);
        delivery.setLastError(shortText(error));
        delivery.setNextAttemptAtIso(null);
        deliveriesRepository.save(delivery);
    }

    private com.raxim.myscoutee.domain.integrations.document.IntegrationAccess integrationAccess(String ownerUserId) {
        return usersRepository.findByUserId(ownerUserId).map(owner -> owner.getIntegrationAccess() == null
                ? com.raxim.myscoutee.domain.integrations.document.IntegrationAccess.initial() : owner.getIntegrationAccess()).orElse(null);
    }

    private boolean tokenIsActive(String tokenId, String ownerUserId, com.raxim.myscoutee.domain.integrations.document.IntegrationAccess access) {
        if (access == null) return false;
        IntegrationToken token = tokensRepository.findByIdAndOwnerUserId(tokenId, ownerUserId).orElse(null);
        if (token == null || StringUtils.hasText(token.getRevokedAtIso())) {
            return false;
        }
        try {
            return Instant.parse(token.getExpiresAtIso()).isAfter(Instant.now())
                    && access.effective(tokenId, IntegrationTokenService.MCP_SCOPE.equals(token.getScope()))
                        != com.raxim.myscoutee.domain.integrations.document.IntegrationAccess.Mode.BLOCKED;
        } catch (RuntimeException ignored) {
            return false;
        }
    }

    private String normalizeCallbackUrl(String value) {
        try {
            return validateCallbackUri(value).toString();
        } catch (ResponseStatusException exception) {
            throw exception;
        } catch (RuntimeException exception) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "A valid callback URL is required.");
        }
    }

    private URI validateCallbackUri(String value) {
        String normalized = normalize(value);
        if (!StringUtils.hasText(normalized)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "A callback URL is required.");
        }
        URI uri;
        try {
            uri = URI.create(normalized);
        } catch (RuntimeException exception) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "A valid callback URL is required.");
        }
        String scheme = normalize(uri.getScheme());
        boolean supportedScheme = "https".equalsIgnoreCase(scheme)
                || (allowHttp && "http".equalsIgnoreCase(scheme));
        if (!supportedScheme || !StringUtils.hasText(uri.getHost())
                || uri.getUserInfo() != null || uri.getFragment() != null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    allowHttp
                            ? "The callback must be an absolute HTTP or HTTPS URL without credentials or a fragment."
                            : "The callback must be an absolute HTTPS URL without credentials or a fragment.");
        }
        if (!allowPrivateAddresses) {
            try {
                for (InetAddress address : InetAddress.getAllByName(uri.getHost())) {
                    if (address.isAnyLocalAddress() || address.isLoopbackAddress()
                            || address.isLinkLocalAddress() || address.isSiteLocalAddress()
                            || address.isMulticastAddress()) {
                        throw new ResponseStatusException(
                                HttpStatus.BAD_REQUEST,
                                "The callback URL must resolve to a public address.");
                    }
                }
            } catch (ResponseStatusException exception) {
                throw exception;
            } catch (Exception exception) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "The callback host cannot be resolved.");
            }
        }
        return uri;
    }

    private List<String> normalizeEventTypes(List<String> requested) {
        if (requested == null || requested.isEmpty()) {
            return List.of(EVENT_CHANGED, ASSET_CHANGED);
        }
        LinkedHashSet<String> normalized = new LinkedHashSet<>();
        for (String value : requested) {
            String eventType = normalize(value);
            if (!SUPPORTED_EVENTS.contains(eventType)) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unsupported watch event: " + eventType);
            }
            normalized.add(eventType);
        }
        return List.copyOf(normalized);
    }

    private String writePayload(Map<String, Object> payload) {
        try {
            return objectMapper.writeValueAsString(payload);
        } catch (JacksonException exception) {
            throw new IllegalStateException("Unable to serialize integration webhook payload.", exception);
        }
    }

    private String shortText(String value) {
        String normalized = normalize(value);
        if (!StringUtils.hasText(normalized)) {
            return "delivery_failed";
        }
        return normalized.length() <= 240 ? normalized : normalized.substring(0, 240);
    }

    private Object nullable(String value) {
        String normalized = normalize(value);
        return StringUtils.hasText(normalized) ? normalized : null;
    }

    private String firstText(String first, String second) {
        String normalized = normalize(first);
        return StringUtils.hasText(normalized) ? normalized : normalize(second);
    }

    private int safeNumber(Integer value) {
        return value == null ? 0 : value;
    }

    private String normalize(String value) {
        return value == null ? null : value.trim();
    }
}

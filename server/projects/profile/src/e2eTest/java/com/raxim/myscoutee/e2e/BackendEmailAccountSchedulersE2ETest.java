package com.raxim.myscoutee.e2e;

import static org.assertj.core.api.Assertions.assertThat;
import static org.awaitility.Awaitility.await;
import static org.mockito.Mockito.RETURNS_DEEP_STUBS;
import static org.mockito.Mockito.mock;

import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.function.Supplier;

import org.bson.Document;
import org.bson.types.ObjectId;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Tag;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Primary;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.model.Filters;
import com.mongodb.client.model.ReplaceOptions;
import com.raxim.myscoutee.Main;
import com.raxim.myscoutee.profile.data.AssetCatalog;
import com.raxim.myscoutee.common.config.mongo.MongoSessionMode;
import com.raxim.myscoutee.common.config.mongo.MongoSessionModeContext;
import com.raxim.myscoutee.profile.data.document.AccountPurgeJob;
import com.raxim.myscoutee.profile.data.document.Chat;
import com.raxim.myscoutee.profile.data.document.ChatMessage;
import com.raxim.myscoutee.profile.data.document.ActivityEvent;
import com.raxim.myscoutee.profile.data.document.ActivityMember;
import com.raxim.myscoutee.profile.data.document.Asset;
import com.raxim.myscoutee.profile.data.document.EmailCampaignRule;
import com.raxim.myscoutee.profile.data.document.EmailOutboxItem;
import com.raxim.myscoutee.profile.data.document.EmailTemplate;
import com.raxim.myscoutee.profile.data.document.NotificationOutboxItem;
import com.raxim.myscoutee.profile.data.document.Users;
import com.raxim.myscoutee.profile.data.dto.shared.SharedDtos.LocationCoordinatesDto;
import com.raxim.myscoutee.profile.service.DeletedAccountPurgeService;
import com.raxim.myscoutee.profile.service.email.EmailOutboxStatus;
import com.raxim.myscoutee.profile.service.email.PromotionalEmailDeliveryProcessor;
import com.raxim.myscoutee.profile.service.email.PromotionalEmailPlannerService;

import de.flapdoodle.embed.mongo.commands.ServerAddress;
import de.flapdoodle.embed.mongo.distribution.Version;
import de.flapdoodle.embed.mongo.transitions.Mongod;
import de.flapdoodle.embed.mongo.transitions.RunningMongodProcess;
import de.flapdoodle.reverse.TransitionWalker;

@Tag("e2e")
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
@SpringBootTest(
        classes = {Main.class, BackendEmailAccountSchedulersE2ETest.E2eInfrastructure.class},
        webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT,
        properties = {
                "config.firebase-enabled=false",
                "config.dev-user=",
                "admin.stats.enabled=false",
                "assets.source-refresh.enabled=false",
                "media.enabled=false",
                "payment.enablePay=false",
                "events.scheduler.enabled=false",
                "events.scheduler.check-delay-ms=600000",
                "events.waitlist.inviter-check-delay-ms=600000",
                "scheduled-messages.task-poll-delay-ms=600000",
                "chat.stream.poll-delay-ms=600000",
                "notifications.outbox.worker-check-delay-ms=600000",
                "notifications.outbox.wakeup-poll-delay-ms=600000",
                "email.enabled=true",
                "email.provider=noop",
                "email.promotions.enabled=true",
                "email.promotions.scheduler-poll-delay-ms=100",
                "email.promotions.planning-delay-ms=600000",
                "email.promotions.delivery-delay-ms=100",
                "email.promotions.delivery-batch-size=25",
                "affinity.recompute.worker-tick-ms=600000",
                "users.deleted-account-purge-delay-ms=100",
                "spring.main.allow-bean-definition-overriding=true",
                "logging.level.org.springframework.data.mongodb.core.MongoTemplate=WARN"
        })
class BackendEmailAccountSchedulersE2ETest {
    private static final String DB_SUFFIX = UUID.randomUUID().toString().replace("-", "");
    private static final String REAL_DB = "ms_email_account_real_" + DB_SUFFIX;
    private static final String DEMO_DB = "ms_email_account_demo_" + DB_SUFFIX;
    private static final String RULE_KEY = "e2e-promo-missing-device";
    private static final String TEMPLATE_KEY = "e2e-promo-template";
    private static final String PURGED_USER_ID = "e2e-purge-user";
    private static final String SURVIVOR_ID = "e2e-purge-survivor";
    private static final String PURGED_EVENT_ID = "e2e-purge-owned-event";
    private static final String PURGED_ASSET_ID = "e2e-purge-owned-transport";
    private static final String PURGE_CHAT_ID = "e2e-purge-chat";
    private static final Instant BASE_TIME = Instant.parse("2026-06-25T12:00:00Z");

    private static TransitionWalker.ReachedState<RunningMongodProcess> embeddedMongo;
    private static String mongoBaseUri;

    @Autowired
    private MongoTemplate mongoTemplate;
    @Autowired
    private DeletedAccountPurgeService deletedAccountPurgeService;
    @Autowired
    private PromotionalEmailPlannerService promotionalEmailPlannerService;
    @Autowired
    private PromotionalEmailDeliveryProcessor promotionalEmailDeliveryProcessor;

    @DynamicPropertySource
    static void mongoProperties(DynamicPropertyRegistry registry) {
        ensureEmbeddedMongo();
        registry.add("SPRING_MONGODB_URI", () -> mongoBaseUri + "/" + REAL_DB);
        registry.add("MONGODB_DEMO_URI", () -> mongoBaseUri + "/" + DEMO_DB);
        registry.add("spring.mongodb.database", () -> REAL_DB);
        registry.add("MONGODB_DEMO_DATABASE", () -> DEMO_DB);
    }

    @AfterAll
    static void stopEmbeddedMongo() throws Exception {
        if (embeddedMongo != null) {
            embeddedMongo.close();
        }
    }

    @BeforeEach
    void seedEmailAccountBackend() {
        withReal(() -> {
            clearE2eCollections();
            seedPromotionalEmailTemplate();
            seedPurgeReferencedDocuments();
            seedUsersLast();
            seedPromotionalEmailRule();
        });
    }

    @Test
    void emailAndDeletedAccountSchedulersProcessDueBackendWorkForVariedUsers() {
        Instant startedAt = Instant.now();

        await().atMost(Duration.ofSeconds(20)).pollInterval(Duration.ofMillis(150)).untilAsserted(() -> {
            withReal(() -> {
                promotionalEmailPlannerService.planScheduledPromotionalEmails();
                promotionalEmailDeliveryProcessor.processScheduledPromotionalEmails();
                promotionalEmailDeliveryProcessor.processScheduledPromotionalEmails();
            });
            List<EmailOutboxItem> emails = promoEmails();
            assertThat(emails).hasSize(30);
            assertThat(emails).allSatisfy(email -> {
                assertThat(email.getStatus()).isEqualTo(EmailOutboxStatus.SENT);
                assertThat(email.getProvider()).isEqualTo("noop");
                assertThat(email.getAttemptCount()).isEqualTo(1);
                assertThat(email.getProviderMessageId()).startsWith("noop-");
                assertThat(email.getSentDate()).isNotBlank();
                assertThat(email.getSubject()).contains("Finish your MyScoutee setup");
                assertThat(email.getTemplateVariables()).containsEntry("campaign_rule_key", RULE_KEY);
            });
        });

        List<EmailOutboxItem> emails = promoEmails();
        assertThat(emails.stream().map(EmailOutboxItem::getUserId).toList())
                .containsExactlyInAnyOrderElementsOf(qualifyingUserIds());
        assertThat(emails.stream().map(EmailOutboxItem::getUserId).toList())
                .doesNotContain("e2e-mail-u31", "e2e-mail-u41", "e2e-mail-u46", PURGED_USER_ID);

        EmailCampaignRule rule = findOne(Query.query(Criteria.where("ruleKey").is(RULE_KEY)), EmailCampaignRule.class);
        assertThat(rule).isNotNull();
        assertThat(rule.getRunning()).isFalse();
        assertThat(rule.getLastRunStatus()).isEqualTo("completed");
        assertThat(rule.getLastRunCount()).isEqualTo(30);
        assertThat(rule.getNextRunAtIso()).isBlank();

        await().during(Duration.ofMillis(500)).atMost(Duration.ofSeconds(2)).pollInterval(Duration.ofMillis(100)).untilAsserted(() ->
                assertThat(promoEmails()).hasSize(30));

        await().atMost(Duration.ofSeconds(20)).pollInterval(Duration.ofMillis(150)).untilAsserted(() -> {
            deletedAccountPurgeService.purgeExpiredDeletedAccounts();
            assertThat(findOne(Query.query(Criteria.where("_id").is(PURGED_USER_ID)), Users.class)).isNull();
            AccountPurgeJob job = findOne(new Query(), AccountPurgeJob.class);
            assertThat(job).isNotNull();
            assertThat(job.getStatus()).isEqualTo(AccountPurgeJob.STATUS_COMPLETED);
            assertThat(job.getStage()).isEqualTo("completed");
            assertThat(job.getUserId()).isNull();
            assertThat(job.getUserHash()).isNotBlank();
            assertThat(job.getCompletedAtIso()).isNotBlank();
        });

        assertThat(findOne(Query.query(Criteria.where("sourceId").is(PURGED_EVENT_ID)), ActivityEvent.class)).isNull();
        assertThat(findOne(Query.query(Criteria.where("assetId").is(PURGED_ASSET_ID)), Asset.class)).isNull();
        assertThat(findAll(Query.query(Criteria.where("ownerId").in(PURGED_EVENT_ID, PURGED_ASSET_ID)), ActivityMember.class)).isEmpty();
        assertThat(findAll(Query.query(Criteria.where("userId").is(PURGED_USER_ID)), ActivityMember.class)).isEmpty();
        assertThat(findAll(Query.query(Criteria.where("recipientUserIds").is(PURGED_USER_ID)), NotificationOutboxItem.class)).isEmpty();

        Chat scrubbedChat = findOne(Query.query(Criteria.where("id").is(PURGE_CHAT_ID)), Chat.class);
        assertThat(scrubbedChat).isNotNull();
        assertThat(scrubbedChat.getOwnerUserId()).isEqualTo("deleted-user");
        assertThat(scrubbedChat.getMemberIds()).containsExactly(SURVIVOR_ID);
        List<ChatMessage> scrubbedMessages = findAll(
                Query.query(Criteria.where("chatId").is(PURGE_CHAT_ID)).with(Sort.by(Sort.Direction.ASC, "sentAtIso")),
                ChatMessage.class);
        assertThat(scrubbedMessages).hasSize(2);
        ChatMessage deletedMessage = scrubbedMessages.get(0);
        assertThat(deletedMessage.getText()).isBlank();
        assertThat(deletedMessage.getSender()).isEqualTo("Deleted user");
        assertThat(deletedMessage.getSenderAvatar().getInitials()).isEqualTo("DU");
        assertThat(deletedMessage.getSenderAvatar().getGender()).isEqualTo("deleted");
        assertThat(deletedMessage.getAttachments()).isEmpty();
        assertThat(deletedMessage.getDeletedAtIso()).isNotBlank();
        ChatMessage survivorMessage = scrubbedMessages.get(1);
        assertThat(survivorMessage.getReadBy()).isEmpty();
        assertThat(survivorMessage.getReactions()).isEmpty();
        assertThat(survivorMessage.getPinnedByUserId()).isNull();
        assertThat(survivorMessage.getReplyTo().getSender()).isEqualTo("Deleted user");
        assertThat(survivorMessage.getReplyTo().getText()).isEqualTo("Message unavailable");

        assertThat(Duration.between(startedAt, Instant.now())).isLessThan(Duration.ofSeconds(20));
    }

    private void clearE2eCollections() {
        mongoTemplate.remove(new Query(), Users.class);
        mongoTemplate.remove(new Query(), EmailCampaignRule.class);
        mongoTemplate.remove(new Query(), EmailTemplate.class);
        mongoTemplate.remove(new Query(), EmailOutboxItem.class);
        mongoTemplate.remove(new Query(), AccountPurgeJob.class);
        mongoTemplate.remove(new Query(), ActivityEvent.class);
        mongoTemplate.remove(new Query(), ActivityMember.class);
        mongoTemplate.remove(new Query(), Asset.class);
        mongoTemplate.remove(new Query(), Chat.class);
        mongoTemplate.remove(new Query(), ChatMessage.class);
        mongoTemplate.remove(new Query(), NotificationOutboxItem.class);
    }

    private void seedPromotionalEmailTemplate() {
        EmailTemplate template = new EmailTemplate();
        template.setId(new ObjectId().toHexString());
        template.setSyncKey("e2e-email-template-" + UUID.randomUUID());
        template.setTemplateKey(TEMPLATE_KEY);
        template.setName("E2E promo template");
        template.setCategory("promotional");
        template.setLocale("en");
        template.setEnabled(true);
        template.setSubjectTemplate("Finish your MyScoutee setup, {{firstName}}");
        template.setHtmlTemplate("<p>{{firstName}}, open {{cta_url}} from {{user_city}}.</p>");
        template.setTextTemplate("{{firstName}}, open {{cta_url}} from {{user_city}}.");
        template.setCreatedDate(BASE_TIME.toString());
        template.setCreatedUser("e2e");
        template.setUpdatedDate(BASE_TIME.toString());
        template.setUpdatedUser("e2e");
        mongoTemplate.save(template);
    }

    private void seedPromotionalEmailRule() {
        EmailCampaignRule rule = new EmailCampaignRule();
        rule.setId(new ObjectId().toHexString());
        rule.setSyncKey("e2e-email-rule-" + UUID.randomUUID());
        rule.setRuleKey(RULE_KEY);
        rule.setName("Missing device promo");
        rule.setDescription("Qualifies active HU users without registered devices.");
        rule.setTemplateKey(TEMPLATE_KEY);
        rule.setTriggerType("scheduled");
        rule.setEnabled(true);
        rule.setSuspended(false);
        rule.setScheduleType("one-time");
        rule.setOneTimeAtIso(Instant.now().minusSeconds(1).toString());
        rule.setPriority(100);
        rule.setCooldownHours(24);
        rule.setMaxDeliveriesPerUser(1);
        rule.setMinProfileCompletion(40);
        rule.setRequirePublicProfile(true);
        rule.setRequireMissingRegisteredDevice(true);
        rule.setCountryCodes(List.of("HU"));
        rule.setCtaPath("/game");
        rule.setTemplateVariables(Map.of("custom_segment", "e2e"));
        rule.setCreatedDate(BASE_TIME.toString());
        rule.setCreatedUser("e2e");
        rule.setUpdatedDate(BASE_TIME.toString());
        rule.setUpdatedUser("e2e");
        mongoTemplate.save(rule);
    }

    private void seedPurgeReferencedDocuments() {
        ActivityEvent event = new ActivityEvent();
        event.setId(new ObjectId().toHexString());
        event.setSyncKey("e2e-purge-event-" + UUID.randomUUID());
        event.setSourceId(PURGED_EVENT_ID);
        event.setOwnerUserId(PURGED_USER_ID);
        event.setCreatorUserId(PURGED_USER_ID);
        event.setStatus(ActivityEvent.STATUS_ACTIVE);
        event.setTitle("Owned event to purge");
        event.setImageUrl("event/purge-event.webp");
        event.setLocation("Purge Arena");
        event.setLocationCoordinates(new LocationCoordinatesDto(48.1486d, 17.1077d));
        event.setStartAtIso(BASE_TIME.plus(Duration.ofDays(2)).toString());
        event.setEndAtIso(BASE_TIME.plus(Duration.ofDays(2)).plus(Duration.ofHours(2)).toString());
        event.setCreatedDate(BASE_TIME.toString());
        event.setCreatedUser(PURGED_USER_ID);
        event.setUpdatedDate(BASE_TIME.toString());
        event.setUpdatedUser(PURGED_USER_ID);
        mongoTemplate.save(event);

        mongoTemplate.save(member("event-member", "event", PURGED_EVENT_ID, SURVIVOR_ID));
        mongoTemplate.save(member("event-purged-membership", "event", "survivor-event", PURGED_USER_ID));

        Asset asset = new Asset();
        asset.setId(new ObjectId().toHexString());
        asset.setSyncKey("e2e-purge-asset-" + UUID.randomUUID());
        asset.setAssetId(PURGED_ASSET_ID);
        asset.setOwnerUserId(PURGED_USER_ID);
        asset.setType(AssetCatalog.TYPE_TRANSPORT);
        asset.setTitle("Owned transport to purge");
        asset.setImageUrl("asset/purge-transport.webp");
        asset.setVisibility("Public");
        asset.setStatus("A");
        asset.setCreatedDate(BASE_TIME.toString());
        asset.setCreatedUser(PURGED_USER_ID);
        asset.setUpdatedDate(BASE_TIME.toString());
        asset.setUpdatedUser(PURGED_USER_ID);
        mongoTemplate.save(asset);

        mongoTemplate.save(member("asset-member", "asset", PURGED_ASSET_ID, SURVIVOR_ID));
        Chat purgeChat = purgeChat();
        mongoTemplate.save(purgeChat);
        mongoTemplate.save(E2eChatTestSupport.persistedMessage(PURGE_CHAT_ID, purgedUserMessage()));
        mongoTemplate.save(E2eChatTestSupport.persistedMessage(PURGE_CHAT_ID, survivorReplyMessage()));
        mongoTemplate.save(notificationReferencingPurgedUser());
    }

    private ActivityMember member(String key, String ownerType, String ownerId, String userId) {
        ActivityMember member = new ActivityMember();
        member.setId(new ObjectId().toHexString());
        member.setSyncKey("e2e-purge-" + key + "-" + UUID.randomUUID());
        member.setOwnerType(ownerType);
        member.setOwnerId(ownerId);
        member.setUserId(userId);
        member.setRole("Member");
        member.setStatus("accepted");
        member.setCreatedDate(BASE_TIME.toString());
        member.setCreatedUser("e2e");
        member.setUpdatedDate(BASE_TIME.toString());
        member.setUpdatedUser("e2e");
        return member;
    }

    private Chat purgeChat() {
        Chat chat = new Chat();
        chat.setMongoId(PURGE_CHAT_ID + ":" + PURGED_USER_ID);
        chat.setChatId(PURGE_CHAT_ID);
        chat.setOwnerUserId(PURGED_USER_ID);
        chat.setTitle("Purge chat");
        chat.setMemberIds(List.of(PURGED_USER_ID, SURVIVOR_ID));
        chat.setUnread(2);
        chat.setDateIso(BASE_TIME.plus(Duration.ofMinutes(3)).toString());
        chat.setChannelType("mainEvent");
        chat.setLastMessage("Please keep this after purge");
        chat.setLastSenderId(SURVIVOR_ID);
        chat.setMessages(List.of(purgedUserMessage(), survivorReplyMessage()));
        return chat;
    }

    private ChatMessage purgedUserMessage() {
        ChatMessage message = new ChatMessage();
        message.setId("purged-message");
        message.setSender("Deleted Soon");
        message.setSenderAvatar(chatAvatar(PURGED_USER_ID, "DS", "woman"));
        message.setText("Message that must be scrubbed");
        message.setSentAtIso(BASE_TIME.plus(Duration.ofMinutes(1)).toString());
        message.setReadBy(List.of(chatRead(SURVIVOR_ID, "SU", "man")));
        message.setReactions(new ArrayList<>());
        ChatMessage.ChatMessageAttachmentRecord attachment = new ChatMessage.ChatMessageAttachmentRecord();
        attachment.setId("voice-1");
        attachment.setType("voice");
        attachment.setTitle("voice");
        attachment.setUrl("chat/purge/audio.mp3");
        attachment.setPreviewUrl("chat/purge/audio-preview.webp");
        message.setAttachments(List.of(attachment));
        return message;
    }

    private ChatMessage survivorReplyMessage() {
        ChatMessage message = new ChatMessage();
        message.setId("survivor-message");
        message.setSender("Survivor User");
        message.setSenderAvatar(chatAvatar(SURVIVOR_ID, "SU", "man"));
        message.setText("Please keep this after purge");
        message.setSentAtIso(BASE_TIME.plus(Duration.ofMinutes(2)).toString());
        message.setReadBy(List.of(chatRead(PURGED_USER_ID, "DS", "woman")));
        ChatMessage.ChatMessageReactionRecord reaction = new ChatMessage.ChatMessageReactionRecord();
        reaction.setEmoji(":wave:");
        reaction.setUserId(PURGED_USER_ID);
        reaction.setUserName("Deleted Soon");
        reaction.setUserInitials("DS");
        reaction.setUserGender("woman");
        reaction.setReactedAtIso(BASE_TIME.plus(Duration.ofMinutes(2)).toString());
        message.setReactions(List.of(reaction));
        ChatMessage.ChatMessageReplyRecord reply = new ChatMessage.ChatMessageReplyRecord();
        reply.setId("purged-message");
        reply.setSender("Deleted Soon");
        reply.setText("Message that must be scrubbed");
        message.setReplyTo(reply);
        message.setPinnedAtIso(BASE_TIME.plus(Duration.ofMinutes(2)).toString());
        message.setPinnedByUserId(PURGED_USER_ID);
        return message;
    }

    private ChatMessage.ChatAvatarRecord chatAvatar(String userId, String initials, String gender) {
        ChatMessage.ChatAvatarRecord avatar = new ChatMessage.ChatAvatarRecord();
        avatar.setId(userId);
        avatar.setInitials(initials);
        avatar.setGender(gender);
        return avatar;
    }

    private ChatMessage.ChatReadAvatarRecord chatRead(String userId, String initials, String gender) {
        ChatMessage.ChatReadAvatarRecord reader = new ChatMessage.ChatReadAvatarRecord();
        reader.setId(userId);
        reader.setInitials(initials);
        reader.setGender(gender);
        return reader;
    }

    private NotificationOutboxItem notificationReferencingPurgedUser() {
        NotificationOutboxItem item = new NotificationOutboxItem();
        item.setId(new ObjectId().toHexString());
        item.setSyncKey("e2e-purge-notification-" + UUID.randomUUID());
        item.setNotificationType("chat-message");
        item.setEntityType("chat");
        item.setEntityId(PURGE_CHAT_ID);
        item.setRecipientScope("chat-members");
        item.setRecipientUserIds(List.of(PURGED_USER_ID, SURVIVOR_ID));
        item.setDeliveryStrategy("direct");
        item.setTitle("Purge notification");
        item.setBody("Must be removed when user is purged.");
        item.setStatus(NotificationOutboxItem.STATUS_PENDING);
        item.setCreatedDate(BASE_TIME.toString());
        item.setCreatedUser(PURGED_USER_ID);
        item.setUpdatedDate(BASE_TIME.toString());
        item.setUpdatedUser(PURGED_USER_ID);
        return item;
    }

    private void seedUsersLast() {
        List<Users> users = new ArrayList<>();
        for (int index = 1; index <= 50; index += 1) {
            Users user = user(emailUserId(index), "Email User " + String.format("%02d", index));
            if (index <= 30) {
                user.setCompletion(70);
                user.setPartitionKey("country:hu");
            } else if (index <= 40) {
                user.setCompletion(75);
                user.setPartitionKey("country:hu");
                user.setDevices(List.of(device(user.getId(), "token-" + index)));
            } else if (index <= 45) {
                user.setCompletion(75);
                user.setPartitionKey("country:hu");
                user.setStatus("I");
                user.setProfileStatus("inactive");
            } else {
                user.setCompletion(20);
                user.setPartitionKey("country:sk");
            }
            users.add(user);
        }
        Users survivor = user(SURVIVOR_ID, "Survivor User");
        survivor.setPartitionKey("country:sk");
        users.add(survivor);

        Users purged = user(PURGED_USER_ID, "Deleted Soon");
        purged.setStatus("D");
        purged.setProfileStatus("deleted");
        purged.setDeletedAtIso(Instant.now().minus(Duration.ofDays(40)).toString());
        purged.setImages(List.of("profile/purge-user.webp"));
        purged.setPartitionKey("country:hu");
        users.add(purged);
        mongoTemplate.insert(users, Users.class);
    }

    private Users user(String userId, String name) {
        Users user = new Users();
        user.setMongoId(userId);
        user.setSyncKey("e2e-email-user-" + userId + "-" + UUID.randomUUID());
        user.setId(userId);
        user.setEmail(userId + "@example.test");
        user.setName(name);
        user.setInitials("EU");
        user.setAge(29);
        user.setCity("Bratislava");
        user.setGender("woman");
        user.setStatus("A");
        user.setProfileStatus("public");
        user.setCompletion(100);
        user.setLocationCoordinates(new Users.LocationCoordinatesRecord(48.1486d, 17.1077d));
        user.setImages(List.of("https://example.test/avatar/" + userId + ".png"));
        user.setActivities(new Users.UserActivitiesRecord(
                0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
                new Users.UserEventCountersRecord(0, 0, 0, 0, 0, 0, 0),
                new Users.UserAssetCountersRecord(0, 0, 0, 0),
                new Users.UserEventFeedbackCountersRecord(0, 0, 0, 0),
                0, 0));
        return user;
    }

    private Users.UserDeviceRecord device(String userId, String token) {
        Users.UserDeviceRecord device = new Users.UserDeviceRecord();
        device.setDeviceId("device-" + userId);
        device.setPlatform("web");
        device.setFirebaseToken(token);
        device.setNotificationsEnabled(true);
        device.setLastRegisteredAtIso(Instant.now().minus(Duration.ofDays(1)).toString());
        device.setLastSeenAtIso(Instant.now().minus(Duration.ofDays(1)).toString());
        return device;
    }

    private List<EmailOutboxItem> promoEmails() {
        return findAll(
                Query.query(Criteria.where("ruleKey").is(RULE_KEY)),
                EmailOutboxItem.class);
    }

    private <T> T findOne(Query query, Class<T> type) {
        return fromReal(() -> mongoTemplate.findOne(query, type));
    }

    private <T> List<T> findAll(Query query, Class<T> type) {
        return fromReal(() -> mongoTemplate.find(query, type));
    }

    private List<String> qualifyingUserIds() {
        List<String> ids = new ArrayList<>();
        for (int index = 1; index <= 30; index += 1) {
            ids.add(emailUserId(index));
        }
        return ids;
    }

    private static String emailUserId(int index) {
        return "e2e-mail-u" + String.format("%02d", index);
    }

    private void withReal(Runnable action) {
        MongoSessionMode previousMode = MongoSessionModeContext.currentMode();
        try {
            MongoSessionModeContext.set(MongoSessionMode.REAL);
            action.run();
        } finally {
            MongoSessionModeContext.set(previousMode);
        }
    }

    private <T> T fromReal(Supplier<T> supplier) {
        MongoSessionMode previousMode = MongoSessionModeContext.currentMode();
        try {
            MongoSessionModeContext.set(MongoSessionMode.REAL);
            return supplier.get();
        } finally {
            MongoSessionModeContext.set(previousMode);
        }
    }

    private static void ensureEmbeddedMongo() {
        if (embeddedMongo != null) {
            return;
        }
        embeddedMongo = Mongod.instance().start(Version.Main.V6_0);
        ServerAddress serverAddress = embeddedMongo.current().getServerAddress();
        mongoBaseUri = "mongodb://" + serverAddress.getHost() + ":" + serverAddress.getPort();
        seedCountryPartition(REAL_DB);
        seedCountryPartition(DEMO_DB);
        seedFastPlatformConfig(REAL_DB);
        seedFastPlatformConfig(DEMO_DB);
    }

    private static void seedCountryPartition(String databaseName) {
        try (MongoClient client = MongoClients.create(mongoBaseUri)) {
            Document geometry = new Document("type", "MultiPolygon")
                    .append("coordinates", List.of(List.of(List.of(
                            List.of(16.0d, 45.0d),
                            List.of(23.0d, 45.0d),
                            List.of(23.0d, 49.0d),
                            List.of(16.0d, 49.0d),
                            List.of(16.0d, 45.0d)))));
            Document document = new Document("_id", "country-hu-e2e-email-account")
                    .append("partitionKey", "country:hu")
                    .append("countryCode", "HU")
                    .append("countryName", "Hungary")
                    .append("displayName", "Hungary")
                    .append("source", "e2e")
                    .append("specificity", 100)
                    .append("importedAtIso", BASE_TIME.toString())
                    .append("geometry", geometry);
            client.getDatabase(databaseName)
                    .getCollection("countryPartitions")
                    .replaceOne(
                            Filters.eq("partitionKey", "country:hu"),
                            document,
                            new ReplaceOptions().upsert(true));
        }
    }

    private static void seedFastPlatformConfig(String databaseName) {
        try (MongoClient client = MongoClients.create(mongoBaseUri)) {
            Document jobs = new Document("workerPollDelayMs", 60000)
                    .append("batchSize", 50)
                    .append("leaseDurationSeconds", 5)
                    .append("eventSchedulerPollDelayMs", 60000)
                    .append("autoInviterCadenceMs", 60000)
                    .append("notificationOutboxPollDelayMs", 60000)
                    .append("accountPurgeWindowDays", 30);
            Document notifications = new Document("firebaseWindowStartHour", 0)
                    .append("firebaseWindowEndHour", 24)
                    .append("maxWorkers", 1)
                    .append("maxRetries", 2)
                    .append("initialBackoffSeconds", 1)
                    .append("collapseWindowSeconds", 300)
                    .append("multicastThreshold", 3)
                    .append("topicThreshold", 250);
            Document document = new Document("_id", "affinity-config-e2e-email-account")
                    .append("key", "default")
                    .append("active", true)
                    .append("version", 100)
                    .append("jobs", jobs)
                    .append("notifications", notifications)
                    .append("changedDate", BASE_TIME.toString())
                    .append("changedUser", "e2e")
                    .append("changedSection", "email-account-e2e")
                    .append("changeSummary", "Email/account scheduler e2e platform parameters.");
            client.getDatabase(databaseName)
                    .getCollection("affinityConfigs")
                    .replaceOne(
                            Filters.eq("_id", "affinity-config-e2e-email-account"),
                            document,
                            new ReplaceOptions().upsert(true));
        }
    }

    @TestConfiguration(proxyBeanMethods = false)
    static class E2eInfrastructure {
        @Bean
        @Primary
        StringRedisTemplate stringRedisTemplate() {
            return mock(StringRedisTemplate.class, RETURNS_DEEP_STUBS);
        }
    }
}

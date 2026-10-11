package com.raxim.myscoutee.domain;

import static org.assertj.core.api.Assertions.assertThat;

import java.io.DataInputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.regex.Pattern;

import org.junit.jupiter.api.Tag;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.springframework.asm.ClassReader;
import org.springframework.asm.ClassVisitor;
import org.springframework.asm.MethodVisitor;
import org.springframework.asm.Opcodes;
import org.springframework.core.io.Resource;
import org.springframework.core.io.support.PathMatchingResourcePatternResolver;

import com.raxim.myscoutee.domain.notifications.service.NotificationOutboxService;

@Tag("standard")
class DomainServiceBoundaryTest {
    private static final String DOMAIN = "com/raxim/myscoutee/domain/";
    private static final Pattern REFERENCES = Pattern.compile(DOMAIN + "[\\w/$]+");
    private static final java.util.Map<String, Set<String>> COLLECTIONS = java.util.Map.ofEntries(
            java.util.Map.entry("platform", Set.of("appSettings", "deploymentConfigurations", "countryPartitions")),
            java.util.Map.entry("operator", Set.of("revenueReportOutbox", "globalIdentityLinkStates", "qualifiedMauReportOutbox", "globalIdentityPresenceChunkOutbox", "operatorRegistrySettings", "operatorRegistryEndpoints", "operatorClaimSubmissionSnapshots")),
            java.util.Map.entry("accounts", Set.of("userFriendships", "users", "userSessionActions", "privacyConsents", "userPageFilterPreferences", "accountPurgeJobs", "userLoginAudits", "navigatorContacts", "userExperienceProfiles", "userSessionStates", "userFilterPreferences")),
            java.util.Map.entry("notifications", Set.of("userNotifications", "notificationOutbox", "notificationTemplates", "notificationRuleConfigs")),
            java.util.Map.entry("localization", Set.of("i18n_messages", "i18n_bundles")),
            java.util.Map.entry("help", Set.of("helpCenterRevisions", "helpCenterAudit", "helpCenterGuideFields")),
            java.util.Map.entry("media", Set.of()),
            java.util.Map.entry("campaigns", Set.of("campaigns")),
            java.util.Map.entry("access", Set.of("accessGrants", "accessPolicyDefinitions")),
            java.util.Map.entry("administration", Set.of("adminMonitoring", "adminStats")),
            java.util.Map.entry("email", Set.of("emailTemplates", "emailCampaignRules", "emailOutbox", "scheduledMessageTasks", "scheduledMessageRuns", "scheduledMessageDeliveries", "operatorEmailConfigurations", "emailUnsubscriptions")),
            java.util.Map.entry("groups", Set.of("communityGroups")),
            java.util.Map.entry("community", Set.of("serviceCases", "serviceOfferings", "serviceFeedback", "serviceProviderCalendars", "communityAnnouncements", "communityScheduledTasks")),
            java.util.Map.entry("affinity", Set.of("userRates", "userAffinityEdges", "affinityConfigs", "affinityRecomputeTasks")),
            java.util.Map.entry("registry", Set.of()),
            java.util.Map.entry("events", Set.of("activityEventRuntimeItems", "activityMembers", "activityMingleRounds", "activityMingleSessions", "activityResources", "activitySubEventGroups", "activitySubEventStageRuntime", "eventFeedbackAnswers", "eventFeedbackStates", "eventLeaderboardEntries", "eventTicketAudit", "eventTickets", "eventWatchSubscriptions", "events", "schedulerPlanMarkers")),
            java.util.Map.entry("chat", Set.of("chats", "chatMessages", "contactChatAccess")),
            java.util.Map.entry("integrations", Set.of("integrationTokens", "integrationWebhookDeliveries", "mcpEventSubscriptions", "integrationExternalIds", "mcpAuthorizations", "integrationWebhookSubscriptions", "mcpOAuthClients", "integrationParticipantInvites")),
            java.util.Map.entry("payments", Set.of("payments", "affiliateRegistrations", "affiliateLinks", "affiliatePartners", "affiliatePaymentContributions", "payment_gateway_operations", "savedPaymentMethods", "paymentMethodRegistrations", "eventCheckoutBasketItems", "paymentProviders", "exchangeRates")),
            java.util.Map.entry("assets", Set.of("assets", "assetRequests")),
            java.util.Map.entry("content", Set.of("userReports", "userFeedback", "photoFeedPosts", "photoFeedViews", "ideaPosts", "shareTokens", "contentModerationItems", "contentModerationState")));

    @ParameterizedTest
    @ValueSource(strings = {"notifications", "localization", "help", "media", "campaigns", "access", "administration", "email", "groups", "community", "affinity", "content", "assets", "registry", "payments", "integrations", "chat", "events", "accounts", "operator", "platform"})
    void domainConsumersUseContractsAndNeverForeignPersistence(String domain) throws Exception {
        String owned = DOMAIN + domain + "/";
        int consumers = 0;
        for (Resource resource : productionDomainClasses()) {
            String name = className(resource);
            if (name.startsWith(owned)) continue;
            for (String constant : utf8Constants(resource)) {
                var references = REFERENCES.matcher(constant);
                while (references.find()) {
                    String dependency = references.group();
                    if (!dependency.startsWith(owned)) continue;
                    assertThat(dependency).as("%s -> %s", name, dependency)
                            .matches(Pattern.quote(owned) + "(api|dto)/.*");
                    consumers++;
                }
            }
            new ClassReader(resource.getInputStream()).accept(new ClassVisitor(Opcodes.ASM9) {
                @Override
                public MethodVisitor visitMethod(int access, String method, String descriptor, String signature, String[] exceptions) {
                    return new MethodVisitor(Opcodes.ASM9) {
                        @Override public void visitLdcInsn(Object value) {
                            // These reviewed uses are telemetry/UI categories or GitHub release JSON keys.
                            // Other methods, owner classes and actual collection names remain checked.
                            if ("users".equals(value) && semanticUserLabel(name, method)) return;
                            if ("assets".equals(value) && semanticAssetLabel(name, method)) return;
                            if ("events".equals(value) && semanticEventLabel(name, method)) return;
                            if ("chats".equals(value) && name.equals(DOMAIN + "administration/service/AdminMonitoringService") && method.equals("categoryFor")) return;
                            if ("chatMessages".equals(value) && name.equals(DOMAIN + "integrations/service/IntegrationCapabilitiesService") && method.equals("describe")) return;
                            // The common change-stream owner accepts collection names solely
                            // to invalidate existing projections/schedules. These reviewed
                            // subscriptions are not foreign document queries or mutations.
                            if (changeStreamSubscription(name, method, value)) return;
                            assertThat(COLLECTIONS.get(domain).contains(value)).as("Raw foreign collection in %s.%s: %s", name, method, value)
                                    .isFalse();
                        }
                    };
                }
            }, ClassReader.SKIP_DEBUG | ClassReader.SKIP_FRAMES);
        }
        assertThat(consumers).as("Scanned compiled %s consumers", domain).isPositive();
    }

    @ParameterizedTest
    @ValueSource(strings = {"notifications", "localization", "help", "media", "campaigns", "access", "administration", "email", "groups", "community", "affinity", "content", "assets", "registry", "payments", "integrations", "chat", "events", "accounts", "operator", "platform"})
    void domainsUseOnlyForeignContracts(String domain) throws Exception {
        String owned = DOMAIN + domain + "/";
        int checked = 0;
        for (Resource resource : productionDomainClasses()) {
            String name = className(resource);
            if (!name.startsWith(owned)) continue;
            for (String constant : utf8Constants(resource)) {
                var references = REFERENCES.matcher(constant);
                while (references.find()) {
                    String dependency = references.group();
                    if (dependency.startsWith(owned)) continue;
                    assertThat(dependency)
                            .as("Foreign implementation dependency: %s -> %s", name, dependency)
                            .matches(Pattern.quote(DOMAIN) + "[a-z]+/(api|dto)/.*");
                }
            }
            checked++;
        }
        assertThat(checked).as("Scanned production classes in %s", domain).isGreaterThan(5);
    }

    @org.junit.jupiter.api.Test
    void deploymentPlatformDoesNotRequireProductNetworkContracts() throws Exception {
        for (Resource resource : productionDomainClasses()) {
            String name = className(resource);
            if (!name.startsWith(DOMAIN + "platform/")) continue;
            for (String constant : utf8Constants(resource)) {
                assertThat(constant).as("Deployment platform dependency in %s", name)
                        .doesNotContain(DOMAIN + "operator/", DOMAIN + "registry/");
            }
        }
    }

    @org.junit.jupiter.api.Test
    void schedulingValueReaderDoesNotRequireAffinityTypes() throws Exception {
        var resource = new org.springframework.core.io.ClassPathResource(
                "com/raxim/myscoutee/common/config/PlatformParametersService.class");
        for (String constant : utf8Constants(resource)) {
            assertThat(constant).doesNotContain(DOMAIN + "affinity/");
        }
    }

    private boolean changeStreamSubscription(String name, String method, Object value) {
        if (name.equals(DOMAIN + "administration/service/AdminStatsTelemetryWorkerService")
                && method.equals("watchInputs")) {
            return Set.of("users", "userAffinityEdges", "userRates", "activityMembers",
                    "affinityRecomputeTasks", "notificationOutbox", "notificationRuleConfigs").contains(value);
        }
        return "notificationRuleConfigs".equals(value)
                && ((name.equals(DOMAIN + "email/service/PromotionalEmailDeliveryProcessor")
                        && method.equals("watchDeliveries"))
                    || (name.equals(DOMAIN + "email/service/ScheduledMessageTaskService")
                        && method.equals("watchScheduledTasks")));
    }

    private boolean semanticUserLabel(String name, String method) {
        return switch (name.substring(DOMAIN.length())) {
            case "administration/service/AdminMonitoringService" -> Set.of("<clinit>", "usersCategory", "categoryFor").contains(method);
            case "administration/service/AdminStatsService" -> method.equals("graphDto");
            case "affinity/service/AdminGraphScienceService" -> method.equals("calculate");
            case "notifications/service/NotificationOutboxService" -> Set.of("enqueueInGroup", "newItem").contains(method);
            case "notifications/service/NotificationOutboxWorkerService" -> method.equals("removeInvalidTokens");
            default -> false;
        };
    }

    private boolean semanticEventLabel(String name, String method) {
        var methods = switch (name.substring(DOMAIN.length())) {
            case "administration/service/AdminMonitoringService" -> Set.of("<clinit>", "eventsCategory", "membersCategory", "categoryFor", "nodeFor");
            case "administration/service/AdminStatsService" -> Set.of("applyTelemetryEvents", "applyDailyActivity", "timelineItems");
            case "affinity/service/AdminParamsService" -> Set.of("<clinit>", "fieldsFor", "applySection", "copySection");
            case "assets/service/AssetsService" -> Set.of("toAssetTicketDto");
            case "integrations/service/McpEventsService" -> Set.of("catalog");
            case "integrations/controller/IntegrationReadController" -> Set.of("listEvents");
            case "chat/service/ChatService" -> Set.of("chatNavigationContext");
            default -> Set.<String>of();
        };
        return methods.contains(method) || methods.stream().anyMatch(owner -> method.startsWith("lambda$" + owner + "$"));
    }

    private boolean semanticAssetLabel(String name, String method) {
        var methods = switch (name.substring(DOMAIN.length())) {
            case "administration/service/AdminMonitoringService" -> Set.of("<clinit>", "assetsCategory", "categoryFor", "nodeFor");
            case "administration/service/AdminStatsService" -> Set.of("applyTelemetryEvents", "applyDailyActivity", "timelineItems");
            case "affinity/service/AdminParamsService" -> Set.of("<clinit>", "fieldsFor", "applySection", "copySection");
            case "platform/service/OperatorUpdateReleaseService" -> Set.of("releases");
            default -> Set.<String>of();
        };
        return methods.contains(method) || methods.stream().anyMatch(owner -> method.startsWith("lambda$" + owner + "$"));
    }

    private Resource[] productionDomainClasses() throws Exception {
        // Anchor to production output, excluding test fixtures that deliberately construct repository mocks.
        String root = NotificationOutboxService.class.getProtectionDomain().getCodeSource().getLocation().toExternalForm();
        return new PathMatchingResourcePatternResolver().getResources(root + DOMAIN + "**/*.class");
    }

    private String className(Resource resource) throws Exception {
        String url = resource.getURL().toString();
        return url.substring(url.indexOf(DOMAIN), url.length() - ".class".length());
    }

    private List<String> utf8Constants(Resource resource) throws Exception {
        List<String> values = new ArrayList<>();
        try (var input = new DataInputStream(resource.getInputStream())) {
            assertThat(input.readInt()).isEqualTo(0xCAFEBABE);
            input.skipNBytes(4);
            int size = input.readUnsignedShort();
            for (int i = 1; i < size; i++) {
                switch (input.readUnsignedByte()) {
                    case 1 -> values.add(input.readUTF());
                    case 3, 4, 9, 10, 11, 12, 17, 18 -> input.skipNBytes(4);
                    case 5, 6 -> { input.skipNBytes(8); i++; }
                    case 7, 8, 16, 19, 20 -> input.skipNBytes(2);
                    case 15 -> input.skipNBytes(3);
                    default -> throw new IllegalStateException("Unrecognized JVM constant-pool entry in " + resource);
                }
            }
        }
        return values;
    }
}

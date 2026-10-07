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
    private static final java.util.Map<String, Set<String>> COLLECTIONS = java.util.Map.of(
            "notifications", Set.of("userNotifications", "notificationOutbox", "notificationTemplates", "notificationRuleConfigs"),
            "localization", Set.of("i18n_messages", "i18n_bundles"),
            "help", Set.of("helpCenterRevisions", "helpCenterAudit", "helpCenterGuideFields"),
            "media", Set.of(),
            "campaigns", Set.of("campaigns"),
            "access", Set.of("accessGrants", "accessPolicyDefinitions"));

    @ParameterizedTest
    @ValueSource(strings = {"notifications", "localization", "help", "media", "campaigns", "access"})
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
    @ValueSource(strings = {"notifications", "localization", "help", "media", "campaigns", "access"})
    void completedDomainsUseForeignContractsWithExplicitRuntimeDependencies(String domain) throws Exception {
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
                    boolean runtime = dependency.equals(DOMAIN + "platform/service/JobGroupContext")
                            || dependency.equals(DOMAIN + "platform/config/ConfigProperties")
                            || (name.equals(DOMAIN + "notifications/service/DefaultFirebaseMessagingGateway")
                                && dependency.equals(DOMAIN + "platform/service/DeploymentFirebaseRuntime"));
                    assertThat(runtime || dependency.contains("/api/") || dependency.contains("/dto/"))
                            .as("Foreign implementation dependency: %s -> %s", name, dependency).isTrue();
                }
            }
            checked++;
        }
        assertThat(checked).as("Scanned production classes in %s", domain).isGreaterThan(5);
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

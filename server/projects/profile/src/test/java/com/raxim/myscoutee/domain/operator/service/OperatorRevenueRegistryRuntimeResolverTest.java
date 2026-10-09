package com.raxim.myscoutee.domain.operator.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.nio.file.Path;
import java.util.Optional;

import org.junit.jupiter.api.Test;

import com.raxim.myscoutee.common.config.mongo.MongoSessionMode;
import com.raxim.myscoutee.domain.registry.api.RegistryDemoConfiguration;
import com.raxim.myscoutee.domain.registry.api.RegistryConfiguration;
import com.raxim.myscoutee.domain.operator.document.OperatorRegistrySettings;
import com.raxim.myscoutee.domain.operator.repository.OperatorRegistrySettingsRepository;
import com.raxim.myscoutee.domain.registry.api.RegistryProtocol;

import tools.jackson.databind.ObjectMapper;

@org.junit.jupiter.api.Tag("standard")
class OperatorRevenueRegistryRuntimeResolverTest {
    @Test
    void operatorGatesRunBeforeAnyRegistryKeyStateOrTransportAccess() {
        var repository = mock(OperatorRegistrySettingsRepository.class);
        var operations = mock(com.raxim.myscoutee.domain.registry.api.RegistryOperations.class);
        var real = realProperties();
        var resolver = new OperatorRevenueRegistryRuntimeResolver(repository, real, demoProperties(), operations);
        when(repository.findById(OperatorRegistrySettings.SINGLETON_ID)).thenReturn(Optional.empty());
        assertThat(resolver.resolveReal().code()).isEqualTo("REGISTRY_NOT_CONFIGURED");
        var settings = registeredSettings("https://registry.example.test", "real:registry");
        when(repository.findById(OperatorRegistrySettings.SINGLETON_ID)).thenReturn(Optional.of(settings));
        settings.setEnabled(false);
        assertThat(resolver.resolveReal().code()).isEqualTo("REGISTRY_DISABLED");
        settings.setEnabled(true); settings.setLifecycle("DRAFT");
        assertThat(resolver.resolveReal().code()).isEqualTo("DEPLOYMENT_NOT_REGISTERED");
        settings.setLifecycle("REGISTERED"); real.setOutboundAllowed(false);
        assertThat(resolver.resolveReal().code()).isEqualTo("REGISTRY_OUTBOUND_DISABLED");
        org.mockito.Mockito.verifyNoInteractions(operations);
    }

    @Test
    void demoRuntimeUsesOnlyPinnedEndpointScopeAndSeparateFiles() {
        RegistryConfiguration real = realProperties();
        RegistryDemoConfiguration demo = demoProperties();
        OperatorRevenueRegistryRuntimeResolver resolver = resolver(
                mock(OperatorRegistrySettingsRepository.class),
                real,
                demo);
        OperatorRegistrySettings.RegistrySelection selection =
                selection("http://registry:8080/", "demo:myscoutee");

        RegistryConfiguration runtime = resolver.runtimeProperties(
                selection,
                MongoSessionMode.DEMO);

        assertThat(runtime.getBaseUrl())
                .isEqualTo("http://registry:8080");
        assertThat(runtime.getRegistryScope())
                .isEqualTo("demo:myscoutee");
        assertThat(runtime.getPrivateKeyPath())
                .isEqualTo(Path.of("/demo/keys/private.pem"));
        assertThat(runtime.getPublicKeyPath())
                .isEqualTo(Path.of("/demo/keys/public.der"));
        assertThat(runtime.getStateDir())
                .isEqualTo(Path.of("/demo/state"));
        assertThat(runtime.isAllowInsecureHttp()).isTrue();
        assertThat(runtime.getInsecureHttpAllowedHosts())
                .isEqualTo("registry");
        assertThat(runtime.getPrivateKeyPath())
                .isNotEqualTo(real.getPrivateKeyPath());
        assertThat(runtime.getStateDir())
                .isNotEqualTo(real.getStateDir());
    }

    @Test
    void demoSelectionMismatchBlocksBeforeReadingKeysOrSendingHttp() {
        OperatorRegistrySettingsRepository repository =
                mock(OperatorRegistrySettingsRepository.class);
        when(repository.findById(OperatorRegistrySettings.SINGLETON_ID))
                .thenReturn(Optional.of(registeredSettings(
                        "https://registry.example.test",
                        "real:registry")));
        OperatorRevenueRegistryRuntimeResolver resolver = resolver(
                repository,
                realProperties(),
                demoProperties());

        var result = resolver.resolveMau(MongoSessionMode.DEMO);

        assertThat(result.state()).isEqualTo("BLOCKED");
        assertThat(result.code()).isEqualTo(
                "REGISTRY_EVIDENCE_INVALID");
        assertThat(result.message())
                .contains("does not match its isolated demo registry");
        assertThat(result.runtime()).isNull();
    }

    @Test
    void realRuntimeNeverEnablesPlainHttpFromDemoPolicy() {
        OperatorRevenueRegistryRuntimeResolver resolver = resolver(
                mock(OperatorRegistrySettingsRepository.class),
                realProperties(),
                demoProperties());

        RegistryConfiguration runtime = resolver.runtimeProperties(
                selection(
                        "https://registry.example.test",
                        "real:registry"),
                MongoSessionMode.REAL);

        assertThat(runtime.getBaseUrl())
                .isEqualTo("https://registry.example.test");
        assertThat(runtime.getRegistryScope()).isEqualTo("real:registry");
        assertThat(runtime.isAllowInsecureHttp()).isFalse();
        assertThat(runtime.getInsecureHttpAllowedHosts()).isEmpty();
        assertThat(runtime.getPrivateKeyPath())
                .isEqualTo(Path.of("/real/keys/private.pem"));
        assertThatThrownBy(() -> resolver.runtimeProperties(
                        selection(
                                "http://registry.example.test",
                                "real:registry"),
                        MongoSessionMode.DEMO))
                .isInstanceOf(IllegalStateException.class);
    }

    private static OperatorRevenueRegistryRuntimeResolver resolver(
            OperatorRegistrySettingsRepository repository,
            RegistryConfiguration real,
            RegistryDemoConfiguration demo) {
        return new OperatorRevenueRegistryRuntimeResolver(
                repository,
                real,
                demo,
                new com.raxim.myscoutee.domain.registry.RegistryOperatorOperations(new ObjectMapper()));
    }

    private static RegistryConfiguration realProperties() {
        RegistryConfiguration properties = new RegistryConfiguration();
        properties.setOutboundAllowed(true);
        properties.setPrivateKeyPath(
                Path.of("/real/keys/private.pem"));
        properties.setPublicKeyPath(
                Path.of("/real/keys/public.der"));
        properties.setStateDir(Path.of("/real/state"));
        return properties;
    }

    private static RegistryDemoConfiguration demoProperties() {
        RegistryDemoConfiguration properties = new RegistryDemoConfiguration();
        properties.setBaseUrl("http://registry:8080");
        properties.setRegistryScope("demo:myscoutee");
        properties.setPrivateKeyPath(
                Path.of("/demo/keys/private.pem"));
        properties.setPublicKeyPath(
                Path.of("/demo/keys/public.der"));
        properties.setStateDir(Path.of("/demo/state"));
        properties.setAllowInsecureHttp(true);
        properties.setInsecureHttpAllowedHosts("registry");
        return properties;
    }

    private static OperatorRegistrySettings registeredSettings(
            String baseUrl,
            String scope) {
        OperatorRegistrySettings settings =
                new OperatorRegistrySettings();
        settings.setLifecycle("REGISTERED");
        settings.setEnabled(true);
        settings.setSelection(selection(baseUrl, scope));
        OperatorRegistrySettings.NodeIdentity identity =
                new OperatorRegistrySettings.NodeIdentity();
        identity.setState("READY");
        identity.setPublicKeyFingerprint(
                "sha256:" + "b".repeat(64));
        settings.setNodeIdentity(identity);
        OperatorRegistrySettings.EnrollmentSummary enrollment =
                new OperatorRegistrySettings.EnrollmentSummary();
        enrollment.setDeploymentCode(
                "dep_" + "c".repeat(32));
        settings.setEnrollment(enrollment);
        return settings;
    }

    private static OperatorRegistrySettings.RegistrySelection selection(
            String baseUrl,
            String scope) {
        OperatorRegistrySettings.RegistrySelection selection =
                new OperatorRegistrySettings.RegistrySelection();
        selection.setBaseUrl(baseUrl);
        selection.setRegistryScope(scope);
        selection.setProtocolVersion(
                RegistryProtocol.PROTOCOL_VERSION);
        selection.setRegistryKeyId(
                "rkey_" + "a".repeat(32));
        selection.setRegistryPublicKeyFingerprint(
                "sha256:" + "a".repeat(64));
        return selection;
    }
}

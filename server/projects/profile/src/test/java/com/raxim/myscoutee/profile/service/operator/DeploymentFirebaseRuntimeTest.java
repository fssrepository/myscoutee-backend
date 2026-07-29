package com.raxim.myscoutee.profile.service.operator;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;

import com.raxim.myscoutee.common.config.mongo.MongoSessionMode;
import com.raxim.myscoutee.common.config.mongo.MongoSessionModeContext;
import com.raxim.myscoutee.common.config.properties.ConfigProperties;
import com.raxim.myscoutee.profile.data.document.DeploymentConfiguration;
import com.raxim.myscoutee.profile.repository.DeploymentConfigurationRepository;

class DeploymentFirebaseRuntimeTest {
    @AfterEach
    void clearMode() {
        MongoSessionModeContext.clear();
    }

    @Test
    void publishesOnlyTheExplicitlyActivatedRealDeploymentCapability() {
        DeploymentConfiguration configuration =
                new DeploymentConfiguration();
        configuration.setId(DeploymentConfiguration.SINGLETON_ID);
        DeploymentConfiguration.Firebase firebase =
                new DeploymentConfiguration.Firebase();
        firebase.setActive(true);
        configuration.setFirebase(firebase);
        DeploymentConfigurationRepository repository =
                mock(DeploymentConfigurationRepository.class);
        when(repository.findById(DeploymentConfiguration.SINGLETON_ID))
                .thenReturn(Optional.of(configuration));
        ConfigProperties properties = new ConfigProperties();
        DeploymentFirebaseRuntime runtime = new DeploymentFirebaseRuntime(
                repository,
                mock(DeploymentConfigurationCrypto.class),
                properties);

        runtime.initializeAvailability();

        assertThat(properties.isStartupFirebaseEnabled()).isFalse();
        assertThat(properties.isFirebaseEnabled()).isTrue();
    }

    @Test
    void demoModeNeverResolvesARealAuthenticationCredential() {
        DeploymentConfigurationRepository repository =
                mock(DeploymentConfigurationRepository.class);
        ConfigProperties properties = new ConfigProperties();
        properties.setFirebaseEnabled(true);
        DeploymentFirebaseRuntime runtime = new DeploymentFirebaseRuntime(
                repository,
                mock(DeploymentConfigurationCrypto.class),
                properties);
        MongoSessionModeContext.set(MongoSessionMode.DEMO);

        assertThatThrownBy(runtime::authentication)
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("Explore/demo");
        verifyNoInteractions(repository);
    }

    @Test
    void activatedDeploymentCredentialOverridesTheLegacyStartupApp() {
        DeploymentConfiguration.EncryptedSecret envelope =
                new DeploymentConfiguration.EncryptedSecret();
        envelope.setAlgorithm("AES-256-GCM");
        envelope.setKeyId("test-key");
        envelope.setNonce("test-nonce");
        envelope.setCiphertext("test-ciphertext");
        DeploymentConfiguration.Firebase firebase =
                new DeploymentConfiguration.Firebase();
        firebase.setProjectId("activated-project");
        firebase.setRevision(7L);
        firebase.setActive(true);
        firebase.setAuthenticationCredentialEnvelope(envelope);
        DeploymentConfiguration configuration =
                new DeploymentConfiguration();
        configuration.setId(DeploymentConfiguration.SINGLETON_ID);
        configuration.setFirebase(firebase);
        DeploymentConfigurationRepository repository =
                mock(DeploymentConfigurationRepository.class);
        when(repository.findById(DeploymentConfiguration.SINGLETON_ID))
                .thenReturn(Optional.of(configuration));
        DeploymentConfigurationCrypto crypto =
                mock(DeploymentConfigurationCrypto.class);
        when(crypto.decrypt(
                OperatorConfigurationService
                        .FIREBASE_AUTHENTICATION_PURPOSE,
                envelope))
                .thenReturn("{}");
        ConfigProperties properties = new ConfigProperties();
        properties.setFirebaseEnabled(true);
        DeploymentFirebaseRuntime runtime = new DeploymentFirebaseRuntime(
                repository,
                crypto,
                properties);

        assertThatThrownBy(runtime::authentication)
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("Activated Firebase credential");
        verify(crypto).decrypt(
                OperatorConfigurationService
                        .FIREBASE_AUTHENTICATION_PURPOSE,
                envelope);
    }
}

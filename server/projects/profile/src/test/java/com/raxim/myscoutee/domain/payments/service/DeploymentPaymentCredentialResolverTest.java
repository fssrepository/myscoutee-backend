package com.raxim.myscoutee.domain.payments.service;

import com.raxim.myscoutee.domain.platform.service.DeploymentConfigurationCrypto;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;

import com.raxim.myscoutee.common.config.properties.OperatorConfigurationProperties;
import com.raxim.myscoutee.domain.platform.document.DeploymentConfiguration;
import com.raxim.myscoutee.domain.platform.repository.DeploymentConfigurationRepository;

@org.junit.jupiter.api.Tag("standard")
class DeploymentPaymentCredentialResolverTest {
    @TempDir
    Path tempDir;

    @Test
    void selectedProviderUsesEncryptedOperatorCredentialAndOthersUseDocumentedEnvFallback()
            throws Exception {
        Path keyPath = tempDir.resolve("deployment-master-key");
        Files.writeString(
                keyPath,
                "000102030405060708090a0b0c0d0e0f"
                        + "101112131415161718191a1b1c1d1e1f\n");
        OperatorConfigurationProperties properties = new OperatorConfigurationProperties();
        properties.setMasterKeyPath(keyPath);
        DeploymentConfigurationCrypto crypto =
                new DeploymentConfigurationCrypto(properties);
        DeploymentConfiguration configuration = new DeploymentConfiguration();
        configuration.setId(DeploymentConfiguration.SINGLETON_ID);
        configuration.setPayment(new DeploymentConfiguration.Payment());
        configuration.getPayment().setProviderId("stripe");
        configuration.getPayment().setCredentialEnvelope(crypto.encrypt(
                DeploymentPaymentCredentialResolver.credentialPurpose("stripe"),
                "operator-stripe-token"));
        DeploymentConfigurationRepository repository =
                mock(DeploymentConfigurationRepository.class);
        when(repository.findById(DeploymentConfiguration.SINGLETON_ID))
                .thenReturn(Optional.of(configuration));
        DeploymentPaymentCredentialResolver resolver =
                new DeploymentPaymentCredentialResolver(repository, crypto);

        assertThat(resolver.resolve("stripe", "environment-stripe-token"))
                .isEqualTo("operator-stripe-token");
        assertThat(resolver.resolve("barion", "environment-barion-token"))
                .isEqualTo("environment-barion-token");

        configuration.getPayment().setProviderId("barion");
        assertThatThrownBy(() -> resolver.resolve(
                "barion",
                "environment-barion-token"))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("could not be decrypted");
    }
}

package com.raxim.myscoutee.profile.service.operator;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.nio.file.Files;
import java.nio.file.Path;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;

import com.raxim.myscoutee.common.config.properties.OperatorConfigurationProperties;

class DeploymentConfigurationCryptoTest {
    @TempDir
    Path tempDir;

    @Test
    void roundTripsAnAuthenticatedEnvelopeWithoutPersistingPlaintext() throws Exception {
        Path keyPath = tempDir.resolve("deployment-master-key");
        Files.writeString(
                keyPath,
                "000102030405060708090a0b0c0d0e0f"
                        + "101112131415161718191a1b1c1d1e1f\n");
        OperatorConfigurationProperties properties = new OperatorConfigurationProperties();
        properties.setMasterKeyPath(keyPath);
        DeploymentConfigurationCrypto crypto =
                new DeploymentConfigurationCrypto(properties);

        var envelope = crypto.encrypt("payment-credential", "sk_live_secret_1234");

        assertThat(envelope.getAlgorithm()).isEqualTo("AES-256-GCM");
        assertThat(envelope.getKeyId()).startsWith("sha256:");
        assertThat(envelope.getNonce()).isNotBlank();
        assertThat(envelope.getCiphertext())
                .isNotBlank()
                .doesNotContain("sk_live_secret_1234");
        assertThat(crypto.decrypt("payment-credential", envelope))
                .isEqualTo("sk_live_secret_1234");
        assertThatThrownBy(() -> crypto.decrypt("firebase-credential", envelope))
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("could not be decrypted");
    }

    @Test
    void reportsTheExactDedicatedKeyGapWithoutFallingBackToRegistryKeys() {
        Path keyPath = tempDir.resolve("missing-deployment-master-key");
        OperatorConfigurationProperties properties = new OperatorConfigurationProperties();
        properties.setMasterKeyPath(keyPath);
        DeploymentConfigurationCrypto crypto =
                new DeploymentConfigurationCrypto(properties);

        assertThat(crypto.unavailableReason())
                .contains("Operator configuration master key is not readable")
                .contains(keyPath.toString());
    }
}

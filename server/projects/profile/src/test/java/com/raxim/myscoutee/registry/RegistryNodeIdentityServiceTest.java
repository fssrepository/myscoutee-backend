package com.raxim.myscoutee.registry;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.attribute.PosixFilePermissions;
import java.security.KeyPair;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.concurrent.Callable;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;

import com.raxim.myscoutee.common.config.properties.RegistryProperties;

class RegistryNodeIdentityServiceTest {
    @TempDir
    Path temporaryDirectory;

    @Test
    void constructionIsDormantAndOnlyExplicitInitializationCreatesTheIdentity() throws Exception {
        RegistryProperties properties = properties("explicit");
        RegistryNodeIdentityService service = new RegistryNodeIdentityService(properties);

        assertThat(Files.exists(properties.getPrivateKeyPath())).isFalse();
        assertThat(Files.exists(properties.getPublicKeyPath())).isFalse();
        assertThat(Files.exists(properties.getStateDir())).isFalse();

        RegistryNodeIdentityService.NodeIdentity initialized = service.initializeNodeIdentity();

        assertThat(Files.isRegularFile(properties.getPrivateKeyPath())).isTrue();
        assertThat(Files.isRegularFile(properties.getPublicKeyPath())).isTrue();
        assertThat(Files.exists(properties.getStateDir())).isFalse();
        assertThat(initialized.publicKeyFingerprint())
                .isEqualTo(RegistryCrypto.load(properties).deploymentPublicKeyFingerprint());
        assertThat(Files.getPosixFilePermissions(properties.getPrivateKeyPath()))
                .isEqualTo(PosixFilePermissions.fromString("rw-------"));
        assertThat(Files.getPosixFilePermissions(properties.getPublicKeyPath()))
                .isEqualTo(PosixFilePermissions.fromString("rw-r--r--"));
    }

    @Test
    void concurrentAndRepeatedInitializationKeepsOneUnchangedKeyPair() throws Exception {
        RegistryProperties properties = properties("concurrent");
        RegistryNodeIdentityService firstService = new RegistryNodeIdentityService(properties);
        RegistryNodeIdentityService secondService = new RegistryNodeIdentityService(properties);
        List<Callable<RegistryNodeIdentityService.NodeIdentity>> calls = new ArrayList<>();
        for (int index = 0; index < 24; index++) {
            RegistryNodeIdentityService selected = index % 2 == 0 ? firstService : secondService;
            calls.add(selected::initializeNodeIdentity);
        }

        List<Future<RegistryNodeIdentityService.NodeIdentity>> futures;
        try (ExecutorService executor = Executors.newFixedThreadPool(8)) {
            futures = executor.invokeAll(calls);
        }
        Set<String> fingerprints = new java.util.HashSet<>();
        for (Future<RegistryNodeIdentityService.NodeIdentity> future : futures) {
            fingerprints.add(future.get().publicKeyFingerprint());
        }
        byte[] privateKeyBefore = Files.readAllBytes(properties.getPrivateKeyPath());
        byte[] publicKeyBefore = Files.readAllBytes(properties.getPublicKeyPath());

        RegistryNodeIdentityService.NodeIdentity repeated = firstService.initializeNodeIdentity();

        assertThat(fingerprints).containsExactly(repeated.publicKeyFingerprint());
        assertThat(Files.readAllBytes(properties.getPrivateKeyPath())).isEqualTo(privateKeyBefore);
        assertThat(Files.readAllBytes(properties.getPublicKeyPath())).isEqualTo(publicKeyBefore);
        assertThat(RegistryCrypto.load(properties).deploymentPublicKeyFingerprint())
                .isEqualTo(repeated.publicKeyFingerprint());
    }

    @Test
    void refusesOrphansSymlinksAndMismatchedExistingPairs() throws Exception {
        RegistryProperties orphanProperties = properties("orphan");
        prepareKeyDirectory(orphanProperties);
        Files.writeString(orphanProperties.getPrivateKeyPath(), "do-not-overwrite");
        assertThatThrownBy(() -> new RegistryNodeIdentityService(orphanProperties).initializeNodeIdentity())
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("orphaned");
        assertThat(Files.readString(orphanProperties.getPrivateKeyPath())).isEqualTo("do-not-overwrite");
        assertThat(Files.exists(orphanProperties.getPublicKeyPath())).isFalse();

        RegistryProperties symlinkProperties = properties("symlink");
        prepareKeyDirectory(symlinkProperties);
        Path symlinkTarget = temporaryDirectory.resolve("public-target.der");
        Files.writeString(symlinkTarget, "not-a-key");
        Files.createSymbolicLink(symlinkProperties.getPublicKeyPath(), symlinkTarget);
        assertThatThrownBy(() -> new RegistryNodeIdentityService(symlinkProperties).initializeNodeIdentity())
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("non-symlink");

        RegistryProperties mismatchProperties = properties("mismatch");
        prepareKeyDirectory(mismatchProperties);
        KeyPair firstPair = RegistryTestIdentity.generate();
        RegistryTestIdentity.writeDeploymentIdentity(
                mismatchProperties.getPrivateKeyPath().getParent(),
                firstPair);
        KeyPair secondPair = RegistryTestIdentity.generate();
        Files.write(
                mismatchProperties.getPublicKeyPath(),
                secondPair.getPublic().getEncoded());
        assertThatThrownBy(() -> new RegistryNodeIdentityService(mismatchProperties).initializeNodeIdentity())
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("do not match");
    }

    @Test
    void recoversOnlyThePublicFirstPowerLossStateBeforeAnyRegistryStateExists() throws Exception {
        RegistryProperties properties = properties("power-loss");
        RegistryNodeIdentityService service = new RegistryNodeIdentityService(properties);
        RegistryNodeIdentityService.NodeIdentity interrupted = service.initializeNodeIdentity();
        byte[] interruptedPublicKey = Files.readAllBytes(properties.getPublicKeyPath());
        Files.delete(properties.getPrivateKeyPath());

        RegistryNodeIdentityService.NodeIdentity recovered = service.initializeNodeIdentity();

        assertThat(Files.isRegularFile(properties.getPrivateKeyPath())).isTrue();
        assertThat(Files.isRegularFile(properties.getPublicKeyPath())).isTrue();
        assertThat(recovered.publicKeyFingerprint()).isNotEqualTo(interrupted.publicKeyFingerprint());
        assertThat(Files.readAllBytes(properties.getPublicKeyPath())).isNotEqualTo(interruptedPublicKey);
        assertThat(RegistryCrypto.load(properties).deploymentPublicKeyFingerprint())
                .isEqualTo(recovered.publicKeyFingerprint());
    }

    @Test
    void refusesAnyReplacementWhenPreservedRegistryStateExists() throws Exception {
        RegistryProperties missingPair = properties("lost-pair");
        Files.createDirectories(missingPair.getStateDir());
        Files.writeString(missingPair.statePath(), "{\"preserved\":true}");

        assertThatThrownBy(() -> new RegistryNodeIdentityService(missingPair).initializeNodeIdentity())
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("restore the matching keys");
        assertThat(Files.exists(missingPair.getPrivateKeyPath())).isFalse();
        assertThat(Files.exists(missingPair.getPublicKeyPath())).isFalse();

        RegistryProperties publicOnly = properties("public-only-with-state");
        RegistryNodeIdentityService initialized = new RegistryNodeIdentityService(publicOnly);
        initialized.initializeNodeIdentity();
        Files.delete(publicOnly.getPrivateKeyPath());
        Files.createDirectories(publicOnly.getStateDir());
        Files.writeString(publicOnly.statePath(), "{\"preserved\":true}");
        byte[] preservedPublicKey = Files.readAllBytes(publicOnly.getPublicKeyPath());

        assertThatThrownBy(initialized::initializeNodeIdentity)
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("orphaned");
        assertThat(Files.readAllBytes(publicOnly.getPublicKeyPath())).isEqualTo(preservedPublicKey);
        assertThat(Files.exists(publicOnly.getPrivateKeyPath())).isFalse();
    }

    @Test
    void rejectsAKeyDirectoryThatIsAccessibleByOtherUsers() throws Exception {
        RegistryProperties properties = properties("unsafe-directory");
        Files.createDirectories(properties.getPrivateKeyPath().getParent());
        Files.setPosixFilePermissions(
                properties.getPrivateKeyPath().getParent(),
                PosixFilePermissions.fromString("rwxr-xr-x"));

        assertThatThrownBy(() -> new RegistryNodeIdentityService(properties).initializeNodeIdentity())
                .isInstanceOf(IllegalStateException.class)
                .hasMessageContaining("owner-only");
        assertThat(Files.exists(properties.getPrivateKeyPath())).isFalse();
        assertThat(Files.exists(properties.getPublicKeyPath())).isFalse();
    }

    private RegistryProperties properties(String directoryName) {
        Path keyDirectory = temporaryDirectory.resolve(directoryName).resolve("keys");
        RegistryProperties properties = new RegistryProperties();
        properties.setPrivateKeyPath(keyDirectory.resolve("deployment-private-key.pem"));
        properties.setPublicKeyPath(keyDirectory.resolve("deployment-public-key.der"));
        properties.setStateDir(temporaryDirectory.resolve(directoryName).resolve("state"));
        return properties;
    }

    private void prepareKeyDirectory(RegistryProperties properties) throws Exception {
        Files.createDirectories(properties.getPrivateKeyPath().getParent());
        Files.setPosixFilePermissions(
                properties.getPrivateKeyPath().getParent(),
                PosixFilePermissions.fromString("rwx------"));
    }
}

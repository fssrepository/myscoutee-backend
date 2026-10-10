package com.raxim.myscoutee.domain.registry;
import com.raxim.myscoutee.common.security.crypto.CanonicalValues;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.security.GeneralSecurityException;
import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.PrivateKey;
import java.security.Signature;
import java.util.Base64;

final class RegistryTestIdentity {
    private RegistryTestIdentity() {
    }

    static KeyPair generate() {
        try {
            return KeyPairGenerator.getInstance("Ed25519").generateKeyPair();
        } catch (GeneralSecurityException exception) {
            throw new IllegalStateException("Ed25519 is unavailable to the test runtime.", exception);
        }
    }

    static void writeDeploymentIdentity(Path keyDirectory, KeyPair keyPair) throws IOException {
        Files.createDirectories(keyDirectory);
        String encodedPrivateKey = Base64.getMimeEncoder(
                        64,
                        "\n".getBytes(StandardCharsets.US_ASCII))
                .encodeToString(keyPair.getPrivate().getEncoded());
        Files.writeString(
                keyDirectory.resolve("deployment-private-key.pem"),
                "-----BEGIN PRIVATE KEY-----\n"
                        + encodedPrivateKey
                        + "\n-----END PRIVATE KEY-----\n",
                StandardCharsets.US_ASCII);
        Files.write(
                keyDirectory.resolve("deployment-public-key.der"),
                keyPair.getPublic().getEncoded());
    }

    static String sign(PrivateKey privateKey, byte[] message) {
        try {
            Signature signature = Signature.getInstance("Ed25519");
            signature.initSign(privateKey);
            signature.update(message);
            return CanonicalValues.standardBase64(signature.sign());
        } catch (GeneralSecurityException exception) {
            throw new IllegalStateException("Unable to sign the test registry response.", exception);
        }
    }
}

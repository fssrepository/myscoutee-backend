package com.raxim.myscoutee.domain.registry;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.LinkOption;
import java.nio.file.Path;
import java.security.GeneralSecurityException;
import java.security.KeyFactory;
import java.security.PrivateKey;
import java.security.PublicKey;
import java.security.Signature;
import java.security.SignatureException;
import java.security.spec.PKCS8EncodedKeySpec;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;
import java.util.Objects;

import com.raxim.myscoutee.domain.registry.config.RegistryProperties;

public final class RegistryCrypto {
    private static final int MAX_PRIVATE_KEY_FILE_BYTES = 16_384;
    private static final int MAX_PUBLIC_KEY_FILE_BYTES = 4_096;
    private static final String PRIVATE_KEY_BEGIN = "-----BEGIN PRIVATE KEY-----";
    private static final String PRIVATE_KEY_END = "-----END PRIVATE KEY-----";
    private static final String PUBLIC_KEY_BEGIN = "-----BEGIN PUBLIC KEY-----";
    private static final String PUBLIC_KEY_END = "-----END PUBLIC KEY-----";
    private static final byte[] KEY_PAIR_CHECK =
            "myscoutee-registry-key-pair-check-v1\n".getBytes(StandardCharsets.UTF_8);

    private final PrivateKey deploymentPrivateKey;
    private final PublicKey deploymentPublicKey;
    private final byte[] deploymentPublicKeyDer;
    private final String deploymentPublicKeyBase64;
    private final String deploymentPublicKeyFingerprint;

    private RegistryCrypto(PrivateKey deploymentPrivateKey, PublicKey deploymentPublicKey) {
        this.deploymentPrivateKey = deploymentPrivateKey;
        this.deploymentPublicKey = deploymentPublicKey;
        this.deploymentPublicKeyDer = deploymentPublicKey.getEncoded().clone();
        this.deploymentPublicKeyBase64 = RegistryProtocol.standardBase64(deploymentPublicKeyDer);
        this.deploymentPublicKeyFingerprint = RegistryProtocol.publicKeyFingerprint(deploymentPublicKeyDer);
        byte[] checkSignature = sign(KEY_PAIR_CHECK);
        if (!verify(deploymentPublicKey, KEY_PAIR_CHECK, checkSignature)) {
            throw new IllegalArgumentException("Configured registry deployment private and public keys do not match.");
        }
    }

    public static RegistryCrypto load(RegistryProperties properties) {
        Objects.requireNonNull(properties, "Registry properties must not be null.");
        Path privateKeyPath = properties.getPrivateKeyPath().toAbsolutePath().normalize();
        Path publicKeyPath = properties.getPublicKeyPath().toAbsolutePath().normalize();
        requireRegularNonSymlink(privateKeyPath, "deployment private key");
        requireRegularNonSymlink(publicKeyPath, "deployment public key");

        try {
            byte[] privateFile = readLimited(privateKeyPath, MAX_PRIVATE_KEY_FILE_BYTES);
            byte[] publicDer = readLimited(publicKeyPath, MAX_PUBLIC_KEY_FILE_BYTES);
            PrivateKey privateKey = parsePrivateKeyPem(privateFile);
            PublicKey publicKey = parsePublicKeyDer(publicDer, "deployment public key");
            return new RegistryCrypto(privateKey, publicKey);
        } catch (IOException exception) {
            throw new IllegalStateException("Unable to read registry deployment key files.", exception);
        }
    }

    public String deploymentPublicKeyBase64() {
        return deploymentPublicKeyBase64;
    }

    public String deploymentPublicKeyFingerprint() {
        return deploymentPublicKeyFingerprint;
    }

    public byte[] deploymentPublicKeyDer() {
        return deploymentPublicKeyDer.clone();
    }

    PublicKey deploymentPublicKey() {
        return deploymentPublicKey;
    }

    public String signBase64(byte[] canonicalMessage) {
        return RegistryProtocol.standardBase64(sign(canonicalMessage));
    }

    public byte[] sign(byte[] canonicalMessage) {
        try {
            Signature signature = Signature.getInstance("Ed25519");
            signature.initSign(deploymentPrivateKey);
            signature.update(Objects.requireNonNull(canonicalMessage, "Canonical message must not be null."));
            return signature.sign();
        } catch (GeneralSecurityException exception) {
            throw new IllegalStateException("Unable to sign registry protocol message with Ed25519.", exception);
        }
    }

    public static PublicKey parseRegistryPublicKey(String publicKeyBase64) {
        byte[] publicKeyDer = RegistryProtocol.decodeStandardBase64(
                publicKeyBase64,
                "registry_public_key");
        return parsePublicKeyDer(publicKeyDer, "registry_public_key");
    }

    public static PublicKey parsePublicKeyDer(byte[] publicKeyDer, String fieldName) {
        try {
            PublicKey publicKey = KeyFactory.getInstance("Ed25519")
                    .generatePublic(new X509EncodedKeySpec(
                            Objects.requireNonNull(publicKeyDer, fieldName + " must not be null.")));
            if (publicKey.getEncoded() == null
                    || !java.util.Arrays.equals(publicKeyDer, publicKey.getEncoded())) {
                throw new IllegalArgumentException(fieldName + " is not canonical Ed25519 SPKI DER.");
            }
            return publicKey;
        } catch (GeneralSecurityException exception) {
            throw new IllegalArgumentException(fieldName + " is not an Ed25519 SPKI public key.", exception);
        }
    }

    public static PublicKey parsePublicKeyPemOrDer(
            byte[] publicKeyFile,
            String fieldName) {
        byte[] supplied = Objects.requireNonNull(
                publicKeyFile,
                fieldName + " must not be null.");
        String text = new String(supplied, StandardCharsets.US_ASCII).trim();
        if (!text.startsWith(PUBLIC_KEY_BEGIN)
                || !text.endsWith(PUBLIC_KEY_END)) {
            return parsePublicKeyDer(supplied, fieldName);
        }
        String encoded = text.substring(
                        PUBLIC_KEY_BEGIN.length(),
                        text.length() - PUBLIC_KEY_END.length())
                .replaceAll("\\s", "");
        try {
            byte[] publicDer = Base64.getDecoder().decode(encoded);
            return parsePublicKeyDer(publicDer, fieldName);
        } catch (IllegalArgumentException exception) {
            throw new IllegalArgumentException(
                    fieldName + " is not a canonical Ed25519 PUBLIC KEY PEM.",
                    exception);
        }
    }

    public static boolean verifyBase64(PublicKey publicKey, byte[] canonicalMessage, String signatureBase64) {
        byte[] signature = RegistryProtocol.decodeStandardBase64(signatureBase64, "signature");
        if (signature.length != 64) {
            throw new IllegalArgumentException("Ed25519 signature must be 64 bytes.");
        }
        return verify(publicKey, canonicalMessage, signature);
    }

    public static boolean verify(PublicKey publicKey, byte[] canonicalMessage, byte[] signatureBytes) {
        try {
            Signature verifier = Signature.getInstance("Ed25519");
            verifier.initVerify(Objects.requireNonNull(publicKey, "Public key must not be null."));
            verifier.update(Objects.requireNonNull(canonicalMessage, "Canonical message must not be null."));
            return verifier.verify(Objects.requireNonNull(signatureBytes, "Signature must not be null."));
        } catch (SignatureException exception) {
            // Malformed attacker-controlled Ed25519 signatures are invalid input,
            // not an unavailable cryptographic primitive or server failure.
            return false;
        } catch (GeneralSecurityException exception) {
            throw new IllegalStateException("Unable to verify registry Ed25519 signature.", exception);
        }
    }

    private static PrivateKey parsePrivateKeyPem(byte[] privateFile) {
        String pem = new String(privateFile, StandardCharsets.US_ASCII).trim();
        if (!pem.startsWith(PRIVATE_KEY_BEGIN) || !pem.endsWith(PRIVATE_KEY_END)) {
            throw new IllegalArgumentException(
                    "Deployment private key must be an unencrypted PKCS#8 PEM PRIVATE KEY.");
        }
        String encoded = pem.substring(
                        PRIVATE_KEY_BEGIN.length(),
                        pem.length() - PRIVATE_KEY_END.length())
                .replaceAll("\\s", "");
        try {
            byte[] privateDer = Base64.getDecoder().decode(encoded);
            PrivateKey privateKey = KeyFactory.getInstance("Ed25519")
                    .generatePrivate(new PKCS8EncodedKeySpec(privateDer));
            if (privateKey.getEncoded() == null
                    || !java.util.Arrays.equals(privateDer, privateKey.getEncoded())) {
                throw new IllegalArgumentException("Deployment private key is not canonical Ed25519 PKCS#8 DER.");
            }
            return privateKey;
        } catch (IllegalArgumentException exception) {
            throw exception;
        } catch (GeneralSecurityException exception) {
            throw new IllegalArgumentException("Deployment private key is not an Ed25519 PKCS#8 key.", exception);
        }
    }

    private static void requireRegularNonSymlink(Path path, String label) {
        if (!Files.exists(path, LinkOption.NOFOLLOW_LINKS)) {
            throw new IllegalStateException(
                    "Registry " + label + " is missing at " + path
                            + "; an operator must initialize the node identity first.");
        }
        if (Files.isSymbolicLink(path) || !Files.isRegularFile(path, LinkOption.NOFOLLOW_LINKS)) {
            throw new IllegalStateException("Registry " + label + " must be a regular non-symlink file: " + path);
        }
    }

    private static byte[] readLimited(Path path, int maxBytes) throws IOException {
        long size = Files.size(path);
        if (size <= 0 || size > maxBytes) {
            throw new IOException("Registry key file has an invalid size: " + path);
        }
        byte[] bytes = Files.readAllBytes(path);
        if (bytes.length > maxBytes) {
            throw new IOException("Registry key file is too large: " + path);
        }
        return bytes;
    }
}

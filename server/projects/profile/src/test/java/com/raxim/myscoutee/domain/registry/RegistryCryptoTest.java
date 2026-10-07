package com.raxim.myscoutee.domain.registry;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assumptions.assumeTrue;

import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;

import com.raxim.myscoutee.domain.registry.config.RegistryProperties;

@org.junit.jupiter.api.Tag("integration")
class RegistryCryptoTest {
    @TempDir
    Path tempDirectory;

    @Test
    void javaAndOpenSslUseCompatiblePkcs8SpkiAndEd25519Signatures() throws Exception {
        assumeTrue(run("openssl", "version").exitCode() == 0, "OpenSSL is required for compatibility test");

        Path privateKey = tempDirectory.resolve("deployment-private-key.pem");
        Path publicKey = tempDirectory.resolve("deployment-public-key.der");
        assertThat(run(
                "openssl",
                "genpkey",
                "-algorithm",
                "ED25519",
                "-out",
                privateKey.toString()).exitCode()).isZero();
        assertThat(run(
                "openssl",
                "pkey",
                "-in",
                privateKey.toString(),
                "-pubout",
                "-outform",
                "DER",
                "-out",
                publicKey.toString()).exitCode()).isZero();

        RegistryProperties properties = new RegistryProperties();
        properties.setPrivateKeyPath(privateKey);
        properties.setPublicKeyPath(publicKey);
        RegistryCrypto crypto = RegistryCrypto.load(properties);

        byte[] canonical = RegistryProtocol.canonical(
                "myscoutee-registry-openssl-compatibility-v1",
                "deployment");
        Path message = tempDirectory.resolve("message.bin");
        Path javaSignature = tempDirectory.resolve("java-signature.bin");
        Path openSslSignature = tempDirectory.resolve("openssl-signature.bin");
        Files.write(message, canonical);
        Files.write(javaSignature, crypto.sign(canonical));

        CommandResult verifyJava = run(
                "openssl",
                "pkeyutl",
                "-verify",
                "-pubin",
                "-inkey",
                publicKey.toString(),
                "-keyform",
                "DER",
                "-rawin",
                "-in",
                message.toString(),
                "-sigfile",
                javaSignature.toString());
        assertThat(verifyJava.exitCode())
                .withFailMessage(verifyJava.output())
                .isZero();

        CommandResult signWithOpenSsl = run(
                "openssl",
                "pkeyutl",
                "-sign",
                "-inkey",
                privateKey.toString(),
                "-rawin",
                "-in",
                message.toString(),
                "-out",
                openSslSignature.toString());
        assertThat(signWithOpenSsl.exitCode())
                .withFailMessage(signWithOpenSsl.output())
                .isZero();
        assertThat(RegistryCrypto.verify(
                RegistryCrypto.parsePublicKeyDer(Files.readAllBytes(publicKey), "test public key"),
                canonical,
                Files.readAllBytes(openSslSignature))).isTrue();
    }

    private CommandResult run(String... command) throws Exception {
        Process process = new ProcessBuilder(command)
                .redirectErrorStream(true)
                .start();
        String output = new String(process.getInputStream().readAllBytes(), StandardCharsets.UTF_8);
        return new CommandResult(process.waitFor(), output);
    }

    private record CommandResult(int exitCode, String output) {
    }
}

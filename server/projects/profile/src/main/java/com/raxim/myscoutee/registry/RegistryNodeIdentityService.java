package com.raxim.myscoutee.registry;

import java.io.IOException;
import java.nio.ByteBuffer;
import java.nio.channels.FileChannel;
import java.nio.charset.StandardCharsets;
import java.nio.file.FileAlreadyExistsException;
import java.nio.file.Files;
import java.nio.file.LinkOption;
import java.nio.file.Path;
import java.nio.file.StandardOpenOption;
import java.nio.file.attribute.PosixFilePermission;
import java.nio.file.attribute.PosixFilePermissions;
import java.security.GeneralSecurityException;
import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.util.Base64;
import java.util.Objects;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

import org.springframework.stereotype.Service;

import com.raxim.myscoutee.common.config.properties.RegistryProperties;

/**
 * Explicit, one-shot creation of the local deployment signing identity.
 *
 * <p>Construction of this service has no filesystem side effects. The
 * initializer is intended to be called only by a future authenticated operator
 * action after registry preflight; it is never invoked by application startup
 * or the registry retry worker.</p>
 */
@Service
public class RegistryNodeIdentityService {
    private static final Set<PosixFilePermission> PRIVATE_KEY_PERMISSIONS =
            PosixFilePermissions.fromString("rw-------");
    private static final Set<PosixFilePermission> PUBLIC_KEY_PERMISSIONS =
            PosixFilePermissions.fromString("rw-r--r--");
    private static final Set<PosixFilePermission> NEW_DIRECTORY_PERMISSIONS =
            PosixFilePermissions.fromString("rwx------");
    private static final ConcurrentMap<String, Object> IDENTITY_LOCKS = new ConcurrentHashMap<>();

    private final RegistryProperties properties;

    public RegistryNodeIdentityService(RegistryProperties properties) {
        this.properties = Objects.requireNonNull(properties, "Registry properties must not be null.");
    }

    public NodeIdentity initializeNodeIdentity() {
        IdentityPaths paths = configuredPaths();
        Object lock = IDENTITY_LOCKS.computeIfAbsent(paths.lockKey(), ignored -> new Object());
        synchronized (lock) {
            return initializeLocked(paths);
        }
    }

    private NodeIdentity initializeLocked(IdentityPaths paths) {
        prepareParent(paths.privateKey().getParent());
        prepareParent(paths.publicKey().getParent());

        boolean privateKeyExists = Files.exists(paths.privateKey(), LinkOption.NOFOLLOW_LINKS);
        boolean publicKeyExists = Files.exists(paths.publicKey(), LinkOption.NOFOLLOW_LINKS);
        if (privateKeyExists) {
            requireRegularNonSymlink(paths.privateKey(), "deployment private key");
        }
        if (publicKeyExists) {
            requireRegularNonSymlink(paths.publicKey(), "deployment public key");
        }
        boolean preservedRegistryState = hasPreservedRegistryState();
        if (!privateKeyExists && publicKeyExists && !preservedRegistryState) {
            /*
             * Generation publishes the non-secret public key first. A
             * power loss before private-key publication can therefore leave
             * exactly this pre-registration state. With no preserved registry
             * state it is safe to discard that public-only attempt and begin
             * again; once state exists we always fail closed.
             */
            try {
                Files.delete(paths.publicKey());
                forceDirectory(paths.publicKey().getParent());
                publicKeyExists = false;
            } catch (IOException exception) {
                throw new IllegalStateException(
                        "Unable to recover an interrupted registry node initialization.",
                        exception);
            }
        }
        if (privateKeyExists != publicKeyExists) {
            throw new IllegalStateException(
                    "Registry node identity is incomplete; refusing to replace or reconstruct an orphaned key.");
        }
        if (privateKeyExists) {
            setPosixPermissions(paths.privateKey(), PRIVATE_KEY_PERMISSIONS);
            setPosixPermissions(paths.publicKey(), PUBLIC_KEY_PERMISSIONS);
            return publicIdentity(RegistryCrypto.load(properties));
        }
        if (preservedRegistryState) {
            throw new IllegalStateException(
                    "Registry state exists without its node identity; restore the matching keys instead of "
                            + "creating a replacement identity.");
        }

        rejectLateTarget(paths.privateKey(), "deployment private key");
        rejectLateTarget(paths.publicKey(), "deployment public key");

        try {
            KeyPair keyPair = KeyPairGenerator.getInstance(RegistryProtocol.KEY_ALGORITHM)
                    .generateKeyPair();
            byte[] privateKeyPem = encodePkcs8Pem(keyPair);
            byte[] publicKeyDer = keyPair.getPublic().getEncoded();
            Path stagedPrivateKey = stage(
                    paths.privateKey(),
                    privateKeyPem,
                    PRIVATE_KEY_PERMISSIONS);
            Path stagedPublicKey = null;
            boolean publicKeyPublished = false;
            boolean privateKeyPublished = false;
            try {
                stagedPublicKey = stage(
                        paths.publicKey(),
                        publicKeyDer,
                        PUBLIC_KEY_PERMISSIONS);
                publish(stagedPublicKey, paths.publicKey(), PUBLIC_KEY_PERMISSIONS);
                stagedPublicKey = null;
                publicKeyPublished = true;

                publish(stagedPrivateKey, paths.privateKey(), PRIVATE_KEY_PERMISSIONS);
                stagedPrivateKey = null;
                privateKeyPublished = true;

                RegistryCrypto crypto = RegistryCrypto.load(properties);
                return publicIdentity(crypto);
            } catch (IOException | RuntimeException exception) {
                if (publicKeyPublished && !privateKeyPublished) {
                    Files.deleteIfExists(paths.publicKey());
                    forceDirectory(paths.publicKey().getParent());
                }
                throw exception;
            } finally {
                if (stagedPrivateKey != null) {
                    Files.deleteIfExists(stagedPrivateKey);
                }
                if (stagedPublicKey != null) {
                    Files.deleteIfExists(stagedPublicKey);
                }
            }
        } catch (GeneralSecurityException exception) {
            throw new IllegalStateException("Unable to generate an Ed25519 registry node identity.", exception);
        } catch (IOException exception) {
            throw new IllegalStateException("Unable to persist the registry node identity.", exception);
        }
    }

    private IdentityPaths configuredPaths() {
        Path privateKey = Objects.requireNonNull(
                        properties.getPrivateKeyPath(),
                        "Registry private-key path must not be null.")
                .toAbsolutePath()
                .normalize();
        Path publicKey = Objects.requireNonNull(
                        properties.getPublicKeyPath(),
                        "Registry public-key path must not be null.")
                .toAbsolutePath()
                .normalize();
        if (privateKey.equals(publicKey)) {
            throw new IllegalStateException(
                    "Registry private and public keys must use different file paths.");
        }
        if (privateKey.getParent() == null || publicKey.getParent() == null) {
            throw new IllegalStateException("Registry key paths must have parent directories.");
        }
        return new IdentityPaths(privateKey, publicKey);
    }

    private static void prepareParent(Path parent) {
        Path absoluteParent = Objects.requireNonNull(parent, "Registry key parent must not be null.")
                .toAbsolutePath()
                .normalize();
        Path current = absoluteParent.getRoot();
        if (current == null) {
            throw new IllegalStateException("Registry key parent must be an absolute path.");
        }
        for (Path component : absoluteParent) {
            current = current.resolve(component);
            boolean created = false;
            if (!Files.exists(current, LinkOption.NOFOLLOW_LINKS)) {
                try {
                    Files.createDirectory(current);
                    created = true;
                } catch (FileAlreadyExistsException ignored) {
                    // A concurrent initializer created it; validate it below.
                } catch (IOException exception) {
                    throw new IllegalStateException(
                            "Unable to create registry key directory " + current + ".",
                            exception);
                }
            }
            if (Files.isSymbolicLink(current)
                    || !Files.isDirectory(current, LinkOption.NOFOLLOW_LINKS)) {
                throw new IllegalStateException(
                        "Registry key path contains a non-directory or symbolic-link component: " + current);
            }
            if (created) {
                setPosixPermissions(current, NEW_DIRECTORY_PERMISSIONS);
                try {
                    forceDirectory(Objects.requireNonNull(current.getParent()));
                } catch (IOException exception) {
                    throw new IllegalStateException(
                            "Unable to make registry key directory creation durable: " + current,
                            exception);
                }
            }
        }
        if (!Files.isWritable(absoluteParent)) {
            throw new IllegalStateException(
                    "Registry key directory is not writable: " + absoluteParent);
        }
        requireOwnerOnlyDirectory(absoluteParent);
    }

    private boolean hasPreservedRegistryState() {
        Path stateDirectory = Objects.requireNonNull(
                        properties.getStateDir(),
                        "Registry state directory must not be null.")
                .toAbsolutePath()
                .normalize();
        if (!Files.exists(stateDirectory, LinkOption.NOFOLLOW_LINKS)) {
            return false;
        }
        if (Files.isSymbolicLink(stateDirectory)
                || !Files.isDirectory(stateDirectory, LinkOption.NOFOLLOW_LINKS)) {
            throw new IllegalStateException(
                    "Registry state path must be a non-symlink directory: " + stateDirectory);
        }
        try (var entries = Files.list(stateDirectory)) {
            return entries.findAny().isPresent();
        } catch (IOException exception) {
            throw new IllegalStateException(
                    "Unable to inspect preserved registry state at " + stateDirectory + ".",
                    exception);
        }
    }

    private static void rejectLateTarget(Path target, String label) {
        if (Files.exists(target, LinkOption.NOFOLLOW_LINKS)) {
            if (Files.isSymbolicLink(target)) {
                throw new IllegalStateException(
                        "Registry " + label + " must not be a symbolic link: " + target);
            }
            throw new IllegalStateException(
                    "Registry " + label + " appeared during initialization; refusing to overwrite it: " + target);
        }
    }

    private static Path stage(
            Path target,
            byte[] content,
            Set<PosixFilePermission> permissions) throws IOException {
        Path parent = target.getParent();
        Path temporary = Files.createTempFile(parent, "." + target.getFileName() + ".", ".tmp");
        boolean complete = false;
        try {
            setPosixPermissions(temporary, permissions);
            try (FileChannel channel = FileChannel.open(
                    temporary,
                    StandardOpenOption.WRITE,
                    StandardOpenOption.TRUNCATE_EXISTING)) {
                ByteBuffer buffer = ByteBuffer.wrap(content);
                while (buffer.hasRemaining()) {
                    channel.write(buffer);
                }
                channel.force(true);
            }
            complete = true;
            return temporary;
        } finally {
            if (!complete) {
                Files.deleteIfExists(temporary);
            }
        }
    }

    private static void publish(
            Path staged,
            Path target,
            Set<PosixFilePermission> permissions) throws IOException {
        rejectLateTarget(target, target.getFileName().toString());
        boolean linked = false;
        try {
            /*
             * The staged file is complete and fsynced. Publishing it with a
             * hard link is atomic and has CREATE_NEW semantics: an existing
             * target can never be replaced, unlike platform-dependent atomic
             * rename behavior.
             */
            Files.createLink(target, staged);
            linked = true;
            setPosixPermissions(target, permissions);
            Files.delete(staged);
            forceDirectory(target.getParent());
        } catch (IOException exception) {
            if (linked) {
                Files.deleteIfExists(target);
                forceDirectory(target.getParent());
            }
            throw exception;
        }
    }

    private static byte[] encodePkcs8Pem(KeyPair keyPair) {
        String encoded = Base64.getMimeEncoder(
                        64,
                        "\n".getBytes(StandardCharsets.US_ASCII))
                .encodeToString(keyPair.getPrivate().getEncoded());
        return ("-----BEGIN PRIVATE KEY-----\n"
                        + encoded
                        + "\n-----END PRIVATE KEY-----\n")
                .getBytes(StandardCharsets.US_ASCII);
    }

    private static NodeIdentity publicIdentity(RegistryCrypto crypto) {
        return new NodeIdentity(crypto.deploymentPublicKeyFingerprint());
    }

    private static void requireRegularNonSymlink(Path path, String label) {
        if (Files.isSymbolicLink(path) || !Files.isRegularFile(path, LinkOption.NOFOLLOW_LINKS)) {
            throw new IllegalStateException(
                    "Registry " + label + " must be a regular non-symlink file: " + path);
        }
    }

    private static void setPosixPermissions(
            Path path,
            Set<PosixFilePermission> permissions) {
        try {
            Files.setPosixFilePermissions(path, permissions);
        } catch (UnsupportedOperationException | IOException ignored) {
            // The production package targets Linux; other file systems may not expose POSIX modes.
        }
    }

    private static void requireOwnerOnlyDirectory(Path directory) {
        try {
            Set<PosixFilePermission> permissions = Files.getPosixFilePermissions(
                    directory,
                    LinkOption.NOFOLLOW_LINKS);
            boolean groupOrOtherAccess = permissions.stream().anyMatch(permission -> switch (permission) {
                case GROUP_READ, GROUP_WRITE, GROUP_EXECUTE,
                        OTHERS_READ, OTHERS_WRITE, OTHERS_EXECUTE -> true;
                default -> false;
            });
            if (groupOrOtherAccess) {
                throw new IllegalStateException(
                        "Registry key directory must be owner-only (mode 0700): " + directory);
            }
        } catch (UnsupportedOperationException ignored) {
            // Non-POSIX development file systems do not expose Unix directory modes.
        } catch (IOException exception) {
            throw new IllegalStateException(
                    "Unable to validate registry key directory permissions: " + directory,
                    exception);
        }
    }

    private static void forceDirectory(Path directory) throws IOException {
        try (FileChannel channel = FileChannel.open(directory, StandardOpenOption.READ)) {
            channel.force(true);
        }
    }

    public record NodeIdentity(String publicKeyFingerprint) {
    }

    private record IdentityPaths(Path privateKey, Path publicKey) {
        String lockKey() {
            return privateKey + "\n" + publicKey;
        }
    }
}

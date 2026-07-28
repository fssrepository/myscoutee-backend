package com.raxim.myscoutee.registry;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.Instant;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.ZoneOffset;
import java.time.format.DateTimeParseException;
import java.util.Base64;
import java.util.HexFormat;
import java.util.Locale;
import java.util.Objects;
import java.util.regex.Pattern;

import com.fasterxml.jackson.annotation.JsonProperty;

public final class RegistryProtocol {
    public static final String PROTOCOL_VERSION = "1";
    public static final String REGISTRY_IDENTITY_PATH = "/v1/registry/identity";
    public static final String REGISTRATION_PATH = "/v1/deployments/register";
    public static final String MAU_BATCH_PATH = "/v1/mau/batches";
    public static final String KEY_ALGORITHM = "Ed25519";
    public static final String INSTALLATION_KIND = "installation-test";
    public static final String INSTALLATION_RULESET = "installation-test-v1";
    public static final long INSTALLATION_MAU_COUNT = 0L;
    public static final String INSTALLATION_ENTRY_TYPE = "INSTALLATION_TEST_BATCH_ACCEPTED";
    public static final String ZERO_HASH =
            "sha256:0000000000000000000000000000000000000000000000000000000000000000";

    private static final Pattern HASH_PATTERN = Pattern.compile("sha256:[0-9a-f]{64}");
    private static final Pattern PERIOD_PATTERN = Pattern.compile("[0-9]{4}-(0[1-9]|1[0-2])");
    private static final Pattern PRINTABLE_TOKEN_PATTERN = Pattern.compile("[\\x21-\\x7e]{8,128}");
    private static final Pattern REGISTRY_SCOPE_PATTERN =
            Pattern.compile("[a-z0-9][a-z0-9._:-]{2,127}");
    private static final Pattern DEPLOYMENT_ID_PATTERN = Pattern.compile("dep_[0-9a-f]{32}");
    private static final Pattern BATCH_ID_PATTERN = Pattern.compile("batch_[0-9a-f]{32}");
    private static final Pattern REGISTRY_KEY_ID_PATTERN = Pattern.compile("rkey_[0-9a-f]{32}");

    private RegistryProtocol() {
    }

    public static byte[] registrationPayload(
            String keyAlgorithm,
            String publicKey,
            String softwareVersion) {
        return canonical(
                "myscoutee-registry-registration-payload-v1",
                keyAlgorithm,
                publicKey,
                softwareVersion);
    }

    public static byte[] registryIdentity(RegistryIdentityResponse response) {
        Objects.requireNonNull(response, "Registry identity response must not be null.");
        return canonical(
                "myscoutee-registry-identity-v1",
                response.protocolVersion(),
                response.registryScope(),
                response.registryKeyId(),
                response.registryPublicKey());
    }

    public static byte[] installationCommitment(String deploymentId, String idempotencyKey) {
        return canonical(
                "myscoutee-registry-installation-test-v1",
                deploymentId,
                idempotencyKey);
    }

    public static byte[] mauBatchPayload(
            String kind,
            String period,
            String rulesetVersion,
            long qualifiedMauCount,
            String commitmentHash) {
        return canonical(
                "myscoutee-registry-mau-batch-payload-v1",
                kind,
                period,
                rulesetVersion,
                Long.toString(qualifiedMauCount),
                commitmentHash);
    }

    public static byte[] signedRequest(
            String method,
            String path,
            String protocolVersion,
            String registryScope,
            String signer,
            String timestamp,
            String nonce,
            String idempotencyKey,
            String payloadHash) {
        return canonical(
                "myscoutee-registry-request-v1",
                requireCanonical(method, "HTTP method").toUpperCase(Locale.ROOT),
                path,
                protocolVersion,
                registryScope,
                signer,
                timestamp,
                nonce,
                idempotencyKey,
                payloadHash);
    }

    public static byte[] registrationReceipt(RegistrationResponse response) {
        Objects.requireNonNull(response, "Registration response must not be null.");
        return canonical(
                "myscoutee-registry-registration-receipt-v1",
                response.protocolVersion(),
                response.registryScope(),
                response.deploymentId(),
                response.publicKeyFingerprint(),
                response.registeredAt(),
                response.registryKeyId());
    }

    public static byte[] ledgerEntry(
            String protocolVersion,
            String registryScope,
            long ledgerIndex,
            String entryType,
            String deploymentId,
            String batchId,
            String kind,
            String period,
            String rulesetVersion,
            long qualifiedMauCount,
            String batchHash,
            String previousEntryHash,
            String acceptedAt) {
        return canonical(
                "myscoutee-registry-ledger-entry-v1",
                protocolVersion,
                registryScope,
                Long.toString(ledgerIndex),
                entryType,
                deploymentId,
                batchId,
                kind,
                period,
                rulesetVersion,
                Long.toString(qualifiedMauCount),
                batchHash,
                previousEntryHash,
                acceptedAt);
    }

    public static byte[] mauReceipt(BatchResponse response) {
        Objects.requireNonNull(response, "Batch response must not be null.");
        MauReceipt receipt = Objects.requireNonNull(response.receipt(), "MAU receipt must not be null.");
        return canonical(
                "myscoutee-registry-mau-receipt-v1",
                response.protocolVersion(),
                response.registryScope(),
                response.batchId(),
                response.deploymentId(),
                requiredLong(receipt.ledgerIndex(), "ledger_index"),
                receipt.entryHash(),
                receipt.previousEntryHash(),
                receipt.batchHash(),
                receipt.kind(),
                receipt.period(),
                receipt.rulesetVersion(),
                requiredLong(receipt.qualifiedMauCount(), "qualified_mau_count"),
                receipt.acceptedAt(),
                receipt.checkpointDate(),
                receipt.registryKeyId());
    }

    public static byte[] checkpoint(CheckpointResponse checkpoint) {
        Objects.requireNonNull(checkpoint, "Checkpoint must not be null.");
        return canonical(
                "myscoutee-registry-checkpoint-v1",
                checkpoint.registryScope(),
                checkpoint.checkpointDate(),
                requiredLong(checkpoint.throughLedgerIndex(), "through_ledger_index"),
                requiredLong(checkpoint.entryCount(), "entry_count"),
                checkpoint.ledgerHeadHash(),
                checkpoint.previousCheckpointHash(),
                checkpoint.generatedAt(),
                checkpoint.registryKeyId());
    }

    public static byte[] canonical(String... values) {
        StringBuilder canonical = new StringBuilder();
        for (int index = 0; index < values.length; index++) {
            String value = requireCanonical(values[index], "canonical field " + index);
            canonical.append(value).append('\n');
        }
        return canonical.toString().getBytes(StandardCharsets.UTF_8);
    }

    public static String sha256(byte[] value) {
        try {
            byte[] digest = MessageDigest.getInstance("SHA-256").digest(value);
            return "sha256:" + HexFormat.of().formatHex(digest);
        } catch (NoSuchAlgorithmException exception) {
            throw new IllegalStateException("SHA-256 is unavailable.", exception);
        }
    }

    public static String publicKeyFingerprint(byte[] spkiDer) {
        return sha256(Objects.requireNonNull(spkiDer, "Public key DER must not be null."));
    }

    public static String registryKeyId(String publicKeyFingerprint) {
        requireHash(publicKeyFingerprint, "registry public-key fingerprint");
        return "rkey_" + publicKeyFingerprint.substring("sha256:".length(), "sha256:".length() + 32);
    }

    public static String standardBase64(byte[] value) {
        return Base64.getEncoder().encodeToString(Objects.requireNonNull(value, "Binary value must not be null."));
    }

    public static byte[] decodeStandardBase64(String value, String fieldName) {
        requireCanonical(value, fieldName);
        try {
            byte[] decoded = Base64.getDecoder().decode(value);
            if (!standardBase64(decoded).equals(value)) {
                throw new IllegalArgumentException(fieldName + " is not canonical padded base64.");
            }
            return decoded;
        } catch (IllegalArgumentException exception) {
            if (exception.getMessage() != null && exception.getMessage().contains("canonical padded base64")) {
                throw exception;
            }
            throw new IllegalArgumentException(fieldName + " is not valid standard padded base64.", exception);
        }
    }

    public static String randomToken(String prefix, SecureRandom secureRandom) {
        requireCanonical(prefix, "token prefix");
        byte[] randomBytes = new byte[24];
        Objects.requireNonNull(secureRandom, "SecureRandom must not be null.").nextBytes(randomBytes);
        return prefix + Base64.getUrlEncoder().withoutPadding().encodeToString(randomBytes);
    }

    public static String requireCanonical(String value, String fieldName) {
        if (value == null || value.isEmpty()) {
            throw new IllegalArgumentException(fieldName + " must not be blank.");
        }
        if (value.indexOf('\r') >= 0 || value.indexOf('\n') >= 0) {
            throw new IllegalArgumentException(fieldName + " must not contain CR or LF.");
        }
        return value;
    }

    public static String requireHash(String value, String fieldName) {
        requireCanonical(value, fieldName);
        if (!HASH_PATTERN.matcher(value).matches()) {
            throw new IllegalArgumentException(fieldName + " must be a canonical SHA-256 value.");
        }
        return value;
    }

    public static String requireToken(String value, String fieldName) {
        requireCanonical(value, fieldName);
        if (!PRINTABLE_TOKEN_PATTERN.matcher(value).matches()) {
            throw new IllegalArgumentException(fieldName + " must be 8-128 printable ASCII characters.");
        }
        return value;
    }

    public static String requireRegistryScope(String value) {
        requireCanonical(value, "registry_scope");
        if (!REGISTRY_SCOPE_PATTERN.matcher(value).matches()) {
            throw new IllegalArgumentException(
                    "registry_scope must be 3-128 lowercase ASCII letters, digits, dots, colons, underscores, "
                            + "or hyphens, and must begin with a letter or digit.");
        }
        return value;
    }

    public static String requireDeploymentId(String value) {
        requireCanonical(value, "deployment_id");
        if (!DEPLOYMENT_ID_PATTERN.matcher(value).matches()) {
            throw new IllegalArgumentException("deployment_id is malformed.");
        }
        return value;
    }

    public static String requireBatchId(String value) {
        requireCanonical(value, "batch_id");
        if (!BATCH_ID_PATTERN.matcher(value).matches()) {
            throw new IllegalArgumentException("batch_id is malformed.");
        }
        return value;
    }

    public static String requireRegistryKeyId(String value) {
        requireCanonical(value, "registry_key_id");
        if (!REGISTRY_KEY_ID_PATTERN.matcher(value).matches()) {
            throw new IllegalArgumentException("registry_key_id is malformed.");
        }
        return value;
    }

    public static Instant requireUtcTimestamp(String value, String fieldName) {
        requireCanonical(value, fieldName);
        if (!value.endsWith("Z")) {
            throw new IllegalArgumentException(fieldName + " must be an RFC 3339 UTC timestamp ending in Z.");
        }
        try {
            return Instant.parse(value);
        } catch (DateTimeParseException exception) {
            throw new IllegalArgumentException(fieldName + " must be an RFC 3339 UTC timestamp.", exception);
        }
    }

    public static YearMonth requirePeriod(String value) {
        requireCanonical(value, "period");
        if (!PERIOD_PATTERN.matcher(value).matches()) {
            throw new IllegalArgumentException("period must use YYYY-MM.");
        }
        return YearMonth.parse(value);
    }

    public static LocalDate requireCheckpointDate(String value) {
        requireCanonical(value, "checkpoint_date");
        try {
            return LocalDate.parse(value);
        } catch (DateTimeParseException exception) {
            throw new IllegalArgumentException("checkpoint_date must use YYYY-MM-DD.", exception);
        }
    }

    public static String periodAt(Instant instant) {
        return YearMonth.from(Objects.requireNonNull(instant, "Instant must not be null.").atZone(ZoneOffset.UTC))
                .toString();
    }

    public static String checkpointDateAt(Instant instant) {
        return instant.atZone(ZoneOffset.UTC).toLocalDate().toString();
    }

    public static boolean hashEquals(String left, String right) {
        if (left == null || right == null) {
            return false;
        }
        return MessageDigest.isEqual(
                left.getBytes(StandardCharsets.US_ASCII),
                right.getBytes(StandardCharsets.US_ASCII));
    }

    private static String requiredLong(Long value, String fieldName) {
        if (value == null) {
            throw new IllegalArgumentException(fieldName + " must not be null.");
        }
        return Long.toString(value);
    }

    public record RegistryIdentityResponse(
            @JsonProperty("protocol_version") String protocolVersion,
            @JsonProperty("registry_scope") String registryScope,
            @JsonProperty("registry_key_id") String registryKeyId,
            @JsonProperty("registry_public_key") String registryPublicKey,
            String signature) {
    }

    public record RegistrationRequest(
            @JsonProperty("protocol_version") String protocolVersion,
            @JsonProperty("registry_scope") String registryScope,
            String timestamp,
            String nonce,
            @JsonProperty("idempotency_key") String idempotencyKey,
            @JsonProperty("key_algorithm") String keyAlgorithm,
            @JsonProperty("public_key") String publicKey,
            @JsonProperty("software_version") String softwareVersion,
            @JsonProperty("payload_hash") String payloadHash,
            String signature) {
    }

    public record RegistrationResponse(
            @JsonProperty("protocol_version") String protocolVersion,
            @JsonProperty("registry_scope") String registryScope,
            @JsonProperty("deployment_id") String deploymentId,
            @JsonProperty("registered_at") String registeredAt,
            @JsonProperty("public_key_fingerprint") String publicKeyFingerprint,
            @JsonProperty("registry_key_id") String registryKeyId,
            @JsonProperty("registry_public_key") String registryPublicKey,
            @JsonProperty("receipt_signature") String receiptSignature,
            Boolean duplicate) {
    }

    public record BatchRequest(
            @JsonProperty("protocol_version") String protocolVersion,
            @JsonProperty("registry_scope") String registryScope,
            @JsonProperty("deployment_id") String deploymentId,
            String timestamp,
            String nonce,
            @JsonProperty("idempotency_key") String idempotencyKey,
            String kind,
            String period,
            @JsonProperty("ruleset_version") String rulesetVersion,
            @JsonProperty("qualified_mau_count") Long qualifiedMauCount,
            @JsonProperty("commitment_hash") String commitmentHash,
            @JsonProperty("payload_hash") String payloadHash,
            String signature) {
    }

    public record BatchResponse(
            @JsonProperty("protocol_version") String protocolVersion,
            @JsonProperty("registry_scope") String registryScope,
            @JsonProperty("batch_id") String batchId,
            @JsonProperty("deployment_id") String deploymentId,
            @JsonProperty("idempotency_key") String idempotencyKey,
            Boolean duplicate,
            MauReceipt receipt) {
    }

    public record MauReceipt(
            @JsonProperty("ledger_index") Long ledgerIndex,
            @JsonProperty("entry_hash") String entryHash,
            @JsonProperty("previous_entry_hash") String previousEntryHash,
            @JsonProperty("batch_hash") String batchHash,
            String kind,
            String period,
            @JsonProperty("ruleset_version") String rulesetVersion,
            @JsonProperty("qualified_mau_count") Long qualifiedMauCount,
            @JsonProperty("accepted_at") String acceptedAt,
            @JsonProperty("checkpoint_date") String checkpointDate,
            @JsonProperty("registry_scope") String registryScope,
            @JsonProperty("registry_key_id") String registryKeyId,
            @JsonProperty("registry_public_key") String registryPublicKey,
            String signature) {
    }

    public record CheckpointResponse(
            @JsonProperty("registry_scope") String registryScope,
            @JsonProperty("checkpoint_date") String checkpointDate,
            @JsonProperty("through_ledger_index") Long throughLedgerIndex,
            @JsonProperty("entry_count") Long entryCount,
            @JsonProperty("ledger_head_hash") String ledgerHeadHash,
            @JsonProperty("previous_checkpoint_hash") String previousCheckpointHash,
            @JsonProperty("checkpoint_hash") String checkpointHash,
            @JsonProperty("generated_at") String generatedAt,
            @JsonProperty("registry_key_id") String registryKeyId,
            @JsonProperty("registry_public_key") String registryPublicKey,
            String signature) {
    }
}

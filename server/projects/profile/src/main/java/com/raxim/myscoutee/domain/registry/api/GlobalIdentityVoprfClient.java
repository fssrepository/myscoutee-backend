package com.raxim.myscoutee.domain.registry.api;

import java.math.BigInteger;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.util.Arrays;
import java.util.Base64;
import java.util.Objects;

import org.bouncycastle.asn1.x9.X9ECParameters;
import org.bouncycastle.crypto.digests.SHA256Digest;
import org.bouncycastle.crypto.ec.CustomNamedCurves;
import org.bouncycastle.crypto.hash2curve.HashToCurveProfile;
import org.bouncycastle.crypto.hash2curve.HashToEllipticCurve;
import org.bouncycastle.crypto.hash2curve.OPRFHashToScalar;
import org.bouncycastle.math.ec.ECCurve;
import org.bouncycastle.math.ec.ECPoint;

/**
 * RFC 9497 VOPRF client for the single v1 global-identity ciphersuite.
 *
 * <p>The private identifier and blind remain in this process. The registry
 * receives only the blinded group element and, after successful proof
 * verification, an application-domain commitment of the VOPRF output.</p>
 */
public final class GlobalIdentityVoprfClient {
    public static final String SUITE = "P256-SHA256";
    public static final String MODE = "VOPRF";
    public static final int RFC_MODE_ID = 0x01;
    public static final int OUTPUT_BYTES = 32;

    private static final int ELEMENT_BYTES = 33;
    private static final int SCALAR_BYTES = 32;
    private static final int PROOF_BYTES = SCALAR_BYTES * 2;
    private static final X9ECParameters PARAMETERS =
            Objects.requireNonNull(
                    CustomNamedCurves.getByName("secp256r1"),
                    "Bouncy Castle does not expose secp256r1.");
    private static final ECCurve CURVE = PARAMETERS.getCurve();
    private static final BigInteger ORDER = PARAMETERS.getN();
    private static final ECPoint GENERATOR = PARAMETERS.getG().normalize();
    private static final byte[] CONTEXT_STRING = concatenate(
            ascii("OPRFV1-"),
            new byte[] {(byte) RFC_MODE_ID},
            ascii("-"),
            ascii(SUITE));
    private static final byte[] HASH_TO_GROUP_DST =
            concatenate(ascii("HashToGroup-"), CONTEXT_STRING);
    private static final byte[] HASH_TO_SCALAR_DST =
            concatenate(ascii("HashToScalar-"), CONTEXT_STRING);
    private static final HashToEllipticCurve HASH_TO_GROUP =
            HashToEllipticCurve.getInstance(
                    HashToCurveProfile.P256_XMD_SHA_256,
                    new String(HASH_TO_GROUP_DST, StandardCharsets.ISO_8859_1));

    private final SecureRandom secureRandom;

    public GlobalIdentityVoprfClient() {
        this(new SecureRandom());
    }

    GlobalIdentityVoprfClient(SecureRandom secureRandom) {
        this.secureRandom = Objects.requireNonNull(
                secureRandom,
                "VOPRF secure random must not be null.");
    }

    /**
     * Blinds one private input. The returned session is single-use and should
     * be closed promptly if the registry request cannot be completed.
     */
    public BlindSession blind(byte[] privateInput) {
        byte[] blind = randomScalar();
        try {
            return blind(privateInput, blind);
        } finally {
            Arrays.fill(blind, (byte) 0);
        }
    }

    BlindSession blind(byte[] privateInput, byte[] encodedBlind) {
        byte[] input = requirePrivateInput(privateInput);
        byte[] blind = requireNonZeroScalar(encodedBlind, "VOPRF blind");
        ECPoint inputElement = canonicalPoint(
                HASH_TO_GROUP.hashToCurve(input),
                "VOPRF input element");
        if (inputElement.isInfinity()) {
            Arrays.fill(input, (byte) 0);
            Arrays.fill(blind, (byte) 0);
            throw new IllegalArgumentException(
                    "VOPRF private input mapped to the group identity.");
        }
        ECPoint blindedElement = inputElement
                .multiply(new BigInteger(1, blind))
                .normalize();
        return new BlindSession(
                input,
                blind,
                encodeElement(blindedElement));
    }

    /**
     * Verifies the registry's RFC 9497 DLEQ proof and finalizes the VOPRF
     * output. The session is destroyed whether verification succeeds or fails.
     */
    public byte[] finish(
            BlindSession session,
            String publicKey,
            String evaluatedElement,
            String proof) {
        Objects.requireNonNull(session, "VOPRF blind session must not be null.");
        BlindSession.Secrets secrets = session.takeSecrets();
        byte[] input = secrets.input();
        byte[] blind = secrets.blind();
        try {
            ECPoint blinded = decodeElement(
                    session.blindedElement(),
                    "VOPRF blinded element");
            ECPoint serverPublicKey = decodeElement(
                    publicKey,
                    "VOPRF public key");
            ECPoint evaluated = decodeElement(
                    evaluatedElement,
                    "VOPRF evaluated element");
            byte[] proofBytes = decodeCanonicalBase64(
                    proof,
                    PROOF_BYTES,
                    "VOPRF proof");
            if (!verifyProof(
                    serverPublicKey,
                    blinded,
                    evaluated,
                    proofBytes)) {
                throw new IllegalArgumentException(
                        "Registry VOPRF proof verification failed.");
            }
            BigInteger blindScalar = new BigInteger(1, blind);
            ECPoint unblinded = evaluated
                    .multiply(blindScalar.modInverse(ORDER))
                    .normalize();
            byte[] serialized = serializeElement(unblinded);
            return sha256(concatenate(
                    i2osp2(input.length),
                    input,
                    i2osp2(serialized.length),
                    serialized,
                    ascii("Finalize")));
        } finally {
            Arrays.fill(input, (byte) 0);
            Arrays.fill(blind, (byte) 0);
            session.close();
        }
    }

    public static String networkIdentityCommitment(
            long keyVersion,
            byte[] voprfOutput) {
        if (keyVersion <= 0L) {
            throw new IllegalArgumentException(
                    "VOPRF key version must be positive.");
        }
        byte[] output = Objects.requireNonNull(
                voprfOutput,
                "VOPRF output must not be null.").clone();
        try {
            if (output.length != OUTPUT_BYTES) {
                throw new IllegalArgumentException(
                        "VOPRF output must contain 32 bytes.");
            }
            return RegistryProtocol.sha256(RegistryProtocol.canonical(
                    "myscoutee-network-identity-commitment-v1",
                    Long.toString(keyVersion),
                    SUITE,
                    Base64.getEncoder().encodeToString(output)));
        } finally {
            Arrays.fill(output, (byte) 0);
        }
    }

    private boolean verifyProof(
            ECPoint publicKey,
            ECPoint blindedElement,
            ECPoint evaluatedElement,
            byte[] proof) {
        BigInteger c = decodeScalar(
                Arrays.copyOfRange(proof, 0, SCALAR_BYTES),
                "VOPRF proof challenge");
        BigInteger s = decodeScalar(
                Arrays.copyOfRange(proof, SCALAR_BYTES, PROOF_BYTES),
                "VOPRF proof response");

        byte[] serializedPublicKey = serializeElement(publicKey);
        byte[] seedDst = concatenate(ascii("Seed-"), CONTEXT_STRING);
        byte[] seed = sha256(concatenate(
                i2osp2(serializedPublicKey.length),
                serializedPublicKey,
                i2osp2(seedDst.length),
                seedDst));
        byte[] serializedBlinded = serializeElement(blindedElement);
        byte[] serializedEvaluated = serializeElement(evaluatedElement);
        BigInteger coefficient = hashToScalar(concatenate(
                i2osp2(seed.length),
                seed,
                i2osp2(0),
                i2osp2(serializedBlinded.length),
                serializedBlinded,
                i2osp2(serializedEvaluated.length),
                serializedEvaluated,
                ascii("Composite")));
        ECPoint compositeM = blindedElement.multiply(coefficient).normalize();
        ECPoint compositeZ = evaluatedElement.multiply(coefficient).normalize();
        ECPoint t2 = GENERATOR
                .multiply(s)
                .add(publicKey.multiply(c))
                .normalize();
        ECPoint t3 = compositeM
                .multiply(s)
                .add(compositeZ.multiply(c))
                .normalize();
        byte[] challengeTranscript = concatenate(
                i2osp2(serializedPublicKey.length),
                serializedPublicKey,
                lengthPrefixedElement(compositeM),
                lengthPrefixedElement(compositeZ),
                lengthPrefixedElement(t2),
                lengthPrefixedElement(t3),
                ascii("Challenge"));
        BigInteger expected = hashToScalar(challengeTranscript);
        return MessageDigest.isEqual(encodeScalar(expected), encodeScalar(c));
    }

    private byte[] randomScalar() {
        byte[] candidate = new byte[SCALAR_BYTES];
        do {
            secureRandom.nextBytes(candidate);
        } while (!isNonZeroScalar(candidate));
        return candidate;
    }

    private static boolean isNonZeroScalar(byte[] encoded) {
        if (encoded == null || encoded.length != SCALAR_BYTES) {
            return false;
        }
        BigInteger scalar = new BigInteger(1, encoded);
        return scalar.signum() > 0 && scalar.compareTo(ORDER) < 0;
    }

    private static byte[] requireNonZeroScalar(
            byte[] encoded,
            String label) {
        byte[] copy = Objects.requireNonNull(
                encoded,
                label + " must not be null.").clone();
        if (!isNonZeroScalar(copy)) {
            Arrays.fill(copy, (byte) 0);
            throw new IllegalArgumentException(
                    label + " is not a canonical non-zero P-256 scalar.");
        }
        return copy;
    }

    private static BigInteger decodeScalar(byte[] encoded, String label) {
        if (encoded.length != SCALAR_BYTES) {
            throw new IllegalArgumentException(
                    label + " must contain 32 bytes.");
        }
        BigInteger scalar = new BigInteger(1, encoded);
        if (scalar.compareTo(ORDER) >= 0) {
            throw new IllegalArgumentException(
                    label + " is outside the P-256 scalar field.");
        }
        return scalar;
    }

    private static byte[] encodeScalar(BigInteger scalar) {
        byte[] source = scalar.toByteArray();
        int sourceOffset = source.length > SCALAR_BYTES ? 1 : 0;
        int sourceLength = source.length - sourceOffset;
        if (sourceLength > SCALAR_BYTES) {
            throw new IllegalArgumentException(
                    "P-256 scalar does not fit its canonical encoding.");
        }
        byte[] encoded = new byte[SCALAR_BYTES];
        System.arraycopy(
                source,
                sourceOffset,
                encoded,
                SCALAR_BYTES - sourceLength,
                sourceLength);
        return encoded;
    }

    private static BigInteger hashToScalar(byte[] input) {
        return new OPRFHashToScalar(
                CURVE,
                new SHA256Digest(),
                128)
                .process(input, HASH_TO_SCALAR_DST);
    }

    private static ECPoint decodeElement(String encoded, String label) {
        byte[] bytes = decodeCanonicalBase64(
                encoded,
                ELEMENT_BYTES,
                label);
        if (bytes[0] != 0x02 && bytes[0] != 0x03) {
            throw new IllegalArgumentException(
                    label + " must use compressed SEC1 encoding.");
        }
        try {
            ECPoint point = CURVE.decodePoint(bytes).normalize();
            if (point.isInfinity()
                    || !point.isValid()
                    || !MessageDigest.isEqual(
                            bytes,
                            serializeElement(point))) {
                throw new IllegalArgumentException(
                        label + " is not a canonical non-identity P-256 point.");
            }
            return point;
        } catch (IllegalArgumentException exception) {
            throw new IllegalArgumentException(
                    label + " is not a canonical non-identity P-256 point.",
                    exception);
        }
    }

    private static ECPoint canonicalPoint(ECPoint point, String label) {
        Objects.requireNonNull(point, label + " must not be null.");
        return decodeElement(encodeElement(point), label);
    }

    private static String encodeElement(ECPoint point) {
        return Base64.getEncoder().encodeToString(serializeElement(point));
    }

    private static byte[] serializeElement(ECPoint point) {
        byte[] encoded = point.normalize().getEncoded(true);
        if (encoded.length != ELEMENT_BYTES) {
            throw new IllegalArgumentException(
                    "P-256 element did not produce a 33-byte compressed encoding.");
        }
        return encoded;
    }

    private static byte[] lengthPrefixedElement(ECPoint point) {
        byte[] encoded = serializeElement(point);
        return concatenate(i2osp2(encoded.length), encoded);
    }

    private static byte[] requirePrivateInput(byte[] input) {
        byte[] copy = Objects.requireNonNull(
                input,
                "VOPRF private input must not be null.").clone();
        if (copy.length == 0 || copy.length > 0xffff) {
            Arrays.fill(copy, (byte) 0);
            throw new IllegalArgumentException(
                    "VOPRF private input must contain between 1 and 65535 bytes.");
        }
        return copy;
    }

    private static byte[] decodeCanonicalBase64(
            String encoded,
            int expectedLength,
            String label) {
        if (encoded == null || encoded.isBlank()) {
            throw new IllegalArgumentException(label + " is required.");
        }
        try {
            byte[] decoded = Base64.getDecoder().decode(encoded);
            if (decoded.length != expectedLength
                    || !Base64.getEncoder()
                            .encodeToString(decoded)
                            .equals(encoded)) {
                throw new IllegalArgumentException(
                        label + " is not canonical padded Base64.");
            }
            return decoded;
        } catch (IllegalArgumentException exception) {
            throw new IllegalArgumentException(
                    label + " is not canonical padded Base64.",
                    exception);
        }
    }

    private static byte[] sha256(byte[] input) {
        try {
            return MessageDigest.getInstance("SHA-256").digest(input);
        } catch (NoSuchAlgorithmException exception) {
            throw new IllegalStateException("SHA-256 is unavailable.", exception);
        }
    }

    private static byte[] ascii(String value) {
        return value.getBytes(StandardCharsets.US_ASCII);
    }

    private static byte[] i2osp2(int value) {
        if (value < 0 || value > 0xffff) {
            throw new IllegalArgumentException(
                    "RFC 9497 two-byte length is outside its supported range.");
        }
        return new byte[] {
                (byte) (value >>> 8),
                (byte) value
        };
    }

    private static byte[] concatenate(byte[]... parts) {
        int length = 0;
        for (byte[] part : parts) {
            length = Math.addExact(
                    length,
                    Objects.requireNonNull(
                            part,
                            "VOPRF transcript part must not be null.").length);
        }
        byte[] joined = new byte[length];
        int offset = 0;
        for (byte[] part : parts) {
            System.arraycopy(part, 0, joined, offset, part.length);
            offset += part.length;
        }
        return joined;
    }

    public static final class BlindSession implements AutoCloseable {
        private byte[] input;
        private byte[] blind;
        private final String blindedElement;

        private BlindSession(
                byte[] input,
                byte[] blind,
                String blindedElement) {
            this.input = input;
            this.blind = blind;
            this.blindedElement = blindedElement;
        }

        public String blindedElement() {
            return blindedElement;
        }

        private synchronized Secrets takeSecrets() {
            if (input == null || blind == null) {
                throw new IllegalStateException(
                        "VOPRF blind session has already been consumed.");
            }
            Secrets secrets = new Secrets(input.clone(), blind.clone());
            try {
                return secrets;
            } finally {
                close();
            }
        }

        @Override
        public synchronized void close() {
            if (input != null) {
                Arrays.fill(input, (byte) 0);
                input = null;
            }
            if (blind != null) {
                Arrays.fill(blind, (byte) 0);
                blind = null;
            }
        }

        private record Secrets(byte[] input, byte[] blind) {
        }
    }
}

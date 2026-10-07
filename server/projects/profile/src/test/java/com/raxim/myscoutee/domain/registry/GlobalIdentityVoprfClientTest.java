package com.raxim.myscoutee.domain.registry;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.util.Base64;
import java.util.HexFormat;

import org.junit.jupiter.api.Test;

@org.junit.jupiter.api.Tag("standard")
class GlobalIdentityVoprfClientTest {
    private static final HexFormat HEX = HexFormat.of();

    @Test
    void matchesRfc9497P256VoprfVector() {
        GlobalIdentityVoprfClient client =
                new GlobalIdentityVoprfClient();
        byte[] input = HEX.parseHex("00");
        byte[] blind = HEX.parseHex(
                "3338fa65ec36e0290022b48eb562889d"
                        + "89dbfa691d1cde91517fa222ed7ad364");
        try (GlobalIdentityVoprfClient.BlindSession session =
                client.blind(input, blind)) {
            assertEquals(
                    base64(
                            "02dd05901038bb31a6fae01828fd8d0e"
                                    + "49e35a486b5c5d4b4994013648c01277da"),
                    session.blindedElement());
            byte[] output = client.finish(
                    session,
                    base64(
                            "03e17e70604bcabe198882c0a1f27a92"
                                    + "441e774224ed9c702e51dd17038b102462"),
                    base64(
                            "0209f33cab60cf8fe69239b0afbcfcd2"
                                    + "61af4c1c5632624f2e9ba29b90ae83e4a2"),
                    base64(
                            "e7c2b3c5c954c035949f1f74e6bce2ed"
                                    + "539a3be267d1481e9ddb178533df4c26"
                                    + "64f69d065c604a4fd953e100b856ad83"
                                    + "804eb3845189babfa5a702090d6fc5fa"));
            assertEquals(
                    "0412e8f78b02c415ab3a288e22897837"
                            + "6f99927767ff37c5718d420010a645a1",
                    HEX.formatHex(output));
        }
    }

    @Test
    void matchesSecondRfc9497P256VoprfBlindingVector() {
        GlobalIdentityVoprfClient client =
                new GlobalIdentityVoprfClient();
        byte[] input = HEX.parseHex(
                "5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a5a");
        byte[] blind = HEX.parseHex(
                "3338fa65ec36e0290022b48eb562889d"
                        + "89dbfa691d1cde91517fa222ed7ad364");

        try (GlobalIdentityVoprfClient.BlindSession session =
                client.blind(input, blind)) {
            assertEquals(
                    base64(
                            "03cd0f033e791c4d79dfa9c6ed750f2a"
                                    + "c009ec46cd4195ca6fd3800d1e9b887dbd"),
                    session.blindedElement());
        }
    }

    @Test
    void rejectsTamperedProofAndConsumesSession() {
        GlobalIdentityVoprfClient client =
                new GlobalIdentityVoprfClient();
        GlobalIdentityVoprfClient.BlindSession session = client.blind(
                HEX.parseHex("00"),
                HEX.parseHex(
                        "3338fa65ec36e0290022b48eb562889d"
                                + "89dbfa691d1cde91517fa222ed7ad364"));
        byte[] proof = HEX.parseHex(
                "e7c2b3c5c954c035949f1f74e6bce2ed"
                        + "539a3be267d1481e9ddb178533df4c26"
                        + "64f69d065c604a4fd953e100b856ad83"
                        + "804eb3845189babfa5a702090d6fc5fa");
        proof[proof.length - 1] ^= 1;
        assertThrows(
                IllegalArgumentException.class,
                () -> client.finish(
                        session,
                        base64(
                                "03e17e70604bcabe198882c0a1f27a92"
                                        + "441e774224ed9c702e51dd17038b102462"),
                        base64(
                                "0209f33cab60cf8fe69239b0afbcfcd2"
                                        + "61af4c1c5632624f2e9ba29b90ae83e4a2"),
                        Base64.getEncoder().encodeToString(proof)));
        assertThrows(
                IllegalStateException.class,
                () -> client.finish(
                        session,
                        "",
                        "",
                        ""));
    }

    private static String base64(String hexadecimal) {
        return Base64.getEncoder().encodeToString(
                HEX.parseHex(hexadecimal));
    }
}

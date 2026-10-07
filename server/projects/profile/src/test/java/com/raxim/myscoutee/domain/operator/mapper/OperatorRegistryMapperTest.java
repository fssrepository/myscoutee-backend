package com.raxim.myscoutee.domain.operator.mapper;

import static org.assertj.core.api.Assertions.assertThat;

import java.lang.reflect.Field;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.data.annotation.Version;
import org.springframework.data.mongodb.core.mapping.Document;

import com.raxim.myscoutee.domain.operator.document.OperatorRegistrySettings;
import com.raxim.myscoutee.domain.operator.dto.OperatorRegistryDtos.CandidateDefaultsDto;
import com.raxim.myscoutee.domain.operator.dto.OperatorRegistryDtos.NodeIdentityDto;
import com.raxim.myscoutee.domain.operator.dto.OperatorRegistryDtos.RegistryOptionDto;
import com.raxim.myscoutee.domain.registry.RegistryProtocol.LeaderboardRow;

@org.junit.jupiter.api.Tag("standard")
class OperatorRegistryMapperTest {
    @Test
    void modelUsesASeparateVersionedSingletonCollection() throws Exception {
        Document document = OperatorRegistrySettings.class.getAnnotation(Document.class);
        Field version = OperatorRegistrySettings.class.getDeclaredField("version");

        assertThat(document.collection()).isEqualTo("operatorRegistrySettings");
        assertThat(version.getAnnotation(Version.class)).isNotNull();
        assertThat(new OperatorRegistrySettings().getId())
                .isEqualTo(OperatorRegistrySettings.SINGLETON_ID);
    }

    @Test
    void statusMappingNeverReturnsInspectionTokenHash() {
        OperatorRegistrySettings settings = new OperatorRegistrySettings();
        OperatorRegistrySettings.DraftInspection draft =
                new OperatorRegistrySettings.DraftInspection();
        draft.setBaseUrl("https://registry.example");
        draft.setRegistryScope("program:one");
        draft.setRegistryKeyId("rkey_test");
        draft.setRegistryPublicKeyFingerprint(
                "sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
        draft.setTokenHash("sha256:secret");
        settings.setDraftInspection(draft);
        OperatorRegistrySettings.RegistrySelection selection =
                new OperatorRegistrySettings.RegistrySelection();
        selection.setBaseUrl("https://registry.example");
        selection.setRegistryScope("program:one");
        selection.setRegistryKeyId("rkey_test");
        selection.setRegistryPublicKeyFingerprint(
                "sha256:aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
        settings.setSelection(selection);

        OperatorRegistryMapper mapper =
                new OperatorRegistryMapper(new OperatorNetworkMapper());
        var status = mapper.toStatus(
                settings,
                "REAL",
                List.of(new RegistryOptionDto(
                        "registry-one",
                        "Registry one",
                        "https://registry.example",
                        "program:one",
                        false)),
                new CandidateDefaultsDto("", ""),
                new NodeIdentityDto("MISSING", null));
        var inspection = mapper.toInspection(draft, "inspection-secret");

        assertThat(status.draftInspection().baseUrl()).isEqualTo("https://registry.example");
        assertThat(status.registryOptions()).hasSize(1);
        assertThat(status.draftInspection().getClass().getRecordComponents())
                .extracting(component -> component.getName())
                .doesNotContain(
                        "token",
                        "tokenHash",
                        "inspectionToken",
                        "registryKeyId",
                        "registryPublicKeyFingerprint");
        assertThat(status.nodeIdentity().getClass().getRecordComponents())
                .extracting(component -> component.getName())
                .doesNotContain("publicKey", "publicKeyFingerprint");
        assertThat(status.selection().registryIdentity().getClass().getRecordComponents())
                .extracting(component -> component.getName())
                .doesNotContain(
                        "registryKeyId",
                        "registryPublicKey",
                        "registryPublicKeyFingerprint");
        assertThat(inspection.registryIdentity().getClass().getRecordComponents())
                .extracting(component -> component.getName())
                .doesNotContain(
                        "registryKeyId",
                        "registryPublicKey",
                        "registryPublicKeyFingerprint");
    }

    @Test
    void registrationMutationCarriesCanonicalUpsertAndNetRowDelta() {
        OperatorRegistryMapper mapper =
                new OperatorRegistryMapper(new OperatorNetworkMapper());
        String deploymentId =
                "dep_0123456789abcdef0123456789abcdef";

        var created = mapper.toRegistrationMutation(
                null,
                deploymentId,
                true);
        var duplicate = mapper.toRegistrationMutation(
                null,
                deploymentId,
                false);
        var failed = mapper.toRegistrationMutation(
                null,
                null,
                false);

        assertThat(created.leaderboardEntry().rowId())
                .isEqualTo(deploymentId);
        assertThat(created.leaderboardEntry().eligibilityStatus())
                .isEqualTo("inactive");
        assertThat(created.leaderboardUpserts())
                .containsExactly(created.leaderboardEntry());
        assertThat(created.removedLeaderboardEntryIds()).isEmpty();
        assertThat(created.leaderboardTotalDelta()).isEqualTo(1);
        assertThat(created.created()).isTrue();

        assertThat(duplicate.leaderboardUpserts())
                .containsExactly(duplicate.leaderboardEntry());
        assertThat(duplicate.leaderboardTotalDelta()).isZero();
        assertThat(duplicate.created()).isFalse();

        assertThat(failed.leaderboardEntry()).isNull();
        assertThat(failed.leaderboardUpserts()).isEmpty();
        assertThat(failed.leaderboardTotalDelta()).isZero();
    }

    @Test
    void disconnectMutationDistinguishesPatchedAndRemovedRows() {
        OperatorRegistryMapper mapper =
                new OperatorRegistryMapper(new OperatorNetworkMapper());
        LeaderboardRow remainingGroup = new LeaderboardRow(
                "opg_0123456789abcdef0123456789abcdef",
                "claimed",
                "opg_0123456789abcdef0123456789abcdef",
                "Example Cooperative",
                "",
                "approved",
                "active",
                1L,
                "9000",
                "1",
                "1",
                "10");

        var patched = mapper.toDisconnectMutation(
                null,
                remainingGroup,
                List.of("dep_0123456789abcdef0123456789abcdef"));
        var removed = mapper.toDisconnectMutation(
                null,
                null,
                List.of(
                        "opg_0123456789abcdef0123456789abcdef",
                        "dep_0123456789abcdef0123456789abcdef"));
        var unchanged = mapper.toDisconnectMutation(
                null,
                null,
                List.of());

        assertThat(patched.leaderboardUpserts())
                .containsExactly(patched.leaderboardEntry());
        assertThat(patched.leaderboardEntry().eligibilityStatus())
                .isEqualTo("active");
        assertThat(patched.removedLeaderboardEntryIds())
                .containsExactly("dep_0123456789abcdef0123456789abcdef");
        assertThat(patched.leaderboardTotalDelta()).isZero();

        assertThat(removed.leaderboardUpserts()).isEmpty();
        assertThat(removed.removedLeaderboardEntryIds())
                .containsExactly(
                        "opg_0123456789abcdef0123456789abcdef",
                        "dep_0123456789abcdef0123456789abcdef");
        assertThat(removed.leaderboardTotalDelta()).isEqualTo(-1);

        assertThat(unchanged.leaderboardUpserts()).isEmpty();
        assertThat(unchanged.removedLeaderboardEntryIds()).isEmpty();
        assertThat(unchanged.leaderboardTotalDelta()).isZero();
    }
}

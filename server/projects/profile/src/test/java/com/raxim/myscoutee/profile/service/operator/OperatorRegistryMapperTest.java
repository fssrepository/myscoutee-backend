package com.raxim.myscoutee.profile.service.operator;

import static org.assertj.core.api.Assertions.assertThat;

import java.lang.reflect.Field;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.data.annotation.Version;
import org.springframework.data.mongodb.core.mapping.Document;

import com.raxim.myscoutee.profile.data.document.OperatorRegistrySettings;
import com.raxim.myscoutee.profile.data.dto.operator.OperatorRegistryDtos.CandidateDefaultsDto;
import com.raxim.myscoutee.profile.data.dto.operator.OperatorRegistryDtos.NodeIdentityDto;
import com.raxim.myscoutee.profile.data.dto.operator.OperatorRegistryDtos.RegistryOptionDto;

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
}

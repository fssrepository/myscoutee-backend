package com.raxim.myscoutee.profile.service.operator;

import static org.assertj.core.api.Assertions.assertThat;

import java.lang.reflect.Field;

import org.junit.jupiter.api.Test;
import org.springframework.data.annotation.Version;
import org.springframework.data.mongodb.core.mapping.Document;

import com.raxim.myscoutee.profile.data.document.OperatorRegistrySettings;
import com.raxim.myscoutee.profile.data.dto.operator.OperatorRegistryDtos.CandidateDefaultsDto;
import com.raxim.myscoutee.profile.data.dto.operator.OperatorRegistryDtos.NodeIdentityDto;

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

        var status = new OperatorRegistryMapper().toStatus(
                settings,
                "REAL",
                false,
                new CandidateDefaultsDto("", ""),
                new NodeIdentityDto("MISSING", null, null));

        assertThat(status.draftInspection().baseUrl()).isEqualTo("https://registry.example");
        assertThat(status.draftInspection().getClass().getRecordComponents())
                .extracting(component -> component.getName())
                .doesNotContain("token", "tokenHash", "inspectionToken");
    }
}

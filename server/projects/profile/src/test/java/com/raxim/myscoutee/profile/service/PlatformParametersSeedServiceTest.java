package com.raxim.myscoutee.profile.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.raxim.myscoutee.common.config.mongo.MongoSessionMode;
import com.raxim.myscoutee.common.config.mongo.MongoSessionModeContext;
import com.raxim.myscoutee.profile.data.document.AffinityConfig;
import com.raxim.myscoutee.profile.repository.AffinityConfigsRepository;

import tools.jackson.databind.ObjectMapper;
import tools.jackson.databind.json.JsonMapper;

@ExtendWith(MockitoExtension.class)
class PlatformParametersSeedServiceTest {
    @Mock
    private AffinityConfigsRepository affinityConfigsRepository;

    @AfterEach
    void clearMongoMode() {
        MongoSessionModeContext.clear();
    }

    @Test
    void seedsProductionV1AndDemoHistoryWhenMissing() {
        List<SavedConfig> savedConfigs = new ArrayList<>();
        when(affinityConfigsRepository.findFirstByKeyOrderByVersionDesc("default")).thenReturn(Optional.empty());
        when(affinityConfigsRepository.findByKeyOrderByVersionDesc("default")).thenReturn(List.of());
        when(affinityConfigsRepository.save(any(AffinityConfig.class))).thenAnswer(invocation -> {
            AffinityConfig config = invocation.getArgument(0);
            savedConfigs.add(new SavedConfig(MongoSessionModeContext.currentMode(), config));
            return config;
        });

        service().run(null);

        List<AffinityConfig> productionConfigs = savedConfigs.stream()
                .filter(saved -> saved.mode() == MongoSessionMode.REAL)
                .map(SavedConfig::config)
                .toList();
        List<AffinityConfig> demoConfigs = savedConfigs.stream()
                .filter(saved -> saved.mode() == MongoSessionMode.DEMO)
                .map(SavedConfig::config)
                .toList();
        assertThat(productionConfigs)
                .extracting(AffinityConfig::getVersion)
                .containsExactly(1);
        assertThat(productionConfigs.getFirst().getChangeSummary())
                .isEqualTo("Initial platform parameter defaults.");
        assertThat(productionConfigs.getFirst().getActive()).isTrue();

        assertThat(demoConfigs)
                .extracting(AffinityConfig::getVersion)
                .containsExactly(1, 2, 3, 4, 5);
        assertThat(demoConfigs)
                .extracting(AffinityConfig::getChangedSection)
                .containsExactly("seed", "profile", "matching", "events", "assets");
        assertThat(demoConfigs.subList(0, 4))
                .allSatisfy(config -> assertThat(config.getActive()).isFalse());
        assertThat(demoConfigs.getLast().getActive()).isTrue();
    }

    @Test
    void leavesExistingProductionAndDemoVersionsUntouched() {
        AffinityConfig existing = AffinityConfig.defaults();
        existing.setVersion(2);
        when(affinityConfigsRepository.findFirstByKeyOrderByVersionDesc("default")).thenReturn(Optional.of(existing));
        when(affinityConfigsRepository.findByKeyOrderByVersionDesc("default")).thenReturn(List.of(existing));

        service().run(null);

        verify(affinityConfigsRepository, org.mockito.Mockito.never()).save(any(AffinityConfig.class));
    }

    private PlatformParametersSeedService service() {
        ObjectMapper objectMapper = JsonMapper.builder().build();
        return new PlatformParametersSeedService(affinityConfigsRepository, objectMapper);
    }

    private record SavedConfig(MongoSessionMode mode, AffinityConfig config) {
    }
}

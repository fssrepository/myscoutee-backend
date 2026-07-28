package com.raxim.myscoutee.profile.service.operator;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;

import org.junit.jupiter.api.Test;
import org.springframework.data.mongodb.core.mapping.Document;

import com.raxim.myscoutee.profile.data.document.OperatorRegistryEndpoint;
import com.raxim.myscoutee.profile.data.document.OperatorRegistrySettings;
import com.raxim.myscoutee.profile.repository.OperatorRegistryEndpointRepository;

class OperatorRegistryEndpointServiceTest {
    @Test
    void returnsEnabledSeededEndpointsInRepositoryOrderAndMarksTheSelection() {
        OperatorRegistryEndpointRepository repository =
                mock(OperatorRegistryEndpointRepository.class);
        OperatorRegistryEndpoint first =
                endpoint("registry-one", "Registry one", "https://one.example", "program:one");
        OperatorRegistryEndpoint second =
                endpoint("registry-two", "Registry two", "https://two.example", "program:two");
        when(repository.findByEnabledTrueOrderBySortOrderAscLabelAscIdAsc())
                .thenReturn(List.of(first, second));
        OperatorRegistrySettings.RegistrySelection selection =
                new OperatorRegistrySettings.RegistrySelection();
        selection.setBaseUrl("https://two.example");
        selection.setRegistryScope("program:two");
        OperatorRegistryEndpointService service = new OperatorRegistryEndpointService(
                repository,
                new OperatorRegistryEndpointMapper());

        var options = service.options(selection);

        assertThat(options).extracting(option -> option.id())
                .containsExactly("registry-one", "registry-two");
        assertThat(options).extracting(option -> option.selected())
                .containsExactly(false, true);
        verify(repository).findByEnabledTrueOrderBySortOrderAscLabelAscIdAsc();
    }

    @Test
    void endpointCatalogUsesItsOwnMongoCollection() {
        Document document = OperatorRegistryEndpoint.class.getAnnotation(Document.class);

        assertThat(document).isNotNull();
        assertThat(document.collection()).isEqualTo("operatorRegistryEndpoints");
    }

    private OperatorRegistryEndpoint endpoint(
            String id,
            String label,
            String baseUrl,
            String registryScope) {
        OperatorRegistryEndpoint endpoint = new OperatorRegistryEndpoint();
        endpoint.setId(id);
        endpoint.setLabel(label);
        endpoint.setBaseUrl(baseUrl);
        endpoint.setRegistryScope(registryScope);
        endpoint.setEnabled(true);
        endpoint.setSortOrder(10);
        return endpoint;
    }
}

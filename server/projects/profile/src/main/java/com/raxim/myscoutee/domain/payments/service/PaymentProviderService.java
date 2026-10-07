package com.raxim.myscoutee.domain.payments.service;

import com.raxim.myscoutee.domain.payments.mapper.PaymentProviderMapper;

import java.util.List;
import java.util.Locale;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.raxim.myscoutee.domain.operator.dto.OperatorConfigurationDtos.PaymentProviderDto;
import com.raxim.myscoutee.domain.payments.repository.PaymentProviderRepository;
import com.raxim.myscoutee.domain.payments.service.PaymentProcessor;

@Service
public class PaymentProviderService implements com.raxim.myscoutee.domain.payments.api.PaymentProviders {
    private final PaymentProviderRepository repository;
    private final PaymentProviderMapper mapper;
    private final Set<String> processorIds;

    public PaymentProviderService(
            PaymentProviderRepository repository,
            PaymentProviderMapper mapper,
            List<PaymentProcessor> processors) {
        this.repository = Objects.requireNonNull(repository);
        this.mapper = Objects.requireNonNull(mapper);
        this.processorIds = processors == null
                ? Set.of()
                : processors.stream()
                        .map(PaymentProcessor::getType)
                        .filter(StringUtils::hasText)
                        .map(value -> value.trim().toLowerCase(Locale.ROOT))
                        .collect(Collectors.toUnmodifiableSet());
    }

    public List<PaymentProviderDto> availableProviders() {
        List<PaymentProviderDto> providers =
                repository.findByEnabledTrueOrderBySortOrderAscLabelAscIdAsc().stream()
                        .map(mapper::toDto)
                        .toList();
        providers.forEach(provider -> {
            if (!processorIds.contains(provider.id())) {
                throw new IllegalStateException(
                        "Enabled payment provider '" + provider.id()
                                + "' has no registered PaymentProcessor.");
            }
        });
        Set<String> seededIds = providers.stream()
                .map(PaymentProviderDto::id)
                .collect(Collectors.toUnmodifiableSet());
        Set<String> missingSeeds = processorIds.stream()
                .filter(id -> !seededIds.contains(id))
                .collect(Collectors.toUnmodifiableSet());
        if (!missingSeeds.isEmpty()) {
            throw new IllegalStateException(
                    "Registered PaymentProcessor implementations are missing from "
                            + "the enabled Mongo payment-provider catalog: "
                            + missingSeeds.stream().sorted().toList() + ".");
        }
        return providers;
    }

    public String requireAvailable(
            String providerId,
            List<PaymentProviderDto> availableProviders) {
        String normalized = normalize(providerId);
        if (!StringUtils.hasText(normalized)) {
            return null;
        }
        boolean available = availableProviders != null
                && availableProviders.stream()
                        .anyMatch(provider -> normalized.equals(provider.id()));
        if (!available) {
            throw new IllegalArgumentException(
                    "Payment provider '" + normalized + "' is not available.");
        }
        return normalized;
    }

    private String normalize(String value) {
        return value == null ? "" : value.trim().toLowerCase(Locale.ROOT);
    }
}

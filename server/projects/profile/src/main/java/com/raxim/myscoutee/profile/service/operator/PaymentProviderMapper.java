package com.raxim.myscoutee.profile.service.operator;

import java.util.Locale;

import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import com.raxim.myscoutee.profile.data.document.PaymentProvider;
import com.raxim.myscoutee.profile.data.dto.operator.OperatorConfigurationDtos.PaymentProviderDto;

@Component
public class PaymentProviderMapper {
    public PaymentProviderDto toDto(PaymentProvider provider) {
        if (provider == null
                || !StringUtils.hasText(provider.getId())
                || !StringUtils.hasText(provider.getLabel())) {
            throw new IllegalStateException(
                    "Payment provider catalog contains an incomplete record.");
        }
        return new PaymentProviderDto(
                provider.getId().trim().toLowerCase(Locale.ROOT),
                provider.getLabel().trim());
    }
}

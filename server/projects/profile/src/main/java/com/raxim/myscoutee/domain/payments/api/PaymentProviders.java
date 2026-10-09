package com.raxim.myscoutee.domain.payments.api;

import java.util.List;
import com.raxim.myscoutee.domain.operator.dto.OperatorConfigurationDtos.PaymentProviderDto;

public interface PaymentProviders {
    List<PaymentProviderDto> availableProviders();
    String requireAvailable(
            String providerId,
            List<PaymentProviderDto> availableProviders);
}

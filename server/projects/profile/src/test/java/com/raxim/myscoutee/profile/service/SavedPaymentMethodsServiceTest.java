package com.raxim.myscoutee.profile.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.Test;

import com.raxim.myscoutee.profile.data.document.SavedPaymentMethod;
import com.raxim.myscoutee.profile.repository.PaymentMethodRegistrationsRepository;
import com.raxim.myscoutee.profile.repository.PaymentsRepository;
import com.raxim.myscoutee.profile.repository.SavedPaymentMethodsRepository;
import com.raxim.myscoutee.profile.repository.UsersRepository;
import com.raxim.myscoutee.profile.service.operator.DeploymentPaymentProviderResolver;

class SavedPaymentMethodsServiceTest {

    @Test
    void deleteKeepsTheTokenizedCardAsInactiveAuditData() {
        SavedPaymentMethodsRepository methods = mock(SavedPaymentMethodsRepository.class);
        SavedPaymentMethod method = new SavedPaymentMethod();
        method.setId("pm-1");
        method.setUserId("user-1");
        method.setStatus("active");
        when(methods.findByIdAndUserId("pm-1", "user-1")).thenReturn(Optional.of(method));

        SavedPaymentMethodsService service = new SavedPaymentMethodsService(
                methods,
                mock(PaymentMethodRegistrationsRepository.class),
                mock(PaymentsRepository.class),
                mock(PaymentSimulatorRegistrationClient.class),
                mock(DeploymentPaymentProviderResolver.class),
                mock(UsersRepository.class));

        service.delete("user-1", "pm-1");

        assertThat(method.getStatus()).isEqualTo("deleted");
        assertThat(method.getUpdatedAtIso()).isNotBlank();
        verify(methods).save(method);
    }
}

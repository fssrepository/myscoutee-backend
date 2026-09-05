package com.raxim.myscoutee.profile.service;

import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.inOrder;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.AfterEach;
import org.mockito.InOrder;

import com.raxim.myscoutee.profile.data.document.SavedPaymentMethod;
import com.raxim.myscoutee.profile.repository.PaymentMethodRegistrationsRepository;
import com.raxim.myscoutee.profile.repository.PaymentsRepository;
import com.raxim.myscoutee.profile.repository.SavedPaymentMethodsRepository;
import com.raxim.myscoutee.profile.repository.UsersRepository;
import com.raxim.myscoutee.profile.service.operator.DeploymentPaymentProviderResolver;
import com.raxim.myscoutee.common.config.mongo.MongoSessionMode;
import com.raxim.myscoutee.common.config.mongo.MongoSessionModeContext;

class SavedPaymentMethodsServiceTest {

    @AfterEach
    void clearMode() {
        MongoSessionModeContext.clear();
    }

    @Test
    void deleteRevokesProviderTokenBeforeKeepingTheCardAsInactiveAuditData() {
        MongoSessionModeContext.set(MongoSessionMode.DEMO);
        SavedPaymentMethodsRepository methods = mock(SavedPaymentMethodsRepository.class);
        PaymentSimulatorRegistrationClient simulator = mock(PaymentSimulatorRegistrationClient.class);
        SavedPaymentMethod method = new SavedPaymentMethod();
        method.setId("pm-1");
        method.setUserId("user-1");
        method.setProvider("stripe");
        method.setProviderPaymentMethodRef("pm-provider-1");
        method.setStatus("active");
        when(methods.findByIdAndUserId("pm-1", "user-1")).thenReturn(Optional.of(method));
        when(methods.markDeleted(org.mockito.ArgumentMatchers.eq("pm-1"), org.mockito.ArgumentMatchers.eq("user-1"), org.mockito.ArgumentMatchers.anyString()))
                .thenReturn(1L);
        when(simulator.isEnabled()).thenReturn(true);

        SavedPaymentMethodsService service = new SavedPaymentMethodsService(
                methods,
                mock(PaymentMethodRegistrationsRepository.class),
                mock(PaymentsRepository.class),
                simulator,
                mock(DeploymentPaymentProviderResolver.class),
                mock(UsersRepository.class));

        service.delete("user-1", "pm-1");

        InOrder deletion = inOrder(simulator, methods);
        deletion.verify(simulator).revoke("stripe", "pm-provider-1");
        deletion.verify(methods).markDeleted(
                org.mockito.ArgumentMatchers.eq("pm-1"),
                org.mockito.ArgumentMatchers.eq("user-1"),
                org.mockito.ArgumentMatchers.anyString());
    }

    @Test
    void providerFailureLeavesTheLocalSavedCardActive() {
        MongoSessionModeContext.set(MongoSessionMode.DEMO);
        SavedPaymentMethodsRepository methods = mock(SavedPaymentMethodsRepository.class);
        PaymentSimulatorRegistrationClient simulator = mock(PaymentSimulatorRegistrationClient.class);
        SavedPaymentMethod method = new SavedPaymentMethod();
        method.setId("pm-1");
        method.setUserId("user-1");
        method.setProvider("stripe");
        method.setProviderPaymentMethodRef("pm-provider-1");
        method.setStatus("active");
        when(methods.findByIdAndUserId("pm-1", "user-1")).thenReturn(Optional.of(method));
        when(simulator.isEnabled()).thenReturn(true);
        org.mockito.Mockito.doThrow(new IllegalStateException("provider unavailable"))
                .when(simulator).revoke("stripe", "pm-provider-1");

        SavedPaymentMethodsService service = new SavedPaymentMethodsService(
                methods,
                mock(PaymentMethodRegistrationsRepository.class),
                mock(PaymentsRepository.class),
                simulator,
                mock(DeploymentPaymentProviderResolver.class),
                mock(UsersRepository.class));

        assertThatThrownBy(() -> service.delete("user-1", "pm-1"))
                .isInstanceOf(IllegalStateException.class);

        verify(methods, never()).markDeleted(
                org.mockito.ArgumentMatchers.anyString(),
                org.mockito.ArgumentMatchers.anyString(),
                org.mockito.ArgumentMatchers.anyString());
    }
}

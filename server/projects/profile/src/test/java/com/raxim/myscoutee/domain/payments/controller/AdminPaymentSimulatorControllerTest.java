package com.raxim.myscoutee.domain.payments.controller;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import com.raxim.myscoutee.domain.accounts.security.firebase.dto.FirebasePrincipal;
import com.raxim.myscoutee.common.config.mongo.MongoSessionMode;
import com.raxim.myscoutee.common.config.mongo.MongoSessionModeContext;
import com.raxim.myscoutee.domain.accounts.document.Users;
import com.raxim.myscoutee.domain.payments.document.Payment;
import com.raxim.myscoutee.domain.accounts.repository.UsersRepository;
import com.raxim.myscoutee.domain.content.service.AdminModerationService;
import com.raxim.myscoutee.domain.payments.service.PaymentSimulatorRegistrationClient;

@org.junit.jupiter.api.Tag("standard")
class AdminPaymentSimulatorControllerTest {
    @AfterEach void cleanup() { SecurityContextHolder.clearContext(); MongoSessionModeContext.clear(); }

    @Test void workAdminUsesStoredAccountIdentityAndSendsOnlySelectedGroupReferences() {
        var client = mock(PaymentSimulatorRegistrationClient.class);
        var moderation = mock(AdminModerationService.class);
        var mongo = mock(MongoTemplate.class);
        var users = mock(UsersRepository.class);
        var profile = new Users(); profile.setUserId("work-admin"); profile.setAccountUserId("admin-demo-ava");
        when(users.findByUserId("work-admin")).thenReturn(Optional.of(profile));
        when(moderation.baseGroupId("work-admin")).thenReturn("myscoutee-work");
        var member = new Users(); member.setUserId("work-member");
        when(mongo.find(any(Query.class), eq(Users.class))).thenReturn(List.of(member));
        var payment = new Payment(); payment.setCheckoutSessionId("pay_work");
        when(mongo.find(any(Query.class), eq(Payment.class))).thenReturn(List.of(payment));
        SecurityContextHolder.getContext().setAuthentication(new UsernamePasswordAuthenticationToken(
                new FirebasePrincipal("work-admin", null, "DEMO", profile), null, List.of()));
        MongoSessionModeContext.set(MongoSessionMode.DEMO);
        var profiles = new com.raxim.myscoutee.domain.accounts.service.ProfileDirectoryService(users);
        org.springframework.test.util.ReflectionTestUtils.setField(profiles, "mongo", mongo);
        new AdminPaymentSimulatorController(client, moderation, mongo, profiles).createAuthorizationAccess();
        var scope = ArgumentCaptor.forClass(PaymentSimulatorRegistrationClient.AuthorizationScope.class);
        verify(client).createAuthorizationAccess(scope.capture());
        assertThat(scope.getValue().baseGroupId()).isEqualTo("myscoutee-work");
        assertThat(scope.getValue().userReferences()).containsExactly("work-member");
        assertThat(scope.getValue().paymentReferences()).containsExactly("myscoutee:pay_work");
        var query = ArgumentCaptor.forClass(Query.class);
        verify(mongo).find(query.capture(), eq(Users.class));
        assertThat(query.getValue().getQueryObject()).containsEntry("workspaceGroupId", "myscoutee-work");
    }
}

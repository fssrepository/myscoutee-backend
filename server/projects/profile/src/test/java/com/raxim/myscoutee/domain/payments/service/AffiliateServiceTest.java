package com.raxim.myscoutee.domain.payments.service;

import com.raxim.myscoutee.domain.accounts.document.Users;
import com.raxim.myscoutee.domain.payments.document.AffiliateLink;
import com.raxim.myscoutee.domain.payments.dto.AffiliateRegistration;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.FindAndModifyOptions;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;


@org.junit.jupiter.api.Tag("standard")
class AffiliateServiceTest {
    private final MongoTemplate mongo = mock(MongoTemplate.class);
    private final AffiliateService service = new AffiliateService(mongo);
    private static final String CODE = "00000000-0000-4000-8000-000000000001";

    @org.junit.jupiter.api.BeforeEach void owners() {
        var profiles = new com.raxim.myscoutee.domain.accounts.service.ProfileDirectoryService(null);
        org.springframework.test.util.ReflectionTestUtils.setField(profiles, "mongo", mongo);
        org.springframework.test.util.ReflectionTestUtils.setField(service, "profiles", profiles);
    }
    @Test
    void settingsReturnsStablePublicLinkAndOwnerScopedCount() {
        when(mongo.findAndModify(any(Query.class), any(Update.class), any(FindAndModifyOptions.class), eq(AffiliateLink.class)))
                .thenReturn(new AffiliateLink("owner", CODE, "2026-09-22T00:00:00Z"));
        when(mongo.count(any(Query.class), eq(AffiliateRegistration.class), eq("affiliateRegistrations"))).thenReturn(2L);
        var result = service.summary("owner");
        assertThat(result.url()).isEqualTo("/entry?affiliate=" + CODE);
        assertThat(result.registered()).isEqualTo(2);
        var query = ArgumentCaptor.forClass(Query.class);
        verify(mongo).count(query.capture(), eq(AffiliateRegistration.class), eq("affiliateRegistrations"));
        assertThat(query.getValue().getQueryObject().getString("referrerUserId")).isEqualTo("owner");
    }

    @Test
    void invalidMissingOrSelfReferralCannotProduceAttribution() {
        assertThat(service.resolveRegistration(null, "member")).isNull();
        assertThat(service.resolveRegistration("invalid", "member")).isNull();
        verifyNoInteractions(mongo);
        when(mongo.findOne(any(Query.class), eq(AffiliateLink.class))).thenReturn(null);
        assertThat(service.resolveRegistration(CODE, "member")).isNull();
        when(mongo.findOne(any(Query.class), eq(AffiliateLink.class))).thenReturn(new AffiliateLink("member", CODE, "now"));
        assertThat(service.resolveRegistration(CODE, "member")).isNull();
        verify(mongo, never()).exists(any(Query.class), eq(Users.class));
    }

    @Test
    void deletedOrUnknownInviterDoesNotCount() {
        when(mongo.findOne(any(Query.class), eq(AffiliateLink.class))).thenReturn(new AffiliateLink("owner", CODE, "now"));
        when(mongo.exists(any(Query.class), eq(Users.class))).thenReturn(false);
        assertThat(service.resolveRegistration(CODE, "member")).isNull();
    }

    @Test
    void resolvedRegistrationUsesServerLinkOwnerAndAuditIsInsertOnly() {
        when(mongo.findOne(any(Query.class), eq(AffiliateLink.class))).thenReturn(new AffiliateLink("owner", CODE, "now"));
        when(mongo.exists(any(Query.class), eq(Users.class))).thenReturn(true);
        var registration = service.resolveRegistration(CODE, "member");
        assertThat(registration.referrerUserId()).isEqualTo("owner");
        assertThat(registration.userId()).isEqualTo("member");
        service.recordRegistration(registration);
        service.recordRegistration(registration);
        var update = ArgumentCaptor.forClass(Update.class);
        var query = ArgumentCaptor.forClass(Query.class);
        verify(mongo, times(2)).upsert(query.capture(), update.capture(), eq(AffiliateRegistration.class), eq("affiliateRegistrations"));
        assertThat(query.getAllValues()).allSatisfy(value -> assertThat(value.getQueryObject().getString("_id")).isEqualTo("member"));
        assertThat(update.getAllValues()).allSatisfy(value -> assertThat(value.getUpdateObject().keySet()).containsExactly("$setOnInsert"));
        assertThat(update.getAllValues().get(0).getUpdateObject()).isEqualTo(update.getAllValues().get(1).getUpdateObject());
    }
}

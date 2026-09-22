package com.raxim.myscoutee.profile.service.email;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import org.bson.Document;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Query;
import com.raxim.myscoutee.common.config.mongo.ScheduledMongoSessionRunner;
import com.raxim.myscoutee.profile.data.document.Users;
import com.raxim.myscoutee.profile.data.dto.shared.I18nBundleResponseDto;
import com.raxim.myscoutee.profile.service.I18nService;
import com.raxim.myscoutee.profile.service.PlatformParametersService;
import com.raxim.myscoutee.profile.service.notifications.NotificationRuleRegistryService;
import com.raxim.myscoutee.profile.service.operator.OperatorEmailConfigurationService;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
class DeletedAccountWarningWorkerTest {
    final MongoTemplate mongo = mock(MongoTemplate.class);
    final PlatformParametersService parameters = mock(PlatformParametersService.class);
    final OperatorEmailConfigurationService email = mock(OperatorEmailConfigurationService.class);
    final I18nService i18n = mock(I18nService.class);
    final DeletedAccountWarningWorker worker = new DeletedAccountWarningWorker(mongo, parameters, email,
            mock(NotificationRuleRegistryService.class), mock(ScheduledMongoSessionRunner.class), i18n, new EmailTemplateRenderer());
    final Instant now = Instant.parse("2026-09-22T12:00:00Z");
    final Users user = new Users();
    @BeforeEach void setup() {
        user.setUserId("deleted-user"); user.setName("Viewer"); user.setEmail("viewer@example.test");
        user.setProfileStatus("deleted"); user.setDeletedAtIso("2026-08-28T12:00:00Z");
        when(email.enabled()).thenReturn(true); when(parameters.accountPurgeWindowDays(30)).thenReturn(30);
        when(i18n.getBundle("en", "en", null)).thenReturn(new I18nBundleResponseDto("en", "1",
                Map.of("account.deletion.warning.subject", "Deletion warning", "account.deletion.warning.body", "Hello {{name}}, deletion on {{purgeAt}}.")));
        when(mongo.find(any(Query.class), eq(Users.class))).thenReturn(List.of(user));
        when(mongo.findOne(any(Query.class), eq(Users.class))).thenReturn(user);
        when(email.send(any())).thenReturn(new EmailSendResult(true, "stub-message", null));
    }
    @Test void selectsOnlyDeletedAccountsWithinFixedFiveDayWindowAndSendsOneReminder() {
        assertEquals(1, worker.deliver(now));
        var query = ArgumentCaptor.forClass(Query.class); verify(mongo).find(query.capture(), eq(Users.class));
        var filter = query.getValue().getQueryObject(); assertEquals("deleted", filter.getString("profileStatus"));
        var dates = (Document) filter.get("deletedAtIso");
        assertEquals("2026-08-23T12:00:00Z", dates.getString("$gt")); assertEquals("2026-08-28T12:00:00Z", dates.getString("$lte"));
        assertEquals(100, query.getValue().getLimit());
        var message = ArgumentCaptor.forClass(EmailSendRequest.class); verify(email).send(message.capture());
        assertEquals("viewer@example.test", message.getValue().toEmail());
        assertTrue(message.getValue().textBody().contains("2026-09-27T12:00:00Z"));
    }
    @Test void repeatedJobDoesNotSendAnAlreadyClaimedEpisode() {
        when(mongo.findById(anyString(), eq(Document.class), eq("accountDeletionWarnings"))).thenReturn(new Document("status", "sent"));
        assertEquals(0, worker.deliver(now)); verify(email, never()).send(any());
    }
    @Test void restoredAccountIsRecheckedBeforeSending() {
        when(mongo.findOne(any(Query.class), eq(Users.class))).thenReturn(null);
        assertEquals(0, worker.deliver(now)); verify(email, never()).send(any());
    }
    @Test void disabledProviderLeavesCandidatesUntouched() {
        when(email.enabled()).thenReturn(false); assertEquals(0, worker.deliver(now)); verifyNoInteractions(mongo);
    }
    @Test void failedDeliveryFailsJobRatherThanRecordingSuccess() {
        when(email.send(any())).thenReturn(new EmailSendResult(false, null, "unauthorized"));
        assertThrows(IllegalStateException.class, () -> worker.deliver(now));
        verify(email, times(1)).send(any());
    }
}

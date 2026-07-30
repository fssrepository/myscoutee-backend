package com.raxim.myscoutee.profile.service.email;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Query;

import com.raxim.myscoutee.common.config.properties.EmailProperties;
import com.raxim.myscoutee.profile.data.document.EmailOutboxItem;
import com.raxim.myscoutee.profile.repository.EmailOutboxRepository;

class PromotionalEmailDeliveryProcessorTest {
    @Test
    void usesTheSnapshottedDeploymentNameAsSenderName() {
        EmailProperties properties = new EmailProperties();
        properties.setEnabled(true);
        properties.setFromEmail("no-reply@example.test");
        properties.setFromName("MyScoutee");
        EmailOutboxRepository repository =
                org.mockito.Mockito.mock(EmailOutboxRepository.class);
        MongoTemplate mongoTemplate =
                org.mockito.Mockito.mock(MongoTemplate.class);
        EmailProviderGateway gateway =
                org.mockito.Mockito.mock(EmailProviderGateway.class);
        EmailOutboxItem item = new EmailOutboxItem();
        item.setRecipientEmail("ada@example.test");
        item.setRecipientName("Ada");
        item.setSubject("A deployment message");
        item.setHtmlBody("<p>Hello</p>");
        item.setTextBody("Hello");
        item.setCategory("event");
        item.setRuleKey("event-rule");
        item.setTemplateKey("event-template");
        item.setUserId("user-1");
        item.setTemplateVariables(Map.of(
                "product_name",
                "Community Hub"));
        when(mongoTemplate.find(
                any(Query.class),
                eq(EmailOutboxItem.class)))
                .thenReturn(List.of(item));
        when(gateway.send(any(EmailSendRequest.class)))
                .thenReturn(new EmailSendResult(
                        true,
                        "message-1",
                        null));
        when(gateway.currentProviderKey()).thenReturn("sendgrid");
        PromotionalEmailDeliveryProcessor processor =
                new PromotionalEmailDeliveryProcessor(
                        properties,
                        repository,
                        mongoTemplate,
                        gateway);

        int sent = processor.processPendingDeliveries();

        assertThat(sent).isEqualTo(1);
        ArgumentCaptor<EmailSendRequest> request =
                ArgumentCaptor.forClass(EmailSendRequest.class);
        verify(gateway).send(request.capture());
        assertThat(request.getValue().fromName())
                .isEqualTo("Community Hub");
    }
}

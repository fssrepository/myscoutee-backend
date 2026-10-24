package com.raxim.myscoutee.domain.email.service;
import java.util.Map;
import com.raxim.myscoutee.domain.email.document.EmailOutboxItem;
/** Pending content/audit fields; each planner retains recipient, category and provider selection. */
final class EmailOutboxDraft {
    private EmailOutboxDraft() {}
    static void initialize(EmailOutboxItem item, String subject, String htmlBody, String textBody,
            Map<String, String> variables, String nowIso, String updatedBy) {
        item.setStatus(EmailOutboxStatus.PENDING);
        item.setSubject(subject);
        item.setHtmlBody(htmlBody);
        item.setTextBody(textBody);
        item.setTemplateVariables(variables);
        item.setScheduledAt(nowIso);
        item.setAttemptCount(0);
        item.setCreatedDate(nowIso);
        item.setCreatedUser(updatedBy);
        item.setUpdatedDate(nowIso);
        item.setUpdatedUser(updatedBy);
    }
}

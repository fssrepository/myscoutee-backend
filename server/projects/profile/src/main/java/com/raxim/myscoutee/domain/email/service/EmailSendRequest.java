package com.raxim.myscoutee.domain.email.service;

import java.util.Map;

public record EmailSendRequest(
        String toEmail,
        String toName,
        String subject,
        String htmlBody,
        String textBody,
        String fromEmail,
        String fromName,
        String replyTo,
        String category,
        Map<String, String> metadata) {
}

package com.raxim.myscoutee.profile.service.email;

public record EmailSendResult(
        boolean accepted,
        String providerMessageId,
        String errorMessage,
        boolean outcomeUnknown,
        boolean retryable,
        long retryAfterSeconds) {
    public EmailSendResult(boolean accepted, String providerMessageId, String errorMessage) {
        this(accepted, providerMessageId, errorMessage, false, false, 0);
    }

    public static EmailSendResult unknown(String errorMessage) {
        return new EmailSendResult(false, null, errorMessage, true, false, 0);
    }

    public static EmailSendResult retryable(String errorMessage, long retryAfterSeconds) {
        return new EmailSendResult(false, null, errorMessage, false, true, Math.max(0, retryAfterSeconds));
    }
}

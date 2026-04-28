package com.raxim.myscoutee.profile.service.email;

public record EmailSendResult(
        boolean accepted,
        String providerMessageId,
        String errorMessage) {
}

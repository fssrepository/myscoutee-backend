package com.raxim.myscoutee.profile.service.email;

public interface EmailProvider {
    String providerKey();

    EmailSendResult send(EmailSendRequest request);
}

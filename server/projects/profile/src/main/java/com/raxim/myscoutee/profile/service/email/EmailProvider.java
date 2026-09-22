package com.raxim.myscoutee.profile.service.email;

public interface EmailProvider {
    default com.raxim.myscoutee.profile.service.operator.OperatorEmailConfigurationService.Provider configurationDescriptor() { return null; }
    default EmailSendResult sendConfigured(EmailSendRequest request, String credential) { throw new UnsupportedOperationException(); }

    String providerKey();

    EmailSendResult send(EmailSendRequest request);
}

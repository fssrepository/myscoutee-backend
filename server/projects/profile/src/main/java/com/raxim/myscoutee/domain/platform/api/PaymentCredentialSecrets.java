package com.raxim.myscoutee.domain.platform.api;

import com.raxim.myscoutee.domain.platform.dto.EncryptedSecret;

/** Decrypt only an existing payment-provider credential; encryption remains operator-owned. */
public interface PaymentCredentialSecrets {
    String decryptPaymentCredential(String providerId, EncryptedSecret envelope);
}

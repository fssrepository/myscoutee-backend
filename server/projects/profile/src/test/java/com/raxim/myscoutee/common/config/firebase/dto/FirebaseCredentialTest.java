package com.raxim.myscoutee.common.config.firebase.dto;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.Test;

import com.google.firebase.auth.FirebaseToken;

class FirebaseCredentialTest {
    @Test
    void exposesFirebaseEmailVerificationWithoutInferringItFromEmail() {
        FirebaseToken token = mock(FirebaseToken.class);
        when(token.getEmail()).thenReturn("operator@example.test");
        when(token.isEmailVerified()).thenReturn(false, true);
        FirebaseCredential credential = new FirebaseCredential(token);

        assertThat(credential.getEmail())
                .isEqualTo("operator@example.test");
        assertThat(credential.isEmailVerified()).isFalse();
        assertThat(credential.isEmailVerified()).isTrue();
    }
}
